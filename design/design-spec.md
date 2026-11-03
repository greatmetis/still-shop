# Product Shop: design spec and hand-off

Status: **approved on 2026-10-25, with all proposed defaults (D1–D8)**
Companion file: `design/wireframes.html` (open it in a browser: every screen and state, mobile + desktop, live intro and hover demos, light/dark toggle).

Direction: calm, near-monochrome, lots of white space, a serif for display and a clean sans for UI. Product photos carry the colour. One slow, soft easing for big moves, the same curve at short durations for small UI. Inspired by the studio-onto.com *approach*; no logo, layout or content is copied.

---

## 0. Assumptions and proposed decisions

| # | Item | Proposal | Why |
|---|---|---|---|
| D1 | Shop name / wordmark | **"Still."** set in the serif. The full stop is a real CSS circle, and it is the shape the intro grows from. | Short, calm, fits the quiet style, and the dot gives the intro a story ("a shape turns into the wordmark"). Alternatives: "Kept.", "Plain Goods". |
| D2 | Routes | `/` = home hero + catalog (filters in the URL), `/product/:id` = detail, `*` = not found. | One page for browsing keeps the URL as the single source of truth. |
| D3 | Intro plays | Once per browser session on `/` (component prop `playIntro`; decided with `sessionStorage`). Never on filter/page changes. | A 2.4 s intro is charming once and annoying every time. |
| D4 | Page size | **12 products per page.** | Divides evenly into 2, 3 and 4 columns, so no ragged last row on full pages. |
| D5 | Category control | Native `<select>` (styled), not chips. | DummyJSON has ~24 categories; chips would wrap into a wall. A native select is accessible on every device for free. |
| D6 | Dark mode | Follows the OS (`prefers-color-scheme`), no toggle in v1. | Zero logic; a toggle can come later. |
| D7 | Data formatting | Components receive **pre-formatted strings** for prices and dates (`"$9.99"`, `"Oct 25, 2026"`). The `toCardProps()` mapper formats them with `Intl`. | Keeps components dumb and puts the money maths (and its tests) in one tested mapper. |
| D8 | Fonts | Instrument Sans (for Saans) + Instrument Serif (for TimesNow), self-hosted with `@fontsource`. | Free, close in feel, and self-hosting avoids a third-party request. |

---

## 1. Colour tokens

Semantic names only; components never use raw hex.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#0E0E0D` | Page background |
| `surface` | `#F5F4F1` | `#1A1A18` | Image wells, skeletons, hover fill |
| `surface-sunken` | `#ECEAE6` | `#252523` | Placeholder image block, pressed thumb |
| `text` | `#111111` | `#F2F1EE` | Body and headings |
| `text-muted` | `#6B6B6B` | `#9C9A95` | Secondary text, captions, struck-through price |
| `line` | `#BDBBB6` | `#3A3936` | Decorative dividers only (not for control borders) |
| `border` | `#8A8782` | `#75736E` | Input / select / secondary button borders (meets 3:1 non-text) |
| `primary` | `#111111` | `#F2F1EE` | Primary button fill, current page, discount badge fill |
| `primary-hover` | `#333333` | `#D9D7D2` | Primary button hover |
| `on-primary` | `#FFFFFF` | `#0E0E0D` | Text on primary |
| `focus` | `#111111` | `#F2F1EE` | Focus ring |
| `success` | `#2F6B3A` | `#7FC48D` | "In stock" text |
| `warning` | `#8A5A00` | `#E0B460` | "Low stock" text |
| `danger` | `#B42318` | `#FF8A80` | "Out of stock", error text |
| `star` | `#111111` | `#F2F1EE` | Filled star |
| `star-empty` | `#BDBBB6` | `#3A3936` | Empty star (decorative; number is always shown as text) |
| `overlay` | `rgba(17,17,17,0.04)` | `rgba(242,241,238,0.06)` | Card image hover tint |

Note: the reference uses `#A9A9A9` for secondary text. That is only **2.35:1** on white and fails AA, so `text-muted` is darkened to `#6B6B6B`. The warm grey `#BDBBB6` is kept, but only for decorative lines.

### Contrast (WCAG 2.2, computed with the relative-luminance formula)

