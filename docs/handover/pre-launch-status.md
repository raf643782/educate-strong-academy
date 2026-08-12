# Pre-Launch System Status

Current state of all systems and services as of handover (August 2026). This is a snapshot — update it as items are resolved.

---

## Build status

| Metric | Value |
|---|---|
| Prerendered pages | 110 |
| Sitemap URLs | 107 (3 legal pages noindex — excluded from sitemap) |
| TypeScript | Clean (0 errors) |
| Frontend bundle | ~352 kB initial JS (code-split; lazy-loaded beyond Home, CourseCatalogue, NotFound) |
| Backend | Express.js on Node 18+ |

---

## Canonical domain status

**Current state**: The prerender falls back to `https://educate-strong-academy.vercel.app` when `VITE_SITE_URL` is not set.

| Check | Status |
|---|---|
| `VITE_SITE_URL` set in Vercel | **Not set** — must be set to `https://www.educatestrong.com` before domain migration |
| Canonical tags in prerendered HTML | Will reference `educate-strong-academy.vercel.app` until `VITE_SITE_URL` is set and a new deployment triggered |
| Sitemap domain | Same — will use fallback domain until env var is set |
| CORS allowlist | `educatestrong.com` and `www.educatestrong.com` are already in the backend CORS allowlist — no code change needed for domain cutover |
| `FRONTEND_URL` on Render | Must be set to `https://www.educatestrong.com` — currently controls email link domain |

**Action required**: Set `VITE_SITE_URL` in Vercel and `FRONTEND_URL` in Render, then trigger a fresh Vercel deployment before going live.

---

## Sanity CMS status

**Current state**: Dormant. Not blocking launch.

| Check | Status |
|---|---|
| Sanity client library installed | Yes (`@sanity/client`, `@portabletext/react`) |
| `VITE_SANITY_PROJECT_ID` set in Vercel | **Not set** |
| `isSanityConfigured` at runtime | `false` — all query functions return empty safely |
| Knowledge Hub | Serving 21 hardcoded articles from `knowledgeArticles.ts` — fully functional |
| Sanity preview route | `/knowledge-hub-preview` is routable but shows "not configured" message (noindex) |
| 9 Sanity articles | Exist in the approved manifest but have no Sanity project to fetch from yet |
| Launch risk | None — the existing Knowledge Hub works independently of Sanity |

**Post-launch action**: Create a Sanity project, set the 3 env vars in Vercel, load articles, review at `/knowledge-hub-preview`, then do the 4-file cutover. See `docs/handover/cms-guide.md`.

---

## Resend (transactional email) status

**Current state**: Not live. Code is fully implemented; sending domain not verified.

| Check | Status |
|---|---|
| Backend email code | Implemented in `backend/src/services/emailService.ts` |
| `RESEND_API_KEY` on Render | **Not set** |
| `EMAIL_FROM` on Render | **Not set** — falls back to `onboarding@resend.dev` (Resend test sender) |
| `NOTIFICATIONS_EMAIL` on Render | **Not set** |
| Sending domain verified in Resend | **Not done** |
| SPF DNS record | **Not added** |
| DKIM DNS records | **Not added** |
| DMARC DNS record | **Not added** |

**Impact of current state**: Emails are not sent from the correct domain. If `RESEND_API_KEY` is not set, emails are silently not sent at all (logged server-side). User verification and password reset emails will fail until Resend is configured.

**Action required before launch**: See `docs/handover/platform-resend.md` for step-by-step setup.

---

## Google Analytics status

**Current state**: Not live.

| Check | Status |
|---|---|
| GA4 tracking code | Implemented (loads `gtag.js` dynamically) |
| `VITE_GA_MEASUREMENT_ID` in Vercel | **Not set** |
| Tracking active | **No** — analytics silently disabled |
| `register_interest` event | Implemented, fires on successful RI submission |
| `book_now_click` event | Implemented, fires on Book Now CTA click |

**Action required**: Create a GA4 property for educatestrong.com, set `VITE_GA_MEASUREMENT_ID` in Vercel, redeploy.

---

## Shopify (course booking) status

