import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AcademyInAction from '../../components/sections/AcademyInAction';
import QualifiedReferees from '../../components/sections/QualifiedReferees';
import PartnerLogosMarquee from '../../components/sections/PartnerLogosMarquee';

/* ── Section heading component — proper h2 for SEO ─────────────────── */
function SectionHeader({
  label, heading, sub, center = false,
}: {
  label?: string; heading: string; sub?: string; center?: boolean;
}) {
  return (
    <div className={`mb-10 md:mb-14 ${center ? 'text-center' : ''}`}>
      {label && <p className="es-label mb-3">{label}</p>}
      <h2
        className="font-black text-white leading-tight mb-4"
        style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', letterSpacing: '-0.03em' }}
      >
        {heading}
      </h2>
      {sub && (
        <p className="text-es-muted text-base md:text-lg leading-relaxed max-w-2xl"
          style={center ? { margin: '0 auto' } : {}}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── Pathway card ─────────────────────────────────────────────────── */
function PathwayCard({
  badge, badgeType = 'accent', title, who, outcomes, to, levels, accent = false,
}: {
  badge: string; badgeType?: 'accent' | 'amber' | 'grey'; title: string;
  who: string; outcomes: string[]; to: string; levels?: string; accent?: boolean;
}) {
  return (
    <div
      className="es-card-hover flex flex-col p-6 h-full group"
      style={{ borderTop: accent ? '2px solid #A41C64' : '2px solid #3C3C3C' }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className={`badge-${badgeType}`}>{badge}</span>
        {levels && <span className="text-xs text-es-subtle">{levels}</span>}
      </div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-es-accent transition-colors">{title}</h3>
      <p className="text-es-muted text-sm mb-5 leading-relaxed flex-1">{who}</p>
      <ul className="space-y-1.5 mb-6">
        {outcomes.map(o => (
          <li key={o} className="flex items-start gap-2 text-sm text-es-muted">
            <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#A41C64', minWidth: '4px', minHeight: '4px' }} />
            {o}
          </li>
        ))}
      </ul>
      <Link to={to} className="btn-secondary text-sm flex items-center justify-between">
        Explore Pathway
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

/* ── Course card ──────────────────────────────────────────────────── */
function CourseCard({
  title, type, level, description, benefits, coverImg, to, highlight = false,
}: {
  title: string; type: string; level: string; description: string;
  benefits: string[]; coverImg?: string; to: string; highlight?: boolean;
}) {
  return (
    <article className="es-card-hover flex flex-col overflow-hidden">
      <div className="relative h-48 sm:h-52 overflow-hidden" style={{ background: '#1A1A1A' }}>
        {coverImg ? (
          <img src={coverImg} alt={`${title} course cover`} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-es-subtle">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs">Course Cover</span>
          </div>
        )}
        {highlight && (
          <div className="absolute top-3 right-3">
            <span className="badge-accent">Active IQ</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge-grey">{type}</span>
          <span className="badge-grey">{level}</span>
        </div>
        <h3 className="text-base font-bold text-white mb-2 leading-snug">{title}</h3>
        <p className="text-es-muted text-sm leading-relaxed mb-5 flex-1">{description}</p>
        <ul className="space-y-1.5 mb-6">
          {benefits.map(b => (
            <li key={b} className="flex items-center gap-2 text-xs text-es-muted">
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#E19A47', minWidth: '4px', minHeight: '4px' }} />
              {b}
            </li>
          ))}
        </ul>
        <Link to={to} className="btn-primary text-sm text-center">View Course</Link>
      </div>
    </article>
  );
}

/* ── Team card ────────────────────────────────────────────────────── */
function TeamCard({ name, title, img, initials }: {
  name: string; title: string; img?: string; initials: string;
}) {
  return (
    <div className="es-card flex flex-col items-center text-center p-5">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 flex-shrink-0" style={{ background: '#3C3C3C' }}>
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover object-top" loading="lazy" />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-xl font-black text-es-subtle">
            {initials}
          </span>
        )}
      </div>
      <p className="font-bold text-white text-sm">{name}</p>
      <p className="text-xs mt-0.5" style={{ color: '#A41C64' }}>{title}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative es-grit-heavy es-chalk-dense overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 110% 75% at 40% -10%, rgba(164,28,100,0.28) 0%, transparent 58%), radial-gradient(ellipse 50% 35% at 90% 80%, rgba(164,28,100,0.07) 0%, transparent 55%), #090909',
          position: 'relative',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '64px',
        }}
        aria-label="Hero section"
      >
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
          backgroundImage: 'linear-gradient(rgba(60,60,60,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(60,60,60,0.055) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Diagonal scratches */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
          backgroundImage: 'repeating-linear-gradient(-28deg, transparent, transparent 220px, rgba(255,255,255,0.01) 220px, rgba(255,255,255,0.01) 221px)',
        }} />

        {/* Atlas stone — desktop right side */}
        <div
          className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center justify-end pr-12 xl:pr-20 pointer-events-none"
          aria-hidden="true"
          style={{ width: '42%' }}
        >
          <div className="relative w-72 h-72 xl:w-80 xl:h-80">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(164,28,100,0.3) 0%, transparent 65%)', transform: 'scale(1.35)' }}
            />
            {/* Stone image with float animation */}
            <img
              src="/assets/atlas-stone-branded.png"
              alt="Educate.Strong branded atlas stone"
              className="relative stone-float w-full h-full object-contain select-none"
              style={{ filter: 'drop-shadow(0 8px 48px rgba(164,28,100,0.45)) drop-shadow(0 0 20px rgba(164,28,100,0.2))' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              loading="eager"
            />
          </div>
        </div>

        {/* Mobile stone — subtle watermark */}
        <div className="absolute bottom-20 right-0 w-32 h-32 lg:hidden opacity-20 pointer-events-none" aria-hidden="true">
          <img src="/assets/atlas-stone-branded.png" alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>

        {/* Content — left-anchored on desktop */}
        <div className="es-container relative z-10 w-full py-16 md:py-20 lg:py-24">
          <div className="max-w-lg xl:max-w-xl">
            {/* Academy label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="es-label">The Academy</span>
              <span className="h-px w-10" style={{ background: '#A41C64', opacity: 0.5 }} aria-hidden="true" />
            </div>

            {/* H1 — single clear primary heading */}
            <h1
              className="font-black text-white leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5rem)', letterSpacing: '-0.045em' }}
            >
              Train Coaches.
              <br />
              <span style={{ color: '#A41C64' }}>Build Standards.</span>
              <br />
              Develop the Sport.
            </h1>

            <p className="text-es-muted text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Educate.Strong is the home of accredited Strongman coach education, refereeing
              certification, youth strength development, and performance nutrition.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-2 mb-9" role="list" aria-label="Accreditations">
              {['Active IQ Accredited', 'Endorsed by WHEA.GB', 'Armed Forces Strongman'].map(t => (
                <span key={t} role="listitem" className="badge-grey text-xs">{t}</span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link to="/courses" className="btn-primary">Explore Pathways</Link>
              <Link to="/courses" className="btn-secondary">View Courses</Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" aria-hidden="true"
          style={{ background: 'linear-gradient(transparent, #0D0D0D)' }} />
      </section>

      {/* ── TRUST LOGOS — clean ticker ────────────────────────────────── */}
      <PartnerLogosMarquee />

      {/* ── FOUR PATHWAYS ─────────────────────────────────────────────── */}
      <section className="es-section" style={{ background: '#0D0D0D' }}>
        <div className="es-container">
          <SectionHeader
            label="The Academy"
            heading="Four Pathways. One Purpose."
            sub="Whether you coach, officiate, train young people, or support athletes through nutrition — Educate.Strong has a structured qualification pathway for you."
          />
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <PathwayCard
              badge="Coaching"
              badgeType="accent"
              title="Coaching Pathway"
              who="For personal trainers, gym owners, athletes moving into coaching, and strength coaches building Strongman-specific expertise."
              outcomes={['Coach the six core Strongman events', 'Earn an Active IQ accredited qualification', 'Progress from Level 1 through to Level 3']}
              to="/courses/level-1-coaching-strongman"
              levels="Level 1 → 2 → 3"
              accent
            />
            <PathwayCard
              badge="Refereeing"
              title="Refereeing Pathway"
              who="For competitors and coaches who want to contribute to the sport by officiating competitions to a consistent, credible standard."
              outcomes={['WHEA.GB endorsed certification', 'Practical live drills on event rules', 'Join a network of certified officials']}
              to="/courses/level-1-strongman-refereeing"
              levels="Level 1"
            />
            <PathwayCard
              badge="StrongKidz"
              badgeType="amber"
              title="StrongKidz Pathway"
              who="For coaches, PE teachers, and youth programme leaders who want to deliver safe, structured youth strength sessions."
              outcomes={['Safeguarding-first certification', 'Age-appropriate movement frameworks', 'Session planning and parent communication']}
              to="/strongkidz"
              levels="Coach Education"
            />
            <PathwayCard
              badge="EatStrong"
              badgeType="grey"
              title="EatStrong Pathway"
              who="For coaches who want to understand performance nutrition, support athlete fuelling decisions, and stay within scope of practice."
              outcomes={['Strongman-specific nutrition education', 'Competition and recovery fuelling', 'Evidence-based, coach-appropriate depth']}
              to="/eatstrong"
              levels="Coming Soon"
            />
          </div>
        </div>
      </section>

      {/* ── PROFESSIONAL PATHWAY — visual journey ────────────────────── */}
      <section
        className="es-grit"
        style={{
          background: 'linear-gradient(180deg, #0D0D0D 0%, #111111 40%, #0D0D0D 100%)',
          borderTop: '1px solid rgba(44,44,44,0.7)',
          borderBottom: '1px solid rgba(44,44,44,0.7)',
          position: 'relative',
          padding: '80px 0',
        }}
      >
        {/* Accent line background */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          aria-hidden="true"
          style={{ top: '50%', height: '1px', background: 'linear-gradient(to right, transparent 5%, rgba(164,28,100,0.15) 30%, rgba(164,28,100,0.15) 70%, transparent 95%)' }}
        />

        <div className="es-container">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="es-label mb-3">Professional Pathway</p>
            <h2
              className="font-black text-white mb-4"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', letterSpacing: '-0.03em' }}
            >
              Every Level Unlocks More
            </h2>
            <p className="text-es-muted max-w-xl mx-auto text-sm md:text-base">
              A structured qualification pathway built on practical delivery, coaching standards,
              and real-world Strongman experience.
            </p>
          </div>

          {/* Journey steps */}
          <div className="relative">
            {/* Desktop connector */}
            <div
              className="hidden lg:block absolute left-0 right-0 pointer-events-none"
              aria-hidden="true"
              style={{ top: '32px', height: '2px', background: 'linear-gradient(to right, transparent, #A41C64 15%, #C0246E 50%, #E19A47 80%, transparent)', zIndex: 0 }}
            />

            <ol className="grid lg:grid-cols-4 gap-6 relative z-10" role="list">
              {[
                {
                  num: '01', level: 'Level 1', title: 'Foundation',
                  colour: '#A41C64',
                  unlocks: 'Safe, confident coaching of the six core Strongman events with beginner and intermediate athletes.',
                  outcomes: ['Active IQ accredited', 'Six core event coaching', 'Athlete screening & safety', 'Beginner session structure'],
                  status: 'available', to: '/courses/level-1-coaching-strongman',
                },
                {
                  num: '02', level: 'Level 2', title: 'Applied Practice',
                  colour: '#C0246E',
                  unlocks: 'Intermediate programming, competition preparation, nutrition basics, and deeper athlete support.',
                  outcomes: ['Periodisation', 'Competition preparation', 'Advanced event coaching', 'Performance monitoring'],
                  status: 'coming',
                },
                {
                  num: '03', level: 'Level 3', title: 'Advanced Leadership',
                  colour: '#E19A47',
                  unlocks: 'High-performance athlete development, coaching systems, and academy representation.',
                  outcomes: ['Elite athlete management', 'High-performance programming', 'Coaching system design', 'Academy representation'],
                  status: 'coming',
                },
                {
                  num: 'CPD', level: 'Ongoing', title: 'Professional Development',
                  colour: '#4A4A4A',
                  unlocks: 'Renewal modules, specialist topics, and continuing recognition throughout your coaching career.',
                  outcomes: ['Qualification renewal', 'Specialist modules', 'Industry recognition', 'Career progression'],
                  status: 'future',
                },
              ].map((step) => (
                <li
                  key={step.num}
                  className="flex flex-col"
                  style={{ opacity: step.status === 'future' ? 0.55 : 1 }}
                >
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0 relative"
                      style={{
                        background: step.status === 'available'
                          ? `radial-gradient(circle at 35% 35%, ${step.colour}dd, ${step.colour})`
                          : '#1A1A1A',
                        border: `2px solid ${step.colour}`,
                        boxShadow: step.status === 'available' ? `0 0 24px ${step.colour}55` : 'none',
                      }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: step.colour }}>
                        {step.level}
                      </p>
                      <h3 className="font-black text-white text-base leading-tight">{step.title}</h3>
                    </div>
                  </div>

                  {/* Card body */}
                  <div
                    className="flex-1 rounded-xl p-5"
                    style={{
                      background: '#161616',
                      border: `1px solid ${step.status === 'available' ? step.colour + '55' : '#2A2A2A'}`,
                      borderTop: `3px solid ${step.colour}`,
                    }}
                  >
                    <p className="text-sm text-es-muted leading-relaxed mb-4">{step.unlocks}</p>
                    <ul className="space-y-1.5">
                      {step.outcomes.map(o => (
                        <li key={o} className="flex items-start gap-2 text-xs text-es-subtle">
                          <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ background: step.colour, minWidth: '4px', minHeight: '4px' }} />
                          {o}
                        </li>
                      ))}
                    </ul>
                    {step.status === 'available' && step.to && (
                      <Link to={step.to} className="mt-5 inline-block text-xs font-semibold hover:text-white transition-colors" style={{ color: step.colour }}>
                        Start Level 1 →
                      </Link>
                    )}
                    {step.status === 'coming' && (
                      <span className="mt-4 inline-block badge-grey text-xs">Coming Soon</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="text-center mt-12">
            <Link to="/courses" className="btn-primary">Start at Level 1</Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ──────────────────────────────────────────── */}
      <section className="es-section" style={{ background: '#0D0D0D' }}>
        <div className="es-container">
          <SectionHeader
            label="Available Now"
            heading="Featured Courses"
            sub="The first courses of the Academy are live and accepting enrolments. More qualifications in development."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <CourseCard
              title="Level 1 Fundamentals of Coaching Strongman"
              type="In-Person"
              level="Level 1"
              description="The UK's original Strongman coaching course. Two days of hands-on practical coaching across the six core events. Active IQ accredited."
              benefits={['Active IQ Level 1 Qualification', 'Six core events — technique and coaching', 'Maximum 10 participants per cohort', 'Paul Smith and Dr Chris Fitzgerald']}
              coverImg="/assets/coaching-l1-cover.webp"
              to="/courses/level-1-coaching-strongman"
              highlight
            />
            <CourseCard
              title="Level 1 Strongman Refereeing Certification"
              type="In-Person"
              level="Level 1"
              description="The first formal Strongman refereeing certification in the UK. One practical day covering event rules, judging decisions, and live officiating drills."
              benefits={['WHEA.GB and Armed Forces Strongman endorsed', 'Live practical drills and judging scenarios', 'Event rules across all major events', 'Ethos, responsibilities, and safe officiating']}
              coverImg="/assets/refereeing-l1-content.webp"
              to="/courses/level-1-strongman-refereeing"
            />
          </div>
        </div>
      </section>

      {/* ── VIDEO — phone frame ────────────────────────────────────────── */}
      <section
        className="es-grit"
        style={{ background: '#0A0A0A', borderTop: '1px solid #2C2C2C', borderBottom: '1px solid #2C2C2C', position: 'relative', padding: '80px 0' }}
      >
        <div className="es-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <p className="es-label mb-3">See It In Action</p>
              <h2 className="font-black text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em' }}>
                What Level 1 Coaching Looks Like
              </h2>
              <p className="text-es-muted leading-relaxed mb-6">
                Every cohort is capped at ten participants. Every event is coached on the gym floor.
                Two full days of practical coaching alongside Paul Smith and Dr Chris Fitzgerald.
              </p>
              <ul className="space-y-3 mb-8" role="list">
                {["Log Press, Axle Press & Deadlift", "Farmer's Walk, Yoke & Atlas Stones", "Athlete screening & safety protocols", "Beginner programming & session structure"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-es-muted">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#A41C64', minWidth: '6px', minHeight: '6px' }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/courses/level-1-coaching-strongman" className="btn-primary text-sm">View Level 1 Coaching</Link>
            </div>

            {/* Phone frame */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative" style={{ maxWidth: '260px', width: '100%' }}>
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: '#111',
                    border: '3px solid #2C2C2C',
                    boxShadow: '0 0 60px rgba(164,28,100,0.2), 0 24px 80px rgba(0,0,0,0.9)',
                    aspectRatio: '9/16',
                  }}
                >
                  <video controls preload="metadata" playsInline
                    className="w-full h-full object-contain"
                    style={{ background: '#000' }}
                    poster="/assets/coaching-l1-cover.webp"
                    aria-label="Level 1 Coaching Strongman — course video"
                  >
                    <source src="/assets/coaching-l1-video.mp4" type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
                <div className="absolute inset-0 -z-10 blur-3xl" aria-hidden="true" style={{
                  background: 'radial-gradient(ellipse at center, rgba(164,28,100,0.2) 0%, transparent 70%)',
                  transform: 'scale(1.4)',
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STRONGKIDZ ────────────────────────────────────────────────── */}
      <section className="es-section" style={{ background: '#0D0D0D' }}>
        <div className="es-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="es-label mb-3">Youth Strength Programme</p>
              <h2 className="font-black text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em' }}>
                StrongKidz
              </h2>
              <p className="text-es-muted leading-relaxed mb-4">
                A weekly functional strength programme for children. Physical confidence, mental resilience,
                and social development — built safely, with expert guidance.
              </p>
              <p className="text-es-muted leading-relaxed mb-8">
                Educate.Strong also provides a dedicated StrongKidz Coach Education certification for adults
                who want to deliver the programme safely and professionally.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/strongkidz" className="btn-primary text-sm">Learn About StrongKidz</Link>
                <Link to="/courses/strongkidz-coach-education" className="btn-secondary text-sm">Coach Certification</Link>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ height: '360px', background: '#1A1A1A' }}>
              <img src="/assets/strongkidz.avif" alt="StrongKidz strength programme for children" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ── EATSTRONG ─────────────────────────────────────────────────── */}
      <section className="es-section" style={{ background: '#0A0A0A', borderTop: '1px solid #2C2C2C' }}>
        <div className="es-container">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#22C55E' }}>EatStrong</p>
            <h2 className="font-black text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em' }}>
              Performance Nutrition for Strongman Coaches
            </h2>
            <p className="text-es-muted leading-relaxed mb-8 max-w-md">
              Evidence-based nutrition education built specifically for Strongman. Practical,
              scope-of-practice coaching nutrition guidance for the demands of the sport.
            </p>
            <Link to="/eatstrong" className="btn-secondary text-sm" style={{ borderColor: '#22C55E', color: '#22C55E' }}>
              Explore EatStrong
            </Link>
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────────── */}
      <section
        className="es-section"
        style={{ background: '#111111', borderTop: '1px solid #2C2C2C', borderBottom: '1px solid #2C2C2C' }}
      >
        <div className="es-container">
          <SectionHeader
            label="The Team"
            heading="Taught by People Who Have Done It"
            sub="Every qualification is delivered by coaches and practitioners who have competed, coached, and achieved at the highest level of the sport."
            center
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <TeamCard name="Paul Smith" title="Lead Tutor" img="/assets/paul-smith.avif" initials="PS" />
            <TeamCard name="Dr Chris Fitzgerald" title="Tutor & Programme Lead" img="/assets/chris-fitzgerald.avif" initials="CF" />
            <TeamCard name="Laura Hollywood" title="StrongKidz Coach" img="/assets/laura-hollywood.avif" initials="LH" />
            <TeamCard name="Victoria Wilson" title="StrongKidz Coach" img="/assets/victoria-wilson.avif" initials="VW" />
            <TeamCard name="Kris Herbert" title="Director, Digital & Media" img="/assets/krish-herbert.jpg" initials="KH" />
          </div>
          <div className="text-center mt-8">
            <Link to="/about" className="btn-secondary text-sm">Meet the Full Team</Link>
          </div>
        </div>
      </section>

      {/* ── QUALIFIED REFEREES ───────────────────────────────────────── */}
      <QualifiedReferees />

      {/* ── ACADEMY IN ACTION ────────────────────────────────────────── */}
      <AcademyInAction />

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section
        className="es-chalk-dense"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(164,28,100,0.15) 0%, transparent 70%), #0D0D0D',
          padding: '96px 0',
          position: 'relative',
        }}
      >
        <div className="es-container text-center max-w-xl mx-auto">
          <p className="es-label mb-4">Get Started</p>
          <h2
            className="font-black text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: '1.05' }}
          >
            Ready to Take the Next Step?
          </h2>
          <p className="text-es-muted leading-relaxed mb-10 text-base">
            Course dates are released throughout the year. Register your interest and be the first
            to know when the next cohort is confirmed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/courses" className="btn-primary">Explore Courses</Link>
            <a
              href="mailto:educate.strongltd@gmail.com?subject=Register%20Interest"
              className="btn-secondary"
            >
              Register Interest
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
