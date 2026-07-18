#!/usr/bin/env node
/**
 * Build-time prerender step (Stage 1 proof of concept).
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server bundle
 * at dist-server/entry-server.js). Fetches real data from the live API,
 * renders the two proof-of-concept pages with entry-server's `render()`,
 * and writes static HTML snapshots into dist/exercises/<slug>/index.html
 * and dist/events/<slug>/index.html.
 *
 * Vercel's existing vercel.json already serves real files under dist/
 * before falling back to the SPA shell ("handle": "filesystem" first),
 * so these static files are served automatically with no routing changes.
 *
 * Stage 1 scope: exactly two routes (hip-hinge-drill, atlas-stones).
 * Stage 2/3 will extend EXERCISE_SLUGS/EVENT_SLUGS to every published
 * entry using this same script.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(FRONTEND_ROOT, 'dist');

const API_BASE = process.env.VITE_API_URL || 'https://educate-strong-api.onrender.com/api';

// Stage 1 proof-of-concept scope only.
const EXERCISE_SLUGS = ['hip-hinge-drill'];
const EVENT_SLUGS = ['atlas-stones'];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed (${res.status}): ${url}`);
  return res.json();
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

async function main() {
  const { render } = await import(path.join(FRONTEND_ROOT, 'dist-server', 'entry-server.js'));

  const template = await readFile(path.join(DIST_DIR, 'index.html'), 'utf-8');

  console.log(`[prerender] API base: ${API_BASE}`);
  const [allExercises, allEvents] = await Promise.all([
    fetchJson(`${API_BASE}/exercises`),
    fetchJson(`${API_BASE}/events`),
  ]);
  console.log(`[prerender] fetched ${allExercises.length} exercises, ${allEvents.length} events`);

  let written = 0;

  for (const slug of EXERCISE_SLUGS) {
    const exercise = await fetchJson(`${API_BASE}/exercises/${slug}`);
    const { html, meta } = render({
      type: 'exercise',
      url: `/exercises/${slug}`,
      exercise,
      allExercises,
      allEvents,
    });
    const outDir = path.join(DIST_DIR, 'exercises', slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), injectRoot(injectHead(template, meta), html));
    console.log(`[prerender] wrote /exercises/${slug}/index.html`);
    written++;
  }

  for (const slug of EVENT_SLUGS) {
    const event = await fetchJson(`${API_BASE}/events/${slug}`);
    const { html, meta } = render({
      type: 'event',
      url: `/events/${slug}`,
      event,
      allExercises,
      allEvents,
    });
    const outDir = path.join(DIST_DIR, 'events', slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), injectRoot(injectHead(template, meta), html));
    console.log(`[prerender] wrote /events/${slug}/index.html`);
    written++;
  }

  console.log(`[prerender] done — ${written} page(s) prerendered`);
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