**Current state**: Not connected.

| Check | Status |
|---|---|
| "Book Now" button | Present in UI |
| Shopify checkout URL | **Not configured** — button is placeholder |
| Course deposits (£100) | Shopify products **not created** |

**Action required**: Create Shopify products per course, provide checkout URLs to developer to wire into course data.

---

## Cloudflare R2 (document storage) status

**Current state**: Unknown — depends on whether env vars are set on Render.

| Check | Status |
|---|---|
| R2 integration code | Implemented with `isR2Configured()` guard |
| `R2_ACCOUNT_ID` on Render | Unknown — must verify |
| `R2_ACCESS_KEY_ID` on Render | Unknown — must verify |
| `R2_SECRET_ACCESS_KEY` on Render | Unknown — must verify |
| `R2_BUCKET_NAME` on Render | Unknown — must verify |
| R2 bucket exists in Cloudflare | Unknown — must verify |

**Action required**: Verify all 4 R2 env vars are set on Render. Test a document upload via the admin panel.

---

## Legal pages status

**Current state**: Placeholder wording. Pages are `noindex`.

| Page | Status |
|---|---|
| `/terms` | Placeholder content, `noindex` directive in place |
| `/privacy` | Placeholder content, `noindex` directive in place |
| `/refund-policy` | Placeholder content, `noindex` directive in place |

**Action required**: Owner to supply approved legal wording. Developer to replace placeholder content and remove `noindex` only after approval.

---

## Google Search Console status

**Current state**: Not yet set up for `educatestrong.com`.

**Action required**: After domain migration, add `educatestrong.com` as a GSC property, verify via DNS TXT record, and submit `sitemap.xml`.

---

## Domain migration status

**Current state**: Website is live at `educate-strong-academy.vercel.app`. Domain has not been migrated.

| Check | Status |
|---|---|
| `educatestrong.com` added to Vercel | **Not done** |
| DNS records changed to Vercel | **Not done** |
| `VITE_SITE_URL` set | **Not done** |

**Action required**: Follow `docs/domain-cutover-checklist.md` in full.

---

## Missing owner (Kris) actions before launch

| Priority | Action | Doc |
|---|---|---|
| P1 | Verify Resend domain and set 3 Resend env vars on Render | `platform-resend.md` |
| P1 | Set `VITE_SITE_URL` in Vercel and `FRONTEND_URL` on Render | `environment-inventory.md` |
| P1 | Set `VITE_GA_MEASUREMENT_ID` in Vercel | `environment-inventory.md` |
| P1 | Complete domain migration following the cutover checklist | `domain-cutover-checklist.md` |
| P1 | Provide approved legal page wording to developer | `known-limitations.md` |
| P2 | Verify R2 env vars are set on Render and test document upload | `platform-cloudflare.md` |
| P2 | Configure Shopify products and provide checkout URLs | `known-limitations.md` |
| P2 | Transfer platform account ownership to company accounts with MFA | `access-required.md` |
| P2 | Set `NOTIFICATIONS_EMAIL` on Render | `environment-inventory.md` |
| P3 | Create Sanity project and set up Knowledge Hub CMS | `cms-guide.md` |
| P3 | Upgrade Render to Starter plan (eliminates cold starts) | `platform-render.md` |
| P3 | Update contact email from Gmail to company domain | `known-limitations.md` |
| P3 | Add StrongKidz safeguarding details before advertising youth sessions | `known-limitations.md` |
| P3 | Submit sitemap to Google Search Console after domain migration | `final-handover-checklist.md` |

---

## Developer actions remaining

| Item | Notes |
|---|---|
| Replace legal page wording | When owner provides approved text |
| Wire Shopify checkout URLs | When owner provides them |
| Update contact email in `frontend/src/lib/contact.ts` | One-line change |
| React Router v6 → v7 migration | Post-launch; resolves 2 moderate CVEs |
| Sanity Knowledge Hub cutover (4 files) | Post-launch; when owner has loaded content into Sanity |
| StrongKidz safeguarding content | When owner provides details |
| GDPR data deletion tooling | Post-launch |
