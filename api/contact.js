// Vercel Serverless Function — sends the contact form as an email via Resend.
// The API key lives ONLY in the RESEND_API_KEY environment variable (never in code).

const TO_EMAIL = 'alejandro.buitrago.xm@gmail.com';
// Resend's shared onboarding sender works without domain verification, but it can
// only deliver to the email that owns the Resend account. Once a domain is
// verified in Resend, swap this for e.g. "Portfolio <hello@yourdomain.com>".
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Email service not configured (missing RESEND_API_KEY).' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const { name, email, company, projectType, role, budget, message } = body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const esc = (s) => String(s || '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">New inquiry from ${esc(name)}</h2>
      <p><strong>Email:</strong> ${esc(email)}</p>
      ${company ? `<p><strong>Agency / Brand:</strong> ${esc(company)}</p>` : ''}
      ${projectType ? `<p><strong>Project type:</strong> ${esc(projectType)}</p>` : ''}
      ${role ? `<p><strong>Role needed:</strong> ${esc(role)}</p>` : ''}
      ${budget ? `<p><strong>Budget:</strong> ${esc(budget)}</p>` : ''}
      <p><strong>Details:</strong></p>
      <p style="white-space:pre-line">${esc(message)}</p>
    </div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New inquiry — ${name}${company ? ` (${company})` : ''}`,
        html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return res.status(502).json({ error: 'Email provider rejected the request.', detail });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send email.', detail: String(err) });
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
