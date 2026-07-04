import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { interestTypeLabel } from '../../data/registerInterestTypes';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterInterest() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'general';
  const item = searchParams.get('item');
  const label = item ? `${interestTypeLabel(type)} — ${item}` : interestTypeLabel(type);

  useDocumentHead({ title: `Register Interest — ${label}` });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [postcode, setPostcode] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const submittingRef = useRef(false);

  function validate() {
    const errors: { name?: string; email?: string } = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!email.trim()) errors.email = 'Email address is required.';
    else if (!emailRegex.test(email.trim())) errors.email = 'Enter a valid email address.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    setErrorMsg('');
    if (!validate()) return;

    const trimmedName = name.trim();
    const [firstName, ...rest] = trimmedName.split(/\s+/);
    const lastName = rest.join(' ') || firstName;

    submittingRef.current = true;
    setStatus('loading');
    try {
      await api.post('/register-interest', {
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        courseInterest: item ? `${type} — ${item}` : type,
        locationInterest: postcode.trim() || undefined,
        message: message.trim() || undefined,
        sourcePage: window.location.pathname + window.location.search,
      });
      setStatus('sent');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || 'Something went wrong. Please try again.');
      setStatus('error');
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <div className="pt-navbar flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="es-label mb-3">Register Interest</p>
            <h1 className="text-2xl font-black text-white mb-2">{label}</h1>
            <p className="text-es-muted text-sm">
              Leave your details and Educate.Strong will be in touch.
            </p>
          </div>

          <div className="es-card p-7">
            {status === 'sent' ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#fff', fontWeight: 700, marginBottom: '10px' }}>Thanks — you're on the list</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                  We've received your interest in {label}. Someone from Educate.Strong will be in touch soon.
                </p>
                <Link to="/" className="btn-secondary text-sm">Back to Home</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {status === 'error' && (
                  <div className="mb-2 p-3 rounded text-sm text-red-400 border border-red-900/40" style={{ background: 'rgba(239,68,68,0.06)' }}>
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-es-muted mb-1.5 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); if (fieldErrors.name) setFieldErrors(f => ({ ...f, name: undefined })); }}
                    maxLength={150}
                    className="w-full px-4 py-3 rounded-es text-sm text-white placeholder-es-subtle border border-es-grey-dark focus:border-es-accent focus:outline-none transition-colors"
                    style={{ background: '#1C1C1C', borderColor: fieldErrors.name ? 'rgba(239,68,68,0.5)' : undefined }}
                  />
                  {fieldErrors.name && (
                    <p className="text-xs mt-1.5" style={{ color: 'rgba(239,68,68,0.85)' }}>{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-es-muted mb-1.5 uppercase tracking-wide">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(f => ({ ...f, email: undefined })); }}
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-es text-sm text-white placeholder-es-subtle border border-es-grey-dark focus:border-es-accent focus:outline-none transition-colors"
                    style={{ background: '#1C1C1C', borderColor: fieldErrors.email ? 'rgba(239,68,68,0.5)' : undefined }}
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs mt-1.5" style={{ color: 'rgba(239,68,68,0.85)' }}>{fieldErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-es-muted mb-1.5 uppercase tracking-wide">Postcode (optional)</label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={e => setPostcode(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-es text-sm text-white placeholder-es-subtle border border-es-grey-dark focus:border-es-accent focus:outline-none transition-colors"
                    style={{ background: '#1C1C1C' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-es-muted mb-1.5 uppercase tracking-wide">Message (optional)</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    maxLength={2000}
                    rows={3}
                    className="w-full px-4 py-3 rounded-es text-sm text-white placeholder-es-subtle border border-es-grey-dark focus:border-es-accent focus:outline-none transition-colors resize-y"
                    style={{ background: '#1C1C1C' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full mt-2 disabled:opacity-50"
                >
                  {status === 'loading' ? 'Submitting…' : 'Register Interest'}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-es-muted mt-6">
            <Link to="/" className="text-es-accent hover:text-es-accent-mid font-semibold">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
