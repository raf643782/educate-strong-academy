/**
 * LMS status system — used across dashboard, coursework, assessor portal.
 * Centralised here so all components use the same labels and colours.
 */

export type CourseStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'AWAITING_REVIEW' | 'NEEDS_CHANGES' | 'COMPLETE';

export const STATUS_CONFIG: Record<CourseStatus, { label: string; badgeClass: string; colour: string }> = {
  NOT_STARTED:      { label: 'Not Started',      badgeClass: 'badge-grey',   colour: '#888888' },
  IN_PROGRESS:      { label: 'In Progress',       badgeClass: 'badge-amber',  colour: '#E19A47' },
  AWAITING_REVIEW:  { label: 'Awaiting Review',   badgeClass: 'badge-accent', colour: '#A41C64' },
  NEEDS_CHANGES:    { label: 'Needs Changes',     badgeClass: 'badge-amber',  colour: '#E19A47' },
  COMPLETE:         { label: 'Complete',           badgeClass: 'badge-grey',   colour: '#22C55E' },
};

export function StatusBadge({ status }: { status: CourseStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={config.badgeClass} style={{ color: config.colour }}>
      {config.label}
    </span>
  );
}

export const DEMO_LEARNER = {
  name: 'Alex Thompson',
  email: 'coach@example.com',
  role: 'Learner',
  enrolledCourses: 1,
  completedLessons: 0,
  totalLessons: 80,
};
