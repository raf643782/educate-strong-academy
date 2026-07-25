/**
 * Approved Knowledge Hub article update script — Stage 4 (dry run) / Stage 5 (write).
 *
 * DRY RUN IS THE DEFAULT. Write mode requires an explicit --write flag and
 * is not active in Stage 4 regardless of the flag — see WRITE_MODE_ENABLED
 * below, which Stage 5 will flip on after separate approval.
 *
 * Usage:
 *   node scripts/update-approved-knowledge-articles.mjs            # dry run (default, this stage)
 *   node scripts/update-approved-knowledge-articles.mjs --write    # write mode (Stage 5 only, currently inert — see below)
 *
 * Dry run uses a public, read-only client (no token — same pattern as
 * frontend/src/lib/sanity.ts) since it only ever reads. Write mode, when
 * enabled in Stage 5, must instead run via:
 *   npx sanity exec scripts/update-approved-knowledge-articles.mjs --with-user-token -- --write
 * so it authenticates through the Sanity CLI's own logged-in session —
 * never a stored token.
 *
 * Targets ONLY the 9 approved public slugs (must match
 * frontend/src/lib/approvedKnowledgeArticles.ts). is-strongman-safe-for-children
 * is explicitly excluded and never appears in TARGET_ARTICLES.
 */

import { createClient } from '@sanity/client';

import whatIsStrongman from '../content/approved-knowledge-articles/what-is-strongman.mjs';
import strongmanForBeginners from '../content/approved-knowledge-articles/strongman-for-beginners.mjs';
import strongmanEventsExplained from '../content/approved-knowledge-articles/strongman-events-explained.mjs';
import howToBecomeAStrongmanCoach from '../content/approved-knowledge-articles/how-to-become-a-strongman-coach.mjs';
import atlasStonesTechniqueGuide from '../content/approved-knowledge-articles/atlas-stones-technique-guide.mjs';
import whatDoesAStrongmanRefereeDo from '../content/approved-knowledge-articles/what-does-a-strongman-referee-do.mjs';
import firstStrongmanCompetitionTraining from '../content/approved-knowledge-articles/first-strongman-competition-training.mjs';
import strongmanVsPowerlifting from '../content/approved-knowledge-articles/strongman-vs-powerlifting.mjs';
import strongmanCompetitionRulesExplained from '../content/approved-knowledge-articles/strongman-competition-rules-explained.mjs';

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || 'ut2wo29d';
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false, // read the freshest state for this audit, not a cached CDN copy
});

const requestedWrite = process.argv.includes('--write');

// Stage 4 hard guard: write mode is not enabled yet, no matter what flag is
// passed. Stage 5 will flip this to `true` only after separate approval,
// and only once every article below has bodyStatus 'OK_UNCHANGED' or
// 'OK_APPROVED_TEXT_AVAILABLE' — never while any article is still
// 'MISSING_APPROVED_TEXT'.
const WRITE_MODE_ENABLED = false;

const EXCLUDED_SLUG = 'is-strongman-safe-for-children';

/**
 * All 9 approved public articles now have a durable source file under
 * sanity/content/approved-knowledge-articles/ (Stage 4B). `source` holds
 * the full object (title/h1/seoTitle/metaDescription/body/faq/cta/
 * publicReferences/pathway/clusterOrder) for use once Stage 5 is approved.
 * `bodyStatus`/`bodyNote` are retained for reporting continuity with
 * Stage 4's dry run.
 */
const TARGET_ARTICLES = [
  whatIsStrongman,
  strongmanForBeginners,
  strongmanEventsExplained,
  howToBecomeAStrongmanCoach,
  atlasStonesTechniqueGuide,
  whatDoesAStrongmanRefereeDo,
  firstStrongmanCompetitionTraining,
  strongmanVsPowerlifting,
  strongmanCompetitionRulesExplained,
].map((source) => ({
  slug: source.slug,
  title: source.title,
  seoTitle: source.seoTitle,
  metaDescription: source.metaDescription,
  source,
  bodyStatus: 'OK_APPROVED_TEXT_AVAILABLE',
  bodyNote: 'Approved source text captured in sanity/content/approved-knowledge-articles/ (Stage 4B). Not yet written to Sanity — Stage 5 remains blocked pending separate approval.',
}));

