import React, { useEffect, useRef, useState } from 'react';
import { TOTAL, sectionById } from '../data/sections.js';
import useScrambleText from './useScrambleText.jsx';

/**
 * The `NN / 07` kicker. Numbers come from src/data/sections.js so the
 * sequence stays in order no matter how sections are rearranged.
 */
function SectionIndex({ id, tone = 'dark', className = '' }) {
  const section = sectionById(id);
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSeen(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const number = useScrambleText(section?.n ?? '', seen);

  if (!section) return null;

  const muted = tone === 'light' ? 'text-paperMute' : 'text-bone/40';
  const accent = tone === 'light' ? 'text-paperInk' : 'text-sand';

  return (
    // Announced via aria-label rather than an sr-only span. An sr-only span is
    // still real text in the document, so it ran together with the label beside
    // it when selected or read aloud ("...HomeMNL . 14.6 N").
    <p
      ref={ref}
      aria-label={`Section ${section.n} of ${TOTAL}: ${section.label}`}
      className={`font-mono text-xs font-bold uppercase tracking-[0.36em] ${muted} ${className}`}
    >
      <span aria-hidden="true">
        <span className={accent}>{number || section.n}</span> / {TOTAL}
      </span>
    </p>
  );
}

export default SectionIndex;
