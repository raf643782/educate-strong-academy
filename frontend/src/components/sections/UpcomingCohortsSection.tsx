/**
 * UpcomingCohortsSection — full homepage section, not a compact banner.
 *
 * Placement: after AllPathwaysOverview, before CertifiedCoachesSection.
 *
 * Data-driven so real cohort dates can be dropped in later.
 * When no confirmed cohort exists, shows a "coming soon" card with
 * register-interest and location-finder CTAs.
 *
 * No map API keys required — location finder is a frontend placeholder.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Data types ────────────────────────────────────────────────────── */
interface Cohort {
  id: string;
  courseName: string;
  courseTag: string;
  status: 'confirmed' | 'coming-soon' | 'waitlist';
  city: string;
  venue: string;
  date: string;
  capacity: number;
  capacityRemaining: number;
  bookingUrl: string;
  courseUrl: string;
  isConfirmed: boolean;
}

/* ── Config — swap confirmed: true + fill date/venue when a cohort is locked ── */
const COHORTS: Cohort[] = [
  {
    id: 'l1-coaching-2026',
    courseName: 'Level 1 Coaching Strongman',
    courseTag: 'Active IQ Accredited',
    status: 'coming-soon',
    city: 'Sheffield',
    venue: '',
    date: '',
    capacity: 20,
    capacityRemaining: 20,
    bookingUrl: '/courses/level-1-coaching-strongman',
    courseUrl: '/courses/level-1-coaching-strongman',
    isConfirmed: false,
  },
];

