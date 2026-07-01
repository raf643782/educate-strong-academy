import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

function roleHome(role: string): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'ASSESSOR') return '/assessor';
  if (role === 'COACH') return '/coach';
  if (role === 'TUTOR') return '/tutor';
  return '/dashboard';
}

const WORKSPACES = [
  {
    key: 'learner',
    label: 'Learner',
    desc: 'Access your courses, progress, resources, submissions and certificates.',
  },
  {
    key: 'coach',
    label: 'Coach',
    desc: 'Access coach tools, CPD and future certified coach workspace features when enabled.',
  },
  {
    key: 'tutor',
    label: 'Tutor & Assessor',
    desc: 'Access learner submissions, feedback tools, assessment review and course support where assigned.',
  },
  {
    key: 'admin',
    label: 'Admin',
    desc: 'Manage courses, users, enrolments, cohorts, certificates, documents and platform settings.',
  },
] as const;

type WorkspaceKey = typeof WORKSPACES[number]['key'];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeWs, setActiveWs] = useState<WorkspaceKey>('learner');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(roleHome(user.role));
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div style={{ minHeight: '100vh', background: '#050506', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '88px 20px 56px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="/assets/es-logo.png"
              alt="EducateStrong Academy"
              style={{ height: '52px', width: 'auto', margin: '0 auto 20px' }}
            />
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.875rem)', fontWeight: 900, color: '#F5F5F7', margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              Sign in to EducateStrong Academy
            </h1>
            <p style={{ color: '#75757D', fontSize: '14px', lineHeight: 1.6, margin: 0, maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto' }}>
              Your dashboard opens automatically based on your account role.
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: '#151519',
            border: '1px solid rgba(194,24,106,0.12)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.4)',
          }}>
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

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                  autoComplete="email"
                />
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
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                  autoComplete="current-password"
                />
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
          </div>

          {/* Create account */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#75757D', marginTop: '20px' }}>
            New to EducateStrong?{' '}
            <Link to="/register" style={{ color: '#C2186A', fontWeight: 700, textDecoration: 'none' }}>
              Create a learner account
            </Link>
          </p>

          {/* Certificate verification */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
            Verifying a certificate?{' '}
            <Link to="/verify" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, textDecoration: 'none' }}>
              Check a certificate
            </Link>
            {' '}— no account needed.
          </p>

          {/* Workspace selector */}
          <div style={{
            marginTop: '28px',
            background: '#151519',
            border: '1px solid rgba(194,24,106,0.08)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
                Signing in as
              </p>
              {/* Tab bar */}
              <div style={{
                display: 'flex',
                gap: '3px',
                padding: '4px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                {WORKSPACES.map(ws => (
                  <button
                    key={ws.key}
                    type="button"
                    onClick={() => setActiveWs(ws.key)}
                    style={{
                      flex: 1,
                      padding: '7px 6px',
                      borderRadius: '7px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: activeWs === ws.key ? '#A41C64' : 'transparent',
                      color: activeWs === ws.key ? '#fff' : 'rgba(255,255,255,0.4)',
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
            </div>
            <div style={{ padding: '14px 20px' }}>
              <p style={{ fontSize: '13px', color: '#B8B8BE', lineHeight: 1.65, margin: '0 0 10px' }}>
                {WORKSPACES.find(w => w.key === activeWs)?.desc}
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', margin: 0, lineHeight: 1.5 }}>
                Your account role controls which workspace opens after sign in.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
