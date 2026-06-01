import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import api from '../../lib/api';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary?: string;
  readMinutes?: number;
  isPublished: boolean;
}

const allCategories = [
  { name: 'Event Technique', phase: 'launch' },
  { name: 'Safe Practice', phase: 'launch' },
  { name: 'Programming', phase: 'launch' },
  { name: 'Competition Preparation', phase: 'launch' },
  { name: 'Recovery', phase: 2 },
  { name: 'Nutrition for Coaches', phase: 2 },
  { name: 'Refereeing and Rules Literacy', phase: 2 },
  { name: 'Youth Strength and StrongKidz', phase: 2 },
  { name: 'Coaching Skills and Professional Practice', phase: 2 },
  { name: 'Sports Science for Coaches', phase: 3 },
];

export default function KnowledgeHub() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/knowledge')
      .then(res => setArticles(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const categoryCount: Record<string, number> = {};
  for (const a of articles) {
    categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Knowledge Hub</h1>
          <p className="text-gray-400 text-lg">Professional Strongman coaching resources, articles, and technical references.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-lg">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category cards */}
        {!search && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allCategories.map(cat => {
                const count = categoryCount[cat.name] || 0;
                const isPhase2or3 = cat.phase === 2 || cat.phase === 3;
                return (
                  <div
                    key={cat.name}
                    className={`border rounded-xl p-5 ${isPhase2or3 ? 'border-dashed border-gray-200 bg-gray-50 opacity-75' : 'border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer hover:border-amber-200'}`}
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{cat.name}</h3>
                    {isPhase2or3 ? (
                      <span className="text-xs text-gray-400">Phase {cat.phase} — Coming soon</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">{count} article{count !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {search ? `Results for "${search}"` : 'Latest Articles'}
            </h2>
            {!search && <span className="text-sm text-gray-500">{articles.length} articles</span>}
          </div>

          {loading ? (
            <p className="text-gray-400">Loading articles...</p>
          ) : filtered.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">No articles found.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(article => (
                <Card key={article.id} padding="none" className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2.5 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      {article.readMinutes && (
                        <span className="text-xs text-gray-400">{article.readMinutes} min read</span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 leading-snug">{article.title}</h3>
                    {article.summary && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{article.summary}</p>
                    )}
                  </div>
                  <div className="px-6 pb-5">
                    <button className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                      Read article &rarr;
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
