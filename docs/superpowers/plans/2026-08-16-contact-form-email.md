# Contact Form Email Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Contact section's "Send inquiry" button actually deliver an email to the site owner, replacing the current no-op that only sets local state.

**Architecture:** A new Vercel serverless function (`api/contact.js`) receives the form POST, validates it, and calls Resend's REST API via `fetch` to send an email. `src/sections/Contact.jsx` is updated to call that endpoint instead of faking success, with real loading/success/error states and a spam honeypot field.

**Tech Stack:** React 19 (existing), Vercel serverless functions (Node runtime, auto-detected, no new framework), Resend REST API called via native `fetch` (no new npm dependency).

**Spec:** `docs/superpowers/specs/2026-08-16-contact-form-email-design.md`

## Global Constraints

- No new npm dependencies — call Resend via `fetch`, not their SDK (spec: "Components").
- `RESEND_API_KEY` must never reach the client — it is read only inside `api/contact.js` via `process.env` (spec: "Architecture / data flow").
- `EMAIL` in `src/data/profile.js` stays the single source of truth for the recipient address; `api/contact.js` imports it rather than duplicating it (spec: self-review fix, "Components").
- No test framework is configured in this repo — verification is manual throughout (spec: "Testing"; `CLAUDE.md`: "No lint or test scripts are configured").
- `npm run dev` (plain Vite) cannot serve `/api/contact` — manual verification of the function requires `vercel dev` or a real Vercel deployment (spec: "Testing").

---

### Task 1: Point the recipient address at the Resend-verified inbox

**Files:**
- Modify: `src/data/profile.js:4`

**Interfaces:**
- Produces: `EMAIL` (string export, already exists) — now `'h.drichcapalaran@gmail.com'`. Task 2 imports this.

- [ ] **Step 1: Change the `EMAIL` constant**

In `src/data/profile.js`, change:

```js
export const EMAIL = 'hello@hendrichcapalaran.com';
```

to:

```js
export const EMAIL = 'h.drichcapalaran@gmail.com';
```

- [ ] **Step 2: Verify the change propagates**

Run: `npm run dev`, open the site, scroll to the Contact section, and check the "Email" pill under the heading.

Expected: its `href` is `mailto:h.drichcapalaran@gmail.com` (inspect the link or hover to see the browser's status-bar URL).

- [ ] **Step 3: Commit**

```bash
git add src/data/profile.js
git commit -m "Point contact EMAIL at Resend-verified Gmail address"
```

---

### Task 2: Add the `/api/contact` serverless function

**Files:**
- Create: `api/contact.js`
- Create: `.env.example`

**Interfaces:**
- Consumes: `EMAIL` from `src/data/profile.js` (string, set in Task 1).
- Produces: `POST /api/contact` endpoint. Accepts JSON body `{ name: string, email: string, message: string, company: string }`. Returns `200 { ok: true }` on success (including the silent honeypot case), `400 { error: string }` on invalid input, `405` on non-POST, `502 { error: string }` if Resend fails. Task 3 (the form) is the only consumer of this contract.

- [ ] **Step 1: Create `api/contact.js`**

```js
import { EMAIL } from '../src/data/profile.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, company } = req.body ?? {};

  // Honeypot: real visitors never see or fill this field (Contact.jsx hides
  // it off-screen). A non-empty value means a bot filled every input it
  // found. Pretend success so the bot's own check passes, but skip Resend.
  if (typeof company === 'string' && company.trim() !== '') {
    return res.status(200).json({ ok: true });
  }

  const isValidName = typeof name === 'string' && name.trim() !== '' && name.length <= MAX_NAME_LENGTH;
  const isValidEmail = typeof email === 'string' && EMAIL_PATTERN.test(email);
  const isValidMessage = typeof message === 'string' && message.trim() !== '' && message.length <= MAX_MESSAGE_LENGTH;

  if (!isValidName || !isValidEmail || !isValidMessage) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: EMAIL,
        reply_to: email,
        subject: `New inquiry from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`
      })
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, detail);
      return res.status(502).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Resend request failed:', error);
    return res.status(502).json({ error: 'Failed to send email' });
  }
}
```

- [ ] **Step 2: Create `.env.example`**

```
# Resend API key — used only server-side by api/contact.js.
# Get one at https://resend.com (API Keys → Create API Key).
# Set the real value in Vercel: Project → Settings → Environment Variables.
# Do NOT commit the real key.
RESEND_API_KEY=
```

- [ ] **Step 3: Verify locally with the Vercel CLI**

This step needs a real `RESEND_API_KEY`. If you don't have one yet, skip to Task 3 and come back to this verification once the key exists (Task 5 covers full end-to-end verification anyway).

Run:
```bash
npm install -g vercel   # one-time, if not already installed
echo "RESEND_API_KEY=re_your_real_key" > .env.local
vercel dev
```

Then in a second terminal, with `vercel dev` running (default port shown in its output, typically 3000):

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello","company":""}'
```

Expected: `HTTP/1.1 200` and `{"ok":true}`, and an email arrives in the Gmail inbox from `Portfolio Contact <onboarding@resend.dev>` with `Reply-To: test@example.com`.

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"test@example.com","message":"Hello","company":""}'
```

Expected: `HTTP/1.1 400` and `{"error":"Invalid input"}`.

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"","company":""}'
```

Expected: `HTTP/1.1 400` and `{"error":"Invalid input"}` (empty `message` rejected too).

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@example.com","message":"spam","company":"Acme"}'
```

