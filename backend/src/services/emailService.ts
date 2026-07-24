/**
 * Email Service — Resend
 *
 * Sends via the official Resend Node SDK. In development/test
 * (NODE_ENV !== 'production') this never sends a real email — it logs
 * to console and, for password reset specifically, returns the link so
 * a developer can use it directly. This must never pretend an email
 * was delivered when it wasn't.
 *
 * Required environment variables (production):
 *   RESEND_API_KEY      — a sending-only Resend API key
 *   EMAIL_FROM          — must be an address on a domain verified with Resend
 *   NOTIFICATIONS_EMAIL — recipient for Register Interest owner notifications
 *   FRONTEND_URL        — used to build verification/reset links
 *
 * Missing configuration in production does not crash the server or any
 * unrelated route — only the specific send attempt fails. Every
 * failure is logged server-side with a short, sanitised error code
 * ('NOT_CONFIGURED' | 'SEND_FAILED') for debugging. Full provider
 * responses, stack traces, request data, and API keys are never stored
 * or returned to a caller.
 */

import { Resend } from 'resend';

export type EmailErrorCode = 'NOT_CONFIGURED' | 'SEND_FAILED';

interface SendResult {
  success: boolean;
  errorCode?: EmailErrorCode;
}

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function fromAddress(): string {
  return process.env.EMAIL_FROM || 'EducateStrong Academy <onboarding@resend.dev>';
}

function frontendUrl(): string {
  return process.env.FRONTEND_URL || 'http://localhost:5174';
}

