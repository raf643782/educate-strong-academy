import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const COURSES = [
  {
    heading: 'Coaching',
    items: [
      { to: '/courses/level-1-coaching-strongman', label: 'Level 1 — Fundamentals', desc: 'Active IQ accredited · In-person', available: true },
      { to: '/courses/level-2-coaching-strongman', label: 'Level 2 — Applied Coaching', desc: 'Coming soon', available: false },
      { to: '/courses/level-3-coaching-strongman', label: 'Level 3 — Advanced Practice', desc: 'Coming soon', available: false },
    ],
  },
  {
    heading: 'Officiating',
    items: [
      { to: '/courses/level-1-strongman-refereeing', label: 'Level 1 Refereeing', desc: 'WHEA.GB endorsed · In-person', available: true },
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
  { to: '/exercises', label: 'Exercise Library', desc: 'Technique, cues & programming' },
  { to: '/events', label: 'Event Library', desc: 'Competition event reference' },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => { setMenuOpen(false); setActiveDropdown(null); };

  const navBg = scrolled
    ? 'rgba(8,8,8,0.97)'
    : 'rgba(11,11,11,0.88)';

  const navStyle: React.CSSProperties = {
    background: navBg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: scrolled
      ? '1px solid rgba(60,60,60,0.9)'
      : '1px solid rgba(44,44,44,0.5)',
    transition: 'all 0.25s ease',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={navStyle} role="navigation" aria-label="Main navigation">
      <div className="es-container">
        <div className={`flex items-center justify-between transition-all duration-200 ${scrolled ? 'h-14' : 'h-16'}`}>

          {/* ── Brand lockup ───────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group" aria-label="Educate.Strong — Home">
            <img
              src="/assets/logo_owl.svg"
              alt=""
              aria-hidden="true"
              className={`w-auto object-contain transition-all duration-200 ${scrolled ? 'h-7' : 'h-8'}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/es-logo.png';
              }}
            />
            {/* Wordmark — full brand pink, not split colour */}
            <span
              className={`font-black tracking-tight leading-none hidden sm:block transition-all duration-200 ${scrolled ? 'text-sm' : 'text-[0.9375rem]'}`}
              style={{ color: '#A41C64', letterSpacing: '-0.02em' }}
            >
              Educate.strong
            </span>
          </Link>

          {/* ── Desktop navigation ─────────────────────────────────── */}
          <div className="hidden lg:flex items-center">

            {/* Courses dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('courses')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded text-sm font-medium transition-colors ${activeDropdown === 'courses' ? 'text-white' : 'text-es-muted hover:text-white'}`}
                aria-expanded={activeDropdown === 'courses'}
                aria-haspopup="true"
              >
                Courses
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'courses' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'courses' && (
                <div
                  className="absolute top-full left-0 mt-1.5 rounded-lg z-50 overflow-hidden"
                  style={{
                    background: '#141414',
                    border: '1px solid #2A2A2A',
                    minWidth: '260px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.5)',
                  }}
                  role="menu"
                >
                  <div className="p-2">
                    {COURSES.map((group, gi) => (
                      <div key={group.heading}>
                        {gi > 0 && <div className="my-1.5 mx-3 es-divider" />}
                        <p className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#A41C64' }}>
                          {group.heading}
                        </p>
                        {group.items.map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={close}
                            role="menuitem"
                            className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                              item.available
                                ? 'hover:bg-es-card cursor-pointer'
                                : 'opacity-40 cursor-default pointer-events-none'
                            }`}
                          >
                            <div>
                              <span className="text-sm font-medium text-white block leading-tight">{item.label}</span>
                              <span className="text-xs text-es-muted leading-tight">{item.desc}</span>
                            </div>
                            {!item.available && (
                              <span className="text-xs text-es-subtle bg-es-card px-1.5 py-0.5 rounded flex-shrink-0">Soon</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resources dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded text-sm font-medium transition-colors ${activeDropdown === 'resources' ? 'text-white' : 'text-es-muted hover:text-white'}`}
                aria-expanded={activeDropdown === 'resources'}
                aria-haspopup="true"
              >
                Resources
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'resources' && (
                <div
                  className="absolute top-full left-0 mt-1.5 rounded-lg z-50 overflow-hidden"
                  style={{
                    background: '#141414',
                    border: '1px solid #2A2A2A',
                    minWidth: '220px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
                  }}
                  role="menu"
                >
                  <div className="p-2">
                    {RESOURCES.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={close}
                        role="menuitem"
                        className="flex flex-col px-3 py-2.5 rounded-md hover:bg-es-card transition-colors"
                      >
                        <span className="text-sm font-medium text-white leading-tight">{item.label}</span>
                        <span className="text-xs text-es-muted leading-tight mt-0.5">{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-es-muted hover:text-white'}`
              }
            >
              About
            </NavLink>
          </div>

          {/* ── Auth actions ────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-sm text-es-muted hover:text-white transition-colors rounded">
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="px-3 py-2 text-sm text-es-muted hover:text-white transition-colors rounded">
                    Admin
                  </Link>
                )}
                {(user?.role === 'ASSESSOR' || user?.role === 'ADMIN') && (
                  <Link to="/assessor" className="px-3 py-2 text-sm text-es-muted hover:text-white transition-colors rounded">
                    Assessor
                  </Link>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn-secondary py-2 px-4 text-xs ml-1"
                >
                  Sign Out
                </button>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 ml-1"
                  style={{ background: '#A41C64' }}
                  aria-label={`${user?.firstName} ${user?.lastName}`}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm text-es-muted hover:text-white transition-colors rounded">
                  Sign In
                </Link>
                <Link to="/courses" className="btn-primary py-2.5 px-5 text-xs ml-1">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ────────────────────────────────────── */}
          <button
            className="lg:hidden p-2 text-es-muted hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="lg:hidden border-t"
          style={{ background: '#0F0F0F', borderColor: '#2A2A2A' }}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="es-container py-4 pb-6">
            {/* Course groups */}
            {COURSES.map((group, gi) => (
              <div key={group.heading} className={gi > 0 ? 'mt-3' : ''}>
                <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: '#A41C64' }}>
                  {group.heading}
                </p>
                {group.items.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      item.available
                        ? 'text-es-muted hover:text-white hover:bg-es-card active:bg-es-card'
                        : 'text-es-subtle pointer-events-none'
                    }`}
                  >
                    {item.label}
                    {!item.available && <span className="ml-2 text-xs opacity-60">(Soon)</span>}
                  </Link>
                ))}
              </div>
            ))}

            <div className="my-3 es-divider" />

            {/* Resources */}
            <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: '#A41C64' }}>Resources</p>
            {RESOURCES.map(r => (
              <Link
                key={r.to}
                to={r.to}
                onClick={close}
                className="block px-3 py-2.5 rounded-lg text-sm text-es-muted hover:text-white hover:bg-es-card transition-colors"
              >
                {r.label}
              </Link>
            ))}
            <Link to="/about" onClick={close} className="block px-3 py-2.5 rounded-lg text-sm text-es-muted hover:text-white hover:bg-es-card transition-colors">
              About
            </Link>

            <div className="my-3 es-divider" />

            {/* Auth */}
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link to="/dashboard" onClick={close} className="block px-3 py-2.5 text-sm text-es-muted hover:text-white rounded-lg hover:bg-es-card transition-colors">
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={close} className="block px-3 py-2.5 text-sm text-es-muted hover:text-white rounded-lg hover:bg-es-card transition-colors">Admin</Link>
                )}
                {(user?.role === 'ASSESSOR' || user?.role === 'ADMIN') && (
                  <Link to="/assessor" onClick={close} className="block px-3 py-2.5 text-sm text-es-muted hover:text-white rounded-lg hover:bg-es-card transition-colors">Assessor</Link>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); close(); }}
                  className="block w-full text-left px-3 py-2.5 text-sm text-red-400 hover:text-red-300 rounded-lg hover:bg-es-card transition-colors mt-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <Link to="/login" onClick={close} className="block px-3 py-2.5 text-sm text-es-muted hover:text-white rounded-lg hover:bg-es-card transition-colors">
                  Sign In
                </Link>
                <Link to="/courses" onClick={close} className="block btn-primary text-center text-sm py-3">
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
