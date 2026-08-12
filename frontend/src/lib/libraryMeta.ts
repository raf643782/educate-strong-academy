/**
 * Shared metadata builders for Exercise/Event dedicated pages. Used by
 * both the client-side page component (via useDocumentHead) and the
 * build-time prerender script, so the two can never drift apart —
 * both compute title/description/canonical from the same real record
 * through this one function.
 */
import { SITE_URL } from './siteUrl';
import { apiToPublicSlug } from './exerciseSlugs';

export interface ExerciseLike {
  name: string;
  slug: string;
  category: string;
  description: string | null;
  imageUrl?: string | null;
}

export interface EventLike {
  name: string;
  slug: string;
  category: string;
  description?: string;
  imageUrl?: string | null;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
}

export function buildExerciseMeta(exercise: ExerciseLike): PageMeta {
  const title = `${exercise.name} — Coaching Cues, Technique and Common Mistakes`;
  const description =
    exercise.description ||
    `${exercise.name} — technique, coaching cues and common mistakes from the Educate Strong Exercise Library.`;
  return {
    title,
    description,
    canonical: `${SITE_URL}/exercises/${apiToPublicSlug(exercise.slug)}`,
    ogTitle: `${exercise.name} — Educate Strong Exercise Library`,
    ogDescription: description,
    ...(exercise.imageUrl ? { ogImage: exercise.imageUrl } : {}),
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
    ...(event.imageUrl ? { ogImage: event.imageUrl } : {}),
  };
}

export interface KnowledgeArticleLike {
  slug: string;
  title: string;
  summary: string;
}

export function buildKnowledgeArticleMeta(article: KnowledgeArticleLike): PageMeta {
  return {
    title: `${article.title} — Knowledge Hub`,
    description: article.summary,
    canonical: `${SITE_URL}/knowledge/${article.slug}`,
    ogTitle: `${article.title} — Educate Strong Knowledge Hub`,
    ogDescription: article.summary,
  };
}

export interface CourseLike {
  slug: string;
  title: string;
  description: string;
  summary?: string;
}

export interface CourseRichData {
  metaTitle?: string;
  subHeadline: string;
}

export function buildCourseMeta(course: CourseLike, richData?: CourseRichData): PageMeta {
  const title = richData?.metaTitle || `${course.title} — Educate Strong Academy`;
  const description = richData?.subHeadline || course.summary || course.description;
  return {
    title,
    description,
    canonical: `${SITE_URL}/courses/${course.slug}`,
    ogTitle: title,
    ogDescription: description,
  };
}
