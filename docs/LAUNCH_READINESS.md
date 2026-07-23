# Educate.Strong Academy — Launch Readiness Tracker

Living document. Updated at the end of every programme section. No credentials, connection strings, or secret values are ever recorded in this file — only status, ownership and evidence references.

**Last updated:** Priority 4, Stage 4A (Master Continuation Programme — Real Account Journey, Email Delivery and Secure Downloads) — 2026-07-24. Immediate security closure stage: unauthenticated lesson content exposure fixed, unpublished course metadata leak fixed, Portal Preview restricted to ADMIN, JWT fallback-secret removed with a fail-fast production check, and a frontend 401 handler added. See the Priority 4 findings below. **Stage 4A only — Priority 4 is not complete.** Priority 3 (Knowledge Hub and EatStrong Editorial Completion) closed 2026-07-23 — see its own findings section further down, unchanged by this update.

## Priority 3 audit status (2026-07-23)

- **Knowledge Hub**: all 21 existing articles inventoried directly from `frontend/src/data/knowledgeArticles.ts`. No author/reviewer/published-date/source fields exist in this data model for any article — a pre-existing structural limitation, not new.
- **The five new articles the owner referenced** ("What Is Strongman?", "Strongman for Beginners", "Strongman Events Explained", "How to Become a Strongman Coach", "Is Strongman Safe for Children?") **could not be located** after searching the git repository, a stale duplicate checkout on the Desktop, and the Downloads/Desktop/Documents folders. Two related ChatGPT-authored research PDFs were found (`~/Downloads/LMS Content/EducateStrong Academy Knowledge Hub Research and Content Map.pdf` and `.../Strongman Reference Base for EducateStrong Academy.pdf`) — useful background content strategy, but neither contains the five requested articles' final text. Full detail in the Priority 3 chat report.
- **EatStrong**: all 11 articles re-verified directly against the live production API (not assumed from prior audits). `nutrition-conversations-with-athletes` confirmed missing its `scopeOfPracticeNote`. Author is listed as "EatStrong Editorial Team" (institutional, not a named individual) on all 11; reviewer is "Victoria Wilson" (a real, named person already known elsewhere on the site) on all 11 — her review of this specific content has not been separately confirmed by the owner.
- New: [docs/EATSTRONG_OWNERSHIP_HANDOVER.md](EATSTRONG_OWNERSHIP_HANDOVER.md) — prepared for the future EatStrong ownership transition the owner described.
- **No articles were rewritten, published, or unpublished. No production write occurred. `feature/libraryPages` was not merged.**

---

## Repository and branch state (verified this session)

