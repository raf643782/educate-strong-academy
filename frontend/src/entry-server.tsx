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
import { KnowledgeArticleContent } from './pages/knowledge/KnowledgeArticlePage';
import { CourseDetailContent, type CourseAPI } from './pages/public/CourseDetail';
import { COURSE_PAGE_DATA } from './data/coursePageData';
import { AboutContent } from './pages/public/About';
import { CoachingPathwayContent } from './pages/public/CoachingPathway';
import { StrongKidzContent } from './pages/public/StrongKidz';
import { KnowledgeHubContent } from './pages/knowledge/KnowledgeHub';
import Home from './pages/public/Home';
import CourseCatalogue from './pages/public/CourseCatalogue';
import ExerciseLibrary from './pages/exercises/ExerciseLibrary';
import EventLibrary from './pages/events/EventLibrary';
import EatStrongHub from './pages/bestrong/BeStrongHub';
import CoachDirectory from './pages/public/CoachDirectory';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import RefundPolicy from './pages/public/RefundPolicy';
import { EatStrongArticleContent, type Article as EatStrongArticle, CATEGORY_LABELS, CATEGORY_SLUG } from './pages/bestrong/BeStrongArticlePage';
import { EatStrongCategoryContent, type Article as EatStrongCategoryArticle, type CategoryMeta, CATEGORY_KEY_MAP } from './pages/bestrong/BeStrongCategory';
import { buildExerciseMeta, buildEventMeta, buildKnowledgeArticleMeta, buildCourseMeta, type PageMeta } from './lib/libraryMeta';
import { SITE_URL } from './lib/siteUrl';
import { pickRelatedExercises, pickEventsForExercise, pickExercisesForEvent, pickRelatedEvents } from './lib/relatedContent';
import { apiToPublicSlug } from './lib/exerciseSlugs';
import type { KnowledgeArticle } from './data/knowledgeArticles';

export { apiToPublicSlug, API_TO_PUBLIC_SLUG, publicToApiSlug } from './lib/exerciseSlugs';
// Stage 8: re-exported so the build-time sitemap generator can read the
// exact same Knowledge Hub article list the site actually renders (the
// hardcoded array, not the separate/different DB-seeded KnowledgeArticle
// table the frontend does not read from) — one source, no drift.
export { KNOWLEDGE_ARTICLES } from './data/knowledgeArticles';

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

    // Convert to public slug here so BreadcrumbSchema and ArticleSchema in
    // ExerciseDetailContent produce correct absolute URLs — matching the
    // record the client reads from __ES_LIBRARY_DATA__ (which also uses
    // the public slug). Without this, all 29 exercise BreadcrumbLists
    // have the spurious `exercise-` API prefix in position-3's item URL.
    const exercise = { ...input.exercise, slug: apiToPublicSlug(input.exercise.slug) };
    const relatedExercisesPublic = relatedExercises.map(e => ({ ...e, slug: apiToPublicSlug(e.slug) }));

    const content = (
      <ExerciseDetailContent exercise={exercise} relatedExercises={relatedExercisesPublic} relatedEvents={relatedEvents} />
    );
    const html = renderShell(input.url, content);
    const meta = buildExerciseMeta(exercise);

    return {
      html,
      meta,
      initialData: {
        type: 'exercise',
        slug: exercise.slug,
        record: exercise,
        relatedExercises: relatedExercisesPublic.map(e => ({ slug: e.slug, name: e.name, category: e.category })),
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

export interface KnowledgeRenderResult {
  html: string;
  meta: PageMeta;
}

export function renderKnowledge(article: KnowledgeArticle): KnowledgeRenderResult {
  const content = <KnowledgeArticleContent article={article} />;
  const html = renderShell(`/knowledge/${article.slug}`, content);
  const meta = buildKnowledgeArticleMeta(article);
  return { html, meta };
}

export interface CourseRenderResult {
  html: string;
  meta: PageMeta;
  coursePayload: { type: 'course'; slug: string; course: CourseAPI };
}

export function renderCourse(course: CourseAPI): CourseRenderResult {
  const richData = COURSE_PAGE_DATA[course.slug];
  const content = (
    <CourseDetailContent
      course={course}
      richData={richData}
      isEnrolled={false}
      openModules={new Set()}
    />
  );
  // Course pages use #050506 background — passed so renderShell matches
  // what CourseDetail's client-side default export renders.
  const html = renderShell(`/courses/${course.slug}`, content, '#050506');
  const meta = buildCourseMeta(course, richData);
  const coursePayload = { type: 'course' as const, slug: course.slug, course };
  return { html, meta, coursePayload };
}

export interface StaticPageResult {
  html: string;
  meta: PageMeta;
}

export function renderAbout(): StaticPageResult {
  const html = renderShell('/about', <AboutContent />);
  return {
    html,
    meta: {
      title: 'About',
      description: 'Meet the team behind Educate.Strong Academy — champions and coaches building the standard for Strongman education.',
      canonical: `${SITE_URL}/about`,
      ogTitle: 'About — Educate Strong Academy',
      ogDescription: 'Meet the team behind Educate.Strong Academy — champions and coaches building the standard for Strongman education.',
    },
  };
}

export function renderCoachingPathway(): StaticPageResult {
  const html = renderShell('/coaching', <CoachingPathwayContent />, '#050506');
  return {
    html,
    meta: {
      title: 'Coaching Pathway',
      description: 'Level 1 through Level 3 Strongman coaching qualifications and ongoing CPD — the full path to becoming an accredited Strongman coach.',
      canonical: `${SITE_URL}/coaching`,
      ogTitle: 'Coaching Pathway — Educate Strong Academy',
      ogDescription: 'Level 1 through Level 3 Strongman coaching qualifications and ongoing CPD.',
    },
  };
}

export function renderStrongKidz(): StaticPageResult {
  const html = renderShell('/strongkidz', <StrongKidzContent />, '#050506');
  return {
    html,
    meta: {
      title: 'StrongKidz — Youth Strength Programme in Sheffield',
      description: "StrongKidz is Educate Strong's youth strength programme in Sheffield — movement, confidence and positive experiences of strength for children.",
      canonical: `${SITE_URL}/strongkidz`,
      ogTitle: 'StrongKidz — Youth Strength and Coach Education',
      ogDescription: "StrongKidz — youth strength programme and coach certification for adults working with children.",
    },
  };
}

export function renderKnowledgeHub(): StaticPageResult {
  const html = renderShell('/knowledge', <KnowledgeHubContent />);
  return {
    html,
    meta: {
      title: 'Knowledge Hub — Coaching Intelligence',
      description: 'Practical articles, coaching guides, and evidence-based resources for Strongman coaches, referees, and athletes.',
      canonical: `${SITE_URL}/knowledge`,
      ogTitle: 'Knowledge Hub — Educate Strong Academy',
      ogDescription: 'Practical articles, coaching guides, and evidence-based resources for Strongman coaches, referees, and athletes.',
    },
  };
}

export function renderHome(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/">
      <AuthProvider>
        <Home />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'Strongman Coaching, Refereeing and Strength Education',
      description: 'Learn how strength is built through Strongman. Coaching, refereeing, StrongKidz and EatStrong — plus a full Knowledge Hub, Exercise Library and Event Library. Built and taught by people who compete.',
      canonical: SITE_URL,
      ogTitle: 'Educate.Strong Academy: Strongman Coaching, Refereeing and Strength Education',
      ogDescription: 'Learn how strength is built through Strongman. Coaching, refereeing, StrongKidz and EatStrong — plus a full Knowledge Hub, Exercise Library and Event Library. Built and taught by people who compete.',
    },
  };
}

