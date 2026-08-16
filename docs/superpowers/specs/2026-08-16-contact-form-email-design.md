# Contact form: send inquiries to email via Vercel + Resend

## Context

`src/sections/Contact.jsx` has a working form (name/email/message) but `handleSubmit` only sets local state and shows "Message logged locally. Connect a form endpoint when ready." — nothing is ever sent anywhere. The user is deploying the portfolio live on Vercel and wants "Send inquiry" to actually deliver an email to them.

The site is currently a pure static React/Vite build with no backend (`CLAUDE.md`: "entirely client-rendered with no routing or backend"). This spec adds the minimum backend surface needed — one Vercel serverless function — to make the form functional without introducing a framework migration, a database, or new client dependencies.

## Approach

Two approaches were considered:

- **Third-party form endpoint (e.g. Web3Forms/Formspree), called directly from the browser** — zero backend code, matches the current pure-client-side architecture exactly. Rejected in favor of the option below because the user preferred keeping the email-sending logic and API key under their own control rather than depending on a third party's infrastructure sitting between the form and the inbox.
- **Vercel serverless function + Resend (chosen)** — `api/contact.js` is auto-detected by Vercel with zero framework/config overhead. It calls Resend's REST API directly via `fetch` (no new npm dependency — keeps the project's intentionally small dependency list unchanged). The Resend API key lives server-side only (`RESEND_API_KEY` env var), never shipped to the browser. Resend's sandbox sender (`onboarding@resend.dev`) requires no DNS/domain verification as long as the recipient is the email address on the Resend account itself — which is true here, since the form always delivers to the site owner's own address.

## Email recipient decision

`src/data/profile.js` currently has `EMAIL = 'hello@hendrichcapalaran.com'`. The user will sign up to Resend using `h.drichcapalaran@gmail.com` instead (fastest path, no DNS setup). So this spec includes changing `EMAIL` in `profile.js` to `h.drichcapalaran@gmail.com` — this is the single source of truth already used for the mailto link and résumé/contact references elsewhere in the site, so the change propagates everywhere consistently. The user can move to a verified custom domain later without touching this spec's design.

## Architecture / data flow

```
Browser (Contact.jsx form)
   │  fetch POST /api/contact  { name, email, message, company }
   ▼
Vercel serverless function (api/contact.js, Node runtime, auto-detected — no config)
   │  validates input, rejects if honeypot ("company") is filled
   │  fetch POST https://api.resend.com/emails   (Authorization: Bearer RESEND_API_KEY, server-side only)
   ▼
Resend → delivers email to EMAIL (data/profile.js), reply-to = visitor's submitted email
```

## Components

**`api/contact.js`** (new)
- `export default async function handler(req, res)`.
- `405` for any method other than `POST`.
- Validates `name`, `email`, `message`: all required non-empty strings; `message` capped at 5000 chars, `name` at 200 chars; `email` checked against a basic regex. Any failure → `400` with a short JSON error message.
- Honeypot: request body includes a `company` field the real form always submits empty (hidden input, invisible to real users). If `company` is non-empty, treat it as a bot: return `200` immediately without calling Resend, so the bot's success check passes but no email is sent.
- On valid, non-bot input: POST to `https://api.resend.com/emails` with header `Authorization: Bearer ${process.env.RESEND_API_KEY}` and body:
  - `from`: `"Portfolio Contact <onboarding@resend.dev>"`
  - `to`: `EMAIL`, imported from `../src/data/profile.js` (plain JS, no JSX, so it bundles fine into the serverless function — keeps `profile.js` the single source of truth instead of duplicating the address)
  - `reply_to`: the visitor's submitted email
  - `subject`: `` `New inquiry from ${name}` ``
  - `text`: body containing name, email, and message
- Resend call failure (non-2xx or network error) → `console.error` the details server-side (visible in Vercel's function logs), respond `502` with a generic JSON error — never leaks Resend internals to the client.
- Success → `200` with `{ ok: true }`.

**`src/sections/Contact.jsx`** (edit)
- Replace the `sent` boolean with a `status` state: `'idle' | 'sending' | 'sent' | 'error'`.
- Add a `company` field to the form state (honeypot) and a hidden input for it — visually hidden (off-screen, not `display:none`, so real browsers still fill it in like any field but real humans never see or touch it), `tabIndex={-1}`, `autoComplete="off"`.
- `handleSubmit` becomes `async`: sets `status: 'sending'`, `fetch('/api/contact', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form) })`, then:
  - On `res.ok` → `status: 'sent'`, clear `name`/`email`/`message`/`company`.
  - On non-ok response or thrown error (network failure) → `status: 'error'`.
- Submit button: disabled and reads "Sending…" while `status === 'sending'`.
- Success message replaces the old placeholder text with a real confirmation, e.g. "Thanks — I'll get back to you soon."
- Error message: `` `Something went wrong. Email me directly at ${EMAIL}.` `` — the mailto fallback (already in `socials`) means a broken form never loses the lead.
- Editing any field after `status === 'sent'` or `'error'` resets `status` back to `'idle'` (same pattern the existing `updateField` already uses for `sent`).

**`src/data/profile.js`** (edit)
- `EMAIL` changes from `'hello@hendrichcapalaran.com'` to `'h.drichcapalaran@gmail.com'`.

**`.env.example`** (new)
- One line: `RESEND_API_KEY=` with a comment noting it's set in Vercel's dashboard (Settings → Environment Variables), not committed.

**`CLAUDE.md`** (edit)
- Architecture section's opening line currently states "entirely client-rendered with no routing or backend" — amend to note the one serverless function (`api/contact.js`) and what it's for, so the doc stays accurate.

## Error handling

- Client-side HTML validation (`required`, `type="email"`) blocks obviously-empty submissions before any network call.
- Server-side validation in `api/contact.js` is independent and authoritative — never trusts client-side checks alone.
- All failure paths (validation failure, honeypot trip, Resend failure, network error) degrade to either a silent no-op (honeypot) or a visible error message with a working mailto fallback — the visitor is never left thinking a message sent when it didn't, except in the deliberate honeypot case.

## Testing

No test framework is configured in this repo (`CLAUDE.md`: "No lint or test scripts are configured"), so verification stays manual, consistent with the rest of the site:

- `npm run dev` (plain Vite) **cannot** serve `/api/contact` — Vite doesn't know about Vercel's serverless functions. Manual verification requires either the Vercel CLI (`vercel dev`, which reads `.env.local` for `RESEND_API_KEY`) or testing against a real Vercel deployment (preview or production).
- Manual test plan (documented in the implementation plan, not automated):
  1. Submit the form with valid input → confirm the email arrives in the Gmail inbox, `reply_to` is the submitted address, and the UI shows the success message.
  2. Submit with an empty required field → confirm client-side validation blocks it (browser's native validation UI).
  3. POST directly to `/api/contact` with an empty `message` → confirm `400`.
  4. POST with `company` filled in → confirm `200` is returned but no email is sent.
  5. Temporarily set an invalid `RESEND_API_KEY` → confirm the UI shows the error/fallback message rather than hanging or crashing.

## Setup steps (user-performed, not automated by this spec)

1. Sign up to Resend with `h.drichcapalaran@gmail.com`, create an API key (Sending access is sufficient).
2. In Vercel: Project → Settings → Environment Variables → add `RESEND_API_KEY` (Production + Preview + Development).
3. Redeploy for the env var to take effect.
