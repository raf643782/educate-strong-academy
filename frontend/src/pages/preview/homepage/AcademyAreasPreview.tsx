/**
 * AcademyAreasPreview — preview-only "Explore the Academy" section.
 *
 * Replaces the production "Choose Your Pathway" cards with rewritten
 * copy (distinct sentence structure per card, no shared template
 * language, no claims beyond what's already confirmed) and real
 * existing photography where a suitable asset already exists in
 * /public/assets (coaching-l1-cover.webp, refereeing-l1-content.webp,
 * strongkidz.avif). No new photography was generated. EatStrong has no
 * existing suitable photo, so it keeps a clean placeholder area — see
 * the final report for the exact image brief.
 *
 * Also carries the "courses and qualifications" information (each
 * card's "Leads to" line) rather than a separate, repetitive section.
 */
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';

interface Area {
  id: string;
  badge: string;
  colour: string;
  title: string;
  status: string;
  statusTone: 'live' | 'coming';
  desc: string;
  leadsTo: string;
  cta: string;
  to: string;
  image?: string;
  imageAlt?: string;
}

const AREAS: Area[] = [
  {
    id: 'coaching',
    badge: 'Coaching',
    colour: '#A41C64',
    title: 'Coaching Education',
    status: 'Level 1 Available',
    statusTone: 'live',
    desc: 'Strongman coaching is a specific skill. You are teaching people to lift awkward, heavy and unpredictable objects safely, not simply heavy barbells. This pathway moves through the six core events, athlete screening, session planning and real coaching practice.',
    leadsTo: 'A Level 1 coaching qualification, with Level 2 and Level 3 to follow.',
    cta: 'Explore Coaching',
    to: '/coaching',
    image: '/assets/coaching-l1-cover.webp',
    imageAlt: 'Coaching Education, Level 1 Fundamentals of Coaching Strongman',
  },
  {
    id: 'refereeing',
    badge: 'Refereeing',
    colour: '#C0246E',
    title: 'Refereeing and Competition Standards',
    status: 'Level 1 Available',
    statusTone: 'live',
    desc: 'Every competition depends on confident, consistent officiating. This pathway is for athletes, coaches and organisers who want to understand event rules properly and make calls with authority rather than guesswork.',
    leadsTo: 'A Level 1 refereeing qualification.',
    cta: 'Explore Refereeing',
    to: '/courses/level-1-strongman-refereeing',
    image: '/assets/refereeing-l1-content.webp',
    imageAlt: 'Refereeing and Competition Standards, Level 1 Strongman Refereeing',
  },
  {
    id: 'strongkidz',
    badge: 'StrongKidz',
    colour: '#E19A47',
    title: 'StrongKidz',
    status: 'Sheffield Sessions',
    statusTone: 'live',
    desc: 'Strength training for children looks nothing like strength training for adults. StrongKidz introduces young people to functional movement, confidence and resilience through age appropriate sessions in Sheffield, led by coaches trained specifically to work with young athletes.',
    leadsTo: 'A StrongKidz Coach Education qualification for adults delivering sessions.',
    cta: 'Explore StrongKidz',
    to: '/strongkidz',
    image: '/assets/strongkidz.avif',
    imageAlt: 'A StrongKidz youth strength session',
  },
  {
    id: 'eatstrong',
    badge: 'EatStrong',
    colour: '#888899',
    title: 'EatStrong',
    status: 'Live Resources',
    statusTone: 'live',
    desc: 'Strongman athletes eat differently to most gym goers, and coaches are often the first person asked about it. EatStrong gives coaches and athletes nutrition education grounded in evidence, built around competition, recovery and everyday training, without straying into personalised dietary advice.',
    leadsTo: 'Nutrition content built into the coaching pathway, with more to follow.',
    cta: 'Explore EatStrong',
    to: '/eatstrong',
  },
];

function AreaImage({ area }: { area: Area }) {
  if (area.image) {
    return (
      <div className="rounded-xl mb-5 overflow-hidden" style={{ height: '148px' }}>
        <img
          src={area.image}
          alt={area.imageAlt || ''}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }
  // EatStrong: no suitable existing photo. Clean placeholder, image brief in the final report.
  return (
    <div
      role="img"
      aria-label="Image area reserved for EatStrong photography, see image brief in the final report"
      className="rounded-xl mb-5 flex items-center justify-center overflow-hidden"
      style={{
        height: '148px',
        background: `linear-gradient(135deg, ${area.colour}22 0%, ${area.colour}08 100%)`,
        border: `1px solid ${area.colour}22`,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={area.colour} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

function AreaCard({ area }: { area: Area }) {
  return (
    <Link to={area.to} aria-label={area.title} className="block h-full">
      <div
        className="group flex flex-col h-full rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: `3px solid ${area.colour}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        <AreaImage area={area} />

        <div className="flex items-start justify-between gap-3 mb-4">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
            style={{ background: `${area.colour}18`, color: area.colour }}
          >
            {area.badge}
          </span>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full whitespace-nowrap"
            style={{
              background: area.statusTone === 'live' ? `${area.colour}18` : 'rgba(255,255,255,0.05)',
              color: area.statusTone === 'live' ? area.colour : 'rgba(255,255,255,0.3)',
              border: area.statusTone === 'live' ? `1px solid ${area.colour}30` : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {area.statusTone === 'live' && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: area.colour }} aria-hidden="true" />
            )}
            {area.status}
          </span>
        </div>

        <h3 className="font-black text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)', letterSpacing: '-0.02em' }}>
          {area.title}
        </h3>

        <p className="text-white/45 text-sm leading-relaxed mb-5 flex-1">{area.desc}</p>

        <div
          className="rounded-lg px-3 py-2.5 mb-5 text-xs leading-relaxed"
          style={{ background: `${area.colour}0D`, border: `1px solid ${area.colour}18`, color: 'rgba(255,255,255,0.4)' }}
        >
          <span style={{ color: area.colour }} className="font-semibold">Leads to </span>
          {area.leadsTo}
        </div>

        <div className="flex items-center justify-between text-sm font-semibold transition-all duration-200 group-hover:gap-3" style={{ color: area.colour }}>
          {area.cta}
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function AcademyAreasPreview() {
  return (
    <section
      style={{ background: '#0D0D0D', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-labelledby="academy-areas-heading"
    >
      <div className="es-container">
        <RevealOnScroll>
          <div className="mb-12" style={{ maxWidth: '720px' }}>
            <p className="es-label mb-3">The Academy</p>
            <h2
              id="academy-areas-heading"
              className="font-black text-white mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.035em', lineHeight: '1.1' }}
            >
              Explore the Academy
            </h2>
            <p className="text-white/45 text-base leading-relaxed max-w-2xl">
              Educate Strong covers the full range of Strongman education, from coaching and
              officiating to youth development and performance nutrition. Find the part that
              matches why you are here.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {AREAS.map((area, i) => (
            <RevealOnScroll key={area.id} delay={i * 0.06}>
              <AreaCard area={area} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
