import PreviewBanner from '../../components/preview/PreviewBanner';
import TutorProfileBody from '../../components/tutor/TutorProfileBody';

/*
 * Internal QA tooling — /portal-preview/tutor/profile
 * basePath="/portal-preview/tutor" keeps "back to workspace" inside
 * the preview experience.
 */
export default function TutorProfilePreview() {
  return (
    <>
      <PreviewBanner />
      <TutorProfileBody basePath="/portal-preview/tutor" />
    </>
  );
}
