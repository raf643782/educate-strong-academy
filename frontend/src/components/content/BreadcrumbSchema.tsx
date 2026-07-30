/**
 * BreadcrumbSchema — schema.org BreadcrumbList JSON-LD for the Exercise
 * and Event library hub pages and their dedicated entry pages.
 *
 * Takes a real, already-displayed breadcrumb trail (name + path) — it
 * never invents intermediate levels that aren't genuinely part of the
 * page's own navigation.
 */
import { SITE_URL } from '../../lib/siteUrl';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
