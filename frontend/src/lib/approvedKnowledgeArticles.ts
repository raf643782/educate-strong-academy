/**
 * Approved Knowledge Hub article manifest — the single public boundary for
 * Sanity-backed Knowledge Hub content.
 *
 * Why this exists: a Sanity document's own `status === "published"` field is
 * NOT sufficient to decide public exposure. As of this manifest's creation,
 * all 10 knowledgeArticle documents in Sanity (including the one below that
 * must stay excluded) share `status: "published"`. Any future listing page,
 * article route, sitemap generator, or related-content component must check
 * a slug against this explicit allow-list — never query Sanity by status
 * alone.
 *
 * This manifest reflects the final approved Knowledge Hub editorial review
 * only. It does not fetch anything from Sanity itself (see
 * frontend/src/lib/sanity.ts for the actual data-fetching layer) — it is the
 * static decision of *which* slugs that layer is allowed to serve publicly.
 *
 * This file deliberately does NOT import from frontend/src/data/knowledgeArticles.ts
 * (the old hardcoded Knowledge Hub data, 14 separate articles at /knowledge/:slug).
 * That system is unrelated and untouched by this manifest — importing from it
 * here would risk accidentally exposing those 14 articles through a helper
 * meant only for the 9 approved Sanity-backed ones.
 *
 * Scope notes:
 * - Only the 9 approved slugs below may ever be listed, routed to, or
 *   included in a sitemap for the Sanity-backed Knowledge Hub.
 * - The 14 other pre-existing hardcoded Knowledge Hub articles are a
 *   separate system entirely and are not migrated, referenced, or affected
 *   by this manifest in any way.
 * - `atlas-stones-technique-guide` (this manifest) and `atlas-stone-technique`
 *   (the existing hardcoded "Stone-to-Lap Phase" article) are two distinct,
 *   real pieces of content at two distinct slugs. This manifest must never
 *   be used to create a public Sanity page at `atlas-stone-technique` — that
 *   would silently collide with and risk overwriting the existing hardcoded
 *   article's identity.
 */

/** Clear, self-describing publication status — not a bare boolean. */
export type PublicPublicationStatus =
  | 'approvedForPublicRelease'
  | 'excludedPendingQualifiedReview';

export type AttributionStatus = 'unset' | 'confirmed';
export type DateFieldStatus = 'unverified' | 'confirmed';

export interface ApprovedKnowledgeArticleMeta {
  /** Display / H1 title, as approved in editorial review. */
  title: string;
  /** Canonical Sanity slug — the only value this article may ever be served at. */
  canonicalSlug: string;
  publicPublicationStatus: PublicPublicationStatus;
  /** true only for the excluded draft; false for every approved public article. */
  draftOnlyStatus: boolean;
  seoTitle: string;
  metaDescription: string;
  /** Whether `author` has genuine, confirmed attribution — not whether Sanity currently has a value set. */
  authorStatus: AttributionStatus;
  reviewerStatus: AttributionStatus;
  publishedDateStatus: DateFieldStatus;
  lastReviewedDateStatus: DateFieldStatus;
}

/**
 * The 9 articles approved for public Sanity-backed exposure.
 * Do not add to this list without a corresponding editorial approval.
 */
