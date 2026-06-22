/**
 * CoachDirectory — Public certified coaches directory page.
 * Route: /coaches
 *
 * No real coaches are in the database yet. The directory shows an honest
 * empty state until qualifications and verification records are live.
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const FILTERS = ['All', 'Level 1 Coaching', 'Level 1 Refereeing', 'StrongKidz'];

/* ── Main Page ──────────────────────────────────────────────────────── */
export default function CoachDirectory() {
  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        className="pt-navbar"
        style={{
          background: '#141414',
          paddingTop: 'calc(var(--navbar-height, 72px) + 5rem)',
          paddingBottom: '5rem',
        }}
      >
        <div className="es-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <span className="es-label" style={{ color: '#A41C64', fontWeight: 700, letterSpacing: '0.12em', fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
            Certified Coaches
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}
          >
            Find a Certified Strongman Coach
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 32px' }}>
            Every coach who completes an Educate.Strong qualification will appear in our verified directory. Browse certified coaches and find one near you.
          </p>

          {/* Trust pills */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Active IQ Verified', 'WHEA.GB Endorsed', 'UK & Worldwide'].map(pill => (
              <span
                key={pill}
                style={{
                  background: 'rgba(164,28,100,0.12)',
                  border: '1px solid rgba(164,28,100,0.3)',
                  color: 'rgba(255,255,255,0.7)',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter Bar (decorative — no coaches live yet) ─────────── */}
      <div
        style={{
          background: '#0D0D0D',
          borderBottom: '1px solid #2C2C2C',
          padding: '16px 0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          className="es-container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '280px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search coaches..."
              style={{
                width: '100%',
                background: '#1C1C1C',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              readOnly
            />
          </div>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FILTERS.map((f, i) => (
              <button
                key={f}
                style={{
                  background: i === 0 ? '#A41C64' : '#1C1C1C',
                  border: i === 0 ? '1px solid #A41C64' : '1px solid rgba(255,255,255,0.12)',
                  color: i === 0 ? '#fff' : 'rgba(255,255,255,0.55)',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'default',
                  transition: 'all 0.2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ marginLeft: 'auto' }}>
            <select
              style={{
                background: '#1C1C1C',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.55)',
                borderRadius: '6px',
                padding: '7px 28px 7px 12px',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option>Recently Certified</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Empty State ──────────────────────────────────────────────── */}
      <section style={{ background: '#0D0D0D', padding: '80px 0 96px' }}>
        <div
          className="es-container"
          style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}
        >
          {/* Icon */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(164,28,100,0.1)',
              border: '1px solid rgba(164,28,100,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
              fontSize: '32px',
            }}
          >
            🎖️
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '16px',
            }}
          >
            Certified Coach Directory Coming Soon
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.75, marginBottom: '12px' }}>
            EducateStrong certified coaches will appear here once qualifications and verification records are live.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', lineHeight: 1.6, marginBottom: '40px' }}>
            Coaches who complete a Level 1 qualification will be verified by EducateStrong and listed in this directory with their credentials, location, and speciality.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:info@educate-strong.com?subject=Certified Coach Directory - Register Interest"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                color: '#fff',
                padding: '13px 28px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Register Interest
            </a>
            <Link
              to="/coaching"
              style={{
                display: 'inline-block',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.8)',
                padding: '13px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              View Coaching Pathway
            </Link>
            <a
              href="mailto:info@educate-strong.com"
              style={{
                display: 'inline-block',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                padding: '13px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Contact EducateStrong
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0D0D0D 0%, #141416 100%)',
          borderTop: '1px solid rgba(164,28,100,0.15)',
          padding: '72px 0',
        }}
      >
        <div
          className="es-container"
          style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '16px',
            }}
          >
            Your name could be here
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.7, marginBottom: '36px' }}>
            Complete a Level 1 qualification and join the UK's growing community of certified Strongman coaches.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link
              to="/courses/level-1-coaching-strongman"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #A41C64, #C0246E)',
                color: '#fff',
                padding: '13px 28px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Start Level 1 Coaching
            </Link>
            <Link
              to="/courses/level-1-strongman-refereeing"
              style={{
                display: 'inline-block',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.8)',
                padding: '13px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Level 1 Refereeing
            </Link>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', lineHeight: 1.6 }}>
            Verified coach profiles will connect EducateStrong Academy records with professional coach profiles.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
