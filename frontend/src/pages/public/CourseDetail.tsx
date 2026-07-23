/**
 * CourseDetail — public course page.
 *
 * For courses with rich marketing data (COURSE_PAGE_DATA lookup):
 *   Renders the full 14-section marketing page with all course components.
 *
 * For courses without rich data (future Level 2, Level 3 etc.):
 *   Falls back to the simple API-driven view until data is added.
 *
 * LMS enrolment (online pre/post-course materials) is maintained
 * as a secondary action alongside the primary in-person booking flow.
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Badge, { pathwayVariant, levelVariant } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { CONTACT_EMAIL } from '../../lib/contact';
import { UNLAUNCHED_COURSE_SLUGS } from '../../data/courseLaunchStatus';
import { COURSE_SLUG_TO_INTEREST_TYPE } from '../../data/registerInterestTypes';
import { useDocumentHead } from '../../hooks/useDocumentHead';

// Rich course page components
import CourseHero from '../../components/course/CourseHero';
import CourseTutors from '../../components/course/CourseTutors';
import CourseAudience from '../../components/course/CourseAudience';
import CourseCurriculumGrid from '../../components/course/CourseCurriculumGrid';
import CourseLearningOutcomes from '../../components/course/CourseLearningOutcomes';
import CoursePractical from '../../components/course/CoursePractical';
import CourseQualification from '../../components/course/CourseQualification';
import CourseEndorsements from '../../components/course/CourseEndorsements';
import CoursePricingCard from '../../components/course/CoursePricingCard';
import CourseDateSection from '../../components/course/CourseDateSection';
import CourseLearningJourney from '../../components/course/CourseLearningJourney';
import CourseFAQ from '../../components/course/CourseFAQ';
import CourseFinalCTA from '../../components/course/CourseFinalCTA';
import CourseAccessOverview from '../../components/course/CourseAccessOverview';

// Static marketing data
import { COURSE_PAGE_DATA } from '../../data/coursePageData';

// ─── API types ────────────────────────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  type: string;
  durationMinutes?: number;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface CourseAPI {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary?: string;
  pathway: string;
  level: number;
  durationHours?: number;
  prerequisites?: string;
  modules: Module[];
}

const pathwayLabel = (p: string) =>
  p === 'COACHING' ? 'Coaching' : p === 'REFEREEING' ? 'Refereeing' : 'StrongKidz';

// ─── Main component ───────────────────────────────────────────────────────────

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState<CourseAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [slowLoad, setSlowLoad] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  // Look up rich static data — determines which view to render
  const richData = slug ? COURSE_PAGE_DATA[slug] : undefined;

  useDocumentHead({
    title: richData?.metaTitle || course?.title || richData?.headline || 'Course',
    description: richData?.subHeadline || course?.summary || course?.description,
    canonical: slug ? `https://educate-strong-academy.vercel.app/courses/${slug}` : undefined,
  });

  const loadCourse = () => {
    if (!slug) return;
    setLoading(true);
    setLoadError(false);
    setSlowLoad(false);
    api
      .get(`/courses/${slug}`)
      .then((res) => setCourse(res.data))
      .catch((err) => {
        if (err?.response?.status === 404) setCourse(null);
        else setLoadError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourse(); }, [slug]);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setSlowLoad(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  // Course access is granted by an admin (see Enrolment Manager), not
  // self-service — this checks real enrolment status so a learner who
  // has been admin-enrolled sees "Continue Learning" correctly.
  useEffect(() => {
    if (!isAuthenticated || !slug) return;
    api
      .get<{ enrolled: boolean }>(`/courses/${slug}/enrolled`)
      .then(res => setEnrolled(res.data.enrolled))
      .catch(() => {});
  }, [isAuthenticated, slug]);

  // Course + FAQPage + BreadcrumbList structured data — only for the rich
  // marketing pages, only built from data that's actually visible on the
  // page (real price, real published FAQs, the real breadcrumb above the
  // hero). Scoped and removed on unmount/navigation so it never leaks.
  useEffect(() => {
    if (!richData || !course) return;
    const scriptId = 'course-schema';
    const url = `https://educate-strong-academy.vercel.app/courses/${richData.slug}`;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Course',
          name: course.title,
          description: richData.subHeadline,
          provider: {
            '@type': 'Organization',
            name: 'Educate Strong Academy',
            sameAs: 'https://educate-strong-academy.vercel.app/',
          },
          url,
          offers: {
            '@type': 'Offer',
            price: richData.pricing.totalFee,
            priceCurrency: 'GBP',
            url,
            availability: 'https://schema.org/InStock',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: richData.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Courses', item: 'https://educate-strong-academy.vercel.app/courses' },
            { '@type': 'ListItem', position: 2, name: course.title, item: url },
          ],
        },
      ],
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [richData, course]);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-sm gap-2" style={{ color: '#75757D', background: '#050506' }}>
          <div className="animate-pulse" style={{ width: '220px', height: '16px', background: '#151519', borderRadius: '8px' }} />
          <p>{slowLoad ? 'Waking the server, this can take a few seconds on first load.' : 'Loading course...'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Load error (distinct from not-found)
  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center" style={{ background: '#050506', padding: '80px 0' }}>
            <h2 className="text-2xl font-bold text-white mb-2">Couldn't load this course</h2>
            <p className="text-sm mb-4" style={{ color: '#75757D' }}>Something went wrong. Please try again.</p>
            <button onClick={loadCourse} className="btn-primary">Retry</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center" style={{ background: '#050506', padding: '80px 0' }}>
            <h2 className="text-2xl font-bold text-white mb-2">Course not found</h2>
            <Link to="/courses" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#C2186A' }}>
              Back to catalogue
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const firstLessonId = course.modules[0]?.lessons[0]?.id;
  const firstLessonUrl = firstLessonId
    ? `/learn/${course.slug}/lessons/${firstLessonId}`
    : undefined;
  const comingSoon = UNLAUNCHED_COURSE_SLUGS.has(course.slug);
  const interestType = COURSE_SLUG_TO_INTEREST_TYPE[course.slug] || 'general';

  // ── RICH MARKETING PAGE (courses with static data) ────────────────────────
  if (richData) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
        <Navbar />

        {/* Breadcrumb — also the internal link back to the course catalogue */}
        <nav aria-label="Breadcrumb" className="pt-navbar" style={{ background: '#050506' }}>
          <div className="es-container-wide pt-4">
            <ol className="flex items-center gap-2 text-xs" style={{ color: '#75757D' }}>
              <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white/70">{course.title}</li>
            </ol>
          </div>
        </nav>

        {/* 1 — 2: Trust badges + Hero */}
        <CourseHero
          eyebrow={richData.eyebrow}
          badges={richData.badges}
          headline={richData.headline}
          subHeadline={richData.subHeadline}
          keyFacts={richData.keyFacts}
          contactEmail={richData.contactEmail}
          interestType={interestType}
          isEnrolled={enrolled}
          firstLessonUrl={firstLessonUrl}
        />

        {/* 3: Why this course */}
        <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14 md:py-18">
          <div className="es-container-wide">
            <div className="max-w-3xl">
              <p className="es-label mb-3">Overview</p>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>
                {richData.whyHeading}
              </h2>
              <p className="text-es-muted leading-relaxed text-base">{richData.whyCopy}</p>
            </div>
          </div>
        </section>

        {/* 4: Tutors — high up for credibility */}
        <CourseTutors heading={richData.tutorsHeading} tutors={richData.tutors} />

        {/* 5: Who this is for */}
        <CourseAudience
          cards={richData.audienceCards}
          prerequisiteStatement={richData.prerequisiteStatement}
        />

        {/* 6: What you will learn */}
        <CourseCurriculumGrid
          heading={richData.curriculumHeading}
          intro={richData.curriculumIntro}
          items={richData.curriculumItems}
        />

        {/* 7: Learning outcomes */}
        <CourseLearningOutcomes
          heading={richData.outcomesHeading}
          intro={richData.outcomesIntro}
          outcomes={richData.outcomes}
        />

        {/* 8: Practical experience */}
        <CoursePractical
          heading={richData.practicalHeading}
          copy={richData.practicalCopy}
          features={richData.practicalFeatures}
          mediaUrl={richData.practicalMediaUrl}
          mediaAlt={richData.practicalMediaAlt}
        />

        {/* 9: Qualification OR Endorsements */}
        {richData.showQualification &&
          richData.qualificationHeading &&
          richData.qualificationCopy && (
            <CourseQualification
              heading={richData.qualificationHeading}
              copy={richData.qualificationCopy}
              detail={richData.qualificationDetail}
            />
          )}

        {richData.showEndorsements && richData.endorsements && (
          <CourseEndorsements endorsements={richData.endorsements} />
        )}

        {/* 9.5: How access works — public preview vs. learner pathway */}
        {!enrolled && <CourseAccessOverview interestType={interestType} />}

        {/* 10: Pricing card */}
        <CoursePricingCard
          pricing={richData.pricing}
          contactEmail={richData.contactEmail}
          interestType={interestType}
        />

        {/* 11: Dates + Register Interest */}
        <CourseDateSection
          heading={richData.dateHeading}
          copy={richData.dateCopy}
          subCopy={richData.dateSubCopy}
          contactEmail={richData.contactEmail}
          courseTitle={richData.pricing.title}
          interestType={interestType}
          courseSlug={richData.slug === 'level-1-coaching-strongman' ? richData.slug : undefined}
        />

        {/* 12: Learning journey */}
        <CourseLearningJourney steps={richData.journeySteps} isEnrolled={enrolled} />

        {/* 13: FAQ */}
        <CourseFAQ faqs={richData.faqs} />

        {/* 13.5: Continue exploring — internal links into the rest of the Academy */}
        <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14">
          <div className="es-container-wide">
            <p className="es-label mb-3">Continue Exploring</p>
            <h2 className="text-xl font-black text-white mb-6">
              {richData.slug === 'level-1-strongman-refereeing' ? 'Related Rules, Judging and Coaching Resources' : 'Related Pathways and Resources'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(richData.slug === 'level-1-strongman-refereeing'
                ? [
                    { label: 'Course Catalogue', to: '/courses', desc: 'Browse every Educate Strong course and certification.' },
                    { label: 'Event Library', to: '/events', desc: 'How each Strongman event works, event by event.' },
                    { label: 'Rules Vary: How Strongman Judging Standards Work', to: '/knowledge/rules-vary-strongman-judging', desc: 'Knowledge Hub article on judging consistency.' },
                    { label: 'Good Lift vs No Lift', to: '/knowledge/good-lift-vs-no-lift', desc: 'Developing consistent officiating decisions.' },
                    { label: 'Understanding Lockout Criteria', to: '/knowledge/understanding-lockout-criteria', desc: 'Lockout standards across different events.' },
                    { label: 'Coaching Pathway', to: '/coaching', desc: 'See the full coaching qualification pathway.' },
                    { label: 'About and Our Tutors', to: '/about', desc: "Meet the people delivering this certification." },
                  ]
                : [
                    { label: 'Coaching Pathway', to: '/coaching', desc: 'See Level 1 in context, including Level 2 and Level 3 progression.' },
                    { label: 'Course Catalogue', to: '/courses', desc: 'Browse every Educate Strong course and certification.' },
                    { label: 'Exercise Library', to: '/exercises', desc: 'Technique breakdowns for individual lifts and events.' },
                    { label: 'Event Library', to: '/events', desc: 'How each Strongman event works, event by event.' },
                    { label: 'Teaching the Hip Hinge', to: '/knowledge/teaching-the-hip-hinge', desc: "A coach's framework from the Knowledge Hub." },
                    { label: 'Risk Assessment for Strongman Environments', to: '/knowledge/risk-assessment-strongman-environments', desc: 'Safety planning for coaching sessions.' },
                    { label: 'EatStrong', to: '/eatstrong', desc: 'Performance nutrition education for coaches and athletes.' },
                    { label: 'About and Our Tutors', to: '/about', desc: 'Meet the people delivering this qualification.' },
                  ]
              ).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="es-card p-4 block transition-colors hover:border-es-accent"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <p className="font-semibold text-white text-sm mb-1">{link.label}</p>
                  <p className="text-xs text-es-subtle leading-relaxed">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 14: Final CTA */}
        <CourseFinalCTA
          courseTitle={richData.pricing.title}
          contactEmail={richData.contactEmail}
          interestType={interestType}
          pricing={{
            totalFee: richData.pricing.totalFee,
            deposit: richData.pricing.deposit,
          }}
        />

        {/* LMS module accordion */}
        {course.modules.length > 0 && (
          <section style={{ background: '#0A0A0D', borderTop: '1px solid rgba(194,24,106,0.08)' }} className="py-14">
            <div className="es-container-wide">
              <div className="max-w-3xl">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="es-label mb-1">Online Materials</p>
                    <h2 className="text-xl font-black text-white mb-1">Online Learning Materials</h2>
                    <p className="text-es-muted text-sm">Pre-course preparation and reference content.</p>
                  </div>
                  {!enrolled && (
                    <Link
                      to={`/register-interest?type=${encodeURIComponent(interestType)}`}
                      className="btn-secondary text-xs py-2 px-4 flex-shrink-0"
                    >
                      Register Interest
                    </Link>
                  )}
                  {enrolled && firstLessonUrl && (
                    <Link to={firstLessonUrl} className="btn-primary text-xs py-2 px-4 flex-shrink-0">
                      Start Learning
                    </Link>
                  )}
                </div>

                <div className="space-y-2">
                  {course.modules.map((mod, idx) => (
                    <div
                      key={mod.id}
                      className="es-card overflow-hidden"
                    >
                      <button
                        onClick={() => toggleModule(mod.id)}
                        aria-expanded={openModules.has(mod.id)}
                        aria-controls={`module-panel-${mod.id}`}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-es-card transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-es-grey text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-white text-sm">{mod.title}</p>
                            <p className="text-xs text-es-subtle mt-0.5">
                              {mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <svg
                          aria-hidden="true"
                          className={`w-4 h-4 text-es-subtle transition-transform ${
                            openModules.has(mod.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openModules.has(mod.id) && (
                        <div id={`module-panel-${mod.id}`} className="divide-y divide-es-grey-dark">
                          {mod.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between px-5 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <svg
                                  className="w-4 h-4 text-es-subtle flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                <span className="text-sm text-es-muted">{lesson.title}</span>
                              </div>
                              {lesson.durationMinutes && (
                                <span className="text-xs text-es-subtle">{lesson.durationMinutes}m</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    );
  }

  // ── FALLBACK: Simple API-driven view for courses without rich data ─────────
  // (Level 2, Level 3, StrongKidz etc. until static data is added)
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />

      {/* Simple hero */}
      <div
        className="pt-navbar py-16"
        style={{
          background: [
            'radial-gradient(ellipse 90% 70% at 30% -10%, rgba(164,28,100,0.22) 0%, transparent 55%)',
            '#050506',
          ].join(', '),
          borderBottom: '1px solid rgba(194,24,106,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex gap-2 flex-wrap">
            <Badge variant={pathwayVariant(course.pathway)}>{pathwayLabel(course.pathway)}</Badge>
            <Badge variant={levelVariant(course.level)}>Level {course.level}</Badge>
            {comingSoon && <span className="badge-amber">Coming Soon</span>}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 max-w-3xl leading-tight">
            {course.title}
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed mb-8" style={{ color: '#B8B8BE' }}>
            {course.slug === 'strongkidz-coach-education'
              ? 'Full details of this course, including its curriculum, are being finalised by Educate.Strong and will be published once confirmed.'
              : course.description}
          </p>
          <div className="flex items-center gap-6 text-sm mb-8" style={{ color: '#75757D' }}>
            {course.durationHours && <span>{course.durationHours} hours</span>}
            <span>{course.modules.length} modules</span>
          </div>

          {comingSoon ? (
            <span
              className="inline-block font-semibold px-6 py-3 rounded-full text-sm"
              style={{ background: 'rgba(225,154,71,0.12)', border: '1px solid rgba(225,154,71,0.3)', color: '#E19A47' }}
            >
              Coming Soon — Not Yet Open for Enrolment
            </span>
          ) : enrolled ? (
            <div className="flex gap-3 flex-wrap">
              <span
                className="font-semibold px-6 py-3 rounded-full text-sm text-white"
                style={{ background: 'rgba(164,28,100,0.20)', border: '1px solid rgba(194,24,106,0.40)', color: '#C2186A' }}
              >
                Enrolled
              </span>
              {firstLessonUrl && (
                <Link
                  to={firstLessonUrl}
                  className="font-semibold px-6 py-3 rounded-full text-sm text-white transition-all duration-200 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 4px 18px rgba(164,28,100,0.35)' }}
                >
                  Go to First Lesson
                </Link>
              )}
            </div>
          ) : (
            <Link
              to={`/register-interest?type=${encodeURIComponent(interestType)}`}
              className="font-semibold px-6 py-3 rounded-full text-sm text-white transition-all duration-200 hover:scale-105 inline-block"
              style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 4px 18px rgba(164,28,100,0.35)' }}
            >
              Register Interest
            </Link>
          )}
        </div>
      </div>

      {/* Coming soon notice for un-detailed courses */}
      <div style={{ background: 'rgba(225,154,71,0.06)', borderBottom: '1px solid rgba(225,154,71,0.18)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm" style={{ color: '#E19A47' }}>
            Full course details for this qualification are being prepared. Contact{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline"
            >
              {CONTACT_EMAIL}
            </a>{' '}
            for more information.
          </p>
        </div>
      </div>

      {/* Curriculum — withheld from public view for un-detailed courses until
          confirmed content is available; the database records themselves are
          untouched, only the public presentation is suppressed here. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black text-white mb-4">Course Curriculum</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#75757D' }}>
            Full curriculum details for this course are being finalised and will be published here once confirmed.
          </p>
        </div>
      </div>

      {!enrolled && <CourseAccessOverview interestType={interestType} />}

      <Footer />
    </div>
  );
}
