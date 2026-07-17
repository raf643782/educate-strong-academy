import { useEffect } from 'react';

const SITE_NAME = 'Educate.Strong Academy';
const DEFAULT_OG_IMAGE = '/assets/atlas-stone-branded.png';

interface HeadOptions {
  title: string;
  description?: string;
  ogImage?: string;
  /** Set true for internal/preview routes that must never be indexed. Defaults to false (unchanged behaviour for every existing caller). */
  noindex?: boolean;
  /** Absolute canonical URL for this route. Optional — existing callers that don't pass it get no canonical tag, unchanged from before. */
  canonical?: string;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.remove();
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeCanonical() {
  document.querySelector('link[rel="canonical"]')?.remove();
}

/**
 * Sets document.title and basic Open Graph / description meta tags for the
 * current route. Client-side only — link-preview bots that don't execute
 * JS (e.g. Slack/Twitter unfurlers) will still see the static index.html
 * defaults, not these per-page values. Fine for browser tabs/history and
 * JS-rendering crawlers; true social-preview support needs SSR/pre-render.
 */
export function useDocumentHead({ title, description, ogImage, noindex, canonical }: HeadOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:image', ogImage || DEFAULT_OG_IMAGE);

    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      // Clean up on client-side navigation away from a noindex route so the
      // directive never leaks onto a page that didn't ask for it.
      removeMeta('name', 'robots');
    }

    if (canonical) {
      setCanonical(canonical);
    } else {
      removeCanonical();
    }
  }, [title, description, ogImage, noindex, canonical]);
}
