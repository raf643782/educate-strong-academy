# Domain Cutover Checklist: Wix → Educate Strong Academy

**Purpose**: step-by-step runbook for cutting over from the Wix site to
the new Educate Strong Academy (Vercel) deployment, adding a custom
domain, and verifying everything is working before standing down.

---

## Phase 1 — Pre-cutover (complete BEFORE touching DNS)

### 1.1 Code and configuration

- [ ] Branch `seo/critical_technical_closure` merged to `main`
- [ ] `VITE_SITE_URL` set to the real custom domain in Vercel production
      environment variables (e.g. `https://www.educatestrong.com`)
- [ ] A full production build triggered after setting `VITE_SITE_URL` —
      verify the new domain appears in `dist/sitemap.xml` and in the
      canonical tags of spot-checked prerendered pages
- [ ] All Wix redirect entries added to `frontend/vercel.json` and
      tested in a preview deployment (see `wix-redirect-map.md`)
- [ ] `VITE_GA_MEASUREMENT_ID` set to the real GA4 property ID in Vercel
      production environment variables
- [ ] Backend `FRONTEND_URL` env var updated on Render to the new custom
      domain (e.g. `https://www.educatestrong.com`). This controls the
      domain in password-reset and email-verification link emails. Update
      BEFORE cutover so emails sent after go-live carry the correct URL.
- [ ] New domain added to the backend CORS allowed-origins list in
      `backend/src/middleware/cors.ts` (or wherever the allowlist lives),
      the change deployed to production on Render, and smoke-tested from
      a Vercel preview deployment before DNS switch.

### 1.2 Email DNS pre-cutover

Resend uses the sending subdomain `send.educatestrong.com` (not the root domain). DNS records are TXT and CNAME only — no MX records. These are separate from A/CNAME changes and do not affect Google Workspace email. Complete these **before** DNS switch:

- [ ] Resend sending subdomain `send.educatestrong.com` verified in Resend dashboard
- [ ] SPF TXT record for `send.educatestrong.com` present and passing in Resend
- [ ] DKIM CNAME records for `send.educatestrong.com` present and passing
- [ ] DMARC TXT record (`_dmarc.send.educatestrong.com`) in place
- [ ] If DNS is currently on Wix: the existing Wix DNS setup may not support the subdomain MX configuration required by the chosen Resend setup — Cloudflare DNS management may be required first
- [ ] Send a test transactional email (e.g. password reset on staging) and confirm delivery + correct "from" address (`no-reply@send.educatestrong.com`) before go-live

### 1.4 SEO baseline (record before cutover)

- [ ] Screenshot / export Google Search Console index coverage report
- [ ] Export any existing Bing Webmaster Tools report
- [ ] Record current organic traffic baseline from analytics or GSC

### 1.5 Vercel custom domain

- [ ] Custom domain added in Vercel project settings
      (Settings → Domains → Add)
- [ ] Vercel confirms domain is valid (shows the CNAME/A target to add)
- [ ] Do NOT change DNS yet — just confirm Vercel has the domain ready

### 1.6 Staging verification

- [ ] Open every URL in the Wix redirect map against the Vercel preview
      deployment and confirm all return 308
- [ ] Spot-check 5 prerendered pages (`/exercises/log-press`,
      `/events/atlas-stone`, `/knowledge/teaching-the-hip-hinge`,
      `/courses/level-1-coaching-strongman`, `/`) for:
        - Correct page title in `<title>`
        - Canonical tag pointing to the real custom domain
        - Structured data present
- [ ] Confirm `robots.txt` and `sitemap.xml` load and reference the
      correct domain
- [ ] Confirm mobile layout on at least one course page and one
      knowledge article (375 px viewport)

---

## Phase 2 — DNS cutover

### 2.1 Wix DNS changes

- [ ] Log in to the domain registrar / Wix DNS panel
- [ ] Lower TTL on the root A record and www CNAME to 300 seconds at
      least 24 hours before cutover (to speed propagation and rollback)
- [ ] Screenshot current DNS records before changing anything

### 2.2 Apply the DNS change

- [ ] Update the A record (root `@`) to Vercel's IP (see Vercel docs —
      typically `76.76.21.21`)
- [ ] Update (or add) the `www` CNAME to `cname.vercel-dns.com.`
- [ ] Record the change time

### 2.3 Wait for propagation

- [ ] Use `dig +short your-domain.com A` or `https://dnschecker.org`
      to confirm propagation in your target regions (UK, EU)
- [ ] Do not proceed to Phase 3 until DNS resolves to Vercel's IP

---

## Phase 3 — Post-cutover verification

### 3.1 Immediate checks (within 30 minutes)

- [ ] `https://your-domain.com` loads with a valid TLS certificate
      (Vercel provisions Let's Encrypt automatically)
- [ ] `https://www.your-domain.com` redirects to / loads the canonical
      version (confirm with Vercel SSL settings)
- [ ] Homepage loads correct content — not a Wix page
- [ ] One course page, one exercise page, one knowledge article load
      with correct title and content
- [ ] `https://your-domain.com/sitemap.xml` loads (200 OK)
- [ ] `https://your-domain.com/robots.txt` loads with correct
      `Sitemap:` pointing to new domain
- [ ] Auth pages (`/login`, `/register`) still function (API calls work)

### 3.2 Redirects check

- [ ] Spot-check 5 Wix source URLs — confirm each returns 308 to the
      correct new destination
- [ ] Confirm old Wix paths do NOT return 200 with stale Wix content

### 3.3 Analytics

- [ ] Google Analytics real-time report shows sessions on the new domain
- [ ] Verify no duplicate sessions (old Wix GA property vs new GA4)

### 3.4 Search Console

- [ ] Add the new domain as a property in Google Search Console
- [ ] Submit `sitemap.xml`
- [ ] Monitor Index Coverage for errors over the following 48 hours

### 3.5 Structured data

- [ ] Use Google's Rich Results Test on:
      - One exercise page
      - One knowledge article
      - The homepage (Organization schema)
      - One course page (Course + FAQPage schema)

---

## Phase 4 — Post-cutover monitoring (72 hours)

- [ ] No spike in 404s in Vercel access logs or GSC Coverage report
- [ ] No loss of indexed pages beyond the expected redirect processing
      lag (GSC typically takes 2–7 days to re-index redirected pages)
- [ ] Email deliverability unchanged (MX, SPF, DKIM records unaffected
      by A/CNAME changes — verify no accidental record deletion)
- [ ] Resend domain authentication unchanged
      (Resend uses its own DNS records, not A/CNAME)

---

## Rollback plan

If anything goes wrong within the first 24 hours:

1. Revert the A record and CNAME to the original Wix values
2. TTL is 300 s — DNS should propagate back within 5–10 minutes
3. The Wix site continues serving as before
4. Debug the issue in the Vercel preview environment before retrying

---

## Contacts

- **Domain registrar panel**: [add registrar URL]
- **Vercel project**: [add Vercel project URL]
- **Google Search Console**: [add GSC property URL]
- **GA4 property**: [add GA4 property URL]
