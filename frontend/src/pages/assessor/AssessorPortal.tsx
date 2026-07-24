import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import EmailVerificationBanner from '../../components/layout/EmailVerificationBanner';
import api from '../../lib/api';

type Status = 'PENDING' | 'IN_REVIEW' | 'PASSED' | 'FAILED' | 'REFERRED' | 'NEEDS_CHANGES';

interface Submission {
  id: string;
  status: Status;
  content?: string;
  fileUrl?: string;
  feedback?: string;
  score?: number;
  submittedAt: string;
  gradedAt?: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  assessment: { id: string; title: string; type: string; courseId?: string; course?: { title: string; slug: string } };
}

const STATUS_CONFIG: Record<Status, { label: string; cls: string }> = {
  PENDING:       { label: 'Awaiting Review', cls: 'badge-accent' },
  IN_REVIEW:     { label: 'In Review',       cls: 'badge-accent' },
  PASSED:        { label: 'Passed',          cls: 'badge-grey' },
  FAILED:        { label: 'Failed',          cls: 'badge-amber' },
  REFERRED:      { label: 'Referred',        cls: 'badge-amber' },
  NEEDS_CHANGES: { label: 'Needs Changes',   cls: 'badge-amber' },
};

const FILTER_TABS = ['All', 'Pending', 'In Review', 'Completed'] as const;
type FilterTab = typeof FILTER_TABS[number];