Expected: `HTTP/1.1 200` and `{"ok":true}`, but **no email arrives** (honeypot tripped).

- [ ] **Step 4: Commit**

```bash
git add api/contact.js .env.example
git commit -m "Add /api/contact serverless function for Resend email delivery"
```

---

### Task 3: Wire the Contact form to the new endpoint

**Files:**
- Modify: `src/sections/Contact.jsx`

**Interfaces:**
- Consumes: `POST /api/contact` contract from Task 2 (request/response shapes above).
- Consumes: `EMAIL` from `src/data/profile.js` (already imported in this file) — used in the error-state fallback message.

- [ ] **Step 1: Replace the `sent` boolean with a `status` state, add the honeypot field, and call the endpoint**

Replace the full contents of `src/sections/Contact.jsx` with:

```jsx
import { FileText, Github, Linkedin, Mail, Send } from 'lucide-react';
import React, { useState } from 'react';
import Logo from '../components/Logo.jsx';
import SectionIndex from '../components/SectionIndex.jsx';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../data/profile.js';

const socials = [
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: Linkedin },
  { label: 'GitHub', href: GITHUB_URL, icon: Github },
  { label: 'Email', href: `mailto:${EMAIL}`, icon: Mail },
  { label: 'Résumé', href: '/Hendrich_Capalaran_Resume.pdf', icon: FileText }
];

const INITIAL_FORM = { name: '', email: '', message: '', company: '' };

function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Request failed');
      setStatus('sent');
      setForm(INITIAL_FORM);
    } catch (error) {
      setStatus('error');
    }
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
                    target={href.startsWith('http') || href.endsWith('.pdf') ? '_blank' : undefined}
                    rel={href.startsWith('http') || href.endsWith('.pdf') ? 'noreferrer' : undefined}
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
                Honeypot: real visitors never see this (Tailwind's sr-only clips
                it to 1x1px, no layout shift). tabIndex -1 keeps it out of
                keyboard nav; autoComplete off keeps browsers from filling it.
                aria-hidden keeps screen readers from announcing it too. If a
                bot fills every input it finds, api/contact.js sees this
                non-empty and silently discards the submission.
              */}
              <label className="sr-only" aria-hidden="true">
                Company
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={updateField}
                  tabIndex={-1}
                  autoComplete="off"
                />
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
                disabled={status === 'sending'}
                className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 self-start rounded-full bg-bone px-5 text-[13px] font-bold tracking-[-0.01em] text-espresso transition hover:-translate-y-0.5 hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-max sm:justify-self-start"
              >
                {status === 'sending' ? 'Sending…' : 'Send inquiry'} <Send size={15} />
              </button>
              {status === 'sent' && (
                <p className="text-sm font-bold text-sand">Thanks — I'll get back to you soon.</p>
              )}
              {status === 'error' && (
                // red-400 is a deliberate one-off outside the brand token
                // system (src/styles.css :root) — it's a functional error
                // signal, not a brand color, so it doesn't belong in the
                // Designsource-derived palette.
                <p className="text-sm font-bold text-red-400">Something went wrong. Email me directly at {EMAIL}.</p>
              )}
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
```

