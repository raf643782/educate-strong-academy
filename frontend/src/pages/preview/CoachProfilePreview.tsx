import PreviewBanner from '../../components/preview/PreviewBanner';
import CoachProfileBody from '../../components/coach/CoachProfileBody';

/*
 * Internal QA tooling — /portal-preview/coach/profile
 * basePath="/portal-preview/coach" keeps "back to workspace" inside
 * the preview experience.
 */
export default function CoachProfilePreview() {
  return (
    <>
      <PreviewBanner />
      <CoachProfileBody basePath="/portal-preview/coach" />
    </>
  );
}
