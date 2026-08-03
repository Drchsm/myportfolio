import React, { useCallback, useEffect, useMemo, useRef } from 'react';

const DEFAULT_COLS = 6;
const DEFAULT_ROWS = 10;

/**
 * Continuous "tile breaking" hover, matching the reference markup: a fixed
 * grid of tiles, each holding an oversized slice of the photo positioned via
 * left/top offsets (not background-size), clipped by the tile's own
 * overflow-hidden. Shrinking a tile with `transform: scale()` pulls its slice
 * away from the grid cell's edges, opening a crack that reveals the
 * container's own background — so tiles near the pointer visibly separate
 * from their neighbours and the rest of the photo stays intact.
 *
 * This tracks the pointer live rather than firing a one-shot animation: every
 * pointermove recomputes each tile's distance to the cursor and eases its
 * scale toward that target. Only `transform` changes, so it's GPU-composited
 * and never touches layout even across 60 tiles.
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

  const tiles = useMemo(
    () =>
      Array.from({ length: cols * rows }, (_, i) => ({
        i,
        col: i % cols,
        row: Math.floor(i / cols)
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
      if (motion.matches) reset();
    };
    sync();
    motion.addEventListener('change', sync);
    return () => motion.removeEventListener('change', sync);
  }, [reset]);

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
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          filter: 'brightness(0.86) contrast(1.02)'
        }}
      >
        {tiles.map((tile, index) => (
          <div
            key={tile.i}
            ref={(el) => {
              tileRefs.current[index] = el;
            }}
            className="relative overflow-hidden transition-transform duration-300 ease-out will-change-transform"
          >
            <div
              className="absolute bg-cover"
              style={{
                width: `${cols * 100}%`,
                height: `${rows * 100}%`,
                left: `${-tile.col * 100}%`,
                top: `${-tile.row * 100}%`,
                backgroundImage: `url(${src})`,
                backgroundPosition: 'center'
              }}
            />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

export default TileBreakPhoto;