export function renderCourseCatalogue(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/courses">
      <AuthProvider>
        <CourseCatalogue />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'All Courses',
      description: 'Browse all Strongman coaching, refereeing and youth development qualifications from Educate.Strong Academy.',
      canonical: `${SITE_URL}/courses`,
      ogTitle: 'All Courses — Educate.Strong Academy',
      ogDescription: 'Browse all Strongman coaching, refereeing and youth development qualifications from Educate.Strong Academy.',
    },
  };
}

export function renderExerciseLibrary(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/exercises">
      <AuthProvider>
        <ExerciseLibrary />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'Strongman Exercise Library | Technique and Training Guides',
      description: 'Technique guides, video breakdowns and coaching cues for every major Strongman movement — free and open access.',
      canonical: `${SITE_URL}/exercises`,
      ogTitle: 'Strongman Exercise Library — Educate.Strong Academy',
      ogDescription: 'Technique guides, video breakdowns and coaching cues for every major Strongman movement — free and open access.',
    },
  };
}

export function renderEventLibrary(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/events">
      <AuthProvider>
        <EventLibrary />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'Strongman Event Library | Rules, Judging and Training',
      description: 'Rules, judging standards and event-specific training guides for every Strongman discipline — written by certified referees and coaches.',
      canonical: `${SITE_URL}/events`,
      ogTitle: 'Strongman Event Library — Educate.Strong Academy',
      ogDescription: 'Rules, judging standards and event-specific training guides for every Strongman discipline — written by certified referees and coaches.',
    },
  };
}

export function renderEatStrong(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/eatstrong">
      <AuthProvider>
        <EatStrongHub />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'EatStrong | Nutrition for Strongman',
      description: 'Practical nutrition guidance for Strongman athletes — from competition-day fuelling to long-term strength nutrition, written for the sport.',
      canonical: `${SITE_URL}/eatstrong`,
      ogTitle: 'EatStrong — Nutrition for Strongman | Educate.Strong Academy',
      ogDescription: 'Practical nutrition guidance for Strongman athletes — from competition-day fuelling to long-term strength nutrition, written for the sport.',
    },
  };
}

