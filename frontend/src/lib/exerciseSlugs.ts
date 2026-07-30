/**
 * Public URL slug <-> API/database slug alias layer for the Exercise
 * Library.
 *
 * Several exercises were seeded with an unnecessary "exercise" prefix
 * or suffix in their `slug` field (e.g. `exercise-log-press`,
 * `power-stairs-exercise`). Since dedicated public pages never existed
 * before this programme, this is the only opportunity to establish a
 * clean public URL (e.g. `/exercises/log-press`) without ever having
 * published — and then having to redirect away from — the poor one.
 *
 * The database `slug` column is NOT changed (no migration, no risk to
 * admin references or API lookups by slug) — this is a pure additive
 * frontend mapping used only to decide what the public URL looks like
 * and to translate a public URL back to the real API slug.
 */

// API slug -> public (clean) slug. Every exercise not listed here uses
// its existing API slug unchanged as its public slug.
export const API_TO_PUBLIC_SLUG: Record<string, string> = {
  'exercise-axle-press': 'axle-press',
  'exercise-farmers-walk': 'farmers-walk',
  'exercise-log-press': 'log-press',
  'exercise-yoke-walk': 'yoke-walk',
  'axle-deadlift-exercise': 'axle-deadlift',
  'circus-dumbbell-exercise': 'circus-dumbbell',
  'duck-walk-exercise': 'duck-walk',
  'frame-carry-exercise': 'frame-carry',
  'front-squat-exercise': 'front-squat',
  'husafell-carry-exercise': 'husafell-carry',
  'power-stairs-exercise': 'power-stairs',
  'stone-to-shoulder-exercise': 'stone-to-shoulder',
  'viking-press-exercise': 'viking-press',
};

// Derived reverse map: public slug -> API slug.
export const PUBLIC_TO_API_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(API_TO_PUBLIC_SLUG).map(([apiSlug, publicSlug]) => [publicSlug, apiSlug])
);

export function apiToPublicSlug(apiSlug: string): string {
  return API_TO_PUBLIC_SLUG[apiSlug] ?? apiSlug;
}

export function publicToApiSlug(publicSlug: string | undefined): string | undefined {
  if (!publicSlug) return publicSlug;
  return PUBLIC_TO_API_SLUG[publicSlug] ?? publicSlug;
}
