# Educate.Strong Academy — Launch Readiness Tracker

Living document. Updated at the end of every programme section. No credentials, connection strings, or secret values are ever recorded in this file — only status, ownership and evidence references.

**Last updated:** Section 2 (Credential Rotation and Environment Security) — 2026-07-22.

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
| Stage 5 Event insertion (6 new Events) | Prepared, **not confirmed applied to production** | Owner (script is owner-run only) | Needs a dry run + live run of `stage5-event-insert.ts` against production | Owner to run | None yet — production still reports 20 Events per the brief | Not started |
| Stage 6 media migration | Prepared, **not confirmed applied to production** | Owner | Same as above, via `prisma migrate deploy` | Owner to run | Not verified this session (would require production DB access) | Not started |
| Stage 7 editorial migration | Prepared, **not confirmed applied to production** | Owner | Same as above | Owner to run | Not verified this session | Not started |
| Arm-Over-Arm Rope Pull Exercise description drift | One-time correction script prepared (`stage4-correction-arm-over-arm-rope-pull.ts`), **not confirmed run** | Owner | Needs a dry run + live run | Owner to run, then re-run Stage 4 dry run to confirm zero drift | Not verified this session | Not started |
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

## Launch blocker table

| Item | Label |
|---|---|
| Production database credential rotation | ~~Critical blocker~~ **Resolved 2026-07-22** |
| Neon vs Render-native database identity confirmation | ~~Critical blocker~~ **Resolved 2026-07-22** — production is Neon; unused `educate-strong-db` Render resource left in place pending owner decision |
| Stage 5/6/7 production alignment (Events, media schema, editorial schema) | **Launch blocker** |
| Arm-Over-Arm Rope Pull Exercise description drift resolution | **Launch blocker** |
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
