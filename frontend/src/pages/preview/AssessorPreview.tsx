import { useState } from 'react';
import PreviewBanner from '../../components/preview/PreviewBanner';

/*
 * Internal QA tooling — /portal-preview/assessor
 * A static visual mirror of pages/assessor/AssessorPortal.tsx. Deliberately
 * does NOT reuse that component — it calls GET /assessor/submissions on
 * load and PATCH /assessments/submissions/:id to grade, neither of which
 * must ever run from an unauthenticated preview page.
 *
 * Every submission below is hardcoded and labelled [PREVIEW]. The review
 * panel's status buttons and feedback box only update local component
 * state and show a note that nothing was saved — they never call any API.
 */

type Status = 'PENDING' | 'IN_REVIEW' | 'PASSED' | 'FAILED' | 'NEEDS_CHANGES';

interface PreviewSubmission {
  id: string;
  title: string;
  learnerName: string;
  courseName: string;
  type: string;
  status: Status;
  submittedDate: string;
  evidenceType: string;
  evidenceSummary: string;
  learnerNotes: string;
}

const STATUS_LABEL: Record<Status, string> = {
  PENDING: 'Awaiting Review',
  IN_REVIEW: 'In Review',
  PASSED: 'Passed',
  FAILED: 'Failed',
  NEEDS_CHANGES: 'Needs Changes',
};

const STATUS_COLOUR: Record<Status, string> = {
  PENDING: '#E19A47',
  IN_REVIEW: '#E19A47',
  PASSED: '#A41C64',
  FAILED: 'rgba(239,68,68,0.85)',
  NEEDS_CHANGES: 'rgba(239,68,68,0.85)',
};

const INITIAL_SUBMISSIONS: PreviewSubmission[] = [
  {
    id: 'preview-1',
    title: '[PREVIEW] Athlete Screening Assignment',
    learnerName: 'QA Demo Learner',
    courseName: 'Level 1 Coaching Strongman',
    type: 'Written scenario',
    status: 'PENDING',
    submittedDate: 'Preview date',
    evidenceType: 'Written response',
    evidenceSummary: 'Sample written scenario response shown for layout purposes only. Not a real submission.',
    learnerNotes: 'Preview note: learner-supplied context or comments would appear here.',
  },
  {
    id: 'preview-2',
    title: '[PREVIEW] Session Plan Review',
    learnerName: 'QA Demo Learner',
    courseName: 'Level 1 Coaching Strongman',
    type: 'Session plan',
    status: 'IN_REVIEW',
    submittedDate: 'Preview date',
    evidenceType: 'Document upload',
    evidenceSummary: 'Sample session plan evidence shown for layout purposes only. Not a real submission.',
    learnerNotes: 'Preview note: learner-supplied context or comments would appear here.',
  },
];

const STATUS_BUTTONS: Status[] = ['IN_REVIEW', 'NEEDS_CHANGES', 'FAILED', 'PASSED'];

function ReviewPanel({ sub, onClose, onSaved }: { sub: PreviewSubmission; onClose: () => void; onSaved: (id: string, status: Status) => void }) {
  const [status, setStatus] = useState<Status>(sub.status === 'PENDING' ? 'IN_REVIEW' : sub.status);
  const [feedback, setFeedback] = useState('');
  const [savedNote, setSavedNote] = useState('');

  function handleSave() {
    onSaved(sub.id, status);
    setSavedNote('Preview only. This review is not saved.');
  }

  const field = (label: string, value: string) => (
    <div style={{ marginBottom: '14px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{value}</p>
    </div>
  );

  return (
    <div style={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', marginTop: '12px' }}>
      {field('Evidence summary', sub.evidenceSummary)}
      {field('Learner notes', sub.learnerNotes)}

      <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
        Status
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {STATUS_BUTTONS.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              background: status === s ? 'linear-gradient(135deg,#A41C64,#7C3AED)' : 'transparent',
              color: status === s ? '#fff' : 'rgba(255,255,255,0.5)',
              border: status === s ? 'none' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
        Feedback
      </label>
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="Preview only — typing here does not save anywhere."
        style={{ width: '100%', minHeight: '80px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', marginBottom: '14px', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSave}
          style={{ background: 'linear-gradient(135deg,#A41C64,#C0246E)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
        >
          Save
        </button>
        <button
          onClick={onClose}
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 20px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>

      {savedNote && (
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#E19A47', fontWeight: 700 }}>{savedNote}</p>
      )}
    </div>
  );
}

export default function AssessorPreview() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [openId, setOpenId] = useState<string | null>(null);

  // Local-only — never calls an API. Demonstrates the review flow without
  // touching any real submission.
  function handleSaved(id: string, status: Status) {
    setSubmissions(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
  }

  const stats = [
    { label: 'Awaiting Review', value: submissions.filter(s => s.status === 'PENDING' || s.status === 'IN_REVIEW').length },
    { label: 'Passed', value: submissions.filter(s => s.status === 'PASSED').length },
    { label: 'Needs Changes', value: submissions.filter(s => s.status === 'NEEDS_CHANGES' || s.status === 'FAILED').length },
    { label: 'Total Submissions', value: submissions.length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <PreviewBanner />

      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Review Queue · Preview
        </p>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 24px' }}>Assessor Portal</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px' }}>
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {submissions.map(sub => (
            <div key={sub.id} style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.12)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff', margin: 0 }}>{sub.title}</p>
                <span style={{ fontSize: '11px', fontWeight: 700, color: STATUS_COLOUR[sub.status], background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  {STATUS_LABEL[sub.status]}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px 16px', marginBottom: '16px' }}>
                {[
                  ['Learner', sub.learnerName],
                  ['Course', sub.courseName],
                  ['Type', sub.type],
                  ['Evidence', sub.evidenceType],
                  ['Submitted', sub.submittedDate],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 2px' }}>{label}</p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setOpenId(openId === sub.id ? null : sub.id)}
                style={{ background: 'transparent', color: '#A41C64', border: '1px solid rgba(164,28,100,0.3)', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
              >
                {openId === sub.id ? 'Hide submission' : 'Open submission'}
              </button>

              {openId === sub.id && (
                <ReviewPanel sub={sub} onClose={() => setOpenId(null)} onSaved={handleSaved} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
