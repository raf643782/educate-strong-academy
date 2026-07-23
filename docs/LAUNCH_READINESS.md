# Educate.Strong Academy — Launch Readiness Tracker

Living document. Updated at the end of every programme section. No credentials, connection strings, or secret values are ever recorded in this file — only status, ownership and evidence references.

**Last updated:** Priority 2F (Master Continuation Programme — Confirmed Claims, Accreditation Scope, Course Scope, StrongKidz Provenance) — 2026-07-23.

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
- **`nutrition-conversations-with-athletes`** (EatStrong): missing its scope-of-practice disclaimer banner (`null` where all 9 sibling FREE articles have it populated).

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
| Course Catalogue page's visible H1 subheading still reads "Accredited qualifications across coaching, refereeing, and youth development" | **Client decision** (separate from the `<meta>` description already corrected; not yet addressed) |
| StrongKidz hero subtext "safeguarding-trained coaches" | **Client decision** (separate from the safeguarding section already corrected; not yet addressed) |
| Homepage "UK Wide Reach" stat | **Client decision** (noticed during Priority 2 visual verification, not yet addressed) |
| Level 2/3 Coaching and StrongKidz Coach Education course pages missing commercial details | **Client content required** |
| StrongKidz parent-facing session logistics (location, age range, price, etc.) | **Client content required** — see [EDUCATE_STRONG_STRONGKIDZ_INFORMATION_REQUEST.md](EDUCATE_STRONG_STRONGKIDZ_INFORMATION_REQUEST.md) |
| Tutor personal statements (`tutorsData.ts`) still placeholder text | **Client content required** (not yet wired to any live page — no launch urgency until it is) |
| Coaching Pathway event photography assets missing (6 files) | **Client content required** |
| EatStrong download file hosting not configured | **Technical fix required** |
| "EatStrong" brand name — UK trademark clearance not yet confirmed (flagged in source code) | **Legal or accreditation review required** |
| Public "Preview the portals" link on the Login page | **Client decision** (keep visible pre-launch or remove) |
| Dead/unwired placeholder components (`TestimonialCard`/`TestimonialGrid`, `CommunitySection`, `EatStrongSection`, `CoursePractical`, `QualifiedReferees`, `ProfessionalPathway`, `PublicPathwayPreview`, `UpcomingCohortAlert`, `AcademyInAction`, `NextCourseSection`) | **Recommended improvement** (wire up or remove — not currently live, not a launch blocker) |
| Handover documentation pack | **Handover blocker** |
| Client final signoff | **Handover blocker** |
| Sanity CMS phased rollout | **Future enhancement** (if Section 9 decision defers it) |
| CPD subscription / organisation access | **Future enhancement** |
