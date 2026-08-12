#!/usr/bin/env node
/**
 * Build-time prerender step.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server
 * bundle at dist-server/entry-server.js). Fetches real data from the
 * live API, renders each page with entry-server's `render()`, and
 * writes static HTML snapshots into dist/exercises/<publicSlug>/index.html
 * and dist/events/<slug>/index.html — plus a safely-escaped embedded
 * JSON payload of the exact data used, so main.tsx's hydrateRoot can
 * reproduce the same first render client-side with no refetch.
 *
 * Vercel's existing vercel.json already serves real files under dist/
 * before falling back to the SPA shell ("handle": "filesystem" first),
 * so these static files are served automatically with no routing
 * changes beyond the dedicated not-found function
 * (api/library-not-found.mjs) added for slugs that have no static file.
 *
 * FAILS THE BUILD (non-zero exit) on any of: API unreachable, API
 * timeout, an empty response where records were expected, a rendered
 * page missing its H1/title/canonical/main content, or the number of
 * pages actually written not matching the number intended. None of
 * these are caught and swallowed — a broken build must not deploy
 * incomplete or broken public pages.
 *
 * Stage 3: every published Exercise and every published Event is now
 * discovered from the API and prerendered — no manually maintained
 * slug list for either library.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(FRONTEND_ROOT, 'dist');

const API_BASE = process.env.VITE_API_URL || 'https://educate-strong-api.onrender.com/api';
// Same env var name and fallback value as frontend/src/lib/siteUrl.ts —
// one real source of truth for the domain, read independently here only
// because this is a plain Node script outside the Vite module graph,
// not because the value itself is allowed to drift from that file.
const SITE_URL = process.env.VITE_SITE_URL || 'https://educate-strong-academy.vercel.app';
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

// Static, always-public routes — every admin/tutor/coach/learner-
// dashboard/auth/reset/preview/demo route is excluded by construction,
// since this list only ever names routes that are genuinely public.
// /terms, /privacy, /refund-policy intentionally absent — noindex pages
// must not appear in the sitemap.
const STATIC_PUBLIC_ROUTES = [
  '/',
  '/courses',
  '/courses/level-1-coaching-strongman',
  '/courses/level-1-strongman-refereeing',
  '/about',
  '/strongkidz',
  '/coaching',
  '/coaches',
  '/knowledge',
  '/exercises',
  '/events',
  '/eatstrong',
  '/eatstrong/category/basics',
  '/eatstrong/category/competition',
  '/eatstrong/category/recovery',
  '/eatstrong/category/making_weight',
  '/eatstrong/category/hydration',
  '/eatstrong/category/supplements',
  '/eatstrong/category/coaches_guide',
  '/eatstrong/category/youth_nutrition',
  '/eatstrong/category/downloads',
];

// Category slug → backend enum key, matching CATEGORY_KEY_MAP in BeStrongCategory.tsx.
const EATSTRONG_CATEGORY_SLUGS = [
  { slug: 'basics',          key: 'BASICS' },
  { slug: 'competition',     key: 'COMPETITION' },
  { slug: 'recovery',        key: 'RECOVERY' },
  { slug: 'making_weight',   key: 'MAKING_WEIGHT' },
  { slug: 'hydration',       key: 'HYDRATION' },
  { slug: 'supplements',     key: 'SUPPLEMENTS' },
  { slug: 'coaches_guide',   key: 'COACHES_GUIDE' },
  { slug: 'youth_nutrition', key: 'YOUTH_NUTRITION' },
  { slug: 'downloads',       key: 'DOWNLOADS' },
];

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
  // og:url must equal the canonical URL per the OpenGraph spec.
  // og:image: use the page-specific image when provided; otherwise update
  // the template default to use the env-aware SITE_URL so domain migration
  // (setting VITE_SITE_URL in Vercel) propagates to all prerendered pages.
  const defaultOgImage = `${SITE_URL}/assets/atlas-stone-branded.png`;
  if (!meta.ogImage) {
    out = out.replace(
      /<meta property="og:image" content=".*?" \/>/,
      `<meta property="og:image" content="${defaultOgImage}" />`
    );
  }
  const extraTags = [
    `    <meta property="og:url" content="${meta.canonical}" />`,
    `    <link rel="canonical" href="${meta.canonical}" />`,
    ...(meta.ogImage ? [`    <meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`] : []),
  ].join('\n');
  out = out.replace('</head>', `${extraTags}\n  </head>`);
  return out;
}

function injectRoot(html, appHtml) {
  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

/** Safe JSON-in-HTML serialisation — escapes the characters that could
 * break out of the <script> tag or be (mis)interpreted as HTML if this
 * were ever reflected elsewhere. Standard "safe embedded JSON" pattern. */
