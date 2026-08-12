# Security Status Report

As of handover (August 2026).

---

## Security headers

All production responses include the following headers (set in `frontend/vercel.json`):

| Header | Value | Status |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | ✓ In place |
| `X-Frame-Options` | `DENY` — prevents all iframe embedding | ✓ In place |
| `X-Content-Type-Options` | `nosniff` | ✓ In place |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✓ In place |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | ✓ In place |
| `Content-Security-Policy` | Full CSP — see below | ✓ In place |
| `/assets/*` immutable cache | `public, max-age=31536000, immutable` | ✓ In place |

### Content Security Policy (effective value)

```
default-src 'self';
script-src 'self' https://www.googletagmanager.com https://www.instagram.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self'
  https://educate-strong-api.onrender.com
  https://*.api.sanity.io
  https://cdn.sanity.io
  https://www.google-analytics.com
  https://analytics.google.com
  https://stats.g.doubleclick.net
  https://region1.google-analytics.com
  https://*.r2.cloudflarestorage.com;
frame-src
  https://www.openstreetmap.org
  https://www.youtube-nocookie.com
  https://player.vimeo.com
  https://www.instagram.com;
object-src 'none';
base-uri 'self'
```

**Note**: `unsafe-inline` in `style-src` allows inline `style` attributes. This is required by several UI components. It does not allow inline `<script>` tags.

---

## Dependency vulnerabilities

### Backend (`backend/`)

**Status: Clean — 0 known vulnerabilities.**

Recent fixes:
- `uuid` upgraded from v10 to v11.1.1 (patched GHSA-w5hq-g745-h8pq)
- `ip-address` transitive CVE resolved via `npm audit fix`
- `nodemailer` removed (unused dependency)

### Frontend (`frontend/`)

**Status: 4 vulnerabilities — all requiring breaking major-version upgrades.**

| Package | Severity | CVE | Exploitable in production? | Fix |
|---|---|---|---|---|
| `vite` | High | GHSA-4w7w-66w2-5vf9, GHSA-v6wh-96g9-6wx3, GHSA-fx2h-pf6j-xcff | **No** — dev server only; Vercel serves static files, the Vite dev server never runs in production | Upgrade to Vite v8 (breaking) |
| `esbuild` | Moderate | GHSA-67mh-4wv8-2f99 | **No** — dev server only | Upgrade to Vite v8 (breaking) |
| `react-router` | Moderate | GHSA-wrjc-x8rr-h8h6, GHSA-337j-9hxr-rhxg | Partial — open redirect in `<Link>` is real; constructor injection via `deserializeErrors()` is not exploitable (not used) | Upgrade to React Router v7 (breaking) |
| `react-router-dom` | Moderate | GHSA-jjmj-jmhj-qwj2 | Partial — open redirect risk | Upgrade to React Router v7 (breaking) |

**Production risk assessment**:
- Vite/esbuild: Zero production risk. The build tooling CVEs affect the development server (`vite dev`), which never runs in production. Vercel serves compiled static files from `dist/`.
- React Router open redirect (moderate): A user could be sent a malicious link that redirects them to an external site. Mitigated by: the site doesn't use deep link redirects in authentication flows; the `<Link>` component backslash bypass requires a crafted URL. Risk is low but real.

**Post-launch action**: Plan a React Router v6 → v7 migration. This is a documented migration with a compatibility layer. See https://reactrouter.com/upgrading/v6. This is not launch-blocking.

---

## Authentication security

| Measure | Implementation |
|---|---|
| Password hashing | bcrypt (via Prisma) |
| JWT signing | HS256, secret in `JWT_SECRET` env var |
| Session revocation | `isActive` checked on every authenticated request |
| Token lifetime | 7 days |
| Rate limiting | `express-rate-limit` on the backend |
| CORS | Explicit allowlist — no wildcard |
| QA demo login | Gated by env var; must be disabled in production |

---

## Data protection

| Item | Status |
|---|---|
| Database encryption at rest | Provided by Neon |
| Transport encryption | TLS on all connections (HTTPS + SSL for DB) |
| R2 document access | Private bucket; presigned URLs only; 2-minute expiry on downloads |
| JWT_SECRET | Must be set in Render as a secret (not committed to code) |
| Sensitive env vars | Never committed to Git; held in platform dashboards only |

---

## Items not yet in place

| Item | Notes |
|---|---|
| GDPR right-to-erasure tooling | No automated data deletion for individual users yet. Manual process required. |
| Security incident response plan | Not documented. |
| Penetration test | Not performed. Recommended before significant learner/payment data accumulates. |
| Sub-resource integrity (SRI) | Not applied. Inline script/style content is served from the same Vercel origin. |
