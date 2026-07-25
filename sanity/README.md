# Sanity Schema Proposal (Stage 1)

This directory does **not** contain a working Sanity Studio. No Sanity project
has been created yet, and none is scaffolded here.

What this directory *is*: the exact schema definitions the Knowledge Hub
requires, written and ready to drop into a real Sanity Studio project once one
is initialised in Stage 2.

## Why a schema proposal and not a full Studio

Scaffolding a real Studio (`npm create sanity@latest`) creates its own
package.json, its own dependency tree, a dev server, and a project directory
that expects to be deployed to Sanity's hosting. Doing that speculatively,
before a Sanity project/organisation actually exists, would be premature and
would go beyond "the safest first implementation step" this stage is scoped
to. The schema below is deliberately framework-adjacent JS/TS, not tied to any
particular Studio version, so it can be copied in verbatim.

## Stage 2 setup (not done yet)

1. `npm create sanity@latest` in a new `sanity/` Studio project (this will
   want to take over this directory — that's fine, it's currently just docs
   and schema files, nothing depends on its current shape).
2. Copy `schemas/knowledgeArticle.ts` and `schemas/pathway.ts` into the new
   Studio's schema folder and register them in its schema index.
3. Set the real `projectId` / `dataset` in both the Studio config and in
   `frontend/.env.local` / `frontend/.env.production` (see the placeholder
   vars already added to `frontend/.env.local`).
4. Only then does `frontend/src/lib/sanity.ts` start returning real data —
   today, with no project id set, every query function in that file safely
   returns an empty result.

## Files in this directory

- `schemas/knowledgeArticle.ts` — the article content type
- `schemas/pathway.ts` — the pathway taxonomy type, referenced by articles

## The internal-only rule

`knowledgeArticle.sourceNotes` is editorial-only. It must never be requested
by the public frontend. This is enforced today at the query layer —
`frontend/src/lib/sanity.ts`'s GROQ projections use an explicit field list and
never include `sourceNotes` — but it's worth restating here too, since schema
and query code can drift apart over time if only one place documents the rule.

## Note on this repo specifically

As of this port (Stage 1), this frontend has its own build-time SSR/prerender
pipeline (`frontend/scripts/prerender.mjs`, `frontend/src/entry-server.tsx`)
that currently prerenders Exercise and Event Library detail pages only —
Knowledge Hub is not part of it. Worth deciding in Stage 2 whether Knowledge
Hub articles should join that same prerender pipeline once Sanity is live, for
the same SEO benefit Exercise/Event pages already get. Not addressed here.

## Note (Stage 1B)

A real Studio scaffold now exists in this directory (package.json,
sanity.config.ts, sanity.cli.ts, schemas/index.ts, tsconfig.json). It builds
and typechecks successfully, but is not yet connected to a real Sanity
project — projectId is read from `SANITY_STUDIO_PROJECT_ID`, currently unset.
See `.env.example` for what's needed once a real project exists.
