# Animation guide, part 1: how the shop moves

Who this is for: you, learning CSS animation. No prior animation knowledge needed.
Where the code lives: `src/styles/motion.css` (all the animation) and the tokens in `src/index.css`.

How to use this guide: open the app (`npm run dev`), open `src/styles/motion.css` next to it, and do the
**Try it** exercises as you read. Change one number, save, and look. The page reloads by itself.
Put the old value back when you are done (or use git to undo).

Part 2 (skeleton to content) is at the bottom of this file. Part 3 (page transitions) comes in M4.

---

## 0. The 60-second idea

CSS animation has two ingredients:

1. **`@keyframes`**: a recipe that says "start like this, end like that". It has a name.
2. **`animation:`**: a property on an element that says "play the recipe called X, for this long, with this curve, after this wait".

```css
@keyframes fade-up {                       /* the recipe, named "fade-up" */
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

.intro-fade {                              /* an element that plays it */
  animation: fade-up 1400ms var(--ease-soft) 2000ms backwards;
  /*         name     duration  easing curve   delay   fill mode */
}
```

Read the `animation:` line left to right: **name, duration, easing, delay, fill mode.**

There is also a lighter tool, **`transition`**: "when this property changes (for example on hover),
glide to the new value instead of jumping". Hover effects use transitions. Entrances use keyframes.

---

## 1. The motion tokens

In the `@theme` block of `src/index.css` there is a block of named numbers. Like colours, we name them once and reuse them.

| Token | Value | Used for |
|---|---|---|
| `--duration-slow` | 1400ms | intro steps, card reveal, image hover zoom |
| `--duration-page` | 900ms | page transitions (later, M4) |
| `--duration-medium` | 600ms | content fading in after loading |
| `--duration-exit` | 350ms | old page fading out (later) |
| `--duration-fast` | 240ms | hover underline, button colours |
| `--duration-instant` | 120ms | the "press" feedback when you click |
| `--stagger` | 60ms | the delay between one card and the next |
| `--ease-soft` | `cubic-bezier(0.15, 0.9, 0.34, 0.95)` | everything that moves |

Why tokens? If someone says "make everything calmer", you change `--duration-slow` once and the
intro, the reveal and the hover zoom all slow down together.

**Try it:** in `src/index.css` change `--stagger: 60ms` to `--stagger: 200ms`. Reload the home page. The cards now appear one by one, slowly.
Then try `0ms`: all twelve appear at once. (Put it back to 60ms. 60 is the sweet spot: you notice the wave, but it does not drag.)

---

## 2. The easing curve: why it feels soft

An **easing curve** decides how speed changes over time. Linear means constant speed (robotic).
Our curve is `cubic-bezier(0.15, 0.9, 0.34, 0.95)`.

Four numbers = two control points that bend the curve. You do not need the maths. Read it like this:

- It starts fast: almost all of the movement happens in the first third of the time.
- Then it slows down a lot and creeps gently to a stop.

So the same curve feels **snappy at 240ms** (a button) and like a **slow glide at 1400ms** (the intro).
One curve everywhere gives the whole shop one personality. That is the design idea.

The famous built-ins are `ease`, `ease-in`, `ease-out`, `linear`. Ours is a custom `ease-out`.

**Try it:**
1. Open Chrome DevTools, go to the Elements tab, select any product card's `<img>` and find the `transition` in the Styles pane. Click the little curve icon next to the easing to see and drag the curve.
2. In `src/index.css` change `--ease-soft` to `linear`. Hover a card: the zoom is mechanical now. Put it back.
3. Try `cubic-bezier(0.5, 0, 0.5, 1)` (a symmetric ease-in-out). It starts slowly. Which feels better on a button?

---

## 3. The intro: the dot becomes the wordmark

The wordmark takes 2.4 seconds; everything else settles by about 4.4 seconds (the last card finishes revealing). It only plays when `playIntro` is true (right now the home route always passes `true`; deciding "once per session" is your TODO 19).

### The markup (src/components/Wordmark.tsx)

```html
<h1 class="wordmark" data-intro="true" aria-label="Still">
  <span aria-hidden="true">
    <span class="wordmark__track">
      <span class="wordmark__letters">Still</span>
      <span class="wordmark__dot"></span>      <!-- a real CSS circle -->
    </span>
  </span>
</h1>
```

