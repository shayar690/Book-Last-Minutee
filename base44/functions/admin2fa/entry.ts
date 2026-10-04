// Email-based two-factor authentication for the admin panel.
// Each admin registers a destination email on first login; a random 6-digit
// code is then emailed on every login attempt and must be verified before the
// panel is unlocked. Codes expire after 5 minutes and are single-use.
//
// Actions:
//   send    — email a fresh code to the admin's registered address
//             (returns { needsEmail: true } if no address is registered yet)
//   register — set/replace the destination email, then send a code
//   verify  — check the submitted code
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const OTP_TTL_MS = 5 * 60 * 1000;

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!domain || !name) return email;
  return `${name[0]}***@${domain}`;
}

async function sendOtp(base44: any, rec: any) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + OTP_TTL_MS).toISOString();
  await base44.asServiceRole.entities.Admin2FA.update(rec.id, { code, code_expires: expires });
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: rec.email,
    subject: 'קוד אימות לפאנל הניהול / Admin verification code',
    html: `<div style="font-family:Inter,Arial,sans-serif;max-width:460px;margin:auto;padding:28px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb">
      <div style="background:#f5d166;padding:14px 20px;border-radius:12px;margin:-28px -28px 20px;font-weight:700;color:#000000">Last-Minute Vacations</div>
      <h2 style="margin:0 0 8px;color:#0f1729">קוד אימות לפאנל הניהול</h2>
      <p style="color:#5a5a5a;margin:0 0 16px">הזן/י את הקוד הבא כדי להתחבר לפאנל הניהול:</p>
      <div style="font-size:34px;font-weight:700;letter-spacing:10px;background:#f7f8fa;border-radius:12px;padding:18px;text-align:center;color:#0f1729">${code}</div>
      <p style="color:#888888;font-size:12px;margin:16px 0 0">הקוד תקף ל-5 דקות. אם לא ביקשת קוד זה, ניתן להתעלם מהודעה זו.</p>
    </div>`,
  });
  return Response.json({ sent: true, maskedEmail: maskEmail(rec.email) });
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    const existing = await base44.asServiceRole.entities.Admin2FA.filter({ user_id: user.id }, { limit: 1 });
    let rec = (existing.items || [])[0];

    if (action === 'register') {
      const email = String(body.email || '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return Response.json({ error: 'Invalid email' }, { status: 400 });
      }
      if (rec) {
        rec = await base44.asServiceRole.entities.Admin2FA.update(rec.id, { email });
      } else {
        rec = await base44.asServiceRole.entities.Admin2FA.create({ user_id: user.id, email });
      }
      return await sendOtp(base44, rec);
    }

    if (action === 'send') {
      if (!rec || !rec.email) return Response.json({ needsEmail: true });
      return await sendOtp(base44, rec);
    }

    if (action === 'verify') {
      const code = String(body.code || '').trim();
      if (!rec || !rec.code) return Response.json({ verified: false, error: 'no_code' }, { status: 400 });
      if (!rec.code_expires || new Date(rec.code_expires) < new Date()) {
        return Response.json({ verified: false, error: 'expired' });
      }
      if (rec.code !== code) return Response.json({ verified: false, error: 'wrong' });
      await base44.asServiceRole.entities.Admin2FA.update(rec.id, { code: null, code_expires: null });
      return Response.json({ verified: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}