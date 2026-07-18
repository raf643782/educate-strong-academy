#!/usr/bin/env node
/**
 * Build-time prerender step.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server
 * bundle at dist-server/entry-server.js). Fetches real data from the
 * live API, renders each page with entry-server's `render()`, and
 * writes static HTML snapshots into dist/exercises/<slug>/index.html
 * and dist/events/<slug>/index.html.
 *
 * Vercel's existing vercel.json already serves real files under dist/
 * before falling back to the SPA shell ("handle": "filesystem" first),
 * so these static files are served automatically with no routing
 * changes beyond the dedicated not-found function (api/library-not-found.mjs)
 * added for slugs that have no static file at all.
 *
 * FAILS THE BUILD (non-zero exit) on any of: API unreachable, API
 * timeout, an empty response where records were expected, a rendered
 * page missing its H1/title/canonical/main content, or the number of
 * pages actually written not matching the number intended. None of
 * these are caught and swallowed — a broken build must not deploy
 * incomplete or broken public pages.
 *
 * Stage 1 scope note: PRERENDER_SLUG_LIMIT restricts the real,
 * API-derived slug list down to the two Stage 1 proof-of-concept pages
 * so this script only writes 2 files today — but the discovery
 * mechanism itself already reads every real published slug from the
 * API, exactly as it will for the full rollout. Removing
 * PRERENDER_SLUG_LIMIT (Stage 2) requires no other code change.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(FRONTEND_ROOT, 'dist');

const API_BASE = process.env.VITE_API_URL || 'https://educate-strong-api.onrender.com/api';
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

// Stage 1 closure: intentionally limit the real, API-derived slug list
// to the two proof-of-concept pages. Remove this line in Stage 2 to
// prerender every published record — no other change required.
const PRERENDER_SLUG_LIMIT = { exercises: ['hip-hinge-drill'], events: ['atlas-stones'] };

class PrerenderError extends Error {}

async function fetchJsonWithRetry(url, { retries = MAX_RETRIES } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        throw new PrerenderError(`Fetch failed (${res.status} ${res.statusText}): ${url}`);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timeout);
      lastErr = err;
      if (attempt < retries) {
        console.warn(`[prerender] fetch attempt ${attempt + 1} failed for ${url} (${err.message}) — retrying`);
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }
  throw new PrerenderError(
    `API request permanently failed after ${retries + 1} attempts: ${url}\nLast error: ${lastErr?.message || lastErr}`
  );
}

function injectHead(html, meta) {
  let out = html;
  out = out.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)} — Educate.Strong Academy</title>`);
  out = out.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );
  out = out.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`
  );
  out = out.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`
  );
  out = out.replace(
    '</head>',
    `    <link rel="canonical" href="${meta.canonical}" />\n  </head>`
  );
  return out;
}

function injectRoot(html, appHtml) {
  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Fails the build loudly if a generated page is missing anything a real
 * public page must have. This is deliberately strict — a page that
 * fails this check must not be written to dist/.
 */
function validateGeneratedPage({ label, html, meta }) {
  const problems = [];

  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gs) || [];
  if (h1Matches.length === 0) problems.push('missing <h1>');
  if (h1Matches.length > 1) problems.push(`expected exactly one <h1>, found ${h1Matches.length}`);

  if (!meta.title || meta.title.trim().length === 0) problems.push('missing/empty title');
  if (!meta.canonical || !meta.canonical.startsWith('http')) problems.push('missing/invalid canonical URL');
  if (!meta.description || meta.description.trim().length === 0) problems.push('missing/empty meta description');

  // Real main content is not just chrome — require a minimum body length
  // beyond Navbar/Footer boilerplate.
  if (!html || html.length < 2000) problems.push(`rendered HTML implausibly short (${html?.length ?? 0} bytes)`);

  if (problems.length > 0) {
    throw new PrerenderError(`Generated page failed validation (${label}):\n - ${problems.join('\n - ')}`);
  }
}

