/**
 * cohortData — shape and demo content for the conditional "confirmed
 * upcoming cohort" homepage feature.
 *
 * ConfirmedCohort models exactly the fields the feature can display
 * once real data exists. DEMO_COHORT is clearly fictional example data
 * for this private preview only (isDemo: true) — see
 * UpcomingCohortFeature.tsx for how isDemo gates both the visible
 * "Preview example only" labelling and whether structured data is
 * emitted (never for demo data).
 *
 * Setting the exported cohort to null is the real production "no
 * confirmed cohort" state: the feature renders nothing at all, so the
 * homepage order closes naturally with no reserved space. This file
 * only ever exports one cohort at a time by design — see the
 * "multiple cohort" reasoning in the final report for why a single
 * featured cohort plus a link to the full course list is recommended
 * over a list or carousel.
 */

export interface ConfirmedCohort {
  isDemo: boolean;
  courseTitle: string;
  courseLevel: string;
  courseCategory: string;
  startDate: string;
  endDate: string;
  venueName: string;
  city: string;
  addressLine: string;
  postcode: string;
  startTime: string;
  finishTime: string;
  availableSpaces?: string;
  price?: string;
  depositNote?: string;
  bookingStatus: string;
  coursePageUrl: string;
  bookingUrl: string;
  directionsUrl: string;
  latitude: number;
  longitude: number;
  shortDescription: string;
  image: string;
  imageAlt: string;
  featuredOnHomepage: boolean;
}

/**
 * Demonstration cohort. Course name and pricing reuse real, already
 * public Level 1 Coaching information (so the format shown is
 * realistic) — the date, venue name, address and space count are
 * invented for illustration and are not a real booking. Sheffield is
 * used only as a visual example, per instruction, not as a confirmed
 * real location.
 */
export const DEMO_COHORT: ConfirmedCohort = {
  isDemo: true,
  courseTitle: 'Level 1 Fundamentals of Coaching Strongman',
  courseLevel: 'Level 1',
  courseCategory: 'Coaching',
  startDate: '12 September 2026',
  endDate: '13 September 2026',
  venueName: 'Educate Strong Demonstration Venue',
  city: 'Sheffield',
  addressLine: 'Example address, Sheffield',
  postcode: 'S1',
  startTime: '09:00',
  finishTime: '17:00',
  availableSpaces: '4 spaces remaining',
  price: '£500 total course fee',
  depositNote: '£100 deposit to secure a place',
  bookingStatus: 'Open',
  coursePageUrl: '/courses/level-1-coaching-strongman',
  bookingUrl: '/register-interest?type=level-1-coaching',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=53.3811,-1.4701',
  latitude: 53.3811,
  longitude: -1.4701,
  shortDescription:
    'Two days of hands on coaching across the six core Strongman events, delivered by Paul Smith and Dr Chris Fitzgerald.',
  image: '/assets/coaching-l1-cover.webp',
  imageAlt: 'Level 1 Fundamentals of Coaching Strongman',
  featuredOnHomepage: true,
};
