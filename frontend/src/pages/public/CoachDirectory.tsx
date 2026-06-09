/**
 * CoachDirectory — Public certified coaches directory page.
 * Route: /coaches
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

/* ── Coach data ──────────────────────────────────────────────────────── */
const COACHES = [
  { id: 'tom-bradley', name: 'Tom Bradley', location: 'Sheffield, UK', country: 'United Kingdom', level: 'Level 1 Coaching', cert: 'Fundamentals of Coaching Strongman', speciality: 'Strength & Conditioning', status: 'Certified', certYear: '2024', initials: 'TB', colour: '#A41C64', lat: 53.3811, lng: -1.4701 },
  { id: 'jessica-park', name: 'Jessica Park', location: 'Manchester, UK', country: 'United Kingdom', level: 'Level 1 Coaching', cert: 'Fundamentals of Coaching Strongman', speciality: 'Gym Owner · PT', status: 'Certified', certYear: '2024', initials: 'JP', colour: '#C0246E', lat: 53.4808, lng: -2.2426 },
  { id: 'daniel-ross', name: 'Daniel Ross', location: 'Birmingham, UK', country: 'United Kingdom', level: 'Level 1 Refereeing', cert: 'Strongman Refereeing Certification', speciality: 'Competition Official', status: 'Certified', certYear: '2024', initials: 'DR', colour: '#E19A47', lat: 52.4862, lng: -1.8904 },
  { id: 'sarah-chen', name: 'Sarah Chen', location: 'Leeds, UK', country: 'United Kingdom', level: 'Level 1 Coaching', cert: 'Fundamentals of Coaching Strongman', speciality: 'Personal Trainer', status: 'Certified', certYear: '2024', initials: 'SC', colour: '#A41C64', lat: 53.8008, lng: -1.5491 },
  { id: 'marcus-webb', name: 'Marcus Webb', location: 'London, UK', country: 'United Kingdom', level: 'Level 1 Refereeing', cert: 'Strongman Refereeing Certification', speciality: 'Competition Judge', status: 'Certified', certYear: '2024', initials: 'MW', colour: '#C0246E', lat: 51.5074, lng: -0.1278 },
  { id: 'ryan-foster', name: 'Ryan Foster', location: 'Edinburgh, UK', country: 'United Kingdom', level: 'Level 1 Coaching', cert: 'Fundamentals of Coaching Strongman', speciality: 'Armed Forces Fitness', status: 'Certified', certYear: '2024', initials: 'RF', colour: '#E19A47', lat: 55.9533, lng: -3.1883 },
];

const FILTERS = ['All', 'Level 1 Coaching', 'Level 1 Refereeing', 'StrongKidz'];

const LEVEL_COLOURS: Record<string, string> = {
  'Level 1 Coaching': '#A41C64',
  'Level 1 Refereeing': '#E19A47',
  'StrongKidz': '#C0246E',
};

/* ── Map marker positions (visual scatter) ─────────────────────────── */
const MAP_MARKERS = [
  { top: '28%', left: '42%' },
  { top: '35%', left: '38%' },
  { top: '45%', left: '48%' },
  { top: '32%', left: '55%' },
  { top: '60%', left: '52%' },
  { top: '18%', left: '44%' },
];

/* ── Coach Card ─────────────────────────────────────────────────────── */
function CoachCard({ coach }: { coach: typeof COACHES[0] }) {
  const [hovered, setHovered] = useState(false);

  const levelColour = LEVEL_COLOURS[coach.level] ?? '#A41C64';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#131316',
        border: hovered
          ? `1px solid ${coach.colour}60`
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '20px',
        transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 32px ${coach.colour}25` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${coach.colour}CC, ${coach.colour}66)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '16px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.05em',
          }}
        >
          {coach.initials}
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '15px', lineHeight: 1.3 }}>
            {coach.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '2px' }}>
            📍 {coach.location}
          </div>
        </div>
      </div>

      {/* Level badge + speciality */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span
          style={{
            display: 'inline-block',
            background: `${levelColour}22`,
            border: `1px solid ${levelColour}55`,
            color: levelColour,
            borderRadius: '6px',
            padding: '2px 10px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            width: 'fit-content',
          }}
        >
          {coach.level}
        </span>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
          {coach.speciality}
        </div>
      </div>

      {/* Certified status row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#4ADE80', fontSize: '10px' }}>✓</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
            Certified {coach.certYear}
          </span>
        </div>
        <Link
          to={`/coaches/${coach.id}`}
          style={{
            color: '#A41C64',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────── */
export default function CoachDirectory() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? COACHES
    : COACHES.filter(c => c.level === activeFilter);

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
            Every coach who completes an Educate.Strong qualification appears in our verified directory. Browse certified coaches and find one near you.
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

      {/* ── Filter Bar ──────────────────────────────────────────────── */}
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
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  background: activeFilter === f ? '#A41C64' : '#1C1C1C',
                  border: activeFilter === f ? '1px solid #A41C64' : '1px solid rgba(255,255,255,0.12)',
                  color: activeFilter === f ? '#fff' : 'rgba(255,255,255,0.55)',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
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
              <option>Name A–Z</option>
              <option>Location</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Map Placeholder ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '300px',
          background: 'linear-gradient(135deg, #0D0D0D, #141414)',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Magenta centre glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '200px',
            background: 'radial-gradient(ellipse, rgba(164,28,100,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Pulsing markers */}
        {MAP_MARKERS.map((m, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: m.top,
              left: m.left,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#A41C64',
              boxShadow: '0 0 0 0 rgba(164,28,100,0.5)',
              animation: `mapPulse 2s ${i * 0.35}s ease-out infinite`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Overlay text */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.25)',
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          Interactive coach map — launching with directory
        </div>

        <style>{`
          @keyframes mapPulse {
            0% { box-shadow: 0 0 0 0 rgba(164,28,100,0.6); }
            70% { box-shadow: 0 0 0 12px rgba(164,28,100,0); }
            100% { box-shadow: 0 0 0 0 rgba(164,28,100,0); }
          }
        `}</style>
      </div>

      {/* ── Coach Cards ─────────────────────────────────────────────── */}
      <section style={{ background: '#0D0D0D', padding: '48px 0 64px' }}>
        <div
          className="es-container"
          style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}
        >
          <div
            style={{
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              {filtered.length} certified coach{filtered.length !== 1 ? 'es' : ''} found
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {filtered.map(coach => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.35)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <p>No coaches found for this filter.</p>
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
              className="btn-primary"
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
              className="btn-secondary"
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
