import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { CONTACT_EMAIL } from '../../lib/contact';
import { useDocumentHead } from '../../hooks/useDocumentHead';

function roleHome(role: string): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'ASSESSOR') return '/assessor';
  if (role === 'COACH') return '/coach';
  if (role === 'TUTOR') return '/tutor';
  return '/dashboard';
}

const WORKSPACES = [
  { key: 'learner', label: 'Learner' },
  { key: 'coach',   label: 'Coach' },
  { key: 'tutor',   label: 'Tutor & Assessor' },
  { key: 'admin',   label: 'Admin' },
] as const;

type WorkspaceKey = typeof WORKSPACES[number]['key'];

const WS_EXPECTED_ROLES: Record<WorkspaceKey, string[]> = {
  learner: ['LEARNER'],
  coach:   ['COACH'],
  tutor:   ['TUTOR', 'ASSESSOR'],
  admin:   ['ADMIN'],
};

const ROLE_LABEL: Record<string, string> = {
  LEARNER:  'Learner',
  COACH:    'Coach',
  TUTOR:    'Tutor',
  ASSESSOR: 'Assessor',
  ADMIN:    'Admin',
};

const WS_CONTEXT: Record<WorkspaceKey, string> = {
  learner: 'Learner dashboard — courses, progress, and certificates.',
  coach:   'Coach workspace — tools and CPD for certified coaches.',
  tutor:   'Tutor and assessor review — submissions, feedback, and assessment.',
  admin:   'Platform admin — courses, users, enrolments, and settings.',
};

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

const requestBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 18px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.85)',
  background: 'rgba(164,28,100,0.14)',
  border: '1px solid rgba(164,28,100,0.28)',
  textDecoration: 'none',
};

/* ── Role-specific bottom CTA ──────────────────────────────────────── */

function WorkspaceCTA({ ws }: { ws: WorkspaceKey }) {
  if (ws === 'learner') {
    return (
      <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.38)' }}>
        New to EducateStrong?{' '}
        <Link to="/register" style={{ color: '#C2186A', fontWeight: 700, textDecoration: 'none' }}>
          Create a learner account
        </Link>
      </p>
    );
  }

  if (ws === 'coach') {
    return (
      <div>
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>
          Coach accounts are approved by EducateStrong. Request access and the team will confirm your workspace.
        </p>
        <Link
          to="/register-interest?type=coach-access"
          style={requestBtnStyle}
        >
          Request coach access
        </Link>
      </div>
    );
  }

  if (ws === 'tutor') {
    return (
      <div>
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>
          Tutor and assessor accounts are issued or approved by EducateStrong.
        </p>
        <Link
          to="/register-interest?type=tutor-assessor-access"
          style={requestBtnStyle}
        >
          Request access
        </Link>
      </div>
    );
  }

  return (
    <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>
      Admin accounts are created by the platform owner.{' '}
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Admin Account Enquiry')}`}
        style={{ color: 'rgba(255,255,255,0.42)', fontWeight: 600, textDecoration: 'none' }}
      >
        Contact administrator
      </a>
    </p>
  );
}

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
  const [notice, setNotice]     = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading]   = useState(false);
  const [activeWs, setActiveWs] = useState<WorkspaceKey>('learner');
  const submittingRef = useRef(false);

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
    setNotice('');
    if (!validate()) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      const user = await login(email, password);
      const destination = from || roleHome(user.role);

      if (!WS_EXPECTED_ROLES[activeWs].includes(user.role)) {
        setNotice(`This is a ${ROLE_LABEL[user.role] || user.role} account — redirecting you to the right workspace.`);
        setLoading(false);
        setTimeout(() => navigate(destination), 1400);
        return;
      }

      navigate(destination);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const selectWs = (key: WorkspaceKey) => {
    setActiveWs(key);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050506', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '88px 20px 56px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src="/assets/es-logo.png"
              alt="EducateStrong Academy"
              style={{ height: '52px', width: 'auto', margin: '0 auto' }}
            />
          </div>

          {/* ── Unified auth card ─────────────────────────────────── */}
          <div style={{
            background: '#151519',
            border: '1px solid rgba(194,24,106,0.12)',
            borderRadius: '16px',
            padding: '32px 28px',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.4), 0 0 80px rgba(164,28,100,0.06)',
          }}>

            {/* Heading */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.6rem)',
                fontWeight: 900,
                color: '#F5F5F7',
                margin: '0 0 8px',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}>
                Sign in to EducateStrong Academy
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                Choose your workspace, then sign in with your account.
              </p>
            </div>

            {/* Portal selector */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                gap: '3px',
                padding: '4px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                overflowX: 'auto',
              }}>
                {WORKSPACES.map(ws => (
                  <button
                    key={ws.key}
                    type="button"
                    onClick={() => selectWs(ws.key)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '8px 6px',
                      borderRadius: '7px',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.01em',
                      background: activeWs === ws.key ? '#A41C64' : 'transparent',
                      color: activeWs === ws.key ? '#fff' : 'rgba(255,255,255,0.38)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {ws.label}
                  </button>
                ))}
              </div>
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                {WS_CONTEXT[activeWs]}
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px' }} />

            {/* Error banner */}
            {error && (
              <div style={{
                marginBottom: '20px',
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.22)',
                borderRadius: '10px',
                color: 'rgba(239,68,68,0.95)',
                fontSize: '14px',
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            {/* Redirect notice banner */}
            {notice && (
              <div style={{
                marginBottom: '20px',
                padding: '12px 16px',
                background: 'rgba(164,28,100,0.1)',
                border: '1px solid rgba(164,28,100,0.28)',
                borderRadius: '10px',
                color: '#C2186A',
                fontSize: '14px',
                lineHeight: 1.5,
              }}>
                {notice}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email address</label>
                <input
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

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <Link
                    to="/forgot-password"
                    style={{ fontSize: '13px', color: '#C2186A', fontWeight: 600, textDecoration: 'none' }}
                  >
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
                  width: '100%',
                  padding: '14px',
                  background: loading ? 'rgba(164,28,100,0.45)' : 'linear-gradient(135deg,#A41C64,#C0246E)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.01em',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(164,28,100,0.35)',
                  transition: 'all 0.15s',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '24px 0' }} />

            {/* Role-specific create / request access CTA */}
            <WorkspaceCTA ws={activeWs} />

          </div>

          {/* Certificate verification — below card */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.22)', marginTop: '16px' }}>
            Verifying a certificate?{' '}
            <Link
              to="/verify"
              style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600, textDecoration: 'none' }}
            >
              Check a certificate
            </Link>
            {' '}— no account needed.
          </p>

        </div>
      </div>
    </div>
  );
}