// Shared low-level send — never throws, never leaks provider details to
// its caller. Outside production this always suppresses the real send
// (logged instead) so local development never dispatches real email.
async function sendEmail(opts: { to: string; subject: string; html: string; text: string }): Promise<SendResult> {
  if (!isProduction()) {
    console.log(`[DEV] Email suppressed — would send "${opts.subject}" to ${opts.to}`);
    return { success: false, errorCode: 'NOT_CONFIGURED' };
  }

  const client = getResendClient();
  if (!client) {
    console.error(`[emailService] RESEND_API_KEY is not configured. Email not sent: "${opts.subject}" to ${opts.to}`);
    return { success: false, errorCode: 'NOT_CONFIGURED' };
  }

  try {
    const { error } = await client.emails.send({
      from: fromAddress(),
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    if (error) {
      console.error(`[emailService] Resend reported an error sending "${opts.subject}":`, error.message);
      return { success: false, errorCode: 'SEND_FAILED' };
    }
    return { success: true };
  } catch (err) {
    console.error(`[emailService] Failed to send "${opts.subject}":`, err instanceof Error ? err.message : err);
    return { success: false, errorCode: 'SEND_FAILED' };
  }
}

// ── Shared email chrome ─────────────────────────────────────────────────────

function wrapHtml(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1A1A1A;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#A41C64;padding:24px 32px;">
          <p style="color:#fff;font-size:20px;font-weight:800;margin:0;">EducateStrong Academy</p>
        </td></tr>
        <tr><td style="padding:32px;">
          ${bodyHtml}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Password reset ───────────────────────────────────────────────────────────

interface SendResetEmailOptions {
  toEmail: string;
  toName: string;
  resetToken: string;
}

interface SendResetEmailResult {
  sent: boolean;
  /** Only populated outside production — never in production */
  _devResetLink?: string;
}

// External contract deliberately unchanged from before: always resolves
// with sent:true in production regardless of actual delivery success,
// so the calling route's response stays the same neutral message either
// way — this is required to preserve the existing anti-enumeration
// behaviour on /auth/forgot-password. Actual delivery failures are
// still logged server-side by sendEmail() above.
export async function sendPasswordResetEmail(opts: SendResetEmailOptions): Promise<SendResetEmailResult> {
  const resetLink = `${frontendUrl()}/reset-password/${opts.resetToken}`;

  if (!isProduction()) {
    console.log(`[DEV] Password reset link for ${opts.toEmail}: ${resetLink}`);
    return { sent: false, _devResetLink: resetLink };
  }

  await sendEmail({
    to: opts.toEmail,
    subject: 'Reset your EducateStrong Academy password',
    html: wrapHtml(`
      <p style="color:#fff;font-size:16px;margin:0 0 12px;">Hi ${opts.toName},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0 0 24px;">
        We received a request to reset your password. Click the button below to choose a new one.
        This link expires in 60 minutes.
      </p>
      <a href="${resetLink}" style="display:inline-block;background:#A41C64;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">
        Reset Password
      </a>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:24px 0 0;">
        If you did not request this, you can safely ignore this email.<br>
        Your password will not change.
      </p>
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:12px 0 0;word-break:break-all;">
        Or copy this link: ${resetLink}
      </p>
    `),
    text: `Hi ${opts.toName},\n\nWe received a request to reset your EducateStrong Academy password.\n\nReset your password here:\n${resetLink}\n\nThis link expires in 60 minutes.\n\nIf you did not request this, you can safely ignore this email.`,
  });

  // Always sent:true — see comment above.
  return { sent: true };
}

// ── Email verification ───────────────────────────────────────────────────────

interface SendVerificationEmailOptions {
  toEmail: string;
  toName: string;
  verificationToken: string;
}

interface SendVerificationEmailResult {
  success: boolean;
  errorCode?: EmailErrorCode;
  /** Only populated outside production — never in production */
  _devVerificationLink?: string;
}

// Unlike password reset, this doesn't need the artificial "always
// succeeds" neutral contract — a verification email is sent only right
// after this exact account was just created by this exact request, so
// there is no account-enumeration surface to protect here. Registration
// itself never depends on this succeeding (soft verification).
export async function sendVerificationEmail(opts: SendVerificationEmailOptions): Promise<SendVerificationEmailResult> {
  const verificationLink = `${frontendUrl()}/verify-email/${opts.verificationToken}`;

  if (!isProduction()) {
    console.log(`[DEV] Email verification link for ${opts.toEmail}: ${verificationLink}`);
    return { success: false, errorCode: 'NOT_CONFIGURED', _devVerificationLink: verificationLink };
  }

  const result = await sendEmail({
    to: opts.toEmail,
    subject: 'Verify your email — EducateStrong Academy',
    html: wrapHtml(`
      <p style="color:#fff;font-size:16px;margin:0 0 12px;">Hi ${opts.toName},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0 0 24px;">
        Thanks for creating an EducateStrong Academy account. Please confirm this is your email
        address by clicking the button below. This link expires in 24 hours.
      </p>
      <a href="${verificationLink}" style="display:inline-block;background:#A41C64;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">
        Verify Email Address
      </a>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:24px 0 0;">
        You can already sign in and use your dashboard without verifying — this is just to
        confirm we can reach you.
      </p>
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:12px 0 0;word-break:break-all;">
        Or copy this link: ${verificationLink}
      </p>
    `),
    text: `Hi ${opts.toName},\n\nThanks for creating an EducateStrong Academy account. Confirm your email address here:\n${verificationLink}\n\nThis link expires in 24 hours.\n\nYou can already sign in and use your dashboard without verifying — this is just to confirm we can reach you.`,
  });

  return result;
}

// ── Register Interest ────────────────────────────────────────────────────────

interface RegisterInterestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  courseInterest?: string | null;
  locationInterest?: string | null;
  message?: string | null;
  sourcePage?: string | null;
}

// Notifies Educate Strong's own inbox of a new lead. Best-effort — the
// caller (interest.ts) never rolls back the already-saved database
// record because this fails; it only records the outcome.
export async function sendRegisterInterestNotification(details: RegisterInterestDetails): Promise<SendResult> {
  const notificationsEmail = process.env.NOTIFICATIONS_EMAIL;
  if (!notificationsEmail) {
    console.error('[emailService] NOTIFICATIONS_EMAIL is not configured. Register Interest notification not sent.');
    return { success: false, errorCode: 'NOT_CONFIGURED' };
  }

  const rows = [
    ['Name', `${details.firstName} ${details.lastName}`],
    ['Email', details.email],
    ['Phone', details.phone || '—'],
    ['Course interest', details.courseInterest || '—'],
    ['Location interest', details.locationInterest || '—'],
    ['Source page', details.sourcePage || '—'],
    ['Message', details.message || '—'],
  ];

  return sendEmail({
    to: notificationsEmail,
    subject: `New Register Interest submission — ${details.firstName} ${details.lastName}`,
    html: wrapHtml(`
      <p style="color:#fff;font-size:16px;margin:0 0 16px;">New Register Interest submission</p>
      <table style="width:100%;border-collapse:collapse;">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="color:rgba(255,255,255,0.4);font-size:12px;padding:6px 12px 6px 0;vertical-align:top;white-space:nowrap;">${label}</td>
            <td style="color:#fff;font-size:14px;padding:6px 0;">${value}</td>
          </tr>
        `).join('')}
      </table>
    `),
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
  });
}

// Confirms receipt to the person who submitted the form. Best-effort,
// same as above — never blocks or reverses the saved record.
export async function sendRegisterInterestConfirmation(details: RegisterInterestDetails): Promise<SendResult> {
  return sendEmail({
    to: details.email,
    subject: "We've received your interest — EducateStrong Academy",
    html: wrapHtml(`
      <p style="color:#fff;font-size:16px;margin:0 0 12px;">Hi ${details.firstName},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0;">
        Thanks for registering your interest with EducateStrong Academy. We've received your
        details and someone from the team will be in touch soon.
      </p>
    `),
    text: `Hi ${details.firstName},\n\nThanks for registering your interest with EducateStrong Academy. We've received your details and someone from the team will be in touch soon.`,
  });
}
