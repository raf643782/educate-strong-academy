import PreviewBanner from '../../components/preview/PreviewBanner';
import TutorWorkspaceBody from '../../components/tutor/TutorWorkspaceBody';

/*
 * Internal QA tooling — /portal-preview/tutor
 * Renders the same TutorWorkspaceBody as the real /tutor page, but with
 * basePath="/portal-preview/tutor" so "Assigned Courses and Groups" and
 * "Tutor Profile" stay inside the preview experience instead of
 * sending an unauthenticated visitor into a real protected route and
 * bouncing them to /login.
 */
export default function TutorPreview() {
  return (
    <>
      <PreviewBanner />
      <TutorWorkspaceBody basePath="/portal-preview/tutor" />
    </>
  );
}