| Pair | Light | Dark | Needed | Result |
|---|---|---|---|---|
| `text` on `bg` | 18.9:1 | 17.1:1 | 4.5 | Pass AAA |
| `text` on `surface` | 17.2:1 | 15.4:1 | 4.5 | Pass AAA |
| `text-muted` on `bg` | 5.33:1 | 6.87:1 | 4.5 | Pass AA |
| `text-muted` on `surface` | 4.84:1 | 6.20:1 | 4.5 | Pass AA |
| `on-primary` on `primary` (button, badge, current page) | 18.9:1 | 17.1:1 | 4.5 | Pass AAA |
| `on-primary` on `primary-hover` | 12.6:1 | 13.4:1 | 4.5 | Pass AAA |
| `success` on `bg` | 6.39:1 | 9.37:1 | 4.5 | Pass AA |
| `warning` on `bg` | 5.93:1 | 9.99:1 | 4.5 | Pass AA |
| `danger` on `bg` | 6.57:1 | 8.46:1 | 4.5 | Pass AA |
| `border` vs `bg` (control edges, 1.4.11) | 3.58:1 | 4.08:1 | 3.0 | Pass |
| `focus` ring vs `bg` | 18.9:1 | 17.1:1 | 3.0 | Pass |
| `line` vs `bg` | 1.92:1 | n/a | none (decorative) | OK because it's never the only cue |

Status colours are never the only cue: stock always has a text label ("Low stock: 4 left").

---

## 2. Typography

**Families**
- Serif (display, headings, wordmark): `"Instrument Serif", ui-serif, Georgia, "Times New Roman", Times, serif`. Only weight 400 (and italic) exists. **Never bold the serif.**
- Sans (UI and body): `"Instrument Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Weights used: 400, 500.
- Install: `npm i @fontsource/instrument-serif @fontsource-variable/instrument-sans`, import in `main.tsx`.
- Numbers (prices, counts, pagination): `font-variant-numeric: tabular-nums`.

**Scale** (mobile → desktop at `lg` 1024px; rem at 16px root)

| Level | Family | Mobile size / line-height | Desktop size / line-height | Weight | Tracking |
|---|---|---|---|---|---|
| `display` (hero wordmark) | Serif | 88px (5.5rem) / 0.9 | 176px (11rem) / 0.9 | 400 | -0.02em |
| `h1` (detail title, state titles) | Serif | 36px (2.25rem) / 1.05 | 52px (3.25rem) / 1.05 | 400 | -0.01em |
| `h2` (Reviews, section titles) | Serif | 28px (1.75rem) / 1.1 | 36px (2.25rem) / 1.1 | 400 | -0.01em |
| `h3` (card title, reviewer name) | Sans | 15px (0.9375rem) / 1.35 | 16px (1rem) / 1.35 | 500 | 0 |
| `price-lg` (detail price) | Sans | 24px (1.5rem) / 1.2 | 28px (1.75rem) / 1.2 | 500 | 0 |
| `body` | Sans | 16px (1rem) / 1.55 | 16px / 1.55 | 400 | 0 |
| `small` (meta, controls) | Sans | 14px (0.875rem) / 1.45 | 14px / 1.45 | 400 / 500 | 0 |
| `caption` (labels, badges, eyebrow) | Sans | 12px (0.75rem) / 1.4 | 12px / 1.4 | 500 | 0.06em, UPPERCASE |
| `wordmark-sm` (header) | Serif | 24px (1.5rem) / 1 | 28px (1.75rem) / 1 | 400 | -0.01em |

Body copy max line length: `65ch`.

---

## 3. Spacing, radius, borders, shadow

- **Spacing (4px base)**: `1`=4, `2`=8, `3`=12, `4`=16, `6`=24, `8`=32, `12`=48, `16`=64, `24`=96, `32`=128. (These are Tailwind's default `--spacing: 0.25rem` steps, so `p-4` = 16px.)
- **Radius**: `none` 0 (images, cards, buttons, inputs: the look is square), `sm` 2px (thumb selection ring only), `full` 9999px (wordmark dot, rating badge dot).
- **Border widths**: `hairline` 1px (dividers, inputs), `strong` 2px (focus ring, selected thumb, active input).
- **Shadow**: none in the UI. One exception, `shadow-focus` is not a shadow; focus uses `outline`. (Calm design: hierarchy comes from space and type, not elevation.)

---

## 4. Layout

| | Mobile `<768` | Tablet `md` 768–1023 | Desktop `lg` ≥1024 | Wide `xl` ≥1280 |
|---|---|---|---|---|
| Page margin (inline padding) | 20px | 32px | 48px | 48px |
| Layout grid | 4 cols | 8 cols | 12 cols | 12 cols |
| Gutter | 16px | 24px | 24px | 24px |
| Product grid columns | 2 | 3 | 4 | 4 |
| Product grid gap (col / row) | 16 / 32 | 24 / 40 | 24 / 48 | 24 / 48 |
| Header height | 56px | 64px | 64px | 64px |

- Breakpoints: Tailwind v4 defaults: `sm` 40rem (640), `md` 48rem (768), `lg` 64rem (1024), `xl` 80rem (1280), `2xl` 96rem (1536). Design is mobile-first.
- Max content width: **1440px**, centred. Reading text max `65ch`.
- Vertical rhythm between page sections: 64px mobile, 96px desktop.

**Home `/`**: Header → Hero (wordmark + tagline, min-height 360px mobile / 520px desktop) → Toolbar (search, category, sort) → ResultCount → ProductGrid → Pagination → Footer.
**Detail `/product/:id`**: Header → BackLink → [Gallery (cols 1–7) | Summary (cols 8–12, `position: sticky; top: 96px`)] → Reviews (cols 1–8) → Footer. Mobile: everything stacks, gallery full-bleed.

---

## 5. Motion

### 5.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--ease-soft` | `cubic-bezier(0.15, 0.9, 0.34, 0.95)` | Everything that moves: reveals, intro, page transition, image zoom, small UI too |
| `--ease-linear` | `linear` | Skeleton pulse only |
| `--duration-slow` | `1400ms` | Intro steps, image reveal, image hover zoom |
| `--duration-page` | `900ms` | New page curtain, shared image morph |
| `--duration-medium` | `600ms` | Content fade-in after loading, gallery image swap |
| `--duration-exit` | `350ms` | Old page fade-out |
| `--duration-fast` | `240ms` | Hover underline, button background, border colour, thumb ring |
| `--duration-instant` | `120ms` | `:active` press feedback |
| `--stagger` | `60ms` | Per-card reveal delay (`--i` × 60ms, `--i` capped at 11) |

