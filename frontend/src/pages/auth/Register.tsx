import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';

function checkStrength(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
  };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = { firstName?: string; lastName?: string; email?: string; password?: string; confirm?: string };

export default function Register() {
  useDocumentHead({ title: 'Create an Account' });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (fieldErrors[field]) setFieldErrors(f => ({ ...f, [field]: undefined }));
  };

  const strength = checkStrength(form.password);
  const passwordValid = strength.length && strength.upper && strength.number;

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!form.email.trim()) errors.email = 'Email address is required.';
    else if (!emailRegex.test(form.email.trim())) errors.email = 'Enter a valid email address.';
    if (!passwordValid) errors.password = 'Password must be at least 8 characters, include an uppercase letter and a number.';
    if (form.confirm !== form.password) errors.confirm = 'Passwords do not match.';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setError('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      await api.post('/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
      submittingRef.current = false;
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

      <main id="main-content" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 48px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img src="/assets/es-logo.png" alt="EducateStrong Academy" style={{ height: '40px', width: 'auto', margin: '0 auto 18px' }} />
            <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
              Create a Learner Account
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              Join the EducateStrong Academy. Access courses, track progress, and earn certificates.
            </p>
          </div>

          {/* Form card */}
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            {error && (
              <div role="alert" style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'rgba(239,68,68,0.9)', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label htmlFor="reg-first-name" style={labelStyle}>First Name</label>
                  <input
                    id="reg-first-name"
                    type="text"
                    value={form.firstName}
                    onChange={set('firstName')}
                    required
                    placeholder="Jane"
                    autoComplete="given-name"
                    aria-describedby={fieldErrors.firstName ? 'reg-first-name-error' : undefined}
                    style={{ ...inputStyle, borderColor: fieldErrors.firstName ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)' }}
                  />
                  {fieldErrors.firstName && (
                    <p id="reg-first-name-error" role="alert" style={{ marginTop: '5px', fontSize: '12px', color: 'rgba(239,68,68,0.8)' }}>{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="reg-last-name" style={labelStyle}>Last Name</label>
                  <input
                    id="reg-last-name"
                    type="text"
                    value={form.lastName}
                    onChange={set('lastName')}
                    required
                    placeholder="Smith"
                    autoComplete="family-name"
                    aria-describedby={fieldErrors.lastName ? 'reg-last-name-error' : undefined}
                    style={{ ...inputStyle, borderColor: fieldErrors.lastName ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)' }}
                  />
                  {fieldErrors.lastName && (
                    <p id="reg-last-name-error" role="alert" style={{ marginTop: '5px', fontSize: '12px', color: 'rgba(239,68,68,0.8)' }}>{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '14px' }}>
                <label htmlFor="reg-email" style={labelStyle}>Email</label>
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-describedby={fieldErrors.email ? 'reg-email-error' : undefined}
                  style={{ ...inputStyle, borderColor: fieldErrors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)' }}
                />
                {fieldErrors.email && (
                  <p id="reg-email-error" role="alert" style={{ marginTop: '5px', fontSize: '12px', color: 'rgba(239,68,68,0.8)' }}>{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '8px' }}>
                <label htmlFor="reg-password" style={labelStyle}>Password</label>
                <input
                  id="reg-password"
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-describedby={fieldErrors.password ? 'reg-password-error' : undefined}
                  style={{ ...inputStyle, borderColor: fieldErrors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)' }}
                />
                {fieldErrors.password && (
                  <p id="reg-password-error" role="alert" style={{ marginTop: '5px', fontSize: '12px', color: 'rgba(239,68,68,0.8)' }}>{fieldErrors.password}</p>
                )}
              </div>

              {/* Strength rules */}
              {form.password.length > 0 && (
                <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[
                    [strength.length, '8+ characters'],
                    [strength.upper, 'Uppercase letter'],
                    [strength.number, 'Number'],
                  ].map(([met, label]) => (
                    <span
                      key={label as string}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: met ? 'rgba(164,28,100,0.15)' : 'rgba(255,255,255,0.06)',
                        color: met ? '#C0246E' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {met ? '✓' : '·'} {label as string}
                    </span>
                  ))}
                </div>
              )}

              {/* Confirm password */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="reg-confirm" style={labelStyle}>Confirm Password</label>
                <input
                  id="reg-confirm"
                  type="password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-describedby={form.confirm.length > 0 && form.confirm !== form.password ? 'reg-confirm-error' : undefined}
                  style={{
                    ...inputStyle,
                    borderColor: form.confirm.length > 0 && form.confirm !== form.password
                      ? 'rgba(239,68,68,0.4)'
                      : 'rgba(255,255,255,0.1)',
                  }}
                />
                {form.confirm.length > 0 && form.confirm !== form.password && (
                  <p id="reg-confirm-error" role="alert" style={{ marginTop: '5px', fontSize: '12px', color: 'rgba(239,68,68,0.8)' }}>Passwords do not match.</p>
                )}
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
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>

          {/* Password rules note */}
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '12px', lineHeight: 1.5 }}>
            Password must be at least 8 characters, include an uppercase letter and a number.
          </p>

          {/* Sign in link */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#A41C64', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>

          {/* Role note */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '8px', lineHeight: 1.5 }}>
            Coach, tutor, and assessor accounts are set up by the platform admin.
          </p>

        </div>
      </main>
    </div>
  );
}
