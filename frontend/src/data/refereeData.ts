/**
 * Referee graduate data.
 *
 * IMPORTANT: consentConfirmed must be true before any entry is displayed publicly.
 * photoAlt describes what the photograph contains.
 * All photo slots are placeholders until Educate.Strong provides files.
 *
 * Captions use professional outcomes language with occasional personality —
 * as specified in the architecture review: formal credential line first,
 * optional authentic quote below.
 */

export interface RefereeGraduate {
  id: string;
  name: string;
  certificationLevel: 'Level 1';
  certificationDate: string;        // "March 2026" format
  officatingNote?: string;          // Where they officiate
  quote?: string;                   // Optional authentic quote from the graduate
  photoAlt: string;
  consentConfirmed: boolean;
  isPublished: boolean;
  isHomepage: boolean;              // Show on homepage social proof strip
}

export const REFEREE_GRADUATES: RefereeGraduate[] = [
  {
    id: 'ref-001',
    name: '[Name — consent required]',
    certificationLevel: 'Level 1',
    certificationDate: '[Month Year]',
    officatingNote: 'Placeholder — where this official referees.',
    quote: 'Placeholder — optional authentic quote from the graduate. Keep the personality. Remove anything that undermines professional credibility.',
    photoAlt: 'Placeholder — photograph of Level 1 certified referee at a Strongman competition — individual consent required before use',
    consentConfirmed: false,
    isPublished: false,
    isHomepage: false,
  },
  {
    id: 'ref-002',
    name: '[Name — consent required]',
    certificationLevel: 'Level 1',
    certificationDate: '[Month Year]',
    officatingNote: 'Placeholder.',
    photoAlt: 'Placeholder — certified referee photograph — consent required',
    consentConfirmed: false,
    isPublished: false,
    isHomepage: false,
  },
  {
    id: 'ref-003',
    name: '[Name — consent required]',
    certificationLevel: 'Level 1',
    certificationDate: '[Month Year]',
    photoAlt: 'Placeholder — certified referee photograph — consent required',
    consentConfirmed: false,
    isPublished: false,
    isHomepage: false,
  },
  {
    id: 'ref-004',
    name: '[Name — consent required]',
    certificationLevel: 'Level 1',
    certificationDate: '[Month Year]',
    photoAlt: 'Placeholder — certified referee photograph — consent required',
    consentConfirmed: false,
    isPublished: false,
    isHomepage: false,
  },
];

// Only returns entries where consent is confirmed and published
export function getPublishedReferees(): RefereeGraduate[] {
  return REFEREE_GRADUATES.filter(r => r.consentConfirmed && r.isPublished);
}

export function getHomepageReferees(): RefereeGraduate[] {
  return REFEREE_GRADUATES.filter(r => r.consentConfirmed && r.isPublished && r.isHomepage);
}
