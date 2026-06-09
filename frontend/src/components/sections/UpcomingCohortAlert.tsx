/**
 * UpcomingCohortAlert — compact banner shown below the hero.
 *
 * When confirmed: false (no date set) — shows a subtle unconfirmed prompt.
 * When confirmed: true — shows the upcoming cohort details.
 *
 * To activate a confirmed cohort, set confirmed: true and fill in
 * city, date, and bookingUrl below.
 */

import { Link } from 'react-router-dom';

/* ── Cohort configuration ──────────────────────────────────────────── */
const COHORT = {
  confirmed: false,          // Set true when a date is locked in
  title: 'Level 1 Coaching Strongman',
  city: 'Sheffield',         // e.g. "Sheffield" or "Manchester"
  venue: '',                 // e.g. "Sheffield Performance Centre"
  date: '',                  // e.g. "14–15 September 2025"
  capacityRemaining: 4,      // Spaces left
  bookingUrl: '/courses/level-1-coaching-strongman',
};

/* ── Calendar icon ─────────────────────────────────────────────────── */
function CalIcon() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function UpcomingCohortAlert() {
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

            {/* Left — label + details */}
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(164,28,100,0.2)', color: '#A41C64' }}
              >
                <CalIcon />
                <span>Next Cohort</span>
              </div>

              <span className="text-sm font-semibold text-white">
                {COHORT.title}
              </span>

              {COHORT.city && (
                <span className="text-sm text-white/55">
                  {COHORT.venue ? `${COHORT.venue}, ` : ''}{COHORT.city}
                </span>
              )}

              {COHORT.date && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
                >
                  {COHORT.date}
                </span>
              )}

              {COHORT.capacityRemaining <= 5 && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(225,154,71,0.15)', color: '#E19A47' }}
                >
                  {COHORT.capacityRemaining} spaces left
                </span>
              )}
            </div>

            {/* Right — CTAs */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href="mailto:educate.strongltd@gmail.com?subject=Register%20Interest%20—%20Level%201%20Coaching"
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  background: 'rgba(164,28,100,0.2)',
                  border: '1px solid rgba(164,28,100,0.35)',
                  color: '#A41C64',
                }}
              >
                Register Interest
              </a>
              <Link
                to={COHORT.bookingUrl}
                className="text-xs font-semibold px-4 py-2 rounded-full text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                  boxShadow: '0 2px 12px rgba(164,28,100,0.4)',
                }}
              >
                View Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Unconfirmed — subtle prompt only ─────────────────────────────── */
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="es-container py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center gap-1.5"
              style={{ color: 'rgba(164,28,100,0.7)' }}
            >
              <CalIcon />
            </div>
            <p className="text-xs text-white/35">
              Next Level 1 cohort dates coming soon —
              <span className="text-white/50 ml-1">be first to know</span>
            </p>
          </div>
          <a
            href="mailto:educate.strongltd@gmail.com?subject=Register%20Interest%20—%20Level%201%20Coaching"
            className="text-xs font-semibold transition-colors duration-150"
            style={{ color: 'rgba(164,28,100,0.8)' }}
          >
            Register interest →
          </a>
        </div>
      </div>
    </div>
  );
}
