import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_COLS = 6;
const DEFAULT_ROWS = 10;

// Solid tile-pop entrance: every tile starts at scale(0) — truly zero size,
// opacity untouched at 1 throughout — and pops to scale(1) in place. Each
// tile rolls its own random delay inside POP_WINDOW_MS so the reveal order
// reads as unpredictable rather than a row-by-row or center-out sweep; the
// window plus POP_DURATION_MS means the whole grid finishes in ~1.7s.
const POP_DURATION_MS = 300;
const POP_WINDOW_MS = 1400;
const POP_EASE = 'cubic-bezier(0, 0, 0.2, 1)';

// Tiling-seam bleed: adjacent tiles' clip boxes meet at a fractional-pixel
// edge with nothing behind them, and antialiasing there can leave a
// hairline gap showing the dark page through. Growing each tile's clipped
// layer by BLEED_PX on every side makes neighbours' pixel content physically
// overlap, so there's nothing left uncovered — the photo offset below is
// shifted by the same amount to compensate, so the image itself doesn't move.
const BLEED_PX = 1;

/**
 * Continuous "tile breaking" hover: a fixed grid of tiles, each holding an
 * oversized slice of the photo positioned via left/top offsets (not
 * background-size), clipped by the tile's own overflow-hidden. Shrinking a
 * tile with `transform: scale()` pulls its slice away from the grid cell's
 * edges, opening a crack that reveals the container's own background — so
 * tiles near the pointer visibly separate from their neighbours and the rest
 * of the photo stays intact.
 *
 * This tracks the pointer live rather than firing a one-shot animation: every
 * pointermove recomputes each tile's distance to the cursor and eases its
 * scale toward that target. Only `transform` changes, so it's GPU-composited
 * and never touches layout even across 60 tiles.
 *
 * The photo itself stays true color — a light darken/contrast is all that's
 * applied here, matching the site's dark-editorial tone rather than a
 * grayscale-plus-tint treatment. `children` renders on top for the vignette.
 *
 * On mount, tiles also run the solid tile-pop reveal described above. That
 * scale lives on its own wrapper per tile (not the grid-cell wrapper the
 * hover crack imperatively transforms) so the two effects never fight over
 * the same `transform` — the hover crack keeps working exactly as before,
 * both during and after the pop.
 */
