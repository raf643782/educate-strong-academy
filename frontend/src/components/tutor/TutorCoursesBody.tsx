import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import { FolderIcon, BackIcon } from '../workspace/icons';

/*
 * Assigned Courses and Groups — shared between the real
 * /tutor/courses page and /portal-preview/tutor/courses.
 */
export default function TutorCoursesBody({ basePath }: { basePath: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />

      <div style={{
        background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506',
        borderBottom: '1px solid rgba(194,24,106,0.08)',
        paddingTop: 'calc(var(--navbar-height,72px) + 24px)',
        paddingBottom: '24px',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}>
          <Link to={basePath} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', marginBottom: '14px' }}>
            <BackIcon /> Back to Tutor Workspace
          </Link>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Assigned Courses and Groups
          </p>
          <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
            Your courses and learner groups
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px 56px' }}>
        <div style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.1)', borderRadius: '14px', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ color: '#A41C64', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <FolderIcon />
          </div>
          <p style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>
            No assigned courses or groups yet.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
            Once EducateStrong assigns you to a course, you'll see the course title, your learner group,
            learner count and next session date here.
          </p>
        </div>
      </div>
    </div>
  );
}
