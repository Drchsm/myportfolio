import React, { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, MapPin } from 'lucide-react';
import { images } from '../../PhotosForPortfolio';
import { GITHUB_URL, LINKEDIN_URL } from '../data/profile.js';
import TileBreakPhoto from '../components/TileBreakPhoto.jsx';
import SectionIndex from '../components/SectionIndex.jsx';
import useFitText from '../components/useFitText.jsx';

/** One line of the name, scaled to fill its container exactly. */
function FitLine({ text, className = '' }) {
  const { containerRef, textRef, ready } = useFitText(text);

  return (
    <span ref={containerRef} className={`block w-full ${className}`}>
      <span
        ref={textRef}
        className="block whitespace-nowrap transition-opacity duration-300"
        style={{ opacity: ready ? 1 : 0 }}
      >
        {text}
      </span>
    </span>
  );
}

function Hero() {
  // One name line on >=sm, two stacked below it. Driven by state rather than
  // CSS visibility so only the variant in use is mounted — a hidden FitLine
  // measures against a zero-width container and can never scale correctly.
  const [oneLine, setOneLine] = useState(true);

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

      <div className="absolute inset-y-0 left-0 w-full opacity-40 lg:w-[38vw] lg:opacity-80">
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
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,40,49,0.08),rgba(34,40,49,0.96)_88%),linear-gradient(180deg,rgba(34,40,49,0.18),rgba(0,0,0,0.72))]" />
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

        <div
          className="pointer-events-auto relative z-10 flex flex-col justify-center pt-14 lg:col-start-2 lg:pl-16"
          data-reveal
        >
          <div className="flex items-center gap-4">
            <a
              href="#work"
              className="focus-ring inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3 text-sm font-bold text-espresso shadow-[0_0_0_rgba(245,158,11,0)] transition hover:-translate-y-0.5 hover:bg-sand hover:shadow-[0_8px_28px_rgb(var(--glow-amber)/0.35)]"
            >
              View work <ArrowDown size={16} />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="focus-ring grid h-11 w-11 place-items-center rounded-full text-bone/55 transition hover:text-bone"
            >
              <Github size={24} />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="focus-ring grid h-11 w-11 place-items-center rounded-full text-bone/55 transition hover:text-bone"
            >
              <Linkedin size={24} />
            </a>
          </div>

          <p className="mt-10 max-w-[640px] text-[clamp(1.5rem,2.2vw,2.4rem)] font-bold leading-[1.28] tracking-[-0.035em] text-bone/70">
            I build{' '}
            <span className="bg-gradient-to-r from-glowAmber to-glowCopper bg-clip-text text-transparent">
              AI automation systems
            </span>{' '}
            end to end, turning scattered business operations into dependable systems people
            actually use.
          </p>

          <p className="mt-8 flex items-center gap-2 text-sm font-semibold italic text-bone/50">
            <span className="h-1.5 w-1.5 rounded-full bg-glowCyan shadow-[0_0_10px_2px_rgb(var(--glow-cyan)/0.8)]" />
            AI automation specialist · operations &amp; systems
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[var(--shell-max)]">
            <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-sand/65">
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
                  <FitLine text="HENDRICH CAPALARAN" />
                ) : (
                  <>
                    <FitLine text="HENDRICH" />
                    <FitLine text="CAPALARAN" />
                  </>
                )}
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-gradient-to-r from-glowAmber via-glowCopper to-glowEmerald shadow-[0_0_24px_rgba(245,158,11,0.4)]" />
    </section>
  );
}

export default Hero;
