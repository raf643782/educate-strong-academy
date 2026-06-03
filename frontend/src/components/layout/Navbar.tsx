import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-amber-400' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 flex-shrink-0">
            <span className="text-white font-bold text-lg tracking-tight">
              Educate<span className="text-amber-500">.</span>Strong
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>

            {/* Library dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setLearnOpen(true)}
              onMouseLeave={() => setLearnOpen(false)}
            >
              <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Library
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {learnOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <DropLink to="/knowledge" label="Knowledge Hub" desc="Articles and references" />
                  <DropLink to="/exercises" label="Exercise Library" desc="Technique and coaching cues" />
                  <DropLink to="/events" label="Event Library" desc="Competition events" />
                </div>
              )}
            </div>

            {/* EatStrong — visually distinct green link, no emoji */}
            <NavLink
              to="/eatstrong"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors px-3 py-1 rounded border ${
                  isActive
                    ? 'text-green-300 border-green-700 bg-green-900/40'
                    : 'text-green-400 border-green-800/60 hover:text-green-300 hover:border-green-700 hover:bg-green-900/30'
                }`
              }
            >
              EatStrong
            </NavLink>
          </div>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm text-gray-300 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
                {(user?.role === 'ASSESSOR' || user?.role === 'ADMIN') && (
                  <Link to="/assessor" className="text-sm text-gray-300 hover:text-white transition-colors">
                    Assessor
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign out
                </button>
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-gray-900 px-4 py-5 space-y-1">
          <MobileLink to="/courses" onClick={() => setMenuOpen(false)}>Courses</MobileLink>
          <MobileLink to="/knowledge" onClick={() => setMenuOpen(false)}>Knowledge Hub</MobileLink>
          <MobileLink to="/exercises" onClick={() => setMenuOpen(false)}>Exercise Library</MobileLink>
          <MobileLink to="/events" onClick={() => setMenuOpen(false)}>Event Library</MobileLink>
          {/* EatStrong — distinct styling, no emoji */}
          <Link
            to="/eatstrong"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-green-400 border border-green-800/60 rounded-lg px-3 py-2.5 hover:bg-green-900/30 transition-colors"
          >
            EatStrong — Nutrition
          </Link>
          <div className="border-t border-gray-800 pt-4 mt-3 space-y-1">
            {isAuthenticated ? (
              <>
                <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
                {user?.role === 'ADMIN' && (
                  <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileLink>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-sm text-red-400 hover:text-red-300 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Sign in</MobileLink>
                <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Get started</MobileLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DropLink({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <Link to={to} className="flex flex-col px-4 py-2.5 hover:bg-gray-50 transition-colors">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <span className="text-xs text-gray-400">{desc}</span>
    </Link>
  );
}

function MobileLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-sm font-medium text-gray-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
    >
      {children}
    </Link>
  );
}
