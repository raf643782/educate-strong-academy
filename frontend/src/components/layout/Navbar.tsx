import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LIBRARY_LINKS = [
  { to: '/knowledge', label: 'Knowledge Hub', desc: 'Articles & coaching guides' },
  { to: '/exercises', label: 'Exercise Library', desc: 'Technique & coaching cues' },
  { to: '/events', label: 'Event Library', desc: 'Competition events' },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [libOpen, setLibOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <nav
      style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(12px)' }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-es-grey-dark"
    >
      <div className="es-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/assets/es-logo.png" alt="Educate.Strong" className="h-8 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { to: '/courses', label: 'Courses' },
              { to: '/about',   label: 'About' },
              { to: '/strongkidz', label: 'StrongKidz' },
            ].map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-es-muted hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {/* Library dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setLibOpen(true)}
              onMouseLeave={() => setLibOpen(false)}
            >
              <button className="px-4 py-2 rounded text-sm font-medium text-es-muted hover:text-white transition-colors flex items-center gap-1">
                Library
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {libOpen && (
                <div
                  className="absolute top-full left-0 mt-px w-52 rounded-lg border border-es-grey-dark z-50 overflow-hidden"
                  style={{ background: '#1C1C1C' }}
                >
                  {LIBRARY_LINKS.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex flex-col px-4 py-3 hover:bg-es-grey-dark transition-colors"
                    >
                      <span className="text-sm font-semibold text-white">{link.label}</span>
                      <span className="text-xs text-es-muted">{link.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* EatStrong */}
            <NavLink
              to="/eatstrong"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-sm font-semibold transition-colors border ${
                  isActive
                    ? 'border-green-600 text-green-400 bg-green-950'
                    : 'border-green-900 text-green-500 hover:border-green-700 hover:text-green-400'
                }`
              }
            >
              EatStrong
            </NavLink>
          </div>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm text-es-muted hover:text-white transition-colors">
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm text-es-muted hover:text-white transition-colors">Admin</Link>
                )}
                <button onClick={() => { logout(); navigate('/'); }} className="btn-secondary py-2 px-4 text-xs">
                  Sign Out
                </button>
                <div className="w-8 h-8 rounded-full bg-es-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-es-muted hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/courses" className="btn-primary py-2.5 px-5 text-xs">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-es-muted hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-es-grey-dark" style={{ background: '#141414' }}>
          <div className="es-container py-4 space-y-1">
            {[
              { to: '/courses', l: 'Courses' },
              { to: '/about', l: 'About' },
              { to: '/strongkidz', l: 'StrongKidz' },
              { to: '/knowledge', l: 'Knowledge Hub' },
              { to: '/exercises', l: 'Exercise Library' },
              { to: '/events', l: 'Event Library' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={close}
                className="block px-3 py-2.5 rounded text-sm font-medium text-es-muted hover:text-white hover:bg-es-card transition-colors"
              >
                {item.l}
              </Link>
            ))}
            <Link to="/eatstrong" onClick={close} className="block px-3 py-2.5 rounded text-sm font-medium text-green-400">
              EatStrong
            </Link>
            <div className="border-t border-es-grey-dark pt-3 mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={close} className="block px-3 py-2 text-sm text-es-muted hover:text-white rounded transition-colors">Dashboard</Link>
                  <button onClick={() => { logout(); navigate('/'); close(); }} className="block w-full text-left px-3 py-2 text-sm text-red-400 rounded transition-colors">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={close} className="block px-3 py-2 text-sm text-es-muted hover:text-white rounded transition-colors">Sign In</Link>
                  <Link to="/courses" onClick={close} className="block btn-primary text-center text-sm mt-2">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