async function main() {
  const { render } = await import(path.join(FRONTEND_ROOT, 'dist-server', 'entry-server.js'));

  const template = await readFile(path.join(DIST_DIR, 'index.html'), 'utf-8');

  console.log(`[prerender] API base: ${API_BASE}`);
  const [allExercises, allEvents] = await Promise.all([
    fetchJsonWithRetry(`${API_BASE}/exercises`),
    fetchJsonWithRetry(`${API_BASE}/events`),
  ]);

  if (!Array.isArray(allExercises) || allExercises.length === 0) {
    throw new PrerenderError(
      `Expected published exercises from ${API_BASE}/exercises but got ${
        Array.isArray(allExercises) ? 'an empty array' : typeof allExercises
      }. Refusing to proceed with an incomplete Exercise Library.`
    );
  }
  if (!Array.isArray(allEvents) || allEvents.length === 0) {
    throw new PrerenderError(
      `Expected published events from ${API_BASE}/events but got ${
        Array.isArray(allEvents) ? 'an empty array' : typeof allEvents
      }. Refusing to proceed with an incomplete Event Library.`
    );
  }
  console.log(`[prerender] fetched ${allExercises.length} exercises, ${allEvents.length} events`);

  const exerciseSlugsToRender = allExercises
    .map(e => e.slug)
    .filter(slug => !PRERENDER_SLUG_LIMIT || PRERENDER_SLUG_LIMIT.exercises.includes(slug));
  const eventSlugsToRender = allEvents
    .map(e => e.slug)
    .filter(slug => !PRERENDER_SLUG_LIMIT || PRERENDER_SLUG_LIMIT.events.includes(slug));

  // Catch a typo'd/removed slug in PRERENDER_SLUG_LIMIT before it silently renders nothing.
  if (PRERENDER_SLUG_LIMIT) {
    for (const slug of PRERENDER_SLUG_LIMIT.exercises) {
      if (!allExercises.some(e => e.slug === slug)) {
        throw new PrerenderError(`PRERENDER_SLUG_LIMIT requested exercise slug "${slug}" but no such published exercise exists.`);
      }
    }
    for (const slug of PRERENDER_SLUG_LIMIT.events) {
      if (!allEvents.some(e => e.slug === slug)) {
        throw new PrerenderError(`PRERENDER_SLUG_LIMIT requested event slug "${slug}" but no such published event exists.`);
      }
    }
  }

  let written = 0;

  for (const slug of exerciseSlugsToRender) {
    const exercise = allExercises.find(e => e.slug === slug);
    const { html, meta } = render({
      type: 'exercise',
      url: `/exercises/${slug}`,
      exercise,
      allExercises,
      allEvents,
    });
    validateGeneratedPage({ label: `/exercises/${slug}`, html, meta });
    const outDir = path.join(DIST_DIR, 'exercises', slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), injectRoot(injectHead(template, meta), html));
    console.log(`[prerender] wrote /exercises/${slug}/index.html`);
    written++;
  }

  for (const slug of eventSlugsToRender) {
    const event = allEvents.find(e => e.slug === slug);
    const { html, meta } = render({
      type: 'event',
      url: `/events/${slug}`,
      event,
      allExercises,
      allEvents,
    });
    validateGeneratedPage({ label: `/events/${slug}`, html, meta });
    const outDir = path.join(DIST_DIR, 'events', slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), injectRoot(injectHead(template, meta), html));
    console.log(`[prerender] wrote /events/${slug}/index.html`);
    written++;
  }

  const intendedCount = exerciseSlugsToRender.length + eventSlugsToRender.length;
  if (written !== intendedCount) {
    throw new PrerenderError(`Expected to write ${intendedCount} page(s) but wrote ${written}.`);
  }

  console.log(`[prerender] done — ${written} page(s) prerendered (of ${allExercises.length + allEvents.length} total published records)`);
}

main().catch(err => {
  console.error('[prerender] BUILD FAILED:', err.message);
  process.exit(1);
});
