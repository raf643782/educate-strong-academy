/**
 * Testimonials data — placeholder content.
 *
 * Replace quote text and add real names/roles when Educate.Strong
 * provides confirmed testimonials with display consent.
 *
 * Fields:
 *   courseSlug — matches a course slug for course-page filtering.
 *                Use 'general' for homepage or non-course testimonials.
 *   isHomepage — show in homepage testimonial sections.
 *   isFeatured — use as the primary featured testimonial (one per context).
 *   videoUrl   — YouTube or Vimeo embed URL. Leave empty until hosting confirmed.
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location?: string;
  courseSlug: string;
  courseName: string;
  quote: string;
  outcome?: string;
  videoUrl?: string;
  videoThumbnailAlt?: string;
  isFeatured: boolean;
  isHomepage: boolean;
  isVideo: boolean;
  consentConfirmed: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  // ── Level 1 Coaching — Written ──────────────────────────────────────────
  {
    id: 'test-001',
    name: '[Name to be confirmed]',
    role: 'Personal Trainer',
    location: 'West Yorkshire',
    courseSlug: 'level-1-coaching-strongman',
    courseName: 'Level 1 Fundamentals of Coaching Strongman',
    quote:
      'Placeholder quote — this testimonial will be replaced with a real, consented quote from a Level 1 Coaching graduate. The card structure, attribution, and placement are correct.',
    outcome: 'Now delivers Strongman sessions as part of a PT service.',
    isFeatured: false,
    isHomepage: true,
    isVideo: false,
    consentConfirmed: false,
  },
  {
    id: 'test-002',
    name: '[Name to be confirmed]',
    role: 'Gym Owner',
    location: 'Greater Manchester',
    courseSlug: 'level-1-coaching-strongman',
    courseName: 'Level 1 Fundamentals of Coaching Strongman',
    quote:
      'Placeholder quote — gym owner perspective. Replace with a confirmed testimonial from a gym owner or club leader who completed Level 1 Coaching.',
    outcome: 'Developed two qualified coaches within their facility.',
    isFeatured: false,
    isHomepage: true,
    isVideo: false,
    consentConfirmed: false,
  },
  {
    id: 'test-003',
    name: '[Name to be confirmed]',
    role: 'Strength and Conditioning Coach',
    location: 'Armed Forces',
    courseSlug: 'level-1-coaching-strongman',
    courseName: 'Level 1 Fundamentals of Coaching Strongman',
    quote:
      'Placeholder quote — armed forces perspective. Replace with a confirmed testimonial from a military coach who attended on the armed forces discount programme.',
    isFeatured: false,
    isHomepage: false,
    isVideo: false,
    consentConfirmed: false,
  },
  // ── Level 1 Coaching — Video ─────────────────────────────────────────────
  {
    id: 'test-video-001',
    name: '[Testimonial participant — name to be confirmed]',
    role: 'Coach',
    courseSlug: 'level-1-coaching-strongman',
    courseName: 'Level 1 Fundamentals of Coaching Strongman',
    quote: 'Placeholder — video testimonial from Level 1 Coaching graduate.',
    videoUrl: '', // Add YouTube or Vimeo URL when confirmed with Educate.Strong
    videoThumbnailAlt: 'Video testimonial — Level 1 Coaching graduate — Educate.Strong to provide YouTube/Vimeo link',
    isFeatured: true,
    isHomepage: true,
    isVideo: true,
    consentConfirmed: false,
  },
  // ── Level 1 Refereeing ───────────────────────────────────────────────────
  {
    id: 'test-004',
    name: '[Name to be confirmed]',
    role: 'Competition Organiser',
    courseSlug: 'level-1-strongman-refereeing',
    courseName: 'Level 1 Strongman Refereeing Certification',
    quote:
      'Placeholder — refereeing course perspective. Replace with a confirmed testimonial from a referee graduate.',
    isFeatured: true,
    isHomepage: false,
    isVideo: false,
    consentConfirmed: false,
  },
  // ── StrongKidz ───────────────────────────────────────────────────────────
  {
    id: 'test-005',
    name: '[Parent — first name only, confirmed]',
    role: 'Parent of a StrongKidz participant',
    courseSlug: 'strongkidz',
    courseName: 'StrongKidz',
    quote:
      'Placeholder — parent testimonial. Written quotes only. No photographs. No surnames. Collect via structured feedback from current StrongKidz participants.',
    isFeatured: true,
    isHomepage: false,
    isVideo: false,
    consentConfirmed: false,
  },
  {
    id: 'test-006',
    name: '[Parent — first name only]',
    role: 'Parent of a StrongKidz participant',
    courseSlug: 'strongkidz',
    courseName: 'StrongKidz',
    quote:
      'Placeholder — second parent testimonial. Collect when three or more parent testimonials are available before enabling this section publicly.',
    isFeatured: false,
    isHomepage: false,
    isVideo: false,
    consentConfirmed: false,
  },
];

// Helpers
export function getTestimonialsByCourse(slug: string): Testimonial[] {
  return TESTIMONIALS.filter(t => t.courseSlug === slug);
}

export function getHomepageTestimonials(): Testimonial[] {
  return TESTIMONIALS.filter(t => t.isHomepage && !t.isVideo);
}

export function getFeaturedVideoTestimonial(): Testimonial | undefined {
  return TESTIMONIALS.find(t => t.isVideo && t.isFeatured && t.isHomepage);
}