Why one curve: the soft curve front-loads almost all movement into the first 30% of its time, so at 240ms it feels snappy, and at 1400ms it feels like a slow glide. Same personality at every size.

### 5.2 Intro: "the dot becomes the wordmark" (total ≈ 2.6s)

Markup (component `Wordmark` with `variant="hero"`):

```html
<h1 class="wordmark" data-intro="true" aria-label="Still">
  <span class="wordmark__track" aria-hidden="true">
    <span class="wordmark__letters">Still</span><span class="wordmark__dot"></span>
  </span>
</h1>
<p class="hero__tagline intro-fade" style="--delay: 2000ms">A quiet catalogue of everyday things.</p>
```

Story: (1) a small dot appears in the centre of the hero and swells into a large circle; (2) it shrinks back to full-stop size; (3) it glides right while the letters are uncovered to its left, as if the dot is pulling the word out; (4) tagline and catalog fade up.

```css
.wordmark { font: 400 var(--text-display)/0.9 var(--font-serif); letter-spacing: -0.02em; text-align: center; }
.wordmark__track { display: inline-flex; align-items: baseline; }
.wordmark__dot {
  width: 0.16em; height: 0.16em; margin-left: 0.03em;
  border-radius: 9999px; background: currentColor;
}

/* Only animate when the intro should play. Natural (non-animated) styles ARE the end state,
   so turning animations off always leaves a correct, finished layout. */
.wordmark[data-intro="true"] .wordmark__dot {
  animation: intro-dot 1200ms var(--ease-soft) 200ms backwards;
}
.wordmark[data-intro="true"] .wordmark__track {
  /* Start with the dot's centre on the hero's centre line:
     shift = -(half the track width) + (half the dot width). % in translate = % of the element's own width. */
  animation: intro-track 1400ms var(--ease-soft) 1000ms backwards;
}
.wordmark[data-intro="true"] .wordmark__letters {
  animation: intro-letters 1400ms var(--ease-soft) 1000ms backwards;
}

@keyframes intro-dot {
  0%   { transform: scale(0); }
  45%  { transform: scale(7); }  /* big circle, ~7 × 0.16em */
  60%  { transform: scale(7); }
  100% { transform: scale(1); }  /* full-stop size */
}
@keyframes intro-track {
  from { transform: translateX(calc(-50% + 0.08em)); }  /* 0.08em = half the 0.16em dot */
  to   { transform: translateX(0); }
}
@keyframes intro-letters {
  from { clip-path: inset(0 0 0 100%); }  /* fully hidden, curtain edge at the dot side */
  to   { clip-path: inset(0 0 0 0); }
}

/* Tagline, toolbar, grid, header wordmark */
.intro-fade { animation: fade-up 1400ms var(--ease-soft) var(--delay, 0ms) backwards; }
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
```

Delays when `playIntro` is true: tagline 2000ms, toolbar 2200ms, grid 2300ms, header small wordmark 2400ms. When `playIntro` is false: no `data-intro`, no `.intro-fade` classes, so the page is still.

Timeline: 0–200 idle · 200–740 dot grows · 740–920 holds · 920–1400 shrinks · 1000–2400 dot glides right + letters revealed · 2000–3400 tagline fades up · 2200+ catalog fades up. Content is interactive throughout (no overlay, nothing blocks clicks).

### 5.3 Page transition: catalog ↔ detail (View Transitions API, CSS only)

Wiring: `<Link to={href} viewTransition>` on ProductCard and BackLink. React Router calls `document.startViewTransition()` for us; unsupported browsers just navigate normally.

