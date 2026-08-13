# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (host `127.0.0.1`; port from `$PORT` if set, else 5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build on `127.0.0.1`
- `npm run icons` — regenerate `src/data/techIcons.js` from `scripts/build-tech-icons.mjs`; run this after editing the `SLUGS`/`MONOGRAMS` lists in that script, never edit the generated file by hand

No lint or test scripts are configured.

## Architecture

This is a single-page React 19 + Vite portfolio site, entirely client-rendered with no routing or backend.

**Section system**: `src/data/sections.js` is the single source of truth for section order, numbering (`01`–`07`), and nav visibility. `src/App.jsx` renders section components in a fixed order that must stay in sync with that file (`App.jsx` has a comment reminder at the render list). `SectionIndex` and `Navigation` both read from `SECTIONS` rather than hardcoding labels/order.

**Scroll-reveal**: any element with a `data-reveal` attribute is faded/translated in via an `IntersectionObserver` wired up once in `App.jsx`; the actual transition is defined in `src/styles.css`. Respects `prefers-reduced-motion`.

**Design tokens**: colors are defined as space-separated RGB triples in CSS custom properties in `:root` (`src/styles.css`), not hex, so Tailwind opacity modifiers (e.g. `text-sand/40`) work. `tailwind.config.js` maps Tailwind color names (`espresso`, `sand`, `bone`, `paper*`, `accent*`, `glow*`) to `rgb(var(--token))`. The palette originates from `Designsource/Color Palette.png` + `Background.txt` — do not introduce raw hex values outside that `:root` block.

**Tech icon marquee**: `src/data/techIcons.js` is generated (not hand-edited) from the `simple-icons` package via `scripts/build-tech-icons.mjs`, so the site ships zero network requests for tool logos. Icons without an official `simple-icons` mark (trademark removals) are listed in the script's `MONOGRAMS` array and rendered as text monograms instead of guessed geometry.

**Structure**:
- `src/sections/` — one component per page section (Hero, About, Services, Showcase, Experience, Contact), composed in `App.jsx`
- `src/components/` — shared UI (Navigation, Logo, background effects, text-reveal/scramble hooks, marquee)
- `src/data/` — content and config as data (`profile.js`, `sections.js`, `techIcons.js`)
- `Designsource/` — source design assets (palette, background references) that token values are derived from
- `PhotosForPortfolio/`, `work/`, `outputs/` — raw content/media assets referenced by the site
