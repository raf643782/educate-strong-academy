import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

type SubmissionStatus = 'PENDING' | 'IN_REVIEW' | 'PASSED' | 'FAILED' | 'REFERRED' | 'NEEDS_CHANGES';
interface Submission { id: string; status: SubmissionStatus; content?: string; feedback?: string; score?: number; submittedAt: string; gradedAt?: string; }
interface Assessment { id: string; title: string; description?: string; type: string; passMark: number; maxAttempts: number; isActive: boolean; course?: { id: string; title: string; slug: string }; submissions: Submission[]; }

const STATUS_DISPLAY: Record<string, { label: string; cls: string; color?: string }> = {
  NOT_SUBMITTED: { label: 'Not Submitted',   cls: 'badge-grey' },
  PENDING:       { label: 'Awaiting Review', cls: 'badge-accent' },
  IN_REVIEW:     { label: 'In Review',       cls: 'badge-accent' },
  PASSED:        { label: 'Passed',          cls: 'badge-grey',  color: '#22C55E' },
  FAILED:        { label: 'Failed',          cls: 'badge-amber' },
  REFERRED:      { label: 'Referred',        cls: 'badge-amber' },
  NEEDS_CHANGES: { label: 'Needs Changes',   cls: 'badge-amber' },
};
const TYPE_DISPLAY: Record<string, string> = {
  KNOWLEDGE_EXAM: 'Knowledge Exam', WRITTEN_SCENARIO: 'Written Scenario',
  PROGRAMMING_ASSIGNMENT: 'Programming', PRACTICAL_OBSERVATION: 'Practical',
  JUDGING_SCENARIO: 'Judging', SESSION_PLAN: 'Session Plan',
};

const TABS = ['My Assignments', 'Submitted', 'Completed'] as const;
type Tab = typeof TABS[number];

function SubmitPanel({ assessment, onSubmitted }: { assessment: Assessment; onSubmitted: () => void }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const latest = assessment.submissions[0];
  const canResubmit = !latest || ['NEEDS_CHANGES', 'FAILED', 'REFERRED'].includes(latest.status);
  const isBlocked = latest?.status === 'PASSED' || latest?.status === 'IN_REVIEW' || latest?.status === 'PENDING';

  if (['KNOWLEDGE_EXAM', 'PRACTICAL_OBSERVATION'].includes(assessment.type)) {
    return (
      <div className="rounded-lg p-4 mt-4" style={{ background: 'rgba(225,154,71,0.08)', border: '1px solid rgba(225,154,71,0.2)' }}>
        <p className="text-sm" style={{ color: '#E19A47' }}>
          {assessment.type === 'KNOWLEDGE_EXAM'
            ? 'Knowledge exams are conducted on the in-person course day or via supervised online session. Contact Educate.Strong for details.'
            : 'Practical assessments are conducted on the course day. No online submission required.'}
        </p>
      </div>
    );
  }

  if (isBlocked || !canResubmit) return null;
  if (ok) return (
    <div className="rounded-lg p-4 mt-4 border" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)' }}>
      <p className="text-sm text-white font-semibold">Submission received. Your work is now awaiting assessor review.</p>
    </div>
  );

  const handleSubmit = async () => {
    if (!content.trim()) { setErr('Please write your response before submitting.'); return; }
    setSubmitting(true); setErr('');
    try {
      await api.post(`/assessments/${assessment.id}/submit`, { content });
      setOk(true);
      setTimeout(() => onSubmitted(), 1500);
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="mt-4 space-y-3">
      {latest?.feedback && (
        <div className="rounded-lg p-4" style={{ background: 'rgba(225,154,71,0.08)', border: '1px solid rgba(225,154,71,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#E19A47' }}>Assessor Feedback</p>
          <p className="text-sm text-es-muted">{latest.feedback}</p>
        </div>
      )}
      <div>
        <p className="text-xs text-es-muted mb-2 font-medium">Your written response</p>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={10}
          placeholder="Write your full response here..."
          className="w-full text-sm text-white placeholder-es-subtle rounded-lg p-4 resize-y focus:outline-none"
          style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.10)' }} />
        <p className="text-xs text-es-subtle mt-1">{content.split(/\s+/).filter(Boolean).length} words</p>
      </div>
      <div className="rounded-lg p-4 border-dashed" style={{ border: '1px dashed rgba(255,255,255,0.14)', background: '#111116' }}>
        <p className="text-xs text-es-subtle text-center">
          File attachments are not yet supported. For supporting files email{' '}
          <a href="mailto:educate.strongltd@gmail.com" className="underline" style={{ color: '#A41C64' }}>educate.strongltd@gmail.com</a>
        </p>
      </div>
      {err && <p className="text-xs text-red-400">{err}</p>}
      <div className="flex items-center gap-3">
        <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
          {submitting ? 'Submitting...' : latest ? 'Resubmit' : 'Submit for Review'}
        </button>
        <p className="text-xs text-es-subtle">{assessment.submissions.length} / {assessment.maxAttempts} attempts used</p>
      </div>
    </div>
  );
}

