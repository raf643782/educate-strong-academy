/**
 * Email Service
 *
 * In development (NODE_ENV !== 'production'):
 *   - Does not send real email
 *   - Returns the reset link so the caller can surface it to the developer
 *
 * In production:
 *   - Sends via SMTP using environment variables
 *   - Requires: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
 *   - Falls back to logging an error if SMTP is not configured
 *
 * Required environment variables (production):
 *   SMTP_HOST=smtp.example.com
 *   SMTP_PORT=587
 *   SMTP_USER=noreply@educate-strong.com
 *   SMTP_PASS=your-smtp-password
 *   EMAIL_FROM="EducateStrong Academy <noreply@educate-strong.com>"
 *   FRONTEND_URL=https://educate-strong.vercel.app
 */

interface SendResetEmailOptions {
  toEmail: string;
  toName: string;
  resetToken: string;
}

interface SendResetEmailResult {
  sent: boolean;
  /** Only populated in development — never in production */
  _devResetLink?: string;
}

export async function sendPasswordResetEmail(opts: SendResetEmailOptions): Promise<SendResetEmailResult> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
  const resetLink = `${frontendUrl}/reset-password/${opts.resetToken}`;

  if (process.env.NODE_ENV !== 'production') {
    // Development: log to console, return link for dev UI
    console.log(`[DEV] Password reset link for ${opts.toEmail}: ${resetLink}`);
    return { sent: false, _devResetLink: resetLink };
  }

  // Production: send via SMTP
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('[emailService] SMTP not configured. Password reset email not sent.');
    // Return sent:true so the API still returns a neutral response to the user
    // (we don't want to expose that email sending is broken)
    return { sent: true };
  }

  try {
    // Dynamic import avoids bundling nodemailer unless in production
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587'),
      secure: parseInt(SMTP_PORT || '587') === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: EMAIL_FROM || `EducateStrong Academy <${SMTP_USER}>`,
      to: opts.toEmail,
      subject: 'Reset your EducateStrong Academy password',
      html: buildResetEmailHtml(opts.toName, resetLink),
      text: buildResetEmailText(opts.toName, resetLink),
    });

    return { sent: true };
  } catch (err) {
    console.error('[emailService] Failed to send reset email:', err);
    return { sent: true }; // neutral — don't expose failure to user
  }
}

function buildResetEmailHtml(name: string, link: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1A1A1A;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#A41C64;padding:24px 32px;">
          <p style="color:#fff;font-size:20px;font-weight:800;margin:0;">EducateStrong Academy</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="color:#fff;font-size:16px;margin:0 0 12px;">Hi ${name},</p>
          <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0 0 24px;">
            We received a request to reset your password. Click the button below to choose a new one.
            This link expires in 60 minutes.
          </p>
          <a href="${link}" style="display:inline-block;background:#A41C64;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">
            Reset Password
          </a>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:24px 0 0;">
            If you did not request this, you can safely ignore this email.<br>
            Your password will not change.
          </p>
          <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:12px 0 0;word-break:break-all;">
            Or copy this link: ${link}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildResetEmailText(name: string, link: string): string {
  return `Hi ${name},\n\nWe received a request to reset your EducateStrong Academy password.\n\nReset your password here:\n${link}\n\nThis link expires in 60 minutes.\n\nIf you did not request this, you can safely ignore this email.`;
}
