# React conventions

**Status: decided 2026-10-25.** This is the rulebook. Decisions are listed at the end.

Guiding idea: components are like Razor partial views. They get a ViewModel (props) and return markup.
Controllers (routes and hooks) fetch data, hold state and build the ViewModel.

## 1. Folder layout

```
src/
  components/   presentational pieces + types.ts
  routes/       one file per page; wires data to components
  hooks/        useProducts, useDebounce ...
  api/          types.ts, fetch functions
  mappers/      toCardProps(product, index) ...
  lib/          pure helpers: clamp, format, getPageItems
  mocks/        products.json for M1 and /dev/components
  styles/       motion.css (animation only)
  test/         setup, MSW server/handlers, renderWithRouter
```

- Dependency direction: `routes -> hooks, mappers, api, components`. `components` imports only from
  `components`, `lib` and React. Never from `api`, `hooks` or `routes`.
- One component per file, file name = component name (`ProductCard.tsx`). Small private helpers
  (e.g. an icon used once) may live in the same file, unexported.
- **Named exports, no default exports.** Why: the name is the same everywhere, rename and
  auto-import work, and `grep ProductCard` finds everything. Route files too.
- Files: `PascalCase.tsx` for components, `camelCase.ts` for everything else, `useX.ts` for hooks.
- No barrel `index.ts` files (they hide where things come from). Import by full path.

## 2. Props typing

- All shared prop types live in `src/components/types.ts` (spec 7). Components import from there.
  A prop type used by one component only may stay in its file.
- **`interface` for object shapes (props, API data), `type` for unions and aliases.**
  Matches the spec and the TODO 1 wording. Do not argue about it further.
- Name: `<Component>Props`. Always destructure in the parameter list.
- No `React.FC`. Write a plain function with typed props:

```tsx
import type { PriceTagProps } from './types'

export function PriceTag({ price, original, discountLabel }: PriceTagProps) {
  return <p>{price}</p>
}
```

- Children: type as `children: ReactNode` (import `type ReactNode` from `react`) only on wrappers.
- Callbacks: props are `onX` (`onChange`, `onClear`, `onPageChange`), the handlers in the route are
  `handleX`. A callback reports intent with plain values (`onChange(value: string)`), never an event.
- Optional props use `?` and a default in the destructuring (`size = 'md'`). Booleans default to false.
- Props are data the component shows. Do not pass raw API objects: a mapper converts them.

## 3. Presentational vs container

Allowed in `src/components/`: props, plain JS expressions, `useId` (for label/`id` pairs when the
parent did not pass an id), `children`. Nothing that remembers or reacts.

Not allowed (lint-enforced for the first group; reviewed for the rest): `useState`, `useEffect`,
`useReducer`, `useLayoutEffect`, router hooks, `fetch`, `useRef` for logic, `useMemo`/`useCallback`
(not needed), reading `window` or `localStorage`.

Where things live:

| Concern | Lives in |
|---|---|
| Server data (loading / error / data) | `hooks/useProducts.ts`, called from a route |
| URL state (`q`, `page`, `sort`) | route, with `useSearchParams` |
| Typing in the search box | route (`useState`), debounced into the URL |
| Mapping API -> props | `mappers/` |
| Which state to show (skeleton, error, empty, grid) | route, as an explicit `if` chain |

Route skeleton (the "controller"):

```tsx
export function HomePage() {
  const { data, status } = useProducts(params)      // the route's hook
  if (status === 'loading') return <ProductGridSkeleton count={12} />
  if (status === 'error') return <ErrorState {...} />
  if (data.length === 0) return <EmptyState {...} />
  return <ProductGrid items={data.map(toCardProps)} />
}
```

Rule: model loading/error/success as one `status` value, not three booleans that can contradict.

Enforced by the lint rule in `.oxlintrc.json` plus `src/test/presentational.test.ts`
(`useRef` is banned too). **One exception:** the image `onError` handler in section 5 may touch the DOM.

