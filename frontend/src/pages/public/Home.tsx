/**
 * Home — public landing page.
 *
 * Section order:
 *  1. Navbar
 *  2. Hero
 *  3. PartnerLogosMarquee
 *  4. WhyEducateStrong
 *  5. AllPathwaysOverview  (Coaching · Refereeing · StrongKidz · EatStrong)
 *  6. UpcomingCohortsSection  (full section — cohort dates + location finder)
 *  7. CertifiedCoachesSection
 *  8. TutorCredibilityStrip
 *  9. TestimonialsSection
 * 10. KnowledgeHubPreview
 * 11. Final CTA
 * 12. Footer
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PartnerLogosMarquee from '../../components/sections/PartnerLogosMarquee';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import WhyEducateStrong from '../../components/sections/WhyEducateStrong';
import AllPathwaysOverview from '../../components/sections/AllPathwaysOverview';
import CertifiedCoachesSection from '../../components/sections/CertifiedCoachesSection';
import TutorCredibilityStrip from '../../components/sections/TutorCredibilityStrip';
import KnowledgeHubPreview from '../../components/sections/KnowledgeHubPreview';
import UpcomingCohortsSection from '../../components/sections/UpcomingCohortsSection';

/* ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#090909' }}>
      <Navbar />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. HERO                                                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: '#090909',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '64px',
        }}
        aria-label="Hero — Educate.Strong Academy"
      >
        {/* Premium dark gradient — layered radials */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: [
              'radial-gradient(ellipse 120% 80% at 30% -10%, rgba(164,28,100,0.28) 0%, transparent 52%)',
              'radial-gradient(ellipse 60% 60% at 80% 60%, rgba(164,28,100,0.06) 0%, transparent 55%)',
              'radial-gradient(ellipse 40% 30% at 50% 100%, rgba(164,28,100,0.08) 0%, transparent 60%)',
            ].join(', '),
          }}
        />

        {/* Subtle diagonal scratches — faint chalk feel */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: [
              'repeating-linear-gradient(-22deg, transparent, transparent 280px, rgba(255,255,255,0.006) 280px, rgba(255,255,255,0.006) 281px)',
              'repeating-linear-gradient(68deg, transparent, transparent 320px, rgba(255,255,255,0.004) 320px, rgba(255,255,255,0.004) 321px)',
            ].join(', '),
          }}
        />

        {/* Chalk dust — top right */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 55% 45% at 85% 15%, rgba(255,255,255,0.035) 0%, transparent 65%)',
          }}
        />

        {/* Chalk dust — lower left */}
        <div
          className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 8% 92%, rgba(164,28,100,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Atlas stone — desktop right */}
        <div
          className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center pointer-events-none"
          aria-hidden="true"
          style={{ width: '46%', justifyContent: 'flex-end', paddingRight: 'clamp(48px, 6vw, 100px)' }}
        >
          <div
            className="relative"
            style={{ width: 'clamp(280px, 30vw, 420px)', height: 'clamp(280px, 30vw, 420px)' }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(164,28,100,0.30) 0%, transparent 65%)',
                filter: 'blur(48px)',
                transform: 'scale(1.5)',
              }}
            />
            {/* Stone */}
            <img
              src="/assets/atlas-stone-branded.png"
              alt=""
              className="relative w-full h-full object-contain select-none motion-safe:animate-[stoneFloat_7s_ease-in-out_infinite]"
              style={{ filter: 'drop-shadow(0 16px 64px rgba(164,28,100,0.55)) drop-shadow(0 0 32px rgba(164,28,100,0.28))' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              loading="eager"
            />
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────── */}
        <div className="es-container relative z-10 w-full py-20 md:py-28 lg:py-32">
          <div style={{ maxWidth: 'clamp(480px, 48vw, 600px)', paddingLeft: 'clamp(0px, 2vw, 32px)' }}>

            {/* Academy label */}
            <div className="flex items-center gap-3 mb-7">
              <span className="es-label">The Academy</span>
              <span className="h-px w-12 opacity-60" style={{ background: '#A41C64' }} aria-hidden="true" />
              <span className="text-xs text-white/30 font-medium">UK's #1 Strongman Coach Education</span>
            </div>

            {/* H1 */}
            <h1
              className="font-black text-white leading-[0.92] mb-7"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.05em' }}
            >
              Train Coaches.
              <br />
              <span style={{ color: '#A41C64' }}>Build Standards.</span>
              <br />
              Develop the Sport.
            </h1>

            <p
              className="text-white/50 leading-relaxed mb-9"
              style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', maxWidth: '420px' }}
            >
              The UK's only accredited Strongman coaching qualification. From foundation
              coaching to advanced leadership — built by champions, recognised by the sport.
            </p>

            {/* Accreditation pills */}
            <div className="flex flex-wrap gap-2 mb-10" role="list" aria-label="Accreditations and endorsements">
              {['Active IQ Accredited', 'WHEA.GB Endorsed', 'Armed Forces Strongman'].map(t => (
                <span
                  key={t}
                  role="listitem"
                  className="text-[11px] font-medium text-white/45 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="px-8 py-4 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                  boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 8px 32px rgba(164,28,100,0.5)',
                }}
              >
                Explore Pathways
              </Link>
              <Link
                to="/coaches"
                className="px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-white/8"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)' }}
              >
                Find a Coach
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'linear-gradient(transparent, #090909)' }}
        />
      </section>

      {/* ── 2. PARTNER TICKER ──────────────────────────────────────── */}
      <PartnerLogosMarquee />

      {/* ── 3. WHY EDUCATE.STRONG ──────────────────────────────────── */}
      <WhyEducateStrong />

      {/* ── 4. ALL PATHWAYS OVERVIEW ───────────────────────────────── */}
      {/* Coaching · Refereeing · StrongKidz · EatStrong — no green */}
      <AllPathwaysOverview />

      {/* ── 5. UPCOMING COURSES & COHORTS ──────────────────────────── */}
      <UpcomingCohortsSection />

      {/* ── 6. CERTIFIED COACHES PREVIEW ───────────────────────────── */}
      <CertifiedCoachesSection />

      {/* ── 8. TUTOR CREDIBILITY STRIP ─────────────────────────────── */}
      <TutorCredibilityStrip />

      {/* ── 9. TESTIMONIALS ────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── 10. KNOWLEDGE HUB PREVIEW ──────────────────────────────── */}
      <KnowledgeHubPreview />


      {/* ── 11. FINAL CTA ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: [
            'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(164,28,100,0.14) 0%, transparent 70%)',
            '#090909',
          ].join(', '),
          padding: '112px 0',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: 'repeating-linear-gradient(32deg, transparent, transparent 140px, rgba(255,255,255,0.005) 140px, rgba(255,255,255,0.005) 141px)',
          }}
        />
        <div className="es-container relative z-10 text-center" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p className="es-label mb-4">Get Started</p>
          <h2
            className="font-black text-white mb-5"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)', letterSpacing: '-0.045em', lineHeight: '1.02' }}
          >
            Ready to Take the
            <br />
            <span style={{ color: '#A41C64' }}>Next Step?</span>
          </h2>
          <p className="text-white/45 leading-relaxed mb-10 text-base">
            Course dates are released throughout the year. Register your interest and be
            the first to know when the next cohort is confirmed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 8px 32px rgba(164,28,100,0.45)',
              }}
            >
              Explore Courses
            </Link>
            <a
              href="mailto:educate.strongltd@gmail.com?subject=Register%20Interest"
              className="px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:bg-white/6"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
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
