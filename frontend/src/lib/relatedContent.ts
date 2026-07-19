/**
 * Shared "related content" selection logic for Exercise/Event pages —
 * used by the client-side page components and the build-time prerender
 * script, so both compute the same related links from the same rule.
 *
 * Stage 2 revision: Stage 1 matched purely on the broad DB `category`
 * (Pressing / Deadlift / Carry / Loading / Pull / Accessories /
 * Conditioning), which produced some genuinely unrelated pairings —
 * e.g. Atlas Stones (event) picking up Power Stairs (exercise) as
 * "related" purely because both sit in the "Loading" category, despite
 * being different movement patterns. This revision groups entries by a
 * narrower, real "movement family" — grounded in what each entry's own
 * description/programming notes already say about it, not invented —
 * and only falls back to the broad category on the Event side (which
 * still only has one real prerendered page and a shallower data set
 * that Stage 3 will address properly). When an entry has no family
 * (or its family has no other members), the related section is
 * expected to be hidden by the page rather than padded with a weak
 * category-only match.
 */

export interface CategoryItem {
  slug: string;
  name: string;
  category: string;
}

// ── Movement families (Exercise Library) ────────────────────────────────────
// Grounded in each exercise's own real, already-published content — e.g.
// Log Clean's description calls it "the foundation of the log press";
// Front Squat's programmingNotes names yoke walk, atlas stones and
// Husafell carries explicitly; Grip Holds' description names farmer's
// walk, frame carry, arm-over-arm pull and axle press explicitly.
const EXERCISE_MOVEMENT_FAMILY: Record<string, string> = {
  'atlas-stone-to-lap': 'atlas-stone',
  'atlas-stone-to-platform': 'atlas-stone',
  'stone-to-shoulder-exercise': 'atlas-stone',

  'exercise-axle-press': 'overhead-press',
  'log-clean': 'overhead-press',
  'exercise-log-press': 'overhead-press',
  'circus-dumbbell-exercise': 'overhead-press',
  'viking-press-exercise': 'overhead-press',

  'conventional-deadlift': 'hip-hinge',
  'hip-hinge-drill': 'hip-hinge',
  'romanian-deadlift': 'hip-hinge',
  'good-morning': 'hip-hinge',
  'axle-deadlift-exercise': 'hip-hinge',

  'exercise-farmers-walk': 'loaded-carry',
  'sandbag-carry': 'loaded-carry',
  'exercise-yoke-walk': 'loaded-carry',
  'duck-walk-exercise': 'loaded-carry',
  'frame-carry-exercise': 'loaded-carry',
  'husafell-carry-exercise': 'loaded-carry',
  'zercher-carry': 'loaded-carry',

  'grip-holds-thick-bar': 'grip',

  'arm-over-arm-rope-pull': 'drag-pull',
  'sled-drag': 'drag-pull',
  'truck-pull': 'drag-pull',

  'sled-push': 'push-conditioning',
  'tyre-flip': 'push-conditioning',

  'power-stairs-exercise': 'loading-stairs',
  // 'plank' and 'front-squat-exercise' intentionally have no family —
  // see EXPLICIT_RELATED_EXERCISES below for their real, stated relations.
};

// A handful of exercises explicitly name other specific exercises/events
// in their own already-published description or programming notes.
// Used as a precise override in front of family/category matching —
// not invented, just made explicit and structured.
const EXPLICIT_RELATED_EXERCISE_SLUGS: Record<string, string[]> = {
  // "Key accessory for yoke walk, atlas stones, and Husafell-style carries."
  'front-squat-exercise': ['exercise-yoke-walk', 'atlas-stone-to-lap', 'husafell-carry-exercise'],
  // "Direct grip endurance training for farmer's walk, frame carry,
  // arm-over-arm pull, axle press, and all other grip-limited events."
  'grip-holds-thick-bar': ['exercise-farmers-walk', 'frame-carry-exercise', 'arm-over-arm-rope-pull', 'exercise-axle-press'],
};

// Stage 4: the 13 confirmed exercise/event duplicate-wording pairs (plus
// the Truck Pull/Vehicle Pull near-duplicate) each name one specific
// counterpart on the other library, not just "something in this
// category" — e.g. the Log Press exercise page should link straight to
// the Log Press event page, not to every Press Event. These explicit
// pairs take priority over the movement-family/category fallback below
// in both directions. Log Press's event side also names Log Clean
// (its own listed accessory) alongside Log Press itself.
const EXPLICIT_EVENT_FOR_EXERCISE: Record<string, string> = {
  'exercise-axle-press': 'axle-press',
  "exercise-farmers-walk": 'farmers-walk',
  'exercise-log-press': 'log-press',
  'exercise-yoke-walk': 'yoke-walk',
  'arm-over-arm-rope-pull': 'arm-over-arm-rope-pull',
  'axle-deadlift-exercise': 'axle-deadlift',
  'circus-dumbbell-exercise': 'circus-dumbbell',
  'frame-carry-exercise': 'frame-carry',
  'husafell-carry-exercise': 'husafell-carry',
  'power-stairs-exercise': 'power-stairs',
  'stone-to-shoulder-exercise': 'stone-to-shoulder',
  'viking-press-exercise': 'viking-press',
  'truck-pull': 'vehicle-pull',
  // Stage 5: the new Tyre Flip event pairs with the pre-existing Tyre
  // Flip exercise (published before this event existed).
  'tyre-flip': 'tyre-flip',
};

