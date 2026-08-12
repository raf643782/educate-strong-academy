# Environment Variable Inventory

All variable **names** are listed here. Values are never stored in this document.

---

## Vercel (Frontend)

These are set in the Vercel project dashboard → Settings → Environment Variables.

| Variable | Required before launch? | Secret? | Purpose | What breaks if missing |
|---|---|---|---|---|
| `VITE_SITE_URL` | **YES** | No | The canonical production domain, e.g. `https://www.educatestrong.com`. Controls canonical tags, sitemap URLs, and Open Graph images. | Canonical tags and sitemap will reference the old Vercel preview URL. SEO impact. |
| `VITE_API_URL` | **YES** | No | Full URL of the backend API, e.g. `https://educate-strong-api.onrender.com/api`. | All API calls (login, courses, documents) will fail. |
| `VITE_GA_MEASUREMENT_ID` | Before analytics go live | No | Google Analytics 4 Measurement ID (format: `G-XXXXXXXXXX`). | Analytics are silently disabled. No data collected. No breakage to the site. |
| `VITE_ENABLE_QA_DEMO_LOGIN` | No — must be absent or `false` | No | Internal QA tooling gate. When absent or `false`, the QA demo login page shows "not available". | If accidentally set to `true` in production, the internal QA login route becomes accessible. Must **not** be enabled in production. |
| `VITE_SANITY_PROJECT_ID` | When Sanity CMS is activated | No | Sanity project ID (public). Enables live Sanity content for the Knowledge Hub. | Knowledge Hub falls back to local hardcoded data. No crash. |
| `VITE_SANITY_DATASET` | When Sanity is activated | No | Sanity dataset name, typically `production`. | Defaults to `production` if unset. |
| `VITE_SANITY_API_VERSION` | When Sanity is activated | No | Sanity API version string, e.g. `2024-01-01`. | Defaults to `2024-01-01` if unset. |

**Note**: After changing any `VITE_*` variable, you must trigger a new Vercel deployment for the change to take effect. Variables are baked into the frontend bundle at build time.

---

## Render (Backend API)

These are set in the Render dashboard for the backend service → Environment.

| Variable | Required before launch? | Secret? | Purpose | What breaks if missing |
|---|---|---|---|---|
| `DATABASE_URL` | **YES** | **YES** | Neon PostgreSQL connection string. | Entire backend fails to start. |
| `JWT_SECRET` | **YES** | **YES** | Secret key for signing JSON Web Tokens. Must be a long random string. | Authentication is broken — logins fail. |
| `NODE_ENV` | **YES** | No | Set to `production`. Controls logging, error verbosity and some behaviour. | Development mode in production exposes more error detail. |
| `PORT` | No | No | Port the server listens on. Render sets this automatically. | Render handles this. |
| `FRONTEND_URL` | **YES** | No | Full URL of the production frontend, e.g. `https://www.educatestrong.com`. Used in password-reset and email-verification links. **Must be updated when the domain changes.** | Password reset and verification emails contain links pointing to the wrong domain. |
| `RESEND_API_KEY` | Before emails go live | **YES** | Resend API key for sending transactional email. | Emails are not sent. Registration verification, password reset, and Register Interest emails silently fail (logged server-side). |
| `EMAIL_FROM` | Before emails go live | No | Sender address, e.g. `EducateStrong Academy <no-reply@educatestrong.com>`. Must be on a Resend-verified domain. | Falls back to `onboarding@resend.dev` (Resend test address). Not suitable for production. |
| `NOTIFICATIONS_EMAIL` | Before emails go live | No | Team inbox that receives new Register Interest submission notifications. | No notification emails are sent to the team when someone registers interest. Submissions still save to the database. |
| `R2_ACCOUNT_ID` | Before document uploads/downloads go live | **YES** | Cloudflare R2 account ID. Used to construct the R2 endpoint URL. | R2 routes return "storage unavailable" gracefully. No uploads or downloads. |
| `R2_ACCESS_KEY_ID` | Before R2 goes live | **YES** | R2 access key. | As above. |
| `R2_SECRET_ACCESS_KEY` | Before R2 goes live | **YES** | R2 secret key. | As above. |
| `R2_BUCKET_NAME` | Before R2 goes live | **YES** | Name of the R2 bucket. | As above. |
| `ENABLE_QA_DEMO_LOGIN` | No — must be `false` or absent | No | Server-side gate for QA demo login. Must not be enabled in production. | If `true`, QA demo routes are active. |
| `QA_DEMO_SECRET` | No — only if QA is enabled | **YES** | Shared secret for QA demo login. Only relevant if `ENABLE_QA_DEMO_LOGIN=true`. | QA demo routes won't work without it. |

---

## Adding New Environment Variables

When you add or change a variable on Render, the backend service automatically redeploys (or you can trigger a manual deploy).

When you add or change a variable on Vercel, a new deployment is required to pick it up. Trigger this from the Vercel dashboard or by pushing a new commit.

---

## What "Secret" Means

Variables marked **YES** in the Secret column must:
- Never be stored in source code
- Never be committed to Git
- Only be set through the platform's secure environment variable interface
- Be rotated immediately if accidentally exposed

Public configuration variables (marked No) may appear in browser-readable code and are safe to share.
