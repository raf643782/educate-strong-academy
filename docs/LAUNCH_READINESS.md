# Educate.Strong Academy — Launch Readiness Tracker

Living document. Updated at the end of every programme section. No credentials, connection strings, or secret values are ever recorded in this file — only status, ownership and evidence references.

**Last updated:** Section 3B (Scoped Database Alignment Execution) — 2026-07-23.

---

## Repository and branch state (verified this session)

| Item | Value |
|---|---|
| Repository | `raf643782/educate-strong-academy` (public on GitHub) |
| Local path | `/Users/raffa/Projects/EducateStrong` |
| Working branch | `feature/libraryPages` |
| Current commit | `79b11db` (Stage 8) |
| Working tree | Clean |
| Remote sync | Up to date with `origin/feature/libraryPages` |
| Open pull request | None found for `feature/libraryPages` |
| `main` branch | `f9980d8` — the commit immediately before Stage 1 began. **`feature/libraryPages` has not been merged; production is running pre-Stage-1 code.** |
| Second git worktree | `/Users/raffa/Projects/esa-db-update`, detached HEAD at `65d6182` (the Stage 4 drift-correction commit) — see Findings below |
| Local checkpoint tag | `checkpoint-section1-audit` created at `79b11db`, pushed to `origin` |
| Documentation commit | `f6bf404` — this tracking document, pushed to `origin/feature/libraryPages` |

## Workstream status table

| Workstream | Current status | Owner | Blocker | Required decision | Verification evidence | Final acceptance |
|---|---|---|---|---|---|---|
| Feature branch code (Stages 1–8) | Complete, pushed, preview green | Assistant | None | — | Vercel check-run `success` on `79b11db` | Not yet accepted |
| Production merge | Not started | Owner approval required | Everything below | Owner to approve launch | `main` still at `f9980d8` | Not started |
| Stage 5 Event insertion (6 new Events) | **Applied and verified 2026-07-23.** Live run created all 6 Events atomically in one transaction | Owner (ran the script locally via secure hidden-input credential entry) | None | — | `GET /api/events` confirmed: 26 total, all 6 target slugs present, no duplicates, 29 Exercises unchanged, backend health `200 OK` | **Accepted** |
| Stage 6 media migration | **Applied and verified 2026-07-23** via a narrowly scoped PR (#1, schema + migrations only) merged to `main`, deployed automatically by Render | Assistant (scoped PR) + Owner (merge approval) | None | — | Render deploy `dep-d9ges977f7vs73f3k9vg` Live at commit `af1998a`; live API responses now carry `imageUrl` etc. as `null` | **Accepted** |
| Stage 7 editorial migration | **Applied and verified 2026-07-23** — same scoped PR/deploy as Stage 6 | Assistant + Owner | None | — | Same deploy; live API responses now carry `authorName`/`sources`/`relatedExerciseSlugs` etc. as `null`/`[]` | **Accepted** |
| Arm-Over-Arm Rope Pull Exercise description drift | **Resolved and confirmed** — production description now exactly matches the approved Exercise wording | — | None | — | Live `GET /api/exercises` checked directly: description field matches the approved value verbatim | **Accepted** |
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
| Handover documentation pack | **Handover blocker** |
| Client final signoff | **Handover blocker** |
| Sanity CMS phased rollout | **Future enhancement** (if Section 9 decision defers it) |
| CPD subscription / organisation access | **Future enhancement** |
