/**
 * Footer — partner logos, newsletter subscription, Instagram embed, copyright.
 * Full responsive layout. Placeholders marked clearly.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Partner logo data ─────────────────────────────────────────────── */
interface Partner {
  name: string;
  src?: string;
  fallback: string;
  label: string;
}

const PARTNERS: Partner[] = [
  { name: 'Active IQ', src: '/assets/partner-activeiq.png', fallback: 'Active IQ', label: 'Level 1 Accredited' },
  { name: 'WHEA.GB', src: '/assets/partner-waygb.jpg', fallback: 'WHEA.GB', label: 'Refereeing Endorsed' },
  { name: 'British Army', src: '/assets/partner-british-army.webp', fallback: 'British Army', label: 'Partner' },
  { name: 'Mind Body Connect', src: '/assets/partner-mindbodyconnect.avif', fallback: 'MBC', label: 'Charity No. 1173834' },
];

/* ── Nav columns ──────────────────────────────────────────────────── */
const NAV_COLS = [
  {
    heading: 'Learn',
    links: [
      { to: '/courses', label: 'All Courses' },
      { to: '/courses/level-1-coaching-strongman', label: 'Level 1 Coaching' },
      { to: '/courses/level-1-strongman-refereeing', label: 'Level 1 Refereeing' },
      { to: '/strongkidz', label: 'StrongKidz' },
      { to: '/eatstrong', label: 'EatStrong' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { to: '/knowledge', label: 'Knowledge Hub' },
      { to: '/exercises', label: 'Exercise Library' },
      { to: '/events', label: 'Event Library' },
      { to: '/about', label: 'About' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { to: '/register', label: 'Get Started' },
      { to: '/login', label: 'Sign In' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/certificates', label: 'Certificates' },
      { to: '/cpd', label: 'CPD Log' },
    ],
  },
];

/* ── Newsletter form ──────────────────────────────────────────────── */
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    try {
      /*
       * PLACEHOLDER: Connect to your email service here.
       * Options: Mailchimp API, ConvertKit, or POST to /api/newsletter
       * Example: await api.post('/newsletter/subscribe', { email })
       */
      await new Promise(r => setTimeout(r, 1000)); // Simulated delay
      setStatus('sent');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <h3 className="font-bold text-white text-sm mb-1">Stay Updated</h3>
      <p className="text-white/35 text-xs mb-4 leading-relaxed">
        New course dates, coaching insights, and academy news — directly to your inbox.
      </p>

      {status === 'sent' ? (
        <div
          className="rounded-xl px-4 py-3 text-sm text-center"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}
        >
          You're subscribed — welcome to the academy.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.875rem',
            }}
            aria-label="Email address for newsletter"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all duration-200 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 4px 12px rgba(164,28,100,0.4)' }}
          >
            {status === 'sending' ? '...' : 'Join'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}

/* ── Main footer ──────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer
      style={{ background: '#060608', borderTop: '1px solid rgba(164,28,100,0.12)' }}
      role="contentinfo"
    >
      {/* ── Partner logos bar ─────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '32px 0' }}>
        <div className="es-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25 text-center mb-6">
            Accreditations &amp; Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {PARTNERS.map(p => (
              <div key={p.name} className="flex items-center gap-2.5 opacity-55 hover:opacity-85 transition-opacity duration-200">
                {p.src ? (
                  <img
                    src={p.src}
                    alt={p.name}
                    className="h-8 w-auto object-contain max-w-[80px]"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-xs font-bold text-white/60">{p.fallback}</span>
                )}
                <div>
                  <p className="text-xs font-semibold text-white leading-none">{p.name}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{p.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer columns ──────────────────────────────────────── */}
      <div className="es-container" style={{ padding: '56px 0' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="inline-block mb-4" aria-label="Educate.Strong">
              <img
                src="/assets/logo_owl.svg"
                alt="Educate.Strong"
                className="h-10 w-auto"
                style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(91%) saturate(2500%) hue-rotate(310deg) brightness(85%) contrast(105%)' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/es-logo.png'; (e.target as HTMLImageElement).style.filter = 'none'; }}
              />
            </Link>

            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Professional Strongman education. Accredited qualifications for coaches, referees,
              youth session leaders, and performance support practitioners.
            </p>

            <p className="text-white/20 text-xs italic mb-8">
              Discipline. Integrity. Resilience.
            </p>

            {/* Newsletter */}
            <NewsletterForm />

            {/* Instagram placeholder */}
            <div className="mt-6">
              <a
                href="https://www.instagram.com/educate.strong/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                @educate.strong
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(col => (
            <div key={col.heading}>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30 mb-4">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/40 hover:text-white/75 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 0' }}>
        <div className="es-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} Educate.Strong Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/15 hidden sm:block">
              Powered by{' '}
              <span className="font-semibold text-white/25">VIRES</span>
            </span>
            <a
              href="mailto:educate.strongltd@gmail.com"
              className="text-[11px] text-white/20 hover:text-white/45 transition-colors"
            >
              educate.strongltd@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
