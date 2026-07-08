/**
 * AllPathwaysOverview — public 4-pathway overview.
 *
 * Shows all four main Academy pathways as interactive cards:
 * Coaching, Refereeing, StrongKidz, EatStrong.
 *
 * EatStrong uses the standard EducateStrong visual language (no green here).
 * Green treatment lives inside the EatStrong section/page itself.
 */

import { Link } from 'react-router-dom';

interface Pathway {
  id: string;
  badge: string;
  colour: string;         // accent colour
  title: string;
  desc: string;
  status: 'available' | 'coming' | 'live';
  statusLabel: string;
  leads: string;          // "What it leads to"
  outcomes: string[];
  cta: string;
  to: string;
  anchor?: string;        // optional anchor on same page
}

const PATHWAYS: Pathway[] = [
  {
    id: 'coaching',
    badge: 'Coaching',
    colour: '#A41C64',
    title: 'Coaching Pathway',
    desc: 'For personal trainers, gym owners, and coaches who want a structured, accredited qualification in Strongman coaching.',
    status: 'available',
    statusLabel: 'Level 1 Available',
    leads: 'Active IQ accredited qualification — Level 1 through Level 3.',
    outcomes: [
      'Six core Strongman events',
      'Athlete screening & safety',
      'Session planning & delivery',
      'Progress to Level 2 & 3',
    ],
    cta: 'Explore Coaching',
    to: '/coaching',
  },
  {
    id: 'refereeing',
    badge: 'Refereeing',
    colour: '#C0246E',
    title: 'Refereeing Pathway',
    desc: 'For athletes and coaches who want to contribute to the sport by officiating competitions to a consistent, credible standard.',
    status: 'available',
    statusLabel: 'Level 1 Available',
    leads: 'WHEA.GB endorsed certification for officiating UK competitions.',
    outcomes: [
      'Event rules across all major events',
      'Live practical judging drills',
      'Join a network of certified officials',
      'Armed Forces Strongman endorsed',
    ],
    cta: 'Explore Refereeing',
    to: '/courses/level-1-strongman-refereeing',
  },
  {
    id: 'strongkidz',
    badge: 'StrongKidz',
    colour: '#E19A47',
    title: 'StrongKidz Pathway',
    desc: 'For coaches and youth programme leaders who want to deliver safe, structured strength sessions for young people.',
    status: 'available',
    statusLabel: 'Sheffield Sessions',
    leads: 'Coach education and youth session programme — building confidence in young athletes.',
    outcomes: [
      'Age-appropriate movement frameworks',
      'Safeguarding-first certification',
      'Session planning & parent communication',
      'Weekly sessions in Sheffield',
    ],
    cta: 'Explore StrongKidz',
    to: '/strongkidz',
  },
  {
    id: 'eatstrong',
    badge: 'EatStrong',
    colour: '#888899',
    title: 'EatStrong Pathway',
    desc: 'Performance nutrition education built specifically for Strongman coaches and athletes. Evidence-based, scope-of-practice aware.',
    status: 'coming',
    statusLabel: 'Coming Soon',
    leads: 'Nutrition education for coaches — Strongman-specific, not generic diet advice.',
    outcomes: [
      'Competition and recovery fuelling',
      'Making weight safely',
      'Evidence-based supplement guidance',
      'Scope-of-practice boundaries',
    ],
    cta: 'Explore EatStrong',
    to: '/eatstrong',
  },
];

/*
 * Premium placeholder for a future real photo. No fake/stock imagery —
 * just a tasteful gradient + icon so the card feels intentional while
 * real EducateStrong photography isn't available yet. Swap for a real
 * <img> later; the aria-label documents exactly what should go here.
 */
