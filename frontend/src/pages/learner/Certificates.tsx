import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';

interface Certificate {
  id: string;
  certificateCode: string;
  issuedAt: string;
  expiresAt?: string;
  course: { title: string; pathway: string; level: number };
}

export default function Certificates() {
  useDocumentHead({ title: 'My Certificates' });

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/my')
      .then(res => setCertificates(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />

      <div className="pt-navbar" style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="es-label mb-2">Learner Area</p>
          <h1 className="text-3xl font-black text-white">Your Certificates</h1>
          <p className="text-es-muted mt-1">Your earned qualifications and credentials.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {loading ? (
          <div className="es-card p-6"><p className="text-es-subtle text-center py-8">Loading...</p></div>
        ) : certificates.length === 0 ? (
          <div className="es-card p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.2)' }}>
                <svg className="w-8 h-8" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-white mb-3">No certificates yet</h2>
              <p className="text-es-muted text-sm mb-2 max-w-sm mx-auto">
                Certificates will appear here once your course completion has been reviewed and approved by EducateStrong.
              </p>
              <p className="text-es-subtle text-sm mb-6 max-w-sm mx-auto">
                Each certificate includes a unique verification code.
              </p>
              <Link to="/courses" className="btn-primary text-sm">
                Explore Courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certificates.map(cert => (
              <div key={cert.id} className="es-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-white mb-1">{cert.course.title}</h3>
                    <p className="text-xs text-es-subtle mb-3">
                      Issued {new Date(cert.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs font-mono text-es-muted px-2 py-1 rounded" style={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.07)' }}>{cert.certificateCode}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.2)' }}>
                    <svg className="w-6 h-6" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
