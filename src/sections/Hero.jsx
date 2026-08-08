import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Github, Linkedin, MapPin } from 'lucide-react';
import { images } from '../../PhotosForPortfolio';
import { GITHUB_URL, LINKEDIN_URL } from '../data/profile.js';
import TileBreakPhoto from '../components/TileBreakPhoto.jsx';
import SectionIndex from '../components/SectionIndex.jsx';
import useFitText from '../components/useFitText.jsx';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const LETTER_STEP_MS = 20; // delay between consecutive letters
const LETTER_ENTER_MS = 520; // one letter's own fade/rise
const ITEM_STEP_MS = 90; // delay between consecutive top-level resources
const ITEM_ENTER_MS = 560; // one resource's own fade/rise

/** True once the visitor's OS asks for reduced motion; stays in sync with changes. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}

/** Flips true one frame after mount — enough for the hidden state to paint first. */
function useMountReveal(reduced) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduced) {
      setStarted(true);
      return undefined;
    }
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return started;
}

/**
 * One line of the name, scaled to fill its container exactly, then revealed
 * letter by letter once sized. Splitting only happens after `useFitText` has
 * already measured — it reads the rendered natural width regardless of
 * whether that width comes from one text node or many adjacent spans, so the
 * fit math doesn't change.
 *
 * Each letter sits in a small `overflow-hidden` mask exactly its own size; the
 * letter itself starts translated below that mask (so it's clipped out of
 * view) and slides up into place. That's a mask-reveal, not a fade — the
 * letter is either fully hidden behind its own baseline or fully in place,
 * never half-transparent mid-flight.
 */
