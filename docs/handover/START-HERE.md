# Educate Strong Academy — Start Here

**Welcome to the technical handover guide.**

This is the first document to read. It tells you what has been built, what is working, what still needs your input, and where to go when something breaks.

---

## What Has Been Built

The Educate Strong Academy website is a full-stack web application with:

- A **public website** that prospective learners, coaches and athletes can browse — courses, the Knowledge Hub, exercises, events, EatStrong nutrition content, a coach directory, and a StrongKidz section
- A **learner portal** where enrolled students access course content, lessons, assessments, CPD records, and downloadable course documents
- A **coach workspace** for certified coaches to manage their public profile
- A **tutor workspace** for course tutors to manage content and learner cohorts
- An **assessor portal** for reviewing learner submissions
- A **full admin panel** for managing every aspect of the platform

---

## What Is Already Working

### Public website
- All public pages are prerendered for search engine crawling (110 pages)
- Google-friendly metadata, structured data, sitemap and robots.txt
- Mobile-friendly layout
- Knowledge Hub with 21 articles
- Exercise Library (29 exercises)
- Event Library (26 events)
- EatStrong nutrition hub (10 articles, 9 categories)
- Course catalogue and course detail pages
- Coach directory
- Register Interest form

### Platform infrastructure
- User registration, email verification, login, password reset
- Role-based access (Public, Learner, Coach, Tutor, Assessor, Admin)
- Private course document storage (Cloudflare R2)
- Transactional email (Resend — pending domain verification)
- Google Analytics 4 tracking (pending Measurement ID configuration)
- Security headers (HSTS, CSP, X-Frame-Options)
- Backend API with rate limiting and authentication

---

## Where Everything Is Hosted

| Component | Platform | URL |
|---|---|---|
| Public website | Vercel | https://educate-strong-academy.vercel.app |
| Backend API | Render | https://educate-strong-api.onrender.com |
| Database | Neon (PostgreSQL) | Via Render env var |
| Course documents | Cloudflare R2 | Private bucket |
| Transactional email | Resend | Via Render env var |
| Future domain | Vercel + DNS | https://educatestrong.com |

---

## What Still Needs Your Input

### Before the website goes live on educatestrong.com

1. **Legal pages** — the Terms of Service, Privacy Policy and Refund Policy pages exist but are marked "do not index" until you provide the approved wording. See `docs/handover/final-handover-checklist.md`.

2. **Domain migration** — the website currently lives at the Vercel preview URL. To go live at educatestrong.com, follow `docs/domain-cutover-checklist.md`.

3. **Email DNS** — Resend needs DNS records added to your domain before transactional emails will deliver reliably. See `docs/handover/final-handover-checklist.md`.

4. **Google Analytics** — you need to create a GA4 property, copy the Measurement ID, and set it in Vercel. See `docs/handover/environment-inventory.md`.

5. **Vercel environment variables** — a small number of variables must be set before go-live. See `docs/handover/environment-inventory.md`.

### Before you can sell courses

6. **Shopify** — the "Book Now" button on course pages is hidden until you provide a Shopify checkout URL. See `docs/handover/known-limitations.md`.

7. **Course dates and venues** — these are entered through the admin panel once confirmed.

8. **SafeguardIng information** — the StrongKidz section needs named safeguarding lead and policy details before youth sessions are publicly advertised.

---

## How the CMS Works

The Knowledge Hub currently serves content from a fixed article list in the code. Editing articles requires a code change and redeployment. A Sanity CMS integration was developed and is ready to be activated — see `docs/handover/cms-guide.md` for what is required.

Everything else (courses, cohorts, users, documents, assessments) is managed through the **Admin Panel** at `/admin` — no code changes needed. See `docs/handover/admin-guide.md`.

---

## How Payments Work

Currently the website does not process payments directly. The intended flow is:

1. User visits a course page
2. Clicks "Book Now" → goes to a Shopify checkout link you provide
3. Pays a £100 deposit via Shopify
4. Admin enrols them on the platform

The "Register Interest" form (already working) is the fallback for users who are not ready to pay.

---

## Where to Go When Something Breaks

See `docs/handover/incident-guide.md` for a quick troubleshooting guide.

Short version:
- **Website down** → check Vercel dashboard
- **Backend/API down** → check Render dashboard (free tier spins down when idle)
- **Login broken** → check Render environment variables, check Neon database
- **Emails not arriving** → check Resend dashboard, check DNS records
- **Documents not downloading** → check Cloudflare R2 environment variables on Render

---

## Key Documents in This Folder

| File | What it covers |
|---|---|
| `START-HERE.md` | This file |
| `pre-launch-status.md` | Current status of all systems — canonical domain, Resend, Sanity, GA4, Shopify, R2 |
| `final-handover-checklist.md` | Complete launch checklist (14 sections) |
| `environment-inventory.md` | All environment variables, what they do, what breaks if missing |
| `access-required.md` | Which platform accounts Educate Strong should own, MFA checklist |
| `auth-roles.md` | Role/permission matrix — what each role can access |
| `admin-guide.md` | How to use the admin panel |
| `cms-guide.md` | Knowledge Hub CMS — Sanity activation guide |
| `content-ownership.md` | Where each type of content lives, who edits it |
| `known-limitations.md` | Known issues and post-launch work |
| `uat-test-script.md` | Manual test script for Kris/team |
| `incident-guide.md` | When something breaks — first-response guide |
| `security-status.md` | Security headers, dependency vulnerabilities, risk assessment |
| `platform-vercel.md` | Vercel operator guide |
| `platform-render.md` | Render operator guide |
| `platform-neon.md` | Neon (database) operator guide |
| `platform-cloudflare.md` | Cloudflare DNS and R2 operator guide |
| `platform-resend.md` | Resend email setup and operator guide |
