/**
 * VideoPlaceholder — used when a video URL has not yet been confirmed.
 *
 * If videoUrl is provided, renders an iframe embed.
 * If not, renders a placeholder with a clear label.
 *
 * Only YouTube and Vimeo embed URLs are accepted.
 * Do not attempt to self-host video at this stage.
 */

interface VideoPlaceholderProps {
  label: string;
  videoUrl?: string;
  className?: string;
  title?: string;
}

function isValidEmbedUrl(url: string): boolean {
  return (
    url.includes('youtube.com/embed/') ||
    url.includes('youtu.be/') ||
    url.includes('player.vimeo.com/video/')
  );
}

export default function VideoPlaceholder({
  label,
  videoUrl,
  className = '',
  title = 'Video',
}: VideoPlaceholderProps) {
  const hasVideo = videoUrl && isValidEmbedUrl(videoUrl);

  return (
    <div className={`aspect-video rounded-xl overflow-hidden ${className}`}>
      {hasVideo ? (
        <iframe
          src={videoUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full bg-gray-900 border border-dashed border-gray-700 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 text-center px-6 leading-snug">{label}</p>
          <p className="text-xs text-gray-700 mt-1">Provide a YouTube or Vimeo embed URL</p>
        </div>
      )}
    </div>
  );
}
