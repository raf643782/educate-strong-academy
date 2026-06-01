import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface Stats {
  users: number;
  courses: number;
  enrolments: number;
  certificates: number;
  pendingSubmissions: number;
}

const QUICK_LINKS = [
  { label: 'Manage Courses', href: '/admin/courses', icon: '📚', desc: 'View, edit, and publish courses' },
  { label: 'Knowledge Hub', href: '/knowledge', icon: '📖', desc: 'Browse the knowledge library' },
  { label: 'Exercise Library', href: '/exercises', icon: '🏋️', desc: 'View exercise reference library' },
  { label: 'Event Library', href: '/events', icon: '🏆', desc: 'View competition event library' },
  { label: 'Assessor Portal', href: '/assessor', icon: '✅', desc: 'Review learner submissions' },
  { label: 'Course Catalogue', href: '/courses', icon: '🎓', desc: 'View the public course catalogue' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Learners', value: stats.users, colour: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Courses', value: stats.courses, colour: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Enrolments', value: stats.enrolments, colour: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Certificates Issued', value: stats.certificates, colour: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Submissions', value: stats.pendingSubmissions, colour: 'text-red-600', bg: 'bg-red-50' },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-1">Admin Area</p>
            <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="h-8 w-12 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {statCards.map(stat => (
                <div key={stat.label} className={`${stat.bg} rounded-xl border border-gray-200 p-5`}>
                  <p className={`text-3xl font-bold ${stat.colour} mb-1`}>{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quick links */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUICK_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all p-5 flex items-start gap-4"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-0.5">{link.label}</p>
                    <p className="text-sm text-gray-500">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent activity placeholder */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Recent Enrolments</h2>
            </div>
            <div className="p-10 text-center">
              <p className="text-gray-400 text-sm">Full activity logs and reporting available in Stage 2.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
