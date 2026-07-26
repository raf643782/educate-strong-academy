/**
 * Approved Knowledge Hub article update script.
 *
 * DRY RUN IS THE DEFAULT. Write mode requires BOTH the --write flag AND
 * WRITE_MODE_ENABLED set to `true` in the code below — the flag alone does
 * nothing. WRITE_MODE_ENABLED is `false` by default; re-enable it
 * deliberately, and re-run the full pre-write checklist, before any future
 * write.
 *
 * Usage:
 *   node scripts/update-approved-knowledge-articles.mjs            # dry run (default)
 *   node scripts/update-approved-knowledge-articles.mjs --write    # write mode (inert unless WRITE_MODE_ENABLED is also true)
 *
 * Dry run uses a public, read-only client (no token — same pattern as
 * frontend/src/lib/sanity.ts) since it only ever reads. Write mode instead
 * authenticates through the Sanity CLI's own logged-in session (never a
 * stored token), and must be run via:
 *   npx sanity exec scripts/update-approved-knowledge-articles.mjs --with-user-token -- --write
 *
 * Targets ONLY the 9 approved public slugs (must match
 * frontend/src/lib/approvedKnowledgeArticles.ts). is-strongman-safe-for-children
 * is explicitly excluded and never appears in TARGET_ARTICLES — write mode
 * only ever updates its `status` field, never its content.
 */

import { createClient } from '@sanity/client';
import sanityCli from 'sanity/cli';
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const { getCliClient } = sanityCli;

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

// Hard guard: write mode requires this to be deliberately flipped to `true`
// in the code, in addition to the --write flag — the flag alone is never
// enough. Flipped back to `false` immediately after the Stage 5 write run;
// re-enable deliberately (and re-run the full pre-write checklist) for any
// future write.
const WRITE_MODE_ENABLED = false;

// Write mode authenticates via the Sanity CLI's own logged-in user session
// (never a stored token) — only resolved when actually writing, since it
// requires running through `sanity exec ... --with-user-token`.
const writeClient = requestedWrite && WRITE_MODE_ENABLED ? getCliClient({ apiVersion: '2024-01-01' }) : null;

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
  const docs = await client.fetch(
    `*[_type == "knowledgeArticle"]{
      _id, _type, title, "slug": slug.current, status, seoTitle, metaDescription,
      body, faq, cta, pathway, clusterOrder, publicReferences,
      author, reviewedBy, publishedDate, lastReviewedDate
    }`
  );
  const path = new URL('../backups/knowledge-hub-pre-write-backup.json', import.meta.url);
  writeFileSync(path, JSON.stringify(docs, null, 2));
  return { docs, path: path.pathname };
}

function newKey() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

/** Converts one `{{label|href}}` inline link (if any) plus surrounding plain text into Portable Text spans/markDefs. */
function parseInlineLinks(text) {
  const children = [];
  const markDefs = [];
  const regex = /\{\{([^|{}]+)\|([^{}]+)\}\}/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      children.push({ _type: 'span', _key: newKey(), text: text.slice(lastIndex, match.index), marks: [] });
    }
    const markKey = newKey();
    markDefs.push({ _key: markKey, _type: 'link', href: match[2] });
    children.push({ _type: 'span', _key: newKey(), text: match[1], marks: [markKey] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    children.push({ _type: 'span', _key: newKey(), text: text.slice(lastIndex), marks: [] });
  }
  return { children, markDefs };
}

function sourceBodyToPortableText(body) {
  return body.map((entry) => {
    const { children, markDefs } = parseInlineLinks(entry.text);
    return {
      _key: newKey(),
      _type: 'block',
      style: entry.type === 'h2' || entry.type === 'h3' ? entry.type : 'normal',
      children,
      markDefs,
    };
  });
}

function sourceFaqToSanity(faq) {
  return (faq || []).map((item) => ({
    _key: newKey(),
    _type: 'faqItem',
    question: item.question,
    answer: item.answer,
  }));
}

