/**
 * Single source of truth for courses that are visible/informative but not
 * yet open for enrolment. Keep this in sync with the Navbar's `available`
 * flags for the same courses.
 */
export const UNLAUNCHED_COURSE_SLUGS = new Set([
  'level-2-coaching-strongman',
  'level-3-coaching-strongman',
]);
