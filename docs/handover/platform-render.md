# Render — Operator Guide

Render hosts the backend API. All authenticated actions (login, course access, email, document download) go through Render.

---

## What Render does

- Runs the Express.js backend server (`backend/src/index.ts`)
- Connects to the Neon PostgreSQL database
- Sends transactional emails via the Resend API
- Generates presigned upload/download URLs for Cloudflare R2
- Issues and validates JWT authentication tokens

---

## Dashboard access

1. Go to https://render.com and log in with the Educate Strong account
2. Open the `educate-strong-api` service

---

## Environment variables

Set at: **Service → Environment**

After changing a variable, Render auto-redeploys the service (or you can trigger a manual deploy).

| Variable | Required | Secret | Notes |
|---|---|---|---|
| `DATABASE_URL` | YES | YES | Neon connection string |
| `JWT_SECRET` | YES | YES | Long random string; changing it logs out all users |
| `NODE_ENV` | YES | No | Set to `production` |
| `FRONTEND_URL` | YES | No | `https://www.educatestrong.com` — used in email links |
| `RESEND_API_KEY` | Before emails | YES | From Resend dashboard |
| `EMAIL_FROM` | Before emails | No | `EducateStrong Academy <no-reply@educatestrong.com>` |
| `NOTIFICATIONS_EMAIL` | Before emails | No | Team inbox for Register Interest notifications |
| `R2_ACCOUNT_ID` | Before R2 uploads | YES | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | Before R2 uploads | YES | R2 access key |
| `R2_SECRET_ACCESS_KEY` | Before R2 uploads | YES | R2 secret |
| `R2_BUCKET_NAME` | Before R2 uploads | YES | Bucket name |
| `ENABLE_QA_DEMO_LOGIN` | No | No | Must be absent or `false` in production |

---

## Service plan

**Current plan**: Free tier

**Free tier limitation**: The service spins down after 15 minutes of no requests. The first request after spin-down takes 30–60 seconds. This is disruptive for real learners.

**Recommendation**: Upgrade to Render's **Starter plan** (~$7/month) before learner sessions begin. This eliminates cold starts.

---

## Deployments

**Automatic**: Every push to the `main` branch on GitHub triggers a new Render deployment (if GitHub is connected).

**Manual**: In the Render dashboard → Manual Deploy → Deploy latest commit.

**Rollback**: In the Render dashboard → Events tab → click "Rollback" next to any previous successful deploy.

---

## Logs

In the Render dashboard → Logs tab. Use this to diagnose:
- Startup errors (missing env vars, database connection failure)
- Request errors (401 auth failures, 500 server errors)
- Email send results (Resend success/failure logged here)

---

## Health check

The backend exposes `GET /api/health` (or the root URL responds). Render uses this to determine when the service is ready after a deployment.

---

## Monitoring cold starts

If learners report slow first-page loads or slow logins, check:

1. Render Events tab — look for "Scaled to 0" or "Starting" events
2. Upgrade to Starter plan to prevent this

---

## CORS

The backend allows these origins (hardcoded in `backend/src/index.ts`):
- `http://localhost:5174` (local development)
- `http://localhost:3000` (local development)
- `https://educate-strong-academy.vercel.app` (Vercel project URL)
- `https://educatestrong.com` (apex domain — ready for cutover)
- `https://www.educatestrong.com` (www domain — ready for cutover)
- The value of `FRONTEND_URL` env var (additional override)

**No additional CORS changes are needed for the domain migration** — `educatestrong.com` is already in the allowlist.

---

## What breaks if Render is down

- Login and registration
- All authenticated features (learner portal, admin panel, documents)
- Transactional emails
- Register Interest form submissions (the API call fails; the submission is not saved)

The public website (Vercel) continues to serve all prerendered pages normally when Render is down.
