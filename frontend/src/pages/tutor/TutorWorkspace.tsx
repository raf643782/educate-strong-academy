import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

/*
 * Tutor Workspace — placeholder
 *
 * BACKEND RELATIONSHIP NEEDED:
 * - Add TUTOR role to the Role enum in schema.prisma
 * - Add tutor-specific endpoints (assigned courses, learner groups, session notes)
 * - Update ProtectedRoute guard here to roles={['TUTOR', 'ADMIN']}
 *
 * Until the TUTOR role exists, access is restricted to ADMIN for preview.
 */

const COMING_FEATURES = [
  'View assigned courses and learner groups',
  'Access teaching resources and session materials',
  'Add session notes and learner feedback',
  'Track learner progress through your assigned courses',
  'Manage your tutor profile',
];

export default function TutorWorkspace() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', color: '#fff' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: '#141414',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 'calc(var(--navbar-height,72px) + 24px)',
        paddingBottom: '24px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Tutor Workspace
          </p>
          <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800, margin: '0 0 6px' }}>
            Welcome to your Tutor Workspace
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>
            Tutor tools are being built. This workspace will be your hub for teaching, session management, and learner support.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Empty state */}
        <div style={{
          background: '#1A1A1A',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          overflow: 'hidden',
          marginBottom: '24px',
        }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Assigned Courses</span>
          </div>
          <div style={{ padding: '56px 24px', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>
              No courses assigned yet.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
              When courses are assigned to you, they will appear here along with your learner groups and session materials.
            </p>
          </div>
        </div>

        {/* Coming soon features */}
        <div style={{
          background: '#1A1A1A',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Coming to this workspace
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {COMING_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(164,28,100,0.6)', marginTop: '5px', flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
          <Link to="/" style={{ color: 'rgba(164,28,100,0.8)', textDecoration: 'none', fontWeight: 600 }}>Return to site</Link>
        </p>

      </div>
    </div>
  );
}
