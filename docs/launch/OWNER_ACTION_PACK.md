# Owner Action Pack — Educate Strong Academy Launch

> Prepared: 2026-08-01  
> Audience: Chris (site owner)  
> Purpose: Everything still needed from you before the site can go live on educatestrong.com

All technical code work is complete and live on `main`. The items below are entirely owner-side — no developer action is needed until you supply the information or complete the steps listed.

---

## 1. Legal information required from you

These details are used in the Privacy Policy, Terms of Service, and site footer. They currently display `[COMPANY NUMBER]` and `[REGISTERED ADDRESS]` as placeholders.

| Item | Where it appears |
|------|-----------------|
| Companies House registration number | Footer, Privacy Policy, Terms of Service |
| Registered office address (full address, not trading address) | Privacy Policy, Terms of Service |
| Public contact email address for GDPR/legal queries | Privacy Policy |

**Action:** Supply all three items to your developer. No legal review is required for these — they are factual registration details.

---

## 2. Solicitor-approved policy content required

The following three pages currently contain placeholder and draft text. Your solicitor must approve the final wording before the site goes live. Do not launch with placeholder text.

| Page | URL | Status |
|------|-----|--------|
| Privacy Policy | `/privacy` | Draft with placeholders — needs solicitor approval |
| Terms of Service | `/terms` | Draft with placeholders — needs solicitor approval incl. physical liability clause |
| Refund Policy | `/refund-policy` | Draft — needs your decisions on deposit refundability, cancellation window, and company cancellation position |

Also required for the Privacy Policy:
- Data retention periods for these 5 categories: user accounts, Register Interest leads, course enrolment records, payment records, email logs
- Confirmation of your position on the Instagram `embed.js` script (your solicitor should advise whether a consent gate is required — the script loads on every page and may set cookies)

**Action:** Complete solicitor review and supply approved text for all three pages.

---

## 3. Resend domain verification

Your sending domain `educatestrong.com` must be verified with Resend before emails will deliver reliably.

**Steps (done in Resend dashboard and Wix DNS settings):**

1. Log in to your Resend account → Domains → Add Domain → enter `educatestrong.com`
2. Resend will display two DNS records to add:
   - A **DKIM TXT record** on a subdomain like `resend._domainkey.educatestrong.com`
   - Possibly a **DMARC record**
3. Log in to Wix → Domains → `educatestrong.com` → Manage DNS Records
4. Add the DKIM TXT record exactly as shown by Resend
5. **SPF record:** if an SPF TXT record already exists on `educatestrong.com`, add Resend's `include:` tag to it — do not create a second SPF record
6. Return to Resend and click "Verify" — status should change to **Verified** (can take up to 24 hours for DNS to propagate)

**Important:** The Wix DNS changes here are for email only (TXT records). They do not affect your website or Wix hosting.

---

## 4. Render email environment variables

Once Resend domain verification is complete, set these four environment variables in your Render dashboard:

**Where:** Render → educate-strong-api → Environment → Environment Variables

| Variable | Value to set | Purpose |
|----------|-------------|---------|
| `RESEND_API_KEY` | Your Resend API key (from Resend dashboard → API Keys) | Enables all email sending |
| `EMAIL_FROM` | e.g. `EducateStrong Academy <noreply@educatestrong.com>` | Sender identity on all emails |
| `NOTIFICATIONS_EMAIL` | Your preferred inbox for Register Interest alerts (e.g. `educate.strongltd@gmail.com`) | Where lead notifications are sent |
| `FRONTEND_URL` | `https://educate-strong-academy.vercel.app` (update to `https://educatestrong.com` after domain cutover) | Base URL used in password reset and verification links |

Render will restart the API service automatically after you save these. No code change or deployment is required.

---

## 5. Real email delivery tests

Once steps 3 and 4 are complete, test these four flows before the domain cutover:

| Flow | How to test |
|------|------------|
| Registration verification email | Register a new account on `https://educate-strong-academy.vercel.app` — check inbox for verification email |
| Password reset | Use Forgot Password on the site — check inbox for reset link |
| Register Interest notification | Submit the Register Interest form — check `NOTIFICATIONS_EMAIL` inbox for lead notification |
| Register Interest confirmation | Submit the Register Interest form — check the submitted email address for a confirmation |

All tests should be done on the Vercel URL (`educate-strong-academy.vercel.app`) before the domain is cutover. If any flow fails, check Render logs for error codes (`NOT_CONFIGURED` or `SEND_FAILED`).

