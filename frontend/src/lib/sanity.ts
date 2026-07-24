/**
 * Sanity client for Knowledge Hub content (Stage 1 proof-of-concept).
 *
 * Sanity is the source of truth for pure editorial content (Knowledge Hub
 * articles, and future learning resources). It is NOT used for transactional
 * or curriculum-coupled data — Courses, CPD, Certifications, Exercise Library,
 * Event Library, and Coach profiles all remain in Prisma/Postgres via
 * `lib/api.ts`, unchanged.
 *
 * This client is read-only and uses only public, non-secret configuration
 * (project id + dataset). No write token or private credential belongs here —
 * mutations, if ever needed, must go through a server-side integration instead.
 *
 * Until a real Sanity project exists and these env vars are set, `sanityClient`
 * is null and every query function below resolves safely to an empty result
 * rather than throwing, so nothing that imports this file can break the app.
 */

import { createClient, type SanityClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production';
const apiVersion = (import.meta.env.VITE_SANITY_API_VERSION as string | undefined) || '2024-01-01';
const useCdn = (import.meta.env.VITE_SANITY_USE_CDN as string | undefined) !== 'false';

export const isSanityConfigured = Boolean(projectId);

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({ projectId: projectId as string, dataset, apiVersion, useCdn })
  : null;

// ── Types ────────────────────────────────────────────────────────────────
// Mirrors the public fields of the `knowledgeArticle` schema (see
// /sanity/schemas/knowledgeArticle.ts). No internal-only editorial field
// exists on this type — see docs/KNOWLEDGE_HUB_SOURCE_NOTES_POLICY.md for
// why `sourceNotes` was removed from the schema entirely (Stage 5A).

export interface SanityFaqItem {
  question: string;
  answer: string;
}

export interface SanityInternalLink {
  label: string;
  linkType: string;
  url?: string;
}

export interface SanityCta {
  ctaText: string;
  destinationUrl?: string;
}

export interface SanityPathwayRef {
  title: string;
  slug: string;
}

export interface SanityKnowledgeArticle {
  _id: string;
  title: string;
  h1: string;
  slug: string;
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  body: unknown[]; // Portable Text blocks — rendered via PortableTextRenderer
  faq?: SanityFaqItem[];
  internalLinks?: SanityInternalLink[];
  cta?: SanityCta;
  author?: string;
  reviewedBy?: string;
  lastReviewedDate?: string;
  pathway?: SanityPathwayRef;
  clusterOrder?: number;
  status: string;
  publishedDate?: string;
  resourceType?: string;
}

export interface SanityPathwayWithArticles {
  title: string;
  slug: string;
  description?: string;
  orderedArticles: Pick<SanityKnowledgeArticle, '_id' | 'title' | 'h1' | 'slug' | 'clusterOrder' | 'status'>[];
}

// ── GROQ projection ──────────────────────────────────────────────────────
// Explicit field list, not `...` — this is what guarantees `sourceNotes`
// (internal editorial notes) can never be sent to the public frontend,
// regardless of what gets added to the schema later.

const PUBLIC_ARTICLE_PROJECTION = `{
  _id,
  title,
  h1,
  "slug": slug.current,
  seoTitle,
  metaDescription,
  primaryKeyword,
  secondaryKeywords,
  body,
  faq,
  internalLinks,
  cta,
  author,
  reviewedBy,
  lastReviewedDate,
  "pathway": pathway->{ title, "slug": slug.current },
  clusterOrder,
  status,
  publishedDate,
  resourceType
}`;

// ── Query functions ──────────────────────────────────────────────────────

/** All published Knowledge Hub articles, ordered for listing pages. */
export async function getPublishedKnowledgeArticles(): Promise<SanityKnowledgeArticle[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    `*[_type == "knowledgeArticle" && status == "published"] | order(clusterOrder asc) ${PUBLIC_ARTICLE_PROJECTION}`
  );
}

/** A single published Knowledge Hub article by slug, or null if not found/not published. */
export async function getKnowledgeArticleBySlug(slug: string): Promise<SanityKnowledgeArticle | null> {
  if (!sanityClient) return null;
  const result = await sanityClient.fetch(
    `*[_type == "knowledgeArticle" && status == "published" && slug.current == $slug][0] ${PUBLIC_ARTICLE_PROJECTION}`,
    { slug }
  );
  return result ?? null;
}

/** All pathways with their ordered articles (published only). */
export async function getPathwaysWithArticles(): Promise<SanityPathwayWithArticles[]> {
  if (!sanityClient) return [];
  const pathways: SanityPathwayWithArticles[] = await sanityClient.fetch(`
    *[_type == "pathway"] | order(title asc) {
      title,
      "slug": slug.current,
      description,
      "orderedArticles": orderedArticles[]->{ _id, title, h1, "slug": slug.current, clusterOrder, status }
    }
  `);
  // Filter out unpublished articles client-side to keep the GROQ query simple.
  return pathways.map(p => ({
    ...p,
    orderedArticles: p.orderedArticles.filter(a => a.status === 'published'),
  }));
}
