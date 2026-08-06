import React, { useEffect, useMemo, useRef, useState } from 'react';
import { seededOrder } from './staggerOrder.js';

const ENTER_MS = 520; // wall-clock time for the whole grid to resolve
const EXIT_MS = 340; // ~65% of enter — exits should feel faster than entrances
const CELL_ENTER_MS = 260; // one cell's own fade; the rest of ENTER_MS is stagger
const CELL_EXIT_MS = 170;
const MAX_CELLS = 240;

/**
 * Block Matrix / Pixel Reveal.
 *
 * Rest state is the graded (grayscale) photo. On hover, a grid of cells
 * carrying the ungraded photo resolves in a scattered order. Every cell
 * references the same image URL, so the browser decodes it once no matter how
 * many cells there are, and only opacity + transform animate — nothing here
 * touches layout.
 */
function PixelRevealImage({
  src,
  alt = '',
  cols = 12,
  rows = 16,
  className = '',
  imgClassName = '',
  restClassName = 'grayscale',
  children
}) {
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const ref = useRef(null);

  const cells = useMemo(() => {
    let c = cols;
    let r = rows;
    while (c * r > MAX_CELLS) {
      c = Math.max(1, Math.round(c * 0.85));
      r = Math.max(1, Math.round(r * 0.85));
    }
    const count = c * r;
    const rank = seededOrder(count);
    // Spread the stagger over whatever ENTER_MS is left after one cell's fade,
    // so the last cell finishes exactly at ENTER_MS.
    const spread = Math.max(0, ENTER_MS - CELL_ENTER_MS);

    return Array.from({ length: count }, (_, i) => ({
      key: i,
      col: i % c,
      row: Math.floor(i / c),
      delay: count > 1 ? (rank[i] / (count - 1)) * spread : 0,
      cols: c,
      rows: r
    }));
  }, [cols, rows]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(pointer: coarse)');
    const sync = () => {
      setReduced(motion.matches);
      setCoarse(pointer.matches);
    };
    sync();
    motion.addEventListener('change', sync);
    pointer.addEventListener('change', sync);
    return () => {
      motion.removeEventListener('change', sync);
      pointer.removeEventListener('change', sync);
    };
  }, []);

  // Touch devices have no hover — play the reveal once when it scrolls in.
  useEffect(() => {
    if (!coarse || !ref.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [coarse]);

  const hoverProps = coarse
    ? {}
    : {
        onMouseEnter: () => setActive(true),
        onMouseLeave: () => setActive(false),
        onFocus: () => setActive(true),
        onBlur: () => setActive(false)
      };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} {...hoverProps}>
      {/* Rest layer stays graded so resolved cells read as colour on grey. */}
      <img src={src} alt={alt} className={`h-full w-full object-cover ${restClassName} ${imgClassName}`} />

      {/* Decorative reveal layer — the <img> above carries the real alt text. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {reduced ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-200"
            style={{ backgroundImage: `url(${src})`, opacity: active ? 1 : 0 }}
          />
        ) : (
          cells.map(({ key, col, row, delay, cols: c, rows: r }) => (
            <span
              key={key}
              className="absolute will-change-[opacity,transform]"
              style={{
                left: `${(col / c) * 100}%`,
                top: `${(row / r) * 100}%`,
                // +0.4% bleed closes the sub-pixel seams between cells.
                width: `${100 / c + 0.4}%`,
                height: `${100 / r + 0.4}%`,
                backgroundImage: `url(${src})`,
                backgroundSize: `${c * 100}% ${r * 100}%`,
                backgroundPosition: `${c > 1 ? (col / (c - 1)) * 100 : 0}% ${
                  r > 1 ? (row / (r - 1)) * 100 : 0
                }%`,
                opacity: active ? 1 : 0,
                transform: active ? 'scale(1)' : 'scale(0.88)',
                // Longhand rather than the `transition` shorthand: React warns
                // when a shorthand and its longhand are both set on rerender.
                transitionProperty: 'opacity, transform',
                transitionDuration: active
                  ? `${CELL_ENTER_MS}ms, ${CELL_ENTER_MS}ms`
                  : `${CELL_EXIT_MS}ms, ${CELL_EXIT_MS}ms`,
                transitionTimingFunction: 'ease-out, cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: (() => {
                  const d = active ? delay : delay * (EXIT_MS / ENTER_MS);
                  return `${d}ms, ${d}ms`;
                })()
              }}
            />
          ))
        )}
      </div>

      {children}
    </div>
  );
}

export default PixelRevealImage;
