/**
 * Build-time-only SSR entry, used exclusively by scripts/prerender.mjs
 * to produce static HTML snapshots for public Exercise/Event pages.
 *
 * This is NOT the app's client entry (main.tsx is unchanged — every
 * route, including these two, still mounts client-side via a plain
 * `createRoot().render()`, exactly as before). This entry renders the
 * real public page shell — Navbar, the page's own content, Footer —
 * wrapped in the real AuthProvider so the real Navbar component can be
 * reused as-is (no separate/duplicated navigation implementation).
 *
 * AuthContext's initial token read is guarded (`typeof window !==
 * 'undefined'`) so it renders its logged-out state here instead of
 * throwing on the missing `localStorage` — real browser behaviour is
 * unchanged, since `window` always exists there.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ExerciseDetailContent, type Exercise } from './pages/exercises/ExerciseDetail';
import { EventDetailContent, type Event } from './pages/events/EventDetail';
import { buildExerciseMeta, buildEventMeta, type PageMeta } from './lib/libraryMeta';
import { pickRelatedExercises, pickEventsForExercise, pickExercisesForEvent, pickRelatedEvents } from './lib/relatedContent';

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

export function render(input: ExerciseRenderInput | EventRenderInput): { html: string; meta: PageMeta } {
  const content =
    input.type === 'exercise' ? (
      <ExerciseDetailContent
        exercise={input.exercise}
        relatedExercises={pickRelatedExercises(input.allExercises, input.exercise)}
        relatedEvents={pickEventsForExercise(input.allEvents, input.exercise)}
      />
    ) : (
      <EventDetailContent
        event={input.event}
        relatedExercises={pickExercisesForEvent(input.allExercises, input.event)}
        relatedEvents={pickRelatedEvents(input.allEvents, input.event)}
      />
    );

  const html = renderToStaticMarkup(
    <StaticRouter location={input.url}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
          <Navbar />
          <main className="flex-1">{content}</main>
          <Footer />
        </div>
      </AuthProvider>
    </StaticRouter>
  );

  const meta = input.type === 'exercise' ? buildExerciseMeta(input.exercise) : buildEventMeta(input.event);

  return { html, meta };
}
