import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

/*
 * Coach Workspace — placeholder
 *
 * COACH role is now in the schema. When the platform is ready to onboard coaches,
 * the following backend work is still needed:
 * - Add a CoachAssignment model (coachId → learnerId, optional courseId)
 * - Add GET /api/coach/students endpoint returning assigned learners + progress
 * - Expose assignment management in the admin panel
 */

const COMING_FEATURES = [
  'View assigned students and their course progress',
  'See incomplete lessons, submitted assessments, and earned certificates',
  'Send guidance notes and check-ins to learners',
  'Assign recommended courses to individual students',
  'Manage your public coach profile',
];

export default function CoachWorkspace() {
  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506',
        borderBottom: '1px solid rgba(194,24,106,0.08)',
        paddingTop: 'calc(var(--navbar-height,72px) + 24px)',
        paddingBottom: '24px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Coach Workspace
          </p>
          <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800, margin: '0 0 6px' }}>
            Welcome to your Coach Workspace
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>
            Coach tools are being built. This workspace will be your hub for managing students and tracking their progress.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Students panel — honest empty state */}
        <div style={{
          background: '#151519',
          border: '1px solid rgba(194,24,106,0.08)',
          borderRadius: '14px',
          overflow: 'hidden',
          marginBottom: '24px',
        }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Assigned Students</span>
          </div>
          <div style={{ padding: '56px 24px', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>
              No students assigned yet.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
              When learners are assigned to you, they will appear here with course progress,
              assessment status, and support actions.
            </p>
          </div>
        </div>

        {/* Coming soon features */}
        <div style={{
          background: '#151519',
          border: '1px solid rgba(194,24,106,0.08)',
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

        {/* Nav back */}
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
          <Link to="/" style={{ color: 'rgba(164,28,100,0.8)', textDecoration: 'none', fontWeight: 600 }}>Return to site</Link>
          {' '}or{' '}
          <Link to="/coaches" style={{ color: 'rgba(164,28,100,0.8)', textDecoration: 'none', fontWeight: 600 }}>view the coach directory</Link>
        </p>

      </div>
    </div>
  );
}
