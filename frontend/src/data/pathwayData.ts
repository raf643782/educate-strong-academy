/**
 * Learning pathway data — drives the pathway visualiser component.
 * Add new pathways or steps here without touching component code.
 */

export interface PathwayStep {
  id: string;
  label: string;
  sublabel?: string;
  description: string;
  status: 'available' | 'coming-soon' | 'future';
  courseSlug?: string;
  price?: string;
}

export interface Pathway {
  id: string;
  name: string;
  shortName: string;
  description: string;
  steps: PathwayStep[];
  colour: 'amber' | 'gray' | 'green';
}

export const PATHWAYS: Pathway[] = [
  {
    id: 'coaching',
    name: 'Coaching Pathway',
    shortName: 'Coaching',
    description: 'A structured progression from beginner coaching fundamentals to advanced performance coaching. Each level builds on the last.',
    colour: 'amber',
    steps: [
      {
        id: 'l1-coaching',
        label: 'Level 1',
        sublabel: 'Fundamentals of Coaching Strongman',
        description: 'Active IQ accredited. Six core events. Two-day in-person delivery. The UK\'s original Strongman coaching qualification.',
        status: 'available',
        courseSlug: 'level-1-coaching-strongman',
        price: '£500',
      },
      {
        id: 'l2-coaching',
        label: 'Level 2',
        sublabel: 'Coaching Strongman',
        description: 'Intermediate programming, advanced event coaching, competition preparation, and nutrition fundamentals for coaches.',
        status: 'coming-soon',
        courseSlug: 'level-2-coaching-strongman',
      },
      {
        id: 'l3-coaching',
        label: 'Level 3',
        sublabel: 'Advanced Coaching Strongman',
        description: 'High-performance programming, sports science application, advanced athlete management, and coaching systems.',
        status: 'coming-soon',
        courseSlug: 'level-3-coaching-strongman',
      },
      {
        id: 'cpd',
        label: 'CPD',
        sublabel: 'Continuing Professional Development',
        description: 'Ongoing professional development, renewal requirements, and advanced specialist modules.',
        status: 'future',
      },
    ],
  },
  {
    id: 'refereeing',
    name: 'Refereeing Pathway',
    shortName: 'Refereeing',
    description: 'Formal officiating certifications endorsed by WHEA.GB and Armed Forces Strongman.',
    colour: 'gray',
    steps: [
      {
        id: 'l1-refereeing',
        label: 'Level 1',
        sublabel: 'Strongman Refereeing Certification',
        description: 'The first formal Strongman refereeing certification in the UK. One-day, practical, endorsed.',
        status: 'available',
        courseSlug: 'level-1-strongman-refereeing',
        price: '£250',
      },
      {
        id: 'l2-refereeing',
        label: 'Level 2',
        sublabel: 'Advanced Refereeing',
        description: 'Head judge responsibilities, panel management, advanced rule interpretation.',
        status: 'future',
      },
    ],
  },
  {
    id: 'strongkidz',
    name: 'StrongKidz',
    shortName: 'StrongKidz',
    description: 'Youth strength programme delivery — from participation to coach education.',
    colour: 'gray',
    steps: [
      {
        id: 'sk-coach',
        label: 'StrongKidz Coach',
        sublabel: 'Coach Education Certification',
        description: 'Safeguarding, youth development, age-appropriate movement, session planning, and parent communication.',
        status: 'available',
        courseSlug: 'strongkidz-coach-education',
      },
    ],
  },
];