---

## 6. QA demonstration environment verification

**Action required (one minute):**

1. Log in to Vercel → select project `educate-strong-academy` → Settings → Environment Variables
2. Check whether `VITE_ENABLE_QA_DEMO_LOGIN` is listed
3. If it is listed and set to `true`: remove or blank it, then trigger a new deployment
4. If it is absent or blank: no action needed — confirm this to your developer

This is a one-time check to formally close the QA demo safety item.

---

## 7. Checkout and Shopify decision

The Vercel rebuild currently shows pricing (£500 + £100 deposit, £250 + £100 deposit) with a "Register Interest" button. To show a working "Book Now" button linked to payment, you need to decide which option to take.

**Recommended: Option A — Shopify link (fastest)**

Provide your developer with the existing Shopify checkout URL(s) from your Wix site. The course detail page already supports this — adding a `bookingUrl` field to a cohort record in the database will automatically show "Book Now" on the homepage spotlight.

No code change is needed. This is a database data-entry task once you provide the URLs.

**Other options** (require more development):
- **Option B:** Embed Shopify Buy Button
- **Option C:** Build a new checkout flow (significant work, not recommended pre-launch)

---

## 8. Cohort dates and venues

Three confirmed upcoming cohort dates visible on your Wix site are not yet in the Vercel rebuild database. Once you decide on the checkout option (item 7), your developer can enter these dates for you, or you can use the admin interface if one is available.

Provide:
- Course name
- Date(s)
- Venue / location
- Booking URL (from item 7)

The homepage cohort spotlight and course detail pages will populate automatically once the data is entered.

---

## 9. Testimonials and consent

The testimonials section currently shows a "No testimonials published yet" placeholder. Three video testimonials (Chris, Steve, Ryan) are on your Wix site.

To publish these on the Vercel rebuild:

1. Provide the video URL(s) for each testimonial (YouTube, Vimeo, or hosted file)
2. Confirm each person has given explicit consent for their testimonial to be published on the new site (the database field `consentConfirmed` must be `true` before any testimonial appears)
3. Provide any written testimonial text to accompany the videos

**No testimonials will be published without explicit consent from each person.** The placeholder is the correct behaviour until this is resolved.

---

## 10. Tutor personal statements

The four tutor profiles currently show placeholder biography text. Replace placeholder text with real personal statements for each tutor. Provide the text to your developer for entry into the database.

This is not a blocker for the domain cutover, but should be completed before any press or marketing goes live.

---

## 11. Final custom domain cutover prerequisites

Complete all of the above **before** following the cutover playbook (`docs/launch/section-12-cutover-playbook.md`). The cutover sequence is:

**Hard prerequisites (must be done before DNS is touched):**

- [ ] Legal placeholders replaced with real, solicitor-approved content (items 1 + 2)
- [ ] Email fully configured and tested end-to-end (items 3 + 4 + 5)
- [ ] QA demo environment variable confirmed absent in Vercel (item 6)

**Cutover day (follow the 8-step playbook):**

1. Add `educatestrong.com` + `www` as custom domains in Vercel dashboard
2. Update A record and CNAME in Wix DNS to Vercel's provided values
3. Wait for Vercel to confirm Valid + TLS provisioned
4. Verify HTTPS resolves correctly
5. Full smoke test on the custom domain
6. Update `VITE_SITE_URL` in Vercel env → trigger redeploy → verify sitemap canonicals read `https://educatestrong.com/`
7. Update `FRONTEND_URL` in Render to `https://educatestrong.com`
8. Final post-cutover smoke test

**After cutover:**

- Submit sitemap to Google Search Console
- Confirm Wix is no longer serving the domain

---

## Priority order

| Priority | Item | Blocking what |
|----------|------|--------------|
| 1 | Legal information (company number, address, contact email) | Domain cutover |
| 2 | Solicitor-approved policy text for all three pages | Domain cutover |
| 3 | Resend domain verification | Email delivery |
| 4 | Render email environment variables | Email delivery |
| 5 | Email delivery tests end-to-end | Domain cutover |
| 6 | Vercel QA demo env var confirmation | Formal safety closure |
| 7 | Checkout/Shopify decision | Commercial launch |
| 8 | Cohort dates and venues | Homepage spotlight, course bookings |
| 9 | Testimonials with consent | Testimonials section |
| 10 | Tutor personal statements | Profile pages |
