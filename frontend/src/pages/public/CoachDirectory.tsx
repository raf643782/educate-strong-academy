/**
 * CoachDirectory — Public certified coaches directory page.
 * Route: /coaches
 *
 * Real, database-backed directory: GET /api/coaches only ever returns
 * profiles where isVerified && isPublished && !isArchived — controlled
 * entirely by admin (see admin/CoachProfileManager.tsx). Shows an
 * honest empty state when no coaches are published yet.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { CONTACT_EMAIL } from '../../lib/contact';
import { useDocumentHead } from '../../hooks/useDocumentHead';

interface Coach {
  slug: string; displayName: string; bio: string | null; photoUrl: string | null;
  location: string | null; region: string | null; specialities: string[];
  qualificationSummary: string | null;
}

function CoachCard({ coach }: { coach: Coach }) {
  return (
    <Link
      to={`/coaches/${coach.slug}`}
      style={{
        display: 'block', background: '#151519', border: '1px solid rgba(194,24,106,0.1)',
        borderRadius: '14px', padding: '22px', textDecoration: 'none', transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(164,28,100,0.4)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(194,24,106,0.1)'; }}
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div
          style={{
            width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
            background: coach.photoUrl ? undefined : 'rgba(164,28,100,0.15)',
            border: '1px solid rgba(164,28,100,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', fontWeight: 700, color: '#C0246E', fontSize: '16px',
          }}
        >
          {coach.photoUrl
            ? <img src={coach.photoUrl} alt={coach.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            : coach.displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff', margin: '0 0 2px' }}>{coach.displayName}</p>
          {coach.location && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{coach.location}</p>}
        </div>
      </div>
      {coach.qualificationSummary && (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 12px', lineHeight: 1.5 }}>{coach.qualificationSummary}</p>
      )}
      {coach.specialities.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {coach.specialities.map(s => (
            <span key={s} style={{ fontSize: '11px', fontWeight: 600, color: '#E19A47', background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.25)', borderRadius: '999px', padding: '3px 10px' }}>{s}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────── */
export default function CoachDirectory() {
  useDocumentHead({
    title: 'Certified Coach Directory',
    description: 'Find a certified Strongman coach, referee, or StrongKidz session leader.',
  });

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    const t = setTimeout(() => {
      setLoading(true);
      api.get<Coach[]>('/coaches', { params })
        .then(res => setCoaches(res.data))
        .catch(() => setCoaches([]))
        .finally(() => setLoading(false));
    }, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [search]);

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

      {/* ── Search Bar ─────────────────────────────────────────────── */}
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
        <div className="es-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or location…"
            style={{
              width: '100%',
              maxWidth: '360px',
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ── Results / Empty State ────────────────────────────────────── */}
      <section style={{ background: '#0D0D0D', padding: '56px 0 96px' }}>
        <div className="es-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {[1, 2, 3].map(i => <div key={i} style={{ height: '150px', borderRadius: '14px', background: '#151519', border: '1px solid rgba(255,255,255,0.06)' }} />)}
            </div>
          ) : coaches.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {coaches.map(c => <CoachCard key={c.slug} coach={c} />)}
            </div>
          ) : (
            <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
              <div
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 28px', fontSize: '32px',
                }}
              >
                🎖️
              </div>

              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
                {search ? 'No coaches match your search' : 'Certified Coach Directory Coming Soon'}
              </h2>

              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.75, marginBottom: '12px' }}>
                {search
                  ? 'Try a different name or location, or clear your search to see all published coaches.'
                  : 'EducateStrong certified coaches will appear here once qualifications and verification records are live.'}
              </p>
              {!search && (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', lineHeight: 1.6, marginBottom: '40px' }}>
                  Coaches who complete a Level 1 qualification will be verified by EducateStrong and listed in this directory with their credentials, location, and speciality.
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  to="/register-interest?type=coach-access"
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
                </Link>
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
                  href={`mailto:${CONTACT_EMAIL}`}
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
          )}
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
            Verified coach profiles connect EducateStrong Academy records with professional coach profiles.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
