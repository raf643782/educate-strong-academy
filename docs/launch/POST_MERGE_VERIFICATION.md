# Post-Merge Production Verification

> Records the live verification of PR #8 after merge into `main`.
> Date: 2026-08-01

---

## PR #8 details

| Field | Value |
|-------|-------|
| PR number | #8 |
| Title | Launch integration verification: Sections 4, 7, 8, 9 and 10 |
| URL | https://github.com/raf643782/educate-strong-academy/pull/8 |
| State | Merged |
| Merged at | 2026-08-01T04:19:07Z |

## SHAs

| Point | SHA |
|-------|-----|
| Pre-merge `origin/main` | `1dcce67c1f64794c4c5a23dd704a1b589ec155ef` |
| Integration branch HEAD | `9fec14bcd60f8745faa98e77c8e56631e87fac7a` |
| Merge commit | `269955572b4a742acb7fe1a70d17a345aff26763` |
| Post-merge `origin/main` | `269955572b4a742acb7fe1a70d17a345aff26763` |

---

## Deployment results

### Vercel (frontend)

Deployment confirmed via live response headers immediately after merge. All four Section 10 security headers present with `age: 0` and `x-vercel-cache: MISS`, confirming a fresh deployment from the new `main`.

| Header | Value | Status |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | ✅ Live |
| `X-Content-Type-Options` | `nosniff` | ✅ Live |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ Live |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | ✅ Live |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ Vercel platform default |

### Render (backend)

Health endpoint returned HTTP 200 at 113ms (warm). No cold start delay detected.

Access limitation: Render does not expose a public deployment status API. Deployment confirmed through live behaviour only.

---

## Live route verification

All tests run against `https://educate-strong-academy.vercel.app` and `https://educate-strong-api.onrender.com` on 2026-08-01.

### Public routes

| Route | HTTP Status | Method |
|-------|-------------|--------|
| `/` | ✅ 200 | Live |
| `/courses` | ✅ 200 | Live |
| `/courses/level-1-coaching-strongman` | ✅ 200 | Live |
| `/courses/level-1-strongman-refereeing` | ✅ 200 | Live |
| `/about` | ✅ 200 | Live |
| `/knowledge` | ✅ 200 | Live |
| `/exercises` | ✅ 200 | Live |
| `/exercises/arm-over-arm-rope-pull` | ✅ 200 | Live (pre-rendered) |
| `/events` | ✅ 200 | Live |
| `/events/atlas-stones` | ✅ 200 | Live (pre-rendered) |
| `/eatstrong` | ✅ 200 | Live |
| `/login` | ✅ 200 | Live |
| `/register` | ✅ 200 | Live |
| `/forgot-password` | ✅ 200 | Live |
| `/register-interest` | ✅ 200 | Live |
| `/privacy` | ✅ 200 | Live |
| `/terms` | ✅ 200 | Live |
| `/refund-policy` | ✅ 200 | Live |
| `/this-route-does-not-exist-xyz` | ✅ 404 | Live (genuine 404) |
| `/api/health` | ✅ 200 | Live |

---

## Section 4 — CTA label verification

**Method:** Source code inspection of merged files on `main`.

| Check | Result |
|-------|--------|
| `CourseHero.tsx` button reads "Register Interest" | ✅ Confirmed |
| `CoursePricingCard.tsx` button reads "Register Interest" | ✅ Confirmed |
| `CourseFinalCTA.tsx` button reads "Register Interest" | ✅ Confirmed |
| "Secure Your Place" absent from all three components | ✅ Confirmed absent |
| All three link to `/register-interest?type=…` | ✅ Confirmed |

Note: Course pages are SPA-rendered, so CTA labels cannot be verified in raw HTTP responses. Source code inspection is the authoritative check for this section.

---

## Section 7 — CORS verification

**Method:** Live HTTP requests with `Origin:` header to production API.

| Origin tested | `Access-Control-Allow-Origin` response | Expected |
|---------------|---------------------------------------|---------|
| `https://educate-strong-academy.vercel.app` | ✅ Echoed back | Allowed |
| `https://educatestrong.com` | ✅ Echoed back | Allowed |
| `https://www.educatestrong.com` | ✅ Echoed back | Allowed |
| `https://some-random-project.vercel.app` | ✅ Header absent | Rejected |

