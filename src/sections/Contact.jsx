import { Github, Linkedin, Mail, Send } from 'lucide-react';
import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: Linkedin },
  { label: 'GitHub', href: 'https://github.com/', icon: Github },
  { label: 'Email', href: 'mailto:hello@hendrichcapalaran.com', icon: Mail }
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
    console.log('Portfolio inquiry submitted:', form);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="editorial-shell pb-10 pt-20 sm:pb-12 sm:pt-28" data-reveal>
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <Logo />
          <h2 className="mt-12 font-display text-4xl font-black uppercase leading-[0.92] text-bone sm:text-5xl">
            Build the workflow that gives your week back.
          </h2>
          <p className="mt-6 text-base leading-7 text-sand/82">
            For automation builds, executive support, e-commerce operations, and reliable virtual assistance, send a short note and Hendrich can map the next practical step.
          </p>
          <div className="mt-8 grid gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="focus-ring flex items-center justify-between rounded-2xl border border-steel/12 bg-espresso/45 px-4 py-4 text-sm font-bold text-bone transition hover:border-steel/35 hover:bg-bone/10"
              >
                <span className="inline-flex items-center gap-3">
                  <Icon size={18} className="text-steel" /> {label}
                </span>
                <span className="text-sand/60">Open</span>
              </a>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="section-kicker">Contact</p>
          <div className="mt-7 grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-sand">Name</span>
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                className="focus-ring rounded-2xl border border-steel/14 bg-espresso/65 px-4 py-4 text-bone placeholder:text-sand/40"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-sand">Email</span>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                className="focus-ring rounded-2xl border border-steel/14 bg-espresso/65 px-4 py-4 text-bone placeholder:text-sand/40"
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-sand">Message</span>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={updateField}
                rows="7"
                className="focus-ring resize-none rounded-2xl border border-steel/14 bg-espresso/65 px-4 py-4 text-bone placeholder:text-sand/40"
                placeholder="What workflow, role, or operational bottleneck should we improve?"
              />
            </label>
          </div>
          <button type="submit" className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bone px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-espresso transition hover:bg-steel sm:w-auto">
            Send Inquiry <Send size={16} />
          </button>
          {sent && <p className="mt-5 text-sm font-bold text-steel">Message logged locally. Replace this with your preferred form endpoint when ready.</p>}
        </form>
      </div>
      <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-steel/10 pt-6 text-xs font-bold uppercase tracking-[0.22em] text-sand/60 sm:flex-row">
        <span>Hendrich Capalaran</span>
        <span>AI Automation / Operations / Virtual Assistance</span>
      </footer>
    </section>
  );
}

export default Contact;