- [ ] **Step 2: Verify the UI states manually**

Run: `npm run dev`, open the site, scroll to Contact.

Expected (no backend running, so the fetch will fail — this is expected here):
- Filling in Name/Email/Message and clicking "Send inquiry" briefly shows "Sending…" with the button disabled, then flips to the red error message reading "Something went wrong. Email me directly at h.drichcapalaran@gmail.com."
- Editing any field after that clears the error message (status resets to `idle`).
- The honeypot "Company" field is not visible anywhere on the page (visually or via Tab key navigation).
- Leaving Name, Email, or Message blank and clicking "Send inquiry" shows the browser's native "Please fill out this field" validation bubble and never calls `fetch` (the `required` attributes on those inputs are unchanged from the original form).

Full success-path verification (with a real backend) happens in Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Contact.jsx
git commit -m "Wire contact form to /api/contact with honeypot and status states"
```

---

### Task 4: Document the new backend surface

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- None (documentation only).

- [ ] **Step 1: Update the Architecture section's opening line**

In `CLAUDE.md`, find:

```
This is a single-page React 19 + Vite portfolio site, entirely client-rendered with no routing or backend.
```

Replace with:

```
This is a single-page React 19 + Vite portfolio site, entirely client-rendered with no routing. The one exception is `api/contact.js`, a Vercel serverless function that emails inquiries from the Contact form via Resend — see that file and `docs/superpowers/specs/2026-08-16-contact-form-email-design.md` for details.
```

- [ ] **Step 2: Verify**

Run: view the updated section in `CLAUDE.md` and confirm it reads correctly and no other sentence in the file still claims "no backend" anywhere.

```bash
grep -n "no backend\|no routing" CLAUDE.md
```

Expected: only the updated line appears, with the corrected wording.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Note the contact-form serverless function in CLAUDE.md architecture"
```

---

### Task 5: End-to-end verification on a real Vercel deployment

**Files:** none (verification only, no code changes).

**Interfaces:** none — this task exercises the full contract from Tasks 1–3 together.

- [ ] **Step 1: Confirm `RESEND_API_KEY` is set in Vercel**

In the Vercel dashboard: Project → Settings → Environment Variables. Confirm `RESEND_API_KEY` exists for at least the Production environment. If missing, add it (value from Resend's dashboard → API Keys) and redeploy.

- [ ] **Step 2: Push and deploy**

```bash
git push origin master
```

Expected: Vercel picks up the push and deploys automatically (or trigger a deploy manually from the dashboard if auto-deploy isn't configured).

- [ ] **Step 3: Test the live form**

On the deployed URL, scroll to Contact, fill in Name/Email/Message with real test values, and click "Send inquiry".

Expected:
- Button reads "Sending…" and is disabled briefly.
- Message changes to "Thanks — I'll get back to you soon." and the form clears.
- An email arrives at `h.drichcapalaran@gmail.com` from `Portfolio Contact <onboarding@resend.dev>`, subject `New inquiry from <the name you typed>`, and replying to it goes to the email address you typed in the form.

- [ ] **Step 4: Test the invalid-input path on the live deployment**

```bash
curl -i -X POST https://<your-deployed-domain>/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"bad","message":"","company":""}'
```

Expected: `HTTP/1.1 400` and `{"error":"Invalid input"}`.

- [ ] **Step 5: Test the failure-fallback path**

In Vercel: Settings → Environment Variables, temporarily edit `RESEND_API_KEY` to an obviously wrong value (e.g. append `-broken`), redeploy, then submit the live form again with valid input.

Expected: UI shows "Sending…" then the red error message with the mailto fallback (not a hang or crash); Vercel's function logs (Project → Deployments → the deployment → Functions → `api/contact`) show the `console.error('Resend API error: ...')` line. Afterward, restore `RESEND_API_KEY` to the real value and redeploy again.

- [ ] **Step 6: No commit needed** — this task is verification only.