Two ideas to notice:

- **The full stop is a circle we draw** (a `span` with `border-radius: 9999px`), not a text character. That is what lets it grow into a big circle.
- **`data-intro="true"` is the on/off switch.** The animation rules only match
  `.wordmark[data-intro='true'] ...`. No attribute = no animation = the finished wordmark, immediately.

### The story, step by step

**Step 1 (200ms to 1400ms): the dot grows, then shrinks.** Keyframes `intro-dot`:

```css
@keyframes intro-dot {
  0%   { transform: scale(0); }    /* invisible */
  45%  { transform: scale(7); }    /* big circle, 7 times its normal size */
  60%  { transform: scale(7); }    /* hold for a moment */
  100% { transform: scale(1); }    /* back to full-stop size */
}
```

`scale(7)` multiplies the size by 7. Percentages are "how far through the duration" (45% of 1200ms is 540ms).
The 200ms at the end of the `animation:` line is a **delay**: nothing happens for the first 200ms.

**Step 2 (1000ms to 2400ms): the track glides.** Keyframes `intro-track` start the whole word shifted
left by half its width (`translateX(calc(-50% + 0.08em))`), so the *dot* sits in the middle of the page.
Then it glides to `translateX(0)`, its real place. The dot appears to travel right, pulling the word along.

`-50%` inside `translate` means "half of this element's own width". The `+ 0.08em` is half the dot's width,
so the dot's *centre* (not its left edge) lands on the centre line.

**Step 3 (same moment): the letters are uncovered.** Keyframes `intro-letters` animate `clip-path`:

```css
from { clip-path: inset(-0.2em 0 -0.2em 100%); }   /* hidden: a curtain pulled all the way across */
to   { clip-path: inset(-0.2em 0 -0.2em 0); }      /* fully visible */
```

`inset(top right bottom left)` cuts away that much from each side. The last number, `left`, goes from
100% to 0%, so the curtain slides away and the letters appear from the dot's side. (The `-0.2em` top and
bottom just stops tall letters being cut off.)

