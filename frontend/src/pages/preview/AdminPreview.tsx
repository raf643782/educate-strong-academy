import PreviewBanner from '../../components/preview/PreviewBanner';

/*
 * Internal QA tooling — /portal-preview/admin
 * A static visual mirror of pages/admin/AdminDashboard.tsx. Deliberately
 * does NOT reuse that component — it calls GET /admin/stats, and its
 * Quick Actions grid links straight into the real protected /admin/*
 * pages (Users, Courses, Certificates, etc.), which must never be
 * reachable from an unauthenticated preview.
 *
 * Every number below is hardcoded and labelled [PREVIEW]. The nav grid
 * renders as inert cards (not links) — nothing here creates, edits,
 * deletes, disables, enrols, or issues anything, and there is no path
 * from this page into a real admin route.
 */

const STAT_CARDS = [
  { label: 'Total Learners', value: '[PREVIEW] 42' },
  { label: 'Active Courses', value: '[PREVIEW] 3' },
  { label: 'Total Enrolments', value: '[PREVIEW] 51' },
  { label: 'Certificates Issued', value: '[PREVIEW] 12' },
  { label: 'Pending Submissions', value: '[PREVIEW] 2' },
];

const NAV_CARDS = [
  { label: 'Manage Courses', desc: 'View, edit, and publish courses' },
  { label: 'Users', desc: 'View and manage user accounts and roles' },
  { label: 'Enrolments', desc: 'Manage course enrolments' },
  { label: 'Certificates', desc: 'Issue and revoke certificates' },
  { label: 'Cohorts', desc: 'Manage course dates and event cohorts' },
  { label: 'Register Interest', desc: 'View and action incoming interest enquiries' },
  { label: 'Documents', desc: 'Manage course documents and resources' },
  { label: 'Assessments', desc: 'Manage assessment records' },
  { label: 'Assessor Portal', desc: 'Review learner submissions' },
];

export default function AdminPreview() {
  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <PreviewBanner />

      <div style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Admin Area · Preview
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>Platform Overview</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {STAT_CARDS.map(stat => (
            <div key={stat.label} style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Nav grid — inert, visual only, no navigation */}
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          {NAV_CARDS.map(card => (
            <div
              key={card.label}
              style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px', cursor: 'default' }}
            >
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{card.label}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          Navigation is visual only in this preview — no admin actions are performed here, and these cards do not link anywhere.
        </p>

      </div>
    </div>
  );
}
