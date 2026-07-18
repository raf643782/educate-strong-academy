/**
 * Public site origin, used for canonical URLs, Open Graph URLs, and
 * structured data across the site. Reads VITE_SITE_URL when set (e.g. if
 * a custom domain is configured later) and falls back to the current
 * production Vercel domain, so nothing breaks if the env var is unset.
 */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://educate-strong-academy.vercel.app';
