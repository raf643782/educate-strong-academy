/**
 * ArticleSchema — schema.org TechArticle JSON-LD for an Exercise/Event
 * page, but only when real author and published-date fields exist.
 * Renders nothing otherwise — this is exactly the Stage 8 rule "use
 * Article or TechArticle only when real author and date fields are
 * populated", so it never fires for any of the current records (none
 * has a confirmed author yet).
 *
 * Deliberately does not attempt HowTo, AggregateRating, or FAQPage —
 * none of those are supported by any real field this site has, and
 * none should ever be added merely because a movement has steps or a
 * rating would be nice to show.
 */
import { SITE_URL } from '../../lib/siteUrl';

interface ArticleSchemaProps {
  headline: string;
  description?: string | null;
  authorName?: string | null;
  publishedDate?: string | null;
  lastReviewedDate?: string | null;
  canonicalPath: string;
}

export default function ArticleSchema({
  headline,
  description,
  authorName,
  publishedDate,
  lastReviewedDate,
  canonicalPath,
}: ArticleSchemaProps) {
  if (!authorName || !publishedDate) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    ...(description ? { description } : {}),
    author: { '@type': 'Person', name: authorName },
    datePublished: publishedDate,
    ...(lastReviewedDate ? { dateModified: lastReviewedDate } : {}),
    mainEntityOfPage: `${SITE_URL}${canonicalPath}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
