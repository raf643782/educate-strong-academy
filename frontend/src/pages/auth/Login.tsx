import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

function roleHome(role: string): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'ASSESSOR') return '/assessor';
  return '/dashboard';
}

const WORKSPACE_ROWS = [
  ['Learners', 'courses, progress, resources, assessments, and certificates'],
  ['Coaches', 'assigned students, course progress, check-ins, and coach tools'],
  ['Tutors & Assessors', 'teaching, assessment, and learner review tools when enabled'],
  ['Admins', 'course management, documents, assessments, users, and platform settings'],
] as const;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    background: '#111',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '11px 14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 48px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img src="/assets/es-logo.png" alt="EducateStrong Academy" style={{ height: '40px', width: 'auto', margin: '0 auto 18px' }} />
            <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
              Sign in to EducateStrong Academy
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              Access your courses, certificates, coaching tools, or admin workspace.
              Your dashboard will open based on your account type.
            </p>
          </div>

          {/* Form card */}
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            {error && (
              <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '12px', color: '#A41C64', fontWeight: 600, textDecoration: 'none' }}>
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
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading ? 'rgba(164,28,100,0.5)' : 'linear-gradient(135deg,#A41C64,#C0246E)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Create account */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '18px' }}>
            New to EducateStrong?{' '}
            <Link to="/register" style={{ color: '#A41C64', fontWeight: 700, textDecoration: 'none' }}>
              Create a learner account
            </Link>
          </p>

          {/* Certificate verification */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.22)', marginTop: '6px' }}>
            Verifying a certificate?{' '}
            <Link to="/verify" style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600, textDecoration: 'none' }}>
              Check a certificate
            </Link>
            {' '}— no account needed.
          </p>

          {/* Workspace helper */}
          <div style={{ marginTop: '24px', padding: '16px 18px', background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
              Which workspace will I see?
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {WORKSPACE_ROWS.map(([role, desc]) => (
                <li key={role} style={{ fontSize: '12px', lineHeight: 1.5 }}>
                  <span style={{ color: 'rgba(164,28,100,0.9)', fontWeight: 700 }}>{role}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}> — {desc}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
