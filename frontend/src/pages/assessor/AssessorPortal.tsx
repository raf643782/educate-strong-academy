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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <p className="text-amber-600 text-sm font-medium mb-1 uppercase tracking-wide">Staff Area</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessor Portal</h1>
            <p className="text-gray-600">Review and grade learner submissions for coaching qualifications.</p>
          </div>

          {/* Stage 2 banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Assessor tools — Stage 2</h3>
              <p className="text-blue-700 text-sm">
                Full submission review, video assessment, rubric scoring, and feedback tools will be available in Stage 2.
                The submission workflow and grading interface are being built alongside the assessment system.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PLACEHOLDER_STATS.map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className={`text-3xl font-bold ${stat.colour} mb-1`}>{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Queue placeholder */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Submission Queue</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">0 pending</span>
            </div>
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">No submissions yet</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
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
              <div key={item.title} className="bg-white rounded-xl border border-dashed border-gray-300 p-5">
                <h3 className="font-semibold text-gray-700 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
                <span className="inline-block mt-3 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Stage 2</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
