import { Link } from 'react-router-dom';

interface PathwayStep {
  level: string;
  title: string;
  subtitle: string;
  status: 'available' | 'coming' | 'future';
  colour: string;
  unlock: string;
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
    unlock: 'Unlocks Level 2 →',
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
    unlock: 'Unlocks Level 3 →',
    outcomes: ['Intermediate programming', 'Competition day coaching', 'Athlete development planning'],
    cert: 'Active IQ Level 2 Certificate',
  },
  {
    level: 'Level 3',
    title: 'Advanced Leadership',
    subtitle: 'Elite Coaching & Mentorship',
    status: 'future',
    colour: '#E19A47',
    unlock: 'Unlocks CPD →',
    outcomes: ['Elite athlete coaching', 'Mentoring junior coaches', 'Programme design mastery'],
    cert: 'Active IQ Level 3 Certificate',
  },
  {
    level: 'CPD',
    title: 'Continuous Development',
    subtitle: 'Professional Development Units',
    status: 'future',
    colour: '#555566',
    unlock: '',
    outcomes: ['Specialist masterclasses', 'Competition coaching', 'Youth strength foundations'],
    cert: 'CPD Portfolio',
    note: 'Unlocks after Level 1 completion',
  },
];

const EVENT_IMAGES = [
  { src: '/assets/event-log-press.jpg', label: 'Log Press' },
  { src: '/assets/event-atlas-stones.jpg', label: 'Atlas Stones' },
  { src: '/assets/event-yoke.jpg', label: 'Yoke' },
];

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function StepCard({ step }: { step: PathwayStep }) {
  const isAvailable = step.status === 'available';
  const isComing = step.status === 'coming';
  const isFuture = step.status === 'future';

  return (
    <div
      className="flex flex-col rounded-xl p-5 flex-1 min-w-0"
      style={{
        background: '#131316',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: isAvailable ? `3px solid ${step.colour}` : '1px solid rgba(255,255,255,0.07)',
        opacity: isFuture ? 0.65 : 1,
      }}
    >
      {/* Level pill + status */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: `${step.colour}22`, color: step.colour }}
        >
          {step.level}
        </span>
        {isAvailable && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#A41C6433', color: '#A41C64' }}>
            Available
          </span>
        )}
        {isComing && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#3C3C3C', color: '#aaa' }}>
            Coming Soon
          </span>
        )}
        {isFuture && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: '#2C2C2C', color: '#666' }}>
            <LockIcon /> Future
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-white text-base mb-1">{step.title}</h3>
      <p className="text-xs mb-4" style={{ color: '#888' }}>{step.subtitle}</p>

      {/* Outcomes */}
      <ul className="flex flex-col gap-1.5 mb-5 flex-1">
        {step.outcomes.map((o) => (
          <li key={o} className="flex items-start gap-2 text-xs" style={{ color: '#aaa' }}>
            <span className="mt-0.5 shrink-0" style={{ color: step.colour }}>✓</span>
            {o}
          </li>
        ))}
      </ul>

      {/* Cert */}
      <p className="text-xs mb-4" style={{ color: '#666' }}>
        <span style={{ color: '#555' }}>Cert: </span>{step.cert}
      </p>

      {/* CTA */}
      {step.cta && (
        <Link
          to={step.cta.to}
          className="btn-primary text-center text-sm"
          style={{ display: 'block' }}
        >
          {step.cta.label}
        </Link>
      )}

      {step.note && (
        <p className="text-xs mt-3" style={{ color: '#555' }}>{step.note}</p>
      )}
    </div>
  );
}

export default function PublicPathwayPreview() {
  return (
    <section style={{ background: '#0D0D0D', padding: '96px 0' }}>
      <div className="es-container">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="es-label mb-3">The Pathway</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            Your Coaching Journey
          </h2>
          <p style={{ color: '#888' }}>
            Every great Strongman coach starts at Level 1. The pathway builds from foundation to advanced leadership.
          </p>
        </div>

        {/* Event image strip */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {EVENT_IMAGES.map((img) => (
            <div
              key={img.label}
              className="rounded-xl overflow-hidden relative"
              style={{ background: '#1A1A1A', aspectRatio: '16/9' }}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold" style={{ color: '#555' }}>
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Steps — desktop horizontal */}
        <div className="hidden lg:flex items-stretch gap-0">
          {STEPS.map((step, i) => (
            <div key={step.level} className="flex items-center flex-1 min-w-0">
              <StepCard step={step} />
              {i < STEPS.length - 1 && (
                <div className="flex-shrink-0 px-3 self-center">
                  <ChevronRight />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Steps — mobile vertical */}
        <div className="flex lg:hidden flex-col">
          {STEPS.map((step, i) => (
            <div key={step.level} className="flex">
              {/* Left connector line */}
              <div className="flex flex-col items-center mr-4 w-6 shrink-0">
                <div
                  className="w-3 h-3 rounded-full shrink-0 mt-5"
                  style={{ background: step.colour }}
                  aria-hidden="true"
                />
                {i < STEPS.length - 1 && (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{ background: 'rgba(255,255,255,0.1)', minHeight: '24px' }}
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
      </div>
    </section>
  );
}
