import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

/* ── Shared section heading ───────────────────────────────────────── */
function SectionHeader({
  label,
  heading,
  sub,
  center = false,
}: {
  label?: string;
  heading: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 md:mb-14 ${center ? 'text-center' : ''}`}>
      {label && <p className="es-label mb-3">{label}</p>}
      <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
        {heading}
      </h2>
      {sub && <p className="text-es-muted text-base md:text-lg leading-relaxed max-w-2xl" style={center ? { margin: '0 auto' } : {}}>
        {sub}
      </p>}
    </div>
  );
}

/* ── Arrow icon ───────────────────────────────────────────────────── */
const Arrow = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

/* ── Pathway card ─────────────────────────────────────────────────── */
function PathwayCard({
  badge,
  badgeType = 'accent',
  title,
  who,
  outcomes,
  to,
  levels,
  accent = false,
}: {
  badge: string;
  badgeType?: 'accent' | 'amber' | 'grey';
  title: string;
  who: string;
  outcomes: string[];
  to: string;
  levels?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="es-card-hover flex flex-col p-6 h-full"
      style={{ borderTop: accent ? '2px solid #A41C64' : '2px solid #3C3C3C' }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className={`badge-${badgeType}`}>{badge}</span>
        {levels && <span className="text-xs text-es-subtle">{levels}</span>}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-es-muted text-sm mb-5 leading-relaxed flex-1">{who}</p>
      <ul className="space-y-2 mb-6">
        {outcomes.map(o => (
          <li key={o} className="flex items-start gap-2 text-sm text-es-muted">
            <span className="text-es-accent mt-0.5 flex-shrink-0">—</span>
            {o}
          </li>
        ))}
      </ul>
      <Link to={to} className="btn-secondary text-sm flex items-center justify-between group">
        Explore Pathway
        <Arrow />
      </Link>
    </div>
  );
}

/* ── Course card ──────────────────────────────────────────────────── */
function CourseCard({
  title,
  type,
  level,
  description,
  benefits,
  coverImg,
  to,
  highlight = false,
}: {
  title: string;
  type: string;
  level: string;
  description: string;
  benefits: string[];
  coverImg?: string;
  to: string;
  highlight?: boolean;
}) {
  return (
    <div className="es-card-hover flex flex-col overflow-hidden">
      {/* Cover */}
      <div className="relative h-52 bg-es-grey flex items-center justify-center overflow-hidden">
        {coverImg ? (
          <img src={coverImg} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-es-subtle">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge-grey">{type}</span>
          <span className="badge-grey">{level}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 leading-snug">{title}</h3>
        <p className="text-es-muted text-sm leading-relaxed mb-5 flex-1">{description}</p>
        <ul className="space-y-1.5 mb-6">
          {benefits.map(b => (
            <li key={b} className="flex items-center gap-2 text-xs text-es-muted">
              <span className="w-1 h-1 rounded-full bg-es-amber flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <Link to={to} className="btn-primary text-sm text-center">
          View Course
        </Link>
      </div>
    </div>
  );
}

/* ── Progression step ─────────────────────────────────────────────── */
function ProgressionStep({
  num,
  title,
  desc,
  active,
}: {
  num: string;
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div className={`flex gap-5 p-5 rounded-lg border transition-all ${
      active
        ? 'border-es-accent bg-es-accent/5'
        : 'border-es-grey-dark bg-es-card'
    }`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
        active ? 'bg-es-accent text-white' : 'bg-es-grey text-es-muted'
      }`}>
        {num}
      </div>
      <div>
        <p className={`font-bold text-sm mb-1 ${active ? 'text-white' : 'text-es-muted'}`}>{title}</p>
        <p className="text-xs text-es-subtle leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ── Team card ────────────────────────────────────────────────────── */
function TeamCard({
  name,
  title,
  img,
  initials,
}: {
  name: string;
  title: string;
  img?: string;
  initials: string;
}) {
  return (
    <div className="es-card flex flex-col items-center text-center p-6">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-es-grey flex items-center justify-center flex-shrink-0">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <span className="text-2xl font-black text-es-subtle">{initials}</span>
        )}
      </div>
      <p className="font-bold text-white text-sm">{name}</p>
      <p className="text-xs text-es-accent mt-1">{title}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  HOME                                                               */
/* ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative es-grit-heavy pt-navbar flex items-center min-h-screen overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 100% 70% at 50% -15%, rgba(164,28,100,0.32) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(164,28,100,0.08) 0%, transparent 60%), #090909',
          position: 'relative',
        }}
      >
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(60,60,60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(60,60,60,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }} />
        {/* Diagonal scratch marks */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(-30deg, transparent, transparent 200px, rgba(255,255,255,0.012) 200px, rgba(255,255,255,0.012) 201px)',
        }} />
        {/* Right-side visual: Strongman gym placeholder */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none hidden lg:block" style={{
          background: 'linear-gradient(to right, transparent, rgba(164,28,100,0.04))',
        }}>
          <div className="absolute inset-8 rounded-2xl flex flex-col items-center justify-center gap-4"
            style={{ background: 'rgba(20,20,20,0.4)', border: '1px solid rgba(60,60,60,0.4)', backdropFilter: 'blur(2px)' }}>
            <p className="text-xs text-es-subtle text-center px-4 leading-snug">Strongman gym hero image</p>
            <p className="text-xs text-es-subtle text-center px-4">Atlas stones · Yokes · Chalk · Implements</p>
            <p className="text-xs" style={{ color: 'rgba(164,28,100,0.4)' }}>Educate.Strong to provide</p>
          </div>
        </div>

        <div className="es-container relative z-10 py-24 md:py-32">
          <div className="max-w-4xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="es-label">The Academy</span>
              <span className="h-px w-12 bg-es-accent opacity-60" />
            </div>

            {/* Headline */}
            <h1
              className="font-black text-white leading-none mb-6"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', letterSpacing: '-0.04em' }}
            >
              Train Coaches.
              <br />
              <span style={{ color: '#A41C64' }}>Build Standards.</span>
              <br />
              Develop the Sport.
            </h1>

            {/* Sub */}
            <p className="text-es-muted text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Educate.Strong is the home of accredited Strongman coach education, refereeing
              certification, youth strength development, and performance nutrition.
            </p>

            {/* Accreditation pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {['Active IQ Accredited', 'Endorsed by WHEA.GB', 'Armed Forces Strongman'].map(t => (
                <span key={t} className="badge-grey text-xs">{t}</span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary text-sm">
                Explore Pathways
              </Link>
              <Link to="/courses" className="btn-secondary text-sm">
                View Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(transparent, #0D0D0D)' }} />
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
      <section style={{ background: '#141414', borderTop: '1px solid #2C2C2C', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-xs text-es-subtle uppercase tracking-widest">Trusted by</p>
            <div className="flex flex-wrap items-center gap-8">
              {/* British Army logo */}
              <div className="flex items-center gap-2.5">
                <img src="/assets/british-army-logo.webp" alt="British Army" className="h-8 w-auto opacity-70" />
                <span className="text-xs text-es-muted">Armed Forces Partner</span>
              </div>
              {/* Active IQ */}
              <div className="flex items-center gap-2">
                <span className="badge-accent">Active IQ</span>
                <span className="text-xs text-es-muted">Accredited</span>
              </div>
              {/* WHEA.GB */}
              <div>
                <span className="text-xs text-es-muted">WHEA.GB Endorsed</span>
              </div>
              {/* Mind Body Connect */}
              <div>
                <span className="text-xs text-es-muted">Mind Body Connect — Charity No. 1173834</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              outcomes={[
                'Coach the six core Strongman events',
                'Earn an Active IQ accredited qualification',
                'Progress from Level 1 through to Level 3',
              ]}
              to="/courses/level-1-coaching-strongman"
              levels="Level 1 → 2 → 3"
              accent
            />
            <PathwayCard
              badge="Refereeing"
              title="Refereeing Pathway"
              who="For competitors and coaches who want to contribute to the sport by officiating competitions to a consistent, credible standard."
              outcomes={[
                'WHEA.GB endorsed certification',
                'Practical live drills on event rules',
                'Join a network of certified officials',
              ]}
              to="/courses/level-1-strongman-refereeing"
              levels="Level 1"
            />
            <PathwayCard
              badge="StrongKidz"
              badgeType="amber"
              title="StrongKidz Pathway"
              who="For coaches, PE teachers, and youth programme leaders who want to deliver safe, structured youth strength sessions."
              outcomes={[
                'Safeguarding-first certification',
                'Age-appropriate movement frameworks',
                'Session planning and parent communication',
              ]}
              to="/strongkidz"
              levels="Coach Education"
            />
            <PathwayCard
              badge="EatStrong"
              badgeType="grey"
              title="EatStrong Pathway"
              who="For coaches who want to understand performance nutrition, support athlete fuelling decisions, and stay within scope of practice."
              outcomes={[
                'Strongman-specific nutrition education',
                'Competition and recovery fuelling',
                'Evidence-based, coach-appropriate depth',
              ]}
              to="/eatstrong"
              levels="Coming Soon"
            />
          </div>
        </div>
      </section>

      {/* ── PROGRESSION PATHWAY ─────────────────────────────────────── */}
      <section className="es-section es-grit" style={{ background: '#111111', borderTop: '1px solid #2C2C2C', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container">
          <div className="text-center mb-12">
            <p className="es-label mb-3">Professional Pathway</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
              Every Level Unlocks More
            </h2>
            <p className="text-es-muted max-w-2xl mx-auto">
              A structured qualification pathway built on practical delivery, coaching standards,
              and real-world Strongman experience. Progress at your pace.
            </p>
          </div>

          <div className="relative">
            {/* Connection line — desktop only */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #A41C64, #E19A47, #A41C64, transparent)', top: '40px', zIndex: 0 }} />

            <div className="grid lg:grid-cols-4 gap-5 relative z-10">
              {[
                {
                  num: '01',
                  level: 'Level 1',
                  title: 'Foundation',
                  colour: '#A41C64',
                  unlocks: 'Safe, confident delivery of the six core Strongman events with beginner and intermediate athletes.',
                  outcomes: ['Active IQ accredited qualification', 'Six core event coaching', 'Athlete screening & safety', 'Beginner session structure'],
                  status: 'available',
                },
                {
                  num: '02',
                  level: 'Level 2',
                  title: 'Applied Practice',
                  colour: '#C0246E',
                  unlocks: 'Intermediate programming, competition preparation, nutrition basics, and deeper athlete support.',
                  outcomes: ['Periodisation and programming', 'Competition preparation', 'Advanced event coaching', 'Performance monitoring'],
                  status: 'coming',
                },
                {
                  num: '03',
                  level: 'Level 3',
                  title: 'Advanced Leadership',
                  colour: '#E19A47',
                  unlocks: 'High-performance athlete development, coaching systems, and potential course delivery representation.',
                  outcomes: ['Elite athlete management', 'High-performance programming', 'Coaching system design', 'Academy representation'],
                  status: 'coming',
                },
                {
                  num: 'CPD',
                  level: 'Ongoing',
                  title: 'Professional Development',
                  colour: '#3C3C3C',
                  unlocks: 'Renewal modules, specialist topics, and continuing recognition throughout your coaching career.',
                  outcomes: ['Qualification renewal', 'Specialist modules', 'Industry recognition', 'Career progression'],
                  status: 'future',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="rounded-lg p-5 flex flex-col"
                  style={{
                    background: '#1A1A1A',
                    border: `1px solid ${step.status === 'available' ? step.colour : '#2C2C2C'}`,
                    borderTop: `3px solid ${step.colour}`,
                    opacity: step.status === 'future' ? 0.6 : 1,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ background: step.status === 'available' ? step.colour : '#2C2C2C' }}>
                      {step.num}
                    </div>
                    {step.status !== 'available' && (
                      <span className="badge-grey text-xs">{step.status === 'coming' ? 'Coming Soon' : 'Future'}</span>
                    )}
                    {step.status === 'available' && (
                      <span className="badge-accent text-xs">Available</span>
                    )}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: step.colour }}>{step.level}</p>
                  <h3 className="font-black text-white text-lg mb-3">{step.title}</h3>
                  <p className="text-sm text-es-muted leading-relaxed mb-4 flex-1">{step.unlocks}</p>
                  <ul className="space-y-1.5">
                    {step.outcomes.map(o => (
                      <li key={o} className="flex items-start gap-2 text-xs text-es-subtle">
                        <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: step.colour }} />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/courses" className="btn-primary text-sm">Start at Level 1</Link>
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
              benefits={[
                'Active IQ Level 1 Qualification',
                'Six core events — technique and coaching',
                'Maximum 10 participants per cohort',
                'Delivery by Paul Smith and Dr Chris Fitzgerald',
              ]}
              coverImg="/assets/coaching-l1-cover.webp"
              to="/courses/level-1-coaching-strongman"
              highlight
            />
            <CourseCard
              title="Level 1 Strongman Refereeing Certification"
              type="In-Person"
              level="Level 1"
              description="The first formal Strongman refereeing certification in the UK. One practical day covering event rules, judging decisions, and live officiating drills."
              benefits={[
                'WHEA.GB and Armed Forces Strongman endorsed',
                'Live practical drills and judging scenarios',
                'Event rules across all major events',
                'Ethos, responsibilities, and safe officiating',
              ]}
              coverImg="/assets/refereeing-l1-content.webp"
              to="/courses/level-1-strongman-refereeing"
            />
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION — vertical phone frame ────────────────────── */}
      <section className="es-section es-grit" style={{ background: '#0A0A0A', borderTop: '1px solid #2C2C2C', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Copy side */}
            <div className="order-2 lg:order-1">
              <p className="es-label mb-3">See It In Action</p>
              <h2 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
                What Level 1 Coaching Looks Like
              </h2>
              <p className="text-es-muted leading-relaxed mb-6">
                Every cohort is capped at ten participants. Every event is coached on the gym floor.
                Two full days of practical coaching alongside Paul Smith and Dr Chris Fitzgerald.
              </p>
              <ul className="space-y-3 mb-8">
                {["Log Press, Axle Press & Deadlift", "Farmer's Walk, Yoke & Atlas Stones", "Athlete screening & safety protocols", "Beginner programming & session structure"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-es-muted">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#A41C64' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/courses/level-1-coaching-strongman" className="btn-primary text-sm">View Level 1 Coaching</Link>
            </div>

            {/* Vertical phone-style video frame */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative" style={{ maxWidth: '280px', width: '100%' }}>
                {/* Phone frame decoration */}
                <div className="rounded-3xl overflow-hidden" style={{
                  background: '#1A1A1A',
                  border: '3px solid #3C3C3C',
                  boxShadow: '0 0 60px rgba(164,28,100,0.2), 0 20px 80px rgba(0,0,0,0.8)',
                  aspectRatio: '9/16',
                }}>
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-contain"
                    style={{ background: '#000' }}
                    poster="/assets/coaching-l1-cover.webp"
                  >
                    <source src="/assets/coaching-l1-video.mp4" type="video/mp4" />
                  </video>
                </div>
                {/* Decorative glow behind phone */}
                <div className="absolute inset-0 -z-10 blur-3xl rounded-full" style={{
                  background: 'radial-gradient(ellipse at center, rgba(164,28,100,0.25) 0%, transparent 70%)',
                  transform: 'scale(1.3)',
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
              <h2 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
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
                <Link to="/courses/strongkidz-coach-education" className="btn-secondary text-sm">
                  Coach Certification
                </Link>
              </div>
            </div>
            {/* Image */}
            <div className="rounded-lg overflow-hidden h-80 lg:h-96">
              <img
                src="/assets/strongkidz.avif"
                alt="StrongKidz programme"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── EATSTRONG ─────────────────────────────────────────────────── */}
      <section
        className="es-section"
        style={{ background: '#0A0A0A', borderTop: '1px solid #2C2C2C' }}
      >
        <div className="es-container">
          <div className="max-w-2xl">
            <p className="es-label mb-3">EatStrong</p>
            <h2 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
              Performance Nutrition for Strongman Coaches
            </h2>
            <p className="text-es-muted leading-relaxed mb-8 max-w-xl">
              Evidence-based nutrition education built specifically for Strongman. Not generic
              diet advice — practical, scope-of-practice coaching nutrition guidance for the demands of the sport.
            </p>
            <Link to="/eatstrong" className="btn-secondary text-sm">
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
            <TeamCard
              name="Paul Smith"
              title="Lead Tutor"
              img="/assets/paul-smith.avif"
              initials="PS"
            />
            <TeamCard
              name="Dr Chris Fitzgerald"
              title="Tutor & Programme Lead"
              img="/assets/chris-fitzgerald.avif"
              initials="CF"
            />
            <TeamCard
              name="Laura Hollywood"
              title="StrongKidz Coach"
              img="/assets/laura-hollywood.avif"
              initials="LH"
            />
            <TeamCard
              name="Victoria Wilson"
              title="StrongKidz Coach"
              img="/assets/victoria-wilson.avif"
              initials="VW"
            />
            <TeamCard
              name="Kris Herbert"
              title="Director, Digital & Media"
              img="/assets/krish-herbert.jpg"
              initials="KH"
            />
          </div>
          <div className="text-center mt-8">
            <Link to="/about" className="btn-secondary text-sm">Meet the Full Team</Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section
        className="es-section"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(164,28,100,0.18) 0%, transparent 70%), #0D0D0D',
        }}
      >
        <div className="es-container text-center max-w-2xl mx-auto">
          <p className="es-label mb-4">Get Started</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.04em' }}>
            Ready to Take the Next Step?
          </h2>
          <p className="text-es-muted leading-relaxed mb-10">
            Course dates are released throughout the year. Register your interest and be the first to know
            when the next cohort is confirmed.
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