export default function Coursework() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState('');
  const [tab, setTab] = useState<Tab>('My Assignments');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get('/assessments/my')
      .then(r => { setAssessments(r.data); setFetchErr(''); })
      .catch(() => setFetchErr('Could not load assignments. Check your connection or try again.'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const getStatus = (a: Assessment) => a.submissions.length === 0 ? 'NOT_SUBMITTED' : a.submissions[0].status;

  const filtered = assessments.filter(a => {
    const s = getStatus(a);
    if (tab === 'Submitted') return ['PENDING', 'IN_REVIEW', 'NEEDS_CHANGES', 'REFERRED'].includes(s);
    if (tab === 'Completed') return ['PASSED', 'FAILED'].includes(s);
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />
      <div className="pt-navbar" style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
        <div className="es-container py-8">
          <p className="es-label mb-2">Learner Area</p>
          <h1 className="text-3xl font-black text-white">Coursework &amp; Assessments</h1>
          <p className="text-es-muted mt-1 text-sm">Submit assignments and track assessment status.</p>
        </div>
      </div>
      <div className="es-container py-8 flex-1">
        <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${tab === t ? 'text-white' : 'text-es-muted hover:text-white'}`}
              style={tab === t ? { background: '#A41C64' } : {}}>
              {t}
            </button>
          ))}
        </div>

        {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="es-card h-20 animate-pulse" />)}</div>}

        {fetchErr && !loading && (
          <div className="es-card p-8 text-center">
            <p className="text-es-muted mb-2">{fetchErr}</p>
            <p className="text-es-subtle text-sm">Assignments appear once the backend is running and you have enrolled courses.</p>
            <Link to="/courses" className="btn-secondary text-sm mt-4 inline-block">Browse Courses</Link>
          </div>
        )}

        {!loading && !fetchErr && filtered.length === 0 && (
          <div className="es-card p-10 text-center">
            <p className="text-es-muted mb-3">
              {assessments.length === 0 ? 'No assignments yet. Enrol in a course to see assessments here.' : `No items in ${tab}.`}
            </p>
            {assessments.length === 0 && <Link to="/courses" className="btn-primary text-sm inline-block">Explore Courses</Link>}
          </div>
        )}

        {!loading && !fetchErr && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(a => {
              const status = getStatus(a);
              const sd = STATUS_DISPLAY[status] || { label: status, cls: 'badge-grey' };
              const isOpen = expanded === a.id;
              const latest = a.submissions[0];
              return (
                <div key={a.id} className="es-card overflow-hidden">
                  <button onClick={() => setExpanded(isOpen ? null : a.id)}
                    className="w-full flex items-start justify-between gap-4 p-5 text-left transition-colors"
                    style={{ background: isOpen ? '#151519' : undefined }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={sd.cls} style={sd.color ? { color: sd.color } : {}}>{sd.label}</span>
                        <span className="badge-grey">{TYPE_DISPLAY[a.type] || a.type}</span>
                        {a.course && <span className="text-xs text-es-subtle">{a.course.title}</span>}
                      </div>
                      <h3 className="font-bold text-white text-sm">{a.title}</h3>
                      {latest && (
                        <p className="text-xs text-es-subtle mt-1">
                          Submitted {new Date(latest.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {latest.score != null && ` · Score: ${latest.score}%`}
                        </p>
                      )}
                    </div>
                    <svg className={`w-5 h-5 text-es-subtle flex-shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5" style={{ borderTop: '1px solid rgba(194,24,106,0.08)' }}>
                      <div className="pt-4 grid sm:grid-cols-3 gap-2 mb-4 text-xs text-es-muted">
                        <span>Pass mark: {a.passMark}%</span>
                        <span>Max attempts: {a.maxAttempts}</span>
                        <span>Attempts used: {a.submissions.length}</span>
                      </div>
                      {a.description && <p className="text-sm text-es-muted leading-relaxed mb-4">{a.description}</p>}
                      {latest?.feedback && !['NEEDS_CHANGES'].includes(status) && (
                        <div className="rounded-lg p-4 mb-4" style={{
                          background: status === 'PASSED' ? 'rgba(34,197,94,0.08)' : 'rgba(225,154,71,0.08)',
                          border: `1px solid ${status === 'PASSED' ? 'rgba(34,197,94,0.3)' : 'rgba(225,154,71,0.2)'}`,
                        }}>
                          <p className="text-xs font-bold uppercase tracking-wide mb-1 text-es-muted">Assessor Feedback</p>
                          <p className="text-sm text-es-off-white">{latest.feedback}</p>
                        </div>
                      )}
                      <SubmitPanel assessment={a} onSubmitted={() => setRefreshKey(k => k + 1)} />
                      {status === 'PASSED' && (
                        <div className="rounded-lg p-3 mt-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                          <p className="text-xs" style={{ color: '#22C55E' }}>Assessment passed. This assessment is complete.</p>
                        </div>
                      )}
                      {(status === 'PENDING' || status === 'IN_REVIEW') && (
                        <div className="rounded-lg p-3 mt-3" style={{ background: 'rgba(164,28,100,0.08)', border: '1px solid rgba(164,28,100,0.2)' }}>
                          <p className="text-xs" style={{ color: '#A41C64' }}>Your submission is with an assessor. You will be notified when feedback is available.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
