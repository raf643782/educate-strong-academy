/**
 * UpcomingCoursesPreview — preview-only rewrite of "Next Intakes".
 *
 * Uses the same three real, currently live courses as production's
 * UpcomingCohortsSection (same names, images, register-interest
 * types, course URLs). Removes the "Find nearest location" feature,
 * which in production always returns a fixed result regardless of
 * what is typed. Replaces the three repeated "Dates coming soon"
 * blocks with a single honest paragraph, since none of the three
 * dates is currently confirmed. No date, venue or price is invented.
 */
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';

interface CourseSlot {
  id: string;
  pathway: string;
  courseName: string;
  image: string;
  courseUrl: string;
  interestType: string;
}

const COURSE_SLOTS: CourseSlot[] = [
  {
    id: 'l1-coaching',
    pathway: 'Coaching',
    courseName: 'Level 1 Coaching Strongman',
    image: '/assets/coaching-l1-cover.webp',
    courseUrl: '/courses/level-1-coaching-strongman',
    interestType: 'level-1-coaching',
  },
  {
    id: 'l1-refereeing',
    pathway: 'Refereeing',
    courseName: 'Level 1 Strongman Refereeing',
    image: '/assets/refereeing-l1-content.webp',
    courseUrl: '/courses/level-1-strongman-refereeing',
    interestType: 'refereeing',
  },
  {
    id: 'strongkidz-coach-ed',
    pathway: 'StrongKidz',
    courseName: 'StrongKidz Coach Education',
    image: '/assets/strongkidz.avif',
    courseUrl: '/courses',
    interestType: 'strongkidz',
  },
];

export default function UpcomingCoursesPreview() {
  return (
    <section
      style={{ background: '#0D0D0D', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-labelledby="upcoming-courses-heading"
    >
      <div className="es-container">
        <RevealOnScroll>
          <div className="mb-10" style={{ maxWidth: '640px' }}>
            <p className="es-label mb-3">Upcoming Courses and Cohorts</p>
            <h2
              id="upcoming-courses-heading"
              className="font-black text-white mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.035em' }}
            >
              When Is the Next Course
            </h2>
            <p className="text-white/45 leading-relaxed">
              Course dates are confirmed throughout the year. Register your interest in Coaching,
              Refereeing or StrongKidz Coach Education, and you will be told directly as soon as a
              date, venue and price are confirmed for your pathway.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-3 gap-5">
          {COURSE_SLOTS.map((slot, i) => (
            <RevealOnScroll key={slot.id} delay={i * 0.06}>
              <div
                className="rounded-2xl overflow-hidden flex flex-col h-full"
                style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div style={{ height: '120px' }}>
                  <img src={slot.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.10em] mb-2" style={{ color: '#C2186A' }}>
                    {slot.pathway}
                  </span>
                  <h3 className="font-bold text-white text-sm mb-4 flex-1">{slot.courseName}</h3>
                  <div className="flex items-center gap-3">
                    <Link to={`/register-interest?type=${slot.interestType}`} className="btn-primary text-xs" style={{ padding: '9px 18px' }}>
                      Register Interest
                    </Link>
                    <Link to={slot.courseUrl} className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Course detail →
                    </Link>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
