import { Github, Linkedin, Menu, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { NAV_LINKS, SECTIONS } from '../data/sections.js';
import { GITHUB_URL, LINKEDIN_URL } from '../data/profile.js';

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('top');
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section owns the viewport so the matching link can be marked.
  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Escape closes the mobile sheet and returns focus to the toggle.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-slateLine/70 bg-espresso/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="editorial-shell flex h-20 items-center justify-between">
        <span className="text-sm font-black leading-none tracking-tight text-bone">
          Hendrich Capalaran
        </span>

        {/* No social icons here — the hero already pairs them with "View work". */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={active ? 'true' : undefined}
                className={`focus-ring group rounded-sm px-1 py-2 text-sm font-bold transition ${
                  active ? 'text-sand' : 'text-bone/70 hover:text-bone'
                }`}
              >
                <span className="mr-2 font-mono text-[10px] tracking-[0.2em] text-bone/35">
                  {link.n}
                </span>
                {link.label}
                <span
                  className={`mt-1 block h-px origin-left transition-transform duration-300 ${
                    active ? 'scale-x-100 bg-sand' : 'scale-x-0 bg-bone/50 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-sand/20 bg-espresso/70 text-bone backdrop-blur md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="editorial-shell pb-5 md:hidden">
          <div className="grid gap-2 border border-sand/15 bg-espresso/95 p-3 backdrop-blur-xl">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                aria-current={activeId === link.id ? 'true' : undefined}
                className={`flex min-h-11 items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] transition hover:bg-bone/10 ${
                  activeId === link.id ? 'text-sand' : 'text-bone/80'
                }`}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-bone/40">{link.n}</span>
                {link.label}
              </a>
            ))}
            <div className="mt-1 flex gap-2 border-t border-sand/10 pt-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-2 border border-sand/15 text-sm font-bold text-bone/80"
              >
                <Github size={17} /> GitHub
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-2 border border-sand/15 text-sm font-bold text-bone/80"
              >
                <Linkedin size={17} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