The wildcard `*.vercel.app` is confirmed removed. Only the four explicit allowed origins pass.

---

## Section 8 — Accessibility verification

**Method:** Source code inspection of merged files on `main`. SPA-rendered pages cannot have accessibility attributes verified in raw HTTP responses; source is authoritative.

| Check | Result |
|-------|--------|
| Skip-to-main-content link present in `Navbar.tsx` | ✅ 1 instance |
| `<main id="main-content">` in `Home.tsx` | ✅ Present |
| `<main id="main-content">` in `Login.tsx` | ✅ Present |
| `<main id="main-content">` in `Register.tsx` | ✅ Present |
| `<main id="main-content">` in `RegisterInterest.tsx` | ✅ Present |
| `htmlFor`/`id` associations in `Login.tsx` | ✅ 2 pairs |
| `htmlFor`/`id` associations in `Register.tsx` | ✅ 5 pairs |
| `htmlFor`/`id` associations in `RegisterInterest.tsx` | ✅ 4 pairs |
| `role="alert"` on errors in `Login.tsx` | ✅ 3 instances |
| `role="alert"` on errors in `Register.tsx` | ✅ 6 instances |
| `role="alert"` on errors in `RegisterInterest.tsx` | ✅ 3 instances |
| `role="alert"` on newsletter error in `Footer.tsx` | ✅ 1 instance |
| `<nav aria-label="Footer navigation">` in `Footer.tsx` | ✅ Present |

Mobile navigation: not verifiable by HTTP response. Source inspection confirms `aria-expanded`, `aria-label` (Open/Close menu) on hamburger button — unchanged from pre-merge baseline.

---

## Section 9 — SEO verification

**Method:** Live HTTP response content inspection.

| Check | Result | Value |
|-------|--------|-------|
| `og:image` absolute URL (exercise page) | ✅ Absolute | `https://educate-strong-academy.vercel.app/assets/atlas-stone-branded.png` |
| `og:url` on prerendered exercise page | ✅ Present | `https://educate-strong-academy.vercel.app/exercises/arm-over-arm-rope-pull` |
| `canonical` on prerendered exercise page | ✅ Present | `https://educate-strong-academy.vercel.app/exercises/arm-over-arm-rope-pull` |
| `og:url` on prerendered event page | ✅ Present | `https://educate-strong-academy.vercel.app/events/atlas-stones` |
| `og:url` matches `canonical` | ✅ Match |  |
| `/sitemap.xml` HTTP status | ✅ 200 |  |
| `/robots.txt` HTTP status | ✅ 200 |  |
| Sitemap URL count | ✅ 113 | Confirmed via XML parse |
| Prerendered canonical count | ✅ 55 | `validate-sitemap` passed |
| Sitemap domain | ✅ `educate-strong-academy.vercel.app` | Correct until cutover + env var update |

---

## Section 10 — Security verification

**Method:** Live HTTP response header inspection + source code check.

### HTTP security headers (confirmed live on 2026-08-01)

| Header | Value | Status |
|--------|-------|--------|
| `X-Frame-Options` | `DENY` | ✅ Live |
| `X-Content-Type-Options` | `nosniff` | ✅ Live |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ Live |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | ✅ Live |

### Vercel rewrites after headers addition

| Route | Expected HTTP | Result |
|-------|--------------|--------|
| `/knowledge/is-strongman-safe-for-children` | 404 | ✅ 404 |
| `/exercises/arm-over-arm-rope-pull` (valid slug) | 200 | ✅ 200 |
| `/exercises/completely-made-up-slug-xyz` | 404 | ✅ 404 |
| `/events/completely-made-up-event-xyz` | 404 | ✅ 404 |
| `/some-random-route-xyz` | 404 | ✅ 404 |

### Error handler

