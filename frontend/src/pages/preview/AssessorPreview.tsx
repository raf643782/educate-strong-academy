import { useState } from 'react';
import PreviewBanner from '../../components/preview/PreviewBanner';

/*
 * Internal QA tooling — /portal-preview/assessor
 * A static visual mirror of pages/assessor/AssessorPortal.tsx. Deliberately
 * does NOT reuse that component — it calls GET /assessor/submissions on
 * load and PATCH /assessments/submissions/:id to grade, neither of which
 * must ever run from an unauthenticated preview page.
 *
 * Every submission below is hardcoded and labelled [PREVIEW]. The "Save"
 * button only updates local component state and shows a note that
 * nothing was saved — it never calls any API.
 */

type Status = 'PENDING' | 'IN_REVIEW' | 'PASSED' | 'FAILED' | 'NEEDS_CHANGES';

interface PreviewSubmission {
  id: string;
  learnerName: string;
  assessmentTitle: string;
  content: string;
  status: Status;
}

const STATUS_LABEL: Record<Status, string> = {
  PENDING: 'Awaiting Review',
  IN_REVIEW: 'In Review',
  PASSED: 'Passed',
  FAILED: 'Failed',
  NEEDS_CHANGES: 'Needs Changes',
};

const INITIAL_SUBMISSIONS: PreviewSubmission[] = [
  {
    id: 'preview-1',
    learnerName: '[PREVIEW] Learner A',
    assessmentTitle: '[PREVIEW] Athlete Screening Assignment',
    content: 'Sample written scenario response shown for layout purposes only. Not a real submission.',
    status: 'PENDING',
  },
  {
    id: 'preview-2',
    learnerName: '[PREVIEW] Learner B',
    assessmentTitle: '[PREVIEW] Session Plan Review',
    content: 'Sample coursework evidence shown for layout purposes only. Not a real submission.',
    status: 'IN_REVIEW',
  },
];

function ReviewPanel({ sub, onClose, onSaved }: { sub: PreviewSubmission; onClose: () => void; onSaved: (id: string, status: Status, feedback: string) => void }) {
  const [status, setStatus] = useState<Status>(sub.status === 'PENDING' ? 'IN_REVIEW' : sub.status);
  const [feedback, setFeedback] = useState('');
  const [savedNote, setSavedNote] = useState('');

  function handleSave() {
    onSaved(sub.id, status, feedback);
    setSavedNote('Preview only — not saved. No real submission was updated.');
  }

  return (
    <div style={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', marginTop: '12px' }}>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>{sub.content}</p>

      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
        Status
      </label>
      <select
        value={status}
        onChange={e => setStatus(e.target.value as Status)}
        style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', marginBottom: '14px' }}
      >
        {(Object.keys(STATUS_LABEL) as Status[]).map(s => (
          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
        ))}
      </select>

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
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#E19A47' }}>{savedNote}</p>
      )}
    </div>
  );
}

export default function AssessorPreview() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [openId, setOpenId] = useState<string | null>(null);

  // Local-only — never calls an API. Demonstrates the review flow without
  // touching any real submission.
  function handleSaved(id: string, status: Status, _feedback: string) {
    setSubmissions(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <PreviewBanner />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Review Queue · Preview
        </p>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 24px' }}>Assessor Portal</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {submissions.map(sub => (
            <div key={sub.id} style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.12)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '4px' }}>{sub.assessmentTitle}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{sub.learnerName}</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#E19A47', background: 'rgba(225,154,71,0.12)', padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  {STATUS_LABEL[sub.status]}
                </span>
              </div>

              <button
                onClick={() => setOpenId(openId === sub.id ? null : sub.id)}
                style={{ marginTop: '14px', background: 'transparent', color: '#A41C64', border: '1px solid rgba(164,28,100,0.3)', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
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
