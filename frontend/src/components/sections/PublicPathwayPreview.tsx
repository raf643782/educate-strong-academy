/**
 * PublicPathwayPreview — The Coaching Pathway progression.
 *
 * Shows: Level 1 → Level 2 → Level 3 → CPD
 * Separate from AllPathwaysOverview (which shows all 4 pathways).
 * This section focuses specifically on the coaching qualification journey.
 *
 * id="coaching-journey" — used as anchor target from AllPathwaysOverview.
 */

import { Link } from 'react-router-dom';

interface PathwayStep {
  level: string;
  title: string;
  subtitle: string;
  status: 'available' | 'coming' | 'future';
  colour: string;
  outcomes: string[];
  cert: string;
  cta?: { label: string; to: string };
  note?: string;
}

const STEPS: PathwayStep[] = [
  {
    level: 'Level 1',
    title: 'Foundation',
    subtitle: 'Fundamentals of Coaching Strongman',
    status: 'available',
    colour: '#A41C64',
    outcomes: ['Six core Strongman events', 'Athlete screening & safety', 'Beginner session structure'],
    cert: 'Active IQ Level 1 Certificate',
    cta: { label: 'Enrol Now', to: '/courses/level-1-coaching-strongman' },
  },
  {
    level: 'Level 2',
    title: 'Applied Practice',
    subtitle: 'Advanced Coaching Techniques',
    status: 'coming',
    colour: '#C0246E',
    outcomes: ['Intermediate programming', 'Competition day coaching', 'Athlete development planning'],
    cert: 'Active IQ Level 2 Certificate',
  },
  {
    level: 'Level 3',
    title: 'Advanced Leadership',
    subtitle: 'Elite Coaching & Mentorship',
    status: 'future',
    colour: '#E19A47',
    outcomes: ['Elite athlete coaching', 'Mentoring junior coaches', 'Programme design mastery'],
    cert: 'Active IQ Level 3 Certificate',
  },
  {
    level: 'CPD',
    title: 'Professional Development',
    subtitle: 'Continuous Development Units',
    status: 'future',
    colour: '#666677',
    outcomes: ['Specialist masterclasses', 'Competition coaching', 'Youth strength foundations'],
    cert: 'CPD Portfolio',
    note: 'Unlocks after Level 1 completion',
  },
];

/* ── Event images — shown as a connected header band ───────────────── */
const EVENT_IMAGES = [
  { src: '/assets/event-log-press.jpg', label: 'Log Press', icon: '🪵' },
  { src: '/assets/event-atlas-stones.jpg', label: 'Atlas Stones', icon: '🪨' },
  { src: '/assets/event-yoke.jpg', label: 'Yoke', icon: '⚖️' },
  { src: '/assets/event-farmers.jpg', label: "Farmer's Walk", icon: '🚶' },
];

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ArrowRight({ colour }: { colour: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '32px' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 18l6-6-6-6" stroke={colour} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    </div>
  );
}

function StepCard({ step }: { step: PathwayStep }) {
  const isAvailable = step.status === 'available';
  const isFuture = step.status === 'future';
  const isComing = step.status === 'coming';

  return (
    <div
      className="flex flex-col rounded-xl p-5 h-full"
      style={{
        background: isAvailable ? '#14121A' : '#111114',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: `3px solid ${isAvailable ? step.colour : isComing ? step.colour + '60' : 'rgba(255,255,255,0.08)'}`,
        opacity: isFuture ? 0.6 : 1,
        minWidth: 0,
      }}
    >
      {/* Level + status row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="text-[10px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
          style={{ background: `${step.colour}20`, color: step.colour }}
        >
          {step.level}
        </span>
        {isAvailable && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: '#A41C6425', color: '#A41C64' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#A41C64' }} aria-hidden="true" />
            Available
          </span>
        )}
        {isComing && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
            Coming Soon
          </span>
        )}
        {isFuture && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)' }}>
            <LockIcon /> Future
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-white text-sm leading-tight mb-0.5">{step.title}</h3>
      <p className="text-xs mb-4 leading-snug" style={{ color: '#666' }}>{step.subtitle}</p>

      {/* Outcomes */}
      <ul className="flex flex-col gap-1.5 mb-4 flex-1">
        {step.outcomes.map(o => (
          <li key={o} className="flex items-start gap-2 text-xs" style={{ color: '#888' }}>
            <span className="mt-0.5 shrink-0 opacity-80" style={{ color: step.colour }}>✓</span>
            {o}
          </li>
        ))}
      </ul>

      {/* Cert */}
      <p className="text-[11px] mb-4 pb-4 border-b" style={{ color: '#555', borderColor: 'rgba(255,255,255,0.06)' }}>
        {step.cert}
      </p>

      {/* CTA */}
      {step.cta ? (
        <Link
          to={step.cta.to}
          className="block text-center text-sm font-semibold rounded-lg py-2.5 transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #A41C64, #C0246E)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(164,28,100,0.35)',
          }}
        >
          {step.cta.label}
        </Link>
      ) : step.note ? (
        <p className="text-[11px] flex items-center gap-1" style={{ color: '#555' }}>
          <LockIcon /> {step.note}
        </p>
      ) : null}
    </div>
  );
}

