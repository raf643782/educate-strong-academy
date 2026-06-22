import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function validate(): string | null {
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    if (!token) {
      setErrorMsg('Invalid reset link.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus('done');
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="pt-navbar flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm text-center">
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '16px' }}>
              This reset link is invalid. Please request a new one.
            </p>
            <Link to="/forgot-password" className="text-es-accent font-semibold text-sm">
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <div className="pt-navbar flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src="/assets/es-logo.png" alt="Educate.Strong" className="h-10 w-auto mx-auto mb-6" />
            <h1 className="text-2xl font-black text-white mb-2">Set New Password</h1>
            <p className="text-es-muted text-sm">
              Choose a strong password for your account.
            </p>
          </div>

          <div className="es-card p-7">
            {status === 'done' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                <p style={{ color: '#fff', fontWeight: 700, marginBottom: '10px' }}>Password updated</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Your password has been changed successfully.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary w-full"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <>
                {(status === 'error' || errorMsg) && (
                  <div className="mb-4 p-3 rounded text-sm text-red-400 border border-red-900/40" style={{ background: 'rgba(239,68,68,0.06)' }}>
                    {errorMsg}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-es-muted mb-1.5 uppercase tracking-wide">
                      New password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrorMsg(''); }}
                      required
                      autoFocus
                      className="w-full px-4 py-3 rounded-es text-sm text-white placeholder-es-subtle border border-es-grey-dark focus:border-es-accent focus:outline-none transition-colors"
                      style={{ background: '#1C1C1C' }}
                      placeholder="Min. 8 chars, 1 uppercase, 1 number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-es-muted mb-1.5 uppercase tracking-wide">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setErrorMsg(''); }}
                      required
                      className="w-full px-4 py-3 rounded-es text-sm text-white placeholder-es-subtle border border-es-grey-dark focus:border-es-accent focus:outline-none transition-colors"
                      style={{ background: '#1C1C1C' }}
                      placeholder="Repeat password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full mt-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Updating…' : 'Update Password'}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-sm text-es-muted mt-6">
            <Link to="/login" className="text-es-accent hover:text-es-accent-mid font-semibold">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
