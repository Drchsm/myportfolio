import React, { useState } from 'react';
import techIcons from '../data/techIcons.js';

function TechMark({ icon }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex min-w-max items-center gap-3 transition-opacity duration-200"
      style={{ opacity: hovered ? 1 : 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon.monogram ? (
        <span
          className="grid h-[18px] w-[18px] place-items-center border border-current font-mono text-[9px] font-bold leading-none"
          style={{ color: hovered ? 'rgb(var(--sand))' : 'rgb(var(--taupe))' }}
        >
          {icon.monogram}
        </span>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px] shrink-0 transition-colors duration-200"
          style={{ fill: hovered ? icon.hex : 'rgb(var(--sand))' }}
          role="img"
          aria-hidden="true"
        >
          <path d={icon.path} />
        </svg>
      )}
      <span className="whitespace-nowrap text-sm font-black tracking-[-0.02em] text-bone/70">
        {icon.name}
      </span>
    </div>
  );
}

/**
 * Infinite tool-logo ticker. Icons are inlined SVG from src/data/techIcons.js,
 * so the row costs zero network requests and recolouring is a token change.
 *
 * `slice` lets the two rows carry different halves of the list instead of
 * showing the same 56 marks twice.
 */
function LogoMarquee({ reverse = false, slice = [0, techIcons.length] }) {
  const source = techIcons.slice(slice[0], slice[1]);
  // Duplicated once so the -50% translate loops seamlessly.
  const track = [...source, ...source];

  return (
    <div className="marquee-mask group relative overflow-hidden border-y border-bone/10 py-5">
      <div
        className={`flex w-max gap-10 group-hover:[animation-play-state:paused] ${
          reverse ? 'animate-marqueeReverse' : 'animate-marqueeWide'
        }`}
      >
        {track.map((icon, index) => (
          // The second copy is decorative — without this a screen reader
          // announces every tool name twice.
          <div key={`${icon.name}-${index}`} aria-hidden={index >= source.length || undefined}>
            <TechMark icon={icon} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoMarquee;
