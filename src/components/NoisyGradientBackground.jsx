import React, { useEffect, useRef } from 'react';

function Noise({
  patternSize = 96,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 4,
  patternAlpha = 18,
  intensity = 0.72,
}) {
  const grainRef = useRef(null);
  const canvasCssSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;

    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return;

    const patternData = patternCtx.createImageData(patternSize, patternSize);
    const patternPixelDataLength = patternSize * patternSize * 4;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parentRect = canvas.parentElement?.getBoundingClientRect();
      const width = parentRect?.width || window.innerWidth;
      const height = parentRect?.height || window.innerHeight;

      canvasCssSizeRef.current = { width, height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updatePattern = () => {
      for (let i = 0; i < patternPixelDataLength; i += 4) {
        const value = Math.random() * 255 * intensity;
        patternData.data[i] = value;
        patternData.data[i + 1] = value;
        patternData.data[i + 2] = value;
        patternData.data[i + 3] = patternAlpha;
      }
      patternCtx.putImageData(patternData, 0, 0);
    };

    const drawGrain = () => {
      const { width, height } = canvasCssSizeRef.current;
      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      const safeScaleX = Math.max(0.001, patternScaleX);
      const safeScaleY = Math.max(0.001, patternScaleY);
      ctx.scale(safeScaleX, safeScaleY);

      const fillPattern = ctx.createPattern(patternCanvas, 'repeat');
      if (fillPattern) {
        ctx.fillStyle = fillPattern;
        ctx.fillRect(0, 0, width / safeScaleX, height / safeScaleY);
      }
      ctx.restore();
    };

    // Grain only needs to read as "alive", not as 60fps. Redrawing on a time
    // budget instead of a frame count keeps cost stable across refresh rates.
    const minFrameMs = (1000 / 60) * patternRefreshInterval;
    let lastDraw = 0;

    const loop = (now) => {
      if (now - lastDraw >= minFrameMs) {
        updatePattern();
        drawGrain();
        lastDraw = now;
      }
      animationFrameId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (animationFrameId) return;
      animationFrameId = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    // A CSS reduced-motion rule can't reach a JS rAF loop, so bail out here too.
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onVisibility = () => (document.hidden || motion.matches ? stop() : start());

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onVisibility);

    resize();
    if (motion.matches) {
      // Paint one static frame rather than animating.
      updatePattern();
      drawGrain();
    } else {
      start();
    }

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onVisibility);
      stop();
    };
  }, [intensity, patternAlpha, patternRefreshInterval, patternScaleX, patternScaleY, patternSize]);

  return <canvas ref={grainRef} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />;
}

function NoisyGradientBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden bg-espresso ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_18%_8%,rgba(223,208,184,0.16),transparent_44%),radial-gradient(ellipse_64%_54%_at_86%_18%,rgba(148,137,121,0.18),transparent_42%),linear-gradient(135deg,rgba(57,62,70,0.72)_0%,rgba(34,40,49,0.08)_38%,rgba(34,40,49,0.86)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(223,208,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(223,208,184,0.035)_1px,transparent_1px)] bg-[size:76px_76px] opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_115%,rgba(148,137,121,0.2),transparent_42%),linear-gradient(180deg,rgba(34,40,49,0)_0%,rgba(34,40,49,0.44)_74%,rgba(34,40,49,0.86)_100%)]" />
      <Noise />
    </div>
  );
}

export default NoisyGradientBackground;
