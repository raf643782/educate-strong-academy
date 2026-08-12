# Neon — Operator Guide

Neon is the PostgreSQL database. It stores all persistent data.

---

## What Neon stores

Every piece of structured data in the platform:

| Table | Contents |
|---|---|
| `User` | Name, email (hashed password), role, verification status, active flag |
| `Course` | Title, description, modules, lessons, assessment config |
| `Module` | Ordered sections within a course |
| `Lesson` | Title, content, video URL, order |
| `Cohort` | Scheduled instance of a course (dates, location, capacity, tutor) |
| `Enrolment` | Which user is enrolled on which cohort |
| `Assessment` | Assessment definitions for courses |
| `AssessmentSubmission` | Learner submissions (answers, files, dates, mark/refer status) |
| `Certificate` | Issued certificates with verification codes |
| `CPDRecord` | Continuous professional development records for coaches |
| `CoachProfile` | Public coach profile data |
| `CourseDocument` | Metadata for documents stored in R2 (not the files themselves) |
| `BeStrongArticle` | EatStrong/BeStrong nutrition articles |
| `RegisterInterest` | Register Interest form submissions |
| `EmailVerification` | Temporary email verification tokens |
| `PasswordReset` | Temporary password reset tokens |

---

## Dashboard access

1. Go to https://console.neon.tech and log in with the Educate Strong account
2. Open the `educate-strong-academy` project (or similar)

---

## Connection

The backend connects via the `DATABASE_URL` environment variable on Render. This is the Neon connection string (format: `postgresql://user:password@host/dbname?sslmode=require`).

---

## Compute scaling

Neon automatically scales compute to zero when the database receives no queries. The first query after a quiet period takes ~1-2 seconds to wake up. This is normal and acceptable.

For production load, Neon's free tier is sufficient initially. When learner numbers grow, consider upgrading to the **Launch plan** for higher connection limits and longer compute time.

---

## Migrations

Database schema changes are managed by Prisma. The migration history is in `backend/prisma/migrations/`. 12 migrations have been applied as of handover.

**To apply a new migration after a schema change**:
```
cd backend
npx prisma migrate deploy   # applies pending migrations to production
```

This is run automatically during the Render deployment if configured, or manually.

**Never run `prisma migrate reset` in production** — it drops and recreates the database.

---

## Backups

Neon provides:
- **Free tier**: 7-day point-in-time restore (PITR)
- **Launch tier**: 30-day PITR

If data is accidentally deleted, contact Neon support immediately with the approximate timestamp. They can restore from a point before the deletion.

**Recommendation**: Before learner data accumulates, upgrade to at least the Launch plan to extend the PITR window to 30 days.

---

## What to check if the backend can't connect to the database

1. In the Neon dashboard → check project status and endpoint status
2. Confirm `DATABASE_URL` on Render exactly matches the Neon connection string (it can change if credentials are rotated)
3. In Render logs: look for `ECONNREFUSED`, `ETIMEDOUT`, or `authentication failed` errors
4. Neon compute may be waking up — the first connection attempt may time out; Render will retry

---

## Direct database access

For emergency inspection or repair, connect directly using `psql` or a GUI tool (TablePlus, Postico):

```
psql "postgresql://user:password@host/dbname?sslmode=require"
```

The connection string is in Render's `DATABASE_URL` environment variable. Handle this string as a secret — it gives full read/write access to all data.

---

## GDPR considerations

The database contains personal data: names, email addresses, assessment submissions, and learning records. Under UK GDPR:
- Users have the right to request their data be deleted
- Data must be stored securely (the database is encrypted at rest by Neon)
- The Privacy Policy must explain what data is collected and why

A learner data deletion requires manually removing their `User` record and cascading related records (enrolments, submissions, certificates, CPD). No automated deletion tool is currently implemented — this is a post-launch task.
