import PreviewBanner from '../../components/preview/PreviewBanner';

/*
 * Internal QA tooling — /portal-preview/admin
 * A static visual mirror of pages/admin/AdminDashboard.tsx. Deliberately
 * does NOT reuse that component — it calls GET /admin/stats, and its
 * Quick Actions grid links straight into the real protected /admin/*
 * pages (Users, Courses, Certificates, etc.), which must never be
 * reachable from an unauthenticated preview.
 *
 * Every number below is hardcoded and labelled [PREVIEW]. All cards
 * render as inert (not links) — nothing here creates, edits, deletes,
 * disables, enrols, or issues anything, and there is no path from this
 * page into a real admin route.
 */

const STAT_CARDS = [
  { label: 'Total Learners', value: 42, featured: true },
  { label: 'Active Courses', value: 3 },
  { label: 'Total Enrolments', value: 51 },
  { label: 'Certificates Issued', value: 12 },
  { label: 'Pending Submissions', value: 2 },
];

const MANAGEMENT_GROUPS = [
  {
    title: 'Content & Courses',
    cards: [
      { label: 'Manage Courses', desc: 'View, edit, and publish courses' },
      { label: 'Documents', desc: 'Manage course documents and resources' },
      { label: 'Cohorts', desc: 'Manage course dates and event cohorts' },
    ],
  },
  {
    title: 'People & Enrolment',
    cards: [
      { label: 'Users', desc: 'View and manage user accounts and roles' },
      { label: 'Enrolments', desc: 'Manage course enrolments' },
    ],
  },
  {
    title: 'Review & Certification',
    cards: [
      { label: 'Assessments', desc: 'Manage assessment records' },
      { label: 'Assessor Portal', desc: 'Review learner submissions' },
      { label: 'Certificates', desc: 'Issue and revoke certificates' },
    ],
  },
];

const PIPELINE_STAGES = [
  { label: 'New', value: 6 },
  { label: 'Contacted', value: 3 },
  { label: 'Ready to Enrol', value: 2 },
  { label: 'Needs Follow-up', value: 1 },
  { label: 'Archived / Closed', value: 4 },
];

function NavCard({ label, desc }: { label: string; desc: string }) {
  return (
    <div style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px', cursor: 'default' }}>
      <p style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{desc}</p>
    </div>
  );
}

export default function AdminPreview() {
  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <PreviewBanner />

      <div style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.2) 0%, transparent 55%), #050506', borderBottom: '1px solid rgba(194,24,106,0.1)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#E19A47', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Admin Area · Preview
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>Platform Control Centre</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '6px 0 0', maxWidth: '560px' }}>
            A visual preview of the admin dashboard — grouped management areas, no live data, no real actions.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 24px 56px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {STAT_CARDS.map(stat => (
            <div
              key={stat.label}
              style={{
                background: stat.featured ? 'linear-gradient(160deg, rgba(164,28,100,0.18), rgba(124,58,237,0.1))' : '#151519',
                border: stat.featured ? '1px solid rgba(164,28,100,0.35)' : '1px solid rgba(255,255,255,0.07)',
                borderTop: stat.featured ? '2px solid #A41C64' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#E19A47', letterSpacing: '0.05em', marginBottom: '6px' }}>[PREVIEW]</p>
              <p style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Management groups */}
        {MANAGEMENT_GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: '14px', paddingLeft: '12px',
              borderLeft: '3px solid transparent',
              borderImage: 'linear-gradient(180deg, #A41C64, #7C3AED) 1',
              color: 'rgba(255,255,255,0.7)',
            }}>
              {group.title}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {group.cards.map(card => <NavCard key={card.label} {...card} />)}
            </div>
          </div>
        ))}

        {/* Register Interest — enquiry pipeline */}
        <div>
          <h2 style={{
            fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '14px', paddingLeft: '12px',
            borderLeft: '3px solid transparent',
            borderImage: 'linear-gradient(180deg, #A41C64, #7C3AED) 1',
            color: 'rgba(255,255,255,0.7)',
          }}>
            Enquiries
          </h2>
          <div style={{
            background: 'linear-gradient(135deg, rgba(164,28,100,0.1), rgba(124,58,237,0.06))',
            border: '1px solid rgba(164,28,100,0.25)',
            borderRadius: '14px',
            padding: '22px',
          }}>
            <p style={{ fontWeight: 700, color: '#fff', fontSize: '15px', marginBottom: '6px' }}>Register Interest</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', maxWidth: '520px' }}>
              Track incoming course interest, follow-up status and enrolment readiness.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
              {PIPELINE_STAGES.map((stage, i) => (
                <div
                  key={stage.label}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTop: `2px solid ${i === 0 ? '#A41C64' : i === PIPELINE_STAGES.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(164,28,100,0.4)'}`,
                    borderRadius: '10px',
                    padding: '14px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{stage.value}</p>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', margin: 0, letterSpacing: '0.02em' }}>{stage.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '28px' }}>
          Preview only. No real admin actions are performed here, and these cards do not link anywhere.
        </p>

      </div>
    </div>
  );
}
