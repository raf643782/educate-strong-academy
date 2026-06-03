/**
 * EatStrong Hub — Educate.Strong's dedicated nutrition education section.
 *
 * NAMING NOTE: User-facing labels use "EatStrong". Internal routes and
 * database model names remain "bestrong" / "BeStrong" to avoid a breaking
 * database migration. If the brand name is confirmed and a migration is
 * planned, run: prisma migrate dev --name rename_bestrong_to_eatstrong
 *
 * TRADEMARK NOTE: "EatStrong" (eatstrong.com) is a pre-existing US company.
 * Educate.Strong should verify UK trademark clearance before committing to
 * this name publicly.
 */
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

// Left accent bar colour per category — no emojis, just a visual identity marker
const CATEGORY_ACCENT: Record<string, string> = {
  green:  'border-l-green-500',
  amber:  'border-l-amber-500',
  blue:   'border-l-blue-500',
  purple: 'border-l-purple-500',
  cyan:   'border-l-cyan-500',
  red:    'border-l-red-500',
  indigo: 'border-l-indigo-500',
  teal:   'border-l-teal-500',
  gray:   'border-l-gray-400',
};

const CATEGORY_TEXT: Record<string, string> = {
  green:  'text-green-700',
  amber:  'text-amber-700',
  blue:   'text-blue-700',
  purple: 'text-purple-700',
  cyan:   'text-cyan-700',
  red:    'text-red-700',
  indigo: 'text-indigo-700',
  teal:   'text-teal-700',
  gray:   'text-gray-600',
};

const SCOPE_DISCLAIMER =
  'EatStrong content provides general nutritional information for educational purposes only. ' +
  'It does not constitute personalised dietary advice. ' +
  'Coaches should refer athletes to a registered dietitian or registered nutritionist for individualised nutrition support.';

export default function EatStrongHub() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/be-strong/categories'),
      api.get('/be-strong/featured'),
    ])
      .then(([catRes, featRes]) => {
        setCategories(catRes.data);
        setFeatured(featRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-green-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Educate.Strong
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            EatStrong
          </h1>
          <p className="text-green-100 text-xl max-w-2xl leading-relaxed mb-8">
            Dedicated nutrition education for Strongman coaches and athletes.
            Evidence-based, practically focused, written with coach scope of
            practice at the centre.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            {['Strongman Nutrition', 'Competition Fuelling', 'Recovery', 'Making Weight', 'Hydration', 'Supplements'].map(tag => (
              <span
                key={tag}
                className="border border-green-700 rounded px-3 py-1 text-green-200 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Scope disclaimer */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-green-700 leading-relaxed">{SCOPE_DISCLAIMER}</p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Featured articles */}
          {featured.length > 0 && (
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Start here</h2>
              <p className="text-gray-500 text-sm mb-6">
                The most useful resources for coaches and athletes.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map(article => (
                  <Link
                    key={article.id}
                    to={`/eatstrong/articles/${article.slug}`}
                    className="group bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all p-5 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <CategoryLabel category={article.category} />
                      {article.accessLevel === 'FREE' && (
                        <span className="text-xs text-green-700 font-medium">Free</span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-800 transition-colors leading-snug mb-2 flex-1 text-sm">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      {article.readMinutes && (
                        <span className="text-xs text-gray-400">{article.readMinutes} min read</span>
                      )}
                      <span className="text-xs text-green-700 font-semibold ml-auto">
                        Read article
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Category grid */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Browse by topic</h2>
            <p className="text-gray-500 text-sm mb-6">
              All EatStrong content, organised by subject.
            </p>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse h-28"
                  />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => {
                  const accent = CATEGORY_ACCENT[cat.colour] || 'border-l-gray-400';
                  const textColour = CATEGORY_TEXT[cat.colour] || 'text-gray-700';
                  return (
                    <Link
                      key={cat.key}
                      to={`/eatstrong/category/${cat.key.toLowerCase()}`}
                      className={`group bg-white rounded-lg border border-gray-200 border-l-4 ${accent} hover:shadow-sm transition-all p-5`}
                    >
                      <h3 className={`font-bold text-sm ${textColour} mb-2 group-hover:underline`}>
                        {cat.label}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {cat.articleCount > 0 && (
                          <span>{cat.articleCount} article{cat.articleCount !== 1 ? 's' : ''}</span>
                        )}
                        {cat.downloadCount > 0 && (
                          <span>{cat.downloadCount} download{cat.downloadCount !== 1 ? 's' : ''}</span>
                        )}
                        {cat.totalCount === 0 && <span className="italic">Coming soon</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Course connection */}
          <section>
            <div className="bg-green-900 text-white rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">
                  EatStrong connects to your coaching qualifications
                </h3>
                <p className="text-green-200 text-sm leading-relaxed">
                  Nutrition content appears as contextual prompts throughout the
                  Level 1, Level 2, and Level 3 coaching courses — so the right
                  resource appears at the right moment during your learning.
                </p>
              </div>
              <Link
                to="/courses"
                className="flex-shrink-0 bg-white text-green-900 font-semibold px-6 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm"
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

function CategoryLabel({ category }: { category: string }) {
  const labels: Record<string, string> = {
    BASICS:          'Nutrition Basics',
    COMPETITION:     'Competition',
    RECOVERY:        'Recovery',
    MAKING_WEIGHT:   'Making Weight',
    HYDRATION:       'Hydration',
    SUPPLEMENTS:     'Supplements',
    COACHES_GUIDE:   "Coaches' Guide",
    YOUTH_NUTRITION: 'Youth',
    DOWNLOADS:       'Downloads',
  };
  return (
    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded font-medium">
      {labels[category] || category}
    </span>
  );
}
