/**
 * UpcomingCohortAlert — prominent banner shown below the hero.
 *
 * When confirmed: false — shows a noticeable "coming soon" prompt with CTAs
 * and an expandable location finder.
 * When confirmed: true — shows full cohort details with booking CTAs.
 *
 * To activate a confirmed cohort, set confirmed: true and fill in
 * city, date, and bookingUrl below.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Cohort configuration ──────────────────────────────────────────── */
const COHORT = {
  confirmed: false,
  title: 'Level 1 Coaching Strongman',
  city: 'Sheffield',
  venue: '',
  date: '',
  capacityRemaining: 4,
  bookingUrl: '/courses/level-1-coaching-strongman',
};

/* ── Icons ─────────────────────────────────────────────────────────── */
function CalIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`${className} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PinIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`${className} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" />
      <circle cx="12" cy="8" r="2.5" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* ── Location finder panel ─────────────────────────────────────────── */
function LocationFinder() {
  const [postcode, setPostcode] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim().length >= 2) setSearched(true);
  };

  return (
    <div
      className="mt-4 rounded-xl p-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <PinIcon className="w-4 h-4" />
        <p className="text-sm font-semibold text-white">Find Your Nearest Cohort Location</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={postcode}
          onChange={e => setPostcode(e.target.value)}
          placeholder="Enter your postcode…"
          maxLength={8}
          className="flex-1 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#A41C64]/50 transition-all"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
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
        className="rounded-lg overflow-hidden flex items-center justify-center"
        style={{
          height: '180px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {searched ? (
          <div className="text-center px-6">
            <PinIcon className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white mb-1">
              Nearest cohort: Sheffield
            </p>
            <p className="text-xs text-white/40">
              Exact venue and dates will be announced shortly.
            </p>
          </div>
        ) : (
          <div className="text-center px-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.2)' }}
            >
              <PinIcon className="w-5 h-5" />
            </div>
            <p className="text-sm text-white/35">Enter your postcode to find the nearest cohort location</p>
          </div>
        )}
      </div>

      <p className="text-xs text-white/25 mt-3">
        Cohort locations are confirmed 6–8 weeks before the course date. Enter your interest and we'll notify you first.
      </p>
    </div>
  );
}

export default function UpcomingCohortAlert() {
  const [finderOpen, setFinderOpen] = useState(false);

  if (COHORT.confirmed) {
    /* ── Confirmed cohort banner ───────────────────────────────────── */
    return (
      <div
        role="alert"
        aria-label="Upcoming cohort announcement"
        style={{
          background: 'rgba(164,28,100,0.08)',
          borderTop: '1px solid rgba(164,28,100,0.18)',
          borderBottom: '1px solid rgba(164,28,100,0.18)',
        }}
      >
        <div className="es-container py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(164,28,100,0.2)', color: '#A41C64' }}
              >
                <CalIcon className="w-4 h-4" />
                <span>Next Cohort</span>
              </div>
              <span className="text-sm font-semibold text-white">{COHORT.title}</span>
              {COHORT.city && (
                <span className="text-sm text-white/55">
                  {COHORT.venue ? `${COHORT.venue}, ` : ''}{COHORT.city}
                </span>
              )}
              {COHORT.date && (
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                  {COHORT.date}
                </span>
              )}
              {COHORT.capacityRemaining <= 5 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(225,154,71,0.15)', color: '#E19A47' }}>
                  {COHORT.capacityRemaining} spaces left
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to="/register-interest?type=level-1-coaching"
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
                style={{ background: 'rgba(164,28,100,0.2)', border: '1px solid rgba(164,28,100,0.35)', color: '#A41C64' }}
              >
                Register Interest
              </Link>
              <Link
                to={COHORT.bookingUrl}
                className="text-xs font-semibold px-4 py-2 rounded-full text-white transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 2px 12px rgba(164,28,100,0.4)' }}
              >
                View Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Unconfirmed — prominent banner with CTAs ──────────────────────── */
  return (
    <div
      style={{
        background: 'rgba(164,28,100,0.06)',
        borderTop: '1px solid rgba(164,28,100,0.14)',
        borderBottom: '1px solid rgba(164,28,100,0.14)',
      }}
    >
      <div className="es-container py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          {/* Left — icon + message */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
              style={{ background: 'rgba(164,28,100,0.15)', border: '1px solid rgba(164,28,100,0.25)' }}
            >
              <CalIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight mb-1">
                {COHORT.title} — Dates Coming Soon
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(164,28,100,0.12)', color: '#C2186A', border: '1px solid rgba(164,28,100,0.2)' }}
                >
                  <PinIcon className="w-3 h-3" />
                  {COHORT.city}
                </span>
                <span className="text-xs text-white/40">Register now — we'll notify you the moment dates are confirmed.</span>
              </div>
            </div>
          </div>

          {/* Right — CTAs */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setFinderOpen(v => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <PinIcon className="w-3.5 h-3.5" />
              Find Location
              <ChevronIcon open={finderOpen} />
            </button>
            <Link
              to="/register-interest?type=level-1-coaching"
              className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:opacity-90"
              style={{
                background: 'rgba(164,28,100,0.18)',
                border: '1px solid rgba(164,28,100,0.32)',
                color: '#F02C93',
              }}
            >
              Register Interest
            </Link>
            <Link
              to={COHORT.bookingUrl}
              className="text-xs font-semibold px-4 py-2 rounded-full text-white transition-all duration-200 hover:scale-105 active:scale-100"
              style={{
                background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                boxShadow: '0 2px 12px rgba(164,28,100,0.35)',
              }}
            >
              View Level 1 Course
            </Link>
          </div>
        </div>

        {/* Expandable location finder */}
        {finderOpen && <LocationFinder />}
      </div>
    </div>
  );
}
