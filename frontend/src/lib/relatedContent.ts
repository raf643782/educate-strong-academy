/**
 * Shared "related content" selection logic for Exercise/Event pages —
 * used by the client-side page components and the build-time prerender
 * script, so both compute the same related links from the same rule.
 */

export interface CategoryItem {
  slug: string;
  name: string;
  category: string;
}

// Exercise category -> the Event Library category that trains toward it.
export const EXERCISE_TO_EVENT_CAT: Record<string, string> = {
  Pressing: 'Press Events',
  'Deadlift / Hinge': 'Deadlift Events',
  Carry: 'Carry Events',
  Loading: 'Loading Events',
  Pull: 'Pull Events',
};

// Event category -> the Exercise Library category that teaches its technique.
export const EVENT_TO_EXERCISE_CAT: Record<string, string> = {
  'Press Events': 'Pressing',
  'Deadlift Events': 'Deadlift / Hinge',
  'Carry Events': 'Carry',
  'Loading Events': 'Loading',
  'Pull Events': 'Pull',
};

const MAX_RELATED = 3;

export function pickRelatedExercises<T extends CategoryItem>(all: T[], current: CategoryItem): T[] {
  return all.filter(e => e.category === current.category && e.slug !== current.slug).slice(0, MAX_RELATED);
}

export function pickEventsForExercise<T extends CategoryItem>(allEvents: T[], exercise: CategoryItem): T[] {
  const eventCat = EXERCISE_TO_EVENT_CAT[exercise.category];
  return eventCat ? allEvents.filter(e => e.category === eventCat).slice(0, MAX_RELATED) : [];
}

export function pickExercisesForEvent<T extends CategoryItem>(allExercises: T[], event: CategoryItem): T[] {
  const exerciseCat = EVENT_TO_EXERCISE_CAT[event.category];
  return exerciseCat ? allExercises.filter(e => e.category === exerciseCat).slice(0, MAX_RELATED) : [];
}

export function pickRelatedEvents<T extends CategoryItem>(all: T[], current: CategoryItem): T[] {
  return all.filter(e => e.category === current.category && e.slug !== current.slug).slice(0, MAX_RELATED);
}
