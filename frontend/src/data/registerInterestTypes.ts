export const REGISTER_INTEREST_TYPES: Record<string, string> = {
  'level-1-coaching':      'Level 1 Coaching',
  'level-2-coaching':      'Level 2 Coaching',
  'level-3-coaching':      'Level 3 Coaching',
  'refereeing':            'Refereeing',
  'strongkidz':            'StrongKidz',
  'shop':                  'Shop',
  'coach-access':          'Coach Account Access',
  'tutor-assessor-access': 'Tutor & Assessor Account Access',
  'newsletter':            'Newsletter',
  'general':               'Educate.Strong',
};

export function interestTypeLabel(type: string | null): string {
  if (!type) return REGISTER_INTEREST_TYPES.general;
  return REGISTER_INTEREST_TYPES[type] || REGISTER_INTEREST_TYPES.general;
}

// Course slug → register-interest type, for the courses that currently exist.
export const COURSE_SLUG_TO_INTEREST_TYPE: Record<string, string> = {
  'level-1-coaching-strongman':   'level-1-coaching',
  'level-2-coaching-strongman':   'level-2-coaching',
  'level-3-coaching-strongman':   'level-3-coaching',
  'level-1-strongman-refereeing': 'refereeing',
  'strongkidz-coach-education':   'strongkidz',
};