function PathwayImagePlaceholder({ colour, title }: { colour: string; title: string }) {
  return (
    <div
      role="img"
      aria-label={`[PHOTO PLACEHOLDER] ${title} — replace with a real EducateStrong photo`}
      className="rounded-xl mb-5 flex items-center justify-center overflow-hidden"
      style={{
        height: '120px',
        background: `linear-gradient(135deg, ${colour}22 0%, ${colour}08 100%)`,
        border: `1px solid ${colour}22`,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={colour} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

function StatusBadge({ status, label, colour }: { status: string; label: string; colour: string }) {
  if (status === 'available') {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
        style={{ background: `${colour}18`, color: colour, border: `1px solid ${colour}30` }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: colour }} aria-hidden="true" />
        {label}
      </span>
    );
  }
  if (status === 'coming') {
    return (
      <span
        className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {label}
      </span>
    );
  }
  return null;
}

function PathwayCard({ pathway }: { pathway: Pathway }) {
  const isExternal = pathway.to.startsWith('http');
  const isAnchor = pathway.to.startsWith('#');

  const cardInner = (
    <div
      className="group flex flex-col h-full rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: `3px solid ${pathway.colour}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.background = 'rgba(255,255,255,0.04)';
        el.style.borderColor = `${pathway.colour}40`;
        el.style.boxShadow = `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${pathway.colour}20, 0 0 32px rgba(164,28,100,0.14)`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.background = 'rgba(255,255,255,0.025)';
        el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
      }}
    >
      {/* Image placeholder — ready for real photography */}
      <PathwayImagePlaceholder colour={pathway.colour} title={pathway.title} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3"
            style={{ background: `${pathway.colour}18`, color: pathway.colour }}
          >
            {pathway.badge}
          </span>
          <h3
            className="font-black text-white leading-tight"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', letterSpacing: '-0.02em' }}
          >
            {pathway.title}
          </h3>
        </div>
        <StatusBadge status={pathway.status} label={pathway.statusLabel} colour={pathway.colour} />
      </div>

      {/* Description */}
      <p className="text-white/45 text-sm leading-relaxed mb-5 flex-1">
        {pathway.desc}
      </p>

      {/* Outcomes */}
      <ul className="space-y-1.5 mb-5">
        {pathway.outcomes.map(o => (
          <li key={o} className="flex items-start gap-2 text-xs text-white/35">
            <span
              className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: pathway.colour, minWidth: '4px', minHeight: '4px' }}
              aria-hidden="true"
            />
            {o}
          </li>
        ))}
      </ul>

      {/* Leads to */}
      <div
        className="rounded-lg px-3 py-2.5 mb-5 text-xs leading-relaxed"
        style={{
          background: `${pathway.colour}0D`,
          border: `1px solid ${pathway.colour}18`,
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <span style={{ color: pathway.colour }} className="font-semibold">Leads to: </span>
        {pathway.leads}
      </div>

      {/* CTA */}
      <div
        className="flex items-center justify-between text-sm font-semibold transition-all duration-200 group-hover:gap-3"
        style={{ color: pathway.colour }}
      >
        {pathway.cta}
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  // Render as anchor, Link, or external anchor
  if (isAnchor) {
    return (
      <a href={pathway.to} aria-label={pathway.title} className="block h-full">
        {cardInner}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a href={pathway.to} target="_blank" rel="noopener noreferrer" aria-label={pathway.title} className="block h-full">
        {cardInner}
      </a>
    );
  }

  return (
    <Link to={pathway.to} aria-label={pathway.title} className="block h-full">
      {cardInner}
    </Link>
  );
}

export default function AllPathwaysOverview() {
  return (
    <section
      style={{
        background: '#0D0D0D',
        padding: '96px 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
      aria-labelledby="pathways-heading"
    >
      <div className="es-container">
        {/* Heading */}
        <div className="mb-12">
          <p className="es-label mb-3">The Academy</p>
          <h2
            id="pathways-heading"
            className="font-black text-white mb-4"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              letterSpacing: '-0.035em',
              lineHeight: '1.1',
            }}
          >
            Choose Your Pathway
          </h2>
          <p className="text-white/45 text-base leading-relaxed max-w-2xl">
            Educate.Strong covers the full spectrum of Strongman education — from coaching
            qualifications and officiating certification to youth development and performance
            nutrition. Find the route that fits your role in the sport.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {PATHWAYS.map(p => (
            <PathwayCard key={p.id} pathway={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
