import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

interface Category {
  key: string;
  label: string;
  description: string;
  colour: string;
  articleCount: number;
  downloadCount: number;
  totalCount: number;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary?: string;
  readMinutes?: number;
  accessLevel: string;
  isFeatured: boolean;
}

const COLOUR_MAP: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  green:  { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200', icon: '🥦' },
  amber:  { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200', icon: '⚡' },
  blue:   { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',  icon: '🔄' },
  purple: { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200',icon: '⚖️' },
  cyan:   { bg: 'bg-cyan-50',    text: 'text-cyan-700',   border: 'border-cyan-200',  icon: '💧' },
  red:    { bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200',   icon: '🔬' },
  indigo: { bg: 'bg-indigo-50',  text: 'text-indigo-700', border: 'border-indigo-200',icon: '💬' },
  teal:   { bg: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-200',  icon: '🌱' },
  gray:   { bg: 'bg-gray-50',    text: 'text-gray-700',   border: 'border-gray-200',  icon: '📥' },
};

const SCOPE_DISCLAIMER = `Be Strong articles provide general nutritional information for educational purposes only. They do not constitute personalised dietary advice. Coaches should refer athletes to a registered dietitian or registered nutritionist for individualised nutrition support.`;

export default function BeStrongHub() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/be-strong/categories'),
      api.get('/be-strong/featured'),
    ]).then(([catRes, featRes]) => {
      setCategories(catRes.data);
      setFeatured(featRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero — green palette to distinguish Be Strong from the rest of the platform */}
      <section className="bg-green-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💚</span>
            <span className="text-green-300 text-sm font-semibold uppercase tracking-widest">Educate.Strong</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Be <span className="text-green-400">Strong</span>
          </h1>
          <p className="text-green-100 text-xl max-w-2xl leading-relaxed mb-6">
            Dedicated nutrition education for Strongman coaches and athletes. Evidence-based,
            practically focused, and written with coach scope of practice at the centre.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-green-800/60 border border-green-700 rounded-full px-4 py-1.5 text-green-200">Strongman Nutrition</span>
            <span className="bg-green-800/60 border border-green-700 rounded-full px-4 py-1.5 text-green-200">Competition Fuelling</span>
            <span className="bg-green-800/60 border border-green-700 rounded-full px-4 py-1.5 text-green-200">Recovery</span>
            <span className="bg-green-800/60 border border-green-700 rounded-full px-4 py-1.5 text-green-200">Templates</span>
          </div>
        </div>
      </section>

      {/* Scope disclaimer banner */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-start gap-3">
          <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-green-700 leading-relaxed">{SCOPE_DISCLAIMER}</p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Featured articles */}
          {featured.length > 0 && (
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start here</h2>
              <p className="text-gray-500 mb-6">The most useful resources for coaches and athletes.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map(article => (
                  <Link
                    key={article.id}
                    to={`/be-strong/articles/${article.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all p-5 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <CategoryPill category={article.category} />
                      {article.accessLevel === 'FREE' && (
                        <span className="text-xs text-green-600 font-medium">Free</span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-snug mb-2 flex-1">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{article.summary}</p>
                    )}
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium mt-auto">
                      {article.readMinutes && <span className="text-gray-400 text-xs mr-auto">{article.readMinutes} min read</span>}
                      <span className="group-hover:translate-x-0.5 transition-transform">Read →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Category grid */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by topic</h2>
            <p className="text-gray-500 mb-6">Everything in Be Strong, organised by subject.</p>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-32" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => {
                  const colours = COLOUR_MAP[cat.colour] || COLOUR_MAP.gray;
                  return (
                    <Link
                      key={cat.key}
                      to={`/be-strong/category/${cat.key.toLowerCase()}`}
                      className={`group rounded-xl border ${colours.border} ${colours.bg} hover:shadow-md transition-all p-5`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">{colours.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold ${colours.text} leading-snug group-hover:underline`}>
                            {cat.label}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {cat.articleCount > 0 && <span>{cat.articleCount} article{cat.articleCount !== 1 ? 's' : ''}</span>}
                        {cat.downloadCount > 0 && <span>{cat.downloadCount} download{cat.downloadCount !== 1 ? 's' : ''}</span>}
                        {cat.totalCount === 0 && <span className="italic">Coming soon</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Connection to courses callout */}
          <section>
            <div className="bg-green-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Be Strong connects to your coaching qualifications</h3>
                <p className="text-green-200 text-sm leading-relaxed">
                  Nutrition content appears as contextual prompts throughout the Level 1, Level 2, and Level 3
                  coaching courses — so the right resource appears exactly when you need it during your learning.
                </p>
              </div>
              <Link
                to="/courses"
                className="flex-shrink-0 bg-white text-green-900 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors text-sm"
              >
                Explore Coaching Courses
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// Small inline pill showing category name
function CategoryPill({ category }: { category: string }) {
  const labels: Record<string, string> = {
    BASICS: 'Nutrition Basics',
    COMPETITION: 'Competition',
    RECOVERY: 'Recovery',
    MAKING_WEIGHT: 'Making Weight',
    HYDRATION: 'Hydration',
    SUPPLEMENTS: 'Supplements',
    COACHES_GUIDE: 'Coaches\' Guide',
    YOUTH_NUTRITION: 'Youth',
    DOWNLOADS: 'Downloads',
  };
  return (
    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
      {labels[category] || category}
    </span>
  );
}
