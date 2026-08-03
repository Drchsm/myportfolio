import React from 'react';
import { PRIMARY_SOCIAL_URL } from '../data/profile.js';

// The source PNG has no alpha — it carries an opaque #1c232b square. Matching
// the container to that colour hides the seam instead of framing it.
const MARK_BG = '#1c232b';

function Logo({ compact = false }) {
  return (
    <a
      href={PRIMARY_SOCIAL_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Hendrich Capalaran on LinkedIn"
      className="group inline-flex items-center gap-3 focus-ring rounded-full"
    >
      <span
        className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl ring-1 ring-inset ring-bone/10 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
        style={{ backgroundColor: MARK_BG }}
      >
        <img src="/logo-256.png" alt="" width="40" height="40" className="h-full w-full scale-[1.06] object-cover" />
      </span>
      {!compact && (
        <span className="hidden text-sm font-black leading-none tracking-tight text-bone sm:block">
          Hendrich Capalaran
        </span>
      )}
    </a>
  );
}

export default Logo;
