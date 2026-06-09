/**
 * Navbar — pill-shaped nav items, glass-blur on scroll, icon-only brand.
 * Responsive: desktop dropdowns, mobile slide-panel.
 */
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── Nav data ──────────────────────────────────────────────────────── */
const COURSES = [
  {
    heading: 'Coaching',
    items: [
      { to: '/courses/level-1-coaching-strongman', label: 'Level 1 — Fundamentals', desc: 'Active IQ accredited', available: true },
      { to: '/courses/level-2-coaching-strongman', label: 'Level 2 — Applied Coaching', desc: 'Coming soon', available: false },
      { to: '/courses/level-3-coaching-strongman', label: 'Level 3 — Advanced Practice', desc: 'Coming soon', available: false },
    ],
  },
  {
    heading: 'Officiating',
    items: [
      { to: '/courses/level-1-strongman-refereeing', label: 'Level 1 Refereeing', desc: 'WHEA.GB endorsed', available: true },
    ],
  },
  {
    heading: 'Programmes',
    items: [
      { to: '/strongkidz', label: 'StrongKidz', desc: 'Youth strength education', available: true },
      { to: '/eatstrong', label: 'EatStrong', desc: 'Performance nutrition', available: true },
    ],
  },
];

const RESOURCES = [
  { to: '/knowledge', label: 'Knowledge Hub', desc: 'Coaching articles & guides' },
  { to: '/exercises', label: 'Exercise Library', desc: 'Technique & programming' },
  { to: '/events', label: 'Event Library', desc: 'Competition events' },
];

const MY_LEARNING = [
  { to: '/dashboard', label: 'My Dashboard', desc: 'Overview and enrolled courses' },
  { to: '/dashboard/pathway', label: 'Skill Tree', desc: 'Visual pathway progress map' },
  { to: '/certificates', label: 'My Certificates', desc: 'Download earned certificates' },
  { to: '/cpd', label: 'CPD Log', desc: 'Track professional development' },
  { to: '/coursework', label: 'Coursework', desc: 'Assignments and submissions' },
];

