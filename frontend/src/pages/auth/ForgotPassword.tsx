import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export default function ForgotPassword() {
  useDocumentHead({ title: 'Reset Password', noindex: true });

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [devLink, setDevLink] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setStatus('loading');
    try {
      const res = await api.post<{ message: string; _devResetLink?: string }>('/auth/forgot-password', { email: trimmed });
      setDevLink(res.data._devResetLink ?? null);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <div className="pt-navbar flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src="/assets/es-logo.png" alt="Educate.Strong" className="h-10 w-auto mx-auto mb-6" />
            <h1 className="text-2xl font-black text-white mb-2">Reset Password</h1>
            <p className="text-es-muted text-sm">
              Enter your email address and we'll send you a reset link.
            </p>
          </div>

          <div className="es-card p-7">
            {status === 'sent' ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#fff', fontWeight: 700, marginBottom: '10px' }}>Check your inbox</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>
                  If that email address is registered, you will receive a password reset link shortly.
                  The link expires in 60 minutes.
                </p>
                {import.meta.env.DEV && devLink && (
                  <div style={{ marginTop: '20px', padding: '12px', background: '#1A1A1A', borderRadius: '8px', border: '1px solid rgba(164,28,100,0.3)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '6px' }}>DEV — reset link (not shown in production):</p>
                    <a
                      href={devLink}
                      style={{ color: '#A41C64', fontSize: '12px', wordBreak: 'break-all', fontFamily: 'monospace' }}
                    >
                      {devLink}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <>
                {status === 'error' && (
                  <div className="mb-4 p-3 rounded text-sm text-red-400 border border-red-900/40" style={{ background: 'rgba(239,68,68,0.06)' }}>
                    Something went wrong. Please try again.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-es-muted mb-1.5 uppercase tracking-wide">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="w-full px-4 py-3 rounded-es text-sm text-white placeholder-es-subtle border border-es-grey-dark focus:border-es-accent focus:outline-none transition-colors"
                      style={{ background: '#1C1C1C' }}
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full mt-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
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
