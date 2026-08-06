import { Github, Linkedin, Mail, Send } from 'lucide-react';
import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';
import SectionIndex from '../components/SectionIndex.jsx';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../data/profile.js';

const socials = [
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: Linkedin },
  { label: 'GitHub', href: GITHUB_URL, icon: Github },
  { label: 'Email', href: `mailto:${EMAIL}`, icon: Mail }
];

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSent(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="bg-umber pb-10 pt-20 text-bone sm:pt-28" data-reveal>
      <div className="editorial-shell">
        <div className="border-y border-bone/10 py-12">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Logo />
              <div className="mt-16">
                <SectionIndex id="contact" />
              </div>
              <h2 className="mt-8 max-w-3xl text-[clamp(3.8rem,7vw,8rem)] font-black leading-[0.82] tracking-[-0.085em]">
                Let's build the workflow that gives your week back.
              </h2>
              <div className="mt-10 flex flex-wrap gap-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="focus-ring inline-flex min-h-11 items-center gap-3 rounded-full border border-bone/10 px-5 py-3 text-sm font-bold text-bone/58 transition hover:border-sand hover:text-sand"
                  >
                    <Icon size={17} /> {label}
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 border border-bone/10 bg-bone/[0.025] p-5 sm:p-7">
              <label className="grid gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-sand/70">Name</span>
                <input required name="name" value={form.name} onChange={updateField} className="focus-ring border border-bone/10 bg-espresso px-4 py-4 text-bone placeholder:text-bone/40" placeholder="Your name" />
              </label>
              <label className="grid gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-sand/70">Email</span>
                <input required type="email" name="email" value={form.email} onChange={updateField} className="focus-ring border border-bone/10 bg-espresso px-4 py-4 text-bone placeholder:text-bone/40" placeholder="you@example.com" />
              </label>
              <label className="grid gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-sand/70">Message</span>
                <textarea required name="message" value={form.message} onChange={updateField} rows="7" className="focus-ring resize-none border border-bone/10 bg-espresso px-4 py-4 text-bone placeholder:text-bone/40" placeholder="Tell me what needs to be automated, organized, or rebuilt." />
              </label>
              {/*
                text-charcoal was a token that no longer exists, so the label had
                no colour of its own; espresso is the palette equivalent.
                self-start / justify-self-start matter too: the form stretches to
                match the column beside it and hands the slack to its auto rows,
                so without these the button inflates on both axes.
              */}
              <button
                type="submit"
                className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 self-start rounded-full bg-bone px-5 text-[13px] font-bold tracking-[-0.01em] text-espresso transition hover:-translate-y-0.5 hover:bg-sand sm:w-max sm:justify-self-start"
              >
                Send inquiry <Send size={15} />
              </button>
              {sent && <p className="text-sm font-bold text-sand">Message logged locally. Connect a form endpoint when ready.</p>}
            </form>
          </div>
        </div>

        <footer className="flex flex-col justify-between gap-3 pt-6 font-mono text-xs uppercase tracking-[0.24em] text-bone/35 sm:flex-row">
          <span>Hendrich Capalaran</span>
          <span>AI Automation . Operations . Remote Systems</span>
        </footer>
      </div>
    </section>
  );
}

export default Contact;
