/**
 * Resolves an Exercise/Event's Stage 7 `relatedArticleSlugs` field
 * against the real Knowledge Hub article data. Returns only articles
 * that actually exist — a slug with no match is silently dropped
 * rather than rendering a broken link, and an empty/absent field
 * simply resolves to an empty list (the page hides the section).
 */
import { KNOWLEDGE_ARTICLES } from '../data/knowledgeArticles';

export interface RelatedArticleSummary {
  slug: string;
  title: string;
  summary: string;
}

export function resolveRelatedArticles(slugs?: string[]): RelatedArticleSummary[] {
  if (!slugs || slugs.length === 0) return [];
  return slugs
    .map(slug => KNOWLEDGE_ARTICLES.find(a => a.slug === slug))
    .filter((a): a is (typeof KNOWLEDGE_ARTICLES)[number] => !!a)
    .map(a => ({ slug: a.slug, title: a.title, summary: a.summary }));
}
