import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
            <NavLink to="/knowledge" className={navLinkClass}>Knowledge Hub</NavLink>
            <NavLink to="/exercises" className={navLinkClass}>Exercises</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Admin
                  </Link>
                )}
                {(user?.role === 'ASSESSOR' || user?.role === 'ADMIN') && (
                  <Link
                    to="/assessor"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
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
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
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
            className="md:hidden text-gray-300 hover:text-white p-2"
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
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-4 space-y-3">
          <NavLink to="/courses" className={navLinkClass} onClick={() => setMenuOpen(false)}>Courses</NavLink>
          <div />
          <NavLink to="/knowledge" className={navLinkClass} onClick={() => setMenuOpen(false)}>Knowledge Hub</NavLink>
          <div />
          <NavLink to="/exercises" className={navLinkClass} onClick={() => setMenuOpen(false)}>Exercises</NavLink>
          <div />
          <NavLink to="/events" className={navLinkClass} onClick={() => setMenuOpen(false)}>Events</NavLink>
          <div className="border-t border-gray-800 pt-3 mt-3 space-y-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-sm text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="block text-sm text-red-400 hover:text-red-300">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-sm text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="block text-sm font-medium text-amber-400 hover:text-amber-300" onClick={() => setMenuOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
