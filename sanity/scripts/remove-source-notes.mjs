/**
 * HISTORICAL / INACTIVE — Sanity privacy cleanup, already run successfully.
 *
 * As of Stage 5A, `sourceNotes` has been removed from the `knowledgeArticle`
 * schema entirely (see docs/KNOWLEDGE_HUB_SOURCE_NOTES_POLICY.md) — it is no
 * longer possible to populate the field at all, so this script has no
 * further purpose against the current schema. Kept only as a record of the
 * one-off cleanup it already performed (confirmed: 0 documents had the field
 * populated as of the Stage 5A check). Do not re-run against this schema —
 * `sourceNotes` no longer exists as a field, so `client.patch(...).unset(...)`
 * would be a no-op at best.
 *
 * Original usage (when the field still existed):
 *   npx sanity exec scripts/remove-source-notes.mjs --with-user-token
 *
 * The Sanity dataset is public, so any field on a published document can be
 * queried directly by anyone — excluding `sourceNotes` from the frontend's
 * GROQ projection does not make it private. This script unset `sourceNotes`
 * on every knowledgeArticle document. It did not touch body, faq, cta, SEO
 * fields, pathway references, or internalLinks.
 */

import sanityCli from 'sanity/cli';
const { getCliClient } = sanityCli;

const client = getCliClient();

async function run() {
  const docs = await client.fetch(
    `*[_type == "knowledgeArticle" && defined(sourceNotes)]{ _id, "slug": slug.current }`
  );

  console.log(`Found ${docs.length} knowledgeArticle document(s) with populated sourceNotes.`);

  for (const doc of docs) {
    await client.patch(doc._id).unset(['sourceNotes']).commit();
    console.log(`  ✓ removed sourceNotes from ${doc.slug} (${doc._id})`);
  }

  console.log('\nCleanup complete.');
}

run().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
