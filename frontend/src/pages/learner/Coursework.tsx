import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { StatusBadge, CourseStatus } from '../../data/lmsData';

interface Assignment {
  id: string;
  title: string;
  course: string;
  status: CourseStatus;
  dueNote: string;
  wordLimit: string;
  instructions: string;
  rubric: string[];
  passMark: string;
}

const ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    title: 'Written Coaching Scenario',
    course: 'Level 1 Fundamentals of Coaching Strongman',
    status: 'NOT_STARTED',
    dueNote: 'Due before course date',
    wordLimit: '700–900 words',
    instructions: 'You will be given a coaching scenario and asked to analyse the situation, identify the key issues, and propose a structured coaching response. This assessment tests your ability to apply course learning to real-world situations.',
    rubric: ['Technical analysis accuracy (30%)', 'Coaching response quality (30%)', 'Programme planning (20%)', 'Communication quality (20%)'],
    passMark: '65%',
  },
  {
    id: 'a2',
    title: 'Knowledge Examination',
    course: 'Level 1 Fundamentals of Coaching Strongman',
    status: 'NOT_STARTED',
    dueNote: 'Available after completing all modules',
    wordLimit: '40 questions — 60 minutes',
    instructions: 'A timed knowledge examination covering all course content. Questions include multiple choice, true/false, and scenario-select formats.',
    rubric: ['Event knowledge (35%)', 'Safety and professional responsibilities (25%)', 'Coaching fundamentals (25%)', 'Programming basics (15%)'],
    passMark: '75%',
  },
  {
    id: 'a3',
    title: 'Practical Coaching Observation',
    course: 'Level 1 Fundamentals of Coaching Strongman',
    status: 'NOT_STARTED',
    dueNote: 'Completed on in-person course day',
    wordLimit: 'In-person assessment',
    instructions: 'Your practical coaching will be observed and assessed on the in-person course day by Paul Smith or Dr Chris Fitzgerald. This is a competency-based assessment — all competencies must be demonstrated.',
    rubric: ['Athlete screening (Pass/Fail)', 'Technical instruction quality (Pass/Fail)', 'Safety management (Pass/Fail)', 'Communication (Pass/Fail)'],
    passMark: 'All competencies must pass',
  },
];

type TabType = 'my_assignments' | 'submitted' | 'completed';

const TABS: { key: TabType; label: string }[] = [
  { key: 'my_assignments', label: 'My Assignments' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'completed', label: 'Completed' },
];

export default function Coursework() {
  const [activeTab, setActiveTab] = useState<TabType>('my_assignments');
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (id: string) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* Header */}
      <div className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="es-label mb-2">Learner Area</p>
          <h1 className="text-3xl font-black text-white mb-2">Coursework &amp; Assessments</h1>
          <p className="text-es-muted">Complete and submit your course assignments and formal assessments.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 py-3">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded text-sm font-semibold transition-all"
              style={activeTab === tab.key
                ? { background: '#A41C64', color: '#fff', border: '1px solid rgba(164,28,100,0.6)' }
                : { color: '#888', border: '1px solid transparent' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {activeTab === 'my_assignments' && (
            <div className="space-y-5">
              {ASSIGNMENTS.map(a => (
                <div key={a.id} className="es-card overflow-hidden">
                  {/* Card header */}
                  <div
                    className="px-6 py-5 cursor-pointer flex items-start justify-between gap-4"
                    onClick={() => toggleExpand(a.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <StatusBadge status={a.status} />
                        <span className="text-xs text-es-subtle">{a.dueNote}</span>
                      </div>
                      <h3 className="font-black text-white text-base leading-snug">{a.title}</h3>
                      <p className="text-xs text-es-muted mt-1">{a.course}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-es-subtle flex-shrink-0 mt-1 transition-transform ${expanded === a.id ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded detail */}
                  {expanded === a.id && (
                    <div className="px-6 pb-6 space-y-5" style={{ borderTop: '1px solid #2C2C2C' }}>
                      <div className="pt-5 grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-es-subtle uppercase tracking-wider mb-1">Format</p>
                          <p className="text-sm text-white">{a.wordLimit}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-es-subtle uppercase tracking-wider mb-1">Pass Mark</p>
                          <p className="text-sm text-white">{a.passMark}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-es-subtle uppercase tracking-wider mb-2">Instructions</p>
                        <p className="text-sm text-es-muted leading-relaxed">{a.instructions}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-es-subtle uppercase tracking-wider mb-2">Assessment Criteria</p>
                        <ul className="space-y-1">
                          {a.rubric.map((r, i) => (
                            <li key={i} className="text-sm text-es-muted flex items-start gap-2">
                              <span style={{ color: '#A41C64', flexShrink: 0 }}>›</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Text submission area */}
                      <div>
                        <p className="text-xs font-semibold text-es-subtle uppercase tracking-wider mb-2">Written Submission</p>
                        <textarea
                          rows={5}
                          placeholder="Type your response here... (submission not yet enabled)"
                          disabled
                          className="w-full rounded-lg text-sm text-es-subtle placeholder-es-subtle p-3 resize-none cursor-not-allowed"
                          style={{ background: '#111', border: '1px solid #2C2C2C', opacity: 0.7 }}
                        />
                      </div>

                      {/* Upload area */}
                      <div
                        className="rounded-lg p-5 text-center"
                        style={{ border: '2px dashed #2C2C2C', background: '#111' }}
                      >
                        <svg className="w-8 h-8 mx-auto mb-2 text-es-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <p className="text-sm font-semibold text-es-muted mb-1">Upload File</p>
                        <p className="text-xs text-es-subtle">
                          Coming Soon — upload functionality launching with Phase 2.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'submitted' || activeTab === 'completed') && (
            <div className="es-card p-12 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#1A1A1A' }}>
                <svg className="w-8 h-8 text-es-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-black text-es-muted mb-2">
                {activeTab === 'submitted' ? 'No submissions yet' : 'No completed assessments yet'}
              </h3>
              <p className="text-es-subtle text-sm max-w-sm mx-auto mb-4">
                {activeTab === 'submitted'
                  ? 'Your submitted assessments will appear here once submission is enabled in Phase 2.'
                  : 'Completed and passed assessments will appear here.'
                }
              </p>
              <button onClick={() => setActiveTab('my_assignments')} className="btn-secondary text-sm">
                View My Assignments
              </button>
            </div>
          )}

          <div className="mt-8">
            <Link to="/documents" className="text-sm font-semibold" style={{ color: '#A41C64' }}>
              View course documents and resources →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
