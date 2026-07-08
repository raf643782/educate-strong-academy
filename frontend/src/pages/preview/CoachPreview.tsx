import PreviewBanner from '../../components/preview/PreviewBanner';
import CoachWorkspaceBody from '../../components/coach/CoachWorkspaceBody';

/*
 * Internal QA tooling — /portal-preview/coach
 * Renders the same CoachWorkspaceBody as the real /coach page, but with
 * basePath="/portal-preview/coach" so the Coach Profile action stays
 * inside the preview experience (/portal-preview/coach/profile)
 * instead of sending an unauthenticated visitor into the real
 * protected route and bouncing them to /login.
 */
export default function CoachPreview() {
  return (
    <>
      <PreviewBanner />
      <CoachWorkspaceBody basePath="/portal-preview/coach" />
    </>
  );
}
