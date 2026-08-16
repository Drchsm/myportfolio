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
