import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useDocumentHead } from '../../hooks/useDocumentHead';

// Deliberately requires an explicit button click to consume the token,
// rather than verifying automatically on page load — some email
// clients and security scanners "click" links automatically to check
// them for phishing/malware, which would otherwise burn this single-use
// token before the real recipient ever opens the message.
export default function VerifyEmail() {
  useDocumentHead({ title: 'Verify Your Email' });

  const { token } = useParams<{ token: string }>();
  const { refreshUser } = useAuth();

  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleVerify() {
    if (!token) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/auth/verify-email', { token });
      setStatus('done');
      refreshUser();
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
              This verification link is invalid.
            </p>
            <Link to="/dashboard" className="text-es-accent font-semibold text-sm">
              Go to your dashboard
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
            <h1 className="text-2xl font-black text-white mb-2">Verify Your Email</h1>
            <p className="text-es-muted text-sm">
              Confirm this is your email address to finish verifying your account.
            </p>
          </div>

          <div className="es-card p-7">
            {status === 'done' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                <p style={{ color: '#fff', fontWeight: 700, marginBottom: '10px' }}>Email verified</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Thanks — your email address is now confirmed.
                </p>
                <Link to="/dashboard" className="btn-primary w-full inline-block text-center">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <>
                {(status === 'error' || errorMsg) && (
                  <div className="mb-4 p-3 rounded text-sm text-red-400 border border-red-900/40" style={{ background: 'rgba(239,68,68,0.06)' }}>
                    {errorMsg}
                  </div>
                )}
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Click below to confirm your email address. This link expires 24 hours after it was sent.
                </p>
                <button
                  onClick={handleVerify}
                  disabled={status === 'loading'}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {status === 'loading' ? 'Verifying…' : 'Verify Email Address'}
                </button>
              </>
            )}
          </div>

          <p className="text-center text-sm text-es-muted mt-6">
            <Link to="/dashboard" className="text-es-accent hover:text-es-accent-mid font-semibold">
              ← Back to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
