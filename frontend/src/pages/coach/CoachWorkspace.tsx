import CoachWorkspaceBody from '../../components/coach/CoachWorkspaceBody';

/*
 * COACH role is in the schema. When the platform is ready to onboard
 * coaches, the following backend work is still needed:
 * - Add a CoachAssignment model (coachId → learnerId, optional courseId)
 * - Add GET /api/coach/students endpoint returning assigned learners + progress
 * - Expose assignment management in the admin panel
 *
 * The visual foundation (section layout, empty states) lives in
 * CoachWorkspaceBody, shared with /portal-preview/coach.
 */
export default function CoachWorkspace() {
  return <CoachWorkspaceBody basePath="/coach" />;
}