## 4. Styling

- Tailwind utility classes in `className`, written in this order so diffs stay readable:
  layout (display, position, grid) -> box (size, spacing) -> typography -> colour -> border ->
  effects/motion -> state variants (`hover:`, `focus-visible:`) -> responsive (`md:`, `lg:`).
- Colours, spacing and fonts come **only from tokens** in `src/index.css` (`bg-surface`,
  `text-text-muted`, `border-border`). **No raw hex, no `[#abc]`, no arbitrary px for colours.**
  Arbitrary sizes (`h-[44px]`) only when the spec gives an exact number with no token.
- **No `cn`/`clsx` helper yet.** Variants are few (button variant/size). Use a lookup object:

```tsx
const variantClass = { primary: 'bg-primary text-on-primary', secondary: 'border border-border', link: 'underline' }
<button className={`h-11 px-5 ${variantClass[variant]}`} />
```

  Revisit if three components need conditional class juggling. Adding `clsx` later is cheap.
- `src/styles/motion.css` holds only animation: `@keyframes`, intro, card reveal, hover zoom,
  skeleton, `prefers-reduced-motion`. Components opt in with a class (`card-reveal`) and pass
  per-item values with a CSS variable: `style={{ '--i': Math.min(index, 11) }}`.
  Every block gets a comment saying what it does and which spec section it comes from.
- No inline `style` except for CSS variables. No CSS modules, no CSS-in-JS.

## 5. Accessibility rules

- Semantic first: `button` for actions, `a`/`Link` for navigation, `ul/li` for lists, `nav`, `main`,
  `header`, `footer`, one `h1` per page, headings never skipped. Never `div onClick`.
- Every input has a visible `<label htmlFor>` tied to `id`. Icon-only buttons have `aria-label`.
- `alt`: product images use `alt={title}`; decorative images `alt=""`. Never "image of".
- Focus ring: global `:focus-visible` style in `index.css`. Never `outline: none` without a
  replacement. Everything usable by keyboard alone (Tab, Enter, Space, arrows on native selects).
- ARIA only when HTML cannot say it: `aria-current="page"`, `aria-busy`, `aria-label` on icon
  buttons and on `nav`s when there is more than one.
- Result count: render `<p aria-live="polite" role="status">` **always** (even when empty) so
  announcements work. Updating text inside it is announced; mounting a new live region is not.
- Contrast and touch targets: 44px minimum for tap targets (spec).
- Reduced motion: handled in CSS (`@media (prefers-reduced-motion: reduce)`), not JS.
- **Image `onError` fallback** (no state allowed). Pick one: **[DECIDE]**
  - **Proposed: a DOM-only handler, no React state.** The component marks the element and CSS does the rest:

```tsx
<img src={src} alt={alt} loading="lazy"
     onError={(e) => { e.currentTarget.dataset.failed = 'true' }} />
/* CSS: img[data-failed='true'] { visibility: hidden }   and the wrapper shows the title initial */
```

    It is one line, has no hook, and keeps the lint rule meaningful (the rule is about React
    state). Caveat: it mutates the DOM directly, so keep it to this one pattern.
  - Alternative: parent passes `onImageError(id)`; the route holds a `Set` of failed ids. More "React",
    but adds state and props to every card for a cosmetic edge case.

## 6. Lists, conditionals, early returns

- `key` = a stable id from the data (`product.id`), **never the array index** unless the list is
  static and never reorders (page numbers are fine; product cards are not). Put `key` on the
  outermost element returned by `map`.
- Map in JSX: `{items.map((item) => <ProductCard key={item.id} {...item} />)}`.
- Conditionals: early `return null`/state components for whole-view cases; `cond && <X />` for
  optional pieces; ternary for either/or. Never `count && <X />` (renders `0`); write `count > 0 && ...`.
- Avoid nested ternaries. Pull the branch into a small named component or an `if` before the return.
- Do not store derived values in state (page count, discounted price): compute while rendering.

