# Admin Panel Guide

Everything in the Educate Strong Academy is managed through the admin panel at `/admin`. No coding is required for day-to-day operations.

---

## How to access the admin panel

1. Go to `https://www.educatestrong.com/login` (or the current Vercel URL)
2. Log in with an account that has the **Admin** role
3. Click the Admin link in the navigation, or go directly to `/admin`

**Note**: Only users with the `ADMIN` role can access the admin panel. If your account doesn't have this role, ask another admin to update your role in User Manager.

---

## Admin panel sections

### Dashboard (`/admin`)
The overview page. Shows high-level counts of users, courses, cohorts, and recent activity.

---

### User Manager (`/admin/users`)

**What you can do**:
- View all registered users and their roles
- Change a user's role (Public, Learner, Coach, Tutor, Assessor, Admin)
- Enable or disable accounts (disabled accounts cannot log in, even with a valid token)
- Search users by name or email

**Roles explained**:

| Role | What they can access |
|---|---|
| Public | Browse the public website only; no learner portal access |
| Learner | Their own course content, assessments, CPD records, downloadable documents |
| Coach | Their own Coach workspace (profile editing) + Learner access |
| Tutor | Tutor workspace (manage cohort content) + Learner access |
| Assessor | Assessor portal (review learner submissions) |
| Admin | Everything |

**When to change a role**:
- A learner enrols on a course → enrol them (see Enrolment Manager) — their role stays Learner
- A coach completes certification → change their role to Coach
- Someone joins as staff → set appropriate role

---

### Course Manager (`/admin/courses`)

**What you can do**:
- View all courses
- Create new courses
- Edit existing course content (title, description, modules, lessons)
- Set course status (draft / published)

**Course Editor** (`/admin/courses/:id/edit`): Full editor for a single course — structure, lesson content, assessments.

---

### Cohort Manager (`/admin/cohorts`)

A cohort is a scheduled instance of a course: a specific group of learners studying a specific course on specific dates.

**What you can do**:
- Create a new cohort (link it to a course, set dates, location, max capacity)
- View enrolled learners per cohort
- Edit cohort details

**To run a live cohort**: Create the cohort here → enrol learners via Enrolment Manager → assign a tutor.

---

### Enrolment Manager (`/admin/enrolments`)

**What you can do**:
- Enrol a learner on a cohort manually (after they have paid via Shopify or another route)
- View all enrolments and their status
- Remove an enrolment if needed

**Typical flow**: Learner pays deposit via Shopify → admin receives confirmation → admin finds the learner in User Manager, confirms their account exists → enrols them in the relevant cohort here.

---

### Assessment Manager (`/admin/assessments`)

**What you can do**:
- View all submitted assessments from learners
- Filter by course, cohort, or learner
- Review submission content
- Mark assessments as passed or refer back to the learner

---

### Certificate Manager (`/admin/certificates`)

**What you can do**:
- View all issued certificates
- Issue a certificate manually to a learner once they have passed the required assessments
- Revoke a certificate if needed

Certificates are publicly verifiable at `/verify/:certificateId`. No login is required to verify a certificate.

---

### Document Manager (`/admin/documents`)

**What you can do**:
- Upload course documents (PDFs, workbooks, handouts) to Cloudflare R2 private storage
- Attach documents to specific courses
- Delete documents

Documents uploaded here are only accessible to enrolled learners of the relevant course, via time-limited download links (2-minute expiry). They cannot be accessed by the public.

**Prerequisite**: The four R2 environment variables must be set on Render before uploads work. See `docs/handover/environment-inventory.md`.

---

### Coach Profile Manager (`/admin/coach-profiles`)

**What you can do**:
- View all coach profiles
- Edit a coach's public profile details on their behalf
- Set visibility (coaches also edit their own profile from the Coach workspace)

Coach profiles appear on the public Coach Directory at `/coaches`.

---

### Register Interest Manager (`/admin/register-interest`)

**What you can do**:
- View all Register Interest form submissions
- See each submission's name, email, course interest, and message
- Export or note which leads have been followed up

Submissions are also emailed to the notifications address (`NOTIFICATIONS_EMAIL` env var on Render) when a new one arrives.

---

### BeStrong Manager (`/admin/bestrong`)

**What you can do**:
- Manage BeStrong / EatStrong nutrition content
- Add or edit articles in the BeStrong hub

---

## What you cannot do from the admin panel (requires a code change)

- Edit Knowledge Hub articles — these are currently hardcoded in the codebase. See `docs/handover/cms-guide.md` for how to activate Sanity CMS to enable non-code editing.
- Edit exercises or events — these are also in the codebase's data files. They can be extended by the developer.
- Edit public page copy (About, Home hero text, etc.) — requires a code change and redeployment.
- Change legal page content (Terms, Privacy, Refund Policy) — requires a code change and redeployment.

---

## Day-to-day operations checklist

**Weekly**:
- [ ] Check Register Interest Manager for new submissions and follow up
- [ ] Check any pending assessments in Assessment Manager

**When someone enrols**:
1. Confirm payment received (Shopify or other)
2. Verify their user account exists (User Manager → search by email)
3. Enrol them in the cohort (Enrolment Manager)
4. They will see the course content in their Learner Dashboard at next login

**When someone qualifies**:
1. Review their assessments (Assessment Manager)
2. Mark assessments as passed
3. Issue certificate (Certificate Manager)
4. Their certificate appears in their portal and is publicly verifiable
