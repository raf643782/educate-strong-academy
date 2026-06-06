/**
 * ProfessionalPathway — visual journey showing level progression.
 * Horizontal connecting line on desktop, vertical timeline on mobile.
 * Hover/active state highlights each step.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface PathwayStep {
  num: string;
  level: string;
  title: string;
  subtitle: string;
  colour: string;
  glowColour: string;
  description: string;
  outcomes: string[];
  status: 'available' | 'coming' | 'future';
  to?: string;
  cta?: string;
}

const STEPS: PathwayStep[] = [
  {
    num: '01',
    level: 'Level 1',
    title: 'Foundation',
    subtitle: 'Fundamentals of Coaching',
    colour: '#A41C64',
    glowColour: 'rgba(164,28,100,0.35)',
    description: 'Safe, confident coaching of the six core Strongman events. Practical two-day delivery. Active IQ accredited and industry recognised.',
    outcomes: ['Six core event coaching', 'Active IQ Level 1 qualification', 'Athlete screening & safety', 'Beginner session planning'],
    status: 'available',
    to: '/courses/level-1-coaching-strongman',
    cta: 'Enrol Now',
  },
  {
    num: '02',
    level: 'Level 2',
    title: 'Applied Practice',
    subtitle: 'Coaching Strongman',
    colour: '#C0246E',
    glowColour: 'rgba(192,36,110,0.3)',
    description: 'Intermediate programming, competition preparation, advanced event coaching, and nutrition fundamentals for coaches working with developing athletes.',
    outcomes: ['Periodisation & programming', 'Competition preparation', 'Advanced event technique', 'Athlete performance monitoring'],
    status: 'coming',
  },
  {
    num: '03',
    level: 'Level 3',
    title: 'Advanced Leadership',
    subtitle: 'Advanced Coaching',
    colour: '#E19A47',
    glowColour: 'rgba(225,154,71,0.3)',
    description: 'High-performance athlete management, coaching systems, and potential academy representation for experienced practitioners working at elite level.',
    outcomes: ['Elite athlete development', 'High-performance programming', 'Coaching system design', 'Academy delivery pathway'],
    status: 'coming',
  },
  {
    num: 'CPD',
    level: 'Ongoing',
    title: 'Professional Development',
    subtitle: 'Continuing Practice',
    colour: '#555566',
    glowColour: 'rgba(85,85,102,0.25)',
    description: 'Renewal modules, specialist certifications, and recognition throughout your career to keep qualifications current and skills sharp.',
    outcomes: ['Qualification renewal', 'Specialist modules', 'Industry recognition', 'Ongoing career support'],
    status: 'future',
  },
];

export default function ProfessionalPathway() {
  const [activeStep, setActiveStep] = useState<string | null>('01');

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #111111 50%, #0A0A0A 100%)', padding: '96px 0' }}
      aria-labelledby="pathway-heading"
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(rgba(164,28,100,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(164,28,100,0.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="es-container relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="es-label mb-3">Professional Pathway</p>
          <h2
            id="pathway-heading"
            className="font-black text-white mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.035em' }}
          >
            A Career-Long Journey
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Every level builds on the last. Progress at your pace, return for each qualification
            when you're ready, and build a professional record that lasts.
          </p>
        </div>

        {/* ── Desktop: horizontal timeline ─────────────────────────────── */}
        <div className="hidden lg:block">
          {/* Connecting line behind circles */}
          <div className="relative flex items-start justify-between" style={{ paddingTop: '40px' }}>
            {/* The line */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              aria-hidden="true"
              style={{
                top: '40px',
                height: '2px',
                background: 'linear-gradient(to right, #A41C64 0%, #C0246E 33%, #E19A47 66%, #555566 100%)',
                opacity: 0.4,
                zIndex: 0,
              }}
            />

            {/* Steps */}
            {STEPS.map((step) => {
              const isActive = activeStep === step.num;
              const isAvailable = step.status === 'available';

              return (
                <div
                  key={step.num}
                  className="flex-1 flex flex-col items-center px-3 cursor-pointer group"
                  style={{ zIndex: 1, opacity: step.status === 'future' ? 0.5 : 1 }}
                  onMouseEnter={() => setActiveStep(step.num)}
                  onMouseLeave={() => setActiveStep('01')}
                  onClick={() => setActiveStep(step.num)}
                >
                  {/* Circle */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center font-black text-white text-sm mb-5 flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isActive || isAvailable
                        ? `radial-gradient(circle at 35% 35%, ${step.colour}ee 0%, ${step.colour} 100%)`
                        : '#1A1A1A',
                      border: `2px solid ${isActive ? step.colour : 'rgba(255,255,255,0.12)'}`,
                      boxShadow: isActive
                        ? `0 0 32px ${step.glowColour}, 0 0 64px ${step.glowColour}`
                        : 'none',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Card */}
                  <div
                    className="w-full rounded-2xl p-5 transition-all duration-300"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isActive ? step.colour + '55' : 'rgba(255,255,255,0.07)'}`,
                      borderTop: `3px solid ${step.colour}`,
                      boxShadow: isActive ? `0 8px 32px ${step.glowColour}` : 'none',
                    }}
                  >
                    {/* Level label */}
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1"
                      style={{ color: step.colour }}
                    >
                      {step.level}
                    </p>
                    <h3 className="font-black text-white text-lg leading-tight mb-1">{step.title}</h3>
                    <p className="text-white/40 text-xs mb-4">{step.subtitle}</p>

                    {/* Description — shown when active */}
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: isActive ? '300px' : '0', opacity: isActive ? 1 : 0 }}
                    >
                      <p className="text-white/55 text-sm leading-relaxed mb-4">{step.description}</p>
                      <ul className="space-y-1.5 mb-5">
                        {step.outcomes.map(o => (
                          <li key={o} className="flex items-start gap-2 text-xs text-white/45">
                            <span
                              className="mt-1.5 flex-shrink-0 rounded-full"
                              style={{ width: '4px', height: '4px', background: step.colour, minWidth: '4px' }}
                              aria-hidden="true"
                            />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Status badge / CTA */}
                    {step.status === 'available' && step.to ? (
                      <Link
                        to={step.to}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 transition-all duration-200 hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${step.colour}, ${step.colour}cc)`,
                          color: '#fff',
                          boxShadow: `0 4px 12px ${step.glowColour}`,
                        }}
                      >
                        {step.cta || 'Start Now'}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : step.status === 'coming' ? (
                      <span className="inline-block text-[10px] font-semibold text-white/30 bg-white/6 px-3 py-1.5 rounded-full">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] font-semibold text-white/20 bg-white/4 px-3 py-1.5 rounded-full">
                        Future Phase
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: vertical timeline ─────────────────────────────────── */}
        <ol className="lg:hidden space-y-4" role="list">
          {STEPS.map((step, idx) => (
            <li
              key={step.num}
              className="relative pl-14"
              style={{ opacity: step.status === 'future' ? 0.5 : 1 }}
            >
              {/* Vertical connector */}
              {idx < STEPS.length - 1 && (
                <div
                  className="absolute left-9 top-10 bottom-0 w-px"
                  style={{ background: `linear-gradient(to bottom, ${step.colour}60, ${STEPS[idx + 1].colour}30)` }}
                  aria-hidden="true"
                />
              )}
              {/* Circle */}
              <div
                className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-xs"
                style={{
                  background: step.status === 'available'
                    ? `radial-gradient(circle, ${step.colour}ee, ${step.colour})`
                    : '#1A1A1A',
                  border: `2px solid ${step.colour}`,
                  boxShadow: step.status === 'available' ? `0 0 16px ${step.glowColour}` : 'none',
                }}
              >
                {step.num}
              </div>

              {/* Content */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderTop: `2px solid ${step.colour}`,
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: step.colour }}>
                  {step.level}
                </p>
                <h3 className="font-black text-white text-base mb-2">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-3">{step.description}</p>

                {step.status === 'available' && step.to && (
                  <Link
                    to={step.to}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                    style={{ background: `linear-gradient(135deg, ${step.colour}, ${step.colour}cc)` }}
                  >
                    {step.cta || 'Start Now'}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                {step.status === 'coming' && (
                  <span className="inline-block text-[10px] text-white/30 bg-white/6 px-3 py-1.5 rounded-full">Coming Soon</span>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #A41C64 0%, #C0246E 100%)',
              boxShadow: '0 0 0 1px rgba(164,28,100,0.4), 0 8px 24px rgba(164,28,100,0.4)',
            }}
          >
            View All Courses
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
