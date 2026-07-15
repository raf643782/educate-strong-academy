/**
 * UpcomingCohortSpotlight — conditional, near-top homepage feature for
 * one confirmed upcoming cohort.
 *
 * Real data only. Fetches GET /register-interest/cohorts (the existing
 * public endpoint over the real Cohort model) and features the
 * highest priority confirmed, non-cancelled, future-dated cohort
 * (sortOrder, then soonest date). Renders nothing at all — no
 * wrapper, no placeholder, no reserved space — when no cohort
 * currently qualifies, so the homepage order closes naturally.
 *
 * Price is looked up from data/coursePageData.ts by the cohort's
 * linked course slug, since that is the same real, already-public
 * pricing shown on the course page itself — not invented here.
 *
 * The Cohort model does not currently store latitude/longitude or a
 * street address, so no map is rendered and no precise venue pin is
 * fabricated. "Get Directions" instead links to a Google Maps text
 * search for the real venue and city, which is honest without
 * inventing coordinates. The map can be added the moment the schema
 * gains coordinate fields, without changing this component's
 * conditional logic.
 *
 * Event structured data is only emitted while a real qualifying
 * cohort is being displayed, and is removed the moment none is.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { COURSE_PAGE_DATA } from '../../data/coursePageData';

interface CohortCourse {
  id: string;
  title: string;
  slug: string;
  pathway: 'COACHING' | 'REFEREEING' | 'STRONGKIDZ';
}

interface Cohort {
  id: string;
  title: string;
  status: 'UPCOMING' | 'OPEN' | 'FULL' | 'CANCELLED' | string;
  city: string | null;
  venue: string | null;
  date: string | null;
  capacity: number | null;
  bookingUrl: string | null;
  isConfirmed: boolean;
  sortOrder: number;
  course: CohortCourse | null;
}

const SCHEMA_ID = 'homepage-cohort-schema';
const PATHWAY_LABEL: Record<string, string> = { COACHING: 'Coaching', REFEREEING: 'Refereeing', STRONGKIDZ: 'StrongKidz' };

function pickFeaturedCohort(cohorts: Cohort[]): Cohort | null {
  const now = Date.now();
  const eligible = cohorts.filter(
    (c) => c.isConfirmed && c.status !== 'CANCELLED' && c.date && new Date(c.date).getTime() > now
  );
  if (eligible.length === 0) return null;
  eligible.sort((a, b) => a.sortOrder - b.sortOrder || new Date(a.date!).getTime() - new Date(b.date!).getTime());
  return eligible[0];
}

export default function UpcomingCohortSpotlight() {
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/register-interest/cohorts')
      .then((res) => {
        if (cancelled) return;
        setCohort(pickFeaturedCohort(res.data ?? []));
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!cohort) {
      document.getElementById(SCHEMA_ID)?.remove();
      return;
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = SCHEMA_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: cohort.title,
      startDate: cohort.date,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: cohort.venue
        ? { '@type': 'Place', name: cohort.venue, address: cohort.city ? { '@type': 'PostalAddress', addressLocality: cohort.city, addressCountry: 'GB' } : undefined }
        : undefined,
      url: cohort.course ? `/courses/${cohort.course.slug}` : undefined,
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(SCHEMA_ID)?.remove();
    };
  }, [cohort]);

  if (!loaded || !cohort) return null;

  const price = cohort.course ? COURSE_PAGE_DATA[cohort.course.slug]?.pricing : undefined;
  const dateObj = cohort.date ? new Date(cohort.date) : null;
  const dateLabel = dateObj
    ? dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const timeLabel = dateObj ? dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : null;
  const coursePageUrl = cohort.course ? `/courses/${cohort.course.slug}` : '/courses';
  const bookingUrl = cohort.bookingUrl || `/register-interest?type=${cohort.course ? PATHWAY_LABEL[cohort.course.pathway].toLowerCase() : 'general'}`;
  const directionsUrl =
    cohort.venue || cohort.city
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([cohort.venue, cohort.city].filter(Boolean).join(', '))}`
      : null;

  return (
    <section
      aria-labelledby="upcoming-cohort-heading"
      style={{
        background: ['radial-gradient(ellipse 90% 70% at 15% 0%, rgba(164,28,100,0.14) 0%, transparent 55%)', '#0A0A0C'].join(', '),
        padding: '72px 0',
        borderTop: '1px solid rgba(194,24,106,0.10)',
        borderBottom: '1px solid rgba(194,24,106,0.10)',
      }}
    >
      <div className="es-container">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#131316', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 48px rgba(0,0,0,0.4)' }}
        >
          <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:items-center">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {cohort.course && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full" style={{ background: 'rgba(194,24,106,0.14)', color: '#C2186A' }}>
                    {PATHWAY_LABEL[cohort.course.pathway]}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                  {cohort.status === 'OPEN' ? 'Booking Open' : cohort.status === 'FULL' ? 'Fully Booked' : 'Upcoming'}
                </span>
              </div>

              <h2 id="upcoming-cohort-heading" className="font-black text-white mb-4" style={{ fontSize: 'clamp(1.35rem, 2.6vw, 1.9rem)', letterSpacing: '-0.03em' }}>
                {cohort.title}
              </h2>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 mb-5">
                {dateLabel && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Date</dt>
                    <dd className="text-sm font-semibold text-white">{dateLabel}</dd>
                  </div>
                )}
                {timeLabel && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Time</dt>
                    <dd className="text-sm font-semibold text-white">{timeLabel}</dd>
                  </div>
                )}
                {(cohort.venue || cohort.city) && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Venue</dt>
                    <dd className="text-sm font-semibold text-white">{[cohort.venue, cohort.city].filter(Boolean).join(', ')}</dd>
                  </div>
                )}
                {price && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Price</dt>
                    <dd className="text-sm font-semibold text-white">£{price.totalFee} total course fee</dd>
                  </div>
                )}
              </dl>

              {cohort.capacity && <p className="text-xs text-white/40 mb-5">Limited to {cohort.capacity} participants</p>}

              <div className="flex flex-wrap gap-3">
                <Link to={bookingUrl} className="btn-primary">Register Interest</Link>
                <Link to={coursePageUrl} className="btn-secondary">View Course</Link>
                {directionsUrl && (
                  <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold self-center" style={{ color: '#C2186A' }}>
                    Get Directions →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