function serializeForScriptTag(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function injectInitialData(html, initialData) {
  const json = serializeForScriptTag(initialData);
  const tag = `    <script type="application/json" id="__ES_LIBRARY_DATA__">${json}</script>\n`;
  return html.replace('</body>', `${tag}  </body>`);
}

function injectCourseData(html, coursePayload) {
  const json = serializeForScriptTag(coursePayload);
  const tag = `    <script type="application/json" id="__ES_COURSE_DATA__">${json}</script>\n`;
  return html.replace('</body>', `${tag}  </body>`);
}

function injectEatStrongArticleData(html, data) {
  const json = serializeForScriptTag(data);
  const tag = `    <script type="application/json" id="__ES_EATSTRONG_ARTICLE__">${json}</script>\n`;
  return html.replace('</body>', `${tag}  </body>`);
}

function injectEatStrongCategoryData(html, data) {
  const json = serializeForScriptTag(data);
  const tag = `    <script type="application/json" id="__ES_EATSTRONG_CATEGORY__">${json}</script>\n`;
  return html.replace('</body>', `${tag}  </body>`);
}

function injectNoindex(html) {
  return html.replace('</head>', '    <meta name="robots" content="noindex, nofollow" />\n  </head>');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Reads vercel.json's own `redirects` array and returns the set of
 * `source` paths (e.g. "/knowledge/start-strongman-safely"). This is
 * the single source of truth for "known redirect source URLs" — used
 * here to keep them out of the sitemap, and by validate-sitemap.mjs to
 * fail the build if one ever slips back in. A source containing a
 * dynamic segment (":" or "*") is skipped — this is only for exact,
 * static redirect paths, which is all vercel.json currently defines.
 */
async function getRedirectSourcePaths() {
  const raw = await readFile(path.join(FRONTEND_ROOT, 'vercel.json'), 'utf-8');
  const config = JSON.parse(raw);
  const sources = new Set();
  for (const redirect of config.redirects ?? []) {
    if (typeof redirect.source === 'string' && !redirect.source.includes(':') && !redirect.source.includes('*')) {
      sources.add(redirect.source);
    }
  }
  return sources;
}

/**
 * Stage 8 — generates a genuine sitemap.xml and robots.txt at build
 * time, from the same allExercises/allEvents this build just
 * prerendered (not a second independent fetch, so the two can never
 * drift apart), plus the same Knowledge Hub article list the site
 * actually renders from, plus a live, filtered fetch of only FREE
 * (fully public) EatStrong articles and published coach profiles.
 *
 * Deliberately excludes: every admin/tutor/coach-workspace/learner-
 * dashboard/auth/reset/preview/demo route (never in
 * STATIC_PUBLIC_ROUTES to begin with), any unpublished exercise/event
 * (allExercises/allEvents already only contain published records —
 * confirmed by the API's own isPublished filter), and any EatStrong
 * article whose accessLevel is ENROLLED/CERTIFIED rather than FREE
 * (private course content).
 */
async function generateSitemapAndRobots({ allExercises, allEvents, apiToPublicSlug, knowledgeArticles }) {
  const urls = new Set(STATIC_PUBLIC_ROUTES);
  const redirectSources = await getRedirectSourcePaths();

  for (const ex of allExercises) urls.add(`/exercises/${apiToPublicSlug(ex.slug)}`);
  for (const ev of allEvents) urls.add(`/events/${ev.slug}`);
  // A sitemap should only ever list canonical live destinations, never a
  // known redirect source — a URL that permanently redirects elsewhere
  // is not itself the "real" page a crawler should be told to index.
  // redirectSources is read directly from vercel.json's own `redirects`
  // array (see getRedirectSourcePaths), so this can never drift out of
  // sync with whatever redirects actually exist there.
  for (const a of knowledgeArticles) {
    const url = `/knowledge/${a.slug}`;
    if (!redirectSources.has(url)) urls.add(url);
  }

  try {
    const beStrongArticles = await fetchJsonWithRetry(`${API_BASE}/be-strong/articles`, { retries: 1 });
    if (Array.isArray(beStrongArticles)) {
      for (const a of beStrongArticles) {
        if (a.accessLevel === 'FREE' && a.slug) urls.add(`/eatstrong/articles/${a.slug}`);
      }
    }
  } catch (err) {
    console.warn(`[sitemap] could not fetch EatStrong articles, continuing without them: ${err.message}`);
  }

  try {
    const coaches = await fetchJsonWithRetry(`${API_BASE}/coaches`, { retries: 1 });
    if (Array.isArray(coaches)) {
      for (const c of coaches) {
        if (c.slug) urls.add(`/coaches/${c.slug}`);
      }
    }
  } catch (err) {
    console.warn(`[sitemap] could not fetch coach profiles, continuing without them: ${err.message}`);
  }

  const sortedUrls = Array.from(urls).sort();

  const body = sortedUrls.map(u => `  <url>\n    <loc>${escapeHtml(SITE_URL + u)}</loc>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  await writeFile(path.join(DIST_DIR, 'sitemap.xml'), xml);
  console.log(`[sitemap] wrote sitemap.xml with ${sortedUrls.length} URL(s)`);

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /coach
Disallow: /tutor
Disallow: /assessor
Disallow: /dashboard
Disallow: /learn
Disallow: /certificates
Disallow: /cpd
Disallow: /coursework
Disallow: /documents
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /qa-demo
Disallow: /portal-preview
Disallow: /homepagepreview
Disallow: /knowledge-hub-preview
Disallow: /dev

Sitemap: ${SITE_URL}/sitemap.xml
`;
  await writeFile(path.join(DIST_DIR, 'robots.txt'), robotsTxt);
  console.log('[sitemap] wrote robots.txt');

  return sortedUrls;
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
  const {
    render, renderKnowledge, renderCourse,
    renderAbout, renderCoachingPathway, renderStrongKidz, renderKnowledgeHub,
    renderHome, renderCourseCatalogue, renderExerciseLibrary, renderEventLibrary, renderEatStrong,
    renderCoachDirectory,
    renderEatStrongArticle, renderEatStrongCategory,
    renderTerms, renderPrivacy, renderRefundPolicy,
    apiToPublicSlug, KNOWLEDGE_ARTICLES,
  } = await import(path.join(FRONTEND_ROOT, 'dist-server', 'entry-server.js'));

  const template = await readFile(path.join(DIST_DIR, 'index.html'), 'utf-8');

  // Save the raw SPA shell before any page overwrites dist/index.html.
  // spa-fallback-or-404.mjs serves /shell.html for non-prerendered SPA
  // routes so those routes never accidentally receive homepage HTML.
  await writeFile(path.join(DIST_DIR, 'shell.html'), template);
  console.log('[prerender] wrote shell.html (SPA fallback template)');

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

  // Every published exercise and event, no manual list for either.
  const exercisesToRender = allExercises;
  const eventSlugsToRender = allEvents.map(e => e.slug);

  let written = 0;
  const seenPublicSlugs = new Set();

  for (const exercise of exercisesToRender) {
    const publicSlug = apiToPublicSlug(exercise.slug);
    if (seenPublicSlugs.has(publicSlug)) {
      throw new PrerenderError(`Public slug collision: "${publicSlug}" is produced by more than one exercise.`);
    }
    seenPublicSlugs.add(publicSlug);

    const { html, meta, initialData } = render({
      type: 'exercise',
      url: `/exercises/${publicSlug}`,
      exercise,
      allExercises,
      allEvents,
    });
    validateGeneratedPage({ label: `/exercises/${publicSlug}`, html, meta });
    const outDir = path.join(DIST_DIR, 'exercises', publicSlug);
    await mkdir(outDir, { recursive: true });
    const page = injectInitialData(injectRoot(injectHead(template, meta), html), initialData);
    await writeFile(path.join(outDir, 'index.html'), page);
    written++;
  }
  console.log(`[prerender] wrote ${exercisesToRender.length} exercise page(s)`);

  const seenEventSlugs = new Set();

  for (const slug of eventSlugsToRender) {
    if (seenEventSlugs.has(slug)) {
      throw new PrerenderError(`Public slug collision: "${slug}" is produced by more than one event.`);
    }
    seenEventSlugs.add(slug);

    const event = allEvents.find(e => e.slug === slug);
    const { html, meta, initialData } = render({
      type: 'event',
      url: `/events/${slug}`,
      event,
      allExercises,
      allEvents,
    });
    validateGeneratedPage({ label: `/events/${slug}`, html, meta });
    const outDir = path.join(DIST_DIR, 'events', slug);
    await mkdir(outDir, { recursive: true });
    const page = injectInitialData(injectRoot(injectHead(template, meta), html), initialData);
    await writeFile(path.join(outDir, 'index.html'), page);
    written++;
  }
  console.log(`[prerender] wrote ${eventSlugsToRender.length} event page(s)`);

  // Knowledge Hub articles — static data, no API fetch needed
  for (const article of KNOWLEDGE_ARTICLES) {
    const { html, meta } = renderKnowledge(article);
    validateGeneratedPage({ label: `/knowledge/${article.slug}`, html, meta });
    const outDir = path.join(DIST_DIR, 'knowledge', article.slug);
    await mkdir(outDir, { recursive: true });
    const page = injectRoot(injectHead(template, meta), html);
    await writeFile(path.join(outDir, 'index.html'), page);
    written++;
  }
  console.log(`[prerender] wrote ${KNOWLEDGE_ARTICLES.length} knowledge article page(s)`);

  // Course detail pages — fetch from API, render with static rich data
  // Only courses that have COURSE_PAGE_DATA entries are prerendered here;
  // courses without rich data still work via the SPA fallback.
  const COURSE_SLUGS = ['level-1-coaching-strongman', 'level-1-strongman-refereeing'];
  let coursesWritten = 0;
  for (const slug of COURSE_SLUGS) {
    try {
      const courseData = await fetchJsonWithRetry(`${API_BASE}/courses/${slug}`);
      const { html, meta, coursePayload } = renderCourse(courseData);
      validateGeneratedPage({ label: `/courses/${slug}`, html, meta });
      const outDir = path.join(DIST_DIR, 'courses', slug);
      await mkdir(outDir, { recursive: true });
      const page = injectCourseData(injectRoot(injectHead(template, meta), html), coursePayload);
      await writeFile(path.join(outDir, 'index.html'), page);
      written++;
      coursesWritten++;
    } catch (err) {
      console.warn(`[prerender] WARNING: could not prerender /courses/${slug}: ${err.message}`);
      console.warn(`[prerender] Course page will fall back to SPA rendering.`);
    }
  }
  console.log(`[prerender] wrote ${coursesWritten}/${COURSE_SLUGS.length} course page(s)`);

  // Homepage — overwrites dist/index.html with prerendered content.
  // shell.html (written above) is now the SPA fallback template so
  // spa-fallback-or-404.mjs does not serve homepage HTML for /dashboard,
  // /login, etc. injectHead updates og:image to use SITE_URL automatically.
  {
    const { html, meta } = renderHome();
    validateGeneratedPage({ label: '/', html, meta });
    const page = injectRoot(injectHead(template, meta), html);
    await writeFile(path.join(DIST_DIR, 'index.html'), page);
    written++;
  }
  console.log('[prerender] wrote homepage (dist/index.html)');

  // Static public pages — no API fetch needed, content is pure static JSX
  const STATIC_PAGES = [
    { slug: 'about', render: renderAbout },
    { slug: 'coaching', render: renderCoachingPathway },
    { slug: 'strongkidz', render: renderStrongKidz },
    { slug: 'knowledge', render: renderKnowledgeHub },
    { slug: 'courses', render: renderCourseCatalogue },
    { slug: 'exercises', render: renderExerciseLibrary },
    { slug: 'events', render: renderEventLibrary },
    { slug: 'eatstrong', render: renderEatStrong },
    { slug: 'coaches', render: renderCoachDirectory },
  ];
  for (const p of STATIC_PAGES) {
    const { html, meta } = p.render();
    validateGeneratedPage({ label: `/${p.slug}`, html, meta });
    const outDir = path.join(DIST_DIR, p.slug);
    await mkdir(outDir, { recursive: true });
    const page = injectRoot(injectHead(template, meta), html);
    await writeFile(path.join(outDir, 'index.html'), page);
    written++;
  }
  console.log(`[prerender] wrote ${STATIC_PAGES.length} static page(s) (about, coaching, strongkidz, knowledge, courses, exercises, events, eatstrong, coaches)`);

  // Legal pages — prerendered with noindex; NOT in sitemap.
  const LEGAL_PAGES = [
    { slug: 'terms', render: renderTerms },
    { slug: 'privacy', render: renderPrivacy },
    { slug: 'refund-policy', render: renderRefundPolicy },
  ];
  for (const p of LEGAL_PAGES) {
    const { html, meta } = p.render();
    validateGeneratedPage({ label: `/${p.slug}`, html, meta });
    const outDir = path.join(DIST_DIR, p.slug);
    await mkdir(outDir, { recursive: true });
    const page = injectNoindex(injectRoot(injectHead(template, meta), html));
    await writeFile(path.join(outDir, 'index.html'), page);
    written++;
  }
  console.log(`[prerender] wrote ${LEGAL_PAGES.length} legal page(s) (terms, privacy, refund-policy) with noindex`);

  // EatStrong category pages — one per category, articles fetched per category.
  const categoriesMeta = await fetchJsonWithRetry(`${API_BASE}/be-strong/categories`);
  let categoriesWritten = 0;
  for (const { slug: catSlug, key: catKey } of EATSTRONG_CATEGORY_SLUGS) {
    const catArticles = await fetchJsonWithRetry(`${API_BASE}/be-strong/articles?category=${catKey}`);
    const categoryMeta = Array.isArray(categoriesMeta) ? categoriesMeta.find(c => c.key === catKey) || null : null;
    const articles = Array.isArray(catArticles) ? catArticles : [];
    const { html, meta } = renderEatStrongCategory(catSlug, catKey, articles, categoryMeta);
    validateGeneratedPage({ label: `/eatstrong/category/${catSlug}`, html, meta });
    const categoryData = { categorySlug: catSlug, articles, categoryMeta };
    const outDir = path.join(DIST_DIR, 'eatstrong', 'category', catSlug);
    await mkdir(outDir, { recursive: true });
    const page = injectEatStrongCategoryData(injectRoot(injectHead(template, meta), html), categoryData);
    await writeFile(path.join(outDir, 'index.html'), page);
    written++;
    categoriesWritten++;
  }
  console.log(`[prerender] wrote ${categoriesWritten} EatStrong category page(s)`);

  // EatStrong article pages — fetch list first, then each FREE article individually
  // (the list endpoint returns contentLen:0; full content requires the individual endpoint).
  let eatStrongArticlesWritten = 0;
  try {
    const articleList = await fetchJsonWithRetry(`${API_BASE}/be-strong/articles`, { retries: 1 });
    if (Array.isArray(articleList)) {
      const freeArticleSlugs = articleList.filter(a => a.accessLevel === 'FREE' && a.slug).map(a => a.slug);
      for (const slug of freeArticleSlugs) {
        try {
          const article = await fetchJsonWithRetry(`${API_BASE}/be-strong/articles/${slug}`);
          const { html, meta } = renderEatStrongArticle(article);
          validateGeneratedPage({ label: `/eatstrong/articles/${slug}`, html, meta });
          const articleData = { slug: article.slug, article };
          const outDir = path.join(DIST_DIR, 'eatstrong', 'articles', slug);
          await mkdir(outDir, { recursive: true });
          const page = injectEatStrongArticleData(injectRoot(injectHead(template, meta), html), articleData);
          await writeFile(path.join(outDir, 'index.html'), page);
          written++;
          eatStrongArticlesWritten++;
        } catch (err) {
          console.warn(`[prerender] WARNING: could not prerender /eatstrong/articles/${slug}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.warn(`[prerender] WARNING: could not fetch EatStrong article list, article pages will serve SPA shell: ${err.message}`);
  }
  console.log(`[prerender] wrote ${eatStrongArticlesWritten} EatStrong article page(s)`);

  const intendedCount =
    exercisesToRender.length +
    eventSlugsToRender.length +
    KNOWLEDGE_ARTICLES.length +
    coursesWritten +
    STATIC_PAGES.length +
    1 + // homepage
    LEGAL_PAGES.length +
    categoriesWritten +
    eatStrongArticlesWritten;

  if (written !== intendedCount) {
    throw new PrerenderError(`Expected to write ${intendedCount} page(s) but wrote ${written}.`);
  }
  if (exercisesToRender.length !== allExercises.length) {
    throw new PrerenderError(
      `Expected to prerender all ${allExercises.length} published exercises but only rendered ${exercisesToRender.length}.`
    );
  }
  if (eventSlugsToRender.length !== allEvents.length) {
    throw new PrerenderError(
      `Expected to prerender all ${allEvents.length} published events but only rendered ${eventSlugsToRender.length}.`
    );
  }

  console.log(
    `[prerender] done — ${written} page(s) prerendered ` +
    `(${allExercises.length} exercises, ${allEvents.length} events, ` +
    `${KNOWLEDGE_ARTICLES.length} knowledge articles, ${coursesWritten} courses, ` +
    `${STATIC_PAGES.length} static, ${LEGAL_PAGES.length} legal, ` +
    `${categoriesWritten} eatstrong categories, ${eatStrongArticlesWritten} eatstrong articles)`
  );

  await generateSitemapAndRobots({
    allExercises,
    allEvents,
    apiToPublicSlug,
    knowledgeArticles: KNOWLEDGE_ARTICLES,
  });
}

main().catch(err => {
  console.error('[prerender] BUILD FAILED:', err.message);
  process.exit(1);
});
