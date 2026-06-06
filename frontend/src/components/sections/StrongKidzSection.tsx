/**
 * StrongKidzSection — text left, image/video right.
 * Responsive layout. Placeholder for real media.
 */
import { Link } from 'react-router-dom';

const BENEFITS = [
  { icon: '💪', label: 'Physical Development', desc: 'Functional strength and coordination through age-appropriate loading.' },
  { icon: '🧠', label: 'Mental Resilience', desc: 'Confidence built through challenge, effort, and visible progress.' },
  { icon: '🤝', label: 'Social Connection', desc: 'Community values, encouragement, and team spirit from day one.' },
];

export default function StrongKidzSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#0D0D0D', padding: '96px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      aria-labelledby="strongkidz-heading"
    >
      {/* Subtle amber glow — bottom right */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle, rgba(225,154,71,0.08) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }}
      />

      <div className="es-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: copy ─────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-xs font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
                style={{ background: 'rgba(225,154,71,0.12)', color: '#E19A47', border: '1px solid rgba(225,154,71,0.2)' }}
              >
                Youth Programme
              </span>
            </div>

            <h2
              id="strongkidz-heading"
              className="font-black text-white mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.04em', lineHeight: '1.05' }}
            >
              StrongKidz
            </h2>

            <p className="text-white/55 text-base leading-relaxed mb-6 max-w-md">
              A weekly functional strength programme for children. Physical confidence, mental resilience,
              and social development — built safely, with expert coaching at every session.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {BENEFITS.map(b => (
                <div key={b.label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.2)' }}
                  >
                    <span role="img" aria-hidden="true">{b.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-0.5">{b.label}</h3>
                    <p className="text-white/45 text-sm leading-snug">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety note */}
            <div
              className="flex items-start gap-3 rounded-xl p-4 mb-8"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E19A47' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-white/45 text-xs leading-relaxed">
                All StrongKidz coaches hold current DBS clearances and safeguarding qualifications.
                Sessions are based in Sheffield with limited spaces available.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/strongkidz"
                className="px-6 py-3 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #E19A47, #F0B060)',
                  boxShadow: '0 4px 20px rgba(225,154,71,0.35)',
                  color: '#0D0D0D',
                }}
              >
                Learn About StrongKidz
              </Link>
              <Link
                to="/courses/strongkidz-coach-education"
                className="px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(225,154,71,0.4)',
                  color: '#E19A47',
                }}
              >
                Coach Certification
              </Link>
            </div>
          </div>

          {/* ── Right: image / video placeholder ─────────────────────────── */}
          <div className="relative">
            {/* Main image */}
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{ aspectRatio: '4/3', background: '#1A1A1A' }}
            >
              <img
                src="/assets/strongkidz.avif"
                alt="Young athletes in a StrongKidz training session"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('hidden');
                }}
              />
              {/* Fallback placeholder */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #1A1A1A, #111)' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.2)' }}
                >
                  <svg className="w-8 h-8" style={{ color: '#E19A47' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-white/30 text-sm">StrongKidz session photograph</p>
                <p className="text-white/20 text-xs">Provide /assets/strongkidz.avif</p>
              </div>

              {/* Amber overlay gradient at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(225,154,71,0.12), transparent)' }}
                aria-hidden="true"
              />
            </div>

            {/* Floating stat card */}
            <div
              className="absolute -bottom-4 -left-4 rounded-xl px-5 py-4 hidden sm:block"
              style={{
                background: 'rgba(10,10,12,0.95)',
                border: '1px solid rgba(225,154,71,0.25)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <p className="text-2xl font-black text-white">Sheffield</p>
              <p className="text-xs text-white/40 mt-0.5">Weekly sessions · Limited spaces</p>
            </div>

            {/* Decorative amber glow */}
            <div
              className="absolute -top-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
              aria-hidden="true"
              style={{ background: 'radial-gradient(circle, rgba(225,154,71,0.12) 0%, transparent 70%)', filter: 'blur(24px)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
