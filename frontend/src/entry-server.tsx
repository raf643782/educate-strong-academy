/**
 * Build-time-only SSR entry, used exclusively by scripts/prerender.mjs
 * to produce static HTML snapshots for public Exercise/Event pages.
 *
 * This is NOT the app's client entry (main.tsx is unchanged in terms of
 * *what* it renders — every route still renders the same <App/> tree.
 * What changed in Stage 2 is *how* it mounts: main.tsx now calls
 * hydrateRoot when #root already has prerendered content, so the real
 * work of this file is producing markup — and the exact data that
 * produced it — that the client's first render can reproduce exactly.
 *
 * Renders the real public page shell — Navbar, the page's own content,
 * Footer — wrapped in the real AuthProvider so the real Navbar
 * component can be reused as-is (no separate/duplicated navigation
 * implementation). AuthContext's initial token read is guarded
 * (`typeof window !== 'undefined'`) so it renders its logged-out state
 * here instead of throwing on the missing `localStorage` — real
 * browser behaviour is unchanged, since `window` always exists there,
 * and the *first* client render (before the /auth/me effect resolves)
 * shows the same logged-out state regardless of whether the visitor
 * has a saved token, so hydration matches for both cases.
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ExerciseDetailContent, type Exercise } from './pages/exercises/ExerciseDetail';
import { EventDetailContent, type Event } from './pages/events/EventDetail';
import { buildExerciseMeta, buildEventMeta, type PageMeta } from './lib/libraryMeta';
import { pickRelatedExercises, pickEventsForExercise, pickExercisesForEvent, pickRelatedEvents } from './lib/relatedContent';
import { apiToPublicSlug } from './lib/exerciseSlugs';

export { apiToPublicSlug, API_TO_PUBLIC_SLUG, publicToApiSlug } from './lib/exerciseSlugs';
// Re-exported so the build-time sitemap generator can read the exact same
// Knowledge Hub slugs the site actually renders at /knowledge/:slug. As of
// the Sanity cutover, that's the approved-manifest slug list — not the old
// hardcoded knowledgeArticles.ts array, which /knowledge/:slug no longer
// reads from at all.
export { getApprovedKnowledgeSlugs } from './lib/approvedKnowledgeArticles';

interface ExerciseRenderInput {
  type: 'exercise';
  url: string;
  exercise: Exercise;
  allExercises: Exercise[];
  allEvents: Event[];
}

interface EventRenderInput {
  type: 'event';
  url: string;
  event: Event;
  allExercises: Exercise[];
  allEvents: Event[];
}

export interface RenderResult {
  html: string;
  meta: PageMeta;
  initialData: {
    type: 'exercise' | 'event';
    slug: string;
    record: Exercise | Event;
    relatedExercises: Array<{ slug: string; name: string; category: string }>;
    relatedEvents: Array<{ slug: string; name: string; category: string }>;
  };
}

export function render(input: ExerciseRenderInput | EventRenderInput): RenderResult {
  if (input.type === 'exercise') {
    const relatedExercises = pickRelatedExercises(input.allExercises, input.exercise);
    const relatedEvents = pickEventsForExercise(input.allEvents, input.exercise);

    const content = (
      <ExerciseDetailContent exercise={input.exercise} relatedExercises={relatedExercises} relatedEvents={relatedEvents} />
    );
    const html = renderShell(input.url, content);
    const meta = buildExerciseMeta(input.exercise);

    return {
      html,
      meta,
      initialData: {
        type: 'exercise',
        slug: apiToPublicSlug(input.exercise.slug),
        record: { ...input.exercise, slug: apiToPublicSlug(input.exercise.slug) },
        relatedExercises: relatedExercises.map(e => ({ ...e, slug: apiToPublicSlug(e.slug) })),
        relatedEvents: relatedEvents.map(e => ({ slug: e.slug, name: e.name, category: e.category })),
      },
    };
  }

  const relatedExercises = pickExercisesForEvent(input.allExercises, input.event);
  const relatedEvents = pickRelatedEvents(input.allEvents, input.event);

  const content = (
    <EventDetailContent event={input.event} relatedExercises={relatedExercises} relatedEvents={relatedEvents} />
  );
  const html = renderShell(input.url, content);
  const meta = buildEventMeta(input.event);

  return {
    html,
    meta,
    initialData: {
      type: 'event',
      slug: input.event.slug,
      record: input.event,
      relatedExercises: relatedExercises.map(e => ({ slug: apiToPublicSlug(e.slug), name: e.name, category: e.category })),
      relatedEvents: relatedEvents.map(e => ({ slug: e.slug, name: e.name, category: e.category })),
    },
  };
}

function renderShell(url: string, content: React.ReactNode): string {
  // renderToString (not renderToStaticMarkup) — this output is hydrated
  // by hydrateRoot on the client (main.tsx). renderToStaticMarkup omits
  // the internal markers React needs to match up server and client
  // trees, which silently defeats hydration (React falls back to a full
  // client re-render with no warning) — confirmed by direct testing.
  return renderToString(
    <StaticRouter location={url}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
          <Navbar />
          <main className="flex-1">{content}</main>
          <Footer />
        </div>
      </AuthProvider>
    </StaticRouter>
  );
}
