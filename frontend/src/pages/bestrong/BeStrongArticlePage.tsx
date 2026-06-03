import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  summary?: string;
  content?: string;
  authorName?: string;
  reviewerName?: string;
  reviewerQualification?: string;
  lastReviewedAt?: string;
  scopeOfPracticeNote?: string;
  accessLevel: string;
  readMinutes?: number;
  tags?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  BASICS:          'Strongman Nutrition Basics',
  COMPETITION:     'Competition Nutrition',
  RECOVERY:        'Recovery Nutrition',
  MAKING_WEIGHT:   'Making Weight',
  HYDRATION:       'Hydration',
  SUPPLEMENTS:     'Supplements',
  COACHES_GUIDE:   'Nutrition for Coaches',
  YOUTH_NUTRITION: 'Youth Nutrition',
  DOWNLOADS:       'Downloads',
};

const CATEGORY_SLUG: Record<string, string> = {
  BASICS:          'basics',
  COMPETITION:     'competition',
  RECOVERY:        'recovery',
  MAKING_WEIGHT:   'making_weight',
  HYDRATION:       'hydration',
  SUPPLEMENTS:     'supplements',
  COACHES_GUIDE:   'coaches_guide',
  YOUTH_NUTRITION: 'youth_nutrition',
  DOWNLOADS:       'downloads',
};

export default function EatStrongArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get(`/be-strong/articles/${slug}`)
      .then(res => setArticle(res.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading article...
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h2>
            <Link to="/eatstrong" className="text-green-700 hover:text-green-800 text-sm font-medium">
              Back to EatStrong
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categorySlug = CATEGORY_SLUG[article.category] || article.category.toLowerCase();
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-white">
        {/* Article header */}
        <div className="bg-green-900 text-white py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-green-300 text-xs mb-5">
              <Link to="/eatstrong" className="hover:text-white transition-colors">EatStrong</Link>
              <span>/</span>
              <Link
                to={`/eatstrong/category/${categorySlug}`}
                className="hover:text-white transition-colors"
              >
                {categoryLabel}
              </Link>
            </nav>

            <div className="mb-3">
              <span className="text-xs border border-green-700 text-green-300 px-2.5 py-1 rounded font-medium">
                {categoryLabel}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 tracking-tight">
              {article.title}
            </h1>
            {article.summary && (
              <p className="text-green-100 text-lg leading-relaxed max-w-2xl">{article.summary}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-5 text-sm text-green-300">
              {article.readMinutes && <span>{article.readMinutes} min read</span>}
              {article.reviewerName && (
                <span>
                  Reviewed by{' '}
                  <strong className="text-green-200 font-semibold">{article.reviewerName}</strong>
                  {article.reviewerQualification && ` · ${article.reviewerQualification}`}
                </span>
              )}
              {article.lastReviewedAt && (
                <span>
                  Last reviewed:{' '}
                  {new Date(article.lastReviewedAt).toLocaleDateString('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scope of practice note */}
        {article.scopeOfPracticeNote && (
          <div className="bg-green-50 border-b border-green-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <p className="text-xs text-green-700 leading-relaxed">{article.scopeOfPracticeNote}</p>
            </div>
          </div>
        )}

        {/* Article body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-none">
            {article.content ? (
              article.content.split('\n').map((para, i) => {
                if (!para.trim()) return <div key={i} className="h-3" />;
                if (para.startsWith('•')) {
                  return (
                    <div key={i} className="flex items-start gap-2 my-1.5 ml-4">
                      <span className="text-green-600 mt-1 text-xs flex-shrink-0">—</span>
                      <span className="text-gray-700 leading-relaxed text-base">
                        {para.slice(1).trim()}
                      </span>
                    </div>
                  );
                }
                if (para.endsWith(':') && para.length < 80 && !para.startsWith(' ')) {
                  return (
                    <h3 key={i} className="text-base font-bold text-gray-900 mt-8 mb-3">
                      {para}
                    </h3>
                  );
                }
                return (
                  <p key={i} className="text-gray-700 leading-relaxed my-3 text-base">
                    {para}
                  </p>
                );
              })
            ) : (
              <p className="text-gray-400 italic text-sm">Content coming soon.</p>
            )}
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.split(',').map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Related content */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Related resources
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                to={`/eatstrong/category/${categorySlug}`}
                className="flex items-center gap-3 border border-green-200 rounded-lg p-4 hover:bg-green-50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">More in</p>
                  <p className="text-sm font-semibold text-green-800">{categoryLabel}</p>
                </div>
              </Link>
              <Link
                to="/courses"
                className="flex items-center gap-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Continue your development</p>
                  <p className="text-sm font-semibold text-gray-900">Coaching Qualifications</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Back navigation */}
          <div className="mt-10 flex items-center gap-4 text-sm">
            <Link
              to={`/eatstrong/category/${categorySlug}`}
              className="text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {categoryLabel}
            </Link>
            <span className="text-gray-300">·</span>
            <Link to="/eatstrong" className="text-gray-500 hover:text-gray-700">
              EatStrong hub
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