function TileBreakPhoto({
  src,
  alt = '',
  cols = DEFAULT_COLS,
  rows = DEFAULT_ROWS,
  minScale = 0.74,
  radiusRatio = 0.4,
  className = '',
  children
}) {
  const containerRef = useRef(null);
  const tileRefs = useRef([]);
  const frameRef = useRef(0);
  const enabledRef = useRef(true);
  const [reduced, setReduced] = useState(false);
  const [revealed, setRevealed] = useState(false);
  // Real pixel size of the container, not CSS percentages. `grid-template-
  // columns: repeat(cols, 1fr)` rounds individual tracks to whole device
  // pixels, so when the container width doesn't divide evenly by `cols`
  // some tiles land 1px wider than others. Each tile's photo layer used to
  // be sized as a percentage *of its own tile box*, so that 1px track
  // difference gave neighbouring tiles very slightly different scale
  // factors for the same photo — a hairline seam at exactly that boundary.
  // Measuring the container once and sizing every tile's photo layer off
  // that single shared value removes the per-tile dependency entirely.
  const [size, setSize] = useState({ width: 0, height: 0 });

  const tiles = useMemo(
    () =>
      Array.from({ length: cols * rows }, (_, i) => ({
        i,
        col: i % cols,
        row: Math.floor(i / cols),
        // Rolled once per mount and never recomputed on re-render, so the
        // reveal doesn't jitter or re-randomize — only a fresh mount (a page
        // reload) draws a new order.
        popDelayMs: Math.random() * POP_WINDOW_MS
      })),
    [cols, rows]
  );

  const reset = useCallback(() => {
    tileRefs.current.forEach((el) => {
      if (el) el.style.transform = 'scale(1)';
    });
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      enabledRef.current = !motion.matches;
      setReduced(motion.matches);
      if (motion.matches) reset();
    };
    sync();
    motion.addEventListener('change', sync);
    return () => motion.removeEventListener('change', sync);
  }, [reset]);

  // Fires once on mount — this photo is always above the fold, so "on load"
  // and "on refresh" are the same moment. Double rAF (rather than one)
  // guarantees the initial scale(0) state has actually painted a frame
  // before `revealed` flips, so the transition reliably fires instead of
  // occasionally being coalesced into the first paint.
  useEffect(() => {
    if (reduced) {
      setRevealed(true);
      return undefined;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [reduced]);

  const applyAt = useCallback(
    (clientX, clientY) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const radius = Math.min(rect.width, rect.height) * radiusRatio;

      tiles.forEach((tile, index) => {
        const el = tileRefs.current[index];
        if (!el) return;
        const cx = ((tile.col + 0.5) / cols) * rect.width;
        const cy = ((tile.row + 0.5) / rows) * rect.height;
        const dist = Math.hypot(px - cx, py - cy);
        const t = radius > 0 ? Math.min(1, dist / radius) : 1;
        // Smoothstep rather than a linear falloff, so the crack has a soft
        // shoulder instead of a visible ring where the radius cuts off.
        const eased = t * t * (3 - 2 * t);
        el.style.transform = `scale(${(minScale + (1 - minScale) * eased).toFixed(3)})`;
      });
    },
    [tiles, cols, rows, radiusRatio, minScale]
  );

  const schedule = useCallback(
    (clientX, clientY) => {
      if (!enabledRef.current) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => applyAt(clientX, clientY));
    },
    [applyAt]
  );

  const handlePointerLeave = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    reset();
  }, [reset]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden ${className}`}
      onPointerMove={(event) => schedule(event.clientX, event.clientY)}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 grid"
        style={{
          // Pixel tracks, not `1fr`: `1fr` lets the browser round each
          // column/row independently, which can land a tile's own clip
          // edge a hair off from where its photo layer is positioned (see
          // the photo-slice math below) — invisible at rest, but shows up
          // as a hairline seam at whichever boundary the rounding disagrees
          // most. Deriving both from the same measured `size` value keeps
          // the clip box and the photo content in exact agreement.
          gridTemplateColumns: size.width ? `repeat(${cols}, ${size.width / cols}px)` : `repeat(${cols}, 1fr)`,
          gridTemplateRows: size.height ? `repeat(${rows}, ${size.height / rows}px)` : `repeat(${rows}, 1fr)`,
          filter: 'brightness(0.86) contrast(1.02)'
        }}
      >
        {tiles.map((tile, index) => (
          <div
            key={tile.i}
            ref={(el) => {
              tileRefs.current[index] = el;
            }}
            // No overflow-hidden here — the pop wrapper below is the one
            // clip boundary that matters (and it deliberately overhangs
            // its cell by BLEED_PX; see below). This box's size/position
            // is still what the hover crack scales.
            className="relative transition-transform duration-300 ease-out"
          >
            {/*
              Pop wrapper: scaling it from 0 to 1 grows around its own
              center — i.e. the cell's center, not the (much larger)
              photo's. Kept as its own layer, separate from the grid-cell
              div above (owned imperatively by the hover crack) so the two
              transforms never collide.

              Sized BLEED_PX larger than the cell on every side (`inset:
              -1px` instead of `inset-0`) rather than clipped exactly to
              it: two adjacent tiles' clip edges otherwise meet at a
              fractional-pixel boundary with nothing behind them, and
              antialiasing there can leave a hairline gap showing the dark
              page through. Overhanging means neighbours' photo content
              physically overlaps at the seam instead.
            */}
            <div
              className="absolute overflow-hidden"
              style={{
                inset: `-${BLEED_PX}px`,
                opacity: 1,
                transform: revealed ? 'scale(1)' : 'scale(0)',
                transitionProperty: 'transform',
                transitionDuration: reduced ? '0ms' : `${POP_DURATION_MS}ms`,
                transitionTimingFunction: POP_EASE,
                transitionDelay: reduced ? '0ms' : `${tile.popDelayMs.toFixed(0)}ms`
              }}
            >
              <div
                className="absolute bg-cover"
                style={
                  size.width && size.height
                    ? {
                        // Pixel-exact: every tile's photo layer is the same
                        // measured container size, offset by the same
                        // fractional-pixel step — no per-tile rounding, so
                        // no seam. The extra `+ BLEED_PX` compensates for
                        // the pop wrapper's own origin having shifted by
                        // `-BLEED_PX` (its `inset` above), so the photo
                        // itself doesn't move — only its clip box grew.
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        left: `${-tile.col * (size.width / cols) + BLEED_PX}px`,
                        top: `${-tile.row * (size.height / rows) + BLEED_PX}px`,
                        backgroundImage: `url(${src})`,
                        backgroundPosition: 'center'
                      }
                    : {
                        // Before the first ResizeObserver measurement lands
                        // (one frame), fall back to the old percentage math
                        // so there's still a photo to see.
                        width: `${cols * 100}%`,
                        height: `${rows * 100}%`,
                        left: `${-tile.col * 100}%`,
                        top: `${-tile.row * 100}%`,
                        backgroundImage: `url(${src})`,
                        backgroundPosition: 'center'
                      }
                }
              />
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

export default TileBreakPhoto;
