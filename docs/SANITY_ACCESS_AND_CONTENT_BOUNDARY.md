# Sanity — Access Plan and Content Boundary

**Last updated:** Priority 5, Stage 5A — 2026-07-24. Documentation only — no Sanity dashboard permissions have been added or changed, and no users have been invited. This records the recommended plan for when that happens.

---

## Why Sanity roles are separate from LMS roles

This platform already has a `Role` enum stored in PostgreSQL (`LEARNER`, `COACH`, `TUTOR`, `ASSESSOR`, `ADMIN`) that controls access to the LMS — dashboards, enrolments, course content, admin tooling. **Sanity has its own, completely separate identity and permission system**, managed at [manage.sanity.io](https://manage.sanity.io) for the project itself, authenticated via `sanity login` (per-user browser OAuth — see `sanity/sanity.config.ts`'s own comment on this). A person's Postgres `Role` says nothing about whether they should be able to log into Sanity Studio, and vice versa — being `ADMIN` on the LMS does not, by itself, grant or imply any Sanity access, and there is currently no code anywhere that connects the two systems. Keep it that way: the two systems answer different questions (LMS role = "what can this account do inside the platform"; Sanity role = "who can edit public marketing/editorial content in Studio") and conflating them would make either one harder to reason about.

## Recommended Sanity project roles

Configured entirely within Sanity's own dashboard (`manage.sanity.io` → project → Members), not in this codebase:

| Role | Who | Can do |
|---|---|---|
| **Administrator** | The smallest possible group — likely just the site owner | Everything Editor can do, plus: invite/remove other members, change project settings, create API tokens, edit schemas (via a deploy of this repo's `sanity/` Studio) |
| **Editor** | Whoever writes/maintains Knowledge Hub (and later, other) content | Create, edit, and move documents through the `draft → inReview → approved` states (the existing `status` field already on `knowledgeArticle`) |
| **Viewer** (Sanity's built-in read-only project role) | Anyone who should be able to see Studio content without editing it | Read-only access inside Studio itself — separate from the public website, which already reads published content with no login at all |

**Who may publish** (move a document's `status` to `published`, the only value the frontend's GROQ query actually reads): recommend restricting this to Administrator, or a named Editor explicitly trusted with final sign-off — not every Editor by default. This mirrors the existing `reviewedBy`/`lastReviewedDate` attribution pattern already in the schema, which implies a second-person review step before something goes live.

**Who may edit schemas** (add/remove/change a field in `sanity/schemas/*.ts`, requiring a Studio redeploy): Administrator only. Schema changes affect every document of that type and can silently reintroduce a risk like the one closed in this stage (see `KNOWLEDGE_HUB_SOURCE_NOTES_POLICY.md`) if made casually.

## Owner dashboard steps required later (not done yet)

1. Go to [manage.sanity.io](https://manage.sanity.io), select the `ut2wo29d` project.
2. Go to **Members** → **Invite members**.
3. For each person, enter their email and choose a role: **Administrator**, **Editor**, or **Viewer** (per the table above).
4. They accept the invite and authenticate via their own login (Google/GitHub/email) — no shared password, no credential to hand over.
5. To later restrict who can flip a document to `published`, Sanity's **Studio structure/document actions can be customised** in `sanity.config.ts` to gate the publish action by role — a small code change, not a dashboard setting; flagged here as a future decision, not implemented in this stage.

Nothing above has been performed — this is the plan for you to action when ready, not a change already made.

---

## Content boundary — Sanity vs. PostgreSQL

**Sanity may store public editorial content only** — the kind of thing a marketing/content editor writes and that any visitor is meant to read once published. **PostgreSQL remains the sole source of truth** for everything below, and nothing on this list should ever be moved into Sanity, regardless of how the CMS migration in the Priority 5 proposal proceeds:

1. User accounts
2. Passwords
3. Roles
4. Enrolments
5. Lesson progress
6. Assessments and submissions
7. Certificates
8. Course access
9. Payments
10. Private learner information
11. Safeguarding or medical records
12. `CourseDocument` storage permissions (Cloudflare R2 object keys and the enrolment/lock checks gating them — see Priority 4, Stage 4C)
13. Coach verification and publication controls (`CoachProfile.isVerified`/`isPublished`/`isArchived`)
14. EatStrong access levels (`BeStrongArticle`/`BeStrongDownload.accessLevel`, `isPremium`)

This list matches — and is a direct continuation of — the boundary already stated in `frontend/src/lib/sanity.ts`'s own header comment ("NOT used for transactional or curriculum-coupled data") and the per-content-area analysis in the Priority 5 audit report. Any future Sanity schema that touches Course, Coach, or EatStrong content must only carry the descriptive/editorial fields — the access-control and transactional fields above stay exactly where they are today.
