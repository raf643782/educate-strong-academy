# Knowledge Hub — Source Notes Policy

Internal implementation note on why `sourceNotes` must never be stored on a `knowledgeArticle` document while the Sanity dataset is public.

**Last updated:** Priority 5, Stage 5A — 2026-07-24. The `sourceNotes` field has been **removed from the schema entirely** (see "Current state" below); this document is kept as the permanent record of why, so the reasoning isn't lost and isn't reintroduced by a future schema change without someone reading this first.

---

### What source notes are

`sourceNotes` is an editorial record kept alongside each Knowledge Hub article during research and writing: which claim came from which source, the source's type (peer-reviewed, official federation, recognised body, orientation-only, etc.), and a confidence rating. It exists to let an editor audit why a sentence in the article says what it says. It is not reader-facing content — it was never meant to describe or explain anything to a site visitor.

### Why it cannot live in a public Sanity document

The Educate Strong Academy Sanity project (`ut2wo29d`, dataset `production`) is a **public** dataset. Any field on a published document — including one the frontend's GROQ projection deliberately excludes (see `frontend/src/lib/sanity.ts`) — can be queried directly by anyone with the project ID and dataset name, using Sanity's own API (e.g. `https://ut2wo29d.apicdn.sanity.io/v2024-01-01/data/query/production?query=...`). A frontend projection is not an access-control boundary; it only filters what one particular client asks for. Excluding `sourceNotes` from the frontend query stops the website from *displaying* it, but does nothing to stop it from being *readable* by direct API access.

Some entries in the source notes referenced things not intended for public exposure — for example, notes about deliberately unlinked terms, direct references to internal code paths (`frontend/src/App.tsx`, `backend/prisma/seed.ts`), and editorial reasoning about content decisions. None of that belongs in a publicly queryable document.

### What to do instead

- **`sourceNotes` must not exist as a field on any public Sanity document type, full stop** — not populated-but-hidden, not schema-present-but-empty. A schema field is a standing invitation for someone to populate it later without re-reading this policy.
- If source/claim auditing needs to continue, keep it in a private internal document (e.g. a private doc in this `docs/` folder, or an internal spreadsheet/wiki) outside of Sanity entirely.
- If it ever becomes a genuine requirement to store this inside Sanity itself, that requires either a private dataset (not the current public `production` dataset) or a document type gated by dataset-level access rules — not a schema field on a document type that's otherwise meant to be public. No private dataset has been created; this remains a future decision, not something in place today.

### Current state (Stage 5A — schema field removed)

Before making any schema change, a live read-only query against the real project (`ut2wo29d`, dataset `production`) confirmed: **10 `knowledgeArticle` documents total, 10 published, 0 with `sourceNotes` still defined.** Only counts were queried — no document content was fetched or displayed as part of this check.

With that confirmed, the `sourceNotes` field (and its `sourceNote` object type) has been removed from `sanity/schemas/knowledgeArticle.ts` entirely — it is no longer possible to populate it through Sanity Studio, because the field no longer exists in the schema. This is a schema-only change; no document content was touched (body, FAQ, CTA, SEO fields, pathway references, and internal links are all unaffected).

`sanity/scripts/remove-source-notes.mjs` (the one-off cleanup script referenced above) is retained as a **historical record only** — it has already run successfully against all 10 documents and has no further purpose now that the field doesn't exist in the schema at all. It is not deleted, in case its approach is useful reference for a similar future cleanup, but it should not be re-run against this schema.
