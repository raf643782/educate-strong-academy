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
  { label: 'Manage Courses', href: '/admin/courses', desc: 'View, edit, and publish courses' },
  { label: 'EatStrong Content', href: '/admin/eatstrong', desc: 'Manage nutrition articles and downloads', highlight: true },
  { label: 'Knowledge Hub', href: '/knowledge', desc: 'Browse the knowledge library' },
  { label: 'Exercise Library', href: '/exercises', desc: 'View exercise reference library' },
  { label: 'Event Library', href: '/events', desc: 'View competition event library' },
  { label: 'Assessor Portal', href: '/assessor', desc: 'Review learner submissions' },
  { label: 'Course Catalogue', href: '/courses', desc: 'View the public course catalogue' },
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
    { label: 'Total Learners', value: stats.users },
    { label: 'Active Courses', value: stats.courses },
    { label: 'Total Enrolments', value: stats.enrolments },
    { label: 'Certificates Issued', value: stats.certificates },
    { label: 'Pending Submissions', value: stats.pendingSubmissions },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      <div className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="es-label mb-2">Admin Area</p>
          <h1 className="text-3xl font-black text-white">Platform Overview</h1>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Stats */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="es-card p-5 animate-pulse">
                  <div className="h-8 w-12 rounded mb-2" style={{ background: '#2A2A2A' }} />
                  <div className="h-4 w-24 rounded" style={{ background: '#2A2A2A' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {statCards.map(stat => (
                <div key={stat.label} className="es-card p-5" style={{ background: '#1A1A1A' }}>
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-es-muted font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quick links */}
          <div className="mb-8">
            <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUICK_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="es-card-hover rounded-xl p-5 flex items-start gap-4"
                  style={link.highlight ? { borderTop: '2px solid #166534' } : {}}
                >
                  <div>
                    <p className={`font-semibold mb-0.5 ${link.highlight ? 'text-green-400' : 'text-white'}`}>
                      {link.label}
                    </p>
                    <p className="text-sm text-es-muted">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent activity placeholder */}
          <div className="es-card overflow-hidden">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #2C2C2C' }}>
              <h2 className="font-black text-white">Recent Enrolments</h2>
            </div>
            <div className="p-10 text-center">
              <p className="text-es-muted text-sm">Full activity logs and reporting available in Stage 2.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
