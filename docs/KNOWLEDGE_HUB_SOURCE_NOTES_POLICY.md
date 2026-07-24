# Knowledge Hub — Source Notes Policy

Internal implementation note on why `sourceNotes` must never be populated on a `knowledgeArticle` document while the Sanity dataset is public.

**Last updated:** Sanity Stage 2 privacy cleanup — 2026-07-24.

---

### What source notes are

`sourceNotes` is an editorial record kept alongside each Knowledge Hub article during research and writing: which claim came from which source, the source's type (peer-reviewed, official federation, recognised body, orientation-only, etc.), and a confidence rating. It exists to let an editor audit why a sentence in the article says what it says. It is not reader-facing content — it was never meant to describe or explain anything to a site visitor.

### Why it cannot live in a public Sanity document

The Educate Strong Academy Sanity project (`ut2wo29d`, dataset `production`) is a **public** dataset. Any field on a published document — including one the frontend's GROQ projection deliberately excludes (see `frontend/src/lib/sanity.ts`) — can be queried directly by anyone with the project ID and dataset name, using Sanity's own API (e.g. `https://ut2wo29d.apicdn.sanity.io/v2024-01-01/data/query/production?query=...`). A frontend projection is not an access-control boundary; it only filters what one particular client asks for. Excluding `sourceNotes` from the frontend query stops the website from *displaying* it, but does nothing to stop it from being *readable* by direct API access.

Some entries in the source notes referenced things not intended for public exposure — for example, notes about deliberately unlinked terms, direct references to internal code paths (`frontend/src/App.tsx`, `backend/prisma/seed.ts`), and editorial reasoning about content decisions. None of that belongs in a publicly queryable document.

### What to do instead

- Do not populate `sourceNotes` on any `knowledgeArticle` document for as long as the dataset remains public.
- If source/claim auditing needs to continue, keep it in a private internal document (e.g. a private doc in this `docs/` folder, or an internal spreadsheet/wiki) outside of Sanity.
- If it becomes a genuine requirement to store this inside Sanity itself, that requires either a private dataset (not the current public `production` dataset) or a document type gated by dataset-level access rules — not a schema field on a document type that's otherwise meant to be public.

### Current state

As of the Stage 2 privacy cleanup, `sourceNotes` has been unset on all 10 published `knowledgeArticle` documents. The schema field itself still exists (for internal editorial workflow), but its description now carries this warning directly in the Studio UI. Nothing else on these documents — body, FAQ, CTA, SEO fields, pathway references, or internal links — was changed.
