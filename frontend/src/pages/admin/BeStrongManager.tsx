import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  accessLevel: string;
  readMinutes?: number;
  reviewerName?: string;
}

interface Download {
  id: string;
  title: string;
  slug: string;
  category: string;
  fileType: string;
  isPublished: boolean;
  accessLevel: string;
}

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  totalDownloads: number;
  featuredArticles: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  BASICS:          'Nutrition Basics',
  COMPETITION:     'Competition',
  RECOVERY:        'Recovery',
  MAKING_WEIGHT:   'Making Weight',
  HYDRATION:       'Hydration',
  SUPPLEMENTS:     'Supplements',
  COACHES_GUIDE:   "Coaches' Guide",
  YOUTH_NUTRITION: 'Youth Nutrition',
  DOWNLOADS:       'Downloads',
};

const CATEGORY_COLOURS: Record<string, string> = {
  BASICS:          'bg-amber-100 text-amber-700',
  COMPETITION:     'bg-orange-100 text-orange-700',
  RECOVERY:        'bg-blue-100 text-blue-700',
  MAKING_WEIGHT:   'bg-purple-100 text-purple-700',
  HYDRATION:       'bg-cyan-100 text-cyan-700',
  SUPPLEMENTS:     'bg-red-100 text-red-700',
  COACHES_GUIDE:   'bg-indigo-100 text-indigo-700',
  YOUTH_NUTRITION: 'bg-violet-100 text-violet-700',
  DOWNLOADS:       'bg-gray-100 text-gray-700',
};

export default function BeStrongManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'articles' | 'downloads'>('articles');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/be-strong/admin/articles'),
      api.get('/be-strong/admin/downloads'),
      api.get('/be-strong/admin/stats'),
    ]).then(([artRes, dlRes, statsRes]) => {
      setArticles(artRes.data);
      setDownloads(dlRes.data);
      setStats(statsRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    setUpdating(id);
    try {
      await api.put(`/be-strong/admin/articles/${id}`, { isPublished: !current });
      setArticles(prev => prev.map(a => a.id === id ? { ...a, isPublished: !current } : a));
    } catch { /* ignore */ } finally { setUpdating(null); }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    setUpdating(id);
    try {
      await api.put(`/be-strong/admin/articles/${id}`, { isFeatured: !current });
      setArticles(prev => prev.map(a => a.id === id ? { ...a, isFeatured: !current } : a));
    } catch { /* ignore */ } finally { setUpdating(null); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide mb-1" style={{ color: '#A41C64' }}>
                <Link to="/admin" className="hover:opacity-80">Admin</Link> › EatStrong
              </p>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                EatStrong Content Manager
              </h1>
              <p className="text-gray-500 mt-1">Manage nutrition articles, downloads, and featured content.</p>
            </div>
            <Link
              to="/eatstrong"
              className="text-sm font-medium border rounded-lg px-4 py-2 transition-colors hover:opacity-80"
              style={{ color: '#A41C64', borderColor: 'rgba(164,28,100,0.3)' }}
            >
              View EatStrong →
            </Link>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Articles', value: stats.totalArticles, colour: 'text-pink-700', bg: 'bg-pink-50' },
                { label: 'Published', value: stats.publishedArticles, colour: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Featured', value: stats.featuredArticles, colour: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Downloads', value: stats.totalDownloads, colour: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} rounded-xl border border-gray-200 p-4`}>
                  <p className={`text-3xl font-bold ${stat.colour} mb-1`}>{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
            {(['articles', 'downloads'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                  tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Articles table */}
          {tab === 'articles' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Articles</h2>
                <button
                  disabled
                  className="text-sm bg-gray-100 text-gray-400 px-4 py-1.5 rounded-lg cursor-not-allowed"
                  title="Article editor coming in Stage 2"
                >
                  + Add Article
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Access</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Featured</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Published</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {articles.map(article => (
                        <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900 text-sm leading-snug">{article.title}</p>
                            {article.reviewerName && (
                              <p className="text-xs text-gray-400 mt-0.5">Reviewed by {article.reviewerName}</p>
                            )}
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLOURS[article.category] || 'bg-gray-100 text-gray-600'}`}>
                              {CATEGORY_LABELS[article.category] || article.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="text-xs text-gray-500">{article.accessLevel}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => toggleFeatured(article.id, article.isFeatured)}
                              disabled={updating === article.id}
                              className={`text-lg transition-opacity ${updating === article.id ? 'opacity-50' : ''}`}
                              title={article.isFeatured ? 'Remove from featured' : 'Add to featured'}
                            >
                              {article.isFeatured ? 'Yes' : 'No'}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => togglePublish(article.id, article.isPublished)}
                              disabled={updating === article.id}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
                                article.isPublished ? 'bg-pink-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                article.isPublished ? 'translate-x-4' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/eatstrong/articles/${article.slug}`}
                              className="text-xs font-medium hover:opacity-80" style={{ color: '#A41C64' }}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {articles.length === 0 && (
                    <div className="p-12 text-center text-gray-400 text-sm">No articles found. Run the database seed to populate EatStrong content.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Downloads table */}
          {tab === 'downloads' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Downloads &amp; Templates</h2>
              </div>
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {downloads.map(dl => (
                    <div key={dl.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLOURS[dl.category] || 'bg-gray-100 text-gray-600'}`}>
                            {CATEGORY_LABELS[dl.category] || dl.category}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">{dl.fileType}</span>
                          {dl.accessLevel === 'FREE' && (
                            <span className="text-xs font-medium" style={{ color: '#A41C64' }}>Free</span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{dl.title}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        dl.isPublished ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {dl.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  ))}
                  {downloads.length === 0 && (
                    <div className="p-12 text-center text-gray-400 text-sm">No downloads found.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Note */}
          <p className="text-xs text-gray-400 text-center mt-6">
            Full article and download editing available in Stage 2. Use the toggles to publish/feature articles.
          </p>
        </div>
      </div>
    </div>
  );
}
