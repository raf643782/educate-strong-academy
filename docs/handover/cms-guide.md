# Knowledge Hub CMS Guide

This document explains the current state of the Knowledge Hub, what Sanity CMS is, and the steps required to activate it.

---

## Current state

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

### Step 1 — Create a Sanity project

1. Go to https://sanity.io and create an account (or log in)
2. Create a new project — name it "Educate Strong Academy" or similar
3. Note the **Project ID** (a short alphanumeric string like `abc123de`)
4. The default dataset name is `production` — keep this unless you have a specific reason to change it

### Step 2 — Set the environment variables in Vercel

In the Vercel dashboard for the `educate-strong-academy` project:

1. Go to Settings → Environment Variables
2. Add `VITE_SANITY_PROJECT_ID` = your Project ID from Step 1
3. Add `VITE_SANITY_DATASET` = `production`
4. Add `VITE_SANITY_API_VERSION` = `2024-01-01`
5. Trigger a new deployment

### Step 3 — Test the preview

Once the variables are deployed, go to `https://www.educatestrong.com/knowledge-hub-preview` (or the current domain) and confirm that:
- The page loads without a "not configured" error
- If articles exist in Sanity, they appear here

**This preview page is not linked anywhere in the navigation and is marked noindex**, so it will not appear in Google search results.

### Step 4 — Load content into Sanity Studio

The Sanity Studio (the editorial CMS interface) can be deployed separately or accessed via the Sanity dashboard. A developer will need to:

- Deploy or run the Sanity Studio project (in `sanity/` directory if present, otherwise create it from the schema)
- Create and publish articles using the 9 approved slugs defined in `frontend/src/lib/approvedKnowledgeArticles.ts`

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
| 1 | Create Sanity account and project | Educate Strong | Required before any Sanity content can be created |
| 2 | Set 3 Sanity env vars in Vercel | Developer or Educate Strong | See Step 2 above |
| 3 | Load and publish articles in Sanity Studio | Educate Strong (content team) | Developer may assist with Studio setup |
| 4 | Review articles at `/knowledge-hub-preview` | Educate Strong | Confirm content looks right before going live |
| 5 | Authorise cutover | Educate Strong | Cutover replaces the hardcoded article system |

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
