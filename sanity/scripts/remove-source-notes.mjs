/**
 * Sanity privacy cleanup. Executed via:
 *   npx sanity exec scripts/remove-source-notes.mjs --with-user-token
 *
 * The Sanity dataset is public, so any field on a published document can be
 * queried directly by anyone — excluding `sourceNotes` from the frontend's
 * GROQ projection does not make it private. This script unsets `sourceNotes`
 * on every knowledgeArticle document. It does not touch body, faq, cta, SEO
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
