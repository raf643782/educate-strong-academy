import { useState } from 'react';
import api from '../../lib/api';

// ── Internal QA demo login — TEMPORARY TOOLING ──────────────────────────────
//
// Not linked from anywhere in the public site nav. Only functional when
// VITE_ENABLE_QA_DEMO_LOGIN=true is set at build time AND the backend has
// ENABLE_QA_DEMO_LOGIN=true + QA_DEMO_SECRET configured — this page never
// knows the real secret, it only forwards whatever is typed to the backend,
// which does the actual check.
//
// MUST be disabled before public launch: remove/unset
// VITE_ENABLE_QA_DEMO_LOGIN on Vercel (and ENABLE_QA_DEMO_LOGIN on Render).

type DemoRole = 'LEARNER' | 'COACH' | 'TUTOR' | 'ASSESSOR' | 'ADMIN';

const ROLE_BUTTONS: { role: DemoRole; label: string; destination: string }[] = [
  { role: 'LEARNER', label: 'Login as Demo Learner', destination: '/dashboard' },
  { role: 'COACH', label: 'Login as Demo Coach', destination: '/coach' },
  { role: 'TUTOR', label: 'Login as Demo Tutor', destination: '/tutor' },
  { role: 'ASSESSOR', label: 'Login as Demo Assessor', destination: '/assessor' },
  { role: 'ADMIN', label: 'Login as Demo Admin', destination: '/admin' },
];

const btnStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '13px 16px',
  marginBottom: '10px',
  background: '#151519',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
};

export default function QaDemoLogin() {
  const enabled = import.meta.env.VITE_ENABLE_QA_DEMO_LOGIN === 'true';
  const [secret, setSecret] = useState('');
  const [activeRole, setActiveRole] = useState<DemoRole | null>(null);
  const [error, setError] = useState('');

  if (!enabled) {
    return (
      <div style={{ minHeight: '100vh', background: '#050506', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
        This page is not available.
      </div>
    );
  }

  async function handleDemoLogin(role: DemoRole, destination: string) {
    setError('');
    setActiveRole(role);
    try {
      const res = await api.post('/auth/qa-demo-login', { secret, role });
      localStorage.setItem('es_token', res.data.token);
      window.location.href = destination;
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Demo login failed.');
      setActiveRole(null);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050506', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#E19A47', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
          Internal QA access only. Disable before public launch.
        </div>

        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
          QA demo secret
        </label>
        <input
          type="password"
          value={secret}
          onChange={e => { setSecret(e.target.value); setError(''); }}
          placeholder="Enter the QA demo secret"
          style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '20px' }}
        />

        {ROLE_BUTTONS.map(({ role, label, destination }) => (
          <button
            key={role}
            disabled={!secret || activeRole !== null}
            onClick={() => handleDemoLogin(role, destination)}
            style={{ ...btnStyle, opacity: !secret ? 0.4 : 1, cursor: !secret || activeRole !== null ? 'not-allowed' : 'pointer' }}
          >
            {activeRole === role ? 'Signing in...' : label}
          </button>
        ))}

        {error && (
          <div style={{ marginTop: '10px', fontSize: '13px', color: 'rgba(239,68,68,0.9)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
