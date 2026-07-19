/**
 * Reads the build-time-embedded Exercise/Event record back out of the
 * page, so the very first client render can use the exact same data
 * that produced the prerendered HTML — no refetch, no loading flash,
 * and (combined with hydrateRoot in main.tsx) no hydration mismatch.
 *
 * The embedded <script id="__ES_LIBRARY_DATA__"> tag is written by
 * scripts/prerender.mjs, escaped there against script-tag breakout /
 * injection. It only ever contains the same public fields the page's
 * own API endpoint already returns publicly — nothing private.
 *
 * Only used when the current route's type+slug matches what was
 * embedded; any mismatch (e.g. the visitor navigated client-side to a
 * different, non-prerendered entry) is ignored and the page falls back
 * to its normal self-fetch.
 */
const SCRIPT_ID = '__ES_LIBRARY_DATA__';

export interface EmbeddedLibraryData<T> {
  type: 'exercise' | 'event';
  slug: string;
  record: T;
  relatedExercises: unknown[];
  relatedEvents: unknown[];
}

export function readEmbeddedLibraryData<T>(
  type: 'exercise' | 'event',
  slug: string | undefined
): EmbeddedLibraryData<T> | null {
  if (typeof document === 'undefined' || !slug) return null;
  const el = document.getElementById(SCRIPT_ID);
  if (!el || !el.textContent) return null;
  try {
    const parsed = JSON.parse(el.textContent);
    if (parsed && parsed.type === type && parsed.slug === slug) {
      return parsed as EmbeddedLibraryData<T>;
    }
  } catch {
    // Malformed embedded data — fall back to a normal fetch rather than crash.
  }
  return null;
}
