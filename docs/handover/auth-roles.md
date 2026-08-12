# Authentication and Role/Permission Matrix

## How authentication works

Users log in with email and password. The backend issues a signed JSON Web Token (JWT) valid for 7 days. The token is stored in the browser's localStorage. On every protected API request, the token is sent in the `Authorization: Bearer` header.

**Disabled accounts**: When an admin disables an account (`isActive = false`), the backend re-checks the database on every request — so a disabled account loses access immediately, even if the user has a valid 7-day token. They do not need to wait for the token to expire.

**Token signing**: The JWT is signed with `JWT_SECRET` on Render. If this variable is changed, all existing sessions are immediately invalidated and every user must log in again.

---

## Roles

The system has 5 roles. A user has exactly one role at a time.

| Role | Default? | Notes |
|---|---|---|
| LEARNER | Yes — all new registrations default to LEARNER | Enrolled learners |
| COACH | Manual upgrade by Admin | Certified coaches |
| TUTOR | Manual upgrade by Admin | Course tutors |
| ASSESSOR | Manual upgrade by Admin | Assessment reviewers |
| ADMIN | Manual upgrade by Admin | Platform operators |

There is also an implicit **unauthenticated / Public** state for visitors who are not logged in. They can access all public routes but nothing in the portal.

---

## What each role can access

### Unauthenticated (public visitors)
- All public pages: homepage, courses, exercises, events, Knowledge Hub, EatStrong, coaches, StrongKidz, about, register interest, certificate verification
- Login, register, forgot password, reset password, verify email pages

### LEARNER
Everything public, plus:
- `/dashboard` — learner dashboard with enrolled courses
- `/learn/:courseSlug/lessons/:lessonId` — course video/content player
- `/certificates` — their own certificates
- `/cpd` — their own CPD record
- `/coursework` — their own coursework submissions
- `/documents` — download documents for courses they are enrolled in (presigned R2 URLs, 2-minute expiry)
- `/skill-tree` — skill tree view
- API: `GET /api/documents`, `GET /api/documents/course/:courseId`, `GET /api/documents/:id/download` — authenticated, but no role restriction beyond being logged in; `/:id/download` checks the requester is enrolled in the relevant course

### COACH
Everything a LEARNER can access, plus:
- `/coach` — coach workspace (manage their own public profile)
- `/coach/profile` — coach profile editor

### TUTOR
Everything a LEARNER can access, plus:
- `/tutor` — tutor workspace
- `/tutor/courses` — courses they manage
- `/tutor/profile` — tutor profile

### ASSESSOR
- `/assessor` — assessor portal
- API: `GET /api/assessor/queue`, `GET /api/assessor/submissions`, `GET /api/assessor/submissions/:id`
- API: `PATCH /api/assessments/:id` (mark as passed/referred) — requires ASSESSOR or ADMIN

### ADMIN
All of the above, plus:
- `/admin` — admin dashboard
- `/admin/users` — view, search, edit, enable/disable all users
- `/admin/courses` — create, edit, delete courses
- `/admin/courses/:id/edit` — course editor
- `/admin/cohorts` — manage cohorts
- `/admin/enrolments` — enrol/remove learners
- `/admin/assessments` — view and manage all assessments
- `/admin/documents` — upload, attach, delete course documents
- `/admin/coach-profiles` — manage coach profiles
- `/admin/register-interest` — view all Register Interest submissions
- `/admin/bestrong` — manage EatStrong/BeStrong content
- `/admin/certificates` — issue and revoke certificates
- All `/api/admin/*` endpoints
- All `/api/assessor/*` endpoints

---

## Role escalation policy

Only an existing ADMIN can upgrade another user's role. There is no self-service role escalation. The flow is:

1. User registers → role defaults to LEARNER
2. Admin finds user in User Manager (`/admin/users`)
3. Admin selects new role and saves

**There is no automatic role assignment based on course completion.** Completing a course and passing assessments does not automatically change a user's role to COACH. An Admin must manually upgrade the role.

---

## Session security

| Property | Value |
|---|---|
| Token lifetime | 7 days |
| Token storage | Browser localStorage |
| Revocation | Via `isActive = false` on the user record (checked on every request) |
| Signing algorithm | HS256 (HMAC SHA-256) |
| Secret rotation | Changes `JWT_SECRET` on Render; invalidates all sessions immediately |

---

## UAT flow: testing role protection

To verify role protection is working:

1. Log out
2. Try to access `/admin` directly → expect redirect to `/login`
3. Log in as a LEARNER role account
4. Try to access `/admin` → expect redirect to login or "Insufficient permissions" response
5. Log in as an ADMIN role account
6. Access `/admin` → dashboard should load
7. Disable the LEARNER account via Admin → User Manager → that account's login should immediately fail even with an existing session
