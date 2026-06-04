import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    heading: 'Refereeing',
    items: [
      { to: '/courses/level-1-strongman-refereeing', label: 'Level 1 — Certification', desc: 'WHEA.GB endorsed', available: true },
    ],
  },
  {
    heading: 'Youth & Nutrition',
    items: [
      { to: '/strongkidz', label: 'StrongKidz', desc: 'Youth strength coaching', available: true },
      { to: '/eatstrong', label: 'EatStrong', desc: 'Performance nutrition', available: true },
    ],
  },
];

const RESOURCES = [
  { to: '/knowledge', label: 'Knowledge Hub', desc: 'Articles & coaching guides' },
  { to: '/exercises', label: 'Exercise Library', desc: 'Technique, cues & programming' },
  { to: '/events', label: 'Event Library', desc: 'Competition events reference' },
];

interface DropdownProps {
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

function Dropdown({ label, open, onOpen, onClose, children }: DropdownProps) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${open ? 'text-white' : 'text-es-muted hover:text-white'}`}
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 rounded-lg border border-es-grey-dark z-50 overflow-hidden"
          style={{ background: '#161616', minWidth: '240px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);
  const openDrop = (name: string) => setActiveDropdown(name);
  const closeDrop = () => setActiveDropdown(null);

  const navStyle: React.CSSProperties = {
    background: scrolled
      ? 'rgba(10,10,10,0.96)'
      : 'rgba(13,13,13,0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: scrolled ? '1px solid rgba(60,60,60,0.8)' : '1px solid rgba(44,44,44,0.6)',
    transition: 'all 0.3s ease',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={navStyle}>
      <div className="es-container">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>

          {/* Brand lockup */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <img
              src="/assets/es-logo.png"
              alt="Educate.Strong owl mark"
              className={`w-auto transition-all duration-300 ${scrolled ? 'h-7' : 'h-8'}`}
            />
            <span className="text-sm font-black tracking-tight leading-none hidden sm:block" style={{ color: '#A41C64' }}>
              Educate<span style={{ color: '#A41C64' }}>.</span><span style={{ color: '#A41C64' }}>strong</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Courses dropdown */}
            <Dropdown
              label="Courses"
              open={activeDropdown === 'courses'}
              onOpen={() => openDrop('courses')}
              onClose={closeDrop}
            >
              <div className="p-3 space-y-1">
                {COURSES.map(group => (
                  <div key={group.heading}>
                    <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: '#A41C64' }}>
                      {group.heading}
                    </p>
                    {group.items.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${item.available ? 'hover:bg-es-card' : 'opacity-50 cursor-default pointer-events-none'}`}
                        onClick={item.available ? closeDrop : undefined}
                      >
                        <div>
                          <span className="text-sm font-medium text-white block">{item.label}</span>
                          <span className="text-xs text-es-muted">{item.desc}</span>
                        </div>
                        {item.available && (
                          <svg className="w-3.5 h-3.5 text-es-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        {!item.available && <span className="badge-grey text-xs">Soon</span>}
                      </Link>
                    ))}
                    <div className="es-divider my-1.5" />
                  </div>
                ))}
              </div>
            </Dropdown>

            {/* Resources dropdown */}
            <Dropdown
              label="Resources"
              open={activeDropdown === 'resources'}
              onOpen={() => openDrop('resources')}
              onClose={closeDrop}
            >
              <div className="p-2">
                {RESOURCES.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeDrop}
                    className="flex flex-col px-3 py-2.5 rounded hover:bg-es-card transition-colors"
                  >
                    <span className="text-sm font-medium text-white">{item.label}</span>
                    <span className="text-xs text-es-muted">{item.desc}</span>
                  </Link>
                ))}
              </div>
            </Dropdown>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-es-muted hover:text-white'}`
              }
            >
              About
            </NavLink>
          </div>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm text-es-muted hover:text-white transition-colors">Dashboard</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm text-es-muted hover:text-white transition-colors">Admin</Link>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Sign Out
                </button>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: '#A41C64' }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-es-muted hover:text-white transition-colors">Sign In</Link>
                <Link to="/courses" className="btn-primary py-2.5 px-5 text-xs">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-es-muted hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-es-grey-dark" style={{ background: '#111111' }}>
          <div className="es-container py-4 space-y-1">
            {/* Course groups */}
            {COURSES.map(group => (
              <div key={group.heading}>
                <p className="px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#A41C64' }}>
                  {group.heading}
                </p>
                {group.items.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${item.available ? 'text-es-muted hover:text-white hover:bg-es-card' : 'text-es-subtle pointer-events-none'}`}
                  >
                    {item.label} {!item.available && <span className="text-xs">(Soon)</span>}
                  </Link>
                ))}
              </div>
            ))}
            <div className="es-divider my-2" />
            <p className="px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#A41C64' }}>Resources</p>
            {RESOURCES.map(r => (
              <Link key={r.to} to={r.to} onClick={close} className="block px-3 py-2 rounded text-sm text-es-muted hover:text-white hover:bg-es-card transition-colors">{r.label}</Link>
            ))}
            <Link to="/about" onClick={close} className="block px-3 py-2 rounded text-sm text-es-muted hover:text-white hover:bg-es-card transition-colors">About</Link>
            <div className="es-divider my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={close} className="block px-3 py-2 text-sm text-es-muted hover:text-white rounded transition-colors">Dashboard</Link>
                <button onClick={() => { logout(); navigate('/'); close(); }} className="block w-full text-left px-3 py-2 text-sm text-red-400 rounded">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close} className="block px-3 py-2 text-sm text-es-muted hover:text-white rounded transition-colors">Sign In</Link>
                <Link to="/courses" onClick={close} className="block btn-primary text-center text-sm mt-2">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
