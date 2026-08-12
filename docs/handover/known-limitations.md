# Known Limitations and Post-Launch Work

This document records things that are known to be incomplete, not yet activated, or requiring owner action before they work as intended. None of these are bugs — they are intentional placeholders or deferred features.

---

## 1. Shopify course booking is not activated

**Status**: The "Book Now" button on course pages is present in the UI but currently points to a placeholder. The button will not route to a payment checkout until Shopify product URLs are provided and configured.

**What is needed**:
- A Shopify account with products created for each course deposit (e.g. Level 1 Coaching — £100 deposit)
- The Shopify checkout URL for each product
- A developer to wire these URLs into the course data

**Until then**: The Register Interest form is the primary conversion path. All Register Interest submissions are saved and notified to the team.

**Risk if ignored**: The platform can only take enquiries, not payments. Launch is possible, but course sales require Shopify to be connected.

---

## 2. Legal pages are not indexed by search engines

**Status**: Three legal pages — Terms of Service (`/terms`), Privacy Policy (`/privacy`), and Refund Policy (`/refund-policy`) — currently contain placeholder wording and are marked `noindex` so they do not appear in Google search results.

**What is needed**:
- Approved legal wording for each page, provided by Educate Strong or their legal advisor
- A developer to replace the placeholder content in the code
- Once approved wording is in place: remove the `noindex` directive so the pages are indexable

**Do not remove `noindex` until the wording is approved.** Publishing unapproved legal wording creates compliance and regulatory risk.

---

## 3. Knowledge Hub articles require a code change to edit

**Status**: The 21 Knowledge Hub articles are stored as hardcoded data in the frontend codebase (`frontend/src/lib/knowledgeArticles.ts`). Adding, editing, or removing an article requires editing this file, committing, and redeploying.

**Post-launch option**: A Sanity CMS integration was developed but not yet merged. Activating it would allow Knowledge Hub articles to be managed through a web-based CMS without code changes. See `docs/handover/cms-guide.md`.

**Risk if ignored**: Keeping the Knowledge Hub current requires developer involvement for every content update.

---

## 4. Exercises and Events require a code change to edit

**Status**: The Exercise Library (29 exercises) and Event Library (26 events) are also stored as hardcoded data files in the codebase. Editing these requires a code change.

**There is no CMS integration planned for exercises and events at this stage.** Content updates require a developer.

---

## 5. Resend transactional email requires domain verification

**Status**: Transactional emails (verification, password reset, Register Interest confirmation) are configured to send via Resend, but the sending domain (`educatestrong.com`) must be verified in the Resend dashboard before emails deliver reliably.

**What is needed**:
- DNS records added for the sending domain (SPF, DKIM) — done in Resend dashboard → Domains
- This must happen before or during the domain migration. See `docs/domain-cutover-checklist.md` Phase 1.2.

**Until then**: Emails may be delivered from Resend's test sender and will likely land in spam.

---

## 6. GA4 analytics requires a Measurement ID to be set

**Status**: The analytics code is in place and working, but no data will be collected until a `VITE_GA_MEASUREMENT_ID` is set in Vercel.

**What is needed**:
1. Create a Google Analytics 4 property for `educatestrong.com`
2. Copy the Measurement ID (`G-XXXXXXXXXX`)
3. Set it as `VITE_GA_MEASUREMENT_ID` in Vercel environment variables
4. Trigger a new Vercel deployment

**Until then**: No visitor data is recorded. The website continues to function normally.

---

## 7. Render backend cold-start delay (free tier)

**Status**: The backend API is hosted on Render's free tier, which spins the server down after 15 minutes of inactivity. The first request after spin-down takes 30–60 seconds, which means login and other API-dependent actions may be slow for the first user after a quiet period.

**Fix**: Upgrade the Render service to the Starter plan (paid). This eliminates cold starts.

**Recommendation**: Upgrade before live learner sessions begin. A 60-second login delay during a live coaching session is disruptive.

---

## 8. StrongKidz safeguarding section is incomplete

**Status**: The StrongKidz page (`/strongkidz`) is live but does not include a named safeguarding lead, contact details, or a link to the safeguarding policy document.

**What is needed before advertising youth sessions**:
- Named Designated Safeguarding Lead (DSL) with contact details
- A safeguarding policy document
- This content to be added to the StrongKidz page (requires a code change)

**Risk if ignored**: Advertising youth sports sessions without visible safeguarding information is a reputational and regulatory risk.

---

## 9. Contact email address is a Gmail address

**Status**: The contact email shown on the website is `educate.strongltd@gmail.com`. This is a personal Gmail address, not a professional company domain address.

**What is needed**: Replace with a Google Workspace email address (e.g. `info@educatestrong.com` or `kris@educatestrong.com`) once Google Workspace is active on the company domain.

**Location**: `frontend/src/lib/contact.ts`, line 1.

---

## 10. Certificate verification is public but no certificates are yet issued

**Status**: The public certificate verification page (`/verify/:id`) is functional. However, no real certificates have been issued yet — the database is empty until a real learner completes a course and is certified.

**No action needed**: This is expected pre-launch. Issue the first certificates through the Certificate Manager in the admin panel once a cohort completes.

---

## 11. R2 document storage requires four environment variables

**Status**: Cloudflare R2 private document storage is implemented and working, but requires four environment variables set on Render to function. If any are missing, uploads and downloads are gracefully disabled.

**What is needed**: Confirm `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME` are set in Render. See `docs/handover/environment-inventory.md`.

---

## 12. QA demo login must not be enabled in production

**Status**: There is a QA demo login tool at `/qa-login` used during development. It is gated by `VITE_ENABLE_QA_DEMO_LOGIN` (frontend) and `ENABLE_QA_DEMO_LOGIN` (backend).

**Constraint**: Both variables must be absent or set to `false` in the production environment. If `VITE_ENABLE_QA_DEMO_LOGIN=true` is set in Vercel for production, the QA login route becomes publicly accessible.

**Check**: Verify neither variable is set to `true` in the production Vercel or Render environments before launch.
