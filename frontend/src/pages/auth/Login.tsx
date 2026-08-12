import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { useDocumentHead } from '../../hooks/useDocumentHead';

/*
 * Sign in page with a workspace selector for clarity, not security.
 *
 * The selector only changes helper copy and the contextual access link
 * below the form — it never changes what the login form does. On
 * submit, the backend's returned user.role is the only thing that
 * decides where someone lands (see roleHome below). If the selected
 * workspace doesn't match the account's real role, a notice explains
 * that the account role — not the selector — controls the redirect.
 *
 * "Create a learner account" links to the public learner-only
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

const WORKSPACES = [
  { key: 'learner',  label: 'Learner' },
  { key: 'coach',    label: 'Coach' },
  { key: 'tutor',    label: 'Tutor' },
  { key: 'assessor', label: 'Assessor' },
  { key: 'admin',    label: 'Admin' },
] as const;

type WorkspaceKey = typeof WORKSPACES[number]['key'];

const WS_EXPECTED_ROLES: Record<WorkspaceKey, string[]> = {
  learner:  ['LEARNER'],
  coach:    ['COACH'],
  tutor:    ['TUTOR'],
  assessor: ['ASSESSOR'],
  admin:    ['ADMIN'],
};

const ROLE_LABEL: Record<string, string> = {
  LEARNER:  'Learner',
  COACH:    'Coach',
  TUTOR:    'Tutor',
  ASSESSOR: 'Assessor',
  ADMIN:    'Admin',
};

const WS_CONTEXT: Record<WorkspaceKey, string> = {
  learner:  'Access your course lessons, coursework, documents, CPD and certificate pathway.',
  coach:    'For approved coaches supporting learners, progress and course resources.',
  tutor:    'For approved tutors managing assigned courses, learner groups and teaching materials.',
  assessor: 'For approved assessors reviewing coursework, evidence and learner submissions.',
  admin:    'For EducateStrong platform owners and administrators.',
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
  color: 'rgba(255,255,255,0.9)',
  background: 'linear-gradient(135deg, rgba(164,28,100,0.22), rgba(124,58,237,0.16))',
  border: '1px solid rgba(164,28,100,0.35)',
  textDecoration: 'none',
};

/* ── Contextual access help under the form ────────────────────────── */

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

  if (ws === 'admin') {
    return (
      <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>
        Admin accounts are issued directly by EducateStrong.
      </p>
    );
  }

  const copy: Record<'coach' | 'tutor' | 'assessor', { text: string; to: string; label: string }> = {
    coach:    { text: 'Need coach access?',    to: '/register-interest?type=coach-access',    label: 'Request coach access' },
    tutor:    { text: 'Need tutor access?',    to: '/register-interest?type=tutor-access',    label: 'Request tutor access' },
    assessor: { text: 'Need assessor access?', to: '/register-interest?type=assessor-access', label: 'Request assessor access' },
  };
  const { text, to, label } = copy[ws];

  return (
    <div>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>
        {text} Request access from EducateStrong.
      </p>
      <Link to={to} style={requestBtnStyle}>
        {label}
      </Link>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  useDocumentHead({ title: 'Sign In', noindex: true });

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
        setNotice(`This is a ${ROLE_LABEL[user.role] || user.role} account — your account role controls where you're sent, so we're taking you to the right workspace.`);
        setLoading(false);
        setTimeout(() => navigate(destination), 1600);
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
    setNotice('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050506', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main id="main-content" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '88px 20px 56px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/assets/es-logo.png" alt="EducateStrong Academy" style={{ height: '48px', width: 'auto', margin: '0 auto' }} />
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
            <div style={{ marginBottom: '22px' }}>
              <h1 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.6rem)',
                fontWeight: 900,
                color: '#F5F5F7',
                margin: '0 0 8px',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                textAlign: 'center',
              }}>
                Welcome back to EducateStrong
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
                Choose your workspace, then sign in.
              </p>
            </div>

            {/* Workspace selector — pills */}
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
                {WORKSPACES.map(ws => {
                  const isActive = activeWs === ws.key;
                  return (
                    <button
                      key={ws.key}
                      type="button"
                      onClick={() => selectWs(ws.key)}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(164,28,100,0.14)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(192,36,110,0.5)'; }}
                      onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}
                      style={{
                        flexGrow: 1,
                        flexShrink: 0,
                        padding: '11px 8px',
                        borderRadius: '7px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.01em',
                        background: isActive ? 'linear-gradient(135deg, #8E1858 0%, #C0246E 100%)' : 'transparent',
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.38)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                        outline: 'none',
                      }}
                    >
                      {ws.label}
                    </button>
                  );
                })}
              </div>
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                {WS_CONTEXT[activeWs]}
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px' }} />

            {/* Error banner */}
            {error && (
              <div role="alert" style={{
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
              <div role="status" style={{
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

            {/* Form — one single sign-in form for every workspace */}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="login-email" style={labelStyle}>Email address</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(f => ({ ...f, email: undefined })); }}
                  required
                  placeholder="you@example.com"
                  style={{ ...inputStyle, borderColor: fieldErrors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.10)' }}
                  autoComplete="email"
                  aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                />
                {fieldErrors.email && (
                  <p id="login-email-error" role="alert" style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(239,68,68,0.85)' }}>{fieldErrors.email}</p>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <label htmlFor="login-password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '13px', color: '#C2186A', fontWeight: 600, textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(f => ({ ...f, password: undefined })); }}
                  required
                  placeholder="••••••••"
                  style={{ ...inputStyle, borderColor: fieldErrors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.10)' }}
                  autoComplete="current-password"
                  aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                />
                {fieldErrors.password && (
                  <p id="login-password-error" role="alert" style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(239,68,68,0.85)' }}>{fieldErrors.password}</p>
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

            {/* Contextual access help — changes with the selected workspace */}
            <WorkspaceCTA ws={activeWs} />

          </div>

          {/* Certificate verification — below card */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.22)', marginTop: '16px' }}>
            Verifying a certificate?{' '}
            <Link to="/verify" style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600, textDecoration: 'none' }}>
              Check a certificate
            </Link>
            {' '}— no account needed.
          </p>

        </div>
      </main>
    </div>
  );
}
