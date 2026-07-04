import { useEffect } from 'react';

const SITE_NAME = 'Educate.Strong Academy';
const DEFAULT_OG_IMAGE = '/assets/atlas-stone-branded.png';

interface HeadOptions {
  title: string;
  description?: string;
  ogImage?: string;
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

/**
 * Sets document.title and basic Open Graph / description meta tags for the
 * current route. Client-side only — link-preview bots that don't execute
 * JS (e.g. Slack/Twitter unfurlers) will still see the static index.html
 * defaults, not these per-page values. Fine for browser tabs/history and
 * JS-rendering crawlers; true social-preview support needs SSR/pre-render.
 */
export function useDocumentHead({ title, description, ogImage }: HeadOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:image', ogImage || DEFAULT_OG_IMAGE);
  }, [title, description, ogImage]);
}
