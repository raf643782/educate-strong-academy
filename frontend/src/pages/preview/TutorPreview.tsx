import PreviewBanner from '../../components/preview/PreviewBanner';
import TutorWorkspace from '../tutor/TutorWorkspace';

/*
 * Internal QA tooling — /portal-preview/tutor
 * Reuses the real TutorWorkspace component directly — it is already a
 * fully static placeholder (no useAuth(), no API calls), so it is safe
 * to render outside a signed-in session with no changes needed.
 */
export default function TutorPreview() {
  return (
    <>
      <PreviewBanner />
      <TutorWorkspace />
    </>
  );
}
