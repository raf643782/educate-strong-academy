import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

/**
 * Soft email-verification reminder. Renders nothing once
 * user.emailVerified is true, or if there's no logged-in user at all —
 * safe to drop into any authenticated page unconditionally. Never
 * blocks anything: no modal, no overlay, doesn't interrupt the rest of
 * the page. Verifying (or not) never changes role, enrolment, or
 * access level — this is a reminder only.
 */
export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    setStatus('sending');
    try {
      await api.post('/auth/resend-verification');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      style={{
        background: 'rgba(225,154,71,0.08)',
        border: '1px solid rgba(225,154,71,0.25)',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <p style={{ color: '#E19A47', fontSize: '13px', fontWeight: 600, margin: 0, flex: '1 1 240px' }}>
        Please verify your email address — check your inbox for a link.
        {status === 'sent' && <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}> Verification email sent — check your inbox.</span>}
        {status === 'error' && <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}> Couldn't send right now. Please try again shortly.</span>}
      </p>
      <button
        onClick={handleResend}
        disabled={status === 'sending' || status === 'sent'}
        style={{
          background: 'transparent',
          color: '#E19A47',
          border: '1px solid rgba(225,154,71,0.4)',
          borderRadius: '8px',
          padding: '6px 14px',
          fontWeight: 600,
          fontSize: '12px',
          cursor: status === 'sending' || status === 'sent' ? 'default' : 'pointer',
          opacity: status === 'sending' ? 0.6 : 1,
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : 'Resend verification email'}
      </button>
    </div>
  );
}
