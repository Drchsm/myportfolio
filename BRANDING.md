# Brand & Design Reference

Extracted from the current site (`Designsource/`, `src/styles.css`, `tailwind.config.js`, `src/sections/Hero.jsx`). Use this as the source of truth when briefing Claude on new sections, pages, or spin-off materials — quote the token names, not raw hex, so output stays consistent with the codebase.

Identity: **Hendrich Capalaran** — AI automation specialist / junior developer, Philippines / Remote. Tagline: *"I build AI automation systems end to end, turning scattered business operations into dependable systems people actually use."*

---

## 1. Color system

Dark, matte, editorial — one warm neutral palette for structure, four "glow" accents used sparingly for tech/energy moments. Everything is stored as space-separated RGB in `:root` (not hex) so Tailwind opacity modifiers work; **quote the token name**, not the hex, when asking Claude to style something.

| Token (Tailwind name) | Hex | Role |
|---|---|---|
| `espresso` | `#222831` | Base ground / page background |
| `umber` | `#1b2027` | Deep section ground (darker panels) |
| `slateLine` | `#393e46` | Dividers, hairlines |
| `taupe` | `#948979` | Muted accent, secondary emphasis |
| `sand` | `#dfd0b8` | Primary warm highlight — kickers, borders, glow underlay |
| `bone` | `#f9f6f0` | Primary text on dark backgrounds |
| `paper` | `#e9e4da` | Light section ground (for a paper-toned block/section) |
| `paperInk` | `#1b2027` | Text on `paper` |
| `paperLine` | `#cdc5b4` | Borders on `paper` |
| `paperMute` | `#635e52` | Muted text on `paper` (verified 5.1:1 contrast) |

**Glow accents** — hero-only, used at low opacity for ambient light blobs and small energy details (status dots, gradient underlines). Don't let these bleed into other sections (the experience timeline uses its own muted `accent1/2/3` recency ramp — sand → taupe → `#6e7683` — not these):

| Token | Hex | Use |
|---|---|---|
| `glowCyan` | `#22d3ee` | Status dot only |
| `glowAmber` | `#f59e0b` | Primary glow / CTA hover shadow |
| `glowCopper` | `#c2410c` | Secondary glow |
| `glowEmerald` | `#059669` | Tertiary glow |

Rule of thumb: **espresso/umber for ground, sand/bone for text and structure, one glow gradient (amber→copper→emerald) as the single "alive" accent** — e.g. the hero's bottom underline bar. Don't introduce new hues outside this set.

---

## 2. Typography

Three families, loaded from Google Fonts (`Inter`, `Inter Tight`, `JetBrains Mono` — weights 400–900 already subset in `index.html`):

