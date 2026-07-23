/**
 * Vercel serverless function — the only thing standing between
 * /exercises/:slug and /events/:slug and a *real* HTTP status when no
 * prerendered static file exists for that path.
 *
 * Lives here (frontend/api/) rather than at the repository root because
 * this Vercel project's Root Directory is set to frontend/ — only files
 * under this directory are actually deployed. A root-level api/ folder
 * with the same logic also exists in this repo but is not governing any
 * live deployment; see api/library-not-found.mjs's own header for that
 * note. Keep both copies in sync if this logic ever changes.
 *
 * Static SPA hosting cannot, by itself, return anything other than 200
 * for an unmatched path once vercel.json falls back to /index.html —
 * the browser's React Router only decides what to *show* well after
 * the server has already answered. This function sits between the
 * static-file check and that catch-all, specifically for the library
 * routes, so genuinely invalid slugs get a real 404 instead of a
 * client-rendered "not found" page served with a 200.
 *
 * It distinguishes two cases:
 *  - The slug IS a real, published record (just not one of the small
 *    set of statically prerendered pages yet) — serve the normal SPA
 *    shell (200) so the client fetches and renders it exactly as it
 *    does today. This is the common case while only a handful of
 *    entries are prerendered.
 *  - The slug does NOT match any published record — return a real,
 *    noindex, 404 page with a link back to the correct library.
 *
 * On API failure/timeout, this fails OPEN (serves the normal shell)
 * rather than risking a false 404 on a real page during a transient
 * API outage — a wrong "page works" is recoverable by retrying; a
 * false 404 on a real page is a worse failure mode for both users and
 * search engines.
 */

const API_BASE = process.env.VITE_API_URL || 'https://educate-strong-api.onrender.com/api';
const REQUEST_TIMEOUT_MS = 5000;

// Public slug -> real API/database slug. Mirrors
// frontend/src/lib/exerciseSlugs.ts (PUBLIC_TO_API_SLUG) — kept as a
// small standalone copy here because this function is a separate
// Vercel deployment unit (plain .mjs, not built through Vite) and the
// mapping is small and rarely changes. Update both places together.
const PUBLIC_TO_API_EXERCISE_SLUG = {
  'axle-press': 'exercise-axle-press',
  'farmers-walk': 'exercise-farmers-walk',
  'log-press': 'exercise-log-press',
  'yoke-walk': 'exercise-yoke-walk',
  'axle-deadlift': 'axle-deadlift-exercise',
  'circus-dumbbell': 'circus-dumbbell-exercise',
  'duck-walk': 'duck-walk-exercise',
  'frame-carry': 'frame-carry-exercise',
  'front-squat': 'front-squat-exercise',
  'husafell-carry': 'husafell-carry-exercise',
  'power-stairs': 'power-stairs-exercise',
  'stone-to-shoulder': 'stone-to-shoulder-exercise',
  'viking-press': 'viking-press-exercise',
};

async function recordExists(endpoint, publicSlug) {
  const apiSlug =
    endpoint === 'exercises'
      ? PUBLIC_TO_API_EXERCISE_SLUG[publicSlug] ?? publicSlug
      : publicSlug;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/${endpoint}/${encodeURIComponent(apiSlug)}`, {
      signal: controller.signal,
    });
    return res.ok; // true (200) / false (404 from the real API)
  } catch {
    return null; // network error or timeout — unknown, fail open
  } finally {
    clearTimeout(timeout);
  }
}

function notFoundHtml(type, libraryPath, libraryName) {
  const label = type === 'exercise' ? 'exercise' : 'event';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Page Not Found — Educate.Strong Academy</title>
</head>
<body style="background:#0D0D0D;color:#fff;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
  <div style="text-align:center;padding:40px;max-width:480px;">
    <h1 style="font-size:28px;font-weight:900;margin-bottom:12px;">Page not found</h1>
    <p style="color:#999;font-size:14px;line-height:1.6;margin-bottom:20px;">
      This ${label} may have been renamed or is no longer published.
    </p>
    <a href="${libraryPath}" style="color:#A41C64;font-weight:600;text-decoration:none;font-size:14px;">
      Back to the ${libraryName}
    </a>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const type = req.query.type === 'event' ? 'event' : 'exercise';
  const slug = req.query.slug;
  const endpoint = type === 'exercise' ? 'exercises' : 'events';
  const libraryPath = type === 'exercise' ? '/exercises' : '/events';
  const libraryName = type === 'exercise' ? 'Exercise Library' : 'Event Library';

  if (!slug || typeof slug !== 'string') {
    res.setHeader('X-Robots-Tag', 'noindex');
    res.status(404).send(notFoundHtml(type, libraryPath, libraryName));
    return;
  }

  const exists = await recordExists(endpoint, slug);

  if (exists === false) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex');
    res.status(404).send(notFoundHtml(type, libraryPath, libraryName));
    return;
  }

  // exists === true, or exists === null (API unreachable — fail open):
  // serve the real SPA shell so the client renders the page normally.
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const shellRes = await fetch(`${proto}://${req.headers.host}/index.html`);
    const shellHtml = await shellRes.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(shellHtml);
  } catch {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0" /></head><body></body></html>');
  }
}
