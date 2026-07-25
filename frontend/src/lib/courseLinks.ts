/**
 * Course CTA lookup for the Stage 7 `relevantCourseSlugs` field.
 *
 * The existing default course CTAs on Exercise/Event pages (Level 1
 * Coaching always; Level 1 Refereeing on Events with judgingCriteria)
 * are unchanged and are NOT driven by this field — they already
 * correctly reflect "movement teaching/programming" vs "judging,
 * commands, no lifts and competition standards" without needing any
 * data. This lookup only supplies ADDITIONAL course CTAs (e.g.
 * StrongKidz) when a record's relevantCourseSlugs explicitly names
 * one — nothing here is assigned to any record automatically.
 */
export interface CourseLink {
  slug: string;
  label: string;
  description: string;
  href: string;
  linkText: string;
  accentColor: string;
}

export const COURSE_LINKS: Record<string, CourseLink> = {
  strongkidz: {
    slug: 'strongkidz',
    label: 'A foundation movement for younger athletes?',
    description: 'This movement is used within the StrongKidz age-appropriate foundation programme.',
    href: '/strongkidz',
    linkText: 'Explore StrongKidz',
    accentColor: '#E19A47',
  },
};

export function resolveCourseLinks(slugs?: string[]): CourseLink[] {
  if (!slugs || slugs.length === 0) return [];
  return slugs.map(s => COURSE_LINKS[s]).filter((c): c is CourseLink => !!c);
}
