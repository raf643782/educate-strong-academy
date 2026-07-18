/**
 * Shared metadata builders for Exercise/Event dedicated pages. Used by
 * both the client-side page component (via useDocumentHead) and the
 * build-time prerender script, so the two can never drift apart —
 * both compute title/description/canonical from the same real record
 * through this one function.
 */
import { SITE_URL } from './siteUrl';

export interface ExerciseLike {
  name: string;
  slug: string;
  category: string;
  description: string | null;
}

export interface EventLike {
  name: string;
  slug: string;
  category: string;
  description?: string;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
}

export function buildExerciseMeta(exercise: ExerciseLike): PageMeta {
  const title = `${exercise.name} — Coaching Cues, Technique and Common Mistakes`;
  const description =
    exercise.description ||
    `${exercise.name} — technique, coaching cues and common mistakes from the Educate Strong Exercise Library.`;
  return {
    title,
    description,
    canonical: `${SITE_URL}/exercises/${exercise.slug}`,
    ogTitle: `${exercise.name} — Educate Strong Exercise Library`,
    ogDescription: description,
  };
}

export function buildEventMeta(event: EventLike): PageMeta {
  const title = `${event.name} — Rules, Judging and Training`;
  const description =
    event.description ||
    `${event.name} — competition format, judging criteria and training guidance from the Educate Strong Event Library.`;
  return {
    title,
    description,
    canonical: `${SITE_URL}/events/${event.slug}`,
    ogTitle: `${event.name} — Educate Strong Event Library`,
    ogDescription: description,
  };
}
