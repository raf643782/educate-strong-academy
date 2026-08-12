# Resend — Operator Guide

Resend is the transactional email provider. It handles all automated emails sent by the platform.

---

## What Resend sends

| Trigger | Email sent | Recipient |
|---|---|---|
| User registers | Email verification link | New user |
| User requests password reset | Password reset link | User |
| Someone submits Register Interest | Notification with submission details | `NOTIFICATIONS_EMAIL` |
| Someone submits Register Interest | Confirmation of receipt | Submitter |

---

## Current status (as of handover)

**Not yet live.** The Resend integration is fully implemented in the backend code, but requires:

1. A Resend account with `educatestrong.com` as a verified sending domain
2. `RESEND_API_KEY` set on Render
3. `EMAIL_FROM` set on Render to `EducateStrong Academy <no-reply@educatestrong.com>` (or similar)
4. `NOTIFICATIONS_EMAIL` set on Render to the team inbox

Until these are done, the backend falls back to `onboarding@resend.dev` (Resend's shared test sender), which means emails may land in spam and show the wrong "from" address.

---

## Setup steps

### Step 1 — Create a Resend account

Go to https://resend.com and create an account. The free plan covers 3,000 emails/month — sufficient for initial launch.

### Step 2 — Verify the sending domain

1. In Resend dashboard → Domains → Add Domain
2. Enter `educatestrong.com`
3. Resend will provide DNS records to add:
   - An SPF TXT record
   - DKIM CNAME records (usually 2–3 records)
   - A DMARC TXT record (Resend may provide this or you can add it yourself)
4. Add these records in the Cloudflare DNS panel for `educatestrong.com`
5. Back in Resend dashboard, click "Verify" — green checks confirm the records are in place

### Step 3 — Create an API key

1. Resend dashboard → API Keys → Create API Key
2. Give it a descriptive name (e.g. "Educate Strong Academy Production")
3. Set permissions to "Sending Access" only
4. Copy the key — it is only shown once
5. Add it as `RESEND_API_KEY` on Render

### Step 4 — Set environment variables on Render

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | The API key from Step 3 |
| `EMAIL_FROM` | `EducateStrong Academy <no-reply@educatestrong.com>` |
| `NOTIFICATIONS_EMAIL` | e.g. `kris@educatestrong.com` or a team inbox |
| `FRONTEND_URL` | `https://www.educatestrong.com` (controls link domain in emails) |

### Step 5 — Test

1. Trigger a registration on the staging/preview environment
2. Confirm the verification email arrives with:
   - Correct "from" address (e.g. `no-reply@educatestrong.com`)
   - Correct link domain (e.g. `https://www.educatestrong.com/verify-email/...`)
   - Delivered to inbox (not spam)

---

## Monitoring

In the Resend dashboard → Logs, you can see every email attempted, with delivery status (delivered, bounced, blocked, spam).

On the Render side, email send results are logged. Look for `[email] Sent password reset email` or similar lines in the Render logs.

---

## Important: email domain separation

Resend handles **transactional email** only (automated platform emails). It is completely separate from:
- **Google Workspace** (human staff mailboxes like `kris@educatestrong.com`)
- The Resend DNS records do not affect Google Workspace MX records

Adding Resend DNS records (SPF, DKIM, DMARC) modifies TXT and CNAME records, not MX records. Google Workspace email is not affected by these changes.

---

## Email paths in the code

All email is sent from `backend/src/services/emailService.ts`. Four functions:
- `sendVerificationEmail` — triggered on registration
- `sendPasswordResetEmail` — triggered on password reset request
- `sendRegisterInterestNotification` — triggered on Register Interest form submission (to team)
- `sendRegisterInterestConfirmation` — triggered on Register Interest form submission (to submitter)
