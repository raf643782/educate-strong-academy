import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const Field = ({ label, field, type = 'text', placeholder }: { label: string; field: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-es-muted mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type} value={(form as any)[field]} onChange={set(field)} required
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-es text-sm text-white placeholder-es-subtle border border-es-grey-dark focus:border-es-accent focus:outline-none transition-colors"
        style={{ background: '#1C1C1C' }}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <div className="pt-navbar flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src="/assets/es-logo.png" alt="Educate.Strong" className="h-10 w-auto mx-auto mb-6" />
            <h1 className="text-2xl font-black text-white mb-2">Create Account</h1>
            <p className="text-es-muted text-sm">Join the Educate.Strong Academy.</p>
          </div>
          <div className="es-card p-7">
            {error && (
              <div className="mb-4 p-3 rounded text-sm text-red-400 border border-red-900/40" style={{ background: 'rgba(239,68,68,0.06)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" field="firstName" placeholder="Jane" />
                <Field label="Last Name" field="lastName" placeholder="Smith" />
              </div>
              <Field label="Email" field="email" type="email" placeholder="you@example.com" />
              <Field label="Password" field="password" type="password" placeholder="••••••••" />
              <Field label="Confirm Password" field="confirm" type="password" placeholder="••••••••" />
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-50">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-es-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-es-accent hover:text-es-accent-mid font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
