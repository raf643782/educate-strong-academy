/**
 * VideoObjectSchema — emits schema.org VideoObject JSON-LD, but only
 * when every field it needs is a real, already-published value. If
 * any required field is missing, this renders nothing — it never
 * invents a title, thumbnail, or date to complete the object.
 *
 * Also withheld for Vimeo entries: per the Stage 6 media architecture,
 * Vimeo is reserved for future gated course content, and structured
 * data must not advertise content that isn't publicly accessible.
 * Only YouTube (public) videos are eligible.
 */
interface VideoObjectSchemaProps {
  videoUrl?: string | null;
  videoProvider?: string | null;
  videoTitle?: string | null;
  videoDescription?: string | null;
  videoThumbnailUrl?: string | null;
  imageUrl?: string | null;
  videoUploadDate?: string | null;
  videoDuration?: string | null;
}

export default function VideoObjectSchema({
  videoUrl,
  videoProvider,
  videoTitle,
  videoDescription,
  videoThumbnailUrl,
  imageUrl,
  videoUploadDate,
  videoDuration,
}: VideoObjectSchemaProps) {
  const thumbnail = videoThumbnailUrl || imageUrl;
  const isPublic = videoProvider !== 'vimeo';

  const hasAllRequiredFields =
    !!videoUrl && !!thumbnail && !!videoUploadDate && !!videoTitle && !!videoDescription && isPublic;

  if (!hasAllRequiredFields) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: videoTitle,
    description: videoDescription,
    thumbnailUrl: [thumbnail],
    uploadDate: videoUploadDate,
    ...(videoDuration ? { duration: videoDuration } : {}),
    embedUrl: videoUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
