/**
 * FinalCtaPreview — preview-only rewrite of the closing call to action.
 *
 * Replaces "Ready to Take the Next Step", which presumes the visitor
 * has already decided to take a next step, with copy that also
 * includes visitors who are still exploring.
 */
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';

export default function FinalCtaPreview() {
  return (
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
      <div className="es-container relative z-10 text-center" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <RevealOnScroll>
          <p className="es-label mb-4">Get Started</p>
          <h2
            className="font-black text-white mb-5"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)', letterSpacing: '-0.045em', lineHeight: '1.02' }}
          >
            Start Wherever
            <br />
            <span style={{ color: '#A41C64' }}>You Are.</span>
          </h2>
          <p className="text-white/45 leading-relaxed mb-10 text-base">
            Whether you are trying to understand Strongman for the first time, coaching your first
            session, or building toward a full qualification, Educate Strong is built to meet you
            there. Explore the Academy, or register your interest and we will be in touch.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#academy-areas-heading"
              className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 8px 32px rgba(164,28,100,0.45)',
              }}
            >
              Explore the Academy
            </a>
            <Link
              to="/register-interest?type=general"
              className="px-8 py-4 rounded-full font-semibold transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', background: 'transparent' }}
            >
              Register Interest
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
