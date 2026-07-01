import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import api from '../../lib/api';

interface CPDSummary {
  totalHours: number;
  approvedHours: number;
  pendingCount: number;
  byActivity: Record<string, number>;
}

const activityLabels: Record<string, string> = {
  FORMAL_LEARNING: 'Formal Learning',
  COACHING_EVENT: 'Coaching Event',
  COMPETITION: 'Competition',
  OFFICIATING: 'Officiating',
  KNOWLEDGE_CONTRIBUTION: 'Knowledge Contribution',
  MENTORING: 'Mentoring',
  PEER_LEARNING: 'Peer Learning',
};

export default function CPD() {
  const [summary, setSummary] = useState<CPDSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cpd/summary')
      .then(res => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const annualTarget = 35;
  const percentToTarget = summary ? Math.min(100, Math.round((summary.approvedHours / annualTarget) * 100)) : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />

      <div className="pt-navbar" style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="es-label mb-2">Learner Area</p>
          <h1 className="text-3xl font-black text-white">CPD Log</h1>
          <p className="text-es-muted mt-1">Track and manage your Continuing Professional Development.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* What is CPD */}
            <div className="es-card p-6">
              <h2 className="text-lg font-black text-white mb-3">What is CPD?</h2>
              <p className="text-es-muted text-sm leading-relaxed mb-3">
                Continuing Professional Development (CPD) ensures qualified coaches maintain and develop their knowledge and skills throughout their career. Accredited Educate.Strong coaches are expected to log CPD activity each year to maintain their qualification status.
              </p>
              <div className="rounded-lg p-4" style={{ background: 'rgba(225,154,71,0.08)', border: '1px solid rgba(225,154,71,0.2)' }}>
                <p className="text-sm" style={{ color: '#E19A47' }}>
                  <strong>CPD logging will be available once you complete your first certification.</strong> Complete Level 1 to access the full CPD tracking system.
                </p>
              </div>
            </div>

            {/* CPD activity types */}
            <div className="es-card p-6">
              <h2 className="text-lg font-black text-white mb-4">CPD Activity Types</h2>
              <div className="space-y-3">
                {Object.entries(activityLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="text-sm text-es-muted">{label}</span>
                    <span className="badge-grey text-xs">
                      {summary?.byActivity[key] ? `${summary.byActivity[key]}h logged` : '0h'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar stats */}
          <div className="space-y-5">
            <div className="es-card p-6">
              <h3 className="font-black text-white mb-4">Annual Progress</h3>
              {loading ? (
                <p className="text-es-subtle text-sm">Loading...</p>
              ) : (
                <>
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#E19A47" strokeWidth="3"
                        strokeDasharray={`${percentToTarget}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black text-white">{percentToTarget}%</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-es-muted">
                    {summary?.approvedHours || 0} / {annualTarget} hours
                  </p>
                  <p className="text-center text-xs text-es-subtle mt-1">Annual CPD target</p>
                </>
              )}
            </div>

            <div className="es-card p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-es-muted">Total logged</span>
                  <span className="font-black text-white">{summary?.totalHours || 0}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-es-muted">Approved</span>
                  <span className="font-black" style={{ color: '#A41C64' }}>{summary?.approvedHours || 0}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-es-muted">Pending review</span>
                  <span className="font-black text-es-amber">{summary?.pendingCount || 0}</span>
                </div>
              </div>
            </div>

            <Link
              to="/courses"
              className="block btn-primary text-sm text-center"
            >
              Complete a course to begin CPD
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