/* ── Dropdown wrapper ──────────────────────────────────────────────── */
function NavDropdown({
  label, open, onOpen, onClose, children,
}: {
  label: string; open: boolean; onOpen: () => void; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className={`
          flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
          transition-all duration-200 select-none
          ${open
            ? 'bg-white/10 text-white ring-1 ring-white/20'
            : 'text-white/70 hover:text-white hover:bg-white/8'
          }
        `}
      >
        {label}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-2 rounded-xl z-50 overflow-hidden"
          style={{
            background: 'rgba(12,12,14,0.97)',
            border: '1px solid rgba(255,255,255,0.08)',
            minWidth: '260px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.85), 0 4px 16px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <div className="p-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────── */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  /* Close everything on route change */
  useEffect(() => { setMenuOpen(false); setOpenDrop(null); }, [location.pathname]);

  /* Scroll state */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const close = () => { setMenuOpen(false); setOpenDrop(null); };

  /* Dynamic nav background */
  const navStyle: React.CSSProperties = {
    background: scrolled
      ? 'rgba(6,6,8,0.94)'
      : 'rgba(6,6,8,0.75)',
    backdropFilter: scrolled ? 'blur(28px) saturate(180%)' : 'blur(16px)',
    WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(180%)' : 'blur(16px)',
    borderBottom: scrolled
      ? '1px solid rgba(164,28,100,0.18)'
      : '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(164,28,100,0.08)' : 'none',
  };

  const navH = scrolled ? 'h-[56px]' : 'h-[64px]';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={navStyle}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="es-container">
        <div className={`flex items-center justify-between ${navH} transition-all duration-300`}>

          {/* ── Brand: icon only (pink owl, no text) ─────────────────── */}
          <Link
            to="/"
            aria-label="Educate.Strong — Home"
            className="flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A41C64] rounded-full"
          >
            <div className="relative">
              {/* Glow ring on hover */}
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                style={{ background: 'rgba(164,28,100,0.35)', transform: 'scale(1.4)' }}
                aria-hidden="true"
              />
              <img
                src="/assets/logo_owl.svg"
                alt="Educate.Strong"
                className={`relative w-auto transition-all duration-300 ${scrolled ? 'h-7' : 'h-8'}`}
                style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(91%) saturate(2500%) hue-rotate(310deg) brightness(85%) contrast(105%)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/es-logo.png';
                  (e.target as HTMLImageElement).style.filter = 'none';
                }}
              />
            </div>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Courses */}
            <NavDropdown
              label="Courses"
              open={openDrop === 'courses'}
              onOpen={() => setOpenDrop('courses')}
              onClose={() => setOpenDrop(null)}
            >
              {COURSES.map((group, gi) => (
                <div key={group.heading}>
                  {gi > 0 && <div className="mx-3 my-1" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />}
                  <p className="px-3 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A41C64' }}>
                    {group.heading}
                  </p>
                  {group.items.map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={close}
                      role="menuitem"
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150
                        ${item.available
                          ? 'hover:bg-white/6 cursor-pointer'
                          : 'opacity-35 pointer-events-none'}
                      `}
                    >
                      <span>
                        <span className="block text-sm font-medium text-white leading-tight">{item.label}</span>
                        <span className="block text-xs text-white/45 leading-tight mt-0.5">{item.desc}</span>
                      </span>
                      {!item.available && (
                        <span className="text-[10px] text-white/30 bg-white/6 px-1.5 py-0.5 rounded-full font-medium">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ))}
            </NavDropdown>

            {/* Resources */}
            <NavDropdown
              label="Resources"
              open={openDrop === 'resources'}
              onOpen={() => setOpenDrop('resources')}
              onClose={() => setOpenDrop(null)}
            >
              {RESOURCES.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  role="menuitem"
                  className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/6 transition-all duration-150"
                >
                  <span className="text-sm font-medium text-white leading-tight">{item.label}</span>
                  <span className="text-xs text-white/45 mt-0.5">{item.desc}</span>
                </Link>
              ))}
            </NavDropdown>

            {/* Certified Coaches */}
            <NavLink
              to="/coaches"
              className={({ isActive }) => `
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-white/10 text-white ring-1 ring-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/8'}
              `}
            >
              Coaches
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-white/10 text-white ring-1 ring-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/8'}
              `}
            >
              About
            </NavLink>
          </div>

          {/* ── Auth actions ───────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* My Learning dropdown */}
                <NavDropdown
                  label="My Learning"
                  open={openDrop === 'learning'}
                  onOpen={() => setOpenDrop('learning')}
                  onClose={() => setOpenDrop(null)}
                >
                  {MY_LEARNING.map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={close}
                      role="menuitem"
                      className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/6 transition-all duration-150"
                    >
                      <span className="text-sm font-medium text-white leading-tight">{item.label}</span>
                      <span className="text-xs text-white/45 mt-0.5">{item.desc}</span>
                    </Link>
                  ))}
                </NavDropdown>

                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="px-4 py-2 rounded-full text-sm text-white/65 hover:text-white hover:bg-white/8 transition-all duration-200">
                    Admin
                  </Link>
                )}
                {(user?.role === 'ASSESSOR' || user?.role === 'ADMIN') && (
                  <Link to="/assessor" className="px-4 py-2 rounded-full text-sm text-white/65 hover:text-white hover:bg-white/8 transition-all duration-200">
                    Assessor
                  </Link>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white/65 hover:text-white border border-white/15 hover:border-white/30 transition-all duration-200"
                >
                  Sign Out
                </button>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black cursor-default"
                  style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)' }}
                  aria-label={`${user?.firstName} ${user?.lastName}`}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm text-white/65 hover:text-white hover:bg-white/8 transition-all duration-200"
                >
                  Sign In
                </Link>
                {/* Pill CTA */}
                <Link
                  to="/courses"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-100"
                  style={{
                    background: 'linear-gradient(135deg, #A41C64 0%, #C0246E 100%)',
                    boxShadow: '0 0 0 1px rgba(164,28,100,0.5), 0 4px 16px rgba(164,28,100,0.35)',
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ────────────────────────────────────────── */}
          <button
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/8 transition-all duration-200"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="lg:hidden border-t"
          style={{
            background: 'rgba(6,6,8,0.98)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            borderColor: 'rgba(255,255,255,0.07)',
          }}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="es-container py-5 pb-8 space-y-1">
            {COURSES.map((group, gi) => (
              <div key={group.heading} className={gi > 0 ? 'mt-3' : ''}>
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A41C64' }}>
                  {group.heading}
                </p>
                {group.items.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      item.available ? 'text-white/70 hover:text-white hover:bg-white/6 active:bg-white/10' : 'text-white/25 pointer-events-none'
                    }`}
                  >
                    {item.label}
                    {!item.available && <span className="ml-2 text-[10px] opacity-50">(Soon)</span>}
                  </Link>
                ))}
              </div>
            ))}

            <div className="my-3" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A41C64' }}>Resources</p>
            {RESOURCES.map(r => (
              <Link key={r.to} to={r.to} onClick={close} className="block px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors">
                {r.label}
              </Link>
            ))}
            <Link to="/coaches" onClick={close} className="block px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors">
              Certified Coaches
            </Link>
            <Link to="/about" onClick={close} className="block px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors">
              About
            </Link>

            <div className="my-3" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

            {isAuthenticated ? (
              <div className="space-y-1">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A41C64' }}>My Learning</p>
                {MY_LEARNING.map(item => (
                  <Link key={item.to} to={item.to} onClick={close} className="block px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors">
                    {item.label}
                  </Link>
                ))}
                {user?.role === 'ADMIN' && <Link to="/admin" onClick={close} className="block px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors">Admin</Link>}
                <button onClick={() => { logout(); navigate('/'); close(); }} className="block w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-white/6 transition-colors">Sign Out</button>
              </div>
            ) : (
              <div className="pt-1 space-y-2">
                <Link to="/login" onClick={close} className="block px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/6 transition-colors">Sign In</Link>
                <Link
                  to="/courses"
                  onClick={close}
                  className="block py-3 rounded-xl text-sm font-semibold text-white text-center"
                  style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 4px 16px rgba(164,28,100,0.4)' }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
