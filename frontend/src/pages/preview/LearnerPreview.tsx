import PreviewBanner from '../../components/preview/PreviewBanner';

/*
 * Internal QA tooling — /portal-preview/learner
 * A static visual mirror of pages/learner/Dashboard.tsx. Deliberately does
 * NOT reuse Dashboard.tsx directly — that page calls useAuth() and live
 * API endpoints (/courses/my, /certificates/my) which would break or
 * error with no session. Every value here is hardcoded and labelled
 * [PREVIEW] — nothing here is fetched, stored, or real.
 */
export default function LearnerPreview() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <PreviewBanner />

      <div style={{ background: 'radial-gradient(ellipse 100% 80% at 50% -20%, rgba(164,28,100,0.18) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
        <div className="es-container py-8">
          <p className="es-label mb-1">Dashboard · Preview</p>
          <h1 className="text-2xl font-black text-white">Welcome back, [PREVIEW] Learner</h1>
          <p className="text-es-muted text-sm mt-1">Continue your professional development.</p>
        </div>
      </div>

      <div className="es-section flex-1">
        <div className="es-container">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Main */}
            <div className="lg:col-span-2 space-y-8">

              {/* My Courses */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-white">My Courses</h2>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Browse catalogue →</span>
                </div>
                <div className="es-card-hover p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 mb-2">
                        <span className="badge-accent">Coaching</span>
                        <span className="badge-grey">Level 1</span>
                      </div>
                      <h3 className="font-bold text-white text-sm leading-snug mb-2">[PREVIEW] Level 1 Fundamentals of Coaching Strongman</h3>
                      <div className="h-1.5 bg-es-grey rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full" style={{ width: '40%', background: '#A41C64' }} />
                      </div>
                      <p className="text-xs text-es-subtle">4/10 lessons</p>
                    </div>
                    <span className="btn-primary text-xs py-2 px-4 flex-shrink-0" style={{ opacity: 0.6, cursor: 'default' }}>Continue</span>
                  </div>
                </div>
              </section>

              {/* Coursework */}
              <section>
                <h2 className="text-lg font-bold text-white mb-4">Coursework</h2>
                <div className="es-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="badge-accent mb-2 inline-block">Written Scenario</span>
                      <h3 className="font-bold text-white text-sm">[PREVIEW] Athlete Screening Assignment</h3>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#E19A47', background: 'rgba(225,154,71,0.12)', padding: '4px 10px', borderRadius: '999px' }}>PENDING REVIEW</span>
                  </div>
                  <p className="text-es-muted text-sm">Sample submission text shown for layout purposes only. Not a real submission.</p>
                </div>
              </section>

              {/* Documents */}
              <section>
                <h2 className="text-lg font-bold text-white mb-4">Documents</h2>
                <div className="es-card p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">[PREVIEW] Session Plan Template</h3>
                    <p className="text-xs text-es-subtle">RESOURCE · PDF</p>
                  </div>
                  <span className="btn-primary text-xs py-2 px-4" style={{ opacity: 0.6, cursor: 'default' }}>Download</span>
                </div>
              </section>

            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* CPD */}
              <div className="es-card p-5">
                <p className="es-label mb-3">CPD Overview · Preview</p>
                <p className="text-3xl font-black text-white mb-1">2.5</p>
                <p className="text-xs text-es-muted mb-3">[PREVIEW] hours logged this year</p>
                <span className="text-xs font-semibold" style={{ color: '#A41C64' }}>View CPD log →</span>
              </div>

              {/* Certificates */}
              <div className="es-card p-5">
                <p className="es-label mb-3">Certificates · Preview</p>
                <p className="text-xs text-es-muted mb-3">
                  Certificates will appear here once your course completion has been reviewed and approved by EducateStrong.
                </p>
                <span className="text-xs font-semibold" style={{ color: '#A41C64' }}>View certificates →</span>
              </div>

              {/* Quick links */}
              <div>
                <p className="es-label mb-3">Quick Links</p>
                <div className="space-y-2">
                  {['Knowledge Hub', 'Exercise Library', 'Event Library'].map(label => (
                    <div key={label} className="flex items-center justify-between es-card p-3.5">
                      <p className="text-sm font-semibold text-white">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