const EXPLICIT_EXERCISE_FOR_EVENT: Record<string, string[]> = {
  'axle-press': ['exercise-axle-press'],
  'farmers-walk': ['exercise-farmers-walk'],
  'log-press': ['exercise-log-press', 'log-clean'],
  'yoke-walk': ['exercise-yoke-walk'],
  'arm-over-arm-rope-pull': ['arm-over-arm-rope-pull'],
  'axle-deadlift': ['axle-deadlift-exercise'],
  'circus-dumbbell': ['circus-dumbbell-exercise'],
  'frame-carry': ['frame-carry-exercise'],
  'husafell-carry': ['husafell-carry-exercise'],
  'power-stairs': ['power-stairs-exercise'],
  'stone-to-shoulder': ['stone-to-shoulder-exercise'],
  'viking-press': ['viking-press-exercise'],
  'vehicle-pull': ['truck-pull'],
  'tyre-flip': ['tyre-flip'],
};

// Movement family -> the Event Library category most relevant to it.
const FAMILY_TO_EVENT_CAT: Record<string, string> = {
  'atlas-stone': 'Loading Events',
  'overhead-press': 'Press Events',
  'hip-hinge': 'Deadlift Events',
  'loaded-carry': 'Carry Events',
  'drag-pull': 'Pull Events',
  'loading-stairs': 'Loading Events',
};

// Event category -> the Exercise Library category that teaches its technique
// (kept as the Event-side fallback — Stage 3 will give events their own
// movement-family data once every event has a full prerendered page).
export const EVENT_TO_EXERCISE_CAT: Record<string, string> = {
  'Press Events': 'Pressing',
  'Deadlift Events': 'Deadlift / Hinge',
  'Carry Events': 'Carry',
  'Loading Events': 'Loading',
  'Pull Events': 'Pull',
};

const MAX_RELATED = 3;

function byExplicitSlugs<T extends CategoryItem>(all: T[], slugs: string[] | undefined): T[] {
  if (!slugs) return [];
  return slugs.map(slug => all.find(item => item.slug === slug)).filter((x): x is T => !!x);
}

/** Related exercises for an exercise page: explicit stated relations
 * first, then same movement-family, excluding itself. No category
 * fallback — an exercise with no family and no explicit relations
 * simply gets no related-exercises section. */
export function pickRelatedExercises<T extends CategoryItem>(all: T[], current: CategoryItem): T[] {
  const explicit = byExplicitSlugs(all, EXPLICIT_RELATED_EXERCISE_SLUGS[current.slug]).filter(e => e.slug !== current.slug);
  if (explicit.length > 0) return explicit.slice(0, MAX_RELATED);

  const family = EXERCISE_MOVEMENT_FAMILY[current.slug];
  if (!family) return [];
  return all
    .filter(e => e.slug !== current.slug && EXERCISE_MOVEMENT_FAMILY[e.slug] === family)
    .slice(0, MAX_RELATED);
}

/** Related events for an exercise page: the exercise's own named
 * competition counterpart first (Stage 4 explicit pairing), then the
 * event category matching its real movement family (not its broad DB
 * category) — this is what stops e.g. an "atlas-stone" family exercise
 * from surfacing Power Stairs as if it were related. */
export function pickEventsForExercise<T extends CategoryItem>(allEvents: T[], exercise: CategoryItem): T[] {
  const explicitSlug = EXPLICIT_EVENT_FOR_EXERCISE[exercise.slug];
  const explicit = explicitSlug ? allEvents.find(e => e.slug === explicitSlug) : undefined;

  const family = EXERCISE_MOVEMENT_FAMILY[exercise.slug];
  const eventCat = family ? FAMILY_TO_EVENT_CAT[family] : undefined;
  const familyMatches = eventCat ? allEvents.filter(e => e.category === eventCat && e.slug !== explicitSlug) : [];

  const result = explicit ? [explicit, ...familyMatches] : familyMatches;
  return result.slice(0, MAX_RELATED);
}

/** Related exercises for an event page: the event's own named exercise
 * counterpart(s) first (Stage 4 explicit pairing, e.g. Log Press event
 * names both Log Press and Log Clean exercises), then the Stage 1
 * category-based fallback for events without an explicit pairing yet. */
export function pickExercisesForEvent<T extends CategoryItem>(allExercises: T[], event: CategoryItem): T[] {
  const explicitSlugs = EXPLICIT_EXERCISE_FOR_EVENT[event.slug];
  const explicit = byExplicitSlugs(allExercises, explicitSlugs);
  if (explicit.length > 0) return explicit.slice(0, MAX_RELATED);

  const exerciseCat = EVENT_TO_EXERCISE_CAT[event.category];
  return exerciseCat ? allExercises.filter(e => e.category === exerciseCat).slice(0, MAX_RELATED) : [];
}

export function pickRelatedEvents<T extends CategoryItem>(all: T[], current: CategoryItem): T[] {
  return all.filter(e => e.category === current.category && e.slug !== current.slug).slice(0, MAX_RELATED);
}