## 7. Testing UI

Tools: Vitest, React Testing Library, user-event, jest-dom, MSW (set up in `src/test/`).

- One test file next to each file: `ProductCard.tsx` + `ProductCard.test.tsx`.
- Query like a user, in this order: `getByRole` (with `name`) -> `getByLabelText` -> `getByText` ->
  `getByAltText`. `data-testid` only when nothing else works, and say why in a comment.
- Interactions with `const user = userEvent.setup()` and `await user.click(...)`. Never `fireEvent`.
  One exception: events user-event cannot produce, such as an image `error` (`fireEvent.error(img)`). Say why in a comment.
- Use `renderWithRouter` for anything containing a `Link`.
- Assert what the user sees or can do, not class names or implementation. `toBeInTheDocument`,
  `toHaveAccessibleName`, `toHaveAttribute('href', ...)`, `toBeDisabled`.
- Every component test covers:
  1. **Minimal props**: renders, accessible name present, optional pieces absent.
  2. **Maximal props**: every optional prop shows up.
  3. **Each state/variant** it has (disabled, loading, current page, out of stock...).
  4. **Each callback** fires once with the right value (`vi.fn()` and `toHaveBeenCalledWith`).
- Skeleton, EmptyState and ErrorState tests assert the role/text a screen reader gets (`role="status"`,
  `role="alert"`) plus the action button.
- Network: components never fetch, so their tests need no MSW. Hooks and routes that fetch use MSW
  (`server.use(...)` per test for error, empty, slow). Test loading -> success **and** loading -> error.
- No snapshot tests. No mocking of React or the router (use `MemoryRouter`).
- **Tests before code**: a test for an unbuilt feature can ship as `describe.skip`, with a marker above the code:

```ts
// TODO 2: implement formatPrice. Remove .skip below to start.
describe.skip('formatPrice', () => { it('formats USD', () => { expect(formatPrice(9.99)).toBe('$9.99') }) })
```

  `npm run check` stays green while skipped.

## 8. React 19 and React Router 8 notes

- **`ref` is a normal prop in React 19.** No `forwardRef`. Components rarely need refs here anyway.
- `useId` for generated ids. `import type` for type-only imports (TS 6 `verbatimModuleSyntax` friendly).
- React Router declarative mode: `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Link>`, `useSearchParams`.
  No loaders/actions (those are data mode). Import everything from `'react-router'` (not `-dom`).
- Page transitions: `<Link viewTransition>` turns on the browser View Transitions API for that
  navigation; style with `view-transition-name` in CSS. Only M4 needs it. The user must still
  have a no-motion path (reduced-motion CSS).
- Search params: always a string or null. Parse and validate in the route (`Number(x)`, whitelist for
  `sort`), never trust the URL. Update with `setSearchParams` and `replace` for typing, push for page changes.
- Effects are for syncing with the outside world (fetch, timers, listeners). Always return a cleanup
  that cancels (`AbortController`) so a slow old response cannot overwrite a newer one. Do not use an effect to
  compute something from props or state.
- Mount-twice in dev (`StrictMode`) is on purpose: it exposes missing cleanup. Do not remove it.
- No `useMemo`/`useCallback`/`memo` until a measured problem. 12 cards do not need it.

## Decisions (2026-10-25)
1. **Image `onError`:** the DOM-only `data-failed` handler plus CSS `[data-failed]`. Key cards by
   `product.id` so a new `src` mounts a fresh `<img>`. This is the only place components touch the DOM.
2. **`clsx`:** skip it; use lookup objects. Revisit when 3 components need conditional classes.
3. **Hooks in components:** `useId` allowed; `useRef` not allowed. `useMemo`, `useCallback` and
   `memo` are decided case by case in review.
4. **Exports:** named exports only, route files included.
5. **Enforcement:** lint `importNames` and the scan test both include `useRef`.
