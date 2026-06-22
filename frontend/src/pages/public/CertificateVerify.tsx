/**
 * CertificateVerify — Public certificate verification page.
 * Route: /verify/:code
 *
 * Calls GET /api/certificates/verify/:code (public endpoint).
 * Shows real certificate data from the database only — no fake fields.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

interface VerifiedCertificate {
  id: string;
  certificateCode: string;
  issuedAt: string;
  expiresAt: string | null;
  webhookStatus: string | null;
  user: { firstName: string; lastName: string };
  course: { title: string; pathway: string; level: string };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function CertificateVerify() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
  const [status, setStatus] = useState<'loading' | 'found' | 'not-found' | 'error'>('loading');
  const [searchCode, setSearchCode] = useState(code ?? '');

  async function verify(codeToVerify: string) {
    const trimmed = codeToVerify.trim();
    if (!trimmed) return;
    setStatus('loading');
    setCertificate(null);
    try {
      const res = await api.get<VerifiedCertificate>(`/certificates/verify/${trimmed}`);
      setCertificate(res.data);
      setStatus('found');
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setStatus('not-found');
      } else {
        setStatus('error');
      }
    }
  }

  useEffect(() => {
    if (code) {
      setSearchCode(code);
      verify(code);
    } else {
      setStatus('not-found');
    }
  }, [code]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchCode.trim();
    if (!trimmed) return;
    navigate(`/verify/${encodeURIComponent(trimmed)}`, { replace: true });
  }

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: '#141414',
          paddingTop: 'calc(var(--navbar-height, 72px) + 4rem)',
          paddingBottom: '4rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <span className="es-label" style={{ color: '#A41C64', marginBottom: '16px', display: 'block' }}>
            Certificate Verification
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.15 }}>
            Verify an EducateStrong Certificate
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.7 }}>
            Enter a certificate code below to confirm its authenticity and view the qualification details.
          </p>
        </div>
      </section>

      {/* Search form */}
      <section style={{ background: '#0D0D0D', padding: '40px 0' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              placeholder="e.g. ES-2024-XXXXX"
              style={{
                flex: 1,
                background: '#1C1C1C',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: status === 'loading' ? 'default' : 'pointer',
                opacity: status === 'loading' ? 0.6 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'loading' ? 'Checking…' : 'Verify'}
            </button>
          </form>
        </div>
      </section>

      {/* Result */}
      <section style={{ background: '#0D0D0D', padding: '0 0 80px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}>

          {/* Loading */}
          {status === 'loading' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid rgba(164,28,100,0.3)', borderTopColor: '#A41C64', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '16px', fontSize: '14px' }}>Verifying certificate…</p>
            </div>
          )}

          {/* Found — verified */}
          {status === 'found' && certificate && (
            <div
              style={{
                background: '#131316',
                border: '1px solid rgba(74,222,128,0.25)',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              {/* Green verified header */}
              <div
                style={{
                  background: 'rgba(74,222,128,0.08)',
                  borderBottom: '1px solid rgba(74,222,128,0.15)',
                  padding: '20px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>✅</span>
                <div>
                  <p style={{ color: '#4ADE80', fontWeight: 700, fontSize: '15px' }}>Certificate Verified</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
                    Verified against EducateStrong Academy records at {new Date().toLocaleTimeString('en-GB')}
                  </p>
                </div>
              </div>

              {/* Certificate details */}
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <Row label="Certificate Code" value={certificate.certificateCode} mono />
                  <Row label="Learner" value={`${certificate.user.firstName} ${certificate.user.lastName}`} />
                  <Row label="Qualification" value={certificate.course.title} />
                  <Row label="Pathway" value={certificate.course.pathway} />
                  <Row label="Level" value={certificate.course.level} />
                  <Row label="Issued" value={formatDate(certificate.issuedAt)} />
                  {certificate.expiresAt && (
                    <Row label="Expires" value={formatDate(certificate.expiresAt)} />
                  )}
                </div>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', lineHeight: 1.6 }}>
                    This certificate was issued by Educate.Strong Academy and is verified against our live database records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Not found */}
          {status === 'not-found' && !code && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
              Enter a certificate code above to verify it.
            </div>
          )}

          {status === 'not-found' && code && (
            <div
              style={{
                background: '#131316',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '40px 32px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Certificate Not Found
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                No certificate matching <strong style={{ color: '#fff' }}>{code}</strong> was found in our records.
                Please check the code and try again.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>
                If you believe this is an error, contact{' '}
                <a href="mailto:info@educate-strong.com" style={{ color: '#A41C64' }}>info@educate-strong.com</a>
              </p>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '16px' }}>
                Something went wrong. Please try again.
              </p>
              <button
                onClick={() => code && verify(code)}
                style={{
                  background: '#A41C64',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Info strip */}
      <section style={{ background: 'linear-gradient(180deg, #0D0D0D, #141416)', borderTop: '1px solid rgba(164,28,100,0.1)', padding: '48px 0' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: 1.7 }}>
            EducateStrong Academy certificates are issued upon successful completion of a qualification. Each certificate has a unique code that can be verified here at any time.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/courses" style={{ color: '#A41C64', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
              View Qualifications →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', minWidth: '120px', flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          color: '#fff',
          fontSize: mono ? '13px' : '14px',
          fontWeight: 600,
          fontFamily: mono ? 'monospace' : undefined,
          letterSpacing: mono ? '0.05em' : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}
