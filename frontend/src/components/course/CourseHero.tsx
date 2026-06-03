import CourseBadgeRow from './CourseBadgeRow';

interface CourseHeroProps {
  badges: string[];
  headline: string;
  subHeadline: string;
  keyFacts: string[];
  contactEmail: string;
  // LMS enrolment state (optional — used when user is logged in)
  isEnrolled?: boolean;
  firstLessonUrl?: string;
  onEnrol?: () => void;
  enrolling?: boolean;
}

export default function CourseHero({
  badges,
  headline,
  subHeadline,
  keyFacts,
  contactEmail,
  isEnrolled,
  firstLessonUrl,
  onEnrol,
  enrolling,
}: CourseHeroProps) {
  const securePlaceHref = `mailto:${contactEmail}?subject=Secure%20My%20Place%20on%20the%20Educate.Strong%20Course`;

  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Badges */}
          <div className="mb-7">
            <CourseBadgeRow badges={badges} />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
            {headline}
          </h1>

          {/* Sub-headline */}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
            {subHeadline}
          </p>

          {/* Key facts strip */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
            {keyFacts.map((fact) => (
              <div key={fact} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-1 h-1 bg-amber-500 rounded-full flex-shrink-0" />
                {fact}
              </div>
            ))}
          </div>

          {/* CTA group */}
          <div className="flex flex-wrap items-center gap-4">
            {isEnrolled && firstLessonUrl ? (
              /* Logged-in enrolled user — go to learning materials */
              <a
                href={firstLessonUrl}
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
              >
                Continue Learning
              </a>
            ) : isEnrolled ? (
              <span className="bg-green-700 text-white font-semibold px-7 py-3.5 rounded-lg text-sm">
                Enrolled in Online Materials
              </span>
            ) : (
              /* Default — in-person booking via email */
              <a
                href={securePlaceHref}
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
              >
                Secure Your Place
              </a>
            )}

            {/* Secondary — enrol in online materials if logged in and not enrolled */}
            {onEnrol && !isEnrolled && (
              <button
                onClick={onEnrol}
                disabled={enrolling}
                className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium px-5 py-3.5 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Access Online Materials'}
              </button>
            )}

            {/* Scroll-down secondary link */}
            <a
              href="#course-details"
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              View course details
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