export { CATEGORY_KEY_MAP };

export function renderCoachDirectory(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/coaches">
      <AuthProvider>
        <CoachDirectory />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'Find a Certified Strongman Coach',
      description: 'Directory of certified Strongman coaches and referees from Educate.Strong Academy — find a coach near you.',
      canonical: `${SITE_URL}/coaches`,
      ogTitle: 'Coach Directory — Educate.Strong Academy',
      ogDescription: 'Directory of certified Strongman coaches and referees from Educate.Strong Academy — find a coach near you.',
    },
  };
}

export function renderEatStrongArticle(article: EatStrongArticle): StaticPageResult {
  const categorySlug = CATEGORY_SLUG[article.category] || article.category.toLowerCase();
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const html = renderToString(
    <StaticRouter location={`/eatstrong/articles/${article.slug}`}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
          <Navbar />
          <EatStrongArticleContent
            article={article}
            categorySlug={categorySlug}
            categoryLabel={categoryLabel}
          />
          <Footer />
        </div>
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: article.title,
      description: article.summary || `${categoryLabel} — EatStrong nutrition guidance for Strongman athletes.`,
      canonical: `${SITE_URL}/eatstrong/articles/${article.slug}`,
      ogTitle: `${article.title} — EatStrong`,
      ogDescription: article.summary || `${categoryLabel} — EatStrong nutrition guidance for Strongman athletes.`,
    },
  };
}

export function renderEatStrongCategory(
  categorySlug: string,
  categoryKey: string,
  articles: EatStrongCategoryArticle[],
  categoryMeta: CategoryMeta | null,
): StaticPageResult {
  const categoryLabel = categoryMeta?.label || categoryKey.replace(/_/g, ' ');
  const html = renderToString(
    <StaticRouter location={`/eatstrong/category/${categorySlug}`}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
          <Navbar />
          <EatStrongCategoryContent
            articles={articles}
            categoryMeta={categoryMeta}
            categorySlug={categorySlug}
            categoryKey={categoryKey}
          />
          <Footer />
        </div>
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: `${categoryLabel} — EatStrong`,
      description: categoryMeta?.description || `${categoryLabel} nutrition resources for Strongman athletes.`,
      canonical: `${SITE_URL}/eatstrong/category/${categorySlug}`,
      ogTitle: `${categoryLabel} — EatStrong | Educate.Strong Academy`,
      ogDescription: categoryMeta?.description || `${categoryLabel} nutrition resources for Strongman athletes.`,
    },
  };
}

export function renderTerms(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/terms">
      <AuthProvider>
        <Terms />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'Terms of Service',
      description: 'Terms of Service for Educate.Strong Academy — covering course bookings, accounts, and acceptable use.',
      canonical: `${SITE_URL}/terms`,
      ogTitle: 'Terms of Service — Educate.Strong Academy',
      ogDescription: 'Terms of Service for Educate.Strong Academy — covering course bookings, accounts, and acceptable use.',
    },
  };
}

export function renderPrivacy(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/privacy">
      <AuthProvider>
        <Privacy />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'Privacy Policy',
      description: 'Privacy Policy for Educate.Strong Academy — explaining what personal data we collect and how we use it.',
      canonical: `${SITE_URL}/privacy`,
      ogTitle: 'Privacy Policy — Educate.Strong Academy',
      ogDescription: 'Privacy Policy for Educate.Strong Academy — explaining what personal data we collect and how we use it.',
    },
  };
}

export function renderRefundPolicy(): StaticPageResult {
  const html = renderToString(
    <StaticRouter location="/refund-policy">
      <AuthProvider>
        <RefundPolicy />
      </AuthProvider>
    </StaticRouter>
  );
  return {
    html,
    meta: {
      title: 'Refund & Cancellation Policy',
      description: 'Refund and cancellation policy for Educate.Strong Academy courses and bookings.',
      canonical: `${SITE_URL}/refund-policy`,
      ogTitle: 'Refund & Cancellation Policy — Educate.Strong Academy',
      ogDescription: 'Refund and cancellation policy for Educate.Strong Academy courses and bookings.',
    },
  };
}

function renderShell(url: string, content: React.ReactNode, background = '#0D0D0D'): string {
  // renderToString (not renderToStaticMarkup) — this output is hydrated
  // by hydrateRoot on the client (main.tsx). renderToStaticMarkup omits
  // the internal markers React needs to match up server and client
  // trees, which silently defeats hydration (React falls back to a full
  // client re-render with no warning) — confirmed by direct testing.
  return renderToString(
    <StaticRouter location={url}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col" style={{ background }}>
          <Navbar />
          <main className="flex-1">{content}</main>
          <Footer />
        </div>
      </AuthProvider>
    </StaticRouter>
  );
}
