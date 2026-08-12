# Final Launch Checklist

Complete each section before going live at `educatestrong.com`. Tick items as they are done.

**Last updated**: August 2026

---

## Section 1 — Platform accounts

- [ ] Vercel account controlled by Educate Strong Ltd; project ownership confirmed
- [ ] Render account controlled by Educate Strong Ltd; service ownership confirmed
- [ ] Neon account controlled by Educate Strong Ltd; project ownership confirmed
- [ ] Cloudflare account controlled by Educate Strong Ltd; R2 bucket confirmed
- [ ] Resend account controlled by Educate Strong Ltd
- [ ] GitHub repo transferred to Educate Strong organisation or company account
- [ ] Shopify account configured with at least one course product (£100 deposit)
- [ ] Google Analytics GA4 property created for educatestrong.com
- [ ] Google Search Console property created for educatestrong.com

---

## Section 2 — Backend environment variables (Render)

- [ ] `DATABASE_URL` — Neon PostgreSQL connection string — set and verified
- [ ] `JWT_SECRET` — long random string — set and verified
- [ ] `NODE_ENV` — set to `production`
- [ ] `FRONTEND_URL` — set to the canonical production URL (owner decision: `https://educatestrong.com` or `https://www.educatestrong.com`)
- [ ] `RESEND_API_KEY` — Resend API key — set and verified
- [ ] `EMAIL_FROM` — set to `EducateStrong Academy <no-reply@educatestrong.com>` (or approved sender)
- [ ] `NOTIFICATIONS_EMAIL` — set to team inbox that receives Register Interest notifications
- [ ] `R2_ACCOUNT_ID` — Cloudflare R2 account ID — set and verified
- [ ] `R2_ACCESS_KEY_ID` — R2 access key — set and verified
- [ ] `R2_SECRET_ACCESS_KEY` — R2 secret — set and verified
- [ ] `R2_BUCKET_NAME` — R2 bucket name — set and verified
- [ ] `ENABLE_QA_DEMO_LOGIN` — must be absent or `false` in production

---

## Section 3 — Frontend environment variables (Vercel)

- [ ] `VITE_SITE_URL` — set to the canonical production URL (must match `FRONTEND_URL`; owner decision required)
- [ ] `VITE_API_URL` — set to `https://educate-strong-api.onrender.com/api`
- [ ] `VITE_GA_MEASUREMENT_ID` — set to real GA4 property ID (format: `G-XXXXXXXXXX`)
- [ ] `VITE_ENABLE_QA_DEMO_LOGIN` — must be absent or `false` in production
- [ ] A full Vercel deployment triggered after setting `VITE_SITE_URL` to verify canonical tags

---

## Section 4 — Email DNS (Resend)

Sending subdomain is `send.educatestrong.com` — not the root domain. See `platform-resend.md`.

- [ ] Resend sending subdomain `send.educatestrong.com` verified in Resend dashboard
- [ ] SPF TXT record for `send.educatestrong.com` present and passing
- [ ] DKIM CNAME records for `send.educatestrong.com` present and passing
- [ ] DMARC TXT record present (`_dmarc.send.educatestrong.com`)
- [ ] `EMAIL_FROM` on Render set to `EducateStrong Academy <no-reply@send.educatestrong.com>`
- [ ] Test email sent and received with correct "from" address (`no-reply@send.educatestrong.com`)
- [ ] If DNS is on Wix: confirm Wix supports TXT/CNAME at subdomain level — otherwise move DNS to Cloudflare first

---

## Section 5 — Legal pages

- [ ] Terms of Service — approved wording reviewed and provided by Educate Strong or legal advisor
- [ ] Privacy Policy — approved wording reviewed and provided
- [ ] Refund Policy — approved wording reviewed and provided
- [ ] Developer has replaced placeholder content in code with approved wording
- [ ] All three legal pages rebuilt and deployed
- [ ] `noindex` directive removed from all three legal pages after approval
- [ ] Legal pages spot-checked in browser — text displays correctly

---

## Section 6 — Domain migration

Follow `docs/domain-cutover-checklist.md` in full.

- [ ] Phase 1 pre-cutover complete (code, env vars, email DNS, Vercel domain added)
- [ ] CORS update deployed — new domain in allowed origins list on Render
- [ ] `FRONTEND_URL` on Render updated to `https://www.educatestrong.com`
- [ ] Phase 2 DNS cutover complete
- [ ] Phase 3 post-cutover verification complete
- [ ] Phase 4 monitoring (72 hours) confirmed clear

---

## Section 7 — Shopify course booking

- [ ] Shopify product created for each available course / deposit
- [ ] Checkout URLs provided to developer
- [ ] Developer has wired URLs into the course data and deployed
- [ ] "Book Now" button tested end-to-end (does it reach the Shopify checkout?)

---

## Section 8 — Safeguarding (StrongKidz)

- [ ] Named Designated Safeguarding Lead (DSL) identified and confirmed
- [ ] Safeguarding policy document prepared
- [ ] StrongKidz page updated with DSL contact details and policy link
- [ ] This section is complete before advertising youth sessions

---

## Section 9 — Contact email

- [ ] Contact email updated from `educate.strongltd@gmail.com` to the professional domain address (e.g. `info@educatestrong.com`)
- [ ] Developer has updated `frontend/src/lib/contact.ts` and deployed

---

## Section 10 — User acceptance testing

Run `docs/handover/uat-test-script.md` in full before announcing go-live.

- [ ] UAT completed by Educate Strong team member
- [ ] All critical paths working: register, verify email, login, view course, download document
- [ ] Register Interest form submits and notifications arrive
- [ ] Admin panel: enrol a learner, view submissions

---

## Section 11 — Search Console

- [ ] `sitemap.xml` submitted in Google Search Console
- [ ] Initial index coverage report clear (no unexpected 404s or errors)
- [ ] Bing Webmaster Tools: sitemap submitted

---

## Section 12 — Analytics

- [ ] GA4 Measurement ID configured and deployed
- [ ] GA4 real-time report shows live sessions after launch
- [ ] `register_interest` event visible in GA4 Events when a test submission is made
- [ ] `book_now_click` event visible in GA4 Events when Book Now is clicked

---

## Section 13 — Render plan upgrade

- [ ] Render service upgraded from free tier to Starter plan (eliminates cold-start delay)
- [ ] Or: cold-start delay accepted and documented as known limitation for initial period

---

## Section 14 — Final checks before announcing

- [ ] Website loads at `https://www.educatestrong.com`
- [ ] `https://www.educatestrong.com/sitemap.xml` returns 200 and lists real URLs
- [ ] `https://www.educatestrong.com/robots.txt` is correct
- [ ] HTTPS padlock visible in browser
- [ ] Homepage looks correct on mobile (375 px width)
- [ ] No Wix pages visible at old Wix URLs — they redirect correctly
- [ ] Login and registration work end-to-end