```css
/* The header stays put: it gets its own name so it is not part of the root snapshot */
.site-header { view-transition-name: site-header; }

::view-transition-old(root) {
  animation: vt-fade-out var(--duration-exit) var(--ease-soft) both;
}
::view-transition-new(root) {
  animation: vt-curtain-in var(--duration-page) var(--ease-soft) both;
}
@keyframes vt-fade-out {
  to { opacity: 0; transform: translateY(-8px); }
}
@keyframes vt-curtain-in {
  from { clip-path: inset(100% 0 0 0); transform: translateY(24px); }
  to   { clip-path: inset(0 0 0 0);    transform: none; }
}

/* Shared element: the clicked card image morphs into the detail main image.
   Only ONE element on the page may have this name at a time. */
.is-vt-image { view-transition-name: product-image; }
::view-transition-group(product-image) {
  animation-duration: var(--duration-page);
  animation-timing-function: var(--ease-soft);
}
::view-transition-old(product-image),
::view-transition-new(product-image) { animation: none; mix-blend-mode: normal; height: 100%; object-fit: contain; }
```

The `is-vt-image` class is set through the `viewTransitionName` prop on `ProductCard` and `Gallery` (see contracts). The route computes it with React Router's `useViewTransitionState(href)` (true only during the transition to/from that product).

### 5.4 Hover and reveal

```css
/* Card image reveal on mount (staggered) */
.card__media img { animation: reveal-up var(--duration-slow) var(--ease-soft) calc(var(--i, 0) * var(--stagger)) backwards; }
@keyframes reveal-up {
  from { clip-path: inset(100% 0 0 0); transform: scale(1.06); }
  to   { clip-path: inset(0 0 0 0);    transform: scale(1); }
}

/* Card hover / focus-within */
.card__media img { transition: transform var(--duration-slow) var(--ease-soft); }
.card:hover .card__media img,
.card:focus-within .card__media img { transform: scale(1.04); }
.card__title {
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: background-size var(--duration-fast) var(--ease-soft);
}
.card:hover .card__title, .card:focus-within .card__title { background-size: 100% 1px; }
.card:active .card__media { transform: scale(0.99); transition: transform var(--duration-instant) var(--ease-soft); }

/* Skeleton */
.skeleton { background: var(--color-surface); animation: pulse 1400ms var(--ease-linear) infinite alternate; }
@keyframes pulse { from { opacity: 1; } to { opacity: 0.55; } }

/* Loaded content replaces skeletons */
.fade-in { animation: fade-up var(--duration-medium) var(--ease-soft) backwards; }
```

### 5.5 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
  .card:hover .card__media img, .card:focus-within .card__media img { transform: none; }
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
  ::view-transition-group(*) { animation-duration: 1ms; }
  .skeleton { animation: none; }
}
```

Result: intro shows the finished wordmark immediately; pages swap instantly; colour/underline changes still happen (they're not motion). Because every animation uses `backwards` fill and natural styles are the final state, nothing gets stuck hidden.

---

## 6. Tailwind v4 setup (copy into `src/index.css`)

```css
@import "tailwindcss";

:root {
  --bg: #FFFFFF; --surface: #F5F4F1; --surface-sunken: #ECEAE6;
  --text: #111111; --text-muted: #6B6B6B;
  --line: #BDBBB6; --border: #8A8782;
  --primary: #111111; --primary-hover: #333333; --on-primary: #FFFFFF;
  --focus: #111111;
  --success: #2F6B3A; --warning: #8A5A00; --danger: #B42318;
  --star: #111111; --star-empty: #BDBBB6;
  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0E0E0D; --surface: #1A1A18; --surface-sunken: #252523;
    --text: #F2F1EE; --text-muted: #9C9A95;
    --line: #3A3936; --border: #75736E;
    --primary: #F2F1EE; --primary-hover: #D9D7D2; --on-primary: #0E0E0D;
    --focus: #F2F1EE;
    --success: #7FC48D; --warning: #E0B460; --danger: #FF8A80;
    --star: #F2F1EE; --star-empty: #3A3936;
  }
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-sunken: var(--surface-sunken);
  --color-text: var(--text);
  --color-text-muted: var(--text-muted);
  --color-line: var(--line);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-on-primary: var(--on-primary);
  --color-focus: var(--focus);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --color-star: var(--star);
  --color-star-empty: var(--star-empty);
}

