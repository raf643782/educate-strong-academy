/**
 * Static course page data for public marketing pages.
 *
 * This file contains the rich content for each course's public-facing
 * marketing page. It is separate from the Prisma/API course data, which
 * handles LMS enrolment, modules, and lesson progress.
 *
 * Add a new entry here when a new course needs a rich marketing page.
 * The CourseDetail page uses this as a lookup by slug — if no entry
 * exists for a slug, the page falls back to the simple API-driven view.
 *
 * Architecture note: this supports Level 1 → Level 3 Coaching,
 * Refereeing, StrongKidz, and any future CPD or EatStrong courses
 * without changing the page component or Prisma schema.
 */

import { CONTACT_EMAIL } from '../lib/contact';

export interface TutorData {
  name: string;
  role: string;
  credentials: string[];
  description: string;
  photoAlt: string;
}

export interface AudienceCard {
  heading: string;
  copy: string;
}

export interface CurriculumItem {
  name: string;
  focus: string;
}

export interface PracticalFeature {
  label: string;
  description: string;
}

export interface EndorsementData {
  name: string;
  description: string;
}

export interface JourneyStep {
  label: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PricingData {
  title: string;
  totalFee: number;
  deposit: number;
  balanceTiming: string;
  included: string[];
  groupSizeNote?: string;
  armedForcesNote?: boolean;
}

export interface CoursePageData {
  slug: string;

  // Trust badges (top of page)
  badges: string[];

  // Hero
  headline: string;
  subHeadline: string;
  keyFacts: string[];

  // Why this course (short intro below hero)
  whyHeading: string;
  whyCopy: string;

  // Tutors — moved high on page for credibility
  tutors: TutorData[];

  // Who this is for
  audienceCards: AudienceCard[];
  prerequisiteStatement: string;

  // Curriculum / what you will learn
  curriculumHeading: string;
  curriculumIntro: string;
  curriculumItems: CurriculumItem[];

  // Learning outcomes
  outcomesHeading: string;
  outcomesIntro: string;
  outcomes: string[];

  // Practical experience
  practicalHeading: string;
  practicalCopy: string;
  practicalFeatures: PracticalFeature[];

  // Qualification OR Endorsements — one or the other per course
  showQualification: boolean;
  qualificationHeading?: string;
  qualificationCopy?: string;
  qualificationDetail?: string;

  showEndorsements: boolean;
  endorsements?: EndorsementData[];

  // Pricing
  pricing: PricingData;

  // Dates (evergreen — no hardcoded dates)
  dateHeading: string;
  dateCopy: string;
  dateSubCopy: string;

  // Learning journey steps
  journeySteps: JourneyStep[];

  // FAQ
  faqs: FAQ[];

