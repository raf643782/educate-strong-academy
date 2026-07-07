import PreviewBanner from '../../components/preview/PreviewBanner';
import CoachWorkspace from '../coach/CoachWorkspace';

/*
 * Internal QA tooling — /portal-preview/coach
 * Reuses the real CoachWorkspace component directly — it is already a
 * fully static placeholder (no useAuth(), no API calls), so it is safe
 * to render outside a signed-in session with no changes needed.
 */
export default function CoachPreview() {
  return (
    <>
      <PreviewBanner />
      <CoachWorkspace />
    </>
  );
}
