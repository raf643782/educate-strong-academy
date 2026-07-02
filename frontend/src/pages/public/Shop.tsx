import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

/* ── SVG placeholders ─────────────────────────────────────────────────────── */

function DumbbellSVG() {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      <rect x="10" y="44" width="28" height="32" rx="4" fill="rgba(194,24,106,0.25)" stroke="rgba(194,24,106,0.4)" strokeWidth="1.5"/>
      <rect x="38" y="52" width="18" height="16" rx="2" fill="rgba(194,24,106,0.18)" stroke="rgba(194,24,106,0.3)" strokeWidth="1.5"/>
      <rect x="56" y="56" width="88" height="8" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
      <rect x="144" y="52" width="18" height="16" rx="2" fill="rgba(194,24,106,0.18)" stroke="rgba(194,24,106,0.3)" strokeWidth="1.5"/>
      <rect x="162" y="44" width="28" height="32" rx="4" fill="rgba(194,24,106,0.25)" stroke="rgba(194,24,106,0.4)" strokeWidth="1.5"/>
    </svg>
  );
}

function TshirtSVG() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
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
  );
}

/* ── Product card ─────────────────────────────────────────────────────────── */

interface ProductCardProps {
  name: string;
  note: string;
  SvgComponent: React.FC;
  enquirySubject: string;
}

function ProductCard({ name, note, SvgComponent, enquirySubject }: ProductCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* SVG placeholder area */}
      <div
        className="flex items-center justify-center"
        style={{ background: '#1B1B20', height: '180px', padding: '24px' }}
        aria-hidden="true"
      >
        <div style={{ width: '160px', height: '100%', opacity: 0.85 }}>
          <SvgComponent />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="font-semibold text-white text-base mb-1">{name}</p>
        <p className="text-[12px] font-medium mb-3" style={{ color: '#A41C64' }}>
          {note}
        </p>
        <div className="mt-auto">
          <a
            href={`mailto:educate.strongltd@gmail.com?subject=${encodeURIComponent(enquirySubject)}`}
            className="inline-block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200 hover:opacity-90"
            style={{ background: 'rgba(164,28,100,0.18)', border: '1px solid rgba(164,28,100,0.35)', color: 'rgba(255,255,255,0.85)' }}
          >
            Register Interest
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Monster Dumbbell products (placeholder V1) ───────────────────────────── */
const DUMBBELL_PRODUCTS: Omit<ProductCardProps, 'SvgComponent'>[] = [
  {
    name: 'Monster Dumbbell — 40kg',
    note: 'Coming soon — placeholder',
    enquirySubject: 'Shop Enquiry — Monster Dumbbell 40kg',
  },
  {
    name: 'Monster Dumbbell — 60kg',
    note: 'Coming soon — placeholder',
    enquirySubject: 'Shop Enquiry — Monster Dumbbell 60kg',
  },
  {
    name: 'Monster Dumbbell — 80kg',
    note: 'Coming soon — placeholder',
    enquirySubject: 'Shop Enquiry — Monster Dumbbell 80kg',
  },
];

/* ── Apparel products (placeholder V1) ───────────────────────────────────── */
const APPAREL_PRODUCTS: Omit<ProductCardProps, 'SvgComponent'>[] = [
  {
    name: 'Academy T-Shirt',
    note: 'Coming soon — placeholder',
    enquirySubject: 'Shop Enquiry — Academy T-Shirt',
  },
  {
    name: 'Coaches Hoodie',
    note: 'Coming soon — placeholder',
    enquirySubject: 'Shop Enquiry — Coaches Hoodie',
  },
  {
    name: 'EducateStrong Cap',
    note: 'Coming soon — placeholder',
    enquirySubject: 'Shop Enquiry — EducateStrong Cap',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Shop() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: [
            'radial-gradient(ellipse 110% 70% at 30% -10%, rgba(164,28,100,0.22) 0%, transparent 55%)',
            'radial-gradient(ellipse 60% 50% at 80% 70%, rgba(164,28,100,0.06) 0%, transparent 55%)',
            '#050506',
          ].join(', '),
          paddingTop: '120px',
          paddingBottom: '80px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="es-container relative z-10">
          <p className="es-label mb-5">The Store</p>
          <h1
            className="font-black text-white leading-[0.95] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.048em', maxWidth: '680px' }}
          >
            EducateStrong
            <br />
            <span style={{ color: '#A41C64' }}>Shop</span>
          </h1>
          <p
            className="text-white/45 leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.4vw, 1.1rem)', maxWidth: '480px' }}
          >
            Training kit, academy apparel, and Strongman equipment built for the culture we teach.
          </p>
        </div>
      </section>

      {/* ── MONSTER DUMBBELLS ───────────────────────────────────────────────── */}
      <section
        className="relative"
        style={{
          background: '#050506',
          padding: '80px 0 72px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="es-container">
          {/* Section header */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
            <div>
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3"
                style={{ background: 'rgba(164,28,100,0.15)', border: '1px solid rgba(164,28,100,0.3)', color: '#F02C93' }}
              >
                Strongman Equipment
              </span>
              <h2
                className="font-black text-white"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', letterSpacing: '-0.04em', lineHeight: '1.05' }}
              >
                Monster Dumbbells
              </h2>
              <p className="text-white/40 mt-2 text-sm leading-relaxed" style={{ maxWidth: '380px' }}>
                Heavy, simple, brutal Strongman tools for pressing power.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DUMBBELL_PRODUCTS.map(p => (
              <ProductCard key={p.name} {...p} SvgComponent={DumbbellSVG} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ACADEMY APPAREL ────────────────────────────────────────────────── */}
      <section
        className="relative"
        style={{
          background: '#050506',
          padding: '80px 0 72px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="es-container">
          {/* Section header */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
            <div>
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3"
                style={{ background: 'rgba(164,28,100,0.15)', border: '1px solid rgba(164,28,100,0.3)', color: '#F02C93' }}
              >
                Apparel
              </span>
              <h2
                className="font-black text-white"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', letterSpacing: '-0.04em', lineHeight: '1.05' }}
              >
                Academy Apparel
              </h2>
              <p className="text-white/40 mt-2 text-sm leading-relaxed" style={{ maxWidth: '420px' }}>
                EducateStrong clothing for coaches, athletes, and the Strongman community.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {APPAREL_PRODUCTS.map(p => (
              <ProductCard key={p.name} {...p} SvgComponent={TshirtSVG} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: [
            'radial-gradient(ellipse 100% 70% at 50% 50%, rgba(164,28,100,0.18) 0%, transparent 60%)',
            '#050506',
          ].join(', '),
          padding: '96px 0',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: 'repeating-linear-gradient(32deg, transparent, transparent 140px, rgba(255,255,255,0.004) 140px, rgba(255,255,255,0.004) 141px)',
          }}
        />
        <div className="es-container relative z-10 text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p className="es-label mb-4">Get in Touch</p>
          <h2
            className="font-black text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.045em', lineHeight: '1.05' }}
          >
            Interested in a Product?
          </h2>
          <p className="text-white/45 leading-relaxed mb-10 text-base" style={{ maxWidth: '440px', margin: '0 auto 40px' }}>
            Products and pricing are being finalised. Register your interest and we'll be in touch when stock is confirmed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:educate.strongltd@gmail.com?subject=Shop%20Enquiry"
              className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 8px 32px rgba(164,28,100,0.45)',
              }}
            >
              Register Interest
            </a>
            <Link
              to="/courses"
              className="px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:bg-white/6"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