@theme {
  --font-sans: "Instrument Sans Variable", "Instrument Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-serif: "Instrument Serif", ui-serif, Georgia, "Times New Roman", Times, serif;

  --text-display: 5.5rem;   --text-display--line-height: 0.9;
  --text-display-lg: 11rem; --text-display-lg--line-height: 0.9;
  --text-h1: 2.25rem;  --text-h1--line-height: 1.05;
  --text-h1-lg: 3.25rem; --text-h1-lg--line-height: 1.05;
  --text-h2: 1.75rem;  --text-h2--line-height: 1.1;
  --text-h2-lg: 2.25rem; --text-h2-lg--line-height: 1.1;
  --text-h3: 0.9375rem; --text-h3--line-height: 1.35;
  --text-price: 1.5rem; --text-price--line-height: 1.2;
  --text-body: 1rem;   --text-body--line-height: 1.55;
  --text-small: 0.875rem; --text-small--line-height: 1.45;
  --text-caption: 0.75rem; --text-caption--line-height: 1.4;

  --radius-sm: 2px;

  --ease-soft: cubic-bezier(0.15, 0.9, 0.34, 0.95);
  --animate-fade-up: fade-up 600ms var(--ease-soft) backwards;
  --animate-pulse-soft: pulse 1400ms linear infinite alternate;

  --container-content: 90rem; /* 1440px → max-w-content */
}

:root {
  --duration-slow: 1400ms; --duration-page: 900ms; --duration-medium: 600ms;
  --duration-exit: 350ms; --duration-fast: 240ms; --duration-instant: 120ms;
  --stagger: 60ms;
}
```

Usage examples: `bg-bg text-text`, `text-text-muted`, `border-border`, `font-serif text-h1 lg:text-h1-lg`, `ease-soft duration-[240ms]`, `max-w-content mx-auto px-5 md:px-8 lg:px-12`.

---

## 7. Component specs and props contracts

Rules for every component:
- **Presentational only**: props in, JSX out. No `useState`, `useEffect`, `fetch`, or URL reading. Callbacks report user intent; the route decides what happens.
- Prices, dates and labels arrive **already formatted** (D7).
- All types go in `src/components/types.ts`. Mappers convert API types to these with `toCardProps()`, `toDetailProps()` and so on.

### 7.0 Shared types

```ts
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export type SortValue =
  | 'default'
  | 'price-asc' | 'price-desc'
  | 'rating-desc' | 'rating-asc'
  | 'title-asc' | 'title-desc';

export interface ImageData { src: string; alt: string; }

