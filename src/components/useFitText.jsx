import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const PROBE_SIZE = 100;

/**
 * Scales a single line of text so it exactly fills its container's width.
 *
 * clamp()/vw can't do this — glyph widths vary by string, so the same vw value
 * that fits "DAVID BATO-BATO" leaves a gap after "HENDRICH CAPALARAN". This
 * measures instead: render at a known probe size, read the natural width once,
 * then scale by the ratio.
 *
 * The resolved size is written to the node directly rather than through state.
 * Routing it through state breaks on re-measure: when the recomputed value
 * equals the current one React bails out of the render, and the probe size the
 * measurement wrote stays on the element.
 *
 * Returns { containerRef, textRef, ready }.
 */
function useFitText(text) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const node = textRef.current;
    if (!container || !node) return;

    // Write the probe size, then do every read together — no interleaved
    // read/write, so this costs one layout pass rather than two.
    //
    // width:max-content matters: scrollWidth and the rendered box are both
    // capped at the container width, so a string narrower than its container
    // would measure as an exact fit and the scale factor would come out as 1.
    node.style.fontSize = `${PROBE_SIZE}px`;
    node.style.width = 'max-content';

    const natural = node.getBoundingClientRect().width;
    const available = container.clientWidth;

    node.style.width = '';

    if (!natural || !available) {
      // Never leave the probe size applied — it would render enormous.
      node.style.fontSize = '';
      return;
    }

    node.style.fontSize = `${PROBE_SIZE * (available / natural)}px`;
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    // ResizeObserver alone is not enough — it does not reliably fire when the
    // viewport itself is resized, which would leave the previous breakpoint's
    // font size applied and overflow the container.
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);

    // Webfonts land after first paint and change every metric.
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
    };
  }, [measure]);

  return { containerRef, textRef, ready };
}

export default useFitText;
