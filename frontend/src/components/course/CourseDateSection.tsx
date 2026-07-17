import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { hasValidCoords, VenueMap } from '../../lib/cohortMap';

interface CourseDateSectionProps {
  heading: string;
  copy: string;
  subCopy: string;
  contactEmail: string;
  courseTitle?: string;
  interestType: string;
  /** When provided, the section looks up the real, current/future confirmed
   * cohort linked to this exact course and — only when one exists with real
   * coordinates — shows its venue alongside a real map. Omit for course
   * pages that shouldn't show this (e.g. no cohort data applies yet). */
  courseSlug?: string;
}

interface CohortCourse {
  slug: string;
}

interface DateCohort {
  status: string;
  isConfirmed: boolean;
  date: string | null;
  endDate: string | null;
  sortOrder: number;
  venue: string | null;
  city: string | null;
  addressLine: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  directionsUrl: string | null;
  course: CohortCourse | null;
}

function pickCourseCohort(cohorts: DateCohort[], courseSlug: string): DateCohort | null {
  const now = Date.now();
  const eligible = cohorts.filter((c) => {
    if (c.course?.slug !== courseSlug) return false;
    if (!c.isConfirmed || c.status === 'CANCELLED') return false;
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

export default function CourseDateSection({ heading, copy, subCopy, interestType, courseSlug }: CourseDateSectionProps) {
  const registerHref = `/register-interest?type=${encodeURIComponent(interestType)}`;
  const [cohort, setCohort] = useState<DateCohort | null>(null);

  useEffect(() => {
    if (!courseSlug) return;
    let cancelled = false;
    api
      .get('/register-interest/cohorts')
      .then((res) => {
        if (cancelled) return;
        setCohort(pickCourseCohort(res.data ?? [], courseSlug));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  const coords = cohort && hasValidCoords(cohort.latitude, cohort.longitude);
  const venueLabel = cohort ? [cohort.venue, cohort.city].filter(Boolean).join(', ') : '';
  const directionsUrl = cohort
    ? cohort.directionsUrl ||
      (coords
        ? `https://www.google.com/maps/search/?api=1&query=${cohort.latitude},${cohort.longitude}`
        : venueLabel
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueLabel)}`
        : null)
    : null;

  const dateInfo = (
    <div className={coords ? '' : 'max-w-2xl'}>
      <p className="es-label mb-3">Dates</p>
      <h2 className="text-2xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>{heading}</h2>
      <p className="text-es-muted leading-relaxed mb-3">{copy}</p>
      <p className="text-xs text-es-subtle leading-relaxed mb-8">{subCopy}</p>
      <Link to={registerHref} className="btn-primary text-sm inline-block">Register Interest</Link>
      <p className="text-xs text-es-subtle mt-4">No payment required at this stage. You will be contacted directly when a course date is confirmed.</p>
      {cohort && !coords && venueLabel && (
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm font-semibold text-white">{venueLabel}</p>
          {(cohort.addressLine || cohort.postcode) && (
            <p className="text-xs text-white/45 mt-1">{[cohort.addressLine, cohort.postcode].filter(Boolean).join(', ')}</p>
          )}
          {directionsUrl && (
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold mt-2 inline-block" style={{ color: '#C2186A' }}>
              Get Directions →
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14">
      <div className="es-container-wide">
        {coords ? (
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {dateInfo}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <VenueMap latitude={cohort!.latitude as number} longitude={cohort!.longitude as number} label={venueLabel} />
              <div className="p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {cohort!.venue && <p className="text-sm font-semibold text-white">{cohort!.venue}</p>}
                {(cohort!.addressLine || cohort!.city || cohort!.postcode) && (
                  <p className="text-xs text-white/45 mt-1">{[cohort!.addressLine, cohort!.city, cohort!.postcode].filter(Boolean).join(', ')}</p>
                )}
                {directionsUrl && (
                  <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold mt-2 inline-block" style={{ color: '#C2186A' }}>
                    Get Directions →
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          dateInfo
        )}
      </div>
    </section>
  );
}