export const APPROVED_KNOWLEDGE_ARTICLES: ApprovedKnowledgeArticleMeta[] = [
  {
    title: 'What Is Strongman? A Clear Guide to the Sport, Events, and Competition Format',
    canonicalSlug: 'what-is-strongman',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'What Is Strongman? A Clear Guide to the Sport & Events | Educate Strong Academy',
    metaDescription:
      'A clear, accurate guide to Strongman as a sport — how competitions work, common event types, who competes, and how it differs from powerlifting, CrossFit, and bodybuilding.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
  {
    title: 'Strongman for Beginners: How to Start Training Safely and Realistically',
    canonicalSlug: 'strongman-for-beginners',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'Strongman for Beginners: How to Start Safely | Educate Strong Academy',
    metaDescription:
      'A realistic, evidence-led guide to starting Strongman — who it suits, how to build a foundation, common mistakes, and how to find your first novice competition.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
  {
    title: "Strongman Events Explained: A Beginner's Guide to the Main Event Types",
    canonicalSlug: 'strongman-events-explained',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'Strongman Events Explained: Main Event Types | Educate Strong Academy',
    metaDescription:
      'A clear, evidence-led guide to the main types of Strongman events, from carries and presses to loading and grip events, and why rules vary by competition.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
  {
    title: 'How to Become a Strongman Coach: Skills, Knowledge, and Education Pathways',
    canonicalSlug: 'how-to-become-a-strongman-coach',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'How to Become a Strongman Coach: Skills & Education | Educate Strong Academy',
    metaDescription:
      'A careful, evidence-led guide to what Strongman coaching involves, the knowledge it requires, and how to think about education and qualification pathways.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
  {
    title: 'Atlas Stones Technique Guide',
    // Canonical slug — do NOT change to 'atlas-stone-technique'. See file header.
    canonicalSlug: 'atlas-stones-technique-guide',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'Atlas Stones Technique Guide: How the Lift Works | Educate Strong Academy',
    metaDescription:
      'An evidence-led technique guide to the Atlas Stones lift — the phases, grip considerations, common mistakes, and how it connects to foundational strength movements.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
  {
    title: 'Strongman Competition Rules Explained',
    canonicalSlug: 'strongman-competition-rules-explained',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'Strongman Competition Rules Explained (Plain English) | Educate Strong Academy',
    metaDescription:
      'A plain English guide to how Strongman competitions are scored and judged, and why exact rules always depend on the specific federation or organiser.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
  {
    title: 'What Does a Strongman Referee Do?',
    canonicalSlug: 'what-does-a-strongman-referee-do',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'What Does a Strongman Referee Do? | Educate Strong Academy',
    metaDescription:
      'A clear explanation of the Strongman referee\'s role, from judging standards to safety oversight, and how officiating pathways currently work.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
  {
    title: 'How to Train for Your First Strongman Competition',
    canonicalSlug: 'first-strongman-competition-training',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'How to Train for Your First Strongman Competition | Educate Strong Academy',
    metaDescription:
      'A practical, evidence-led guide to preparing for your first Strongman competition, from choosing the right event to competition-day logistics.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
  {
    title: 'Strongman vs Powerlifting: How the Two Sports Actually Differ',
    canonicalSlug: 'strongman-vs-powerlifting',
    publicPublicationStatus: 'approvedForPublicRelease',
    draftOnlyStatus: false,
    seoTitle: 'Strongman vs Powerlifting: The Real Differences | Educate Strong Academy',
    metaDescription:
      'A clear, evidence-based comparison of Strongman and powerlifting: format, scoring, training demands, and which might suit you.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
];

/**
 * Excluded articles — must NEVER appear in a public listing, public article
 * route, navigation, internal link, sitemap, related-content component, or
 * fallback. Kept here (rather than simply omitted) so the exclusion is
 * explicit and traceable, not a silent absence someone could "fix" by
 * accident. Requires a separate, explicit qualified-review confirmation
 * before it could ever move into APPROVED_KNOWLEDGE_ARTICLES.
 */
export const EXCLUDED_KNOWLEDGE_ARTICLES: ApprovedKnowledgeArticleMeta[] = [
  {
    title: 'Is Strongman Safe for Children? A Careful Guide for Parents, Coaches, and Clubs',
    canonicalSlug: 'is-strongman-safe-for-children',
    publicPublicationStatus: 'excludedPendingQualifiedReview',
    draftOnlyStatus: true,
    seoTitle: 'Is Strongman Safe for Children? A Careful Guide | Educate Strong Academy',
    metaDescription:
      'An evidence-led, balanced guide for parents, coaches, and clubs on whether Strongman-style training can be appropriate for children, and what to look for.',
    authorStatus: 'unset',
    reviewerStatus: 'unset',
    publishedDateStatus: 'unverified',
    lastReviewedDateStatus: 'unverified',
  },
];

const APPROVED_SLUG_SET: ReadonlySet<string> = new Set(
  APPROVED_KNOWLEDGE_ARTICLES.map((article) => article.canonicalSlug)
);

const EXCLUDED_SLUG_SET: ReadonlySet<string> = new Set(
  EXCLUDED_KNOWLEDGE_ARTICLES.map((article) => article.canonicalSlug)
);

/** The exact 9 approved public slugs — safe to use directly for listing pages, article routes, and sitemap generation. */
export function getApprovedKnowledgeSlugs(): string[] {
  return APPROVED_KNOWLEDGE_ARTICLES.map((article) => article.canonicalSlug);
}

/** True only for one of the 9 explicitly approved public slugs. */
export function isApprovedKnowledgeSlug(slug: string): boolean {
  return APPROVED_SLUG_SET.has(slug);
}

/** The excluded slug(s) — useful for defensive checks in routing, link-generation, and related-content filtering code. */
export function getExcludedKnowledgeSlugs(): string[] {
  return EXCLUDED_KNOWLEDGE_ARTICLES.map((article) => article.canonicalSlug);
}

/** True only for an excluded slug (e.g. is-strongman-safe-for-children). */
export function isExcludedKnowledgeSlug(slug: string): boolean {
  return EXCLUDED_SLUG_SET.has(slug);
}

/** Looks up manifest metadata for an approved slug only. Returns undefined for anything not explicitly approved, including the excluded article and any of the 14 old hardcoded slugs. */
export function getApprovedKnowledgeArticleMeta(
  slug: string
): ApprovedKnowledgeArticleMeta | undefined {
  return APPROVED_KNOWLEDGE_ARTICLES.find((article) => article.canonicalSlug === slug);
}

/**
 * Throws if `slug` is not on the approved public allow-list. Intended as a
 * guard at the top of any public route handler, query function, or sitemap
 * entry point — call this before touching Sanity data for a given slug, so
 * an unapproved or excluded slug fails loudly instead of silently rendering.
 */
export function assertApprovedKnowledgeSlug(slug: string): void {
  if (!isApprovedKnowledgeSlug(slug)) {
    throw new Error(
      `"${slug}" is not an approved public Knowledge Hub slug. Refusing to expose it.`
    );
  }
}
