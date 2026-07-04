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
import { useDocumentHead } from '../../hooks/useDocumentHead';

/* ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  useDocumentHead({
    title: 'Educate.Strong Academy — Strongman Coaching & Refereeing Qualifications',
    description: 'Accredited Strongman coaching and refereeing qualifications, youth development, and performance nutrition — built by champions, recognised by the sport.',
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. HERO                                                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: '#050506',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '64px',
        }}
        aria-label="Hero — Educate.Strong Academy"
      >
        {/* Hero video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/assets/coaching-l1-cover.webp"
          aria-hidden="true"
        >
          <source src="/assets/hero-strongman-video.mp4" type="video/mp4" />
        </video>
        {/* Dark scrim for text legibility over video */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'rgba(5,5,6,0.72)' }}
        />

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
          style={{ background: 'linear-gradient(transparent, #050506)' }}
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

      {/* ── 10b. SHOP REFERENCE ────────────────────────────────────── */}
      <section
        style={{
          background: '#050506',
          padding: '80px 0',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="es-container">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Text side */}
            <div style={{ maxWidth: '480px' }}>
              <p className="es-label mb-4">The Store</p>
              <h2
                className="font-black text-white mb-4"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.045em', lineHeight: '1.05' }}
              >
                Training Kit &amp;
                <br />
                <span style={{ color: '#A41C64' }}>Academy Apparel</span>
              </h2>
              <p className="text-white/45 leading-relaxed text-sm" style={{ maxWidth: '360px' }}>
                Monster Dumbbells, coaching apparel, and Strongman equipment built for the culture we teach.
                Products are being finalised — register your interest now.
              </p>
            </div>

            {/* Category cards */}
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              {/* Dumbbells card */}
              <Link
                to="/shop"
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: '#151519',
                  border: '1px solid rgba(255,255,255,0.07)',
                  width: 'clamp(180px, 22vw, 220px)',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ background: '#1B1B20', height: '120px', padding: '16px' }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '140px', height: '72px', opacity: 0.8 }}>
                    <rect x="10" y="44" width="28" height="32" rx="4" fill="rgba(194,24,106,0.25)" stroke="rgba(194,24,106,0.4)" strokeWidth="1.5"/>
                    <rect x="38" y="52" width="18" height="16" rx="2" fill="rgba(194,24,106,0.18)" stroke="rgba(194,24,106,0.3)" strokeWidth="1.5"/>
                    <rect x="56" y="56" width="88" height="8" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
                    <rect x="144" y="52" width="18" height="16" rx="2" fill="rgba(194,24,106,0.18)" stroke="rgba(194,24,106,0.3)" strokeWidth="1.5"/>
                    <rect x="162" y="44" width="28" height="32" rx="4" fill="rgba(194,24,106,0.25)" stroke="rgba(194,24,106,0.4)" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-white mb-0.5">Monster Dumbbells</p>
                  <p className="text-[11px] text-white/35">Strongman Equipment</p>
                </div>
              </Link>

              {/* Apparel card */}
              <Link
                to="/shop"
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: '#151519',
                  border: '1px solid rgba(255,255,255,0.07)',
                  width: 'clamp(180px, 22vw, 220px)',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ background: '#1B1B20', height: '120px', padding: '16px' }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100px', height: '80px', opacity: 0.8 }}>
                    <path
                      d="M60 20 L30 50 L55 65 L55 140 L145 140 L145 65 L170 50 L140 20 Q120 32 100 32 Q80 32 60 20Z"
                      fill="rgba(194,24,106,0.15)"
                      stroke="rgba(194,24,106,0.35)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M60 20 Q80 38 100 38 Q120 38 140 20"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-white mb-0.5">Academy Apparel</p>
                  <p className="text-[11px] text-white/35">Coaches &amp; Athletes</p>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-85"
              style={{ background: 'rgba(164,28,100,0.18)', border: '1px solid rgba(164,28,100,0.35)', color: 'rgba(255,255,255,0.85)' }}
            >
              Browse the Shop
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 11. FINAL CTA ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: [
            'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(164,28,100,0.24) 0%, transparent 58%)',
            'radial-gradient(ellipse 60% 50% at 12% 15%, rgba(194,24,106,0.14) 0%, transparent 52%)',
            'radial-gradient(ellipse 50% 60% at 88% 85%, rgba(164,28,100,0.10) 0%, transparent 52%)',
            '#050506',
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
            <Link
              to="/register-interest?interest=Educate.Strong"
              className="px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:bg-white/6"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
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
