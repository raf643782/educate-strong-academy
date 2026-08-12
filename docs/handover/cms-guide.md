# Knowledge Hub CMS Guide

This document explains the current state of the Knowledge Hub, what Sanity CMS is, and the steps required to activate it.

---

## Current state

**SANITY FRONTEND INTEGRATION STAGED / LIVE SANITY CUTOVER NOT PERFORMED / 21 HARDCODED ARTICLES REMAIN PUBLIC SOURCE**

The Knowledge Hub at `/knowledge` currently serves **21 hardcoded articles** stored in the frontend codebase at `frontend/src/data/knowledgeArticles.ts`. To add, edit, or remove one of these articles, a developer must edit that file, commit, and redeploy the frontend.

This system works but is not owner-editable without developer involvement.

---

## What Sanity is

Sanity is a headless CMS — a web-based editing tool that lets non-developers create and publish articles through a browser interface called Sanity Studio. Once activated, the Knowledge Hub would pull live content from Sanity instead of the hardcoded file.

A separate Sanity integration was developed and is ready to activate. As of the handover:

- The Sanity client library and all supporting code is installed and present in the codebase
- The code falls back safely — if Sanity is not configured, the existing 21 hardcoded articles continue to serve normally
- A preview route exists at `/knowledge-hub-preview` where you can see how Sanity articles render before making them live

---

## How many articles are in the Sanity integration

The Sanity integration covers **9 articles** with a distinct editorial focus from the 21 hardcoded articles. These are new, Sanity-backed articles with:
- Portable Text body content (richer formatting — headings, bullet lists, bold, links)
- FAQ sections
- Citations/references
- Pathway grouping

The 9 approved Sanity slugs are defined in `frontend/src/lib/approvedKnowledgeArticles.ts`.

There is also **1 article permanently excluded** from public access (`is-strongman-safe-for-children` — excluded pending qualified health/safety review). This exclusion is hard-coded and enforced at the code level, not just in Sanity's publishing status.

---

## What is needed to activate Sanity

### Step 1 — Verify access to the existing Sanity project

An existing Sanity project has been identified: **Project ID `ut2wo29d`**.

1. Go to https://manage.sanity.io/projects/ut2wo29d and log in with the Educate Strong Sanity account
2. If you have access: use this project — note the Project ID (`ut2wo29d`) and the dataset name (default: `production`)
3. If access cannot be recovered or ownership cannot be transferred to the company account: only then create a replacement project — go to https://sanity.io, create a new project, note the new Project ID, and provide it to the developer so the configuration is updated

**Do not create a second Sanity project if the existing `ut2wo29d` project is accessible.** Using a replacement project requires the developer to verify all Studio schemas and approved slug manifest references are updated before any content is loaded.

### Step 2 — Set the environment variables in Vercel

In the Vercel dashboard for the `educate-strong-academy` project:

1. Go to Settings → Environment Variables
2. Add `VITE_SANITY_PROJECT_ID` = the Project ID from Step 1 (e.g. `ut2wo29d`)
3. Add `VITE_SANITY_DATASET` = `production`
4. Add `VITE_SANITY_API_VERSION` = `2024-01-01`
5. Trigger a new deployment

### Step 3 — Test the preview

Once the variables are deployed, log in to the website with an **ADMIN account**, then go to `/knowledge-hub-preview` and confirm that:
- The page loads without a "not configured" error
- If articles exist in Sanity, they appear here

**Access control**: `/knowledge-hub-preview` and `/knowledge-hub-preview/:slug` are protected by role-based access — only users with the ADMIN role can view them. Log in at `/login` with an ADMIN account before visiting the preview URL.

**Search engine protection**: The preview routes are also marked `noindex` and listed in `robots.txt` as `Disallow`, so they will not appear in Google search results even if a search engine bot encounters the URL.

### Step 4 — Load content into Sanity Studio

