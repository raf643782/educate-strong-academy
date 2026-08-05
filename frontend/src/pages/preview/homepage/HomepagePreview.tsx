/**
 * HomepagePreview — private, noindex homepage concept.
 *
 * Route: /homepagepreview. Not linked in any navigation. Not the
 * production homepage (pages/public/Home.tsx is untouched). Built to
 * be reviewed visually as a candidate for the real homepage, based on
 * the completed SEO/keyword/copy strategy work.
 *
 * The hero visual scaffold (video background, atlas stone, gradients,
 * chalk texture) is intentionally recreated here rather than imported,
 * since production's Home.tsx does not export its hero as a separate
 * component — recreating it here means production stays untouched
 * while this preview can use the same visual language with new copy.
 *
 * Sections reused unchanged from production: Navbar, Footer, StatsStrip
 * (same three confirmed figures, no wording changed). Every other
 * section below is a preview-local component living alongside this
 * file, so the whole set can be found, reviewed, or removed as one
 * unit without touching any shared file.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import StatsStrip from '../../../components/sections/StatsStrip';
import { useDocumentHead } from '../../../hooks/useDocumentHead';
import { SITE_URL } from '../../../lib/siteUrl';
import TrustStripPreview from './TrustStripPreview';
import TutorCredibilityPreview from './TutorCredibilityPreview';
import AcademyAreasPreview from './AcademyAreasPreview';
import LearnStrongmanProperly from './LearnStrongmanProperly';
import UpcomingCoursesPreview from './UpcomingCoursesPreview';
import FinalCtaPreview from './FinalCtaPreview';
import RevealOnScroll from './RevealOnScroll';
import UpcomingCohortFeature from './UpcomingCohortFeature';
import FindACoachPreview from './FindACoachPreview';
import { DEMO_COHORT } from './cohortData';

const ORG_SCHEMA_ID = 'homepage-preview-org-schema';

export default function HomepagePreview() {
  // Preview-only control, not part of production behaviour: lets you see
  // both the "confirmed cohort" and "no cohort" states live without
  // editing code. Real production simply passes a cohort or null based
  // on actual confirmed data — see UpcomingCohortFeature.tsx.
  const [showCohortDemo, setShowCohortDemo] = useState(true);

  useDocumentHead({
    title: 'Educate.Strong Academy: Strongman Coaching, Refereeing and Strength Education',
    description:
      'Learn how strength is built through Strongman. Coaching, refereeing, StrongKidz and EatStrong, plus a full Knowledge Hub, Exercise Library and Event Library. Built and taught by people who compete.',
    noindex: true,
  });

  // Demonstrates the recommended Organization schema direction (see the
  // final report). Scoped to this page only: injected on mount, removed
  // on unmount, so it can never attach itself to another route.
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = ORG_SCHEMA_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Educate Strong Academy',
      alternateName: 'Educate.Strong',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/assets/es-logo.png`,
      description:
        'Strongman education platform covering coaching, refereeing, StrongKidz youth sessions and EatStrong performance nutrition, alongside a Knowledge Hub, Exercise Library and Event Library.',
      sameAs: ['https://www.instagram.com/educate.strong/'],
      knowsAbout: ['Strongman', 'Strongman coaching', 'Strongman refereeing', 'Strength training', 'Youth strength training', 'Performance nutrition'],
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(ORG_SCHEMA_ID)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: '#050506',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '64px',
        }}
        aria-label="Hero, Educate Strong Academy"
      >
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
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: 'rgba(5,5,6,0.72)' }} />
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
        <div
          className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 55% 45% at 85% 15%, rgba(255,255,255,0.035) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 8% 92%, rgba(164,28,100,0.12) 0%, transparent 70%)' }}
        />

        {/* Atlas stone, desktop only, same asset as production */}
        <div
          className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center pointer-events-none"
          aria-hidden="true"
          style={{ width: '46%', justifyContent: 'flex-end', paddingRight: 'clamp(48px, 6vw, 100px)' }}
        >
          <div className="relative" style={{ width: 'clamp(280px, 30vw, 420px)', height: 'clamp(280px, 30vw, 420px)' }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(164,28,100,0.30) 0%, transparent 65%)', filter: 'blur(48px)', transform: 'scale(1.5)' }}
            />
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

        <div className="es-container relative z-10 w-full py-20 md:py-28 lg:py-32">
          <div style={{ maxWidth: 'clamp(480px, 48vw, 600px)', paddingLeft: 'clamp(0px, 2vw, 32px)' }}>
            <div className="flex items-center gap-3 mb-7">
              <span className="es-label">The Academy</span>
              <span className="h-px w-12 opacity-60" style={{ background: '#A41C64' }} aria-hidden="true" />
              <span className="text-xs text-white/30 font-medium">Strongman Coaching, Refereeing and Strength Education</span>
            </div>

            <h1
              className="font-black text-white leading-[0.92] mb-7"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.05em' }}
            >
              Learn Strongman.
              <br />
              <span style={{ color: '#A41C64' }}>Build Real Strength.</span>
              <br />
              Pass It On.
            </h1>

            <p className="text-white/50 leading-relaxed mb-9" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', maxWidth: '420px' }}>
              Strongman tests strength like nothing else, and Educate Strong teaches it properly.
              Coaching, officiating, youth development and performance nutrition, each one built and
              taught by people who compete.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#academy-areas-heading"
                className="px-8 py-4 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                  boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 8px 32px rgba(164,28,100,0.5)',
                }}
              >
                Explore the Academy
              </a>
              <Link
                to="/about"
                className="px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-white/8"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)' }}
              >
                Meet the Tutors
              </Link>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'linear-gradient(transparent, #050506)' }}
        />
      </section>

      {/* ══════════════════════ TRUST + STATS ══════════════════════ */}
      <TrustStripPreview />
      <StatsStrip />

      {/* ══════════════════ CONFIRMED UPCOMING COHORT ══════════════════ */}
      {/* Conditional: renders nothing at all when no cohort is passed.  */}
      <UpcomingCohortFeature cohort={showCohortDemo ? DEMO_COHORT : null} />

      {/* ══════════════════════ TUTOR CREDIBILITY ══════════════════════ */}
      <TutorCredibilityPreview />

      {/* ══════════════════════ EXPLORE THE ACADEMY ══════════════════════ */}
      <AcademyAreasPreview />

      {/* ══════════════════════ KNOWLEDGE + LIBRARIES ══════════════════════ */}
      <LearnStrongmanProperly />

      {/* ══════════════════════ FIND A COACH ══════════════════════ */}
      <FindACoachPreview />

      {/* ══════════════════════ UPCOMING COURSES ══════════════════════ */}
      <UpcomingCoursesPreview />

      {/* Testimonials intentionally omitted — see final report */}

      {/* ══════════════════════ FINAL CTA ══════════════════════ */}
      <FinalCtaPreview />

      <Footer />

      {/* Quiet on-page marker so this is unmistakably a private preview when viewed */}
      <RevealOnScroll>
        <div className="text-center py-3" style={{ background: '#08080A' }}>
          <p className="text-[10px] tracking-[0.14em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Private preview. Not the live homepage. Not indexed.
          </p>
        </div>
      </RevealOnScroll>

      {/* Preview-only control widget, not part of production. Lets you see
          both the confirmed-cohort and no-cohort states without editing
          code. Safe to ignore or remove when this preview is promoted. */}
      <div
        className="fixed bottom-3 right-3 z-50 rounded-lg px-3 py-2 text-xs opacity-80 hover:opacity-100 transition-opacity duration-150"
        style={{ background: 'rgba(10,10,12,0.9)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', maxWidth: '170px' }}
      >
        <p className="font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: '#E19A47', fontSize: '9px' }}>
          Preview controls
        </p>
        <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
          <input
            type="checkbox"
            checked={showCohortDemo}
            onChange={(e) => setShowCohortDemo(e.target.checked)}
          />
          Show cohort example
        </label>
      </div>
    </div>
  );
}