**Step 4 (2000ms and later): everything else fades up.** The tagline, toolbar, result count and header wordmark use the
class `.intro-fade`, which plays `fade-up` (fade in while rising 16px). Each one has its own wait (the result count shares the toolbar's 2200ms, so nothing shows before its turn),
set from the component with a CSS variable: `style={{ '--delay': '2000ms' }}`, read in CSS as `var(--delay, 0ms)`.
The `0ms` after the comma is the fallback if the variable is missing.

Timeline:

```
0ms      200      740  920     1400                2400   3400
idle     dot grows  hold  dot shrinks
                          |---- track glides + letters revealed ----|
                                       tagline fades up (2000 to 3400)
                                         toolbar + result count (2200), cards (2300)
```

### Why `backwards`?

`animation-fill-mode: backwards` means "before the animation starts (during the delay), already show the
`from` state". Without it, the tagline would be fully visible for 2 seconds, then suddenly vanish and fade in.
With it, it stays hidden during the wait. **After** the animation ends, the element returns to its normal
styles, which are the finished look. That is why turning animations off never breaks the page.

**Try it:**
1. Change `scale(7)` to `scale(15)` in `intro-dot`: a huge circle. Then try `scale(1)`: the "grow" disappears.
2. Change the `45%` and `60%` to `20%` and `80%`: the dot holds big for much longer.
3. Change the delay `1000ms` in the two `.wordmark[data-intro='true']` rules to `0ms`. The glide starts immediately. Now change only *one* of them back to 1000ms: letters and track fall out of sync and the effect breaks. They must agree.
4. Change `--duration-slow` to `4000ms` in `src/index.css`: slow motion, great for seeing what each step does. (This also slows the card reveal and hover.)
5. In `src/routes/HomePage.tsx` set `const playIntro = false`. The page is completely still. Same components, one prop.

---

## 4. Card reveal and hover

### The reveal (cards appear one after another)

```css
.card__media img {
  animation: reveal-up var(--duration-slow) var(--ease-soft)
    calc(var(--intro-delay, 0ms) + var(--i, 0) * var(--stagger)) backwards;
}
@keyframes reveal-up {
  from { clip-path: inset(100% 0 0 0); transform: scale(1.06); }
  to   { clip-path: inset(0 0 0 0);    transform: scale(1); }
}
```

- `clip-path: inset(100% 0 0 0)` cuts 100% from the **top**, so nothing shows. Animating to `0` pulls the cut back and the picture is uncovered from the bottom up, like a blind rising.
- At the same time it settles from 106% size to 100%.
- **The stagger.** The delay is a calculation: `intro delay + card number x 60ms`. Each card knows its number through the CSS variable `--i`, which `ProductCard` sets from its `index` prop (`style={{ '--i': Math.min(index, 11) }}`). Card 0 waits 0ms, card 1 waits 60ms, card 2 waits 120ms... The `Math.min(index, 11)` cap means a long page never waits more than 660ms.
- `--intro-delay` is set once by the page on the grid wrapper (2300ms while the intro plays, otherwise missing, so `0ms`). The cards wait until the intro is nearly done and then wave in.

**The badges.** The discount and stock badges sit on top of the image, so they must not appear before it does.
`.card__badges` plays a plain opacity fade (`badge-fade`) with exactly the same delay calculation as the image.
Same delay = they arrive together.

**Try it:**
1. Change `inset(100% 0 0 0)` in `reveal-up` to `inset(0 100% 0 0)`: now the picture is uncovered from the left instead.
2. Change `scale(1.06)` to `scale(1.5)`: dramatic zoom-out as it appears.
3. Replace `var(--i, 0)` with `0`: the stagger is gone, all cards reveal together.
4. In DevTools you can inspect a card, add `style="--i: 8"` to it and see it wait longer.

### The hover (and keyboard focus)

```css
.card__media img { transition: transform var(--duration-slow) var(--ease-soft); }
.card:hover .card__media img,
.card:focus-within .card__media img { transform: scale(1.04); }
```

This is a **transition**, not keyframes: the image has a normal size (`scale(1)`), and when the mouse is over the
card the target becomes `scale(1.04)`. The browser glides between the two. When you leave, it glides back.
`:focus-within` does the same when a keyboard user tabs onto the card, so keyboard users are not left out.

The **title underline** is a little trick. A 1px-tall background line is drawn with its width at `0`:

```css
.card__title {
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: background-size var(--duration-fast) var(--ease-soft);
}
.card:hover .card__title { background-size: 100% 1px; }
```

Read the shorthand as `position / size`: `0 100%` is left-bottom, `0 1px` is width 0, height 1px.
On hover the width becomes `100%`, so the line grows from left to right. We animate `background-size`
because you cannot animate `text-decoration` smoothly.

Finally `.card:active` (while the mouse button is down) scales the image box to 99% for 120ms: a tiny "press".

**Try it:**
1. Change `scale(1.04)` to `scale(1.2)`: a big zoom.
2. Change the transition from `var(--duration-slow)` to `var(--duration-instant)` (120ms): the zoom is now twitchy, not calm. This is why the design uses slow for images and fast for text.
3. Change the underline `100% 1px` (hover) to `100% 3px` to get a thick underline. (Also change the `0 1px` above to `0 3px`.)

---

## 5. The skeleton pulse

While data loads, grey boxes stand in for the cards (`ProductGridSkeleton`).

```css
.skeleton {
  background: var(--surface);
  animation: skeleton-pulse 1400ms linear infinite alternate;
}
@keyframes skeleton-pulse {
  from { opacity: 1; }
  to   { opacity: 0.55; }
}
```

New words in the `animation:` line:

- `infinite`: repeat forever (until the skeleton is removed from the page).
- `alternate`: play forwards, then backwards, then forwards... so it breathes smoothly instead of snapping from 55% back to 100%.
- `linear`: constant speed. For a pulse, a plain even breath looks best, so this is the only place we do not use `--ease-soft`.

You will see it for real in M2, when the app fetches products. For now look at it on `/dev/components` (section "ProductGridSkeleton").

**Try it:**
1. Change `0.55` to `0.2`: a deeper pulse.
2. Change `1400ms` to `500ms`: nervous and fast. Slow and gentle reads as "calm, working on it".
3. Remove the word `alternate`. Now each cycle fades down and snaps back up. Notice how much worse it looks.

---

## 6. Reduced motion: being kind

Some people get dizzy or distracted by movement, and their device has a setting "reduce motion".
CSS can read it:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
  .skeleton { animation: none; }
  ...
}
```

- All animations become 1 millisecond long with no delay, so they finish instantly.
- Why 1ms and not "none"? An animation that finishes still lands on its end state. Nothing stays half-hidden.
- `!important` makes this block win over every other rule. It is one of the few good uses of `!important`.
- Thanks to `backwards` fill and "the normal styles are the finished look" (section 3), the result is a complete page with the finished wordmark, no waiting, no stuck `opacity: 0`.
- Colour changes and the underline still happen, but instantly (their transitions are shortened to 1ms too), so they snap instead of glide.

**Try it:**
- macOS: System Settings, Accessibility, Display, turn on **Reduce motion**.
  Windows: Settings, Accessibility, Visual effects, turn off **Animation effects**.
  Reload the home page: no intro, no reveal, no zoom.
- Or in Chrome DevTools: press Cmd+Shift+P, type "reduced motion", choose "Emulate CSS prefers-reduced-motion: reduce".
- Remove the `.skeleton { animation: none; }` line, reload with reduce-motion on, and see that the skeleton still stops pulsing? Why? (Answer: `animation-iteration-count: 1` already limits it to a single cycle. The extra line is belt and braces.)

---

## Cheat sheet

| I want to... | Do this |
|---|---|
| Make something move once on load | `@keyframes` + `animation: name duration easing delay backwards` |
| Make something glide on hover | `transition: property duration easing` on the normal state, change the property in `:hover` |
| Wait before starting | the delay (4th value of `animation`) |
| Offset many items | a CSS variable per item (`--i`) used in `calc()` for the delay |
| Hide before the animation starts | fill mode `backwards` |
| Respect reduced motion | the `@media (prefers-reduced-motion: reduce)` block in `motion.css` |

Keep going: MDN "Using CSS animations" (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
and the interactive curve editor at https://cubic-bezier.com.

---
---

# Animation guide, part 2: skeleton to content

Who this is for: you, in M2, when the home page starts loading real products.
Where the code lives: `src/styles/motion.css` (sections 3 and 5), `src/components/ProductGridSkeleton.tsx`,
`src/components/ProductGrid.tsx`, `src/components/gridLayout.ts`.

The story: the page opens, the request goes out, grey boxes pulse while you wait, then the real cards
appear in place. Three questions: how does the pulse work, how do the cards arrive, and why does nothing jump?

---

## 7. How the pulse works

```css
.skeleton {
  background: var(--surface);
  animation: skeleton-pulse 1400ms linear infinite alternate;
}
@keyframes skeleton-pulse {
  from { opacity: 1; }
  to   { opacity: 0.55; }
}
```

- `ProductGridSkeleton` draws 12 placeholders by default (`count = 12`). Each one has three grey boxes with the class `skeleton`: an image box, a long title bar and a short price bar.
- The recipe goes from fully visible (`1`) to 55% visible (`0.55`). That is all.
- **`alternate`** is the clever bit. One cycle takes 1400ms. On the first cycle the recipe plays forwards (100% down to 55%). On the second it plays **backwards** (55% up to 100%). Then forwards again, and so on. Without `alternate` each cycle would end at 55% and then snap back to 100%, which looks like flicker.
- **`infinite`** means it never stops by itself. It stops because React removes the skeleton from the page when data arrives.
- **`linear`** keeps an even speed, so the "breathing" has no stops.

Notice there is no delay and no stagger here: every box pulses together, so the whole grid breathes as one.

### Reduced motion

The reduced-motion block at the bottom of `motion.css` has two layers:

1. The catch-all rule sets `animation-iteration-count: 1 !important` and a 1ms duration, so the pulse would run once for 1ms.
2. `.skeleton { animation: none; }` then removes it entirely.

Result: people who asked for less motion see calm, still grey boxes. Nothing moves, but the page still clearly says "loading", and `ProductGridSkeleton` also renders a hidden "Loading products..." message (`role="status"`, class `sr-only`) so screen readers are told too.

**Try it:**
1. Change `0.55` to `0.2`: a deeper pulse.
2. Change `1400ms` to `500ms`: nervous and fast. Slow reads as "calm, working on it".
3. Delete `alternate` and watch the snap at the end of each cycle.

---

## 8. How the content appears

When the data arrives, the page stops rendering `ProductGridSkeleton` and renders `ProductGrid` instead.
React removes the grey boxes and adds the real cards. Which CSS runs?

**The card reveal from part 1 (section 4).** Nothing new is needed:

```css
.card__media img {
  animation: reveal-up var(--duration-slow) var(--ease-soft)
    calc(var(--intro-delay, 0ms) + var(--i, 0) * var(--stagger)) backwards;
}
.card__badges {
  animation: badge-fade ... /* same delay calculation */ backwards;
}
```

The key fact: **a CSS animation starts the moment its element is added to the page.** It does not care
whether that is page load, or two seconds later when a network request finished. So the real cards, mounting
after loading, play `reveal-up` exactly as they did in M1. Each image is uncovered from the bottom, one card
after another (`--i` x 60ms), and the badges fade in with their image. Because of this, **no CSS change was needed for M2.**

Two small things to know:

- **The intro delay.** The page sets `--intro-delay` (2300ms) on the grid's wrapper while the intro plays. Cards inherit it, so they wait that long *every time they mount*. If the data arrives at 400ms, that is perfect: the cards wait for the intro to finish. If the data arrives at 5 seconds, the cards would wait a further 2.3 seconds, and the grid would look empty. This is a logic question for the page (should `--intro-delay` stop being set once the intro is over?), so it is decided in the page logic, not solved in CSS.
- **`.fade-in`** (section 5 above, 600ms fade-up) also exists in `motion.css` for other loaded content, such as a result count that should not just pop in. The product images do not need it, because they already have `reveal-up`.

### Why there is no layout jump

A "layout jump" is when content appears and everything below it gets shoved down or sideways. Three things prevent it:

1. **The same grid.** `ProductGridSkeleton` and `ProductGrid` both use `gridLayoutClass` from `src/components/gridLayout.ts` (2 columns on phones, 3 on tablets, 4 on desktop, the same gaps). One shared string means they can never drift apart.
2. **The same image shape.** The skeleton image box is `aspect-4/5` and the real card's `.card__media` is also `aspect-4/5`. The browser works out the height from the column width, so the box is the same size before and after the picture has loaded.
3. **Text bars roughly where text goes.** The title bar (`h-4`) and price bar (`h-3`) stand in for the title and price. These are an approximation: a real title can wrap onto two lines (`line-clamp-2`), so a card can end up a little taller than its skeleton. The image, which is most of the height, matches exactly, so any shift is small. Keeping the pagination below at a stable place is the next-best thing, and is a good thing to look at in the browser.

**Try it:** in `ProductGridSkeleton.tsx`, temporarily change `aspect-4/5` on the skeleton image to `aspect-square`. Throttle the network in DevTools (Network tab, "Slow 4G"), reload, and watch the grid jump taller when the cards arrive. That jump is exactly what the matching aspect ratio prevents. Put it back.

---

## 9. Why `backwards` matters here

Every reveal animation in `motion.css` ends with `backwards`. That is `animation-fill-mode: backwards`:
"during the delay, already show the `from` keyframe."

Look at a card that is third in line: its delay is 2 x 60ms = 120ms (plus `--intro-delay` if set). During that wait:

- **With `backwards`:** the image is held at `clip-path: inset(100% 0 0 0)`, so it is hidden. Then the reveal runs smoothly from there.
- **Without it:** the image uses its normal style, which is the *finished* look, fully visible. It sits there for 120ms, then at the start of the animation it **jumps** to the hidden state and reveals. You see a flash of the finished picture, then a blink.

That blink is the "flash" people notice when a loading state is replaced. With 12 cards each waiting a different time, it would ripple across the grid.

The same reasoning applies to `.card__badges` (hidden while waiting, so no badge floats over an empty box).
And once the animation finishes, `backwards` lets go, so the element returns to its normal styles. That is why reduced motion, or a failed animation, still leaves a complete page.

**Try it:**
1. In `.card__media img`, delete the word `backwards`, and reload. Watch the cards flash in full and then re-reveal. Put it back.
2. Set `--stagger` to `300ms` in `src/index.css` with `backwards` still on: the cards wait hidden, with no flash, just a slow wave. Compare with step 1. Put it back to `60ms`.
3. Change `reveal-up`'s `scale(1.06)` to `scale(1.3)` and throttle the network. Seeing grey boxes turn into pictures in slow motion is the best way to understand the whole handoff.