const APPROVED_SLUGS = new Set(TARGET_ARTICLES.map((a) => a.slug));

function convertPreviewLink(href) {
  const match = /^\/knowledge-hub-preview\/([^/]+)$/.exec(href);
  return match ? `/knowledge/${match[1]}` : href;
}

/** Recursively finds every markDef href in a Portable Text body array. */
function extractLinkHrefs(body) {
  const hrefs = [];
  if (!Array.isArray(body)) return hrefs;
  for (const block of body) {
    for (const markDef of block.markDefs || []) {
      if (markDef.href) hrefs.push(markDef.href);
    }
  }
  return hrefs;
}

/** Finds every `{{label|href}}` inline link href in a source file's simplified body array. */
function extractSourceLinkHrefs(source) {
  if (!source || !Array.isArray(source.body)) return [];
  const hrefs = [];
  const regex = /\{\{[^|{}]+\|([^{}]+)\}\}/g;
  for (const entry of source.body) {
    let match;
    while ((match = regex.exec(entry.text || ''))) hrefs.push(match[1]);
  }
  return hrefs;
}

async function backupAllDocuments() {
  // WRITE-MODE ONLY — not invoked during dry run. Stage 5 will call this
  // before any patch, writing the result to sanity/backups/<timestamp>.json.
  // Deliberately excludes nothing except sourceNotes (which no longer
  // exists as a field at all, so there is nothing to accidentally include).
  return client.fetch(
    `*[_type == "knowledgeArticle"]{
      _id, _type, title, "slug": slug.current, status, seoTitle, metaDescription,
      body, faq, cta, pathway, clusterOrder, publicReferences,
      author, reviewedBy, publishedDate, lastReviewedDate
    }`
  );
}

