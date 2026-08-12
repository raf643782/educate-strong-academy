/**
 * Approved Knowledge Hub article manifest — the single public boundary for
 * Sanity-backed Knowledge Hub content.
 *
 * Why this exists: a Sanity document's own `status === "published"` field is
 * NOT sufficient to decide public exposure. Any future listing page, article
 * route, sitemap generator, or related-content component must check a slug
 * against this explicit allow-list — never query Sanity by status alone.
 *
 * This file deliberately does NOT import from frontend/src/data/knowledgeArticles.ts
 * (the hardcoded Knowledge Hub data, 21 separate articles at /knowledge/:slug).
 * That system is unrelated and untouched by this manifest — importing from it
 * here would risk accidentally conflating the two systems.
 *
 * Scope notes:
 * - Only the 9 approved slugs below may ever be listed, routed to, or
 *   included in a sitemap for the Sanity-backed Knowledge Hub.
 * - The 21 existing hardcoded Knowledge Hub articles are a separate system
 *   entirely and are not migrated, referenced, or affected by this manifest.
 * - `atlas-stones-technique-guide` (this manifest) and `atlas-stone-technique`
 *   (the existing hardcoded article) are two distinct pieces of content at
 *   two distinct slugs and must never be conflated.
 */

export type PublicPublicationStatus =
  | 'approvedForPublicRelease'
  | 'excludedPendingQualifiedReview';

export type AttributionStatus = 'unset' | 'confirmed';
export type DateFieldStatus = 'unverified' | 'confirmed';

export interface ApprovedKnowledgeArticleMeta {
  title: string;
  canonicalSlug: string;
  publicPublicationStatus: PublicPublicationStatus;
  draftOnlyStatus: boolean;
  seoTitle: string;
  metaDescription: string;
  authorStatus: AttributionStatus;
  reviewerStatus: AttributionStatus;
  publishedDateStatus: DateFieldStatus;
  lastReviewedDateStatus: DateFieldStatus;
}

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
      "A clear explanation of the Strongman referee's role, from judging standards to safety oversight, and how officiating pathways currently work.",
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

export function getApprovedKnowledgeSlugs(): string[] {
  return APPROVED_KNOWLEDGE_ARTICLES.map((article) => article.canonicalSlug);
}

export function isApprovedKnowledgeSlug(slug: string): boolean {
  return APPROVED_SLUG_SET.has(slug);
}

export function getExcludedKnowledgeSlugs(): string[] {
  return EXCLUDED_KNOWLEDGE_ARTICLES.map((article) => article.canonicalSlug);
}

export function isExcludedKnowledgeSlug(slug: string): boolean {
  return EXCLUDED_SLUG_SET.has(slug);
}

export function getApprovedKnowledgeArticleMeta(
  slug: string
): ApprovedKnowledgeArticleMeta | undefined {
  return APPROVED_KNOWLEDGE_ARTICLES.find((article) => article.canonicalSlug === slug);
}

export function assertApprovedKnowledgeSlug(slug: string): void {
  if (!isApprovedKnowledgeSlug(slug)) {
    throw new Error(
      `"${slug}" is not an approved public Knowledge Hub slug. Refusing to expose it.`
    );
  }
}