export default function PublicPathwayPreview() {
  return (
    <section
      id="coaching-journey"
      style={{
        background: '#0A0A0D',
        padding: '96px 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
      aria-labelledby="coaching-journey-heading"
    >
      <div className="es-container">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-10 max-w-2xl">
          <p className="es-label mb-3">Coaching Pathway</p>
          <h2
            id="coaching-journey-heading"
            className="font-black text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.035em' }}
          >
            The Coaching Journey
          </h2>
          <p className="text-white/45 text-base leading-relaxed">
            Every great Strongman coach starts at Level 1. The pathway builds from technical
            foundation through to advanced leadership and specialist CPD.
          </p>
        </div>

        {/* ── Event images — connected header band ────────────────── */}
        <div
          className="rounded-2xl overflow-hidden mb-10 relative"
          style={{
            background: 'linear-gradient(135deg, #141414, #111)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Top label */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(164,28,100,0.05)' }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A41C64' }}>
              Six Core Events — Level 1 Coaching
            </span>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
            {EVENT_IMAGES.map((img, i) => (
              <div
                key={img.label}
                className="relative overflow-hidden"
                style={{
                  aspectRatio: '4/3',
                  background: '#1A1A1A',
                  borderRight: i < EVENT_IMAGES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <img
                  src={img.src}
                  alt={`${img.label} coaching event`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Placeholder when image missing */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #111 100%)',
                  }}
                  aria-hidden="true"
                >
                  <span className="text-2xl opacity-30">{img.icon}</span>
                  <span className="text-[11px] font-semibold" style={{ color: '#3C3C3C' }}>
                    {img.label}
                  </span>
                </div>
                {/* Label overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  }}
                >
                  <p className="text-[11px] font-bold text-white/70">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step cards — desktop horizontal ─────────────────────── */}
        <div className="hidden lg:flex items-stretch gap-0">
          {STEPS.map((step, i) => (
            <div key={step.level} className="flex items-stretch flex-1 min-w-0">
              <StepCard step={step} />
              {i < STEPS.length - 1 && (
                <ArrowRight colour={STEPS[i + 1].colour} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step cards — mobile vertical ────────────────────────── */}
        <div className="flex lg:hidden flex-col gap-0">
          {STEPS.map((step, i) => (
            <div key={step.level} className="flex">
              {/* Left connector */}
              <div className="flex flex-col items-center mr-4 w-5 shrink-0">
                <div
                  className="w-3 h-3 rounded-full shrink-0 mt-5"
                  style={{ background: step.colour }}
                  aria-hidden="true"
                />
                {i < STEPS.length - 1 && (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{ background: 'rgba(255,255,255,0.08)', minHeight: '20px' }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex-1 mb-4">
                <StepCard step={step} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom note ──────────────────────────────────────────── */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/25">
            Level 2 and Level 3 are in development. Level 1 is available now and actively accepting enrolments.
          </p>
        </div>
      </div>
    </section>
  );
}
