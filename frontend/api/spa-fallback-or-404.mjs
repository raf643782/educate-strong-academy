/**
 * Vercel serverless function — the final fallback rewrite, replacing
 * the previous unconditional `/(.*) -> /index.html` rule.
 *
 * Static SPA hosting cannot, by itself, return anything other than 200
 * for a genuinely unknown path once it falls back to /index.html — the
 * client's React Router only decides what to *show* well after the
 * server has already answered. Real static files (JS/CSS/images,
 * sitemap.xml, robots.txt, prerendered Exercise/Event pages) are all
 * served by Vercel's own filesystem check before any rewrite is even
 * considered, and the more specific existing rewrites (the children's
 * safety draft, Exercise/Event slug validation) are matched before this
 * one — this function only ever runs as the last resort.
 *
 * It checks the request path's *first segment* only, against the exact
 * set of top-level route prefixes frontend/src/App.tsx actually
 * defines. A path under a real section (e.g. /courses/anything,
 * /admin/anything, /learn/anything) still gets the normal SPA shell
 * (200) exactly as before — React Router's own client-side catch-all
 * (`<Route path="*">`) already handles an invalid *sub*-path within a
 * real section correctly, the same "fail open within a known area"
 * principle already used by library-not-found.mjs. Only a path whose
 * first segment matches nothing here — the case an old bookmark, a
 * typo, a bot, or a malicious scan is actually likely to hit — gets a
 * genuine 404.
 *
 * KEEP THIS LIST IN SYNC with the top-level path segments in
 * frontend/src/App.tsx's <Route> table if routes are ever added or
 * removed. Missing an entry here would incorrectly 404 a real page —
 * a worse failure than the status quo — so double-check against
 * App.tsx directly rather than assuming this list is exhaustive.
 */
const KNOWN_TOP_LEVEL_SEGMENTS = new Set([
  'courses', 'login', 'qa-demo', 'portal-preview', 'homepagepreview',
  'register', 'forgot-password', 'reset-password', 'verify-email',
  'about', 'strongkidz', 'coaching', 'coaches', 'verify', 'shop',
  'register-interest', 'terms', 'privacy', 'refund-policy', 'knowledge',
  'exercises', 'events', 'eatstrong', 'be-strong', 'dashboard', 'learn',
  'certificates', 'cpd', 'coursework', 'documents', 'coach', 'tutor',
  'assessor', 'admin',
]);

function notFoundHtml() {
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
      The page you're looking for doesn't exist or may have moved.
    </p>
    <a href="/" style="color:#A41C64;font-weight:600;text-decoration:none;font-size:14px;">
      Back to Educate.Strong Academy
    </a>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const firstSegment = url.pathname.split('/').filter(Boolean)[0];

  if (!firstSegment || KNOWN_TOP_LEVEL_SEGMENTS.has(firstSegment)) {
    // Root path, or a real top-level section — serve the normal SPA
    // shell exactly as the previous catch-all rewrite always did.
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
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.status(404).send(notFoundHtml());
}
