/**
 * Build-time-only SSR entry, used exclusively by scripts/prerender.mjs
 * to produce static HTML snapshots for public Exercise/Event pages.
 *
 * This is intentionally NOT the app's client entry (main.tsx is
 * unchanged) and does NOT render Navbar/Footer/AuthProvider — those
 * depend on browser-only APIs (localStorage, in AuthContext) that don't
 * exist in this Node build. It renders only the unique per-page content
 * (breadcrumb, H1, technique/rules, related links) that a crawler or
 * unfurler needs — the client bundle renders the full page with
 * navigation chrome immediately after, exactly as it does for every
 * other route today.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
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
  const body =
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
    <StaticRouter location={input.url}>{body}</StaticRouter>
  );

  const meta = input.type === 'exercise' ? buildExerciseMeta(input.exercise) : buildEventMeta(input.event);

  return { html, meta };
}