- **Display** — `Inter Tight`, weight 800–900, uppercase, tight/negative tracking (`tracking-[-0.075em]` on the hero name). Reserved for the one big editorial statement per section (the name in Hero, section titles). Scaled to fill its container width exactly rather than a fixed clamp — treat headline size as "as large as it fits," not a fixed rem value.
- **Sans / body** — `Inter`, weight 400–700 for paragraphs, 700–800 for emphasis. Body copy sits around `text-[clamp(1.5rem,2.2vw,2.4rem)]` in the hero (it's the pitch line, so it reads big) — regular sections use smaller, more conventional body sizes.
- **Mono** — `JetBrains Mono`, uppercase, wide tracking (`tracking-[0.28em]` to `[0.34em]`), small size (11–12px). Used exclusively for labels/kickers/metadata: section numbering, location line, nav — never for body copy. This is what gives the site its "spec sheet" texture against the editorial display type.

Pairing logic: **huge condensed uppercase display type** (impact, editorial) + **tiny wide-tracked mono labels** (technical, precise) + **plain Inter body** (readable). Keep that three-way contrast when extending to new pages — don't add a fourth typeface.

---

## 3. Logo

`Designsource/mylogo.png` — an "HC" monogram, sand-fill letterforms with a slate outline, set on an opaque dark navy tile (`#1c232b` — close to but distinct from `espresso`; the container background is matched to this exact value to hide the PNG's square edge, not to `espresso`). Rendered at 40×40 in a `rounded-2xl` mask with a 1px inset ring (`ring-bone/10`); on hover it rotates -3° and scales to 1.05 — a small, mechanical tilt, not a bounce. Full wordmark ("Hendrich Capalaran") sits beside the mark at `sm:` and up, dropped on mobile.

---

## 4. Background & texture

Base is flat `espresso`, never pure black. Layered on top (see `Designsource/Background.txt` + `NoisyGradientBackground.jsx`):

1. Fine-grain animated noise (canvas-drawn, ~18/255 alpha, redrawn on a time budget not every frame) — reads as brushed matte paper / soft concrete grain, not photographic grain.
2. Sparse radial ambient light in `sand`/`taupe` at very low opacity (~15–18%), positioned off-center (upper-left, upper-right) rather than centered — avoids a "spotlight" cliché.
3. An optional faint 76px grid of hairlines (`sand` at ~4% opacity) for structure.
4. On the hero specifically: three large blurred (`blur-[130–150px]`) color blobs in `glowAmber/8`, `glowEmerald/8`, `glowCopper/8` — barely-there color temperature, not a visible gradient.

Explicitly avoid: loud/visible gradients, photorealistic textures, drop shadows on flat surfaces, busy or fast motion in the background layer. The background should always read as *quiet* relative to foreground content.

---

## 5. Motion & interaction principles

- **Cascade, don't pop.** Every entrance is staggered: hero content fades+rises (`translateY(18px)→0`, `opacity 0→1`) item by item on a shared ~90ms step; the headline reveals letter-by-letter via a mask (translateY 115%→0 per glyph, 20ms step) — not a fade, a hard reveal from behind a clipped edge.
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` everywhere — a fast-out, gentle-settle curve. Use this exact curve for consistency rather than a generic ease-out.
- **One finishing stroke**: decorative elements (the gradient underline bar) animate in *last*, after content — like punctuation closing the cascade, not competing with it.
- **Hover = small and mechanical**, not springy: -3° rotate + 1.05 scale on the logo, -translate-y-0.5 + glow shadow on the primary CTA. Nothing bounces.
- **Always respect `prefers-reduced-motion`**: every timeline collapses to instant (0ms) state changes, and the JS noise loop pauses on a static frame. This is non-negotiable in every component, not a nice-to-have.
- Photography gets its own bespoke interaction (tile-break hover grid on the hero portrait) rather than a generic fade/zoom — treat imagery as something that can react physically to the cursor.

---

## 6. Voice & content pattern

- Headline pitch is one sentence, plainspoken, verb-first ("I build..."), naming the concrete outcome, not the buzzwords — the AI-automation phrase itself is the only highlighted span (gradient text-clip in `glowAmber→glowCopper`), everything else is quieter `bone/70`.
- Role/status line is small, italic, mono-adjacent, prefixed with a single pulsing/status dot — reads as a live status line, not a job title banner.
- Location is treated as metadata (mono, uppercase, wide-tracked, icon-prefixed), not prose.
- Overall tone: confident, technical, unembellished. No exclamation points, no "passionate about," no filler adjectives.

---

## 7. Layout conventions

- Global content max-width: `1540px` (`--shell-max`), horizontal padding `20px → 32px → 40px` across breakpoints.
- Hero uses an asymmetric split: narrow portrait column vs. wide content column (`0.68fr / 1.32fr` at `lg`) — imbalance is intentional, not a centered/symmetric layout.
- Section numbering (`01`–`07`) and nav labels are data-driven off one source of truth (`src/data/sections.js`), always shown as mono kickers.

---

### How to brief Claude with this file

When asking for a new section, page, or asset, point to this file and specify *which section* it's for (hero-style big-statement layout vs. a calmer body section) — the display-type/mono-label contrast and glow accents are hero-intensity choices; other sections should lean more on `paper`/`espresso` structure and less on glow.
