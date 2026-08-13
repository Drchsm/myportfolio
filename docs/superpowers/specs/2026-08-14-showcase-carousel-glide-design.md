# Showcase carousel: directional glide, one project at a time

## Context

The Showcase grid (`src/sections/Showcase.jsx`) currently pages through the `projects` array 3 cards at a time via Next/Previous buttons, added earlier this session (`page` state, `pageSize = 3`, `Math.ceil` page count, loop-around at the boundaries). The user found the page-swap "too steady" — it swaps the full group of 3 instantly with no motion, and jumping a whole page at a time skips content rather than progressing through it.

This spec replaces that logic so:
- Clicking Next/Previous advances the visible window by **one project**, not three.
- The visible window still shows **3 cards** at a time.
- The transition **glides smoothly in the clicked direction** instead of swapping instantly.

## Approach

Two motion strategies were considered:

- **True continuous sliding track** — all cards sit in one long horizontal strip that physically translates by one card-width per click, with cloned buffer cards at each end for a seamless loop (classic carousel-row feel). Rejected: meaningfully more code (buffer-item bookkeeping, per-breakpoint item-width math, instant-reset snapping at the loop boundary), and doesn't translate cleanly to the mobile layout, where the grid has no `lg:grid-cols-3` and cards stack in a single column instead of sitting side by side.
- **Directional cross-slide (chosen)** — the whole 3-card row animates in as a block: on each click the window advances by one project, and the new row glides in from the direction implied by the button (Next → from the right, Previous → from the left). No exit animation on the outgoing row; the enter animation alone reads as "gliding" and is what was implemented for the earlier scroll-reveal system (`[data-reveal]` in `src/styles.css`), so this stays consistent with the rest of the site's motion language instead of introducing a new pattern. It also requires no per-breakpoint item-width math, since it animates the row as a single block regardless of how many columns are currently rendered.

## State model

Replaces the `page`/`pageSize`/`totalPages` state added last turn, in `src/sections/Showcase.jsx`:

- `startIndex` (number, starts at `0`) — index into `projects` of the first visible card.
- `direction` (`'next' | 'prev'`, starts at `'next'`) — which button was last clicked; decides which edge the new row glides in from.
- `animKey` (number, starts at `0`) — increments on every click; used as the `key` on the grid wrapper so React remounts it and the CSS animation replays every click, including repeated clicks in the same direction.
- `visibleProjects` (derived each render, not state): `[0, 1, 2].map((offset) => projects[(startIndex + offset) % projects.length])` — a circular 3-item window, so it wraps at both ends with no special-casing.

## Click behavior

- `goNext`: `startIndex = (startIndex + 1) % projects.length`; `direction = 'next'`; `animKey += 1`.
- `goPrev`: `startIndex = (startIndex - 1 + projects.length) % projects.length`; `direction = 'prev'`; `animKey += 1`.
- No debounce/lock: each click is a single synchronous state update (not a two-phase out-then-in animation), so rapid clicking just retriggers the enter animation on each new window — it always lands on a valid 3-card slice, never an inconsistent state.

## Animation mechanics

- New `@keyframes showcase-glide` block added to `src/styles.css`, next to the existing `[data-reveal]` rules (`src/styles.css:84-97`):
  - `from`: `opacity: 0; transform: translateX(var(--glide-x));`
  - `to`: `opacity: 1; transform: translateX(0);`
  - Applied via an `animation` shorthand: `showcase-glide 400ms cubic-bezier(0.22, 1, 0.36, 1) both` — same easing curve the site already uses for `[data-reveal]`, so the motion feels consistent rather than like a new, separate effect.
- The grid wrapper (`<div className="mt-12 grid gap-8 lg:grid-cols-3">` in `Showcase.jsx`) gets:
  - `key={animKey}` — forces remount, which restarts the CSS animation every click.
  - An inline style setting the `--glide-x` custom property: `'24px'` when `direction === 'next'`, `'-24px'` when `'prev'`.
  - A class applying the `showcase-glide` animation.
- **Reduced motion is already handled globally.** The existing `@media (prefers-reduced-motion: reduce)` block (`src/styles.css:99-117`) sets `animation-duration: 0.01ms !important` on `*`, which applies to this new animation automatically — no extra reduced-motion code needed in the component.

## Scope / files touched

- `src/sections/Showcase.jsx` — replace pagination state/handlers with the windowing model above; swap the grid wrapper's `key`/style/class as described. Card markup (`StackIcon`, the per-project `<Wrapper>` JSX) is untouched.
- `src/styles.css` — add the one new `@keyframes showcase-glide` block.

Out of scope: the Next/Previous button markup/styling itself (already built last turn, unchanged), and the `projects` data array (unchanged — still 3 real + 3 "Coming Soon" placeholders).

## Testing / verification

- `npm run dev`, scroll to Showcase.
- Click Next repeatedly: window advances one project at a time (e.g. P.01–P.03 → P.02–P.04 → P.03–P.05 → …), each new row glides in from the right.
- Click Previous: glides in from the left, also stepping one project at a time.
- Confirm looping is seamless at both ends (from the last project, Next wraps to the first; from the first, Previous wraps to the last) — no error, no empty slice.
- Click rapidly in both directions: confirm no visual glitches or invalid/duplicate cards, and no React key-collision warnings in the console (cards continue keying off `project.number`).
- With the OS "reduce motion" setting enabled, confirm the row updates instantly with no glide (per the existing global reduced-motion rule).