`GET /api/auth/me` without a token returns `{"error":"No token provided"}` — a clean, intentional auth error message. Internal Prisma or stack-frame detail is not exposed. A deliberately malformed request was not attempted to avoid any data risk; production error handler behaviour is confirmed correct by source inspection (`IS_PRODUCTION` guard in `errorHandler.ts`).

---

## QA demo route

| Check | Result |
|-------|--------|
| `/qa-demo` HTTP status | 200 (SPA shell returned) |
| Body content | SPA shell only — `"This page is not available."` rendered client-side by JS |
| Working demo login accessible | Not accessible — page requires `VITE_ENABLE_QA_DEMO_LOGIN=true` at Vite build time, which is absent from the production build |
| Direct Vercel env var check | Not directly verifiable without dashboard access — see owner action |

The QA demo does not provide a working login path. The "This page is not available." message is the correct production behaviour. Owner must confirm `VITE_ENABLE_QA_DEMO_LOGIN` is absent in Vercel dashboard to close this item formally.

---

## Legal content

`[COMPANY NUMBER]` and `[REGISTERED ADDRESS]` placeholders are confirmed present in:
- `frontend/src/pages/public/Terms.tsx` (lines 17–18)
- `frontend/src/pages/public/Privacy.tsx` (lines 16–17)
- `frontend/src/components/layout/Footer.tsx` (line 269)

**Section 3 remains BLOCKED.** These placeholders were not altered by PR #8.

---

## Email delivery

Section 6 remains BLOCKED. No Resend/Render configuration has been completed by the owner. No production email tests were attempted.

---

## Build and validation results (fresh `main` checkout)

| Check | Result |
|-------|--------|
| Backend `tsc` | ✅ PASS — 0 errors |
| Frontend `tsc` | ✅ PASS — 0 errors |
| `vite build` (client) | ✅ PASS — 227 modules |
| `vite build --ssr` | ✅ PASS — 111 kB SSR bundle |
| `node scripts/prerender.mjs` | ✅ PASS — 55 pages, sitemap 113 URLs, robots.txt |
| `validate-sitemap` | ✅ PASS — all 55 canonicals verified |
| Automated test suite | N/A — no test runner configured |

---

## Regression check

| Check | Result |
|-------|--------|
| Exactly 17 files changed vs pre-merge baseline | ✅ Confirmed |
| Legal files unchanged | ✅ 0 diff lines |
| Checkout/payment files unchanged | ✅ None in diff |
| Course data unchanged | ✅ No course data files in diff |
| Testimonial data unchanged | ✅ Unchanged |
| DNS/infrastructure config unchanged | ✅ Unchanged |
| No files deleted | ✅ 0 deleted |
| No files renamed or moved | ✅ 0 renamed |
| All 4 Vercel rewrites intact | ✅ Confirmed |
| Security headers and rewrites coexist | ✅ Confirmed |
| Hotfix required | None |

---

## What could not be directly tested

| Item | Reason | Status |
|------|--------|--------|
| Course CTA labels in browser | SPA-rendered; cannot inspect client JS output via HTTP | Verified by source code |
| Accessibility attributes in browser | SPA-rendered | Verified by source code |
| Mobile menu rendering | No headless browser available | Source confirms aria attributes unchanged |
| QA demo env var direct check | Requires Vercel dashboard | Route behaviour confirms feature is off |
| Email delivery | Render env vars not yet configured | Section 6 BLOCKED |
| Authenticated routes (dashboard) | No test credentials available in this context | Source audit confirmed correct in Section 5 |
| Render auto-deploy confirmation | No Render API access | Health endpoint confirms live warm instance |

---

## Current launch verdict

> **CONDITIONAL GO — all technical work is on `main`. Three owner actions remain before domain cutover.**

1. **Section 3 legal content** — placeholder text live on `/privacy`, `/terms`, `/refund-policy`, and Footer
2. **Section 6 email configuration** — password reset non-functional; Render/Resend env vars not set
3. **QA demo env var confirmation** — one-minute Vercel dashboard check needed

The site is technically correct and production-ready. Cutover playbook is in `docs/launch/section-12-cutover-playbook.md` on the `launch/section-12-cutover` branch.