function FitLine({ text, className = '', reduced }) {
  const { containerRef, textRef, ready } = useFitText(text);
  // Hook called unconditionally every render (Rules of Hooks); readiness is
  // folded into `started` afterwards so letters stay hidden until both the
  // fit measurement and the mount timer have resolved.
  const mountStarted = useMountReveal(reduced);
  const started = ready && mountStarted;
  const letters = useMemo(() => Array.from(text), [text]);

  return (
    <span ref={containerRef} className={`block w-full ${className}`}>
      <span ref={textRef} className="block whitespace-nowrap">
        {letters.map((char, index) => {
          const delay = index * LETTER_STEP_MS;
          return (
            <span
              key={index}
              aria-hidden="true"
              className="inline-block overflow-hidden align-top"
              style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
            >
              <span
                className="inline-block will-change-transform"
                style={{
                  transform: started ? 'translateY(0%)' : 'translateY(115%)',
                  transitionProperty: 'transform',
                  transitionDuration: reduced ? '0ms' : `${LETTER_ENTER_MS}ms`,
                  transitionTimingFunction: EASE,
                  transitionDelay: reduced ? '0ms' : `${delay}ms`
                }}
              >
                {char}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/** Inline style for a top-level Hero resource's fade + rise, ordered by `order`. */
function revealStyle(order, started, reduced) {
  const delay = order * ITEM_STEP_MS;
  return {
    opacity: started ? 1 : 0,
    transform: started ? 'translateY(0)' : 'translateY(18px)',
    transitionProperty: 'opacity, transform',
    transitionDuration: reduced ? '0ms, 0ms' : `${ITEM_ENTER_MS}ms, ${ITEM_ENTER_MS}ms`,
    transitionTimingFunction: `${EASE}, ${EASE}`,
    transitionDelay: reduced ? '0ms, 0ms' : `${delay}ms, ${delay}ms`
  };
}

function Hero() {
  // One name line on >=sm, two stacked below it. Driven by state rather than
  // CSS visibility so only the variant in use is mounted — a hidden FitLine
  // measures against a zero-width container and can never scale correctly.
  const [oneLine, setOneLine] = useState(true);

  // Drives the entrance cascade for every resource below: the CTA/social
  // icons, both paragraphs, the location line, and the accent bar all fade
  // and rise in on this one shared timeline, ordered top to bottom. The name
  // and photo run their own finer-grained (per-letter / per-tile) timelines
  // in parallel, started by the same reduced-motion signal.
  const reduced = usePrefersReducedMotion();
  const started = useMountReveal(reduced);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 640px)');
    const sync = () => setOneLine(query.matches);
    sync();
    query.addEventListener('change', sync);
    // Belt and braces: rotation on some devices resizes without re-firing the
    // media query listener, and a missed flip leaves the wrong line count.
    window.addEventListener('resize', sync);
    return () => {
      query.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-20">
      {/* Ambient glow blobs sit behind everything else. Kept near-black —
          just enough accent undertone to read as lit, not a color wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-[42rem] w-[42rem] rounded-full bg-glowAmber/8 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-glowEmerald/8 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full bg-glowCopper/8 blur-[130px]"
      />

      <div className="absolute inset-y-0 left-0 w-full opacity-60 lg:w-[38vw] lg:opacity-100">
        {/* Solid photo at rest. Moving the pointer over it cracks the grid
            apart around the cursor — tiles near it shrink and reseal once
            the pointer leaves. */}
        <TileBreakPhoto
          src={images.MyPhoto}
          alt="Hendrich Capalaran"
          cols={6}
          rows={10}
          className="h-full w-full"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,40,49,0.04),rgba(34,40,49,0.85)_94%),linear-gradient(180deg,rgba(34,40,49,0.08),rgba(0,0,0,0.5))]" />
        </TileBreakPhoto>
      </div>

      {/*
        Right column deliberately much wider than the photo column.
        pointer-events-none is load-bearing: this grid is painted over the
        photo and would otherwise swallow every hover before it reaches the
        portrait, so the reveal would never fire. Interactive descendants
        opt back in with pointer-events-auto.
      */}
      <div className="pointer-events-none relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-[var(--shell-max)] px-5 pb-8 sm:px-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:px-10">
        <div className="pointer-events-none absolute inset-x-10 top-24 hidden lg:block lg:w-[calc(38vw-5rem)]">
          <SectionIndex id="top" />
        </div>

        <div className="pointer-events-auto relative z-10 flex flex-col justify-center pt-14 lg:col-start-2 lg:pl-16">
          <div className="flex items-center gap-4">
            <a
              href="#work"
              style={revealStyle(0, started, reduced)}
              className="focus-ring inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3 text-sm font-bold text-espresso shadow-[0_0_0_rgba(245,158,11,0)] transition hover:-translate-y-0.5 hover:bg-sand hover:shadow-[0_8px_28px_rgb(var(--glow-amber)/0.35)]"
            >
              View work <ArrowDown size={16} />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              style={revealStyle(1, started, reduced)}
              className="focus-ring grid h-11 w-11 place-items-center rounded-full text-bone/55 transition hover:text-bone"
            >
              <Github size={24} />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              style={revealStyle(2, started, reduced)}
              className="focus-ring grid h-11 w-11 place-items-center rounded-full text-bone/55 transition hover:text-bone"
            >
              <Linkedin size={24} />
            </a>
          </div>

          <p
            style={revealStyle(3, started, reduced)}
            className="mt-10 max-w-[640px] text-[clamp(1.5rem,2.2vw,2.4rem)] font-bold leading-[1.28] tracking-[-0.035em] text-bone/70"
          >
            I build{' '}
            <span className="bg-gradient-to-r from-glowAmber to-glowCopper bg-clip-text text-transparent">
              AI automation systems
            </span>{' '}
            end to end, turning scattered business operations into dependable systems people
            actually use.
          </p>

          <p
            style={revealStyle(4, started, reduced)}
            className="mt-8 flex items-center gap-2 text-sm font-semibold italic text-bone/50"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-glowCyan shadow-[0_0_10px_2px_rgb(var(--glow-cyan)/0.8)]" />
            AI automation specialist · Junior developer
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[var(--shell-max)]">
            <p
              style={revealStyle(5, started, reduced)}
              className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-sand/65"
            >
              <MapPin size={14} /> Philippines / Remote
            </p>
            {/* Fitted to the container width rather than clamped to a vw guess,
                so it lands flush edge-to-edge at every breakpoint. */}
            <h1
              aria-label="Hendrich Capalaran"
              className="pointer-events-none font-display font-black uppercase leading-[0.82] tracking-[-0.075em] text-bone"
            >
              <span aria-hidden="true" className="block">
                {oneLine ? (
                  <FitLine text="HENDRICH CAPALARAN" reduced={reduced} />
                ) : (
                  <>
                    <FitLine text="HENDRICH" reduced={reduced} />
                    <FitLine text="CAPALARAN" reduced={reduced} />
                  </>
                )}
              </span>
            </h1>
          </div>
        </div>
      </div>
      {/* Draws itself in last, like an underline finishing the cascade. */}
      <div
        aria-hidden="true"
        style={{
          transform: started ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transitionProperty: 'transform',
          transitionDuration: reduced ? '0ms' : `${ITEM_ENTER_MS}ms`,
          transitionTimingFunction: EASE,
          transitionDelay: reduced ? '0ms' : `${6 * ITEM_STEP_MS}ms`
        }}
        className="absolute bottom-0 left-0 right-0 h-[5px] bg-gradient-to-r from-glowAmber via-glowCopper to-glowEmerald shadow-[0_0_24px_rgba(245,158,11,0.4)]"
      />
    </section>
  );
}

export default Hero;
