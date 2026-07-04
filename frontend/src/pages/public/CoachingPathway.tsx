/**
 * CoachingPathway — detailed Coaching Level 1 → Level 3 + CPD page.
 * Route: /coaching (public)
 *
 * Contains:
 *  – Coaching journey header
 *  – L1 / L2 / L3 / CPD step cards
 *  – Six Core Events section (all 6 events)
 *  – Enrol CTA
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useDocumentHead } from '../../hooks/useDocumentHead';

/* ── Pathway Steps ──────────────────────────────────────────────── */
const STEPS = [
  {
    level: 'Level 1',
    title: 'Foundation',
    subtitle: 'Fundamentals of Coaching Strongman',
    status: 'available' as const,
    colour: '#A41C64',
    outcomes: [
      'Six core Strongman events',
      'Athlete screening & safety',
      'Beginner session structure',
      'Active IQ Level 1 Certificate',
    ],
    cta: { label: 'Enrol Now', to: '/courses/level-1-coaching-strongman' },
  },
  {
    level: 'Level 2',
    title: 'Applied Practice',
    subtitle: 'Advanced Coaching Techniques',
    status: 'coming' as const,
    colour: '#C0246E',
    outcomes: [
      'Intermediate programming',
      'Competition day coaching',
      'Athlete development planning',
      'Active IQ Level 2 Certificate',
    ],
  },
  {
    level: 'Level 3',
    title: 'Advanced Leadership',
    subtitle: 'Elite Coaching & Mentorship',
    status: 'future' as const,
    colour: '#E19A47',
    outcomes: [
      'Elite athlete coaching',
      'Mentoring junior coaches',
      'Programme design mastery',
      'Active IQ Level 3 Certificate',
    ],
  },
  {
    level: 'CPD',
    title: 'Professional Development',
    subtitle: 'Continuing Development Units',
    status: 'future' as const,
    colour: '#666677',
    outcomes: [
      'Specialist masterclasses',
      'Competition coaching units',
      'Youth strength foundations',
      'CPD Portfolio',
    ],
    note: 'Unlocks after Level 1 completion',
  },
] as const;

/* ── Six Core Events ────────────────────────────────────────────── */
const EVENTS = [
  {
    name: 'Log Press',
    icon: '🪵',
    description: 'The signature Strongman overhead event. Technique, loading progressions, and coaching cues.',
    img: '/assets/event-log-press.jpg',
  },
  {
    name: 'Axle Press',
    icon: '⚡',
    description: 'Axle bar mechanics, grip differences, and coaching the continental clean.',
    img: '/assets/event-axle-press.jpg',
  },
  {
    name: 'Deadlift',
    icon: '🔩',
    description: 'Silver dollar, car, and frame deadlift variations. Technique and coaching cues for each.',
    img: '/assets/event-deadlift.jpg',
  },
  {
    name: "Farmer's Walk",
    icon: '🚶',
    description: 'Grip, turn mechanics, and speed work. Coaching foot placement for competition performance.',
    img: '/assets/event-farmers.jpg',
  },
  {
    name: 'Yoke',
    icon: '⚖',
    description: 'Load placement, leg drive, and visual cue techniques. Common errors and correction strategies.',
    img: '/assets/event-yoke.jpg',
  },
  {
    name: 'Atlas Stones',
    icon: '🪨',
    description: 'Tacky application, lap mechanics, and safe loading progressions for the pinnacle event.',
    img: '/assets/event-atlas-stones.jpg',
  },
] as const;

/* ── Status badge ───────────────────────────────────────────────── */
function StatusBadge({ status, colour }: { status: string; colour: string }) {
  if (status === 'available') return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
      style={{ background: `${colour}20`, color: colour, border: `1px solid ${colour}40` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colour }} />
      Available Now
    </span>
  );
  if (status === 'coming') return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}>
      Coming Soon
    </span>
  );
  return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
      Future
    </span>
  );
}

