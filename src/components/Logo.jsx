import React from 'react';

function Logo({ compact = false }) {
  return (
    <a href="#top" className="group inline-flex items-center gap-3 focus-ring rounded-full">
      <span className="grid h-11 w-11 place-items-center rounded-full border border-steel/25 bg-bone text-sm font-black tracking-[-0.04em] text-espresso shadow-[0_12px_34px_rgba(0,0,0,0.28)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        H.C
      </span>
      {!compact && (
        <span className="hidden leading-none sm:block">
          <span className="block text-sm font-black uppercase tracking-[0.18em] text-bone">Hendrich</span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-sand/70">Capalaran</span>
        </span>
      )}
    </a>
  );
}

export default Logo;
