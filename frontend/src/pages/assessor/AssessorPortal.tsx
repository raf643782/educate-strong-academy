import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const PLACEHOLDER_STATS = [
  { label: 'Pending Review', value: 0, colour: 'text-amber-600' },
  { label: 'In Review', value: 0, colour: 'text-blue-600' },
  { label: 'Completed This Month', value: 0, colour: 'text-green-600' },
  { label: 'Avg Turnaround', value: '—', colour: 'text-gray-600' },
];

export default function AssessorPortal() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      <div className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="es-label mb-2">Staff Area</p>
          <h1 className="text-3xl font-black text-white mb-2">Assessor Portal</h1>
          <p className="text-es-muted">Review and grade learner submissions for coaching qualifications.</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Stage 2 banner */}
          <div className="es-card p-5 mb-8 flex items-start gap-4" style={{ borderLeft: '3px solid #A41C64' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(164,28,100,0.1)' }}>
              <svg className="w-5 h-5" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-white mb-1">Assessor tools — Stage 2</h3>
              <p className="text-es-muted text-sm">
                Full submission review, video assessment, rubric scoring, and feedback tools will be available in Stage 2.
                The submission workflow and grading interface are being built alongside the assessment system.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PLACEHOLDER_STATS.map(stat => (
              <div key={stat.label} className="es-card p-5">
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-sm text-es-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Queue placeholder */}
          <div className="es-card overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #2C2C2C' }}>
              <h2 className="font-black text-white">Submission Queue</h2>
              <span className="badge-grey">0 pending</span>
            </div>
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#2A2A2A' }}>
                <svg className="w-8 h-8 text-es-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-black text-es-muted mb-2">No submissions yet</h3>
              <p className="text-es-subtle text-sm max-w-sm mx-auto">
                When learners submit assessments for review, they will appear here for you to grade and provide feedback.
              </p>
            </div>
          </div>

          {/* What's coming */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { title: 'Written Scenario Review', desc: 'Read and grade written coaching scenario submissions with structured rubrics.' },
              { title: 'Video Assessment', desc: 'Watch uploaded coaching observation videos and complete competency sign-off forms.' },
              { title: 'Feedback and Results', desc: 'Send detailed feedback to learners and trigger certificate issuance on passing.' },
            ].map(item => (
              <div key={item.title} className="es-card p-5" style={{ borderStyle: 'dashed' }}>
                <h3 className="font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-es-muted">{item.desc}</p>
                <span className="badge-grey inline-block mt-3">Stage 2</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