function sourceReferencesToSanity(refs) {
  return (refs || []).map((r) => {
    const entry = {
      _key: newKey(),
      _type: 'publicReference',
      authorsOrOrganisation: r.authorsOrOrganisation,
      title: r.title,
      publicationOrSource: r.publicationOrSource,
    };
    if (r.year) entry.year = r.year;
    if (r.doi) entry.doi = r.doi;
    if (r.url) entry.url = r.url;
    if (r.accessDate) entry.accessDate = r.accessDate;
    if (r.notesForDisplay) entry.notesForDisplay = r.notesForDisplay;
    return entry;
  });
}

/**
 * Patches (never deletes/recreates) the 9 approved article documents from
 * their source files, preserving existing _id. Creates a document only if
 * an approved slug is genuinely missing. Deliberately does NOT touch
 * `pathway` or `clusterOrder` — neither was part of any approved
 * correction, and pathway is a reference field not worth touching without
 * separate review. Explicitly unsets author/reviewedBy/publishedDate/
 * lastReviewedDate rather than leaving them, since all 9 source files leave
 * these blank and the live documents carry an accidental 2026-07-24 date.
 */
async function writeApprovedArticles(bySlug) {
  const results = [];
  for (const target of TARGET_ARTICLES) {
    const source = target.source;
    const existing = bySlug[target.slug]?.[0];
    const patchFields = {
      title: source.title,
      h1: source.h1,
      seoTitle: source.seoTitle,
      metaDescription: source.metaDescription,
      body: sourceBodyToPortableText(source.body),
      faq: sourceFaqToSanity(source.faq),
      cta: { ctaText: source.cta.ctaText, destinationUrl: source.cta.destinationUrl },
      publicReferences: sourceReferencesToSanity(source.publicReferences),
      status: 'published',
    };

    if (existing) {
      await writeClient
        .patch(existing._id)
        .set(patchFields)
        .unset(['author', 'reviewedBy', 'publishedDate', 'lastReviewedDate'])
        .commit();
      console.log(`  ✓ patched ${target.slug} (${existing._id})`);
      results.push({ slug: target.slug, action: 'patched', id: existing._id });
    } else {
      const created = await writeClient.create({
        _type: 'knowledgeArticle',
        slug: { _type: 'slug', current: source.slug },
        ...patchFields,
      });
      console.log(`  ✓ created ${target.slug} (${created._id}) — this slug did not exist before this run`);
      results.push({ slug: target.slug, action: 'created', id: created._id });
    }
  }
  return results;
}

/** Sets Article 5's status to inReview. Status only — never touches body/content, never touches its public exposure (which is governed solely by the frontend allow-list, not this field). */
async function writeExcludedArticleStatus(bySlug) {
  const doc = bySlug[EXCLUDED_SLUG]?.[0];
  if (!doc) {
    console.log(`  ⚠ ${EXCLUDED_SLUG} not found — skipping status update.`);
    return null;
  }
  await writeClient.patch(doc._id).set({ status: 'inReview' }).commit();
  console.log(`  ✓ set ${EXCLUDED_SLUG} (${doc._id}) status to inReview`);
  return { slug: EXCLUDED_SLUG, id: doc._id, newStatus: 'inReview' };
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

  const writeModeActive = requestedWrite && WRITE_MODE_ENABLED;

  // ── 5. Backup logic status ──
  console.log('\n=== Backup logic ===');
  if (!writeModeActive) {
    console.log('Present (backupAllDocuments() in this script) but NOT invoked in dry run.');
    console.log('Write mode will call it first and write the result to sanity/backups/knowledge-hub-pre-write-backup.json before any patch.');
  }

  if (!writeModeActive) {
    console.log('\nDry run complete. No Sanity data was changed.');
    return;
  }

  // ── 6. WRITE MODE ──
  console.log('\n=== WRITE MODE ===');
  const { path: backupPath } = await backupAllDocuments();
  console.log(`Pre-write backup saved: ${backupPath}`);

  console.log('\nPatching approved articles...');
  const patchResults = await writeApprovedArticles(bySlug);

  console.log('\nUpdating excluded article status...');
  const excludedResult = await writeExcludedArticleStatus(bySlug);

  console.log('\nWrite complete.');
  console.log(`Articles patched/created: ${patchResults.length}`);
  console.log(`Excluded article status update: ${excludedResult ? `${excludedResult.slug} → ${excludedResult.newStatus}` : 'skipped'}`);
}

run().catch((err) => {
  console.error('Run failed:', err);
  process.exit(1);
});
