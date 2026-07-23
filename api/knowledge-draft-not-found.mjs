/**
 * Vercel serverless function — returns a genuine HTTP 404 for Knowledge
 * Hub article slugs that exist only as unpublished editorial drafts.
 * These slugs are never present in frontend/src/data/knowledgeArticles.ts,
 * so the SPA itself has no way to tell "not yet published" apart from
 * "never existed" — both currently render the same client-side "Article
 * not found" fallback, served with a 200 (static SPA hosting cannot, by
 * itself, return anything other than 200 once vercel.json falls back to
 * /index.html; the browser's React Router only decides what to *show*
 * well after the server has already answered).
 *
 * Mirrors api/library-not-found.mjs's approach for the Exercise/Event
 * libraries, but simpler: there is no live record to check for
 * existence via an API call. A request reaching this function has, by
 * definition, matched a vercel.json rule for a specific, known,
 * permanently-unpublished draft slug — so it always 404s. It never
 * reads or serves the draft's own content.
 */

const KNOWLEDGE_NOT_FOUND_HTML = `<!DOCTYPE html>
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
      This article is not currently published.
    </p>
    <a href="/knowledge" style="color:#A41C64;font-weight:600;text-decoration:none;font-size:14px;">
      Back to the Knowledge Hub
    </a>
  </div>
</body>
</html>`;

export default function handler(_req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.status(404).send(KNOWLEDGE_NOT_FOUND_HTML);
}
