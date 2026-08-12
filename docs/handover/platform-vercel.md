# Vercel — Operator Guide

Vercel hosts the frontend (public website). All page requests go through Vercel.

---

## What Vercel does

- Serves all prerendered HTML pages (110 static files)
- Serves the SPA shell fallback for routes not covered by prerendered files
- Runs three serverless API functions at `frontend/api/`:
  - `spa-fallback-or-404.mjs` — handles the main SPA routing
  - `library-not-found.mjs` — returns 404 JSON for exercises/events
  - `knowledge-draft-not-found.mjs` — handles the excluded knowledge article
- Injects security headers (HSTS, CSP, X-Frame-Options, etc.) via `frontend/vercel.json`
- Issues TLS certificates automatically (Let's Encrypt)
- Applies all redirects defined in `frontend/vercel.json`

---

## Dashboard access

1. Go to https://vercel.com and log in with the Educate Strong account
2. Open the `educate-strong-academy` project

---

## Environment variables

Set at: **Settings → Environment Variables**

| Variable | Value to set |
|---|---|
| `VITE_SITE_URL` | `https://www.educatestrong.com` (after domain migration) |
| `VITE_API_URL` | `https://educate-strong-api.onrender.com/api` |
| `VITE_GA_MEASUREMENT_ID` | Your GA4 property ID (format: `G-XXXXXXXXXX`) |
| `VITE_ENABLE_QA_DEMO_LOGIN` | Must be absent or `false` in production |
| `VITE_SANITY_PROJECT_ID` | Set only after Sanity project created (post-launch) |

**After changing any `VITE_*` variable**: Trigger a new deployment. These are baked into the build — they do not apply to previously built files.

---

## Deployments

**Automatic**: Every push to the `main` branch on GitHub triggers a new Vercel production deployment.

**Manual**: In the Vercel dashboard → Deployments → click the three-dot menu → "Redeploy" on any deployment.

**Rollback**: Click any previous successful deployment → "Promote to Production". This is instant — the old build is already on Vercel's CDN.

---

## Custom domain setup

To go live at `educatestrong.com`:

1. In Vercel dashboard → Settings → Domains
2. Add `educatestrong.com` and `www.educatestrong.com`
3. Vercel will show the DNS records to add (typically an A record for the root and a CNAME for www)
4. Add those records in the Cloudflare DNS panel for `educatestrong.com`
5. Vercel will automatically provision a TLS certificate once DNS propagates

See `docs/domain-cutover-checklist.md` for the full safe migration process.

---

## Build configuration

The build command is defined in `frontend/package.json`:

```
build:client  → vite build (client bundle)
build:ssr     → vite build --ssr src/entry-server.tsx (SSR bundle)
prerender     → node scripts/prerender.mjs (generates 110 HTML pages)
build         → all three in sequence
```

Vercel runs `npm run build` automatically. The prerender step fetches exercises and events from the live backend API, so the backend must be running during the build.

---

## Important files

| File | Purpose |
|---|---|
| `frontend/vercel.json` | Headers, redirects, rewrites, SPA fallback routing |
| `frontend/scripts/prerender.mjs` | Generates all 110 static HTML pages and sitemap/robots.txt |
| `frontend/src/entry-server.tsx` | SSR render functions used by the prerender script |

---

## What to check if a Vercel deployment fails

1. Go to Deployments → click the failed deployment → "Build Logs"
2. Common causes:
   - TypeScript compile error — check the log for `error TS`
   - Prerender fetch failure — the backend is down or the API URL env var is wrong
   - Missing environment variable — the build will log a warning or the prerender will use the fallback URL
3. The previous deployment continues to serve traffic while the new one fails
4. Fix the issue in the codebase, push to `main`, and a new deployment will start automatically

---

## Costs

Vercel's free Hobby tier supports this project for now. Before commercial launch (with real users paying for courses), upgrade to the **Pro plan** (~$20/month) to:
- Remove the Vercel branding requirement for commercial use
- Get more function invocations per month
- Enable log retention

---

## Security headers in place

Configured in `frontend/vercel.json`:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` (HSTS) |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | Full CSP (see `vercel.json`) |
| `/assets/*` Cache-Control | `public, max-age=31536000, immutable` |
