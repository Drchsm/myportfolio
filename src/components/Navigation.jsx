import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import Logo from './Logo.jsx';

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-steel/10 bg-espresso/65 backdrop-blur-md">
      <nav className="editorial-shell flex h-20 items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="focus-ring rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sand transition hover:bg-bone/10 hover:text-bone"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="focus-ring hidden rounded-full border border-steel/20 bg-bone px-5 py-2.5 text-xs font-black uppercase tracking-[0.22em] text-espresso transition hover:-translate-y-0.5 hover:bg-steel md:inline-flex"
        >
          Start
        </a>
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-steel/20 text-bone md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div className="editorial-shell pb-5 md:hidden">
          <div className="glass-panel grid gap-2 rounded-2xl p-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-sand transition hover:bg-bone/10 hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
