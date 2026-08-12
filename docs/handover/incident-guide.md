# Incident Guide — When Something Breaks

Quick reference for first-response diagnostics. Start at the symptom, follow the steps.

---

## The website is down or returning an error

**Check first**: Vercel status dashboard — https://www.vercel-status.com

**What to look at in Vercel**:
1. Log in to https://vercel.com
2. Open the `educate-strong-academy` project
3. Click the latest deployment — look for "Error" status
4. Click "Functions" or "Deployment Summary" to see build errors

**Most common causes**:
- A failed deployment (previous deployment still serves; trigger a redeployment)
- A missing Vercel environment variable (check Settings → Environment Variables)
- A DNS misconfiguration after domain migration

**Rollback**: In Vercel, click any previous successful deployment → "Promote to Production" to roll back instantly.

---

## The API / backend is down (login fails, courses don't load, etc.)

**What to look at in Render**:
1. Log in to https://render.com
2. Open the `educate-strong-api` service
3. Check the "Events" tab for restart or crash loops
4. Check the "Logs" tab for error messages

**Free tier spin-down**: The Render free tier spins the backend down after 15 minutes of inactivity. The first request after spin-down takes 30–60 seconds. This is not a bug — it is the free tier's behaviour. Upgrade to Render Starter plan to eliminate cold starts if this is disruptive during live use.

**Most common causes**:
- Backend crashed on startup — check Render logs for `DATABASE_URL` or `JWT_SECRET` missing
- Environment variable changed or deleted accidentally
- Neon database connection refused (see below)

---

## Login is broken (users can't sign in)

**Steps**:
1. Check Render is running (above)
2. In Render logs, look for: `Invalid token`, `JWT_SECRET`, or `DATABASE_URL` error messages
3. Check that `JWT_SECRET` is set in Render environment variables and hasn't been changed recently

**If `JWT_SECRET` is changed**: All existing sessions are invalidated. Every logged-in user will be forced to log in again. This is expected behaviour, not a bug.

---

## Password reset / verification emails are not arriving

**Steps**:
1. Log in to https://resend.com → Logs tab
2. Look for recent send attempts — check their status (delivered / bounced / failed)
3. If "failed": check the `RESEND_API_KEY` is set correctly in Render
4. If "delivered" but not received: check the recipient's spam folder
5. Check that `EMAIL_FROM` in Render matches the verified sending domain in Resend

**Note**: The fallback sender is `onboarding@resend.dev` (Resend's test address). If you see that in the Render env vars instead of your real domain address, emails will still send but may land in spam and will not carry your brand.

---

## Course documents are not downloading (or uploads fail)

**What to check**:
1. Render logs — look for `R2` or `storage unavailable` messages
2. Confirm all four R2 environment variables are set in Render: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
3. Confirm the R2 bucket exists and is private in the Cloudflare dashboard

**Note**: If any R2 variable is missing, the backend returns a "storage unavailable" message rather than crashing. This is intentional. Uploads and downloads both stop working, but the rest of the platform continues.

---

## The database is down or corrupted

**Neon dashboard**: https://console.neon.tech

**Steps**:
1. Log in and check the project status
2. Check the compute endpoint status ("Idle" is fine; Neon scales to zero when not in use)
3. Check recent connection logs for errors
4. If the connection string in Render has changed, update `DATABASE_URL` in Render environment variables

**Data loss prevention**: Neon provides point-in-time restore (PITR) on paid plans. If data is accidentally deleted, contact Neon support immediately with the approximate time of the deletion.

---

## A page is returning a 404 when it shouldn't

**Possible causes**:

1. **Prerender cache out of date**: A content change in code was deployed but the relevant HTML was not prerendered. Trigger a new Vercel deployment.

2. **URL not in the SPA fallback**: The Vercel rewrite rule routes unmatched paths to the SPA shell. If a page renders a 404 within the app (not at the HTTP level), the route may not be registered in `App.tsx`.

3. **Wix redirect missing**: A URL that previously existed on the Wix site is not in the redirect map. Add it to `frontend/vercel.json` in the redirects section.

---

## Something looks broken on mobile only

1. Test in Chrome DevTools mobile emulation (iPhone SE, 375 px width)
2. If it's a layout issue: open the browser inspector and look for overflow or fixed-width elements
3. If it's an API issue on mobile: unlikely — the API is the same. Check if a CORS error appears in the console (this would affect a browser, not a phone specifically)

---

## Search Console is showing index coverage errors

**What's normal**: After a domain migration, GSC typically shows temporary errors for 48–72 hours while it re-crawls the redirected URLs.

**What to do**:
1. Log in to Google Search Console → Coverage → Errors
2. If the same URLs that existed before migration are now 404ing, check the Wix redirect map
3. Submit the `sitemap.xml` manually (Index → Sitemaps) to prompt a re-crawl

---

## How to contact each platform's support

| Platform | Support link |
|---|---|
| Vercel | https://vercel.com/help |
| Render | https://render.com/docs + in-app support |
| Neon | https://neon.tech/docs + in-app support |
| Cloudflare | https://support.cloudflare.com |
| Resend | https://resend.com/docs + in-app support |
| GitHub | https://support.github.com |
