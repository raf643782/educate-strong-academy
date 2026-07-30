/**
 * Shared YouTube/Vimeo URL parsing and privacy-enhanced embed URL
 * construction. Used by both EntryVideoPlayer (the click-to-load
 * facade) and VideoObjectSchema (structured-data eligibility) so the
 * two can never drift out of sync on what counts as a valid,
 * embeddable video URL.
 */

export function parseYouTubeId(url: string): string | null {
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

export function parseVimeoId(url: string): string | null {
  const patterns = [/player\.vimeo\.com\/video\/(\d+)/, /vimeo\.com\/(\d+)/];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export function buildYouTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&cc_load_policy=1`;
}

export function buildVimeoEmbedUrl(id: string): string {
  return `https://player.vimeo.com/video/${id}?dnt=1`;
}

/** Builds a privacy-enhanced embed URL for the click-to-load facade,
 * or null if the URL doesn't match a supported provider — callers show
 * a failure state rather than attempting to embed an unrecognised
 * source. */
export function buildEmbedSrc(videoUrl: string, provider?: string | null): string | null {
  if (provider !== 'vimeo') {
    const ytId = parseYouTubeId(videoUrl);
    if (ytId) return buildYouTubeEmbedUrl(ytId);
  }
  const vimeoId = parseVimeoId(videoUrl);
  if (vimeoId) return buildVimeoEmbedUrl(vimeoId);
  return null;
}
