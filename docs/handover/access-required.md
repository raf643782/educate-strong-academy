# Platform Access Inventory

Educate Strong should own or have admin access to each of the following platforms. Where possible, accounts should be registered to a company email address (not a personal developer email) and secured with two-factor authentication.

---

## GitHub

**What it controls**: Source code for the entire application.

**Recommended owner**: Educate Strong Ltd — company-controlled account or organisation.

**Why it matters**: All deployments to Vercel and Render are triggered by Git pushes. Losing access to GitHub means losing the ability to deploy, roll back, or update the application.

**Action required**: Transfer the repository `raf643782/educate-strong-academy` to an Educate Strong organisation or add a company account as owner.

**MFA**: Enable on the company GitHub account.

---

## Vercel

**What it controls**: Frontend hosting and deployment pipeline.

**Recommended owner**: Educate Strong Ltd Vercel account (Pro tier recommended for commercial use).

**Why it matters**: The public website, sitemap, and all prerendered pages are served from Vercel. Environment variables for the frontend are set here.

**Action required**: Invite a company Vercel account as owner of the project. Configure production domain `educatestrong.com` here.

**MFA**: Enable.

---

## Render

**What it controls**: Backend API hosting (authentication, courses, documents, email, register interest).

**Recommended owner**: Educate Strong Ltd Render account (Starter plan recommended before commercial launch).

**Why it matters**: All API functionality depends on Render. All secret environment variables (database URL, JWT secret, R2 keys, Resend key) are held here.

**Action required**: Add a company Render account as owner. Confirm all environment variables are set correctly.

**MFA**: Enable.

---

## Neon

**What it controls**: PostgreSQL database — stores users, courses, enrolments, assessments, certificates, cohorts, coach profiles, register interest submissions.

**Recommended owner**: Educate Strong Ltd Neon account (Launch plan recommended before real learner data accumulates).

**Why it matters**: This is where all learner records, qualifications, and personal data are stored. Losing access could mean losing access to all assessment and enrolment history.

**Action required**: Transfer the Neon project to a company account or invite a company account as admin.

**MFA**: Enable.

**Backup**: Configure backup retention appropriate to the data sensitivity. See `docs/handover/known-limitations.md`.

---

## Cloudflare

**Two separate services:**

### Cloudflare DNS (for educatestrong.com)
**What it controls**: DNS routing — where `educatestrong.com` and `www.educatestrong.com` point.
**Action required**: Access to the DNS zone for educatestrong.com is needed during domain migration.

### Cloudflare R2 (course document storage)
**What it controls**: Private storage for course PDFs and documents uploaded through the admin panel.
**Action required**: Confirm R2 bucket exists, is private, and the four R2 environment variables are set on Render.

**MFA**: Enable on the Cloudflare account.

---

## Sanity

**What it controls**: CMS for Knowledge Hub articles (when activated).

**Recommended owner**: Educate Strong Ltd Sanity account.

**Why it matters**: When Sanity is activated, all Knowledge Hub content is managed here. Losing access means losing the ability to add or edit articles without a code deployment.

**Action required**: See `docs/handover/cms-guide.md` for Sanity activation steps.

**Note**: Currently the Knowledge Hub uses local hardcoded data. Sanity activation is a post-launch step.

---

## Resend

**What it controls**: Transactional email delivery — verification emails, password resets, Register Interest notifications.

**Recommended owner**: Educate Strong Ltd Resend account.

**Why it matters**: Without Resend, no automated emails are delivered. Users cannot verify their email address or reset their password.

**Action required**: Verify the sending domain `educatestrong.com` in the Resend dashboard. Configure DNS records (SPF, DKIM). Set the `RESEND_API_KEY` and `EMAIL_FROM` on Render.

---

## Google Workspace

**What it controls**: Human mailboxes for Educate Strong staff — e.g. `kris@educatestrong.com`, `info@educatestrong.com`.

**Recommended owner**: Educate Strong Ltd Google Workspace account.

**Why it matters**: Staff email and Google account login. These are separate from automated transactional email (which is handled by Resend).

**Important**: When migrating DNS to Vercel, do **not** remove or alter Google's MX records. This is the most common cause of email outages during domain migration. See `docs/domain-cutover-checklist.md`.

---

## Shopify

**What it controls**: Payment processing for course bookings (£100 deposits and full payments).

**Recommended owner**: Educate Strong Ltd Shopify account.

**Why it matters**: Without Shopify, the "Book Now" booking flow cannot be activated. The Register Interest form remains the only conversion path.

**Action required**: Configure Shopify products for each course deposit. Provide the checkout URLs. See `docs/handover/known-limitations.md`.

---

## Google Analytics (GA4)

**What it controls**: Website visitor tracking, conversion events (register_interest, book_now_click).

**Recommended owner**: Educate Strong Ltd Google Analytics property.

**Action required**: Create a GA4 property (or identify an existing one), copy the Measurement ID (`G-XXXXXXXXXX`), set it as `VITE_GA_MEASUREMENT_ID` in Vercel, and redeploy.

---

## Google Search Console

**What it controls**: Monitoring of how Google indexes the website — coverage, errors, sitemap status, Core Web Vitals.

**Recommended owner**: Educate Strong Ltd Google account.

**Action required**: After domain migration, add `educatestrong.com` as a new property, verify via DNS TXT record, and submit `sitemap.xml`.

---

## Summary Checklist

| Platform | Account exists? | Company-owned? | MFA enabled? | Action needed? |
|---|---|---|---|---|
| GitHub | | | | Transfer repo to company account |
| Vercel | | | | Add company account as owner |
| Render | | | | Add company account, set all env vars |
| Neon | | | | Transfer to company account |
| Cloudflare DNS | | | | Access needed for domain migration |
| Cloudflare R2 | | | | Confirm bucket, set Render env vars |
| Sanity | | | | Create project, activate after launch |
| Resend | | | | Verify domain, set DNS + env vars |
| Google Workspace | | | | Protect MX records during migration |
| Shopify | | | | Configure products, provide URLs |
| Google Analytics | | | | Create GA4 property, set Measurement ID |
| Google Search Console | | | | Add property after domain migration |
