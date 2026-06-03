/**
 * Tutor data — content for all tutor-facing components.
 *
 * photoAlt describes what the photograph should contain.
 * All photo slots use ImagePlaceholder until Educate.Strong provides files.
 *
 * coursesTaught slugs must match entries in coursePageData.ts.
 */

export interface Tutor {
  id: string;
  name: string;
  role: string;
  shortRole: string;          // One-line role for compact cards
  credentials: string[];       // Bullet list of credentials
  personalStatement: string;   // First-person, authentic — not marketing copy
  description: string;         // Third-person description for course pages
  coursesTaught: { slug: string; name: string }[];
  photoAlt: string;
  instagramUrl?: string;
  sortOrder: number;
}

export const TUTORS: Tutor[] = [
  {
    id: 'paul-smith',
    name: 'Paul Smith',
    role: 'Lead Tutor',
    shortRole: '3× UK\'s Strongest Man',
    credentials: [
      'Three-time UK\'s Strongest Man',
      'Junior UK and World Strongman Champion',
      'Four-time England\'s Strongest Man',
      'World\'s Strongest Man competitor',
      'Coached the UK\'s Strongest Woman',
      'Coached multiple national and international champions',
      'Co-founder, Mind Body Connect (Charity No. 1173834)',
    ],
    personalStatement:
      'Placeholder — Paul Smith personal statement in first person. This should be authentic, direct, and explain why he built Educate.Strong and what coaching Strongman means to him. To be provided by Educate.Strong.',
    description:
      'Paul does not just teach Strongman — he has competed at the highest level of the sport and spent years building the coaching frameworks that underpin every qualification Educate.Strong delivers.',
    coursesTaught: [
      { slug: 'level-1-coaching-strongman', name: 'Level 1 Coaching' },
      { slug: 'level-2-coaching-strongman', name: 'Level 2 Coaching' },
      { slug: 'level-3-coaching-strongman', name: 'Level 3 Coaching' },
      { slug: 'level-1-strongman-refereeing', name: 'Level 1 Refereeing' },
    ],
    photoAlt: 'Paul Smith — portrait or coaching photograph — Educate.Strong to provide',
    instagramUrl: 'https://instagram.com/educate.strong',
    sortOrder: 1,
  },
  {
    id: 'dr-chris-fitzgerald',
    name: 'Dr Chris Fitzgerald',
    role: 'Tutor and Programme Lead',
    shortRole: 'PhD in Health · Natural WSM',
    credentials: [
      'PhD in Health — published researcher',
      'Natural World\'s Strongest Man athlete',
      'Multiple national Strongman titles',
      'Over a decade with Mind Body Connect charity',
      'Extensive experience coaching coaches through the MOD',
      'Co-founder, Mind Body Connect (Charity No. 1173834)',
    ],
    personalStatement:
      'Placeholder — Dr Chris Fitzgerald personal statement. Should reflect his academic background, why evidence-based coaching matters in Strongman, and his motivation for building the qualification framework. To be provided by Educate.Strong.',
    description:
      'Chris brings the academic framework and sports science depth that gives Educate.Strong\'s qualifications professional credibility alongside their practical foundation.',
    coursesTaught: [
      { slug: 'level-1-coaching-strongman', name: 'Level 1 Coaching' },
      { slug: 'level-2-coaching-strongman', name: 'Level 2 Coaching' },
      { slug: 'level-3-coaching-strongman', name: 'Level 3 Coaching' },
      { slug: 'level-1-strongman-refereeing', name: 'Level 1 Refereeing' },
    ],
    photoAlt: 'Dr Chris Fitzgerald — portrait or coaching photograph — Educate.Strong to provide',
    instagramUrl: 'https://instagram.com/educate.strong',
    sortOrder: 2,
  },
  {
    id: 'laura-hollywood',
    name: 'Laura Hollywood',
    role: 'StrongKidz Coach',
    shortRole: 'Britain\'s Strongest Woman u73',
    credentials: [
      'Britain\'s Strongest Woman u73',
      'Europe\'s Strongest Woman u73',
      'International Strongwoman podiums',
      'StrongKidz co-founder',
      'Youth strength development specialist',
    ],
    personalStatement:
      'Placeholder — Laura Hollywood personal statement. Should reflect her motivation for creating StrongKidz, what she believes physical confidence does for young people, and her coaching philosophy for youth athletes. To be provided by Educate.Strong.',
    description:
      'Laura co-founded StrongKidz with a belief that building physical confidence in young people changes how they see themselves — in the gym and everywhere else.',
    coursesTaught: [
      { slug: 'strongkidz-coach-education', name: 'StrongKidz Coach Education' },
    ],
    photoAlt: 'Laura Hollywood — portrait or coaching photograph — Educate.Strong to provide',
    sortOrder: 3,
  },
  {
    id: 'victoria-wilson',
    name: 'Victoria Wilson',
    role: 'StrongKidz Coach',
    shortRole: 'Strength and Conditioning Coach',
    credentials: [
      'Strength and Conditioning Coach',
      'Youth development specialist',
      'Powerlifting, weightlifting, and strongwoman competitor',
      'Former Sheffield Steel Roller Derby captain',
      'Sheffield Steel Juniors Strength Coach',
    ],
    personalStatement:
      'Placeholder — Victoria Wilson personal statement. Should reflect her background in strength sport, her experience working with young athletes, and why she joined StrongKidz. To be provided by Educate.Strong.',
    description:
      'Victoria brings strength and conditioning expertise and youth sport experience to every StrongKidz session — focusing on technique, safety, and building the habits that serve young athletes for life.',
    coursesTaught: [
      { slug: 'strongkidz-coach-education', name: 'StrongKidz Coach Education' },
    ],
    photoAlt: 'Victoria Wilson — portrait or coaching photograph — Educate.Strong to provide',
    sortOrder: 4,
  },
];

export function getTutorsByIds(ids: string[]): Tutor[] {
  return TUTORS.filter(t => ids.includes(t.id)).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getTutorsByCourse(slug: string): Tutor[] {
  return TUTORS.filter(t => t.coursesTaught.some(c => c.slug === slug));
}
