/**
 * EntryVideoPlayer — the one optional video player on an Exercise or
 * Event dedicated page.
 *
 * Renders nothing at all when there is no videoUrl, so pages without a
 * video make zero requests to YouTube/Vimeo and gain no preconnect —
 * there is nothing here for the browser to discover until a video
 * genuinely exists.
 *
 * When a videoUrl does exist: shows a static poster image behind a
 * keyboard-operable play button (a "facade") in a fixed 16:9 box. The
 * actual YouTube/Vimeo iframe — and everything that comes with it,
 * including its own JS — is only created after a real click, never on
 * page load and never automatically. No autoplay parameter is ever
 * set. The box keeps the same footprint in every state (facade,
 * loading, loaded, error), so nothing on the page moves when the
 * player loads.
 *
 * Embeds are always rewritten to the providers' privacy-enhanced
 * domains/params (youtube-nocookie.com, Vimeo's dnt=1) — never a
 * plain youtube.com/vimeo.com embed.
 */
import { useState } from 'react';

interface EntryVideoPlayerProps {
  videoUrl?: string | null;
  videoProvider?: string | null;
  videoThumbnailUrl?: string | null;
  imageUrl?: string | null;
  videoTitle?: string | null;
  videoDescription?: string | null;
  captionsUrl?: string | null;
  videoTranscript?: string | null;
}

type PlayerState = 'facade' | 'loading' | 'loaded' | 'error';

function parseYouTubeId(url: string): string | null {
  const patterns = [
    /youtube-nocookie\.com\/embed\/([\w-]+)/,
    /youtube\.com\/embed\/([\w-]+)/,
    /youtube\.com\/watch\?v=([\w-]+)/,
    /youtu\.be\/([\w-]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function parseVimeoId(url: string): string | null {
  const patterns = [/player\.vimeo\.com\/video\/(\d+)/, /vimeo\.com\/(\d+)/];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

/** Builds a privacy-enhanced embed URL, or null if the URL doesn't
 * match a supported provider — callers show a failure state rather
 * than attempting to embed an unrecognised source. */
function buildEmbedSrc(videoUrl: string, provider?: string | null): string | null {
  if (provider !== 'vimeo') {
    const ytId = parseYouTubeId(videoUrl);
    if (ytId) return `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&cc_load_policy=1`;
  }
  const vimeoId = parseVimeoId(videoUrl);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?dnt=1`;
  return null;
}

export default function EntryVideoPlayer({
  videoUrl,
  videoProvider,
  videoThumbnailUrl,
  imageUrl,
  videoTitle,
  videoDescription,
  captionsUrl,
  videoTranscript,
}: EntryVideoPlayerProps) {
  const [state, setState] = useState<PlayerState>('facade');

  if (!videoUrl) return null;

  const embedSrc = buildEmbedSrc(videoUrl, videoProvider);
  const poster = videoThumbnailUrl || imageUrl || null;
  const title = videoTitle || 'Video';

  const handleActivate = () => {
    if (!embedSrc) {
      setState('error');
      return;
    }
    setState('loading');
  };

  return (
    <div className="space-y-3">
      <div
        className="aspect-video w-full rounded-xl overflow-hidden relative"
        style={{ background: '#111114' }}
      >
        {(state === 'facade' || state === 'loading') && (
          <>
            {poster ? (
              <img
                src={poster}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1B1B20, #141416)' }} />
            )}
            <button
              type="button"
              onClick={handleActivate}
              aria-label={`Play video: ${title}`}
              disabled={state === 'loading'}
              className="absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-4"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <span
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(164,28,100,0.9)' }}
              >
                {state === 'loading' ? (
                  <span className="w-6 h-6 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
                ) : (
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </span>
            </button>
          </>
        )}

        {state === 'loading' && embedSrc && (
          <iframe
            src={embedSrc}
            title={title}
            className="w-full h-full absolute inset-0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setState('loaded')}
          />
        )}

        {state === 'loaded' && embedSrc && (
          <iframe
            src={embedSrc}
            title={title}
            className="w-full h-full absolute inset-0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {state === 'error' && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-6" style={{ background: '#1B1B20' }}>
            <p className="text-sm text-es-muted">This video could not be loaded.</p>
          </div>
        )}
      </div>

      {videoDescription && (
        <p className="text-xs text-es-subtle leading-relaxed">{videoDescription}</p>
      )}

      {captionsUrl && (
        <a href={captionsUrl} className="text-xs font-semibold es-inline-link" style={{ color: '#A41C64' }}>
          View captions file
        </a>
      )}

      {videoTranscript && (
        <details className="es-card-grey rounded-lg p-4">
          <summary className="es-label cursor-pointer">Video transcript</summary>
          <p className="text-sm text-es-muted leading-relaxed mt-3 whitespace-pre-line">{videoTranscript}</p>
        </details>
      )}
    </div>
  );
}
