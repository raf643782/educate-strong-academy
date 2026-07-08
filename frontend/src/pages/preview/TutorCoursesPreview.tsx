import PreviewBanner from '../../components/preview/PreviewBanner';
import TutorCoursesBody from '../../components/tutor/TutorCoursesBody';

/*
 * Internal QA tooling — /portal-preview/tutor/courses
 * basePath="/portal-preview/tutor" keeps "back to workspace" inside
 * the preview experience.
 */
export default function TutorCoursesPreview() {
  return (
    <>
      <PreviewBanner />
      <TutorCoursesBody basePath="/portal-preview/tutor" />
    </>
  );
}
