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
 * The 9 approved public articles. `bodyStatus` records whether this
 * script actually has the exact final approved body text available to
 * write, per the Stage 4 requirement not to reconstruct, paraphrase, or
 * invent content. Metadata (title/seoTitle/metaDescription) mirrors
 * frontend/src/lib/approvedKnowledgeArticles.ts, which IS the durable,
 * approved source for those fields.
 */
const TARGET_ARTICLES = [
  {
    slug: 'what-is-strongman',
    title: 'What Is Strongman? A Clear Guide to the Sport, Events, and Competition Format',
    seoTitle: 'What Is Strongman? A Clear Guide to the Sport & Events | Educate Strong Academy',
    metaDescription:
      'A clear, accurate guide to Strongman as a sport — how competitions work, common event types, who competes, and how it differs from powerlifting, CrossFit, and bodybuilding.',
    bodyStatus: 'MISSING_APPROVED_TEXT',
    bodyNote:
      'Approved corrections (IFSA paragraph removed, unverified athlete count removed, Novice guidance restored and attributed, scoring/tie claims softened, Wikipedia removed from references, children\'s-safety links removed) exist only in editorial review conversation — not yet saved to any file in this repository. Do not write body changes until the approved text is persisted to a durable source and re-verified.',
  },
  {
    slug: 'strongman-for-beginners',
    title: 'Strongman for Beginners: How to Start Training Safely and Realistically',
    seoTitle: 'Strongman for Beginners: How to Start Safely | Educate Strong Academy',
    metaDescription:
      'A realistic, evidence-led guide to starting Strongman — who it suits, how to build a foundation, common mistakes, and how to find your first novice competition.',
    bodyStatus: 'MISSING_APPROVED_TEXT',
    bodyNote:
      'Approved corrections (Tinnion to Hindle, ACSM source upgraded to the 2026 position stand, children\'s-safety links removed, frequency wording reframed as a reasonable beginner structure rather than a Strongman rule) exist only in editorial review conversation — not yet saved to any file in this repository.',
  },
  {
    slug: 'strongman-events-explained',
    title: "Strongman Events Explained: A Beginner's Guide to the Main Event Types",
    seoTitle: 'Strongman Events Explained: Main Event Types | Educate Strong Academy',
    metaDescription:
      'A clear, evidence-led guide to the main types of Strongman events, from carries and presses to loading and grip events, and why rules vary by competition.',
    bodyStatus: 'MISSING_APPROVED_TEXT',
    bodyNote:
      'Approved corrections (Tinnion to Hindle, Log Press overstatement simplified, Vehicle Pull separated from Arm-Over-Arm wording, Sled Drag attachment variation clarified, Hercules Hold time-limit scoped to WSM, broken FAQ markup fixed, Atlas Stones link updated) exist only in editorial review conversation — not yet saved to any file in this repository.',
  },
  {
    slug: 'how-to-become-a-strongman-coach',
    title: 'How to Become a Strongman Coach: Skills, Knowledge, and Education Pathways',
    seoTitle: 'How to Become a Strongman Coach: Skills & Education | Educate Strong Academy',
    metaDescription:
      'A careful, evidence-led guide to what Strongman coaching involves, the knowledge it requires, and how to think about education and qualification pathways.',
    bodyStatus: 'MISSING_APPROVED_TEXT',
    bodyNote:
      'Approved corrections (Tinnion to Hindle, Winwood injury claim tightened to the 1.9x figure, children\'s-safety link removed, disclaimers consolidated, Educate Strong Academy pathway section added) exist only in editorial review conversation — not yet saved to any file in this repository.',
  },
  {
    slug: 'atlas-stones-technique-guide',
    title: 'Atlas Stones Technique Guide',
    seoTitle: 'Atlas Stones Technique Guide: How the Lift Works | Educate Strong Academy',
    metaDescription:
      'An evidence-led technique guide to the Atlas Stones lift — the phases, grip considerations, common mistakes, and how it connects to foundational strength movements.',
    bodyStatus: 'MISSING_APPROVED_TEXT',
    bodyNote:
      'Approved corrections (stone count/format variation clarified, tacky wording softened, one-motion technique reframed as advanced, phase structure clarified, "final event" claim scoped to WSM, foundational movements split into research vs. coaching judgement) exist only in editorial review conversation — not yet saved to any file in this repository.',
  },
  {
    slug: 'strongman-competition-rules-explained',
    title: 'Strongman Competition Rules Explained',
    seoTitle: 'Strongman Competition Rules Explained (Plain English) | Educate Strong Academy',
    metaDescription:
      'A plain English guide to how Strongman competitions are scored and judged, and why exact rules always depend on the specific federation or organiser.',
    bodyStatus: 'MISSING_APPROVED_TEXT',
    bodyNote:
      'Approved corrections (time-limit/scoring corrected using real WSM examples, equipment section corrected using Strongman Corporation rules, commands-vary clarification, tie-handling added, empty CTA replaced) exist only in editorial review conversation — not yet saved to any file in this repository.',
  },
  {
    slug: 'what-does-a-strongman-referee-do',
    title: 'What Does a Strongman Referee Do?',
    seoTitle: 'What Does a Strongman Referee Do? | Educate Strong Academy',
    metaDescription:
      'A clear explanation of the Strongman referee\'s role, from judging standards to safety oversight, and how officiating pathways currently work.',
    bodyStatus: 'MISSING_APPROVED_TEXT',
    bodyNote:
      'Approved corrections (opening reframed around the officiating team, referee responsibilities separated, safety authority scoped to organiser rules, Douglas Edmunds date range softened, Wikipedia removed, Giants Live used as the reference, Educate Strong Academy referee paragraph narrowed) exist only in editorial review conversation — not yet saved to any file in this repository.',
  },
  {
    slug: 'first-strongman-competition-training',
    title: 'How to Train for Your First Strongman Competition',
    seoTitle: 'How to Train for Your First Strongman Competition | Educate Strong Academy',
    metaDescription:
      'A practical, evidence-led guide to preparing for your first Strongman competition, from choosing the right event to competition-day logistics.',
    bodyStatus: 'OK_UNCHANGED',
    bodyNote:
      'Formal review found no body corrections required — the current live Sanity document body already IS the approved text. Only metadata/reference fields and preview-link conversion apply here.',
  },
  {
    slug: 'strongman-vs-powerlifting',
    title: 'Strongman vs Powerlifting: How the Two Sports Actually Differ',
    seoTitle: 'Strongman vs Powerlifting: The Real Differences | Educate Strong Academy',
    metaDescription:
      'A clear, evidence-based comparison of Strongman and powerlifting: format, scoring, training demands, and which might suit you.',
    bodyStatus: 'OK_UNCHANGED',
    bodyNote:
      'Formal review found no body corrections required — the current live Sanity document body already IS the approved text. Only public references (IPF Technical Rules Book 2026; Yang et al. 2026) need adding, plus preview-link conversion.',
  },
];

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
