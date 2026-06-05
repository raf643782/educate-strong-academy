import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  category: string;
  status: 'available' | 'locked';
  note: string;
}

const DOCUMENTS: Document[] = [
  { id: 'd1', title: 'Level 1 Coaching — Course Handbook', type: 'PDF', size: '2.4 MB', category: 'Course Materials', status: 'available', note: 'Sent by email on enrolment' },
  { id: 'd2', title: 'Pre-Course E-Learning Guide', type: 'PDF', size: '1.1 MB', category: 'Course Materials', status: 'available', note: 'Complete before attending the practical day' },
  { id: 'd3', title: 'Athlete Intake Form', type: 'PDF', size: '0.3 MB', category: 'Assessment Forms', status: 'available', note: 'Use this with new athletes before coaching sessions' },
  { id: 'd4', title: 'Risk Assessment Template', type: 'PDF', size: '0.4 MB', category: 'Assessment Forms', status: 'available', note: 'Complete for all coaching environments' },
  { id: 'd5', title: 'Practical Coaching Observation Checklist', type: 'PDF', size: '0.2 MB', category: 'Assessment Forms', status: 'available', note: 'Assessor uses this on course day' },
  { id: 'd6', title: 'Level 1 Coaching Certificate', type: 'PDF', size: '—', category: 'Certificates', status: 'locked', note: 'Issued on successful completion of all assessments' },
];

type FilterType = 'All' | 'Course Materials' | 'Assessment Forms' | 'Certificates';
const FILTERS: FilterType[] = ['All', 'Course Materials', 'Assessment Forms', 'Certificates'];

export default function Documents() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const filtered = filter === 'All' ? DOCUMENTS : DOCUMENTS.filter(d => d.category === filter);

  const handleDownload = (doc: Document) => {
    setDownloadMessage(doc.id);
    setTimeout(() => setDownloadMessage(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* Header */}
      <div className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="es-label mb-2">Learner Area</p>
          <h1 className="text-3xl font-black text-white mb-2">Resources &amp; Documents</h1>
          <p className="text-es-muted">Course materials, forms, and certificates for your qualification.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2 py-3">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded text-sm font-semibold transition-all"
              style={filter === f
                ? { background: '#A41C64', color: '#fff', border: '1px solid rgba(164,28,100,0.6)' }
                : { color: '#888', border: '1px solid transparent' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(doc => (
              <div key={doc.id} className="es-card p-5 flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={doc.status === 'locked'
                    ? { background: '#1A1A1A', border: '1px solid #2C2C2C' }
                    : { background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.2)' }
                  }
                >
                  {doc.status === 'locked' ? (
                    <svg className="w-5 h-5 text-es-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="badge-grey text-xs">{doc.type}</span>
                    <span className="text-xs text-es-subtle">{doc.size}</span>
                    <span className="text-xs text-es-subtle">·</span>
                    <span className="text-xs text-es-subtle">{doc.category}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm leading-snug mb-1">{doc.title}</h3>
                  <p className="text-xs text-es-muted leading-relaxed mb-3">{doc.note}</p>

                  {doc.status === 'locked' ? (
                    <p className="text-xs text-es-subtle italic">Locked — complete all assessments to unlock</p>
                  ) : (
                    <div>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="text-xs font-semibold transition-colors"
                        style={{ color: '#A41C64' }}
                      >
                        Download {doc.type}
                      </button>
                      {downloadMessage === doc.id && (
                        <div
                          className="mt-2 rounded-lg p-3 text-xs leading-relaxed"
                          style={{ background: 'rgba(225,154,71,0.08)', border: '1px solid rgba(225,154,71,0.2)', color: '#E19A47' }}
                        >
                          Download files will be available once document hosting is configured. In the meantime, contact{' '}
                          <a href="mailto:educate.strongltd@gmail.com" className="underline">educate.strongltd@gmail.com</a>
                          {' '}to request this resource.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="es-card p-12 text-center">
              <p className="text-es-muted">No documents in this category.</p>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
