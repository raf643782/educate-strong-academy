/**
 * CoachProfile — Individual certified coach profile page.
 * Route: /coaches/:slug
 *
 * No real coaches are in the database yet. All slugs show the not-found
 * state until coach records are verified and published.
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

/* ── Not Found ──────────────────────────────────────────────────────── */
function CoachNotFound() {
  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', color: '#fff' }}>
      <Navbar />
      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          padding: 'calc(var(--navbar-height, 72px) + 80px) 24px 80px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: '#131316',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '48px 32px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎖️</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            Certified Coach Directory Coming Soon
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
            EducateStrong certified coaches will appear here once qualifications and verification records are live. No coach profiles are published yet.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/coaches"
              style={{
                display: 'inline-block',
                background: '#A41C64',
                color: '#fff',
                padding: '11px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              ← Back to Coach Directory
            </Link>
            <Link
              to="/register-interest?interest=Certified%20Coach%20Directory"
              style={{
                display: 'inline-block',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              Register Interest
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ── Main Profile Page ──────────────────────────────────────────────── */
export default function CoachProfile() {
  return <CoachNotFound />;
}
