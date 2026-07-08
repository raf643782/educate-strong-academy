import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import { ProfileIcon, BackIcon } from '../workspace/icons';

/*
 * Coach Profile placeholder — shared between the real /coach/profile
 * page and /portal-preview/coach/profile. `basePath` controls where
 * "back to workspace" points.
 */
export default function CoachProfileBody({ basePath }: { basePath: string }) {
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
            <BackIcon /> Back to Coach Workspace
          </Link>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Coach Profile
          </p>
          <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800, margin: 0 }}>
            Manage your coach profile
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px 56px' }}>
        <div style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.1)', borderRadius: '14px', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ color: '#A41C64', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <ProfileIcon />
          </div>
          <p style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>
            Your profile isn't set up yet.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
            Once enabled, you'll be able to manage your display name, bio, specialities and photo here —
            the same details shown on your public coach directory listing.
          </p>
        </div>
      </div>
    </div>
  );
}