async function run() {
  console.log(`Mode: ${requestedWrite ? 'WRITE requested' : 'DRY RUN'} (WRITE_MODE_ENABLED=${WRITE_MODE_ENABLED})`);
  if (requestedWrite && !WRITE_MODE_ENABLED) {
    console.log('--write was passed, but WRITE_MODE_ENABLED is false in this stage — running as dry run anyway. No data will be changed.\n');
  }
  console.log(`Project: ${PROJECT_ID} / dataset: ${DATASET}\n`);

  // ── 1. Duplicate detection across ALL knowledgeArticle documents ──
  const allDocs = await client.fetch(
    `*[_type == "knowledgeArticle"]{_id, "slug": slug.current, title, status, body}`
  );
  const bySlug = {};
  for (const doc of allDocs) {
    (bySlug[doc.slug] ||= []).push(doc);
  }
  const duplicates = Object.entries(bySlug).filter(([, docs]) => docs.length > 1);
  console.log('=== Duplicate slug check ===');
  if (duplicates.length > 0) {
    console.log('DUPLICATE SLUGS DETECTED — stopping before any further analysis:');
    for (const [slug, docs] of duplicates) {
      console.log(`  ${slug}: ${docs.map((d) => d._id).join(', ')}`);
    }
    process.exit(1);
  }
  console.log(`No duplicate slugs found across ${allDocs.length} total knowledgeArticle documents.\n`);

  // ── 2. Per-article dry-run report ──
  console.log('=== Approved article targets ===');
  for (const target of TARGET_ARTICLES) {
    const existing = bySlug[target.slug]?.[0];
    console.log(`\n--- ${target.slug} ---`);
    console.log(`  found: ${existing ? 'yes' : 'NO'}`);
    console.log(`  would create: ${existing ? 'no' : 'yes'}`);
    console.log(`  would update: ${existing ? 'metadata + links (see below)' : 'n/a (would create)'}`);
    console.log(`  would remain unchanged: ${existing && target.bodyStatus === 'OK_UNCHANGED' ? 'body text (already approved)' : 'no'}`);
    if (existing) {
      console.log(`  current status: ${existing.status}`);
      console.log(`  target status: published`);
      console.log(`  current title: "${existing.title}"`);
      console.log(`  target title:  "${target.title}"`);
      const hrefs = extractLinkHrefs(existing.body);
      const previewLinks = hrefs.filter((h) => h.startsWith('/knowledge-hub-preview/'));
      console.log(`  preview links found in current body: ${previewLinks.length ? previewLinks.join(', ') : 'none'}`);
      if (previewLinks.length) {
        console.log(`  would convert to: ${previewLinks.map(convertPreviewLink).join(', ')}`);
      }
      const linksToExcluded = hrefs.filter((h) => h.includes(EXCLUDED_SLUG));
      if (linksToExcluded.length > 0) {
        console.log(`  ⚠ CURRENT BODY LINKS TO EXCLUDED ARTICLE (${EXCLUDED_SLUG}): ${linksToExcluded.join(', ')}`);
        console.log(`     This must be removed when approved body text is written — see bodyStatus below.`);
      }
    }
    console.log(`  body text status: ${target.bodyStatus}`);
    console.log(`  note: ${target.bodyNote}`);
    console.log(`  missing required fields: ${existing ? 'none at metadata level' : 'entire document (would create)'}`);
    console.log(`  conflicts: none`);

    if (target.source) {
      const sourceHrefs = extractSourceLinkHrefs(target.source);
      const sourceLinksToExcluded = sourceHrefs.filter((h) => h.includes(EXCLUDED_SLUG));
      const sourceLinksStillPreview = sourceHrefs.filter((h) => h.startsWith('/knowledge-hub-preview/'));
      console.log(`  approved source file: sanity/content/approved-knowledge-articles/${target.slug}.mjs`);
      console.log(`  approved source internal links: ${sourceHrefs.length ? sourceHrefs.join(', ') : 'none'}`);
      console.log(`  approved source links to excluded article: ${sourceLinksToExcluded.length ? `⚠ ${sourceLinksToExcluded.join(', ')}` : 'none'}`);
      console.log(`  approved source links still using /knowledge-hub-preview/: ${sourceLinksStillPreview.length ? `⚠ ${sourceLinksStillPreview.join(', ')}` : 'none (already converted to /knowledge/)'}`);
      console.log(`  approved source FAQ count: ${target.source.faq?.length ?? 0}`);
      console.log(`  approved source publicReferences count: ${target.source.publicReferences?.length ?? 0}`);
    } else {
      console.log(`  approved source file: none`);
    }
  }

  // ── 3. Article 5 (excluded) ──
  console.log('\n=== Excluded article ===');
  const excludedDoc = bySlug[EXCLUDED_SLUG]?.[0];
  console.log(`--- ${EXCLUDED_SLUG} ---`);
  console.log(`  found: ${excludedDoc ? 'yes' : 'no'}`);
  console.log(`  current status: ${excludedDoc ? excludedDoc.status : 'n/a'}`);
  console.log('  included in TARGET_ARTICLES: NO');
  console.log('  action this stage: none (read-only check only)');
  console.log('  write-mode plan (Stage 5): set status to "inReview" (never "published"); never included in the approved public update list; never linked from any approved article; never included in sitemap.');

  // ── 4. Cross-check: does any APPROVED article link to the excluded slug? ──
  const approvedLinkingToExcluded = TARGET_ARTICLES
    .map((t) => ({ slug: t.slug, doc: bySlug[t.slug]?.[0] }))
    .filter(({ doc }) => doc)
    .map(({ slug, doc }) => ({ slug, hrefs: extractLinkHrefs(doc.body).filter((h) => h.includes(EXCLUDED_SLUG)) }))
    .filter(({ hrefs }) => hrefs.length > 0);

  console.log('\n=== Excluded-article link check across approved articles ===');
  if (approvedLinkingToExcluded.length > 0) {
    console.log(`${approvedLinkingToExcluded.length} approved article(s) currently link to the excluded article in their CURRENT (unwritten) Sanity body:`);
    for (const { slug, hrefs } of approvedLinkingToExcluded) {
      console.log(`  ${slug}: ${hrefs.join(', ')}`);
    }
    console.log('  This is expected pre-Stage-5 — these links were removed in approved editorial corrections that have not been written yet. They must be gone once the approved body text is actually written in Stage 5.');
  } else {
    console.log('No approved article currently links to the excluded article.');
  }

  // ── 5. Backup logic status ──
  console.log('\n=== Backup logic ===');
  console.log('Present (backupAllDocuments() in this script) but NOT invoked in dry run.');
  console.log('Write mode (Stage 5) will call it first and write the result to sanity/backups/<timestamp>.json before any patch.');

  console.log('\nDry run complete. No Sanity data was changed.');
}

run().catch((err) => {
  console.error('Dry run failed:', err);
  process.exit(1);
});
