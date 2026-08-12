# Content Ownership

Where each type of content lives, how it is edited, and who owns it.

---

## Public website copy

**Where**: In the frontend codebase (`frontend/src/pages/public/` and `frontend/src/components/`)

**How to edit**: Code change + Vercel redeployment

**Who edits**: Developer

**Examples**: Homepage hero text, About page content, StrongKidz page text, coaching pathway descriptions

---

## Knowledge Hub articles

**Current system**: 21 articles hardcoded in `frontend/src/data/knowledgeArticles.ts`

**How to edit**: Edit the TypeScript file, commit, and redeploy

**Who edits**: Developer (current state)

**Post-Sanity activation**: Managed through the Sanity Studio web interface, no code change required. See `docs/handover/cms-guide.md`.

**Count**: 21 articles, organised into categories (Technique, Training, Competition, Coaching, Nutrition, Safety)

---

## Exercise Library

**Where**: Hardcoded in `frontend/src/data/exercises.ts` (or similar data file)

**How to edit**: Code change + redeployment

**Who edits**: Developer

**Count**: 29 exercises

---

## Event Library

**Where**: Hardcoded in `frontend/src/data/events.ts` (or similar data file)

**How to edit**: Code change + redeployment

**Who edits**: Developer

**Count**: 26 events

---

## EatStrong (nutrition) articles

**Where**: Managed through the Admin Panel → BeStrong Manager (`/admin/bestrong`)

**How to edit**: Admin panel, no code change required

**Who edits**: Admin

**Count**: 10 articles, 9 categories

---

## Course content

**Where**: Admin Panel → Course Manager → Course Editor (`/admin/courses`)

**How to edit**: Admin panel, no code change required — full course editor including modules and lessons

**Who edits**: Admin and Tutors (tutors manage their own cohort content)

---

## Course cohorts (dates, venues, capacity)

**Where**: Admin Panel → Cohort Manager (`/admin/cohorts`)

**How to edit**: Admin panel

**Who edits**: Admin

---

## Coach profiles (public directory)

**Where**: Managed by each Coach through their Coach Workspace (`/coach`) or by Admin through Coach Profile Manager (`/admin/coach-profiles`)

**How to edit**: Admin panel or Coach workspace

**Who edits**: Coaches (their own profile) or Admin (any profile)

---

## Course documents (PDFs, workbooks)

**Where**: Uploaded through Admin Panel → Document Manager (`/admin/documents`), stored in Cloudflare R2

**How to edit**: Upload a new version through the Document Manager

**Who edits**: Admin

**Access**: Documents are private — accessible only to enrolled learners of the relevant course

---

## Legal pages (Terms, Privacy, Refund Policy)

**Where**: In the frontend codebase (`frontend/src/pages/public/Terms.tsx`, `Privacy.tsx`, `RefundPolicy.tsx`)

**Current status**: Placeholder wording. Pages are marked `noindex` — they will not appear in Google search results until approved wording is added and the noindex directive removed.

**How to edit**: Code change + redeployment

**Who edits**: Developer, after receiving approved wording from Educate Strong or their legal advisor

**Important**: Do not remove the `noindex` directive until the wording has been formally approved.

---

## User accounts and roles

**Where**: Database, managed through Admin Panel → User Manager (`/admin/users`)

**How to edit**: Admin panel — search users, change roles, enable/disable accounts

**Who edits**: Admin

---

## Learner records (enrolments, assessments, certificates)

**Where**: Database (Neon PostgreSQL), managed through the admin panel

**How to edit**: Admin panel

**Who edits**: Admin, Assessors (for assessment marking)

---

## Register Interest submissions

**Where**: Database, managed through Admin Panel → Register Interest Manager (`/admin/register-interest`)

**How to view**: Admin panel — view submissions, note follow-up status

**Who edits**: Admin (view only; submissions are entered by website visitors)

---

## SEO metadata (page titles, descriptions, structured data)

**Where**: In the frontend codebase — `useDocumentHead` hook and structured data in each page component

**How to edit**: Code change + redeployment

**Who edits**: Developer

**For the sitemap**: `frontend/scripts/prerender.mjs` generates `sitemap.xml` at build time. The sitemap auto-includes all prerendered pages.

---

## Robots.txt and sitemap

**Where**: Generated at build time by `frontend/scripts/prerender.mjs`, output to `dist/robots.txt` and `dist/sitemap.xml`

**How to edit**: Modify `prerender.mjs` then trigger a Vercel redeployment

**Who edits**: Developer

---

## Summary

| Content | Editable without code? | Where |
|---|---|---|
| Homepage / About / public pages | No — code change | Developer |
| Knowledge Hub articles | No (Sanity: yes, after activation) | Developer / Sanity Studio |
| Exercise Library | No — code change | Developer |
| Event Library | No — code change | Developer |
| EatStrong / BeStrong articles | **Yes** | Admin panel |
| Courses and lessons | **Yes** | Admin panel |
| Cohorts (dates, venues) | **Yes** | Admin panel |
| Coach profiles | **Yes** | Admin panel / Coach workspace |
| Course documents | **Yes** (upload via admin) | Admin panel |
| Legal pages | No — code change | Developer (after legal approval) |
| Users and roles | **Yes** | Admin panel |
| Learner records | **Yes** | Admin panel |
| Register Interest submissions | View only | Admin panel |
| SEO metadata | No — code change | Developer |
