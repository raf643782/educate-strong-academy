/**
 * VideoObjectSchema — emits schema.org VideoObject JSON-LD, but only
 * when every field it needs is a real, already-published value AND
 * the video is confirmed as a genuine, parseable public YouTube URL.
 * If any required condition fails, this renders nothing — it never
 * invents a title, thumbnail, date, or embed URL to complete the
 * object.
 *
 * Vimeo is reserved for future gated course content, so it — and any
 * unknown or missing provider, or a videoUrl that doesn't actually
 * parse as a real YouTube ID — is deliberately excluded rather than
 * treated as "not explicitly Vimeo, so allow it".
 *
 * Uses the same parseYouTubeId/buildYouTubeEmbedUrl functions as
 * EntryVideoPlayer (via lib/videoEmbed) so eligibility here can never
 * drift from what the player itself actually renders.
 */
import { parseYouTubeId, buildYouTubeEmbedUrl } from '../../lib/videoEmbed';

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

  const isExplicitlyYouTube = videoProvider === 'youtube';
  const youTubeId = isExplicitlyYouTube && videoUrl ? parseYouTubeId(videoUrl) : null;

  const hasAllRequiredFields =
    isExplicitlyYouTube &&
    !!youTubeId &&
    !!videoTitle &&
    !!videoDescription &&
    !!thumbnail &&
    !!videoUploadDate;

  if (!hasAllRequiredFields) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: videoTitle,
    description: videoDescription,
    thumbnailUrl: [thumbnail],
    uploadDate: videoUploadDate,
    ...(videoDuration ? { duration: videoDuration } : {}),
    embedUrl: buildYouTubeEmbedUrl(youTubeId as string),
    contentUrl: videoUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
