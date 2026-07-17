import CourseBadgeRow from './CourseBadgeRow';
import { Link } from 'react-router-dom';

interface CourseHeroProps {
  eyebrow: string;
  badges: string[];
  headline: string;
  subHeadline: string;
  keyFacts: string[];
  contactEmail: string;
  interestType: string;
  isEnrolled?: boolean;
  firstLessonUrl?: string;
}

export default function CourseHero({
  eyebrow, badges, headline, subHeadline, keyFacts, contactEmail, interestType,
  isEnrolled, firstLessonUrl,
}: CourseHeroProps) {
  const registerInterestHref = `/register-interest?type=${encodeURIComponent(interestType)}`;

  return (
    <section
      className="es-grit"
      style={{
        background: 'radial-gradient(ellipse 110% 75% at 50% -10%, rgba(164,28,100,0.28) 0%, transparent 56%), radial-gradient(ellipse 55% 55% at 4% 80%, rgba(194,24,106,0.08) 0%, transparent 52%), #050506',
        borderBottom: '1px solid rgba(194,24,106,0.08)',
        position: 'relative',
      }}
    >
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(60,60,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(60,60,60,0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="es-container-wide py-20 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <p className="es-label mb-4">{eyebrow}</p>
          <div className="mb-6">
            <CourseBadgeRow badges={badges} />
          </div>
          <h1 className="font-black text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.04em' }}>
            {headline}
          </h1>
          <p className="text-es-muted text-lg leading-relaxed mb-8 max-w-2xl">{subHeadline}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
            {keyFacts.map(fact => (
              <div key={fact} className="flex items-center gap-2 text-sm text-es-muted">
                <span className="w-1 h-1 rounded-full bg-es-accent flex-shrink-0" />
                {fact}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {isEnrolled && firstLessonUrl ? (
              <Link to={firstLessonUrl} className="btn-primary text-sm">Continue Learning</Link>
            ) : isEnrolled ? (
              <span className="btn-primary text-sm opacity-70">Enrolled in Online Materials</span>
            ) : (
              <Link to={registerInterestHref} className="btn-primary text-sm">Secure Your Place</Link>
            )}
            <a href="#course-details" className="text-es-muted hover:text-white text-sm transition-colors">
              View course details
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(transparent, #050506)' }} />
    </section>
  );
}