/** A button-or-link action. Exactly one of href / onClick. */
export type Action =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never };
```

### 7.1 Button (primitive used by states and toolbar)

`ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'link'; size?: 'md' | 'sm' }` (also a `ButtonLink` with `href` that renders a router `<Link>`).

| | Primary | Secondary | Link |
|---|---|---|---|
| Size | h 44px (md) / 36px (sm, desktop-only), px 20px, `small` 14px/500 | same, 1px `border` | inline, min-h 44px tap area via padding-block 12px |
| Default | bg `primary`, text `on-primary` | transparent, text `text`, 1px `border` | text `text`, underline 1px offset 4px |
| Hover | bg `primary-hover` (240ms) | bg `surface`, border `text` | underline 2px |
| Focus-visible | 2px `focus` outline, 2px offset | same | same |
| Active | `scale(0.98)` 120ms | same | opacity 0.7 |
| Disabled | opacity 0.4, `cursor: not-allowed`, no hover | same | same |
| Loading (`aria-busy`) | label stays, 12px spinner-free "…" suffix; disabled | same | n/a |

### 7.2 Header

```ts
export interface HeaderProps {
  homeHref: string;          // usually "/"
  /** Hide the small wordmark while the hero intro is on screen; it fades in at 2400ms. */
  wordmarkIntro?: boolean;
}
```
- Layout: 3-column grid. Left: "Catalog" link (`small`/500). Centre: wordmark-sm "Still." (link to home, `aria-label="Still, home"`). Right: "Source" link to the GitHub repo (`small`, external, `rel="noopener"`).
- Height 56/64, page margins, 1px `line` bottom border, bg `bg`. Not sticky (calm; avoids covering content). `view-transition-name: site-header`.
- States: links hover → underline 1px (240ms); focus-visible ring; current page link has `aria-current="page"` and is underlined permanently.

### 7.3 SearchBox

```ts
export interface SearchBoxProps {
  id: string;
  label: string;            // "Search products"
  value: string;            // what the user is typing (the route keeps it in state, debounces to the URL)
  placeholder?: string;     // "Search by name"
  onChange: (value: string) => void;
  onClear: () => void;
}
```
- Visible label above (`caption`, `text-muted`, margin-bottom 8px). `<input type="search">` inside a `<form role="search">` that prevents default submit.
- Input: h 44px, padding 0 40px 0 12px (left 40px with the magnifier icon at 12px), 1px `border`, radius 0, bg `bg`, `body` text, placeholder `text-muted`.
- Clear button: 44×44 at the right inside the field, visible only when `value !== ''`, `aria-label="Clear search"`.
- States: hover border `text`; focus border `text` + 2px `focus` outline offset 2px; disabled opacity 0.4. No error state (any text is valid).
- Width: full on mobile; `lg`: flex 1, max 440px.

### 7.4 CategoryFilter

```ts
export interface CategoryOption { slug: string; name: string; }
export interface CategoryFilterProps {
  id: string;
  label: string;                   // "Category"
  options: CategoryOption[];
  value: string | null;            // null = All categories
  onChange: (slug: string | null) => void;
  disabled?: boolean;              // while categories are loading
}
```
- Native `<select>` with first option "All categories" (value `""` → `null`). Same box as SearchBox (h 44, 1px `border`, padding 0 40px 0 12px, custom chevron at right via background SVG, `appearance: none`).
- States: hover border `text`; focus ring; disabled opacity 0.4 with text "Loading…" as the only option.
- Width: 50% on mobile (next to SortSelect), 220px on `lg`.

### 7.5 SortSelect

```ts
export interface SortOption { value: SortValue; label: string; }
export interface SortSelectProps {
  id: string;
  label: string;          // "Sort by"
  options: SortOption[];
  value: SortValue;
  onChange: (value: SortValue) => void;
}
```
- Labels: Featured · Price: low to high · Price: high to low · Rating: high to low · Rating: low to high · Name: A–Z · Name: Z–A.
- Visual and states identical to CategoryFilter.

### 7.6 ResultCount (small, but part of the contract)

```ts
export interface ResultCountProps {
  count: number;
  query?: string;           // shown as “query”
  categoryName?: string;
  onClearFilters?: () => void;  // shown only when a query or category is active
}
```
- One line, `small`, `text-muted`: **"24 products"** (count in `text`, 500, tabular). With filters: "24 products for “cream” in Beauty · Clear filters".
- Wrap the sentence in `<p aria-live="polite" aria-atomic="true">` so screen readers hear the new total. The live region must exist on first render (empty text while loading).

### 7.7 PriceTag

```ts
export interface PriceTagProps {
  price: string;            // final price, formatted: "$8.99"
  originalPrice?: string;   // only when discounted: "$9.99"
  discountLabel?: string;   // "−10%"
  size?: 'sm' | 'lg';       // card / detail
}
```
- `sm` (cards): price 15px 500 `text`, right-aligned; original 13px `text-muted` line-through, stacked **under** the price (cards are only ~160px wide at 375px, so side-by-side does not fit next to the title).
- `lg`: price `price-lg` 500; original `body` muted line-through; discount badge after.
- Discount badge: `caption` 500, bg `primary`, text `on-primary`, padding 4px 8px, radius 0. (On cards the badge sits on the image instead, top-left 12px.)
- Accessibility: the struck price gets visually hidden text "Was " before it and the final price "Now " when discounted (`<s>` is not announced by all readers).
- No interactive states.

### 7.8 RatingStars

```ts
export interface RatingStarsProps {
  rating: number;          // 0–5, may be fractional (4.37)
  reviewCount?: number;    // "(3)"
  size?: 'sm' | 'md';      // 12px stars / 16px stars
}
```
- Five stars as one text string "★★★★★" in `star-empty`, with an overlay copy in `star` whose width is `rating / 5 * 100%` (overflow hidden). Then the number "4.4" (`small`, 500) and optional "(3)" muted.
- Wrapper: `role="img" aria-label="Rated 4.4 out of 5, 3 reviews"`; inner parts `aria-hidden`.
- The number rounds to 1 decimal (display only; the team may do `toFixed(1)` here, it's formatting, not logic).

### 7.9 StockBadge

```ts
export interface StockBadgeProps {
  status: StockStatus;     // from availabilityStatus: "In Stock" | "Low Stock" | "Out of Stock"
  label: string;           // "In stock" | "Low stock: 4 left" | "Out of stock"
}
```
- Text-only badge: 8px dot (`full` radius, currentColor) + label in `caption` 500. Colour: `success` / `warning` / `danger`.
- On cards: only show when `low-stock` or `out-of-stock` (top-right of image, bg `bg` at 90% opacity, padding 4px 8px). On detail: always shown.
- Out-of-stock card: image `opacity: 0.6`.

### 7.10 ProductCard

```ts
export interface ProductCardProps {
  id: number;
  href: string;                 // "/product/12"
  title: string;
  categoryName: string;         // "Beauty"
  image: ImageData;             // thumbnail + alt (alt = title)
  price: PriceTagProps;         // size ignored, always 'sm'
  rating: number;
  stock: StockBadgeProps;
  index: number;                // position on the page (0–11), drives reveal stagger via --i
  viewTransitionName?: 'product-image';  // set only for the card being navigated
}
```
- Whole card is a single `<a>` (router `<Link viewTransition>`) wrapping an `<article>`. No nested interactive elements.
- Media: `aspect-ratio: 4 / 5`, bg `surface`, image `object-fit: contain`, padding 12%, `width`/`height` attributes set (300×375), `loading="lazy"`, `decoding="async"`. On image error: show `surface-sunken` block with the title initial (CSS `onError` handler toggles a class; that is the one tiny event the card may own, or the route passes `onImageError` (decided: the `data-failed` class).
- Below media, 12px gap: row 1 = title (`h3`, 2-line clamp) left, PriceTag right (top-aligned). Row 2 (4px gap) = category (`caption`, `text-muted`) left, RatingStars `sm` right.
- States: hover / focus-within = image scale 1.04 (1400ms soft), title underline grows (240ms); focus-visible = 2px `focus` outline, offset 4px around the whole card; active = media scale 0.99 (120ms). Reveal on mount (see 5.4).
- Badges: discount (top-left), stock (top-right), 12px inset.

### 7.11 ProductGrid

```ts
export interface ProductGridProps {
  products: ProductCardProps[];
  label: string;                // "Products", used as aria-label on the <ul>
}
```
- `<ul role="list">` with `<li>` per card. Columns 2/3/4, gaps per section 4.
- Renders nothing special when empty; the page shows EmptyState instead (decision belongs to the route).

### 7.12 Pagination

```ts
export interface PaginationProps {
  currentPage: number;                    // 1-based
  totalPages: number;
  hrefForPage: (page: number) => string;  // the route builds "?q=…&page=3" so links work without JS state
  label?: string;                         // default "Pagination"
}
```
- `<nav aria-label="Pagination">` with `<ol>`. Items: "← Previous", page numbers, "Next →". Ellipsis rule: always show first, last, current ±1; gaps become "…" (`aria-hidden`). Example: `1 … 4 5 6 … 17`. This list comes from a pure helper `getPageItems(current, total)` that gets unit tests.
- Mobile: Previous / "Page 5 of 17" / Next (numbers hidden below `md`) to keep 44px targets.
- Item: 44×44 min, `small` 500 tabular, radius 0. Current: bg `primary`, text `on-primary`, `aria-current="page"`. Hover: bg `surface`. Focus ring. Disabled prev/next on first/last page: render as `<span aria-disabled="true">` at opacity 0.4.
- Hidden when `totalPages <= 1`.

### 7.13 Gallery

```ts
export interface GalleryProps {
  images: ImageData[];          // at least 1
  selectedIndex: number;
  onSelect: (index: number) => void;
  viewTransitionName?: 'product-image';
}
```
- Main image: `aspect-ratio: 1 / 1`, bg `surface`, `object-fit: contain`, padding 8%. `key={src}` so the swap replays `fade-in` (600ms). Eager loading, `fetchpriority="high"` for index 0.
- Thumbnails (hidden when only one image): row below, gap 8px, each a `<button>` 64×64 (mobile) / 80×80 (desktop), bg `surface`, `aria-label="Show image 2 of 4"`, `aria-pressed` on the selected one. Mobile: row scrolls horizontally (`overflow-x: auto`, `scroll-snap-type: x mandatory`).
- Thumb states: default 1px transparent border; hover border `line`; selected 2px `text` border (radius `sm`); focus-visible ring offset 2px; active scale 0.97.
- Mobile layout: main image full-bleed (negative page margin), thumbs inside margins.

### 7.14 ReviewList

```ts
export interface ReviewItem {
  id: string;                // the mapper builds e.g. `${reviewerName}-${date}`
  reviewerName: string;
  rating: number;
  comment: string;
  dateLabel: string;         // "Oct 25, 2026"
  dateTime: string;          // ISO, for <time dateTime>
}
export interface ReviewListProps {
  reviews: ReviewItem[];
  averageRating: number;
}
```
- Section heading `h2` "Reviews" + RatingStars `md` with count. List `<ul>` with 1px `line` top border on each item, padding-block 24px.
- Item: name (`h3`) + `<time>` (`caption` muted) on one row, RatingStars `sm` under it, comment `body` max 65ch.
- Empty: muted "No reviews yet." (no illustration).

### 7.15 BackLink

```ts
export interface BackLinkProps { href: string; label: string; } // href keeps the user's filters: "/?category=beauty&page=2"
```
- "← Back to catalog", `small` 500, min-h 44px, link styles, `viewTransition`. Margin-top 24px under header.

### 7.16 ProductSummary (detail right column)

```ts
export interface ProductSummaryProps {
  title: string;
  brand?: string;
  categoryName: string;
  description: string;
  price: PriceTagProps;        // size 'lg'
  rating: number;
  reviewCount: number;
  stock: StockBadgeProps;
  details: { term: string; value: string }[];   // Brand, Category, Stock: "34 units", SKU…
}
```
- Order: eyebrow (`caption` muted: "BRAND · CATEGORY") → `h1` serif title → RatingStars `md` → PriceTag `lg` → StockBadge → description (`body`, 65ch) → `<dl>` details (2 columns: term `caption` muted, value `small`), 1px `line` dividers. Gaps 16/24px.

### 7.17 Skeletons

```ts
export interface ProductGridSkeletonProps { count?: number; }  // default 12
export interface ProductDetailSkeletonProps {}
```
- Same boxes as real content so nothing jumps: card = media block 4:5 + two bars (70% × 16px, 40% × 12px), gap 12px. Detail = square block + 4 thumbs + title bars (80% × 40px, 50% × 40px) + price bar 30% × 28px + 4 text lines.
- Bars: bg `surface`, radius 0, pulse animation. Wrapper `aria-busy="true"` + visually hidden `role="status"` "Loading products…". Toolbar stays interactive during loading.

### 7.18 EmptyState

```ts
export interface EmptyStateProps {
  title: string;            // "Nothing matches “xyz”."
  message?: string;         // "Try a different word, or look in all categories."
  action?: Action;          // { label: 'Clear filters', onClick } or { label: 'Back to catalog', href: '/' }
  headingLevel?: 1 | 2;     // 1 when it's the page's main content (Not found), 2 inside catalog
}
```
- Centred block, padding-block 96px (desktop) / 64px (mobile), max-width 480px. Title serif `h2` (or `h1`), message `body` muted, action = secondary Button, 24px gaps. No illustration (calm); a 12px `text` dot above the title echoes the wordmark.
- Also used for **Product not found** (`headingLevel={1}`, title "We couldn't find that product.", action Back to catalog as primary link).

### 7.19 ErrorState

```ts
export interface ErrorStateProps {
  title?: string;           // default "Something went wrong."
  message: string;          // "We couldn't load the products. Check your connection and try again."
  onRetry: () => void;
  retryLabel?: string;      // default "Try again"
  isRetrying?: boolean;     // disables the button, shows "Trying again…"
}
```
- Same layout as EmptyState. Wrapper `role="alert"`. Title serif; a 12px `danger` dot above it (colour + text, not colour only). Primary button. After retry, the page moves focus to the result heading.

### 7.20 Wordmark + Hero

```ts
export interface WordmarkProps { variant: 'hero' | 'header'; playIntro?: boolean; }
export interface HeroProps { tagline: string; playIntro: boolean; }
```
- Hero: centred column, min-h 360/520px, wordmark `display`, tagline `body` muted 16px below. Hero is the page's `<h1>` on home (aria-label "Still"); the catalog section uses a visually-hidden `h2` "Products".

---

## 8. Accessibility notes

- **Focus**: every interactive element shows `outline: 2px solid var(--color-focus); outline-offset: 2px` on `:focus-visible` (cards: offset 4px). Never remove outlines without this replacement.
- **Touch targets**: ≥ 44×44px for all buttons, links in toolbars, pagination items, gallery thumbs (64px), clear-search button.
- **Live regions**: ResultCount is `aria-live="polite"`; ErrorState is `role="alert"`; skeleton wrapper has a `role="status"` message.
- **Focus management** (route logic): on route change, move focus to the page `<h1>` (`tabIndex={-1}`). On page change in pagination, scroll to and focus the products heading.
- **Alt text**: card image alt = product title. Gallery images: "`{title}`, image 2 of 4". Decorative dots, stars and icons are `aria-hidden`.
- **Semantics**: real `<a>` for navigation (cards, pagination, back), real `<button>` for actions (clear, retry, thumbs), `<form role="search">`, `<nav aria-label>`, `<ul>` for grid and reviews, `<time>` for dates, `<s>` + hidden "Was" text for old price.
- **Colour**: all ratios in section 1 pass AA; status always has text.
- **Motion**: all animation respects `prefers-reduced-motion` (section 5.5). Nothing auto-plays in a loop except the skeleton pulse, which stops under reduced motion and disappears when data arrives.
- **Zoom**: layout works at 200% zoom and 320px width (grid falls to 2 narrow columns; no horizontal scroll except the thumb row).

---

## 9. Hand-off checklist

1. Paste section 6 into `src/index.css`; install the two `@fontsource` packages.
2. Create `src/components/types.ts` from sections 7.0–7.20 (reviewed before building).
3. Build components against mock props (Storybook-free: a `/dev/components` route or the tests).
4. Put the motion CSS (5.2–5.5) in `src/styles/motion.css`, imported once; each block gets a comment that `docs/animation-guide.md` can explain step by step.
5. Leave numbered `// TODO:` markers where the data gets wired (mappers, `playIntro`, `viewTransitionName`, focus management).
