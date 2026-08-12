/**
 * UpcomingCohortSpotlight — conditional, near-top homepage feature for
 * one confirmed upcoming cohort.
 *
 * Real data only. Fetches GET /register-interest/cohorts (the existing
 * public endpoint over the real Cohort model) and features the highest
 * priority cohort that is confirmed, explicitly featured on the
 * homepage, not cancelled, and current or future (still running or not
 * yet started), sorted by sortOrder then soonest date. Renders nothing
 * at all — no wrapper, no placeholder, no reserved space — when no
 * cohort currently qualifies, so the homepage order closes naturally.
 *
 * Price falls back to data/coursePageData.ts by the cohort's linked
 * course slug (the same real, already-public pricing shown on the
 * course page) only when the cohort has no explicit price of its own.
 *
 * The map only renders when the cohort has real, valid latitude and
 * longitude — there is no fake search field and no fabricated pin. When
 * coordinates are missing, the course/venue information still renders
 * as plain text with a working "Get Directions" link (built from a
 * directions URL override, precise coordinates, or a venue/city text
 * search, in that order) — this is the fallback for "no map data",
 * rather than ever rendering a broken or empty embed.
 *
 * Event structured data is only emitted while a real, complete cohort
 * is being displayed (course, date and a venue/city all present), and
 * is removed the moment none qualifies.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { COURSE_PAGE_DATA } from '../../data/coursePageData';
import { hasValidCoords as hasValidCoordsPair, VenueMap } from '../../lib/cohortMap';
import { SITE_URL } from '../../lib/siteUrl';

interface CohortCourse {
  id: string;
  title: string;
  slug: string;
  pathway: 'COACHING' | 'REFEREEING' | 'STRONGKIDZ';
}

interface Cohort {
  id: string;
  title: string;
  status: 'UPCOMING' | 'CONFIRMED' | 'FULL' | 'COMPLETED' | 'CANCELLED' | string;
  city: string | null;
  venue: string | null;
  date: string | null;
  capacity: number | null;
  bookingUrl: string | null;
  isConfirmed: boolean;
  sortOrder: number;
  course: CohortCourse | null;
  addressLine: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  directionsUrl: string | null;
  featuredOnHomepage: boolean;
  endDate: string | null;
  startTime: string | null;
  finishTime: string | null;
  price: number | null;
  availableSpaces: number | null;
  registerInterestUrl: string | null;
  shortDescription: string | null;
}

const SCHEMA_ID = 'homepage-cohort-schema';
const PATHWAY_LABEL: Record<string, string> = { COACHING: 'Coaching', REFEREEING: 'Refereeing', STRONGKIDZ: 'StrongKidz' };
const STATUS_LABEL: Record<string, string> = {
  UPCOMING: 'Upcoming',
  CONFIRMED: 'Booking Open',
  FULL: 'Fully Booked',
  COMPLETED: 'Completed',
};

function pickFeaturedCohort(cohorts: Cohort[]): Cohort | null {
  const now = Date.now();
  const eligible = cohorts.filter((c) => {
    if (!c.isConfirmed || !c.featuredOnHomepage || c.status === 'CANCELLED') return false;
    const effectiveEnd = c.endDate || c.date;
    if (!effectiveEnd) return false;
    const endOfDay = new Date(effectiveEnd);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.getTime() >= now;
  });
  if (eligible.length === 0) return null;
  eligible.sort((a, b) => a.sortOrder - b.sortOrder || new Date(a.date!).getTime() - new Date(b.date!).getTime());
  return eligible[0];
}

function hasValidCoords(cohort: Cohort): cohort is Cohort & { latitude: number; longitude: number } {
  return hasValidCoordsPair(cohort.latitude, cohort.longitude);
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
    const isComplete = !!cohort && !!cohort.course && !!cohort.date && !!(cohort.venue || cohort.city);
    if (!isComplete) {
      document.getElementById(SCHEMA_ID)?.remove();
      return;
    }
    const c = cohort!;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = SCHEMA_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: c.title,
      startDate: c.date,
      endDate: c.endDate || undefined,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: c.venue || c.city,
        address: {
          '@type': 'PostalAddress',
          streetAddress: c.addressLine || undefined,
          addressLocality: c.city || undefined,
          postalCode: c.postcode || undefined,
          addressCountry: 'GB',
        },
        geo: hasValidCoords(c) ? { '@type': 'GeoCoordinates', latitude: c.latitude, longitude: c.longitude } : undefined,
      },
      offers: c.price
        ? { '@type': 'Offer', price: c.price, priceCurrency: 'GBP', availability: 'https://schema.org/InStock', url: c.bookingUrl || undefined }
        : undefined,
      url: c.course ? `${SITE_URL}/courses/${c.course.slug}` : undefined,
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(SCHEMA_ID)?.remove();
    };
  }, [cohort]);

  if (!loaded || !cohort) return null;

  const price = cohort.price ?? (cohort.course ? COURSE_PAGE_DATA[cohort.course.slug]?.pricing?.totalFee : undefined);
  const startObj = cohort.date ? new Date(cohort.date) : null;
  const endObj = cohort.endDate ? new Date(cohort.endDate) : null;
  const dateFmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dateLabel = startObj ? (endObj && endObj.getTime() !== startObj.getTime() ? `${dateFmt(startObj)} to ${dateFmt(endObj)}` : dateFmt(startObj)) : null;
  const timeLabel = cohort.startTime && cohort.finishTime ? `${cohort.startTime} to ${cohort.finishTime}` : cohort.startTime || cohort.finishTime || null;
  const coursePageUrl = cohort.course ? `/courses/${cohort.course.slug}` : '/courses';
  const registerUrl = cohort.registerInterestUrl || `/register-interest?type=${cohort.course ? PATHWAY_LABEL[cohort.course.pathway].toLowerCase() : 'general'}`;
  const coords = hasValidCoords(cohort);
  const venueLabel = [cohort.venue, cohort.city].filter(Boolean).join(', ');
  const directionsUrl =
    cohort.directionsUrl ||
    (coords
      ? `https://www.google.com/maps/search/?api=1&query=${cohort.latitude},${cohort.longitude}`
      : venueLabel
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueLabel)}`
      : null);

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
                  {STATUS_LABEL[cohort.status] || 'Upcoming'}
                </span>
              </div>

              <h2 id="upcoming-cohort-heading" className="font-black text-white mb-3" style={{ fontSize: 'clamp(1.35rem, 2.6vw, 1.9rem)', letterSpacing: '-0.03em' }}>
                {cohort.title}
              </h2>

              {cohort.shortDescription && <p className="text-white/45 text-sm leading-relaxed mb-4 max-w-xl">{cohort.shortDescription}</p>}

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
                {venueLabel && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Venue</dt>
                    <dd className="text-sm font-semibold text-white">{venueLabel}</dd>
                  </div>
                )}
                {price != null && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Price</dt>
                    <dd className="text-sm font-semibold text-white">£{price} total course fee</dd>
                  </div>
                )}
              </dl>

              {cohort.availableSpaces != null ? (
                <p className="text-xs text-white/40 mb-5">
                  {cohort.availableSpaces} space{cohort.availableSpaces === 1 ? '' : 's'} remaining{cohort.capacity ? ` of ${cohort.capacity}` : ''}
                </p>
              ) : cohort.capacity ? (
                <p className="text-xs text-white/40 mb-5">Limited to {cohort.capacity} participants</p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                {cohort.bookingUrl ? (
                  <a href={cohort.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Book Now</a>
                ) : (
                  <Link to={registerUrl} className="btn-primary">Register Interest</Link>
                )}
                <Link to={coursePageUrl} className="btn-secondary">View Course</Link>
                {directionsUrl && !venueLabel && (
                  <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold self-center" style={{ color: '#C2186A' }}>
                    Get Directions →
                  </a>
                )}
              </div>
            </div>
          </div>

          {(venueLabel || coords) && (
            <div className="grid md:grid-cols-[1fr_auto] gap-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {coords && <VenueMap latitude={cohort.latitude as number} longitude={cohort.longitude as number} label={venueLabel} />}
              <div className="p-5 flex flex-col justify-center gap-2" style={{ minWidth: 220, background: 'rgba(255,255,255,0.02)' }}>
                {cohort.venue && <p className="text-sm font-semibold text-white">{cohort.venue}</p>}
                {(cohort.addressLine || cohort.city || cohort.postcode) && (
                  <p className="text-xs text-white/45">{[cohort.addressLine, cohort.city, cohort.postcode].filter(Boolean).join(', ')}</p>
                )}
                {directionsUrl && (
                  <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold mt-1" style={{ color: '#C2186A' }}>
                    Get Directions →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
