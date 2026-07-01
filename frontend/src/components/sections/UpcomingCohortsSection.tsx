/**
 * UpcomingCohortsSection — Next Intakes section.
 * Three image-led course cards with register interest + location finder.
 * Dates honest: "Dates coming soon" until isConfirmed + date/venue are filled in.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Types ──────────────────────────────────────────────────── */
interface CourseSlot {
  id: string;
  pathway: string;
  level: string;
  courseName: string;
  image: string;
  courseUrl: string;
  isConfirmed: boolean;
  date?: string;
  venue?: string;
  city?: string;
  showLocationFinder?: boolean;
}

/* ── Data — set isConfirmed: true + fill date/venue when a cohort is locked ── */
const COURSE_SLOTS: CourseSlot[] = [
  {
    id: 'l1-coaching-2026',
    pathway: 'COACHING',
    level: 'LEVEL 1',
    courseName: 'Level 1 Coaching Strongman',
    image: '/assets/coaching-l1-cover.webp',
    courseUrl: '/courses/level-1-coaching-strongman',
    isConfirmed: false,
    city: 'Sheffield',
    showLocationFinder: true,
  },
  {
    id: 'l1-refereeing-2026',
    pathway: 'REFEREEING',
    level: 'LEVEL 1',
    courseName: 'Level 1 Strongman Refereeing',
    image: '/assets/refereeing-l1-content.webp',
    courseUrl: '/courses/level-1-strongman-refereeing',
    isConfirmed: false,
  },
  {
    id: 'strongkidz-2026',
    pathway: 'STRONGKIDZ',
    level: 'COACH ED',
    courseName: 'StrongKidz Coach Education',
    image: '/assets/strongkidz.avif',
    courseUrl: '/courses',
    isConfirmed: false,
  },
];

/* ── Icons ──────────────────────────────────────────────────── */
function CalendarIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function LocationPinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`${className} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" />
      <circle cx="12" cy="8" r="2.5" />
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

/* ── Location finder sub-panel ──────────────────────────────── */
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
        <LocationPinIcon className="w-4 h-4" />
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

      <div
        className="rounded-lg flex items-center justify-center"
        style={{ height: '180px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
        role="img"
        aria-label="Location map placeholder"
      >
        {searched ? (
          <div className="text-center px-8">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(164,28,100,0.15)', border: '1px solid rgba(164,28,100,0.25)' }}
            >
              <LocationPinIcon className="w-5 h-5" />
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
              <LocationPinIcon className="w-5 h-5" />
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

/* ── Course card ────────────────────────────────────────────── */
function CourseCard({ slot }: { slot: CourseSlot }) {
  const [finderOpen, setFinderOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: '#151519',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(194,24,106,0.38)';
        el.style.boxShadow = '0 8px 48px rgba(164,28,100,0.20)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(255,255,255,0.08)';
        el.style.boxShadow = '';
      }}
    >
      {/* Image area */}
      <div className="relative" style={{ height: '240px', flexShrink: 0, background: '#0D0D0F' }}>
        {!imgError && (
          <img
            src={slot.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {/* Gradient overlay for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(5,5,6,0.20) 0%, rgba(5,5,6,0.72) 100%)' }}
        />

        {/* Pathway + level pills — top-left */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span
            className="text-[10px] font-black uppercase tracking-[0.10em] px-2.5 py-1 rounded-full"
            style={{ background: '#A41C64', color: '#ffffff' }}
          >
            {slot.pathway}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}
          >
            {slot.level}
          </span>
        </div>

        {/* Course name — overlaid at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
          <h3
            className="font-black text-white leading-snug"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.125rem)', letterSpacing: '-0.025em' }}
          >
            {slot.courseName}
          </h3>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Date / status */}
        <div className="flex items-center gap-2 mb-5">
          {slot.isConfirmed && slot.date ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ color: '#C2186A' }}><CalendarIcon /></span>
              <span className="text-sm text-white/70">{slot.date}</span>
              {slot.city && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-white/50">
                    {slot.venue ? `${slot.venue}, ` : ''}{slot.city}
                  </span>
                </>
              )}
            </div>
          ) : (
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.30)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              Dates coming soon
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <a
            href={`mailto:educate.strongltd@gmail.com?subject=Register%20Interest%20—%20${encodeURIComponent(slot.courseName)}`}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
            style={{
              background: 'rgba(164,28,100,0.15)',
              border: '1px solid rgba(164,28,100,0.30)',
              color: '#C2186A',
            }}
          >
            Register Interest
          </a>
          <Link
            to={slot.courseUrl}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition-all duration-200 hover:text-white"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            Course detail →
          </Link>
        </div>

        {/* Location finder — L1 Coaching only */}
        {slot.showLocationFinder && (
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              type="button"
              onClick={() => setFinderOpen(v => !v)}
              className="flex items-center gap-2 text-xs font-semibold transition-colors duration-200 hover:text-white/60"
              style={{ color: 'rgba(255,255,255,0.30)' }}
              aria-expanded={finderOpen}
            >
              <LocationPinIcon className="w-3.5 h-3.5" />
              Find nearest location
              <ChevronDownIcon open={finderOpen} />
            </button>
            {finderOpen && <LocationFinderPanel />}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────── */
export default function UpcomingCohortsSection() {
  return (
    <section
      aria-labelledby="cohorts-heading"
      style={{
        background: [
          'radial-gradient(ellipse 100% 65% at 12% 35%, rgba(164,28,100,0.16) 0%, transparent 55%)',
          'radial-gradient(ellipse 70% 55% at 88% 72%, rgba(194,24,106,0.09) 0%, transparent 50%)',
          'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(164,28,100,0.08) 0%, transparent 60%)',
          '#050506',
        ].join(', '),
        padding: '96px 0',
        borderTop: '1px solid rgba(194,24,106,0.08)',
        borderBottom: '1px solid rgba(194,24,106,0.08)',
      }}
    >
      <div className="es-container">
        {/* Section header */}
        <div className="mb-12">
          <p className="es-label mb-3">Upcoming Courses &amp; Cohorts</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2
                id="cohorts-heading"
                className="font-black text-white mb-3"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                  letterSpacing: '-0.04em',
                  lineHeight: '1.02',
                }}
              >
                Next Intakes
              </h2>
              <p className="text-white/45 text-base max-w-lg">
                Register your interest and we will confirm dates and cohort details.
              </p>
            </div>
          </div>
        </div>

        {/* Three-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSE_SLOTS.map(slot => (
            <CourseCard key={slot.id} slot={slot} />
          ))}
        </div>
      </div>
    </section>
  );
}