**Sanity Studio finding**: A Sanity Studio project with full schema exists in the `sanity/` directory of the `feature-sanity-stage5a-safety` branch. The schema defines `knowledgeArticle` and `pathway` document types with all required fields (`body`, `faq`, `publicReferences`, SEO fields). The project ID `ut2wo29d` is referenced in `docs/SANITY_ACCESS_AND_CONTENT_BOUNDARY.md` on that branch.

**To use the existing Studio**: port the `sanity/` directory from `feature-sanity-stage5a-safety` into this branch, then set `SANITY_STUDIO_PROJECT_ID=ut2wo29d` and `SANITY_STUDIO_DATASET=production` in a `sanity/.env.local` file (never commit these). Run the Studio locally with `cd sanity && npx sanity dev`.

**SANITY EDITORIAL STUDIO HANDOVER STILL REQUIRES DEVELOPER SETUP** — the Studio files exist in a feature branch and have not been ported to `main`. A developer must complete this step before the owner can create content.

**Owner action**: Go to `manage.sanity.io/projects/ut2wo29d` to verify access to this Sanity project. If you cannot access it, create a new project and provide the new Project ID to the developer.

A developer will:

- Port the Studio from the feature branch (or create a new one from the schema)
- Create and publish articles using the 9 approved slugs defined in `frontend/src/lib/approvedKnowledgeArticles.ts`

**Hard requirement**: Before the live Sanity cutover, every one of the 21 existing hardcoded Knowledge Hub URLs must have a documented migration decision. See `docs/handover/knowledge-sanity-migration-map.md`. The cutover must not happen until all 21 decisions are resolved — otherwise existing prerendered pages will 404 after the switch.

### Step 5 — Cutover the live Knowledge Hub (developer task)

When you are satisfied with how articles look in the preview, a developer can complete the cutover:

1. Replace `KnowledgeHub.tsx` with the Sanity-backed version (removes the hardcoded article list)
2. Replace `KnowledgeArticlePage.tsx` with the Sanity-backed version
3. Update `entry-server.tsx` and `prerender.mjs` to use the 9 approved Sanity slugs for the sitemap
4. Trigger a production deployment

**This is a permanent change.** The 21 hardcoded articles will no longer be served after cutover. Before doing this, confirm all 9 Sanity articles are live and the hardcoded articles that overlap are either migrated or intentionally retired.

---

## Owner action required before Sanity can go live

| # | Action | Who | Notes |
|---|---|---|---|
| 1 | Verify access to Sanity project `ut2wo29d` at `manage.sanity.io/projects/ut2wo29d` | Educate Strong | Use existing project if accessible; only create a replacement if access cannot be recovered |
| 2 | Set 3 Sanity env vars in Vercel (`VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_SANITY_API_VERSION`) | Developer or Educate Strong | See Step 2 above |
| 3 | Port Sanity Studio from `feature-sanity-stage5a-safety` branch (developer task) and load articles | Developer + Educate Strong content team | See Step 4 above |
| 4 | Review articles at `/knowledge-hub-preview` — **must log in with ADMIN account first** | Educate Strong | Confirm content looks right before going live |
| 5 | Resolve all 21 URL migration decisions in `knowledge-sanity-migration-map.md` | Educate Strong + Developer | Must be completed before cutover |
| 6 | Authorise cutover | Educate Strong | Cutover must preserve KEEP/KEEP—DIFFERENT SCOPE articles |

---

## Can we launch without Sanity?

**Yes.** The current system (21 hardcoded articles) works and is already live. Sanity is a post-launch enhancement that improves editorial flexibility. It is not required for launch.

---

## If Sanity is not needed

If the decision is made to keep the hardcoded article system permanently, no action is needed. The Sanity code is present but dormant — it adds no overhead to the running site.

To remove the Sanity code cleanly (optional, cosmetic):
- Remove `@sanity/client` and `@portabletext/react` from `frontend/package.json`
- Delete `frontend/src/lib/sanity.ts` and `frontend/src/lib/approvedKnowledgeArticles.ts`
- Delete the three components in `frontend/src/components/knowledge/`
- Delete the two preview pages and their routes in `App.tsx`
- Remove the Sanity domains from `vercel.json`'s `connect-src`