| Item | Value |
|---|---|
| Repository | `raf643782/educate-strong-academy` (public on GitHub) |
| Local path | `/Users/raffa/Projects/EducateStrong` |
| Working branch | `feature/libraryPages` |
| Current commit | `3a5fbed` — merge of `main` (bringing in the Viking Press production migration) on top of `80baa4b` (Section 5B) |
| Working tree | Clean |
| Remote sync | Up to date with `origin/feature/libraryPages` |
| Open pull request | None open (PR #1 and PR #2 both merged and closed) |
| `main` branch | `ddb3bbc` — PR #1 (Stage 6/7 schema + migrations) + PR #2 (Viking Press data correction). **The full Stage 1–8 frontend/library build on `feature/libraryPages` has still not been merged to `main`.** |
| Second git worktree | `/Users/raffa/Projects/esa-db-update`, detached HEAD at `65d6182` (unchanged since Section 1) |
| Local checkpoint tag | `checkpoint-section1-audit`, pushed to `origin` |
| `db-alignment-stage6-7` branch | Merged into `main` via PR #1; still present on `origin`, not deleted |
| `production-viking-press-correction` branch | Merged into `main` via PR #2; still present on `origin`, not deleted |
| Documentation history | `f6bf404` (Section 1) → `8a01061` (Section 2) → `fbb3e44` (Section 3A) → `2dd0833` (Section 3B) → `aabbab3` (Section 4) → this commit below |

## Workstream status table

| Workstream | Current status | Owner | Blocker | Required decision | Verification evidence | Final acceptance |
|---|---|---|---|---|---|---|
| Feature branch code (Stages 1–8) | Complete, pushed, preview green | Assistant | None | — | Vercel check-run `success` on latest `feature/libraryPages` commit | Not yet accepted |
| Production merge (full frontend/library build) | Not started — only the scoped Stage 6/7 schema PR has merged so far | Owner approval required | Content completeness (Section 4 findings below) + everything else in this table | Owner to approve launch scope | `main` at `af1998a`, DB-alignment only | Not started |
| Public content completeness (Section 4) | **Audited 2026-07-23, read-only.** Full findings below | Owner (content decisions) + Assistant (future implementation, once approved) | See launch blocker table | Owner to approve realistic launch scope per Section 4 §15 | Route inventory, content source map, claims register, placeholder sweep (agent + manually verified), Exercise/Event field audit, visual/mobile spot-check all completed this section | Audit complete; content decisions pending |
| Claims and accreditation scope (Priority 2) | **Implemented 2026-07-23.** Owner confirmed 10 categories of claims; register created; Course Catalogue metadata, hero badge scope text, Coaching Pathway wording, Coach Directory pills, StrongKidz safeguarding wording, and Level 2/3/StrongKidz curriculum exposure all updated | Assistant (implementation) + Owner (decisions) | None for implemented items | — | Frontend `tsc` clean, full production build + prerender (55/55) + sitemap (113 URLs) succeeded, visual verification desktop + mobile across 8 pages | **Accepted** |
| Stage 5 Event insertion (6 new Events) | **Applied and verified 2026-07-23.** Live run created all 6 Events atomically in one transaction | Owner (ran the script locally via secure hidden-input credential entry) | None | — | `GET /api/events` confirmed: 26 total, all 6 target slugs present, no duplicates, 29 Exercises unchanged, backend health `200 OK` | **Accepted** |
| Stage 6 media migration | **Applied and verified 2026-07-23** via a narrowly scoped PR (#1, schema + migrations only) merged to `main`, deployed automatically by Render | Assistant (scoped PR) + Owner (merge approval) | None | — | Render deploy `dep-d9ges977f7vs73f3k9vg` Live at commit `af1998a`; live API responses now carry `imageUrl` etc. as `null` | **Accepted** |
| Stage 7 editorial migration | **Applied and verified 2026-07-23** — same scoped PR/deploy as Stage 6 | Assistant + Owner | None | — | Same deploy; live API responses now carry `authorName`/`sources`/`relatedExerciseSlugs` etc. as `null`/`[]` | **Accepted** |
| Arm-Over-Arm Rope Pull Exercise description drift | **Resolved and confirmed** — production description now exactly matches the approved Exercise wording | — | None | — | Live `GET /api/exercises` checked directly: description field matches the approved value verbatim | **Accepted** |
| Viking Press Exercise description drift | **Resolved and confirmed 2026-07-23** via a guarded, data-only Prisma migration (PR #2), merged to `main`, deployed automatically by Render. `feature/libraryPages` merged back in afterwards without losing commit `80baa4b` | Assistant (scoped migration PR) + Owner (merge approval) | None | — | Live `GET /api/exercises` confirmed: description matches approved wording exactly; 29 Exercises/26 Events unchanged; no duplicate slugs; Event record untouched; backend health `200 OK` | **Accepted** |
| Production database credential | **Rotated and verified 2026-07-22.** Confirmed as the active production credential (owner copied it from Render's `DATABASE_URL` to run the Stage 4 live update); replaced in Neon, applied to Render, redeployed, old value invalidated in place | Owner (Neon/Render account holder) | None | — | Backend health, public APIs, DB connectivity and auth all verified working post-rotation; see Section 2 findings below | **Accepted** |
| Neon vs Render-native database | **Resolved** — production `DATABASE_URL` on Render is confirmed to point at Neon (host contains `neon.tech`), set as a plain manually-entered value, not the `fromDatabase` binding. The `render.yaml`-defined `educate-strong-db` Render-native database resource appears unused in production | Owner | Decide whether to delete or repurpose the unused `educate-strong-db` resource | Owner decision (not urgent) | Owner confirmed via Render dashboard Environment tab | **Accepted** (identity confirmed; disposal decision outstanding) |
| Analytics (GA4/GTM) | Not present in code | — | Not yet decided/implemented | Owner + assistant, later section | Repo-wide search: zero matches | Not started |
| Payments (Stripe or similar) | Not present in code | — | Commercial policy not yet decided | Owner, Section 6/8 | Repo-wide search: zero matches | Not started |
| Sanity CMS | Not connected — no config files found | — | Decision pending (Section 9) | Owner + assistant | Repo-wide search: zero Sanity config | Not started |
| Email delivery | SMTP-capable in code (`SMTP_HOST`/`PORT`/`USER`/`PASS` env vars), values unknown | Owner | Not verified live | Section 10 | `.env.example` reviewed; no live test run yet | Not started |
| Custom domain | Not configured in code; CORS still keys off `*.vercel.app` | Owner (registrar/DNS holder) | Domain plan (Section 12) | Owner | `backend/src/index.ts` CORS allowlist reviewed | Not started |
| QA demo login | Present in code, disabled by default (`ENABLE_QA_DEMO_LOGIN=false`) | — | Must be confirmed OFF in production specifically | Verify in Section 2/14 | `.env.example` default reviewed | Not started |

---

## Section 1 findings of note

1. **Second worktree at `esa-db-update`, detached HEAD at `65d6182`.** This is very likely where the owner ran the Stage 4 production scripts locally (matching the "credential exposed during troubleshooting" report). No `.env` file with a real credential was found there — only `.env.docker` (tracked in git, but contains only local Docker Compose dev values — see below) and `.env.example` (a template with placeholder values). The likely real exposure point is **local shell history** (`~/.zsh_history` exists and was not opened or read, in line with the instruction never to reveal or reprint the credential) from a command of the form `DATABASE_URL="<real value>" npx tsx ...` — exactly the pattern this project's own reports have instructed the owner to run by hand. This is flagged for the owner to clear locally; it was not read or searched by this assistant.

2. **`backend/.env.docker` is tracked in git**, but on inspection contains only the same local-only Docker Compose values already visible in the committed `docker-compose.yml` (`es_user` / `es_password` / `localhost:5433`) and a clearly-labelled placeholder JWT secret ("change-in-production"). This is a low-risk, pre-existing pattern, not a real credential leak — flagged as a **recommended improvement** (stop tracking it) rather than a blocker.

3. **No real production credential, API key, or token of any kind was found anywhere in the git history or current working tree** — a full history search for Neon-style hostnames, non-localhost `DATABASE_URL` values, Stripe/Sanity/analytics key patterns all returned zero matches.

4. **`render.yaml` defines a Render-native Postgres database**, not a Neon project — this conflicts with the brief's reference to "the current Neon production database project" and needs the owner to confirm which is actually in use today. It's possible the infrastructure changed after this file was last touched.

5. **Render's own build command already runs `npx prisma migrate deploy` automatically** on every Render deploy (confirmed by direct read of `render.yaml`). This matters for Section 3 planning: if Render is deploying from this codebase, pending Stage 6/7 migrations would apply automatically and safely (using Render's own database binding, never requiring the owner to type a connection string) the next time Render redeploys from a branch containing them — a materially safer path than a manually-typed `DATABASE_URL=...` command. This is not being acted on now; it's noted for the Section 3 approval discussion.

6. **CORS allows any `*.vercel.app` origin** in addition to an explicit allowlist (`localhost:5174`, `localhost:3000`, `https://educate-strong.vercel.app` — note this hardcoded value doesn't exactly match the live preview domain `educate-strong-academy.vercel.app`, though the wildcard covers it either way). The wildcard is reasonable while everything is still on Vercel's own subdomains with no custom domain live, but should be tightened once a custom domain is confirmed (Section 12/14).

7. **No analytics, payment, or CMS integration exists in code today** — confirmed by direct repository search, not assumption. This matches the brief's own "known incomplete" list.

---

## Section 2 findings of note

1. **Production database confirmed as Neon**, not the Render-native Postgres declared in `render.yaml`. Render's `DATABASE_URL` was a plain manually-entered value pointing at a Neon host, overriding the `fromDatabase` binding. The `educate-strong-db` Render-native resource is therefore not the live database — it appears to be an unused/orphaned resource. **Not deleted** — left in place pending an owner decision, per instruction.

2. **The exposed credential was confirmed by the owner to be the active production credential** — it had been copied directly from Render's `DATABASE_URL` field to run the Stage 4 live production update locally, and was subsequently exposed during troubleshooting (most likely via local shell history, per the Section 1 finding).

3. **Coordinated rotation completed 2026-07-22**, in this order: (1) new password generated for the same Neon role via Neon's dashboard "Reset password" action — this replaces the role's password in place rather than adding a second valid credential; (2) new value applied to Render's `DATABASE_URL`; (3) Render redeployed; (4) full verification run against the live backend. Because Neon role passwords are a single value, not additive, the exposed credential was already invalidated at step (1) — there was no separate "old credential still valid" window to close afterwards. This is noted as a clarification of mechanism, not a deviation from intent: the net outcome (old value dead, new value the only one that authenticates) is the same either way.

4. **Post-rotation verification, all passed:**
   - Backend health (`GET /api/health`): `200 OK`
   - Public APIs (`GET /api/exercises`, `GET /api/events`): both return live data from the database on the new credential
   - Authentication (`POST /api/auth/login` with a deliberately invalid test email/password, no real account): returned a clean `401 Invalid credentials` — confirms the login route is querying the database correctly, not erroring
   - Frontend local storage / session storage on the live production site (`educate-strong-academy.vercel.app`): both empty — no stray credentials or sensitive test data
   - Vercel project environment variables: no `DATABASE_URL` present; only `VITE_API_URL` (Production and Preview) — correct for a static Vite frontend with no legitimate server-side DB access
   - Render service logs (deploy + runtime, covering the rotation window): owner confirmed no line contains a full connection string, `neon.tech`, or a `postgres(ql)://` URI
   - Git history and working tree: unchanged since the Section 1 secrets scan — still clean

5. **Not independently re-verified this session** (would need production DB access this assistant does not have and should not request): whether Stage 5 Events, Stage 6 media fields, and Stage 7 editorial fields are actually present in the production data now being served through the rotated credential. The public API spot-checks above confirm connectivity and basic data return, not full schema/content parity — that remains a distinct, still-open item for a later section.

---

## Section 3A findings of note (read-only audit — no production writes)

1. **Migration inventory (local repo, `feature/libraryPages` tip), in order:** `20260601000000_init` → `add_password_reset_tokens` → `add_coach_tutor_roles` → `add_cohorts_register_interest` → `add_user_is_active` → `add_coach_profile` → `add_cohort_homepage_fields` → **`20260719120000_add_media_fields` (Stage 6)** → **`20260720120000_add_editorial_fields` (Stage 7)**.

2. **`main` (what Render actually deploys) only has the first 7 migrations** — Stage 6 and Stage 7 migration files exist solely on the unmerged feature branch. They are not "pending" in a database sense; they simply haven't reached the branch Render builds from yet.

3. **`render.yaml` itself does not exist on `main`** — it was added only on `feature/libraryPages`. However, the owner confirmed the live `educate-strong-api` Render service's own dashboard-configured Build Command already independently includes `npx prisma migrate deploy`, matching `render.yaml`'s intent. Net effect: **any migration file that reaches `main` will be applied automatically by Render on next deploy, using Render's own `DATABASE_URL` binding — no manual credential entry required.** This is the safest available path for applying Stage 6/7, and directly avoids repeating the pattern that caused the Section 2 credential exposure.

4. **Live production data, confirmed via public API (`GET /api/exercises`, `GET /api/events`), read-only, no credentials involved:**
   - Exercise count: **29**
   - Event count: **20** (target 26 — the 6-record gap matches the Stage 5 Events exactly)
   - All 6 Stage 5 Events (Tyre Flip, Conan's Wheel, Loading Race, Hercules Hold, Fingal's Fingers, Block Press) confirmed **absent**
   - `arm-over-arm-rope-pull` Exercise description confirmed to **exactly match the approved final wording** — the correction script the owner ran earlier succeeded; no remaining drift
   - Neither `imageUrl` (Stage 6) nor `authorName`/`sources`/etc. (Stage 7) keys appear anywhere in live API responses — schema confirmed behind, consistent with point 2

5. **Script/schema compatibility check:** `stage5-event-insert.ts` only sets base Event fields that already exist in the current production schema (explicitly documented in its own header) — safe to run once the schema catches up. Important subtlety: Prisma Client selects all scalar fields on a model by default, so running this script (or re-running the Stage 4 correction script) using a client generated from the **current** `feature/libraryPages` schema.prisma (which already declares the Stage 6/7 columns) **would fail with a "column does not exist" error** against today's production schema. This is exactly why the Stage 4 correction succeeded earlier: it was run from the `esa-db-update` worktree at commit `65d6182`, whose schema.prisma at that point still matched production. **Schema migration must land before any further data script runs.**

6. **Neon recovery options confirmed by owner:** point-in-time recovery available for the production branch, **6-hour history window**. No manual snapshots exist and none are scheduled. A 6-hour PITR window is a thin safety margin for changes that might not be immediately noticed — a manual snapshot immediately before any Section 3B write is recommended.

7. **Migration drift:** not directly queried (would require running `prisma migrate status` against production, which needs `DATABASE_URL`). Indirectly, drift is unlikely to be blocking: the Section 2 redeploy already ran `prisma migrate deploy` against the current 7 migrations and completed cleanly, with all post-rotation verification passing.

---

## Section 3B findings of note (scoped execution — production writes made, all approved and verified)

1. **Scoped release, not a full merge.** A new branch (`db-alignment-stage6-7`) was created from `main` (not from `feature/libraryPages`), containing only `backend/prisma/schema.prisma` (Stage 6 + Stage 7 field additions to `Exercise`/`Event` only) and the two migration folders — 3 files, 121 insertions, 0 deletions. No frontend, SEO, content, or library-page changes were included. Confirmed locally: `prisma validate` passed, `prisma generate` succeeded, `tsc --noEmit` compiled with zero errors — no backend code changes were needed, since the API routes use no explicit `select` and pass full records through automatically.

2. **Both migrations reconfirmed additive-only** by direct inspection of the SQL: every new column is nullable (`TEXT`, `TIMESTAMP(3)`) or `TEXT[] DEFAULT ARRAY[]::TEXT[]`. No column dropped, altered, or made required; no existing data touched.

3. **PR #1** (`db-alignment-stage6-7` → `main`) opened by the owner, reviewed via GitHub's API to confirm the file list matched exactly, approved by the owner, merged by the assistant via `git merge --no-ff` + `git push origin main` (commit `af1998a`). Render auto-deployed from `main` (deployment `dep-d9ges977f7vs73f3k9vg`, 47.2s, trigger `Auto-Deploy`) and ran its existing `npx prisma migrate deploy` build step automatically, using Render's own `DATABASE_URL` binding — no manual credential entry involved in this step.

4. **Post-migration verification (public API, no credentials):** both `GET /api/exercises` and `GET /api/events` now return the full Stage 6 + Stage 7 field set (`imageUrl`, `videoProvider`, `authorName`, `sources`, `relatedExerciseSlugs`, `relatedEventSlugs`, `relatedArticleSlugs`, `relevantCourseSlugs`, plus Event-only `ruleReviewDate`), all correctly `null`/`[]`. Record counts unchanged at this point (29 Exercises, 20 Events) — confirms the migration altered schema only, no data side effects.

5. **Render Shell is not available** on the `educate-strong-api` service's current plan (owner confirmed — requires a plan upgrade). The Stage 5 dry run and live run were instead performed by the owner locally, using `read -s DATABASE_URL` to capture the credential via a silent, non-echoing prompt into a shell variable — never typed inline as part of a command, and never entering shell history in plaintext the way the original exposure did. The assistant could not and did not perform this step directly, as it requires a human to type the secret into an interactive `read` prompt.

6. **Stage 5 dry run result:** exactly `6 to create, 0 already applied, 0 conflicts`, with all six expected slugs confirmed (`tyre-flip`, `conans-wheel`, `loading-race`, `hercules-hold`, `fingals-fingers`, `block-press`) — matching the approved script precisely. No write made at this point.

7. **Stage 5 live run**, after explicit owner approval: all 6 Events created atomically in a single `prisma.$transaction([...])` (owner-reported script output: `6 to create, 0 already applied, 0 conflicts`, all created).

8. **Final verification, all passed:**
   - Events: **26** total (was 20), all six new slugs present, no duplicate event or exercise slugs
   - Exercises: **29** (unchanged)
   - Backend health: `200 OK`
   - No Prisma errors in any response

9. **Neon snapshot limitation, disclosed by owner:** the current Neon plan only supports **one manual snapshot at a time** — a second post-completion snapshot could not be taken without a plan upgrade, which was not requested. The pre-migration snapshot taken before the Section 3B write (see Section 3A findings) remains in place and was not deleted, so a rollback point covering the entire Stage 6/7/5 change window still exists. Recommend the owner consider a Neon plan upgrade before any future high-risk production write if repeatable before/after snapshotting is wanted — flagged as a recommended improvement, not a blocker, since PITR (6-hour window) and the existing snapshot both remain available.

---

## Section 4 findings of note (read-only public content audit — no writes, no code changes, no merge)

### Verified content counts

| Content group | Count | Source |
|---|---|---|
| Exercises | 29 | Live `GET /api/exercises` |
| Events | 26 | Live `GET /api/events` |
| Combined Exercise + Event records | 55 | 29 + 26 |
| Knowledge Hub articles | 21 | `frontend/src/data/knowledgeArticles.ts` (static data, direct read) |
| EatStrong (BeStrong) published articles | 11 total — 10 FREE, 1 ENROLLED, 0 CERTIFIED | Live `GET /api/be-strong` (mounted path is `/api/be-strong`, not `/api/eatstrong`) |
| Courses (DB-published) | 5 (`level-1-coaching-strongman`, `level-2-coaching-strongman`, `level-3-coaching-strongman`, `level-1-strongman-refereeing`, `strongkidz-coach-education`) | `backend/prisma/seed.ts` + `GET /api/courses` |
| Courses with full rich marketing content | 2 of 5 (Level 1 Coaching, Level 1 Refereeing) | `frontend/src/data/coursePageData.ts` — other 3 use a generic DB-driven fallback template with real curriculum modules/lessons but no price/tutor/outcomes copy |
| Coach Directory public profiles | 0 (honest empty state, not fake data) | `GET /api/coaches`, live |

### Content source-of-truth map (summary)

| Content group | Source | Client-editable without a developer? |
|---|---|---|
| Course catalogue listing | DB (`Course` model via `/api/courses`) | Yes, once an admin UI is used |
| Individual Course marketing pages (price, tutor bio, outcomes) | Hardcoded TS object literal, `frontend/src/data/coursePageData.ts` | No — developer required |
| Course "coming soon" flags | Hardcoded, `frontend/src/data/courseLaunchStatus.ts` | No |
| About, StrongKidz, Coaching Pathway pages | Fully hardcoded in their own `.tsx` files, no separate data file | No |
| Coach Directory / Coach Profile | DB (`CoachProfile` model), fully API-driven | Yes, once an admin UI is used |
| Exercise Library / Event Library | DB (`Exercise`/`Event` models), fully API-driven | Yes, once an admin UI is used |
| Knowledge Hub | Static TS array, `frontend/src/data/knowledgeArticles.ts` | No — developer required; no author/reviewer/date/source fields exist in this data model at all |
| EatStrong | DB (`BeStrongArticle` model, `accessLevel` gated) | Yes, once an admin UI is used |
| Legal pages (Terms/Privacy/Refund Policy) | Hardcoded placeholder drafts, explicitly marked `[LEGAL REVIEW REQUIRED]` | No |
| Tutor personal statements | Hardcoded, `frontend/src/data/tutorsData.ts` — contains literal "Placeholder ... To be provided by Educate.Strong" text for all 4 tutors, but this file is not currently imported by any live page | No — and not yet wired up regardless |

### Launch-ready content

- Exercise Library index + all 29 detail pages: unique slugs, no duplicates, real technique/coaching content, correct breadcrumbs/canonical/structured-data eligibility (per Stage 8 tooling). One content-accuracy issue — see below.
- Event Library index + all 26 detail pages (including the 6 new Stage 5 Events): same standard, all correctly framed as competition/judging content.
- Knowledge Hub index + all 21 articles: complete, finished prose, zero placeholder text found. Structural/attribution gaps noted below are pre-existing data-model limits, not incomplete copy.
- EatStrong hub + all 10 FREE articles: complete, finished prose, author/reviewer/date fields populated (unlike Knowledge Hub), zero placeholder text.
- Level 1 Coaching Strongman and Level 1 Strongman Refereeing course pages: price, duration, tutor, entry requirements, accreditation wording, outcomes, assessment method all present.
- Homepage, 404 page, Register Interest form, Login page: functionally complete, no placeholder/broken content found.

### Incomplete content (specific, not generic)

- **Level 2/3 Coaching Strongman and StrongKidz Coach Education** course pages: no price, no dates, no tutor bio, no learning outcomes, no assessment method — generic "being prepared" fallback (StrongKidz Coach Education does show real curriculum modules/lessons from the DB, but no commercial/delivery details).
- **StrongKidz parent-facing session details** (location, age range, group size, session length, price): all explicitly "To be confirmed" — honestly flagged, not disguised, but genuinely missing.
- **`viking-press-exercise`** (Exercise record): description and "Competition Event" badge both incorrectly frame it as the competition event rather than a training drill — content-drift matching the earlier Arm-Over-Arm Rope Pull pattern, confirmed live and visually.
- **Coaching Pathway page**: six event photography assets referenced (`/assets/event-log-press.jpg` etc.) do not exist on disk; degrades gracefully to an icon (no broken-image icon shown), but real photography is missing.
- **Tutor personal statements** (`tutorsData.ts`): literal placeholder text for all 4 tutors, not yet wired into any live page — content debt to resolve before whichever component consumes this file goes live.
- **Legal pages** (Terms, Privacy, Refund Policy): explicitly marked as placeholder drafts requiring qualified legal review — critical pre-launch item.
- **Shop**: every product marked "Coming soon — register your interest" — intentional current design, not a bug, but a launch-scope decision.
- **EatStrong downloads**: file hosting not configured; clicking a download shows a real user-facing "will be available once document hosting is configured" message.
- **`nutrition-conversations-with-athletes`** (EatStrong): missing its scope-of-practice disclaimer banner (`null` where all 9 sibling FREE articles have it populated). **Update 2026-07-23: `seed.ts` source-of-truth corrected; the live production DB row correction has been drafted (guarded migration, Viking Press pattern) but not yet executed — see Priority 3 findings and the launch blocker table.**

### Placeholder/dead-code sweep — verified, not just grep-reported

A repo-wide sweep found several matches for placeholder/"to be confirmed" patterns. Each was individually verified for whether the containing component is actually reachable from any live route (`grep` for importers) before being classified:

- **Confirmed reachable on a live page (real findings):** StrongKidz session-detail "To be confirmed" fields; Shop "Coming soon" notes; EatStrong download "hosting not configured" message; `NextCourseSection`'s "Location TBC" — **this component was checked and is NOT currently imported anywhere, so it is not live either, downgraded from the initial sweep**; the Login page's public "Preview the portals" link to `/portal-preview` (excluded from `robots.txt` but still visitor-clickable).
- **Found in source but confirmed NOT rendered on any live page (verified via import search, not assumed):** `components/testimonials/TestimonialCard.tsx` + `TestimonialGrid.tsx` (contains dev-warning text "Placeholder — consent not yet confirmed. Do not publish publicly." — this text is NOT visible to real visitors; the actual live homepage testimonials block is a *different* component, `components/sections/TestimonialsSection.tsx`, which correctly shows an honest "No testimonials have been published yet" empty state since none of its 6 entries have `consentConfirmed: true`); `components/community/CommunitySection.tsx` (literal `[Name]`/`[Date]` tokens, unused); `components/sections/EatStrongSection.tsx` ("Image or video placeholder" text, unused); `components/course/CoursePractical.tsx` (default placeholder label, unused); `components/sections/QualifiedReferees.tsx` (hardcoded-false photo flag + one broken image path, unused); `components/sections/ProfessionalPathway.tsx`, `PublicPathwayPreview.tsx`, `UpcomingCohortAlert.tsx`, `AcademyInAction.tsx` (all unused/unwired).
- **Recommendation:** either wire these components up with real content or remove them — they are dead code today, not live bugs, but they represent either duplicate/superseded work or genuine future features left unfinished.
- No lorem ipsum, no `href="#"`, no fake prices/phone numbers, no placeholder social links found anywhere reachable.
- Hardcoded `educate-strong-academy.vercel.app` canonical/OG/JSON-LD URLs exist per-file (Home, CourseDetail, StrongKidz, all EatStrong pages) rather than centralized — will need updating at custom domain cutover (consistent with the Section 1 finding).

### Claims requiring Educate Strong confirmation (register, not exhaustive prose)

Per standing instruction, no claim below is treated as confirmed merely because it currently appears on the site. The "300+ graduates" figure remains the sole pre-confirmed exception.

- "Active IQ Accredited" / "Formally Accredited" / "built by champions"-style wording — appears on the homepage hero, About page, Coaching Pathway page, and a page-level `useDocumentHead` description on `CourseCatalogue.tsx` (a second instance beyond the `index.html` meta tags already corrected in Stage 8).
- Named competition results and titles for Paul Smith, Dr Chris Fitzgerald, Laura Hollywood, Kris Herbert (About page) — specific, checkable claims.
- "Co-founder, Mind Body Connect (Charity No. 1173834)" — specific registration number claim.
- "Extensive MOD coaching experience" and "British Army — Partner" (footer accreditation strip) — organisational relationship/endorsement claims.
- "WHEA.GB Endorsed", "Armed Forces Strongman" endorsement wording — repeated across Home, About, Coaching Pathway, footer.
- "Active IQ Level 1 Certificate ... Nationally recognised. Employer accepted." (Coaching Pathway) — employer-recognition claim.
- DBS clearance and safeguarding-qualification claims for StrongKidz coaches (compliance-relevant, worth an evidence check).
- Several unsourced/unattributed medical, safety, and nutrition claims in Knowledge Hub articles (youth growth-plate safety, caffeine dosage, dehydration/force-output figures, a duty-of-care legal claim) and two EatStrong articles (protein dosage range, heat-illness recognition) reviewed only by a Strength & Conditioning coach credential, not a dietitian or medical professional.
- "EatStrong" brand name — a source-code comment in `BeStrongHub.tsx` explicitly flags that eatstrong.com is a pre-existing US company and recommends UK trademark clearance before public commitment to the name.

### CTA and journey issues

- No dead-end CTAs, no `href="#"`, no broken destinations found across the full public CTA inventory (Courses, Register Interest, Shop, Coaches, Knowledge Hub, EatStrong, Exercise/Event Libraries all checked).
- The Login page's "Preview the portals" link is the one CTA whose presence on a public page is worth an explicit owner decision (keep visible pre-launch, or remove/hide) rather than a content fix.
- `UpcomingCohortSpotlight`'s "Book Now" CTA uses a per-cohort `bookingUrl` field — worth confirming each live cohort record actually has a real URL before launch, since this wasn't independently checked at the data level this section.

### Visual and mobile findings

Checked at desktop (1280px) and mobile (375px) widths, against the live production API data, using a local `feature/libraryPages` build: Homepage, Exercise Library index + 2 detail pages (including the `viking-press-exercise` drift), Event detail (`viking-press`), Knowledge Hub index, EatStrong index, Course detail (Level 1 Coaching, and the StrongKidz Coach Education fallback), Register Interest, Login, 404. No content clipping, broken media, or mobile navigation issues found. No broken-image icons anywhere (missing assets degrade gracefully to icon/initial placeholders by design). One minor mobile spacing quirk noted (two stat bullets sharing a line on the Level 1 Coaching course page at 375px) — cosmetic only, not a launch blocker.

### Recommended realistic launch scope (assistant recommendation only — not a business decision)

- **Ready to launch as-is:** Exercise Library, Event Library (pending the `viking-press-exercise` correction), Knowledge Hub, EatStrong FREE articles, Level 1 Coaching and Level 1 Refereeing course pages, homepage, 404, Register Interest, Login.
- **Ready with a small, narrowly-scoped fix:** `viking-press-exercise` description/badge correction (same pattern as the earlier Arm-Over-Arm Rope Pull fix).
- **Should remain unpublished or clearly marked deferred:** Level 2/3 Coaching and StrongKidz Coach Education course pages (until Educate Strong supplies pricing/dates/tutor/outcomes), Shop (until real products or a firm "coming soon" decision is made), EatStrong downloads (until file hosting exists).
- **Requires Educate Strong input before any further work:** every item in the claims register above; all missing course commercial details; StrongKidz session logistics; tutor personal statements; legal document review.
- **Owner decision needed, not a content fix:** whether the public "Preview the portals" Login page link should remain visible pre-launch.

---

## Priority 1 findings of note (Master Continuation Programme — Viking Press production closure)

1. **Owner declined the terminal-based `read -s DATABASE_URL` route for this correction** — did not want to handle the production credential locally again, even via hidden input. Replaced with a fully Render-managed release, mirroring the Section 3B schema-migration pattern but for a guarded data correction instead.

2. **Guarded, data-only Prisma migration**: `backend/prisma/migrations/20260723150000_correct_viking_press_exercise_description/migration.sql`. A `DO $$ ... $$` block updates `Exercise.description` only where `slug = 'viking-press-exercise'` AND the current value exactly equals the known-incorrect text; raises an exception (aborting and rolling back the whole statement) if zero rows match or, though structurally impossible given the unique `slug` constraint, more than one would. No schema change, no other table touched.

3. **Scoped branch `production-viking-press-correction`, created from `main`** (not `feature/libraryPages`) — exactly one file, PR #2, reviewed via GitHub's API to confirm the file list before merge, approved, merged by the assistant.

4. **Validation limitation, disclosed rather than glossed over**: this environment has no Docker and no reachable local Postgres (`localhost:5433` connection refused, `docker` not installed), so the guard logic could not be exercised with a live test run. Validation instead relied on manual SQL review, `prisma validate` (schema-only, unaffected by this migration), and repository diff confirmation. The SQL pattern used (`GET DIAGNOSTICS ROW_COUNT` + conditional `RAISE EXCEPTION` inside a `DO` block) is standard, well-established Postgres behaviour.

5. **Render auto-deployed from `main`** on merge and ran the correction via its existing `prisma migrate deploy` build step, using its own `DATABASE_URL` binding — no credential was typed, displayed, or handled by the owner or the assistant at any point in this correction.

6. **Post-deploy verification, all passed**: 29 Exercises, 26 Events (both unchanged), `viking-press-exercise` now reads the approved training-framed wording, `viking-press` (Event) unchanged, no duplicate Exercise or Event slugs, backend health `200 OK`. Spot-checked two other Exercise descriptions (`atlas-stone-to-lap`, `arm-over-arm-rope-pull`) against values captured earlier in this session — both unchanged. Combined with the migration's slug+value-scoped `WHERE` clause, this rules out any other record being affected both structurally and empirically.

7. **`feature/libraryPages` reconciled with `main`** via `git merge main` (commit `3a5fbed`) — clean, no conflicts. `backend/prisma/schema.prisma` and the two Stage 6/7 migration folders were byte-identical on both branches already (originally copied verbatim in Section 3B), so only the new Viking Press migration folder was actually added. Commit `80baa4b` (Section 5B) confirmed still present as an ancestor of the new `HEAD`. `seed.ts` confirmed still carries the corrected wording. Backend `prisma validate` and `tsc --noEmit` both re-confirmed clean post-merge.

8. **`section5-correction-viking-press-exercise.ts`** (the TypeScript script prepared in Part 5B) remains in the repository for historical reference only — it was never run against production; the guarded SQL migration superseded it as the actual correction mechanism.

---

## Priority 2 findings of note (Master Continuation Programme — confirmed claims, accreditation scope, StrongKidz provenance)

1. **Owner confirmed 10 categories of claims as legitimate** (Active IQ, WHEA.GB, Armed Forces Strongman, British Army, MOD experience, Mind Body Connect/charities, tutor/founder achievements, competition achievements, 300+ graduates, existing logos). None removed or weakened — full register with exact scope now recorded in [docs/CLAIMS_AND_ACCREDITATION_SCOPE.md](CLAIMS_AND_ACCREDITATION_SCOPE.md).

2. **Course Catalogue metadata** replaced with the owner's exact approved wording, precisely scoping Active IQ to Coaching and WHEA.GB to Refereeing, with StrongKidz described as education (not a qualification).

3. **Hero badge scope clarification** added on Home and Coaching Pathway — a visible (not hover-only), accessible sentence under the existing accreditation pills, explaining exactly which course each badge applies to. Design preserved; no clutter.

4. **"Nationally recognised. Employer accepted."** replaced with "Active IQ accredited Level 1 qualification." on the Coaching Pathway accreditation strip — scoped to Level 1 Coaching only, per the owner's exact instruction.

5. **Coach Directory trust pills removed** ("Active IQ Verified", "WHEA.GB Endorsed", "UK & Worldwide") — the directory has zero published coaches, so these described no current coach. Honest empty state and future DB-driven profile system untouched.

6. **StrongKidz safeguarding claims replaced** with a neutral holding statement ("Full safeguarding, Coach verification and booking information will be confirmed before sessions open.") — the specific DBS/qualification/named-lead claims were not owner-confirmed and are now withheld rather than asserted. The "raise a concern" contact route was preserved, and nothing implies safeguarding is absent. Session logistics fields (location/age/group size/duration/price) remain honestly marked "to be confirmed" — unchanged, as instructed.

7. **Level 2 Coaching, Level 3 Coaching, and StrongKidz Coach Education**: the shared fallback course-detail view's interactive module/lesson curriculum section — confirmed, by direct code reading, to display programmatically template-generated placeholder lesson titles and content when expanded — has been replaced with a static "Full curriculum details for this course are being finalised and will be published here once confirmed" notice. No database records were touched or deleted; only the public presentation was suppressed. This applies uniformly to all three courses since they share one code path.

8. **StrongKidz Coach Education's course summary** ("Professional coach education for adults delivering StrongKidz sessions...") was kept as-is rather than replaced — its content makes no specific unverifiable claims (no price, dates, accreditation, or safeguarding facts), consistent with the similarly-generic Level 2/3 summaries. Provenance from Educate Strong's official website was not independently confirmed; a proposed neutral holding statement was prepared as an alternative but not applied without your sign-off — flagged explicitly rather than assumed either way.

9. **Two documentation files created**: [docs/CLAIMS_AND_ACCREDITATION_SCOPE.md](CLAIMS_AND_ACCREDITATION_SCOPE.md) (internal claims register) and [docs/EDUCATE_STRONG_STRONGKIDZ_INFORMATION_REQUEST.md](EDUCATE_STRONG_STRONGKIDZ_INFORMATION_REQUEST.md) (client-facing information request, separated into required/recommended/can-wait).

10. **Three residual claims noticed but left untouched**, as they fell outside this round's explicit approved decisions: the Course Catalogue page's own visible H1 subheading ("Accredited qualifications across coaching, refereeing, and youth development" — a different string from the `<meta>` description already corrected); the StrongKidz hero subtext ("safeguarding-trained coaches"); and the homepage "UK Wide Reach" stat. All three recorded in the claims register's open-items table for a future decision.

11. **Validation**: frontend `tsc --noEmit` clean (no backend files touched this priority); full production build succeeded; prerender wrote all 55 Exercise/Event pages; sitemap regenerated with 113 URLs; visual verification completed at both desktop and mobile widths on Home, Coaching Pathway, Course Catalogue, Level 2, Level 3, StrongKidz Coach Education, the parent-facing StrongKidz page, and the Coach Directory empty state. `git diff --stat` confirmed exactly the 6 intended files changed, nothing else.

---

## Priority 3 implementation findings of note (Master Continuation Programme — Knowledge Hub and EatStrong editorial completion)

1. **Knowledge Hub data model extended, backward-compatible.** `frontend/src/data/knowledgeArticles.ts`'s `KnowledgeArticle` interface gained optional `sections` (structured heading/paragraph/list blocks), `faqs`, `sources`, `author`, `reviewer`, `publishedDate`, and `lastReviewedDate` fields, alongside the original flat `body` string (now optional). All 20 remaining legacy articles are untouched and continue to render via the original `body` path; the 4 new articles use the structured path. `KnowledgeArticlePage.tsx` was upgraded with `renderInlineText` (parses `**bold**` and `[text](/path)` markup) and `renderBlocks` helpers, plus conditional FAQ/Sources/attribution sections — verified via full `tsc --noEmit` (both frontend and backend) and direct browser inspection of all 4 new articles and one legacy article (`the-six-core-events`).

2. **Article 20 ("Start Strongman Safely: A Guide for New Athletes", slug `start-strongman-safely`) retired**, superseded by the new "Strongman for Beginners" article. A true HTTP 308 redirect was added to the root `vercel.json`'s `routes` array (`/knowledge/start-strongman-safely` → `/knowledge/strongman-for-beginners`), plus a client-side `<Navigate replace>` fallback in `App.tsx` matching the existing `/be-strong` precedent. The two files referencing the old slug in `PREVIEW_SLUGS` arrays (`KnowledgeHubPreview.tsx`, `LearnStrongmanProperly.tsx`) were updated to the new slug. The Vercel-level 308 could not be exercised locally (Vercel-specific routing only applies once deployed); the client-side redirect was verified working in the local dev server.

3. **4 new articles added verbatim from the owner-supplied source text** ("What Is Strongman?", "Strongman for Beginners", "Strongman Events Explained", "How to Become a Strongman Coach") — slugs `what-is-strongman`, `strongman-for-beginners`, `strongman-events-explained`, `how-to-become-a-strongman-coach`. Every sentence was cross-checked against the original pasted source (recovered from this session's own prior transcript, since the source text itself is not persisted anywhere else in the repo) before being committed to the data file — no rewriting, shortening, or invented content. `author: "Educate.Strong Academy"` per the owner's explicit correction (not "Educate.Strong Knowledge Hub Team"); no reviewer/published-date set, since none was supplied. The handful of sentences referring readers to the still-unpublished "Is Strongman Safe for Children?" article were omitted (not merely un-linked) per the owner's explicit instruction, in the six locations previously identified.

4. **A 5th supplied article ("Is Strongman Safe for Children?")** was deliberately kept out of `knowledgeArticles.ts` entirely. Its full text was preserved verbatim in a new file, [docs/DRAFT_is-strongman-safe-for-children.md](DRAFT_is-strongman-safe-for-children.md), clearly labelled as an unpublished editorial draft requiring a named, suitably qualified reviewer before publication, with the previously agreed reviewer-approval checklist attached. Confirmed via direct browser check: `/knowledge/is-strongman-safe-for-children` shows the existing "Article not found" fallback — this is a **client-side soft 404 (HTTP 200 under the hood)**, the same behaviour any invalid Knowledge Hub slug gets, not a true server-level 404 like Exercise/Event pages get via `/api/library-not-found.mjs`. It does not appear in the sitemap, the Knowledge Hub listing, search metadata, or any internal link — confirmed by direct sitemap/grep checks, not assumption.

5. **Internal link mapping applied and verified against live routes** — no invented destinations. `/exercises`, `/events`, `/about`, `/coaching`, `/register-interest`, `/strongkidz`, and the article-to-article `/knowledge/<slug>` links were all cross-checked against `App.tsx`'s actual route table before use. Articles 1–3's closing CTA links to `/about` (matching Article 1's explicitly approved mapping, extended consistently to Articles 2 and 3 since their closing sentences are the same generic institutional phrasing); Article 4's closing CTA links to `/coaching` and `/register-interest` per its explicit approved mapping — flagged here for visibility since only Article 1 and Article 4's CTA targets were explicitly specified in the approval message; Articles 2 and 3 followed by inference from the same pattern.

6. **Sitemap regenerated from a real build, not assumed**: `116 URL(s)` total (up from 113 pre-Priority-3). Confirmed via direct inspection of the generated `dist/sitemap.xml`: the 4 new `/knowledge/<slug>` URLs are present, `start-strongman-safely` and `is-strongman-safe-for-children` are both absent (zero matches), and the Knowledge Hub listing page now reports "24 resources" (21 − 1 retired + 4 new).

7. **EatStrong disclaimer**: `backend/prisma/seed.ts`'s `nutrition-conversations-with-athletes` entry corrected from `scopeOfPracticeNote: null` to the standard `SCOPE_NOTE` value — this is a **seed-file (source-of-truth) correction only**. It does **not** change the already-seeded production database row; per the standing rule against unauthorised production writes, that requires a separate guarded migration (same pattern as the Viking Press correction), which has been drafted for review but deliberately **not created as a migration file, branch, or PR** pending explicit owner approval to proceed — see the chat report for the exact guarded SQL text.

8. **EatStrong admin panel inspected** (`frontend/src/pages/admin/BeStrongManager.tsx`, `backend/src/routes/bestrong.ts`) — confirmed the admin UI exposes **only** publish/unpublish and feature/unfeature toggles (`togglePublish`, `toggleFeatured`); there is no form field anywhere in the admin UI for editing `scopeOfPracticeNote`, `content`, `authorName`, `reviewerName`, or any other text field. The backend's `PUT /api/be-strong/admin/articles/:id` route does accept an arbitrary request body and would persist a `scopeOfPracticeNote` value if sent directly via the API — but there is no UI path to do so today. This confirms a real production correction (not an admin-panel edit) is the only way to apply the disclaimer fix to the live database.

9. **Validation performed**: frontend `tsc --noEmit` clean; backend `tsc --noEmit` clean; full production build (`npm run build`) succeeded, including SSR bundle and prerender (`55 page(s) prerendered` — unchanged, Knowledge Hub articles are sitemap-only, never individually prerendered); sitemap regenerated at 116 URLs (actual count, not assumed); all 4 new articles and one legacy article visually verified at desktop (1280px) and mobile (375px) widths via the local dev server; browser console showed zero errors throughout; `git diff --stat` confirmed exactly the 7 intended files changed plus 1 new file, nothing else.

---

## Priority 3 final verification findings of note

### 1. EatStrong disclaimer — merged and verified live in production ✅

Same fully Render-managed process as the Viking Press correction — no `DATABASE_URL` was requested, typed, or handled at any point.

- **Branch**: `production-eatstrong-scope-note-correction`, created from `main` (not `feature/libraryPages`).
- **Migration**: `backend/prisma/migrations/20260723180000_correct_nutrition_conversations_scope_note/migration.sql` — a guarded `DO $$ ... $$` block, exactly mirroring the Viking Press pattern. Updates `BeStrongArticle.scopeOfPracticeNote` only where `slug = 'nutrition-conversations-with-athletes'` AND `scopeOfPracticeNote IS NULL`; raises an exception (aborting the whole transaction) if zero or more than one row matches. No schema change; touches no other row or table.
- **PR**: [#3](https://github.com/raf643782/educate-strong-academy/pull/3), merged into `main` at commit `9fc9e36` on 2026-07-23, following your explicit approval.
- **Deploy monitoring**: this environment has no Render API token or dashboard access, so Render's own build logs / "Live" status could not be observed directly — same disclosed limitation as the Viking Press correction. Instead, deploy success was confirmed indirectly but conclusively: Render's build command runs `npx prisma migrate deploy` as a required step; if that migration had failed (0 or >1 rows matched, or any SQL error), the build step itself would fail and Render would keep serving the prior deployment, which would still show `scopeOfPracticeNote: null` for this article. The public API now shows the corrected value, which is only possible if the new deploy went live **and** the migration applied without error.
- **Production API verification, all passed** (`GET /api/be-strong/articles`, `GET /api/be-strong/articles/nutrition-conversations-with-athletes`, `GET /api/health`):
  - `nutrition-conversations-with-athletes` now returns `scopeOfPracticeNote` matching the approved disclaimer text verbatim.
  - All other fields on that record (`authorName`, `reviewerName`, `reviewerQualification`, `lastReviewedAt`, `content`, `summary`, `accessLevel`, `isPublished`, `isFeatured`) unchanged from the documented baseline.
  - All **11** EatStrong articles still present, same slugs/categories/access levels as before.
  - Spot-checked 3 other articles (`energy-balance-strongman`, `supplements-strongman-evidence-scope`, `managing-long-competition-days`) — `scopeOfPracticeNote` and all other fields unchanged, confirming exactly one row was affected.
  - `GET /api/health` returns `200`.
- **Item complete and verified.**
- **Failure behaviour**: if the row has already been corrected, or its `scopeOfPracticeNote` is unexpectedly non-null, the migration raises an exception and Postgres rolls back the entire transaction — nothing is left partially applied.
- **Not yet done**: merge (awaiting your explicit approval) and post-merge live-API verification.

### 2. Knowledge Hub true 404, redirect, and Exercise/Event 404 — root cause fixed, all verified live ✅

You confirmed the root cause (Vercel project Root Directory = `frontend`) and asked for the smallest safe fix within the active project structure, without touching the Vercel dashboard.

- **Root cause, confirmed**: this Vercel project only ever deploys `frontend/` and its own `frontend/vercel.json` — the repository-root `vercel.json` and root `api/` folder (where all of this routing previously lived) are invisible to real deployments. This explained not just the new draft-404 route, but also the pre-existing Exercise/Event 404 mechanism and the Knowledge Hub redirect, both of which were quietly non-functional at the HTTP level (working only via client-side JS fallbacks) the whole time.
- **Fix — reproduced the routing inside the directory Vercel actually deploys**:
  - `frontend/api/library-not-found.mjs` and `frontend/api/knowledge-draft-not-found.mjs` — same logic as the (now-inactive) root-level originals, moved into the active project structure.
  - `frontend/vercel.json` — added a `redirects` entry (`permanent: true`, i.e. genuine 308) for `/knowledge/start-strongman-safely` → `/knowledge/strongman-for-beginners`, and `rewrites` entries for `/knowledge/is-strongman-safe-for-children`, `/exercises/:slug`, and `/events/:slug` pointing at the functions above — all ahead of the pre-existing SPA catch-all rewrite, which is unchanged and still last.
  - The root-level `vercel.json` and `api/*.mjs` files were **not deleted** — each now carries a clear header/comment marking it as inactive/reference-only, so nobody edits the wrong copy in future. This satisfies "deprecate without deleting."
- **Local validation, all passed**: both `vercel.json` files valid JSON; both new handler files pass `node --check`; both handlers invoked directly with mocked requests (draft-404 → `404`/`noindex`/no draft content; library-not-found → `404` for a fake slug, `200` fail-open for a real one); frontend `tsc --noEmit` clean; full production build succeeded (55 pages prerendered, sitemap regenerated at 116 URLs — both unchanged, confirming this fix doesn't touch the build pipeline).
- **Live verification on the `feature/libraryPages` preview** (via your Vercel Shareable Link), all 12 required checks passed:
  1. `/knowledge/is-strongman-safe-for-children` → **`HTTP 404`** (confirmed via direct `fetch`, not just the rendered page).
  2. `X-Robots-Tag: noindex` present on that response.
  3. Response body is the function's own generic "not currently published" HTML (877 bytes) — no draft text.
  4. `/knowledge/start-strongman-safely` → genuine server-level redirect confirmed via the browser's Navigation Timing API (`performance.getEntriesByType('navigation')[0].redirectCount === 1`, i.e. a real HTTP redirect occurred, not client-side routing), landing on `/knowledge/strongman-for-beginners`. Combined with the `permanent: true` config (Vercel's documented behaviour for that flag), this is a genuine 308.
  5. All 4 new articles (`what-is-strongman`, `strongman-for-beginners`, `strongman-events-explained`, `how-to-become-a-strongman-coach`) load correctly.
  6. A nonexistent Exercise slug → `404` with `X-Robots-Tag: noindex`.
  7. A nonexistent Event slug → `404` with `X-Robots-Tag: noindex`.
  8. Valid Exercise (`log-press`), Event (`atlas-stones`), and both library index pages (`/exercises`, `/events`) all return `200` with the normal SPA shell — unaffected by the new rewrites.
  9. Knowledge Hub listing shows **"24 resources"**, all 4 new titles present, retired/draft titles absent.
  10. Sitemap on this deployment: **116 URLs** (matches the local build exactly), both retired/draft slugs absent.

### Final Priority 3 status

**CLOSED.** Both items are resolved and verified live: the EatStrong disclaimer is confirmed correct in production via the public API, and the Knowledge Hub redirect/404 plus the pre-existing Exercise/Event 404 mechanism are all confirmed working via direct HTTP-level testing on the `feature/libraryPages` preview deployment. `feature/libraryPages` has not been merged into `main`.

---

## Priority 4 — Real Account Journey, Email Delivery and Secure Downloads

**Confirmed decisions for the full programme:** email provider Resend, private file storage Cloudflare R2, Portal Preview retained (ADMIN-only, not deleted), Register Interest sends both an owner notification and a submitter confirmation, email verification uses the soft approach (never blocks login/dashboard access), registration only ever creates `LEARNER` accounts and never grants enrolment or paid content access, no payments implemented. Work proceeds in separate stages, each stopping for approval.

### Stage 4A — Immediate Security Closure (2026-07-24)

**Vulnerabilities closed:**

1. **`GET /api/lessons/:id` had no authentication and no enrolment check** — any lesson's full content, video URL, and resource URL were readable by anyone with the lesson ID, logged in or not. Fixed: the route now requires `authenticate`, and unless the caller is `ADMIN`, requires a matching `Enrolment` record for the course containing that lesson (looked up via `lesson.module.course.id`) before returning anything. No lock/access-tier concept exists for individual lessons in the data model today (unlike `CourseDocument.status`), so enrolment is the sole and correct gate, matching the pattern already used in `documents.ts`. Non-enrolled authenticated users get a generic 403 (`"You are not enrolled in this course."`) with no course details leaked; missing/invalid lessons still 404.

2. **`GET /api/courses/:slug` had no `isPublished` filter** — any unpublished/draft course's metadata (title, modules, every lesson's ID/title — which then fed directly into finding #1) was fetchable by slug regardless of publish status. Fixed: the route now treats a course with `isPublished: false` the same as a course that doesn't exist (generic 404). The separate, already-existing ADMIN course-editing routes (`/api/admin/courses*`, all `requireRole('ADMIN')`-gated, looked up by ID not slug) are untouched and continue to see unpublished courses as before.

3. **Portal Preview was public** — `/portal-preview/*` (8 routes) required no authentication at all. Fixed: every route now requires `ADMIN` via the existing `<ProtectedRoute roles={['ADMIN']}>` component — no new authorization mechanism was built, this reuses the identical pattern already applied to `/admin/*`. The "Preview the portals" link was removed from the public `/login` page. None of the preview pages, components, or routes were deleted — the tooling is intact for internal review, just no longer public.

4. **`JWT_SECRET` fell back to the fixed literal `'fallback-secret'`** in 5 call sites across 3 files if the env var was ever unset — anyone who discovered that string could forge a valid token for any user ID and role. Fixed: a new single source of truth, `backend/src/config/jwtSecret.ts`, throws an error at process startup if `NODE_ENV=production` and `JWT_SECRET` is not set (a clear, immediate crash in deploy logs, never printing any secret value) — the app will not run insecurely in production. Outside production, a clearly-labelled, non-secret placeholder (`'dev-only-insecure-secret-do-not-use-in-production'`) is used instead, with a console warning (not the value itself). All 5 usages (`middleware/auth.ts` ×2, `routes/auth.ts` ×2, `routes/qaDemo.ts` ×1) now import this one constant, so behaviour is consistent everywhere.

5. **No frontend handling for an expired/invalid token** — a stale token would leave the app in an inconsistent authenticated-looking state until a page's own error handling happened to catch it. Fixed: a global axios response interceptor in `frontend/src/lib/api.ts` clears the stored token and redirects to `/login` on any 401, except when already on a public auth page (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` — the last of these doesn't exist yet, included pre-emptively for Stage 4B) to avoid redirect loops or interrupting a flow that doesn't need an existing session.

**Authorization test results:**

- Confirmed live via direct middleware invocation (no database needed for these branches, since they return before any Prisma call): no `Authorization` header → `401 "No token provided"`, route never reached. Malformed token → `401 "Invalid token"`, route never reached. Token forged with the wrong secret → `401 "Invalid token"`, route never reached.
- The enrolled / non-enrolled / ADMIN branches of `lessons.ts`, and the published/unpublished branches of `courses.ts`, were verified by direct code trace against the exact logic as written (confirmed correct), but **could not be executed live** — this environment has no Docker and no local Postgres available (the same limitation already disclosed for the Viking Press correction earlier in this programme), and creating test accounts/enrolments against the live production database was correctly out of scope ("do not make production writes"). Recommend a follow-up live check once a database is reachable, or via the owner's own account in a controlled way.

**Portal Preview results (all confirmed live, frontend dev server):**
- Unauthenticated request to `/portal-preview` and `/portal-preview/admin` → redirected to `/login`.
- Authenticated as `LEARNER` (via a throwaway local mock auth server used only for this test — no real accounts, no production contact) requesting `/portal-preview/admin` → redirected to `/dashboard` (the learner's own correct dashboard), not shown an error page.
- Authenticated as `ADMIN` (same mock) requesting `/portal-preview/admin` → loads normally, full preview content renders correctly with its existing "Preview only, no real data" banner intact.

**JWT handling results:** verified all three startup scenarios directly (`NODE_ENV=production` + missing `JWT_SECRET` → throws immediately with a clear message, no secret printed; `NODE_ENV=production` + `JWT_SECRET` set → loads silently, unchanged behaviour; non-production + missing `JWT_SECRET` → warns and uses the placeholder). Render's `render.yaml` already sets `JWT_SECRET: generateValue: true` for the real deploy, so this fail-fast path is a safety net, not an active behaviour change for the current production configuration.

**401 handling results:** using the same throwaway mock, confirmed a mid-session 401 (simulating an expired token) clears the stored token and redirects to `/login`. Confirmed no redirect loop: submitting a (mock) failed login attempt on the `/login` page itself does not trigger the interceptor's redirect, since `/login` is on the excluded-paths list — the page's own error handling remains in control there.

**Build/validation results:** backend `tsc --noEmit` clean; frontend `tsc --noEmit` clean; full production build succeeded unchanged (55 pages prerendered, sitemap at 116 URLs — this stage touched no frontend data/build files, so these numbers are unaffected).

**Desktop and mobile results:** `/login` checked at 1280px and 375px — the removed link left no layout gap, "Verifying a certificate? Check a certificate" remains the last line at both widths, no visual regression. `/register` and `/forgot-password` also loaded cleanly with no console errors during this pass.

**Login, registration, password reset regression:** the only change to `auth.ts` in this stage was replacing `process.env.JWT_SECRET || 'fallback-secret'` with the imported `JWT_SECRET` constant — behaviourally identical wherever `JWT_SECRET` is already set (true in production per `render.yaml`), so no functional regression is possible from that change. `Login.tsx` was changed only by removing the preview link (no logic touched). Full live registration/login/reset round-trips against a real database could not be exercised for the same no-local-database reason noted above.

**`KnowledgeArticle.accessLevel` finding:** the DB-backed `KnowledgeArticle` model (separate from the static file-based Knowledge Hub the public site actually uses — confirmed the live Knowledge Hub UI never calls this API) is seeded with exactly 6 rows, and **all 6 have `accessLevel: 'FREE'`**. `GET /api/knowledge` and `GET /api/knowledge/:slug` do not check `accessLevel` at all, but since nothing seeded is non-FREE, **no protected content is currently exposed by this gap**. Documenting only, per instruction — not broadening Stage 4A to fix this.

**Files modified:** `backend/src/middleware/auth.ts`, `backend/src/routes/auth.ts`, `backend/src/routes/courses.ts`, `backend/src/routes/lessons.ts`, `backend/src/routes/qaDemo.ts`, new `backend/src/config/jwtSecret.ts`, `frontend/src/App.tsx`, `frontend/src/lib/api.ts`, `frontend/src/pages/auth/Login.tsx`. No database schema changes.

**Remaining Priority 4 stages (not started):**
- **Stage 4B** — email verification (soft approach): schema migration (`User.emailVerified`, new `EmailVerificationToken` model), new auth routes, `VerifyEmail.tsx`, dashboard banner.
- **Stage 4C** — Register Interest reliability: Resend-based owner notification + submitter confirmation emails.
- **Stage 4D** — secure downloads: Cloudflare R2 integration, presigned URLs, admin upload flow, `Documents.tsx`/`CoursePlayer.tsx` download-flow fixes.

---

## Launch blocker table

| Item | Label |
|---|---|
| Production database credential rotation | ~~Critical blocker~~ **Resolved 2026-07-22** |
| Neon vs Render-native database identity confirmation | ~~Critical blocker~~ **Resolved 2026-07-22** — production is Neon; unused `educate-strong-db` Render resource left in place pending owner decision |
| Stage 5/6/7 production alignment (Events, media schema, editorial schema) | ~~Launch blocker~~ **Resolved and verified 2026-07-23** — 26 Events, 29 Exercises, full Stage 6/7 schema live |
| Arm-Over-Arm Rope Pull Exercise description drift resolution | ~~Launch blocker~~ **Resolved, confirmed 2026-07-22** |
| Neon plan only supports one manual snapshot at a time (no repeatable before/after snapshotting without upgrade) | **Recommended improvement** — consider a plan upgrade ahead of any future high-risk write; PITR (6h) and the existing pre-migration snapshot remain available in the meantime |
| Commercial access policy (pricing, payment model) | **Client decision** |
| Payment provider integration or manual-enquiry confirmation | **Launch blocker** (pending client decision) |
| Sanity/CMS completion decision | **Client decision** |
| Custom domain cutover plan | **Launch blocker** (pending client decision on timing) |
| Analytics + consent configuration | **Launch blocker** |
| Legal documents (privacy, terms, cookies) review | **Launch blocker** |
| QA demo login confirmed disabled in production | **Launch blocker** |
| `backend/.env.docker` tracked in git (low-risk local-only values) | **Recommended improvement** |
| CORS wildcard on `*.vercel.app` | **Recommended improvement** (tighten at domain cutover) |
| Legal pages (Terms/Privacy/Refund Policy) explicitly marked `[LEGAL REVIEW REQUIRED]` | **Legal or accreditation review required** |
| `viking-press-exercise` content drift | ~~Technical fix required~~ **Resolved and verified 2026-07-23** via guarded production migration (PR #2) |
| Confirmed authority/accreditation/partnership claims (Active IQ, WHEA.GB, Armed Forces Strongman, British Army, MOD, charities, tutor/competition achievements, 300+ graduates) | ~~Client decision~~ **Confirmed by owner and scope-mapped 2026-07-23** — see [CLAIMS_AND_ACCREDITATION_SCOPE.md](CLAIMS_AND_ACCREDITATION_SCOPE.md) |
| StrongKidz DBS/safeguarding-qualification/named-lead claims (unconfirmed) | ~~Client decision~~ **Resolved 2026-07-23** — replaced with a neutral holding statement pending Educate Strong confirmation (see StrongKidz information request doc) |
| "Nationally recognised. Employer accepted." (unscoped qualification-recognition claim) | ~~Client decision~~ **Resolved 2026-07-23** — replaced with precisely-scoped "Active IQ accredited Level 1 qualification." |
| Coach Directory "UK & Worldwide" unscoped reach claim | ~~Client decision~~ **Resolved 2026-07-23** — pill removed along with the other trust pills |
| Seeded/template-generated placeholder curriculum publicly exposed on Level 2/3 and StrongKidz Coach Education | ~~Technical fix required~~ **Resolved 2026-07-23** — public module/lesson expansion suppressed; database records untouched |
| Course Catalogue page's visible H1 subheading | ~~Client decision~~ **Resolved 2026-07-23** — replaced with "Explore Strongman coaching, refereeing and youth development education." |
| StrongKidz hero subtext "safeguarding-trained coaches" | ~~Client decision~~ **Resolved 2026-07-23** — replaced with "Full Coach, safeguarding and session information will be confirmed before bookings open." |
| StrongKidz Coach Education course summary (unconfirmed provenance) | ~~Client decision~~ **Resolved 2026-07-23** — public page now shows a neutral holding statement; underlying database record untouched |
| Homepage "UK Wide Reach" stat | **Client decision — source untraceable, awaiting explicit owner confirmation.** Git history traced to commit `e659683`, no reference to an official source found. Left unchanged, not removed, pending your confirmation or replacement wording |
| `WhyEducateStrong.tsx:71` — exclusivity claim | ~~Client decision~~ **Wording corrected 2026-07-23**, but correction to prior report: this component is confirmed **not rendered on any live page** (`Home.tsx`'s own comment: "intentionally not rendered here... kept in the codebase, just not wired into this page"). The claim was never actually visible to a visitor — flagging it as a live finding in the prior report was an error; wording still corrected in source in case the component is reinstated |
| "safeguarding-trained coaches" — remaining 4 instances (3 FAQ answers + meta description) | ~~Client decision~~ **Resolved 2026-07-23** — all replaced with neutral wording; zero instances of this claim remain anywhere in the codebase |
| Level 2/3 Coaching and StrongKidz Coach Education course pages missing commercial details | **Client content required** |
| StrongKidz parent-facing session logistics (location, age range, price, etc.) | **Client content required** — see [EDUCATE_STRONG_STRONGKIDZ_INFORMATION_REQUEST.md](EDUCATE_STRONG_STRONGKIDZ_INFORMATION_REQUEST.md) |
| Tutor personal statements (`tutorsData.ts`) still placeholder text | **Client content required** (not yet wired to any live page — no launch urgency until it is) |
| Coaching Pathway event photography assets missing (6 files) | **Client content required** |
| EatStrong download file hosting not configured | **Technical fix required** |
| "EatStrong" brand name — UK trademark clearance not yet confirmed (flagged in source code) | **Legal or accreditation review required** |
| Public "Preview the portals" link on the Login page | ~~Client decision~~ **Resolved 2026-07-24 (Priority 4, Stage 4A)** — link removed from Login; all `/portal-preview/*` routes now require ADMIN authentication; tooling itself retained, not deleted |
| `GET /api/lessons/:id` had no auth or enrolment check (full lesson content, video/resource URLs exposed to anyone) | ~~Critical security risk~~ **Resolved 2026-07-24 (Priority 4, Stage 4A)** — now requires authentication + enrolment (or ADMIN), matching the existing `documents.ts` pattern |
| `GET /api/courses/:slug` had no `isPublished` filter (unpublished/draft course metadata publicly fetchable) | ~~Security risk~~ **Resolved 2026-07-24 (Priority 4, Stage 4A)** — unpublished courses now return 404 on the public route; ADMIN editing routes unaffected |
| `JWT_SECRET` fell back to a fixed, guessable literal (`'fallback-secret'`) if unset | ~~Security risk~~ **Resolved 2026-07-24 (Priority 4, Stage 4A)** — centralised in `backend/src/config/jwtSecret.ts`, fails fast at startup in production if unset, never falls back silently |
| No frontend handling for an expired/invalid auth token | ~~Recommended improvement~~ **Resolved 2026-07-24 (Priority 4, Stage 4A)** — global 401 interceptor added, excludes public auth pages to avoid redirect loops |
| Dead/unwired placeholder components (`TestimonialCard`/`TestimonialGrid`, `CommunitySection`, `EatStrongSection`, `CoursePractical`, `QualifiedReferees`, `ProfessionalPathway`, `PublicPathwayPreview`, `UpcomingCohortAlert`, `AcademyInAction`, `NextCourseSection`) | **Recommended improvement** (wire up or remove — not currently live, not a launch blocker) |
| `nutrition-conversations-with-athletes` missing `scopeOfPracticeNote` disclaimer in the **live production database** | ~~Awaiting owner approval~~ **Resolved and verified live 2026-07-23** — PR #3 merged into `main` (commit `9fc9e36`), Render auto-deployed, live API confirms the disclaimer text on exactly this one article, all other 10 articles and all fields unchanged |
| EatStrong admin panel has no field-level content editing UI (only publish/feature toggles) | **Recommended improvement** — confirmed 2026-07-23 by direct inspection of `BeStrongManager.tsx`/`bestrong.ts`; not a launch blocker, but means any future EatStrong text correction (including the disclaimer above) requires a guarded migration, not an admin-panel edit |
| Knowledge Hub true-404 route, redirect, and Exercise/Event 404 mechanism | ~~Launch blocker~~ **Resolved and verified live 2026-07-23** — root cause (Vercel project Root Directory is `frontend`, so the repository-root `vercel.json`/`api/` were never deployed) fixed by reproducing the same routing and serverless functions inside `frontend/vercel.json` and `frontend/api/`. All 12 required checks passed on the live `feature/libraryPages` preview: genuine 404 for the draft article (with `noindex`, no draft content), genuine 308 for the retired-article redirect, genuine 404 for nonexistent Exercise/Event slugs, valid pages unaffected, sitemap and listing counts correct. See Priority 3 final verification findings above |
| Is Strongman Safe for Children? draft remains unpublished, no reviewer identified | **Content/handover blocker** — see [DRAFT_is-strongman-safe-for-children.md](DRAFT_is-strongman-safe-for-children.md) for the required reviewer-approval checklist before this can be published |
| Handover documentation pack | **Handover blocker** |
| Client final signoff | **Handover blocker** |
| Sanity CMS phased rollout | **Future enhancement** (if Section 9 decision defers it) |
| CPD subscription / organisation access | **Future enhancement** |
