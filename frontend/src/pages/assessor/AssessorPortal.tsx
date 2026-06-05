import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

type SubmissionStatus = 'PENDING' | 'IN_REVIEW' | 'PASSED' | 'FAILED' | 'REFERRED';

interface Submission {
  id: string;
  status: SubmissionStatus;
  submittedAt: string;
  user: { firstName: string; lastName: string; email: string };
  assessment: { title: string; type: string };
  content: string | null;
  feedback?: string;
}

const DEMO_SUBMISSIONS: Submission[] = [
  {
    id: 'demo-1',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    user: { firstName: 'James', lastName: 'Hargreaves', email: 'james@example.com' },
    assessment: { title: 'Written Coaching Scenario', type: 'WRITTEN_SCENARIO' },
    content: 'The athlete consistently rounds their lower back during the hip hinge setup for the Atlas Stone. I would address this by first...',
  },
  {
    id: 'demo-2',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    user: { firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah@example.com' },
    assessment: { title: 'Knowledge Examination', type: 'KNOWLEDGE_EXAM' },
    content: null,
  },
];

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; colour: string; bg: string }> = {
  PENDING:   { label: 'Pending',   colour: '#E19A47', bg: 'rgba(225,154,71,0.1)' },
  IN_REVIEW: { label: 'In Review', colour: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  PASSED:    { label: 'Passed',    colour: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  FAILED:    { label: 'Failed',    colour: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  REFERRED:  { label: 'Referred',  colour: '#A41C64', bg: 'rgba(164,28,100,0.1)' },
};

type FilterType = 'ALL' | SubmissionStatus;

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="text-xs font-semibold px-2 py-1 rounded" style={{ color: cfg.colour, background: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

export default function AssessorPortal() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selected, setSelected] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    api.get('/assessor/queue')
      .then(res => {
        const data: Submission[] = res.data;
        setSubmissions(data.length > 0 ? data : DEMO_SUBMISSIONS);
      })
      .catch(() => {
        setSubmissions(DEMO_SUBMISSIONS);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (id: string, status: SubmissionStatus) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status, feedback } : s));
    setSelected(null);
    setFeedback('');
  };

  const openReview = (sub: Submission) => {
    setSelected(sub);
    setFeedback(sub.feedback || '');
  };

  const filtered = filter === 'ALL' ? submissions : submissions.filter(s => s.status === filter);

  const counts = {
    pending: submissions.filter(s => s.status === 'PENDING').length,
    inReview: submissions.filter(s => s.status === 'IN_REVIEW').length,
    completed: submissions.filter(s => s.status === 'PASSED' || s.status === 'FAILED').length,
    total: submissions.length,
  };

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'IN_REVIEW', label: 'In Review' },
    { key: 'PASSED', label: 'Completed' },
  ];

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

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Pending Review', value: counts.pending },
              { label: 'In Review', value: counts.inReview },
              { label: 'Completed This Month', value: counts.completed },
              { label: 'Total', value: counts.total },
            ].map(stat => (
              <div key={stat.label} className="es-card p-5">
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-sm text-es-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-2 rounded text-sm font-semibold transition-all"
                style={filter === f.key
                  ? { background: '#A41C64', color: '#fff', border: '1px solid rgba(164,28,100,0.6)' }
                  : { color: '#888', border: '1px solid #2C2C2C' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Queue */}
          <div className="es-card overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #2C2C2C' }}>
              <h2 className="font-black text-white">Submission Queue</h2>
              <span className="badge-grey">{filtered.length} submissions</span>
            </div>

            {loading ? (
              <div className="p-8 space-y-3">
                {[1,2].map(i => <div key={i} className="h-16 rounded animate-pulse" style={{ background: '#1A1A1A' }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-es-muted">No submissions in this category.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#2C2C2C' }}>
                {filtered.map(sub => (
                  <div key={sub.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-white text-sm">
                          {sub.user.firstName} {sub.user.lastName}
                        </p>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p className="text-sm text-es-muted">{sub.assessment.title}</p>
                      <p className="text-xs text-es-subtle mt-0.5">
                        Submitted {new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{sub.user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => openReview(sub)}
                      className="btn-secondary text-xs py-2 px-4 flex-shrink-0"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Review modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setSelected(null); setFeedback(''); } }}
        >
          <div className="w-full max-w-2xl rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2C2C2C' }}>
            {/* Modal header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #2C2C2C' }}>
              <div>
                <p className="es-label mb-1">Submission Review</p>
                <h2 className="font-black text-white">{selected.assessment.title}</h2>
              </div>
              <button
                onClick={() => { setSelected(null); setFeedback(''); }}
                className="text-es-muted hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Learner info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ background: '#A41C64' }}>
                  {selected.user.firstName[0]}{selected.user.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{selected.user.firstName} {selected.user.lastName}</p>
                  <p className="text-xs text-es-muted">{selected.user.email}</p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              {/* Submission content */}
              <div>
                <p className="text-xs font-semibold text-es-subtle uppercase tracking-wider mb-2">Submission Content</p>
                <div className="rounded-lg p-4 text-sm text-es-muted leading-relaxed" style={{ background: '#111', border: '1px solid #2C2C2C' }}>
                  {selected.content
                    ? selected.content
                    : <span className="italic text-es-subtle">No written content — this may be an exam or practical assessment.</span>
                  }
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="text-xs font-semibold text-es-subtle uppercase tracking-wider mb-2 block">
                  Assessor Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Write feedback for the learner..."
                  className="w-full rounded-lg text-sm text-white placeholder-es-subtle p-3 resize-none focus:outline-none focus:ring-1"
                  style={{ background: '#111', border: '1px solid #2C2C2C' }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => updateStatus(selected.id, 'PASSED')}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
                  style={{ background: '#166534' }}
                >
                  Pass
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'FAILED')}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
                  style={{ background: '#7F1D1D' }}
                >
                  Fail
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'REFERRED')}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
                  style={{ background: '#A41C64' }}
                >
                  Refer
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'IN_REVIEW')}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors border"
                  style={{ color: '#60A5FA', borderColor: 'rgba(96,165,250,0.3)', background: 'rgba(96,165,250,0.05)' }}
                >
                  Mark In Review
                </button>
              </div>

              <p className="text-xs text-es-subtle text-center">
                Note: Status updates are local only — backend PATCH endpoint connecting in Phase 2.
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
