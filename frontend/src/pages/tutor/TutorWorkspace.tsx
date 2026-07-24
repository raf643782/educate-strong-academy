import TutorWorkspaceBody from '../../components/tutor/TutorWorkspaceBody';

/*
 * TUTOR role is in the schema. When the platform is ready to onboard
 * tutors, the following backend work is still needed:
 * - Add tutor-specific endpoints (assigned courses, learner groups, session notes)
 * - Expose tutor assignment in the admin panel
 *
 * The visual foundation (section layout, empty states) lives in
 * TutorWorkspaceBody, shared with /portal-preview/tutor.
 */
export default function TutorWorkspace() {
  return <TutorWorkspaceBody basePath="/tutor" showVerificationBanner />;
}
