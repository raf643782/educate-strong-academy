/**
 * UpcomingCohortFeature — conditional, near-top spotlight for one
 * confirmed upcoming cohort.
 *
 * Renders nothing at all when `cohort` is null — no wrapper, no
 * reserved space, no "coming soon" placeholder — so the surrounding
 * homepage order closes naturally. This is the real production
 * behaviour: pass null when no cohort is confirmed, pass a real
 * ConfirmedCohort when one is.
 *
 * All course facts (title, date, time, venue, city, price, booking
 * action) are plain visible text above the map, not dependent on the
 * map loading or being interacted with. The map (VenueMap) is a single
 * real embed with one static pin, not a search tool.
 *
 * Structured data: Course + Event JSON-LD is only ever emitted when
 * cohort.isDemo is false. The demo cohort in this preview is isDemo:
 * true, so nothing is emitted right now — this proves the gate works
 * rather than asserting it, and means real production data will
 * automatically start emitting it without any further code change.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import VenueMap from './VenueMap';
import type { ConfirmedCohort } from './cohortData';

const SCHEMA_ID = 'confirmed-cohort-schema';

export default function UpcomingCohortFeature({ cohort }: { cohort: ConfirmedCohort | null }) {
  useEffect(() => {
    if (!cohort || cohort.isDemo) {
      document.getElementById(SCHEMA_ID)?.remove();
      return;
    }
    // Real, non-demo cohort: Course wraps an Event, since this is a
    // specific dated running of a course, not the course itself (the
    // course page carries its own Course schema separately).
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = SCHEMA_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: cohort.courseTitle,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: cohort.venueName,
        address: {
          '@type': 'PostalAddress',
          streetAddress: cohort.addressLine,
          addressLocality: cohort.city,
          postalCode: cohort.postcode,
          addressCountry: 'GB',
        },
        geo: { '@type': 'GeoCoordinates', latitude: cohort.latitude, longitude: cohort.longitude },
      },
      offers: cohort.price
        ? { '@type': 'Offer', price: cohort.price, priceCurrency: 'GBP', availability: 'https://schema.org/InStock', url: cohort.bookingUrl }
        : undefined,
      url: cohort.coursePageUrl,
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(SCHEMA_ID)?.remove();
    };
  }, [cohort]);

  if (!cohort) return null;

  return (
    <section
      aria-labelledby="upcoming-cohort-heading"
      style={{
        background: [
          'radial-gradient(ellipse 90% 70% at 15% 0%, rgba(164,28,100,0.14) 0%, transparent 55%)',
          '#0A0A0C',
        ].join(', '),
        padding: '72px 0',
        borderTop: '1px solid rgba(194,24,106,0.10)',
        borderBottom: '1px solid rgba(194,24,106,0.10)',
      }}
    >
      <div className="es-container">
        <RevealOnScroll>
          {cohort.isDemo && (
            <div
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(225,154,71,0.14)', border: '1px solid rgba(225,154,71,0.35)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E19A47' }} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.10em]" style={{ color: '#E19A47' }}>
                Preview example only, not a confirmed course
              </span>
            </div>
          )}

          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#131316', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 48px rgba(0,0,0,0.4)' }}
          >
            {/* Top band: every essential fact as plain text, independent of the map */}
            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:items-center">
              <img
                src={cohort.image}
                alt={cohort.imageAlt}
                className="rounded-xl object-cover flex-shrink-0"
                style={{ width: '100%', maxWidth: '220px', height: '140px' }}
                loading="lazy"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full" style={{ background: 'rgba(194,24,106,0.14)', color: '#C2186A' }}>
                    {cohort.courseLevel}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}>
                    {cohort.courseCategory}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                    {cohort.bookingStatus}
                  </span>
                </div>

                <h2 id="upcoming-cohort-heading" className="font-black text-white mb-3" style={{ fontSize: 'clamp(1.35rem, 2.6vw, 1.9rem)', letterSpacing: '-0.03em' }}>
                  {cohort.courseTitle}
                </h2>

                <p className="text-white/45 text-sm leading-relaxed mb-4 max-w-xl">{cohort.shortDescription}</p>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 mb-5">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Dates</dt>
                    <dd className="text-sm font-semibold text-white">{cohort.startDate} to {cohort.endDate}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Time</dt>
                    <dd className="text-sm font-semibold text-white">{cohort.startTime} to {cohort.finishTime}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Venue</dt>
                    <dd className="text-sm font-semibold text-white">{cohort.venueName}, {cohort.city}</dd>
                  </div>
                  {cohort.price && (
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.08em] text-white/35 mb-1">Price</dt>
                      <dd className="text-sm font-semibold text-white">{cohort.price}</dd>
                    </div>
                  )}
                </dl>

                {cohort.availableSpaces && (
                  <p className="text-xs text-white/40 mb-5">{cohort.availableSpaces}</p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link to={cohort.bookingUrl} className="btn-primary">Register Interest</Link>
                  <Link to={cohort.coursePageUrl} className="btn-secondary">View Course</Link>
                </div>
              </div>
            </div>

            {/* Map layer beneath, full width, address strip alongside it */}
            <div className="grid md:grid-cols-[1fr_auto] gap-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <VenueMap latitude={cohort.latitude} longitude={cohort.longitude} label={`${cohort.venueName}, ${cohort.city}`} directionsUrl={cohort.directionsUrl} />
              <div className="p-5 flex flex-col justify-center gap-2" style={{ minWidth: '220px', background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-sm font-semibold text-white">{cohort.venueName}</p>
                <p className="text-xs text-white/45">{cohort.addressLine}, {cohort.postcode}</p>
                <a href={cohort.directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold mt-1" style={{ color: '#C2186A' }}>
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