/* ── Step card ──────────────────────────────────────────────────── */
function StepCard({ step }: { step: typeof STEPS[number] }) {
  const isAvailable = step.status === 'available';
  const isFuture    = step.status === 'future';

  return (
    <div
      className="flex flex-col rounded-2xl p-6 h-full"
      style={{
        background: isAvailable ? '#1B1B20' : '#111116',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: `3px solid ${isAvailable ? step.colour : step.status === 'coming' ? step.colour + '55' : 'rgba(255,255,255,0.08)'}`,
        opacity: isFuture ? 0.60 : 1,
      }}
    >
      {/* Level + badge */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-[10px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
          style={{ background: `${step.colour}22`, color: step.colour }}>
          {step.level}
        </span>
        <StatusBadge status={step.status} colour={step.colour} />
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-white leading-tight mb-1 text-base">{step.title}</h3>
      <p className="text-xs mb-5 leading-snug" style={{ color: '#55555E' }}>{step.subtitle}</p>

      {/* Outcomes */}
      <ul className="flex flex-col gap-2 mb-5 flex-1">
        {step.outcomes.map(o => (
          <li key={o} className="flex items-start gap-2 text-xs" style={{ color: '#75757D' }}>
            <span className="mt-0.5 shrink-0" style={{ color: step.colour }}>✓</span>
            {o}
          </li>
        ))}
      </ul>

      {/* CTA or locked note */}
      {'cta' in step && step.cta ? (
        <Link
          to={step.cta.to}
          className="block text-center text-sm font-semibold rounded-xl py-3 transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #A41C64, #C0246E)',
            color: '#fff',
            boxShadow: '0 4px 18px rgba(164,28,100,0.35)',
          }}
        >
          {step.cta.label}
        </Link>
      ) : 'note' in step && step.note ? (
        <p className="text-[11px] flex items-center gap-1.5" style={{ color: '#55555E' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {step.note}
        </p>
      ) : null}
    </div>
  );
}

/* ── Event card ─────────────────────────────────────────────────── */
function EventCard({ event }: { event: typeof EVENTS[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: '#151519',
        border: `1px solid ${hovered ? 'rgba(194,24,106,0.30)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered ? '0 6px 32px rgba(164,28,100,0.14)' : 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image / placeholder */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: '#0D0D12' }}>
        <img
          src={event.img}
          alt={`${event.name} coaching event`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Placeholder always present underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pointer-events-none"
          aria-hidden="true">
          <span className="text-3xl opacity-20">{event.icon}</span>
        </div>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(21,21,25,0.85), transparent)' }} />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-base">{event.icon}</span>
          <h4 className="font-bold text-white text-sm">{event.name}</h4>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#75757D' }}>{event.description}</p>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function CoachingPathway() {
  useDocumentHead({
    title: 'Coaching Pathway',
    description: 'Level 1 through Level 3 Strongman coaching qualifications and ongoing CPD.',
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: [
            'radial-gradient(ellipse 100% 80% at 20% -15%, rgba(164,28,100,0.24) 0%, transparent 55%)',
            'radial-gradient(ellipse 55% 60% at 90% 80%, rgba(194,24,106,0.07) 0%, transparent 52%)',
            '#050506',
          ].join(', '),
          paddingTop: 'calc(64px + 72px)',
          paddingBottom: '72px',
        }}
        aria-labelledby="coaching-pathway-heading"
      >
        {/* Radial glow already in background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ display: 'none' }} />
        {/* Chalk scratches */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{
            backgroundImage: 'repeating-linear-gradient(-22deg, transparent, transparent 280px, rgba(255,255,255,0.004) 280px, rgba(255,255,255,0.004) 281px)',
          }}
        />

        <div className="es-container relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Link to="/" className="hover:text-white/60 transition-colors">Home</Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: '#A41C64' }}>Coaching Pathway</span>
          </div>

          <div style={{ maxWidth: '680px' }}>
            <p className="es-label mb-4">Coaching Pathway</p>
            <h1
              id="coaching-pathway-heading"
              className="font-black text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', letterSpacing: '-0.04em' }}
            >
              The Coaching
              <br />
              <span style={{ color: '#A41C64' }}>Journey</span>
            </h1>
            <p className="text-white/45 leading-relaxed mb-8"
              style={{ fontSize: 'clamp(1rem, 1.5vw, 1.1rem)', maxWidth: '520px' }}>
              Every great Strongman coach starts at Level 1. The pathway builds from technical
              foundation through applied practice, advanced leadership, and specialist CPD —
              all underpinned by Active IQ accreditation.
            </p>

            {/* Accreditation pills */}
            <div className="flex flex-wrap gap-2" role="list" aria-label="Accreditations">
              {['Active IQ Accredited', 'WHEA.GB Endorsed', 'Armed Forces Strongman'].map(t => (
                <span key={t} role="listitem"
                  className="text-[11px] font-medium text-white/40 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PATHWAY STEPS ─────────────────────────────────────── */}
      <section
        style={{
          background: [
            'radial-gradient(ellipse 90% 55% at 88% 30%, rgba(164,28,100,0.10) 0%, transparent 52%)',
            'radial-gradient(ellipse 60% 50% at 5% 70%, rgba(194,24,106,0.07) 0%, transparent 52%)',
            '#050506',
          ].join(', '),
          padding: '80px 0',
          borderTop: '1px solid rgba(194,24,106,0.08)',
        }}
        aria-labelledby="steps-heading"
      >
        <div className="es-container">
          <div className="mb-12 max-w-xl">
            <p className="es-label mb-3">Qualification Route</p>
            <h2 id="steps-heading"
              className="font-black text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.035em' }}>
              Level 1 to Level 3
            </h2>
            <p className="text-white/40 text-base leading-relaxed">
              A structured progression from foundation coaching through to advanced leadership.
              Each level builds on the last — no shortcuts, no shortcuts needed.
            </p>
          </div>

          {/* Desktop — horizontal row */}
          <div className="hidden lg:grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STEPS.map(step => <StepCard key={step.level} step={step} />)}
          </div>

          {/* Mobile — vertical stack */}
          <div className="flex lg:hidden flex-col gap-4">
            {STEPS.map(step => <StepCard key={step.level} step={step} />)}
          </div>

          {/* Arrow connectors — desktop only, decorative */}
          <div className="hidden lg:flex items-center justify-center gap-0 mt-6">
            {['L1', '→', 'L2', '→', 'L3', '→', 'CPD'].map((s, i) => (
              <span key={i} style={{
                color: s === '→' ? 'rgba(255,255,255,0.12)' : 'rgba(164,28,100,0.5)',
                fontSize: s === '→' ? '16px' : '10px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '0 12px',
              }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SIX CORE EVENTS ───────────────────────────────────── */}
      <section
        style={{
          background: [
            'radial-gradient(ellipse 110% 60% at 50% 0%, rgba(164,28,100,0.14) 0%, transparent 50%)',
            'radial-gradient(ellipse 50% 50% at 92% 80%, rgba(194,24,106,0.07) 0%, transparent 52%)',
            '#050506',
          ].join(', '),
          padding: '80px 0',
          borderTop: '1px solid rgba(194,24,106,0.08)',
        }}
        aria-labelledby="events-heading"
      >
        <div className="es-container">
          <div className="mb-12 max-w-2xl">
            <p className="es-label mb-3">Level 1 Content</p>
            <h2 id="events-heading"
              className="font-black text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.035em' }}>
              Six Core
              <span style={{ color: '#A41C64' }}> Strongman Events</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed">
              Level 1 covers all six major competition events — the events that define the sport.
              Every module includes technique, coaching cues, loading progressions, and
              athlete safety considerations.
            </p>
          </div>

          {/* 3 × 2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EVENTS.map(event => (
              <EventCard key={event.name} event={event} />
            ))}
          </div>

          {/* Note */}
          <p className="mt-8 text-xs text-center" style={{ color: 'rgba(255,255,255,0.22)' }}>
            All six events are covered within the Level 1 qualification. A practical coaching
            assessment is required for completion.
          </p>
        </div>
      </section>

      {/* ── 4. ACCREDITATION STRIP ───────────────────────────────── */}
      <section
        style={{
          background: '#0A0A0D',
          padding: '48px 0',
          borderTop: '1px solid rgba(194,24,106,0.08)',
          borderBottom: '1px solid rgba(194,24,106,0.08)',
        }}
      >
        <div className="es-container">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-white/25 text-xs uppercase tracking-[0.1em] font-semibold mb-2">Qualification Standard</p>
              <p className="font-bold text-white text-base">Active IQ Level 1 Certificate</p>
              <p className="text-white/35 text-sm mt-1">Nationally recognised. Employer accepted.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Accredited', sub: 'Active IQ' },
                { label: 'Endorsed', sub: 'WHEA.GB' },
                { label: 'Recognised', sub: 'Armed Forces Strongman' },
              ].map(item => (
                <div key={item.label}
                  className="px-4 py-3 rounded-xl text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-[0.08em]">{item.label}</div>
                  <div className="text-xs text-white/30 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: [
            'radial-gradient(ellipse 110% 80% at 50% 50%, rgba(164,28,100,0.22) 0%, transparent 60%)',
            'radial-gradient(ellipse 55% 50% at 10% 15%, rgba(194,24,106,0.10) 0%, transparent 52%)',
            'radial-gradient(ellipse 45% 55% at 90% 85%, rgba(164,28,100,0.08) 0%, transparent 52%)',
            '#050506',
          ].join(', '),
          padding: '96px 0',
        }}
      >
        <div className="es-container text-center" style={{ maxWidth: '580px', margin: '0 auto' }}>
          <p className="es-label mb-4">Start Today</p>
          <h2 className="font-black text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.04em', lineHeight: '1.05' }}>
            Begin at Level 1.
            <br />
            <span style={{ color: '#A41C64' }}>Build Your Credentials.</span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 text-base">
            Level 1 is open for enrolment now. Dates are released throughout the year —
            register your interest to be notified first.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses/level-1-coaching-strongman"
              className="px-8 py-4 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 8px 32px rgba(164,28,100,0.45)',
              }}
            >
              Enrol in Level 1
            </Link>
            <Link
              to="/register-interest?type=level-1-coaching"
              className="px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-white/6"
              style={{ border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.65)' }}
            >
              Register Interest
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
