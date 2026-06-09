/**
 * CoachProfile — Individual certified coach profile page.
 * Route: /coaches/:slug
 */

import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

/* ── Coach data (mirrored from CoachDirectory) ──────────────────────── */
const COACHES = [
  { id: 'tom-bradley', name: 'Tom Bradley', location: 'Sheffield, UK', country: 'United Kingdom', level: 'Level 1 Coaching', cert: 'Fundamentals of Coaching Strongman', speciality: 'Strength & Conditioning', status: 'Certified', certYear: '2024', initials: 'TB', colour: '#A41C64', lat: 53.3811, lng: -1.4701 },
  { id: 'jessica-park', name: 'Jessica Park', location: 'Manchester, UK', country: 'United Kingdom', level: 'Level 1 Coaching', cert: 'Fundamentals of Coaching Strongman', speciality: 'Gym Owner · PT', status: 'Certified', certYear: '2024', initials: 'JP', colour: '#C0246E', lat: 53.4808, lng: -2.2426 },
  { id: 'daniel-ross', name: 'Daniel Ross', location: 'Birmingham, UK', country: 'United Kingdom', level: 'Level 1 Refereeing', cert: 'Strongman Refereeing Certification', speciality: 'Competition Official', status: 'Certified', certYear: '2024', initials: 'DR', colour: '#E19A47', lat: 52.4862, lng: -1.8904 },
  { id: 'sarah-chen', name: 'Sarah Chen', location: 'Leeds, UK', country: 'United Kingdom', level: 'Level 1 Coaching', cert: 'Fundamentals of Coaching Strongman', speciality: 'Personal Trainer', status: 'Certified', certYear: '2024', initials: 'SC', colour: '#A41C64', lat: 53.8008, lng: -1.5491 },
  { id: 'marcus-webb', name: 'Marcus Webb', location: 'London, UK', country: 'United Kingdom', level: 'Level 1 Refereeing', cert: 'Strongman Refereeing Certification', speciality: 'Competition Judge', status: 'Certified', certYear: '2024', initials: 'MW', colour: '#C0246E', lat: 51.5074, lng: -0.1278 },
  { id: 'ryan-foster', name: 'Ryan Foster', location: 'Edinburgh, UK', country: 'United Kingdom', level: 'Level 1 Coaching', cert: 'Fundamentals of Coaching Strongman', speciality: 'Armed Forces Fitness', status: 'Certified', certYear: '2024', initials: 'RF', colour: '#E19A47', lat: 55.9533, lng: -3.1883 },
];

const LEVEL_COLOURS: Record<string, string> = {
  'Level 1 Coaching': '#A41C64',
  'Level 1 Refereeing': '#E19A47',
  'StrongKidz': '#C0246E',
};

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
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            Coach not found
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
            This coach profile doesn't exist or hasn't been published yet.
          </p>
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ── Main Profile Page ──────────────────────────────────────────────── */
export default function CoachProfile() {
  const { slug } = useParams<{ slug: string }>();
  const coach = COACHES.find(c => c.id === slug);

  if (!coach) return <CoachNotFound />;

  const levelColour = LEVEL_COLOURS[coach.level] ?? '#A41C64';

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
          paddingTop: 'calc(var(--navbar-height, 72px) + 48px)',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {/* Breadcrumb */}
          <div style={{ marginBottom: '28px' }}>
            <Link
              to="/coaches"
              style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', textDecoration: 'none' }}
            >
              ← Coach Directory
            </Link>
          </div>

          {/* Hero content */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Initials circle */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${coach.colour}CC, ${coach.colour}55)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.05em',
                flexShrink: 0,
                boxShadow: `0 0 40px ${coach.colour}40`,
              }}
            >
              {coach.initials}
            </div>

            <div>
              <h1
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: '6px',
                  lineHeight: 1.2,
                }}
              >
                {coach.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
                  📍 {coach.location}
                </span>
                <span
                  style={{
                    background: `${levelColour}22`,
                    border: `1px solid ${levelColour}55`,
                    color: levelColour,
                    borderRadius: '6px',
                    padding: '3px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {coach.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2-column body ─────────────────────────────────────────── */}
      <section style={{ padding: '48px 0 80px' }}>
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 320px',
            gap: '24px',
          }}
        >
          {/* ── Left: Bio card ────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              className="es-card"
              style={{
                background: '#131316',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '28px',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                About {coach.name}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.8 }}>
                Coach profile coming soon. Verified coaches will be able to add their biography, contact details, and coaching specialities to their profile.
              </p>

              {/* Speciality tag */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '12px',
                  }}
                >
                  {coach.speciality}
                </span>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '12px',
                  }}
                >
                  {coach.country}
                </span>
              </div>
            </div>

            {/* VIRES note card */}
            <div
              style={{
                background: '#0E0E12',
                border: '1px solid rgba(164,28,100,0.12)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>🔗</span>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', lineHeight: 1.7, margin: 0 }}>
                Coach profiles will connect with VIRES Coach professional profiles for full coaching history and client bookings.
              </p>
            </div>
          </div>

          {/* ── Right: Certification card ─────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              className="es-card"
              style={{
                background: '#131316',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '20px',
                }}
              >
                Certification
              </h3>

              {/* Cert name */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '4px' }}>Qualification</div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>
                  {coach.cert}
                </div>
              </div>

              {/* Level */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '4px' }}>Level</div>
                <span
                  style={{
                    display: 'inline-block',
                    background: `${levelColour}22`,
                    border: `1px solid ${levelColour}55`,
                    color: levelColour,
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {coach.level}
                </span>
              </div>

              {/* Year */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '4px' }}>Certified</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{coach.certYear}</div>
              </div>

              {/* Verified badge */}
              <div
                style={{
                  background: 'rgba(74,222,128,0.08)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#4ADE80', fontSize: '14px' }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 500 }}>
                  Verified by Educate.Strong Academy
                </span>
              </div>
            </div>

            {/* Back link */}
            <Link
              to="/coaches"
              style={{
                display: 'block',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '13px',
                textDecoration: 'none',
                padding: '8px',
              }}
            >
              ← Back to all coaches
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
