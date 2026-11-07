# Decisions

Technical decisions, newest first. Each one says what was decided, why, and what else was considered.

## 2026-11-07: security headers

`vercel.json` sets a Content-Security-Policy, `X-Content-Type-Options` and `Referrer-Policy` on all routes.
- **Why:** only same-origin scripts and styles can run; the API and images are limited to DummyJSON hosts.
- **Not added:** `X-Frame-Options`, `Permissions-Policy`, explicit `style-src`, `report-to`.
- **Limit:** the policy only applies on Vercel, so it is checked in the browser on the live site.

## 2026-11-03: v0.1 ships unfinished features as visibly unfinished

The site goes live after M2 as v0.1, before search, filters and product pages exist.
- **Toolbar:** visible but disabled, with a "coming soon" note. Each control gets a `disabled` prop inside
  `<fieldset aria-label aria-describedby>`. Why: explicit, reused by the component showcase, and M3 removes the props one
  control at a time. Alternatives: `<fieldset disabled>`, `inert`, hiding the toolbar.
- **Cards are not links** until product pages exist (M4): `linked?: boolean` on ProductCard/ProductGrid, default
  true. Why: a link to a not-found page is worse than no link. Alternative: a placeholder page.
- **Pagination hidden** until M3. Why: pages 2+ would show page 1 again.
- **CategoryFilter splits `disabled` from `loading`:** `disabled` keeps the options; `loading` disables and shows
  "Loading…". Why: a prop should mean one thing.
- **`/dev/components` only in development** (`import.meta.env.DEV`), so the production bundle drops the showcase
  (~10 kB). Tested with `vi.stubEnv`. Alternatives: a lazy route, a separate entry point.

## 2026-11-01: live products (M2)

- **Hand-written data hook.** `useProducts` uses `useEffect` + `AbortController` + a retry counter in the dependency
  array. Why: full control over effects, cleanup and race conditions. Alternatives: TanStack Query or SWR
  (reconsider after M4).
- **Error contract.** `getProducts` throws `ApiError(status)` for non-OK answers and lets network `TypeError`s and
  `AbortError`s pass through. `useProducts` ignores `AbortError` and turns everything else into `status: 'error'`.
  The UI always shows a fixed, friendly message, never `error.message`. Why: technical text is useless to users and
  can leak details. Alternative: different copy per error type via `instanceof ApiError`.
- **Focus after a retry.** The page keeps the previous `isRetrying` value in a ref and focuses the visually hidden
  `<h2 tabIndex={-1}>` only on the retrying-to-success transition. Why: the focused button disappears with the
  alert, and focusing on every success would steal focus on first load.
- **`ResultCount`** is hidden in the error state and shows "Loading…" while loading. Why: a false "0 products"
  next to an error misleads users.
- **Full products, no `select=`.** `/products?limit=0` returns all 194 products (~306 KB). Acceptable for now;
  revisit if load time matters.
- **API states in tests** use MSW override helpers in `src/test/handlers.ts` (`productsError`,
  `productsNetworkError`, `productsEmpty`, `productsSlow`, each with `{ once }`). Each hook test was run against
  deliberately broken versions to prove it can fail; the StrictMode test records every state, so a brief "error"
  flash from a cancelled request fails it.

## 2026-10-26: static catalog (M1)

- One `Product` type with only `brand` optional; no `Partial`/`Pick` until a real need appears.
- Discount label: one decimal under 1%, no badge when the shown value rounds to 0. No guards for negative or >100%
  discounts in `discountedPrice`; the mapper shows a discount only when the rounded percent is above 0.
- A loading submit `Button` uses `aria-disabled` and must not submit its form. Why: prevents double submits without
  losing keyboard focus (which `disabled` would).
- `src/test/presentational.test.ts` reads `src/components/` from disk on every run and fails if it finds no
  components. Why: an earlier `import.meta.glob` version was cached while the folder was empty and silently
  checked nothing.

## 2026-10-25: React conventions

Full rules in `docs/react-conventions.md`.
- Image `onError`: a DOM-only `data-failed` handler plus CSS; cards keyed by `product.id`.
- No `clsx` yet (lookup objects); `useId` allowed, `useRef` banned in components; named exports only.
- Why: keeps components stateless and easy to explain. Alternatives: an `onImageError(id)` callback; `clsx` up front.

## 2026-10-25: tooling

| Area | Choice | Version |
|---|---|---|
| Build / dev server | Vite | 8.3 |
| UI | React | 19.3 |
| Language | TypeScript | 6.0 |
| Routing | React Router, declarative mode (`<BrowserRouter>`, `<Routes>`) | 8.5 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`; tokens in `src/index.css` | 4.3 |
| Fonts | `@fontsource/instrument-sans` (400/500/600), `@fontsource/instrument-serif` (400), self-hosted | 5.3 |
| Tests | Vitest + jsdom + React Testing Library + user-event + jest-dom | Vitest 5 |
| API mocking | MSW (`src/test/server.ts`); unhandled requests fail the test | 3.0 |
| Lint | oxlint with react, typescript, jsx-a11y and vitest plugins | 1.89 |

`npm run check` = `tsc -b` → `oxlint --deny-warnings` → `vitest run` → `vite build`. CI runs the same command.

- **oxlint instead of ESLint.** The Vite React template default: fast, with react-hooks and jsx-a11y rules built
  in. The namespace-import gap is covered by `src/test/presentational.test.ts`. Alternative: ESLint with
  typescript-eslint.
- **Presentational components are enforced by lint:** files in `src/components/` may not import `useState`,
  `useEffect`, `useReducer`, `useLayoutEffect`, `useRef`, `useSearchParams`, `useNavigate` or `useLoaderData`.
- **`vitest/no-disabled-tests` is off** so tests for unbuilt features can ship as `describe.skip`.
- Verified: a type error, a lint error, a failing test, a `useState` import in `src/components/` and an unmocked
  network request each make the check fail.
- Follow-up: pin GitHub Actions to commit SHAs.