  // Contact email for CTAs
  contactEmail: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED TUTOR DATA — reused across all courses
// ─────────────────────────────────────────────────────────────────────────────

const PAUL_SMITH: TutorData = {
  name: 'Paul Smith',
  role: 'Lead Tutor',
  credentials: [
    'Three-time UK\'s Strongest Man',
    'Junior UK and World Champion',
    'Four-time England\'s Strongest Man',
    'World\'s Strongest Man competitor',
    'Coached the UK\'s Strongest Woman and multiple national and international champions',
    'Co-founder of Mind Body Connect (Charity No. 1173834)',
  ],
  description:
    'Paul does not just teach Strongman — he has competed at the highest level of the sport and spent years building the coaching frameworks that underpin this course. His experience coaching through the MOD and charity sector means he understands how to develop coaches as well as athletes.',
  photoAlt: 'Paul Smith — Lead Tutor, Educate.Strong',
};

const DR_CHRIS_FITZGERALD: TutorData = {
  name: 'Dr Chris Fitzgerald',
  role: 'Tutor and Programme Lead',
  credentials: [
    'PhD in Health — published researcher',
    'Natural World\'s Strongest Man athlete',
    'Multiple national Strongman titles',
    'Over a decade with Mind Body Connect charity',
    'Extensive experience coaching coaches through the MOD',
  ],
  description:
    'Chris brings the academic framework and sports science depth that gives Educate.Strong\'s qualifications professional credibility. His research background and competition experience sit alongside each other — making the course content both evidence-based and practically grounded.',
  photoAlt: 'Dr Chris Fitzgerald — Tutor, Educate.Strong',
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSE DATA MAP — keyed by slug
// ─────────────────────────────────────────────────────────────────────────────

export const COURSE_PAGE_DATA: Record<string, CoursePageData> = {

  // ── Level 1 Fundamentals of Coaching Strongman ──────────────────────────
  'level-1-coaching-strongman': {
    slug: 'level-1-coaching-strongman',

    badges: ['Active IQ Accredited', 'Level 1 Qualification', 'No Prerequisites Required'],

    headline: 'Learn to Coach Strongman from the People Who Shaped the Sport',
    subHeadline:
      'The UK\'s original Strongman coaching qualification — practical, accredited, and built for coaches who want to do it properly.',
    keyFacts: ['Two-day in-person course', 'Maximum 10 participants', 'Active IQ accredited'],

    whyHeading: 'The UK\'s Original Strongman Coaching Course',
    whyCopy:
      'Strongman is one of the most technically varied strength sports. Coaching it well requires specialist knowledge — not just of technique, but of how to teach awkward-object loading, carry mechanics, and overhead pressing to beginners safely. This course gives coaches that knowledge in a structured, practical, accredited format. No other Strongman coaching qualification in the UK has the history, the tutors, or the accreditation that this one does.',

    tutors: [PAUL_SMITH, DR_CHRIS_FITZGERALD],

    audienceCards: [
      {
        heading: 'Personal Trainers and Strength Coaches',
        copy: 'You already coach clients in the gym. This course gives you the Strongman-specific technical knowledge and an accredited qualification to expand what you offer and who you can help.',
      },
      {
        heading: 'Competitive Athletes Moving Into Coaching',
        copy: 'You understand the sport from the inside. This course gives you the coaching framework, professional credibility, and practical skills to pass that knowledge on effectively.',
      },
      {
        heading: 'Gym Owners and Club Leaders',
        copy: 'You want your facility to offer credible Strongman coaching. Developing your own qualified coaches in-house starts with a foundation qualification that carries industry recognition.',
      },
    ],
    prerequisiteStatement:
      'No previous coaching qualifications are required. Participants should have a background in strength training and be confident in a gym environment.',

    curriculumHeading: 'Six Core Events. Taught Properly.',
    curriculumIntro:
      'The course covers the six events that form the foundation of Strongman competition. For each one, you will learn not just the technique, but how to teach it — how to break it down, identify faults, apply coaching cues, and progress a beginner safely.',
    curriculumItems: [
      {
        name: 'Log Press',
        focus: 'Overhead pressing technique, shoulder mechanics, and how to coach the clean to shoulder position safely for beginners.',
      },
      {
        name: 'Axle Press',
        focus: 'Teaching the grip and wrist position demands of the thick bar, and how to programme overhead pressing progression.',
      },
      {
        name: 'Deadlift',
        focus: 'Hip hinge fundamentals, setup coaching, and managing athletes safely under heavy conventional and competition deadlift loading.',
      },
      {
        name: 'Farmer\'s Walk',
        focus: 'The pick, walking mechanics, turning technique, and managing implement instability for athletes new to carry events.',
      },
      {
        name: 'Yoke',
        focus: 'Setup, bracing under load, stride management, and coaching the specific demands that distinguish the yoke from other carry events.',
      },
      {
        name: 'Atlas Stones',
        focus: 'Hip loading, the lap technique, and how to introduce the most technically demanding beginner event in a progressive and safe manner.',
      },
    ],

    outcomesHeading: 'What You Will Be Able to Do',
    outcomesIntro: 'By the end of this course you will be able to:',
    outcomes: [
      'Coach the six core Strongman events safely with beginner and intermediate athletes',
      'Identify and correct common technical faults across each event',
      'Structure and deliver effective beginner Strongman sessions',
      'Apply appropriate coaching cues for each event and athlete type',
      'Implement risk management principles in a Strongman training environment',
    ],

    practicalHeading: 'Practical. Hands-On. No Classroom Theory Without Application.',
    practicalCopy:
      'This is not a lecture course. The two-day programme is structured around coaching on the gym floor — with real athletes, real implements, and real scenarios. You will coach, receive coaching, be observed, and be challenged. Every participant gets direct time with Paul and Chris, which is why the group size is deliberately kept to a maximum of ten.',
    practicalFeatures: [
      {
        label: 'Hands-On Coaching',
        description: 'You coach real athletes on real events throughout both days. Theory and practice are inseparable.',
      },
      {
        label: 'Maximum 10 Participants',
        description: 'The group is intentionally small. Every participant gets direct contact time with Paul and Chris — not an afternoon in a room with thirty others.',
      },
      {
        label: 'Peer Network',
        description: 'Lunch is included on both days. The Saturday evening is an opportunity to continue conversations with fellow coaches in an informal setting.',
      },
    ],

    showQualification: true,
    qualificationHeading: 'An Accredited Qualification You Can Use',
    qualificationCopy:
      'On completing the course, participants receive an Active IQ Level 1 qualification — an industry-recognised credential that can be added to a CV, used to demonstrate professional competency to clients, and referenced in insurance documentation.',
    qualificationDetail:
      'Active IQ is an Ofqual-regulated awarding organisation. This is not a certificate of attendance — it is a formal qualification. No previous qualifications are required to enrol. This Level 1 is the starting point of a structured coaching pathway.',

    showEndorsements: false,

    pricing: {
      title: 'Level 1 Fundamentals of Coaching Strongman',
      totalFee: 500,
      deposit: 100,
      balanceTiming: 'Balance due before the course date',
      included: [
        'Active IQ Level 1 Coaching Qualification',
        'Two-day in-person delivery',
        'Pre-course guide and e-learning materials',
        'Lunch included both days',
        'Direct access to Paul Smith and Dr Chris Fitzgerald',
      ],
      groupSizeNote: 'Maximum 10 participants per course',
      armedForcesNote: true,
    },

    dateHeading: 'When Is the Next Course?',
    dateCopy:
      'Course dates are announced throughout the year in venues across the UK. Register your interest and you will be among the first to hear when the next Level 1 Fundamentals course is confirmed — including location, date, and how to secure your place.',
    dateSubCopy:
      'Spaces are limited to a maximum of 10 participants. Early registration ensures you do not miss out.',

    journeySteps: [
      { label: 'Register Interest', description: 'Submit your interest. No payment required at this stage.' },
      { label: 'Receive Course Information', description: 'Course date, venue, and booking details confirmed directly.' },
      { label: 'Secure Your Place', description: 'Pay the £100 deposit to confirm your space on the course.' },
      { label: 'Receive Pre-Course Materials', description: 'Course guide and e-learning materials sent by email before the course.' },
      { label: 'Attend the Practical Course', description: 'Two days of hands-on coaching with Paul and Chris.' },
      { label: 'Receive Your Qualification', description: 'Active IQ Level 1 qualification processed and issued.' },
    ],

    faqs: [
      {
        question: 'Do I need any previous qualifications to attend?',
        answer: 'No. This is a Level 1 entry qualification. You need a background in strength training and confidence in a gym environment, but no prior coaching qualifications are required.',
      },
      {
        question: 'How does the deposit and payment work?',
        answer: 'A £100 deposit secures your place. The remaining balance of £400 is due before the course date. Full payment and booking details will be confirmed when you contact Educate.Strong.',
      },
      {
        question: 'What do I need to bring?',
        answer: 'Comfortable training clothing and footwear appropriate for a gym floor. Full logistics and preparation details will be included in your pre-course materials.',
      },
      {
        question: 'Is the Saturday evening dinner included in the course fee?',
        answer: 'Lunch on both days is included in the course fee. The Saturday evening is an optional informal social and is not included — it is a chance to continue conversations with fellow coaches.',
      },
      {
        question: 'Are armed forces discounts available?',
        answer: 'Yes. Contact Educate.Strong directly for information on pricing and eligibility for serving and veteran military personnel.',
      },
      {
        question: 'What happens if I need to cancel?',
        answer: 'Contact Educate.Strong directly to discuss the cancellation and deposit policy. Full details will be included in your booking confirmation.',
      },
    ],

    contactEmail: CONTACT_EMAIL,
  },

  // ── Level 1 Strongman Refereeing Certification ───────────────────────────
  'level-1-strongman-refereeing': {
    slug: 'level-1-strongman-refereeing',

    badges: ['Endorsed by WHEA.GB', 'Armed Forces Strongman', 'Level 1 Certification'],

    headline: 'Become a Trusted Official in Strongman Competition',
    subHeadline:
      'The first formal Strongman refereeing certification in the UK — practical, endorsed, and built around the standards the sport deserves.',
    keyFacts: ['One-day in-person certification', 'Live practical drills', 'No refereeing experience required'],

    whyHeading: 'The Standard Strongman Competition Deserves',
    whyCopy:
      'Strongman competition relies on clear decisions, consistent judging, and composure under pressure. Not every competition currently delivers that standard. This certification gives officials the technical knowledge, practical experience, and formal credential to raise the bar — for athletes, for promoters, and for the sport.',

    tutors: [PAUL_SMITH, DR_CHRIS_FITZGERALD],

    audienceCards: [
      {
        heading: 'Competitive Athletes and Club Members',
        copy: 'You know the sport well and want to contribute to it beyond competing. This certification gives you the technical knowledge and the confidence to make consistent, credible calls at events.',
      },
      {
        heading: 'Event Organisers and Promoters',
        copy: 'You run competitions and you want the officiating to match the quality of the athletes. Developing formally qualified officials within your community starts with a recognised certification.',
      },
      {
        heading: 'Coaches Expanding Their Roles',
        copy: 'Understanding how events are judged makes you a better coach. This certification gives you a second perspective on the sport and makes you a more complete resource for the athletes you work with.',
      },
    ],
    prerequisiteStatement:
      'No previous refereeing experience is required. Participants should have a good working knowledge of Strongman events.',

    curriculumHeading: 'Five Areas. One Standard.',
    curriculumIntro:
      'The certification covers the practical and professional skills required to officiate Strongman competitions to a consistent and credible standard.',
    curriculumItems: [
      {
        name: 'The Ethos of a Referee',
        focus: 'Understanding what impartial, confident officiating looks like — and why the standard of officiating matters for athletes, promoters, and the long-term credibility of the sport.',
      },
      {
        name: 'Core Refereeing Skills',
        focus: 'Signal timing, positioning, communication with athletes, and managing the field of play under real competition pressure.',
      },
      {
        name: 'Responsibilities and Expectations',
        focus: 'What organisers, athletes, and fellow officials expect from a qualified referee — before, during, and after an event.',
      },
      {
        name: 'Event Rules',
        focus: 'A structured walkthrough of the rules for each major Strongman event, including common infraction patterns and how to apply rules consistently under pressure.',
      },
      {
        name: 'Live Practical Drills',
        focus: 'Making real calls on real athletes. This is where classroom knowledge becomes officiating ability.',
      },
    ],

    outcomesHeading: 'What You Will Be Able to Do',
    outcomesIntro: 'By the end of this certification you will be able to:',
    outcomes: [
      'Apply Strongman event rules consistently and confidently',
      'Make officiating decisions under competition pressure',
      'Manage athlete and coach interactions professionally',
      'Understand and fulfil referee responsibilities at Strongman events',
      'Support safe and fair competition delivery',
    ],

    practicalHeading: 'A Day Spent Making Calls, Not Just Taking Notes',
    practicalCopy:
      'The certification is structured to put knowledge into practice as quickly as possible. A significant portion of the day is spent on the gym floor — making real judging decisions, handling equipment, and applying rules in live scenarios. Confidence in a refereeing role comes from having made calls under pressure, and this course is designed to give you that experience in a supported environment.',
    practicalFeatures: [
      {
        label: 'Live Decision Making',
        description: 'You will make real calls during practical drills — not hypothetical ones from a workbook.',
      },
      {
        label: 'Endorsed by WHEA.GB',
        description: 'The certification is formally recognised by WHEA.GB, giving it weight at competitions under that governing body.',
      },
      {
        label: 'Recognised by Armed Forces Strongman',
        description: 'Also endorsed by Armed Forces Strongman, reflecting its relevance across the full range of UK Strongman competition.',
      },
    ],

    showQualification: false,

    showEndorsements: true,
    endorsements: [
      {
        name: 'WHEA.GB',
        description:
          'This certification is formally endorsed by WHEA.GB, one of the leading Strongman governing bodies in the UK. Completion is recognised as a credible officiating qualification at WHEA.GB-affiliated competitions.',
      },
      {
        name: 'Armed Forces Strongman',
        description:
          'The certification is endorsed by Armed Forces Strongman, recognising its relevance and quality for officials working across the armed forces Strongman community.',
      },
    ],

    pricing: {
      title: 'Level 1 Strongman Refereeing Certification',
      totalFee: 250,
      deposit: 100,
      balanceTiming: 'Balance due before the course date',
      included: [
        'Level 1 Refereeing Certification',
        'One-day in-person delivery',
        'Live practical officiating drills',
        'Lunch, water, and snacks included',
        'Direct access to Paul Smith and Dr Chris Fitzgerald',
      ],
    },

    dateHeading: 'When Is the Next Course?',
    dateCopy:
      'The next Level 1 Strongman Refereeing course date is to be confirmed. Register your interest and you will be notified as soon as the date, venue, and booking details are announced.',
    dateSubCopy:
      'Spaces are limited. Early registration means you will not miss out when the next course is confirmed.',

    journeySteps: [
      { label: 'Register Interest', description: 'Submit your interest. No payment required at this stage.' },
      { label: 'Receive Course Information', description: 'Date, venue, and booking details confirmed by Educate.Strong.' },
      { label: 'Secure Your Place', description: 'Pay the £100 deposit to confirm your space on the certification day.' },
      { label: 'Attend the Practical Day', description: 'One day of practical officiating drills with Paul and Chris.' },
      { label: 'Receive Your Certification', description: 'Level 1 Refereeing Certification processed and issued.' },
    ],

    faqs: [
      {
        question: 'Do I need any previous refereeing experience?',
        answer: 'No. The only requirement is a good working knowledge of Strongman events. The course is designed to take you from no officiating experience to a formally certified Level 1 referee.',
      },
      {
        question: 'What does WHEA.GB endorsement mean in practice?',
        answer: 'Completing this course is recognised by WHEA.GB as a credible officiating qualification. Competitions affiliated with WHEA.GB can consider you a formally certified official rather than an uncertified volunteer.',
      },
      {
        question: 'Is this certification recognised across all Strongman federations?',
        answer: 'The certification is currently endorsed by WHEA.GB and Armed Forces Strongman. Recognition by other federations may differ. Contact Educate.Strong if you need to confirm recognition for a specific competition or organisation.',
      },
      {
        question: 'What do I need to bring?',
        answer: 'Comfortable clothing and footwear appropriate for a gym environment, and a working knowledge of Strongman event rules. Full logistics details will be included with your booking confirmation.',
      },
      {
        question: 'Will I be able to officiate at competitions immediately after completing the course?',
        answer: 'The certification qualifies you to work as a Level 1 official. Whether you are assigned to competitions depends on the relevant promoter or federation. This course gives you the credential to be considered — experience builds from there.',
      },
      {
        question: 'What happens if I need to cancel?',
        answer: 'Contact Educate.Strong directly to discuss the cancellation and deposit policy. Full details will be included in your booking confirmation.',
      },
    ],

    contactEmail: CONTACT_EMAIL,
  },
};
