/**
 * Sanity client for Knowledge Hub content.
 *
 * Sanity is the source of truth for pure editorial content (Knowledge Hub
 * articles). It is NOT used for transactional or curriculum-coupled data —
 * courses, CPD, certifications, the exercise library, event library, and
 * coach profiles all remain in Prisma/Postgres via `lib/api.ts`, unchanged.
 *
 * This client is read-only and uses only public, non-secret configuration
 * (project id + dataset). No write token or private credential belongs here.
 *
 * Until a real Sanity project exists and these env vars are set, `sanityClient`
 * is null and every query function below resolves safely to an empty result
 * rather than throwing, so nothing that imports this file can break the app.
 */

import { createClient, type SanityClient } from '@sanity/client';
import { getApprovedKnowledgeSlugs, isApprovedKnowledgeSlug } from './approvedKnowledgeArticles';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production';
const apiVersion = (import.meta.env.VITE_SANITY_API_VERSION as string | undefined) || '2024-01-01';
const useCdn = (import.meta.env.VITE_SANITY_USE_CDN as string | undefined) !== 'false';

export const isSanityConfigured = Boolean(projectId);

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({ projectId: projectId as string, dataset, apiVersion, useCdn })
  : null;

// ── Types ────────────────────────────────────────────────────────────────

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

export interface SanityPublicReference {
  authorsOrOrganisation?: string;
  title?: string;
  publicationOrSource?: string;
  year?: string;
  doi?: string;
  url?: string;
  accessDate?: string;
  notesForDisplay?: string;
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
  body: unknown[]; // Portable Text blocks
  faq?: SanityFaqItem[];
  internalLinks?: SanityInternalLink[];
  cta?: SanityCta;
  publicReferences?: SanityPublicReference[];
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
// Explicit field list — guarantees internal editorial notes can never be
// sent to the public frontend regardless of schema changes.

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
  publicReferences,
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

export async function getPublishedKnowledgeArticles(): Promise<SanityKnowledgeArticle[]> {
  if (!sanityClient) return [];
  const approvedSlugs = getApprovedKnowledgeSlugs();
  if (approvedSlugs.length === 0) return [];
  return sanityClient.fetch(
    `*[_type == "knowledgeArticle" && status == "published" && slug.current in $approvedSlugs] | order(clusterOrder asc) ${PUBLIC_ARTICLE_PROJECTION}`,
    { approvedSlugs }
  );
}

export async function getKnowledgeArticleBySlug(slug: string): Promise<SanityKnowledgeArticle | null> {
  if (!sanityClient) return null;
  if (!isApprovedKnowledgeSlug(slug)) return null;
  const result = await sanityClient.fetch(
    `*[_type == "knowledgeArticle" && status == "published" && slug.current == $slug][0] ${PUBLIC_ARTICLE_PROJECTION}`,
    { slug }
  );
  return result ?? null;
}

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
  return pathways.map(p => ({
    ...p,
    orderedArticles: p.orderedArticles.filter(a => a.status === 'published'),
  }));
}
