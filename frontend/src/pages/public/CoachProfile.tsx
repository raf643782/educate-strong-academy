/**
 * CoachProfile — Individual certified coach profile page.
 * Route: /coaches/:slug
 *
 * Real, database-backed: GET /api/coaches/:slug only ever returns a
 * profile where isVerified && isPublished && !isArchived. Any other
 * slug (unknown, unverified, unpublished, or archived) shows the same
 * honest not-found state — never a hint that a hidden profile exists.
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';

interface Coach {
  slug: string; displayName: string; bio: string | null; photoUrl: string | null;
  location: string | null; region: string | null; specialities: string[];
  qualificationSummary: string | null; contactEmail: string | null; contactUrl: string | null;
}

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
            Coach Profile Not Found
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
            This coach profile doesn't exist, or hasn't been published yet.
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
              to="/register-interest?type=coach-access"
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
  const { slug } = useParams<{ slug: string }>();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useDocumentHead({ title: coach ? coach.displayName : 'Coach Profile' });

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    setNotFound(false);
    api.get<Coach>(`/coaches/${slug}`)
      .then(res => setCoach(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: '#0D0D0D', minHeight: '100vh', color: '#fff' }}>
        <Navbar />
        <div style={{ padding: 'calc(var(--navbar-height, 72px) + 80px) 24px 80px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          Loading…
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !coach) {
    return <CoachNotFound />;
  }

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      <div className="pt-navbar" style={{ maxWidth: '760px', margin: '0 auto', padding: 'calc(var(--navbar-height, 72px) + 56px) 24px 80px' }}>
        <Link to="/coaches" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'inline-block', marginBottom: '28px' }}>
          ← Back to Coach Directory
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '84px', height: '84px', borderRadius: '50%', flexShrink: 0,
              background: coach.photoUrl ? undefined : 'rgba(164,28,100,0.15)',
              border: '1px solid rgba(164,28,100,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', fontWeight: 700, color: '#C0246E', fontSize: '26px',
            }}
          >
            {coach.photoUrl
              ? <img src={coach.photoUrl} alt={coach.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              : coach.displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(164,28,100,0.12)', border: '1px solid rgba(164,28,100,0.3)', borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, color: '#C0246E', marginBottom: '6px' }}>
              ✓ Verified Coach
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, margin: '0 0 4px' }}>{coach.displayName}</h1>
            {coach.location && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>{coach.location}{coach.region ? `, ${coach.region}` : ''}</p>}
          </div>
        </div>

        {coach.qualificationSummary && (
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#E19A47', marginBottom: '20px' }}>{coach.qualificationSummary}</p>
        )}

        {coach.specialities.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {coach.specialities.map(s => (
              <span key={s} style={{ fontSize: '12px', fontWeight: 600, color: '#E19A47', background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.25)', borderRadius: '999px', padding: '4px 12px' }}>{s}</span>
            ))}
          </div>
        )}

        {coach.bio && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>{coach.bio}</p>
        )}

        {(coach.contactEmail || coach.contactUrl) && (
          <div style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.1)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {coach.contactEmail && (
              <a href={`mailto:${coach.contactEmail}`} style={{ background: 'linear-gradient(135deg,#A41C64,#C0246E)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
                Contact {coach.displayName.split(' ')[0]}
              </a>
            )}
            {coach.contactUrl && (
              <a href={coach.contactUrl} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                Visit website
              </a>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
