/**
 * EatStrongSection — green-accented headers, text left, media right.
 * Responsive layout with placeholder for image/video assets.
 */
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Nutrition Basics', desc: 'Energy balance and macros for Strongman athletes' },
  { label: 'Competition Nutrition', desc: 'What to eat before, during, and after events' },
  { label: 'Recovery Fuelling', desc: 'Post-training nutrition strategies that work' },
  { label: 'Making Weight', desc: 'Safe weight category management for coaches' },
  { label: 'Supplements', desc: 'Evidence-based guidance within scope of practice' },
];

/* ── Green pill badge ─────────────────────────────────────────────── */
function GreenBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full"
      style={{
        background: 'rgba(34,197,94,0.1)',
        color: '#22C55E',
        border: '1px solid rgba(34,197,94,0.2)',
      }}
    >
      {children}
    </span>
  );
}

export default function EatStrongSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#090909', padding: '96px 0', borderTop: '1px solid rgba(34,197,94,0.08)' }}
      aria-labelledby="eatstrong-heading"
    >
      {/* Subtle green glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(34,197,94,0.07) 0%, transparent 65%)' }}
      />

      <div className="es-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: copy ─────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <GreenBadge>EatStrong</GreenBadge>
              <span className="text-xs text-white/25">Nutrition Education</span>
            </div>

            <h2
              id="eatstrong-heading"
              className="font-black text-white mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.04em', lineHeight: '1.05' }}
            >
              Performance Nutrition
              <br />
              <span style={{ color: '#22C55E' }}>Built for Strongman</span>
            </h2>

            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
              Evidence-based nutrition education built specifically for Strongman coaches and athletes.
              Not generic diet advice — practical, scope-of-practice guidance for the demands of the sport.
            </p>

            {/* Category list */}
            <div className="space-y-2 mb-8">
              {CATEGORIES.map(cat => (
                <div
                  key={cat.label}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/3"
                  style={{ border: '1px solid rgba(34,197,94,0.1)' }}
                >
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: '#22C55E' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-tight">{cat.label}</h3>
                    <p className="text-xs text-white/35 mt-0.5">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scope note */}
            <div
              className="rounded-xl p-4 mb-8"
              style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}
            >
              <p className="text-xs text-white/40 leading-relaxed">
                <span className="text-green-400 font-semibold">Scope-of-practice aware.</span>{' '}
                All EatStrong content includes clear guidance on the boundary between general nutrition
                education and personalised dietary advice, protecting coaches and athletes alike.
              </p>
            </div>

            {/* CTA */}
            <Link
              to="/eatstrong"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.35)',
                color: '#22C55E',
              }}
            >
              Explore EatStrong
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* ── Right: image / video placeholder ─────────────────────────── */}
          <div className="relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ aspectRatio: '4/3', background: '#111' }}
            >
              {/* Image placeholder — replace with real EatStrong media */}
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-4"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, #111 100%)' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                  <svg className="w-10 h-10" style={{ color: '#22C55E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white/30 text-sm font-medium">EatStrong Nutrition Content</p>
                  <p className="text-white/20 text-xs mt-1">Image or video placeholder</p>
                  <p className="text-white/15 text-xs mt-0.5">Provide /assets/eatstrong-hero.jpg or .mp4</p>
                </div>
              </div>
            </div>

            {/* Floating category count */}
            <div
              className="absolute -top-4 -right-4 rounded-xl px-4 py-3 hidden sm:block"
              style={{
                background: 'rgba(10,12,10,0.97)',
                border: '1px solid rgba(34,197,94,0.25)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <p className="text-2xl font-black text-white">5+</p>
              <p className="text-xs text-white/40">Topic areas</p>
            </div>

            {/* Green glow decoration */}
            <div
              className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full pointer-events-none"
              aria-hidden="true"
              style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', filter: 'blur(32px)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
