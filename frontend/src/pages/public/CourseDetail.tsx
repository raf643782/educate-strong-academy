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
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Badge, { pathwayVariant, levelVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { CONTACT_EMAIL } from '../../lib/contact';
import { UNLAUNCHED_COURSE_SLUGS } from '../../data/courseLaunchStatus';
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
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [slowLoad, setSlowLoad] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [enrolError, setEnrolError] = useState<string | null>(null);

  // Look up rich static data — determines which view to render
  const richData = slug ? COURSE_PAGE_DATA[slug] : undefined;

  useDocumentHead({
    title: course?.title || richData?.headline || 'Course',
    description: richData?.subHeadline || course?.summary || course?.description,
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

  const handleEnrol = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!course) return;
    setEnrolling(true);
    setEnrolError(null);
    try {
      await api.post(`/courses/enrol/${course.id}`);
      setEnrolled(true);
    } catch {
      setEnrolError('Unable to complete enrolment. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

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

  // ── RICH MARKETING PAGE (courses with static data) ────────────────────────
  if (richData) {
    return (
      <div className="min-h-screen flex flex-col" id="course-details" style={{ background: '#050506' }}>
        <Navbar />

        {/* 1 — 2: Trust badges + Hero */}
        <CourseHero
          badges={richData.badges}
          headline={richData.headline}
          subHeadline={richData.subHeadline}
          keyFacts={richData.keyFacts}
          contactEmail={richData.contactEmail}
          isEnrolled={enrolled}
          firstLessonUrl={firstLessonUrl}
          onEnrol={isAuthenticated ? handleEnrol : undefined}
          enrolling={enrolling}
        />

        {enrolError && (
          <div className="py-3 px-4 text-sm text-center" style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.18)', color: '#f87171' }}>
            {enrolError}
          </div>
        )}

        {/* 3: Why this course */}
        <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14 md:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <CourseTutors tutors={richData.tutors} />

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

        {/* 10: Pricing card */}
        <CoursePricingCard
          pricing={richData.pricing}
          contactEmail={richData.contactEmail}
        />

        {/* 11: Dates + Register Interest */}
        <CourseDateSection
          heading={richData.dateHeading}
          copy={richData.dateCopy}
          subCopy={richData.dateSubCopy}
          contactEmail={richData.contactEmail}
          courseTitle={richData.pricing.title}
        />

        {/* 12: Learning journey */}
        <CourseLearningJourney steps={richData.journeySteps} />

        {/* 13: FAQ */}
        <CourseFAQ faqs={richData.faqs} />

        {/* 14: Final CTA */}
        <CourseFinalCTA
          courseTitle={richData.pricing.title}
          contactEmail={richData.contactEmail}
          pricing={{
            totalFee: richData.pricing.totalFee,
            deposit: richData.pricing.deposit,
          }}
        />

        {/* LMS module accordion */}
        {course.modules.length > 0 && (
          <section style={{ background: '#0A0A0D', borderTop: '1px solid rgba(194,24,106,0.08)' }} className="py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="es-label mb-1">Online Materials</p>
                    <h2 className="text-xl font-black text-white mb-1">Online Learning Materials</h2>
                    <p className="text-es-muted text-sm">Pre-course preparation and reference content.</p>
                  </div>
                  {!enrolled && (
                    <button
                      onClick={isAuthenticated ? handleEnrol : () => navigate('/login')}
                      disabled={enrolling}
                      className="btn-secondary text-xs py-2 px-4 flex-shrink-0 disabled:opacity-50"
                    >
                      {enrolling ? 'Enrolling...' : 'Enrol Free'}
                    </button>
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
                        <div className="divide-y divide-es-grey-dark">
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
          <p className="text-lg max-w-2xl leading-relaxed mb-8" style={{ color: '#B8B8BE' }}>{course.description}</p>
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
            <>
              <Button onClick={handleEnrol} disabled={enrolling} size="lg">
                {enrolling ? 'Enrolling...' : 'Enrol Now — Free'}
              </Button>
              {enrolError && (
                <p className="text-sm mt-3" style={{ color: '#f87171' }}>{enrolError}</p>
              )}
            </>
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

      {/* Module list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black text-white mb-6">Course Curriculum</h2>
          <div className="space-y-2">
            {course.modules.map((mod, idx) => (
              <div key={mod.id} className="es-card overflow-hidden">
                <button
                  onClick={() => toggleModule(mod.id)}
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
                    className={`w-4 h-4 text-es-subtle transition-transform ${
                      openModules.has(mod.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openModules.has(mod.id) && (
                  <div className="divide-y divide-es-grey-dark">
                    {mod.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-es-muted">{lesson.title}</span>
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

      <Footer />
    </div>
  );
}
