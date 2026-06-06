/**
 * Home — main public landing page.
 * Modular section composition. All media uses placeholders
 * where real assets haven't been provided yet.
 *
 * Section order:
 *  1. Navbar (global layout)
 *  2. Hero
 *  3. PartnerLogosMarquee
 *  4. PathwayCards (overview)
 *  5. ProfessionalPathway (detailed journey)
 *  6. FeaturedCourses
 *  7. VideoSection
 *  8. StrongKidzSection
 *  9. EatStrongSection
 * 10. TeamSection
 * 11. TestimonialsSection
 * 12. QualifiedReferees
 * 13. AcademyInAction (Instagram)
 * 14. Final CTA
 * 15. Footer (global layout)
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PartnerLogosMarquee from '../../components/sections/PartnerLogosMarquee';
import ProfessionalPathway from '../../components/sections/ProfessionalPathway';
import StrongKidzSection from '../../components/sections/StrongKidzSection';
import EatStrongSection from '../../components/sections/EatStrongSection';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import QualifiedReferees from '../../components/sections/QualifiedReferees';
import AcademyInAction from '../../components/sections/AcademyInAction';

/* ── Shared section heading ────────────────────────────────────────── */
function SectionHeader({ label, heading, sub, center = false }: {
  label?: string; heading: string; sub?: string; center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {label && <p className="es-label mb-3">{label}</p>}
      <h2 className="font-black text-white mb-4"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.035em', lineHeight: '1.1' }}>
        {heading}
      </h2>
      {sub && (
        <p className="text-white/50 text-base leading-relaxed max-w-2xl"
          style={center ? { margin: '0 auto' } : {}}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── Pathway overview card ─────────────────────────────────────────── */
function PathwayCard({ badge, badgeColour, title, who, outcomes, to, levels, primaryBorder = false }: {
  badge: string; badgeColour: string; title: string; who: string;
  outcomes: string[]; to: string; levels?: string; primaryBorder?: boolean;
}) {
  return (
    <article
      className="group flex flex-col h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: `3px solid ${primaryBorder ? '#A41C64' : 'rgba(255,255,255,0.12)'}`,
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
          style={{ background: badgeColour + '18', color: badgeColour, border: `1px solid ${badgeColour}30` }}
        >
          {badge}
        </span>
        {levels && <span className="text-[10px] text-white/25">{levels}</span>}
      </div>
      <h3 className="text-base font-bold text-white mb-2 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-white/40 text-sm mb-5 leading-relaxed flex-1">{who}</p>
      <ul className="space-y-1.5 mb-6">
        {outcomes.map(o => (
          <li key={o} className="flex items-start gap-2 text-xs text-white/35">
            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: badgeColour, minWidth: '4px', minHeight: '4px' }} aria-hidden="true" />
            {o}
          </li>
        ))}
      </ul>
      <Link
        to={to}
        className="flex items-center justify-between text-sm font-medium transition-all duration-200"
        style={{ color: badgeColour }}
      >
        Explore Pathway
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  );
}

/* ── Course card ───────────────────────────────────────────────────── */
function CourseCard({ title, type, level, description, benefits, coverImg, to, highlight = false }: {
  title: string; type: string; level: string; description: string;
  benefits: string[]; coverImg?: string; to: string; highlight?: boolean;
}) {
  return (
    <article
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Cover */}
      <div className="relative overflow-hidden" style={{ height: '200px', background: '#1A1A1A' }}>
        {coverImg ? (
          <img src={coverImg} alt={`${title} — course cover`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A1A1A, #111)' }}>
            <p className="text-white/15 text-sm">Course cover image — placeholder</p>
          </div>
        )}
        {highlight && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
              style={{ background: 'rgba(164,28,100,0.9)', border: '1px solid rgba(164,28,100,0.4)' }}>
              Active IQ
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex gap-2 mb-3">
          <span className="text-[10px] font-semibold text-white/35 bg-white/5 px-2.5 py-1 rounded-full">{type}</span>
          <span className="text-[10px] font-semibold text-white/35 bg-white/5 px-2.5 py-1 rounded-full">{level}</span>
        </div>
        <h3 className="text-sm font-bold text-white mb-2 leading-snug">{title}</h3>
        <p className="text-white/40 text-sm leading-relaxed mb-5 flex-1">{description}</p>
        <ul className="space-y-1.5 mb-6">
          {benefits.map(b => (
            <li key={b} className="flex items-center gap-2 text-xs text-white/35">
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#E19A47', minWidth: '4px', minHeight: '4px' }} aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
        <Link
          to={to}
          className="block py-3 rounded-xl text-sm font-semibold text-white text-center transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 4px 16px rgba(164,28,100,0.35)' }}
        >
          View Course
        </Link>
      </div>
    </article>
  );
}

/* ── Team card ─────────────────────────────────────────────────────── */
function TeamCard({ name, title, img, initials }: { name: string; title: string; img?: string; initials: string }) {
  return (
    <div className="group flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-200 hover:bg-white/3"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 ring-transparent group-hover:ring-[#A41C64]/40 transition-all duration-300"
        style={{ background: '#2A2A2A' }}>
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover object-top" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl font-black" style={{ color: '#3C3C3C' }}>{initials}</div>
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
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0A0D' }}>
      <Navbar />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. HERO                                                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 35% -5%, rgba(164,28,100,0.25) 0%, transparent 55%), #090909',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '64px',
        }}
        aria-label="Hero section"
      >
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        {/* Diagonal scratches */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
          backgroundImage: 'repeating-linear-gradient(-25deg, transparent, transparent 240px, rgba(255,255,255,0.008) 240px, rgba(255,255,255,0.008) 241px)',
        }} />
        {/* Chalk dust splatter — top right */}
        <div className="absolute top-16 right-0 w-96 h-96 pointer-events-none opacity-40" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 65%)' }} />
        {/* Chalk splatter — bottom left */}
        <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none opacity-30" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 10% 90%, rgba(164,28,100,0.15) 0%, transparent 70%)' }} />

        {/* Atlas stone — right side desktop */}
        <div
          className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center justify-end pr-10 xl:pr-20 pointer-events-none"
          aria-hidden="true"
          style={{ width: '44%' }}
        >
          <div className="relative" style={{ width: 'clamp(260px, 28vw, 380px)', height: 'clamp(260px, 28vw, 380px)' }}>
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(164,28,100,0.32) 0%, transparent 65%)', transform: 'scale(1.3)' }} />
            {/* Stone image with float animation */}
            <img
              src="/assets/atlas-stone-branded.png"
              alt=""
              className="relative stone-float w-full h-full object-contain select-none"
              style={{ filter: 'drop-shadow(0 12px 56px rgba(164,28,100,0.5)) drop-shadow(0 0 28px rgba(164,28,100,0.25))' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              loading="eager"
            />
          </div>
        </div>

        {/* Content */}
        <div className="es-container relative z-10 w-full py-20 md:py-24 lg:py-28">
          <div style={{ maxWidth: 'min(540px, 50vw + 200px)' }}>
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="es-label">The Academy</span>
              <span className="h-px w-10 opacity-50" style={{ background: '#A41C64' }} aria-hidden="true" />
            </div>

            {/* H1 */}
            <h1
              className="font-black text-white leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', letterSpacing: '-0.045em' }}
            >
              Train Coaches.
              <br />
              <span style={{ color: '#A41C64' }}>Build Standards.</span>
              <br />
              Develop the Sport.
            </h1>

            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-sm">
              The UK's home of accredited Strongman coach education, refereeing
              certification, youth strength development, and performance nutrition.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 mb-9" role="list" aria-label="Accreditations">
              {['Active IQ Accredited', 'WHEA.GB Endorsed', 'Armed Forces Strongman'].map(t => (
                <span key={t} role="listitem"
                  className="text-[11px] font-medium text-white/45 px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {t}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                  boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 8px 28px rgba(164,28,100,0.45)',
                }}
              >
                Explore Pathways
              </Link>
              <Link
                to="/courses"
                className="px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-white/8"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" aria-hidden="true"
          style={{ background: 'linear-gradient(transparent, #0A0A0D)' }} />
      </section>

      {/* ── 2. PARTNER TICKER ──────────────────────────────────────── */}
      <PartnerLogosMarquee />

      {/* ── 3. FOUR PATHWAYS ───────────────────────────────────────── */}
      <section style={{ background: '#0D0D0D', padding: '96px 0' }}>
        <div className="es-container">
          <SectionHeader
            label="The Academy"
            heading="Four Pathways. One Purpose."
            sub="Whether you coach, officiate, train young people, or support athletes through nutrition — Educate.Strong has a structured qualification pathway for you."
          />
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <PathwayCard badge="Coaching" badgeColour="#A41C64" primaryBorder
              title="Coaching Pathway"
              who="For personal trainers, gym owners, athletes moving into coaching, and strength coaches building Strongman-specific expertise."
              outcomes={['Coach the six core Strongman events', 'Active IQ accredited qualification', 'Progress Level 1 through to Level 3']}
              to="/courses/level-1-coaching-strongman" levels="Level 1 → 2 → 3"
            />
            <PathwayCard badge="Refereeing" badgeColour="#C0246E"
              title="Refereeing Pathway"
              who="For competitors and coaches who want to contribute to the sport by officiating competitions to a consistent, credible standard."
              outcomes={['WHEA.GB endorsed certification', 'Practical live officiating drills', 'Join a network of certified officials']}
              to="/courses/level-1-strongman-refereeing" levels="Level 1"
            />
            <PathwayCard badge="StrongKidz" badgeColour="#E19A47"
              title="StrongKidz Pathway"
              who="For coaches, PE teachers, and youth programme leaders who want to deliver safe, structured youth strength sessions."
              outcomes={['Safeguarding-first certification', 'Age-appropriate movement frameworks', 'Session planning and parent communication']}
              to="/strongkidz" levels="Coach Education"
            />
            <PathwayCard badge="EatStrong" badgeColour="#22C55E"
              title="EatStrong Pathway"
              who="For coaches who want to understand performance nutrition, support athlete fuelling decisions, and stay within scope of practice."
              outcomes={['Strongman-specific nutrition education', 'Competition and recovery fuelling', 'Evidence-based, coach-appropriate depth']}
              to="/eatstrong" levels="Coming Soon"
            />
          </div>
        </div>
      </section>

      {/* ── 4. PROFESSIONAL PATHWAY (detailed journey) ─────────────── */}
      <ProfessionalPathway />

      {/* ── 5. FEATURED COURSES ────────────────────────────────────── */}
      <section style={{ background: '#0D0D0D', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="es-container">
          <SectionHeader
            label="Available Now"
            heading="Featured Courses"
            sub="The Academy's first qualifications are live and accepting enrolments."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <CourseCard
              title="Level 1 Fundamentals of Coaching Strongman"
              type="In-Person" level="Level 1"
              description="The UK's original Strongman coaching course. Two days of hands-on practical coaching across the six core events. Active IQ accredited."
              benefits={['Active IQ Level 1 Qualification', 'Six core events — technique and coaching', 'Max 10 participants per cohort', 'Paul Smith and Dr Chris Fitzgerald']}
              coverImg="/assets/coaching-l1-cover.webp"
              to="/courses/level-1-coaching-strongman"
              highlight
            />
            <CourseCard
              title="Level 1 Strongman Refereeing Certification"
              type="In-Person" level="Level 1"
              description="The first formal Strongman refereeing certification in the UK. One practical day covering event rules, judging decisions, and live officiating drills."
              benefits={['WHEA.GB and Armed Forces Strongman endorsed', 'Live practical drills', 'Event rules across major events', 'Ethos, responsibilities, safe officiating']}
              coverImg="/assets/refereeing-l1-content.webp"
              to="/courses/level-1-strongman-refereeing"
            />
          </div>
        </div>
      </section>

      {/* ── 6. VIDEO ───────────────────────────────────────────────── */}
      <section style={{ background: '#080808', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="es-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <p className="es-label mb-3">See It In Action</p>
              <h2 className="font-black text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em' }}>
                What Level 1 Coaching Looks Like
              </h2>
              <p className="text-white/45 leading-relaxed mb-6">
                Every cohort is capped at ten participants. Every event is coached on the gym floor.
                Two full days alongside Paul Smith and Dr Chris Fitzgerald.
              </p>
              <ul className="space-y-3 mb-8">
                {["Log Press, Axle Press & Deadlift", "Farmer's Walk, Yoke & Atlas Stones", "Athlete screening & safety", "Beginner programming & session structure"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/45">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#A41C64', minWidth: '6px', minHeight: '6px' }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/courses/level-1-coaching-strongman"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 4px 20px rgba(164,28,100,0.4)' }}>
                View Level 1 Coaching
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {/* Phone-frame video */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative" style={{ maxWidth: '260px', width: '100%' }}>
                <div className="rounded-3xl overflow-hidden" style={{
                  background: '#111', border: '3px solid #222',
                  boxShadow: '0 0 60px rgba(164,28,100,0.25), 0 24px 80px rgba(0,0,0,0.8)',
                  aspectRatio: '9/16',
                }}>
                  <video controls preload="metadata" playsInline
                    className="w-full h-full object-contain" style={{ background: '#000' }}
                    poster="/assets/coaching-l1-cover.webp"
                    aria-label="Level 1 Coaching Strongman — course video">
                    <source src="/assets/coaching-l1-video.mp4" type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
                <div className="absolute inset-0 -z-10 blur-3xl" aria-hidden="true"
                  style={{ background: 'radial-gradient(circle, rgba(164,28,100,0.22) 0%, transparent 70%)', transform: 'scale(1.4)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. STRONGKIDZ ──────────────────────────────────────────── */}
      <StrongKidzSection />

      {/* ── 8. EATSTRONG ───────────────────────────────────────────── */}
      <EatStrongSection />

      {/* ── 9. TEAM ────────────────────────────────────────────────── */}
      <section style={{ background: '#0D0D0D', padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="es-container">
          <SectionHeader label="The Team" heading="Taught by People Who Have Done It"
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
            <Link to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:bg-white/6"
              style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Meet the Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. TESTIMONIALS ───────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── 11. QUALIFIED REFEREES ─────────────────────────────────── */}
      <QualifiedReferees />

      {/* ── 12. ACADEMY IN ACTION (Instagram embed) ────────────────── */}
      <AcademyInAction />

      {/* ── 13. FINAL CTA ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(164,28,100,0.14) 0%, transparent 70%), #090909', padding: '112px 0' }}
      >
        <div className="es-container text-center max-w-xl mx-auto">
          <p className="es-label mb-4">Get Started</p>
          <h2
            className="font-black text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', letterSpacing: '-0.04em', lineHeight: '1.05' }}
          >
            Ready to Take the Next Step?
          </h2>
          <p className="text-white/45 leading-relaxed mb-10 text-base">
            Course dates are released throughout the year. Register your interest and be the
            first to know when the next cohort is confirmed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/courses"
              className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 8px 32px rgba(164,28,100,0.45)' }}>
              Explore Courses
            </Link>
            <a href="mailto:educate.strongltd@gmail.com?subject=Register%20Interest"
              className="px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:bg-white/6"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
              Register Interest
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
