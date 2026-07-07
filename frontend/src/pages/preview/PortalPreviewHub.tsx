import { Link } from 'react-router-dom';
import PreviewBanner from '../../components/preview/PreviewBanner';

/*
 * Internal QA tooling — /portal-preview
 * Not linked anywhere in the public site nav. Lets the team see what each
 * portal looks like without a real login. No auth, no API calls, no
 * database writes anywhere under /portal-preview/*.
 */
const PORTALS = [
  { to: '/portal-preview/learner', label: 'Preview Learner Portal', desc: 'Dashboard, courses, coursework, documents, CPD, certificates' },
  { to: '/portal-preview/coach', label: 'Preview Coach Portal', desc: 'Placeholder — reuses the real coach workspace shell' },
  { to: '/portal-preview/tutor', label: 'Preview Tutor Portal', desc: 'Placeholder — reuses the real tutor workspace shell' },
  { to: '/portal-preview/assessor', label: 'Preview Assessor Portal', desc: 'Review queue layout with sample submissions' },
  { to: '/portal-preview/admin', label: 'Preview Admin Portal', desc: 'Dashboard layout — visual only, no real admin actions' },
];

export default function PortalPreviewHub() {
  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <PreviewBanner />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '56px 24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Internal preview
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px' }}>Portal Previews</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '32px', maxWidth: '520px' }}>
          Pick a portal to see what it looks like. These are read-only visual previews —
          no login, no database writes, no real accounts or data involved.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PORTALS.map(p => (
            <Link
              key={p.to}
              to={p.to}
              style={{
                display: 'block',
                background: '#151519',
                border: '1px solid rgba(194,24,106,0.12)',
                borderRadius: '12px',
                padding: '18px 20px',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(194,24,106,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(194,24,106,0.12)'; }}
            >
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '15px', marginBottom: '4px' }}>{p.label}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
