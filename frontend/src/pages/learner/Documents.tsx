import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { CONTACT_EMAIL } from '../../lib/contact';
import { downloadCourseDocument } from '../../lib/documentDownload';

interface CourseDocument {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  hasFile?: boolean;
  fileType: string;
  fileSizeMb?: number;
  sortOrder: number;
  course?: { id: string; title: string; slug: string };
}

const TYPE_ICONS: Record<string, string> = {
  HANDBOOK: '📋', ASSESSMENT_FORM: '📝', CHECKLIST: '✅',
  RESOURCE: '📄', CERTIFICATE: '🏆', TEMPLATE: '🗂️', OTHER: '📁',
};

const TABS = ['All', 'Course Materials', 'Assessment Forms', 'Certificates'] as const;
type Tab = typeof TABS[number];
const TAB_TYPES: Record<Tab, string[]> = {
  'All': [],
  'Course Materials': ['HANDBOOK', 'RESOURCE', 'TEMPLATE'],
  'Assessment Forms': ['ASSESSMENT_FORM', 'CHECKLIST'],
  'Certificates': ['CERTIFICATE'],
};

export default function Documents() {
  const [docs, setDocs] = useState<CourseDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState('');
  const [tab, setTab] = useState<Tab>('All');
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const [downloadMsgLink, setDownloadMsgLink] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/documents')
      .then(r => { setDocs(r.data); setFetchErr(''); })
      .catch(() => setFetchErr('Could not load documents. Connect to the backend to see your course resources.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'All' ? docs : docs.filter(d => TAB_TYPES[tab].includes(d.type));

  const handleDownload = async (doc: CourseDocument) => {
    if (doc.status === 'LOCKED') {
      setDownloadMsgLink(null);
      setDownloadMsg(
        `"${doc.title}" is locked until you complete all course requirements. ` +
        'These templates and documents are included inside the full learner pathway.'
      );
      setTimeout(() => setDownloadMsg(null), 5000);
      return;
    }
    if (doc.status === 'COMING_SOON' || !doc.hasFile) {
      setDownloadMsgLink(null);
      setDownloadMsg(
        `"${doc.title}" — File hosting not yet configured. ` +
        `Request this document by emailing ${CONTACT_EMAIL}. ` +
        'File hosting is in development.'
      );
      setTimeout(() => setDownloadMsg(null), 8000);
      return;
    }

    setDownloadingId(doc.id);
    setDownloadMsg(null);
    setDownloadMsgLink(null);
    const result = await downloadCourseDocument(doc.id);
    setDownloadingId(null);

    if (result.status === 'error') {
      setDownloadMsg(result.message);
      setTimeout(() => setDownloadMsg(null), 8000);
    } else if (result.status === 'popup-blocked') {
      setDownloadMsg(`Your browser blocked the download popup for "${doc.title}". Click below to open it:`);
      setDownloadMsgLink(result.url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />
      <div className="pt-navbar" style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
        <div className="es-container py-8">
          <p className="es-label mb-2">Learner Area</p>
          <h1 className="text-3xl font-black text-white">Resources &amp; Documents</h1>
          <p className="text-es-muted mt-1 text-sm">Course materials, assessment forms, and your certificates.</p>
        </div>
      </div>
      <div className="es-container py-8 flex-1">
        {/* Download message */}
        {downloadMsg && (
          <div className="rounded-lg p-4 mb-6" style={{ background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.3)' }}>
            <p className="text-sm" style={{ color: '#E19A47' }}>{downloadMsg}</p>
            {downloadMsgLink && (
              <a href={downloadMsgLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold underline mt-1 inline-block" style={{ color: '#E19A47' }}>
                Open document
              </a>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit hide-scrollbar overflow-x-auto" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all flex-shrink-0 ${tab === t ? 'text-white' : 'text-es-muted hover:text-white'}`}
              style={tab === t ? { background: '#A41C64' } : {}}>
              {t}
            </button>
          ))}
        </div>

        {loading && <div className="grid sm:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="es-card h-24 animate-pulse" />)}</div>}

        {fetchErr && !loading && (
          <div className="es-card p-8 text-center">
            <p className="text-es-muted mb-2">{fetchErr}</p>
            <p className="text-es-subtle text-sm">Documents will appear once you are enrolled in a course.</p>
            <Link to="/courses" className="btn-secondary text-sm mt-4 inline-block">Browse Courses</Link>
          </div>
        )}

        {!loading && !fetchErr && filtered.length === 0 && (
          <div className="es-card p-10 text-center">
            <p className="text-es-muted mb-3">
              {docs.length === 0
                ? 'No documents yet. These templates and documents are included inside the full learner pathway.'
                : `No documents in ${tab}.`}
            </p>
            {docs.length === 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/courses" className="btn-primary text-sm inline-block">Explore Courses</Link>
                <Link to="/register-interest?type=general" className="btn-secondary text-sm inline-block">
                  Register your interest
                </Link>
              </div>
            )}
          </div>
        )}

        {!loading && !fetchErr && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(doc => {
              const isLocked = doc.status === 'LOCKED';
              const isComingSoon = doc.status === 'COMING_SOON' || !doc.hasFile;
              return (
                <div key={doc.id} className={`es-card p-5 flex items-start gap-4 ${isLocked ? 'opacity-60' : ''}`}>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: isLocked ? '#2A2A2A' : 'rgba(164,28,100,0.12)', border: `1px solid ${isLocked ? '#3C3C3C' : 'rgba(164,28,100,0.25)'}` }}>
                    {isLocked ? (
                      <svg className="w-5 h-5 text-es-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="badge-grey">{doc.fileType}</span>
                      {doc.fileSizeMb && <span className="text-xs text-es-subtle">{doc.fileSizeMb} MB</span>}
                      {doc.course && <span className="text-xs text-es-subtle">{doc.course.title}</span>}
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug mb-1">{doc.title}</h3>
                    {doc.description && <p className="text-xs text-es-subtle leading-relaxed mb-3">{doc.description}</p>}
                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                      className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isLocked ? 'text-es-subtle cursor-not-allowed' : 'hover:text-white'
                      } disabled:opacity-60`}
                      style={isLocked ? {} : { color: '#A41C64' }}
                    >
                      {isLocked ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Locked until completion
                        </>
                      ) : isComingSoon ? (
                        <>Request document</>
                      ) : downloadingId === doc.id ? (
                        <>Preparing download…</>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download {doc.fileType}
                        </>
                      )}
                    </button>
                  </div>
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
