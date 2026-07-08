import { Link } from 'react-router-dom';
import PreviewBanner from '../../components/preview/PreviewBanner';

/*
 * Internal QA tooling — /portal-preview
 * Not linked anywhere in the public site nav. Lets the team see what each
 * portal looks like without a real login. No auth, no API calls, no
 * database writes anywhere under /portal-preview/*.
 */
const TAGS = ['Preview only', 'No real account data', 'No database actions'];

const PORTALS = [
  { to: '/portal-preview/learner', label: 'Learner Portal', desc: 'Dashboard, courses, coursework, documents, CPD and certificates.' },
  { to: '/portal-preview/coach', label: 'Coach Workspace', desc: 'Assigned students, progress, alerts, resources, notes and profile.' },
  { to: '/portal-preview/tutor', label: 'Tutor Workspace', desc: 'Assigned courses and groups, teaching resources, notes and profile.' },
  { to: '/portal-preview/assessor', label: 'Assessor Portal', desc: 'Review queue with sample submissions and a full review panel.' },
  { to: '/portal-preview/admin', label: 'Admin Area', desc: 'Grouped management areas and a Register Interest enquiry pipeline.' },
];

export default function PortalPreviewHub() {
  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <PreviewBanner />
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '56px 24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Internal preview
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px' }}>Portal Previews</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '32px', maxWidth: '560px' }}>
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
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 12px' }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {TAGS.map(tag => (
                  <span key={tag} style={{ fontSize: '10px', fontWeight: 700, color: '#E19A47', background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.25)', borderRadius: '999px', padding: '3px 9px', letterSpacing: '0.02em' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