/* ── Icons ─────────────────────────────────────────────────────────── */
function CalendarIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function LocationPinIcon({ size = 5 }: { size?: number }) {
  return (
    <svg className={`w-${size} h-${size} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" />
      <circle cx="12" cy="8" r="2.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* ── Location finder sub-panel ──────────────────────────────────────── */
function LocationFinderPanel() {
  const [postcode, setPostcode] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim().length >= 2) setSearched(true);
  };

  return (
    <div
      className="mt-5 rounded-xl p-5"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <LocationPinIcon size={4} />
        <p className="text-sm font-semibold text-white">Find Your Nearest Cohort Location</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={postcode}
          onChange={e => setPostcode(e.target.value)}
          placeholder="Enter your postcode or city…"
          maxLength={10}
          className="flex-1 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 transition-all"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          aria-label="Postcode or city search"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #A41C64, #C0246E)',
            boxShadow: '0 2px 12px rgba(164,28,100,0.35)',
          }}
        >
          Search
        </button>
      </form>

      {/* Map placeholder */}
      <div
        className="rounded-lg flex items-center justify-center"
        style={{
          height: '200px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
        role="img"
        aria-label="Location map placeholder"
      >
        {searched ? (
          <div className="text-center px-8">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(164,28,100,0.15)', border: '1px solid rgba(164,28,100,0.25)' }}
            >
              <LocationPinIcon size={5} />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Nearest cohort: Sheffield</p>
            <p className="text-xs text-white/35">Exact venue and dates confirmed 6–8 weeks before the course.</p>
          </div>
        ) : (
          <div className="text-center px-8">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <LocationPinIcon size={5} />
            </div>
            <p className="text-sm text-white/30">Enter your postcode or city to find the nearest cohort location</p>
          </div>
        )}
      </div>

      <p className="text-xs text-white/25 mt-3">
        Cohort locations are confirmed 6–8 weeks before the course date. Register your interest and we will notify you first.
      </p>
    </div>
  );
}

/* ── Cohort card ───────────────────────────────────────────────────── */
function CohortCard({ cohort }: { cohort: Cohort }) {
  const [finderOpen, setFinderOpen] = useState(false);

  if (cohort.isConfirmed) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(164,28,100,0.06)',
          border: '1px solid rgba(164,28,100,0.2)',
          borderTop: '2px solid #A41C64',
        }}
      >
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3"
              style={{ background: 'rgba(164,28,100,0.15)', color: '#C2186A', border: '1px solid rgba(164,28,100,0.25)' }}
            >
              {cohort.courseTag}
            </span>
            <h3 className="text-lg font-black text-white leading-tight">{cohort.courseName}</h3>
          </div>
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: 'rgba(164,28,100,0.15)', color: '#C2186A', border: '1px solid rgba(164,28,100,0.25)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            Confirmed
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-4 mb-5">
          {cohort.date && (
            <div className="flex items-center gap-2 text-sm text-white/65">
              <CalendarIcon />
              {cohort.date}
            </div>
          )}
          {cohort.city && (
            <div className="flex items-center gap-2 text-sm text-white/65">
              <LocationPinIcon size={5} />
              {cohort.venue ? `${cohort.venue}, ` : ''}{cohort.city}
            </div>
          )}
          {cohort.capacityRemaining <= 8 && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#E19A47' }}>
              <UsersIcon />
              {cohort.capacityRemaining} spaces left
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:educate.strongltd@gmail.com?subject=Register%20Interest%20—%20${encodeURIComponent(cohort.courseName)}`}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
            style={{
              background: 'rgba(164,28,100,0.15)',
              border: '1px solid rgba(164,28,100,0.3)',
              color: '#F02C93',
            }}
          >
            Register Interest
          </a>
          <Link
            to={cohort.courseUrl}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all duration-200 hover:scale-105 active:scale-100"
            style={{
              background: 'linear-gradient(135deg, #A41C64, #C0246E)',
              boxShadow: '0 2px 16px rgba(164,28,100,0.4)',
            }}
          >
            View Level 1 Course
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    );
  }

  /* Coming-soon card */
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: '2px solid rgba(164,28,100,0.6)',
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3"
            style={{ background: 'rgba(164,28,100,0.1)', color: '#888899', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {cohort.courseTag}
          </span>
          <h3 className="text-lg font-black text-white leading-tight">{cohort.courseName}</h3>
        </div>
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          Dates Coming Soon
        </span>
      </div>

      {/* Location + message */}
      <div className="flex flex-wrap gap-4 mb-4">
        {cohort.city && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <LocationPinIcon size={4} />
            {cohort.city}
          </div>
        )}
      </div>
      <p className="text-sm text-white/40 leading-relaxed mb-5">
        The next cohort location and date will be confirmed shortly. Register your interest
        and we will notify you the moment it is confirmed.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 mb-4">
        <a
          href={`mailto:educate.strongltd@gmail.com?subject=Register%20Interest%20—%20${encodeURIComponent(cohort.courseName)}`}
          className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
          style={{
            background: 'rgba(164,28,100,0.15)',
            border: '1px solid rgba(164,28,100,0.3)',
            color: '#F02C93',
          }}
        >
          Register Interest
        </a>
        <Link
          to={cohort.courseUrl}
          className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all duration-200 hover:scale-105 active:scale-100"
          style={{
            background: 'linear-gradient(135deg, #A41C64, #C0246E)',
            boxShadow: '0 2px 16px rgba(164,28,100,0.35)',
          }}
        >
          View Level 1 Course
          <ArrowRightIcon />
        </Link>
        <button
          type="button"
          onClick={() => setFinderOpen(v => !v)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
          }}
          aria-expanded={finderOpen}
        >
          <LocationPinIcon size={4} />
          Find Location
          <ChevronDownIcon open={finderOpen} />
        </button>
      </div>

      {/* Expandable location finder */}
      {finderOpen && <LocationFinderPanel />}
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────────── */
export default function UpcomingCohortsSection() {
  return (
    <section
      aria-labelledby="cohorts-heading"
      style={{
        background: '#0A0A0B',
        padding: '88px 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="es-container">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* Left — heading + context */}
          <div>
            <p className="es-label mb-3">Upcoming Courses</p>
            <h2
              id="cohorts-heading"
              className="font-black text-white mb-5"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                letterSpacing: '-0.035em',
                lineHeight: '1.05',
              }}
            >
              When Is the Next
              <br />
              <span style={{ color: '#A41C64' }}>EducateStrong Cohort?</span>
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-6 max-w-md">
              Course dates are released throughout the year. Register your interest to be
              first in line when the next Level 1 cohort is confirmed. Cohorts are small,
              hands-on, and fill quickly.
            </p>

            {/* What to expect */}
            <ul className="space-y-3">
              {[
                { icon: <CalendarIcon />, text: '2-day intensive weekend format' },
                { icon: <LocationPinIcon size={5} />, text: 'Multiple UK locations planned' },
                { icon: <UsersIcon />, text: 'Small cohorts — maximum 20 places' },
              ].map(item => (
                <li key={item.text} className="flex items-center gap-3 text-sm text-white/50">
                  <span style={{ color: '#A41C64' }}>{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — cohort cards */}
          <div className="space-y-4">
            {COHORTS.map(cohort => (
              <CohortCard key={cohort.id} cohort={cohort} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
