import { Link } from 'react-router-dom';

/*
 * Internal QA tooling — shown at the top of every /portal-preview/* page.
 * These pages are read-only visual previews, never a signed-in session
 * and never real learner, coach, tutor, assessor or admin data.
 *
 * z-index/minHeight: the real Navbar is `position: fixed` with z-50 at a
 * 64px height (--navbar-height). CoachPreview/TutorPreview render that
 * real Navbar underneath this banner, so this banner must sit at a
 * higher z-index and be at least as tall, or the fixed Navbar paints
 * over it and the required warning becomes invisible.
 */
export default function PreviewBanner() {
  return (
    <div
      role="note"
      style={{
        position: 'relative',
        zIndex: 60,
        minHeight: '64px',
        background: '#151006',
        borderBottom: '1px solid rgba(225,154,71,0.3)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        textAlign: 'center',
      }}
    >
      <span style={{ color: '#E19A47', fontSize: '13px', fontWeight: 700 }}>
        Preview only. This is not a signed in account and does not show real learner, coach, assessor or admin data.
      </span>
      <Link to="/portal-preview" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 600, textDecoration: 'underline' }}>
        Back to preview menu
      </Link>
    </div>
  );
}
