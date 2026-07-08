import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { useDocumentHead } from '../../hooks/useDocumentHead';

/*
 * Sign in + portal access page.
 *
 * Security note: the cards below are presentation only — they do not
 * grant access to anything. "Sign in" just focuses the one real login
 * form. "Create learner account" links to the public learner-only
 * registration flow (/register — see Register.tsx, which never reads
 * a role from the request body). "Request access" links to the
 * existing register-interest flow with a role-specific type — that
 * flow only ever creates a RegisterInterest lead for EducateStrong to
 * review, never an account, never a role, never a privilege. Admin has
 * no public entry point at all.
 */

function roleHome(role: string): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'ASSESSOR') return '/assessor';
  if (role === 'COACH') return '/coach';
  if (role === 'TUTOR') return '/tutor';
  return '/dashboard';
}

interface PortalCard {
  key: string;
  title: string;
  description: string;
  secondary?: { label: string; to: string };
  note?: string;
}

const PORTAL_CARDS: PortalCard[] = [
  {
    key: 'learner',
    title: 'Learner Portal',
    description: 'Access your course lessons, documents, coursework, CPD and certificate pathway.',
    secondary: { label: 'Create learner account', to: '/register' },
  },
  {
    key: 'coach',
    title: 'Coach Workspace',
    description: 'For approved coaches supporting learners, progress and course resources.',
    secondary: { label: 'Request coach access', to: '/register-interest?type=coach-access' },
  },
  {
    key: 'tutor',
    title: 'Tutor Workspace',
    description: 'For approved tutors managing assigned courses, learner groups and teaching materials.',
    secondary: { label: 'Request tutor access', to: '/register-interest?type=tutor-access' },
  },
  {
    key: 'assessor',
    title: 'Assessor Portal',
    description: 'For approved assessors reviewing coursework, evidence and learner submissions.',
    secondary: { label: 'Request assessor access', to: '/register-interest?type=assessor-access' },
  },
  {
    key: 'admin',
    title: 'Admin Area',
    description: 'For EducateStrong platform owners and administrators.',
    note: 'Admin accounts are issued directly by EducateStrong.',
  },
];

/* ── Shared styles ─────────────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0D0D10',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '10px',
  padding: '13px 16px',
  color: '#F5F5F7',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '7px',
};

const ghostBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '9px 16px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.75)',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.14)',
  textDecoration: 'none',
  cursor: 'pointer',
};

const requestBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '9px 16px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.9)',
  background: 'linear-gradient(135deg, rgba(164,28,100,0.22), rgba(124,58,237,0.16))',
  border: '1px solid rgba(164,28,100,0.35)',
  textDecoration: 'none',
};

/* ── Page ──────────────────────────────────────────────────────────── */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  useDocumentHead({ title: 'Sign In' });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading]   = useState(false);
  const submittingRef = useRef(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Email address is required.';
    else if (!emailRegex.test(email.trim())) errors.email = 'Enter a valid email address.';
    if (!password) errors.password = 'Password is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setError('');
    if (!validate()) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(from || roleHome(user.role));
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  function focusSignIn() {
    emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    emailInputRef.current?.focus();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050506', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '88px 20px 64px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/assets/es-logo.png" alt="EducateStrong Academy" style={{ height: '48px', width: 'auto', margin: '0 auto 20px' }} />
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#F5F5F7', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
              Welcome back to EducateStrong
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
              Sign in to your account, or find the right portal below.
            </p>
          </div>

          {/* Sign in form */}
          <div style={{ maxWidth: '460px', margin: '0 auto 48px' }}>
            <div style={{
              background: '#151519',
              border: '1px solid rgba(194,24,106,0.12)',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.4), 0 0 80px rgba(164,28,100,0.06)',
            }}>
              {error && (
                <div style={{
                  marginBottom: '18px', padding: '12px 16px',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
                  borderRadius: '10px', color: 'rgba(239,68,68,0.95)', fontSize: '14px', lineHeight: 1.5,
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email address</label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(f => ({ ...f, email: undefined })); }}
                    required
                    placeholder="you@example.com"
                    style={{ ...inputStyle, borderColor: fieldErrors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.10)' }}
                    autoComplete="email"
                  />
                  {fieldErrors.email && (
                    <p style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(239,68,68,0.85)' }}>{fieldErrors.email}</p>
                  )}
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                    <Link to="/forgot-password" style={{ fontSize: '13px', color: '#C2186A', fontWeight: 600, textDecoration: 'none' }}>
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(f => ({ ...f, password: undefined })); }}
                    required
                    placeholder="••••••••"
                    style={{ ...inputStyle, borderColor: fieldErrors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.10)' }}
                    autoComplete="current-password"
                  />
                  {fieldErrors.password && (
                    <p style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(239,68,68,0.85)' }}>{fieldErrors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px',
                    background: loading ? 'rgba(164,28,100,0.45)' : 'linear-gradient(135deg,#A41C64,#C0246E)',
                    color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '15px',
                    cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.01em',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(164,28,100,0.35)', transition: 'all 0.15s',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.22)', marginTop: '16px' }}>
              Verifying a certificate?{' '}
              <Link to="/verify" style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600, textDecoration: 'none' }}>
                Check a certificate
              </Link>
              {' '}— no account needed.
            </p>
          </div>

          {/* Portal access cards */}
          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', marginBottom: '18px' }}>
              Portal access
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {PORTAL_CARDS.map(card => (
                <div
                  key={card.key}
                  style={{
                    background: '#151519',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTop: '2px solid transparent',
                    borderImage: 'linear-gradient(90deg, #A41C64, #7C3AED) 1',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff', margin: '0 0 8px' }}>{card.title}</p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, margin: '0 0 16px', flex: 1 }}>
                    {card.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={focusSignIn} style={ghostBtnStyle}>
                      Sign in
                    </button>
                    {card.secondary && (
                      <Link to={card.secondary.to} style={requestBtnStyle}>
                        {card.secondary.label}
                      </Link>
                    )}
                  </div>
                  {card.note && (
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5, margin: '12px 0 0' }}>
                      {card.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Internal preview link */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.22)', marginTop: '36px', lineHeight: 1.6 }}>
            <Link to="/portal-preview" style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600, textDecoration: 'underline' }}>
              Preview the portals
            </Link>
            {' '}— for internal review only. These previews do not show real account data.
          </p>

        </div>
      </div>
    </div>
  );
}