function ReviewModal({ sub, onClose, onGraded }: {
  sub: Submission; onClose: () => void; onGraded: (id: string, status: Status, feedback: string) => void;
}) {
  const [status, setStatus] = useState<Status>(sub.status === 'PENDING' ? 'IN_REVIEW' : sub.status);
  const [feedback, setFeedback] = useState(sub.feedback || '');
  const [score, setScore] = useState<string>(sub.score?.toString() || '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSave = async () => {
    setSaving(true); setErr('');
    try {
      await api.patch(`/assessments/submissions/${sub.id}`, {
        status, feedback: feedback.trim() || undefined,
        score: score ? parseInt(score, 10) : undefined,
      });
      onGraded(sub.id, status, feedback);
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to save. Try again.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden mb-8" style={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }}>
        {/* Header */}
        <div className="flex items-start justify-between p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(135deg, rgba(164,28,100,0.12), transparent)' }}>
          <div>
            <p className="es-label mb-1">{sub.assessment.course?.title || 'Assessment'}</p>
            <h2 className="text-xl font-black text-white">{sub.assessment.title}</h2>
            <p className="text-sm text-es-muted mt-1">{sub.user.firstName} {sub.user.lastName} · {sub.user.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded text-es-muted hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Submission content */}
          {sub.content && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-es-muted mb-2">Learner's Submission</p>
              <div className="rounded-lg p-4 text-sm text-es-muted leading-relaxed" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.07)', maxHeight: '220px', overflowY: 'auto' }}>
                {sub.content}
              </div>
            </div>
          )}
          {!sub.content && (
            <div className="rounded-lg p-4" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-sm text-es-subtle">No written content — this assessment may be a knowledge exam or practical observation.</p>
            </div>
          )}

          {/* Decision */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-es-muted mb-2">Decision</p>
            <div className="flex flex-wrap gap-2">
              {(['IN_REVIEW', 'PASSED', 'FAILED', 'REFERRED', 'NEEDS_CHANGES'] as Status[]).map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${status === s ? 'text-white border-transparent' : 'text-es-muted border-es-grey-dark hover:text-white'}`}
                  style={status === s ? { background: s === 'PASSED' ? '#22C55E' : s === 'FAILED' ? '#EF4444' : '#A41C64' } : {}}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Score */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-es-muted mb-2">Score (optional) %</p>
            <input type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value)}
              placeholder="0 – 100" className="w-32 px-3 py-2 rounded text-sm text-white focus:outline-none"
              style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.10)' }} />
          </div>

          {/* Feedback */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-es-muted mb-2">Feedback to learner</p>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={6}
              placeholder="Write detailed feedback explaining your decision. This will be visible to the learner."
              className="w-full text-sm text-white placeholder-es-subtle rounded-lg p-4 resize-y focus:outline-none"
              style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.10)' }} />
          </div>

          {err && <p className="text-xs text-red-400">{err}</p>}

          <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Decision'}
            </button>
            <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessorPortal() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('All');
  const [reviewing, setReviewing] = useState<Submission | null>(null);

  const load = () => {
    setLoading(true);
    api.get('/assessor/submissions')
      .then(r => { setSubmissions(r.data.submissions || []); setStats(r.data.stats || {}); })
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = submissions.filter(s => {
    if (filter === 'Pending') return ['PENDING'].includes(s.status);
    if (filter === 'In Review') return ['IN_REVIEW'].includes(s.status);
    if (filter === 'Completed') return ['PASSED', 'FAILED', 'REFERRED'].includes(s.status);
    return true;
  });

  const handleGraded = (id: string, status: Status, feedback: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status, feedback, gradedAt: new Date().toISOString() } : s));
    setStats(prev => {
      const copy = { ...prev };
      const old = submissions.find(s => s.id === id)?.status;
      if (old) copy[old] = Math.max(0, (copy[old] || 0) - 1);
      copy[status] = (copy[status] || 0) + 1;
      return copy;
    });
  };

  const totalPending = (stats['PENDING'] || 0) + (stats['IN_REVIEW'] || 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />
      <div className="pt-navbar" style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
        <div className="es-container py-8">
          <EmailVerificationBanner />
          <p className="es-label mb-2">Staff Area</p>
          <h1 className="text-3xl font-black text-white">Assessor Portal</h1>
          <p className="text-es-muted mt-1">Review and grade learner submissions.</p>
        </div>
      </div>

      <div className="es-container py-8 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Awaiting Review', value: totalPending, accent: true },
            { label: 'Passed', value: stats['PASSED'] || 0 },
            { label: 'Needs Changes', value: (stats['NEEDS_CHANGES'] || 0) + (stats['FAILED'] || 0) },
            { label: 'Total Submissions', value: submissions.length },
          ].map(stat => (
            <div key={stat.label} className="es-card p-5" style={stat.accent ? { borderTop: '2px solid #A41C64' } : {}}>
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-sm text-es-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {FILTER_TABS.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${filter === t ? 'text-white' : 'text-es-muted hover:text-white'}`}
              style={filter === t ? { background: '#A41C64' } : {}}>
              {t}
            </button>
          ))}
        </div>

        {/* Queue */}
        <div className="es-card overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="font-black text-white">Submission Queue</h2>
            <span className="badge-grey">{filtered.length} {filter === 'All' ? 'total' : filter.toLowerCase()}</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-es-muted font-medium mb-1">
                {submissions.length === 0 ? 'No submissions yet.' : `No items in ${filter}.`}
              </p>
              <p className="text-es-subtle text-sm">Submissions will appear here when learners submit their coursework.</p>
            </div>
          ) : (
            <div>
              {filtered.map(sub => {
                const sc = STATUS_CONFIG[sub.status];
                return (
                  <div key={sub.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-es-card transition-colors" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={sc.cls}>{sc.label}</span>
                        {sub.assessment.course && <span className="text-xs text-es-subtle">{sub.assessment.course.title}</span>}
                      </div>
                      <p className="font-semibold text-white text-sm">{sub.assessment.title}</p>
                      <p className="text-xs text-es-subtle mt-0.5">
                        {sub.user.firstName} {sub.user.lastName} ·{' '}
                        {new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {sub.gradedAt && ` · Graded ${new Date(sub.gradedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                      </p>
                    </div>
                    <button onClick={() => setReviewing(sub)} className="btn-primary text-xs py-2 px-4 flex-shrink-0">
                      {sub.status === 'PENDING' ? 'Review' : sub.status === 'IN_REVIEW' ? 'Continue' : 'View'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {reviewing && (
        <ReviewModal
          sub={reviewing}
          onClose={() => setReviewing(null)}
          onGraded={handleGraded}
        />
      )}

      <Footer />
    </div>
  );
}
