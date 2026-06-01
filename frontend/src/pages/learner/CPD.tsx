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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">CPD Log</h1>
          <p className="text-gray-500 mt-1">Track and manage your Continuing Professional Development.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* What is CPD */}
            <Card>
              <h2 className="text-lg font-bold text-gray-900 mb-3">What is CPD?</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Continuing Professional Development (CPD) ensures qualified coaches maintain and develop their knowledge and skills throughout their career. Accredited Educate.Strong coaches are expected to log CPD activity each year to maintain their qualification status.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>CPD logging will be available once you complete your first certification.</strong> Complete Level 1 to access the full CPD tracking system.
                </p>
              </div>
            </Card>

            {/* CPD activity types */}
            <Card>
              <h2 className="text-lg font-bold text-gray-900 mb-4">CPD Activity Types</h2>
              <div className="space-y-3">
                {Object.entries(activityLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{label}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                      {summary?.byActivity[key] ? `${summary.byActivity[key]}h logged` : '0h'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar stats */}
          <div className="space-y-5">
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Annual Progress</h3>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : (
                <>
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#E5E7EB" strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#D97706" strokeWidth="3"
                        strokeDasharray={`${percentToTarget}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">{percentToTarget}%</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    {summary?.approvedHours || 0} / {annualTarget} hours
                  </p>
                  <p className="text-center text-xs text-gray-400 mt-1">Annual CPD target</p>
                </>
              )}
            </Card>

            <Card>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total logged</span>
                  <span className="font-bold text-gray-900">{summary?.totalHours || 0}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="font-bold text-green-600">{summary?.approvedHours || 0}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending review</span>
                  <span className="font-bold text-amber-600">{summary?.pendingCount || 0}</span>
                </div>
              </div>
            </Card>

            <Link
              to="/courses"
              className="block bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors text-center"
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
