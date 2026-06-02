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
  summary?: string;
  readMinutes?: number;
  accessLevel: string;
  isFeatured: boolean;
  reviewerName?: string;
  reviewerQualification?: string;
  lastReviewedAt?: string;
}

interface Download {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fileType: string;
  accessLevel: string;
}

interface CategoryMeta {
  key: string;
  label: string;
  description: string;
  colour: string;
  articleCount: number;
  downloadCount: number;
}

const CATEGORY_KEY_MAP: Record<string, string> = {
  basics:        'BASICS',
  competition:   'COMPETITION',
  recovery:      'RECOVERY',
  making_weight: 'MAKING_WEIGHT',
  hydration:     'HYDRATION',
  supplements:   'SUPPLEMENTS',
  coaches_guide: 'COACHES_GUIDE',
  youth_nutrition:'YOUTH_NUTRITION',
  downloads:     'DOWNLOADS',
};

export default function BeStrongCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const categoryKey = CATEGORY_KEY_MAP[categorySlug || ''] || (categorySlug || '').toUpperCase();

  const [articles, setArticles] = useState<Article[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [categoryMeta, setCategoryMeta] = useState<CategoryMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/be-strong/articles?category=${categoryKey}`),
      api.get(`/be-strong/downloads?category=${categoryKey}`),
      api.get('/be-strong/categories'),
    ]).then(([artRes, dlRes, catRes]) => {
      setArticles(artRes.data);
      setDownloads(dlRes.data);
      const meta = catRes.data.find((c: CategoryMeta) => c.key === categoryKey);
      setCategoryMeta(meta || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [categoryKey]);

  const categoryLabel = categoryMeta?.label || categoryKey.replace(/_/g, ' ');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Breadcrumb + header */}
      <section className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/be-strong" className="hover:text-white transition-colors">Be Strong</Link>
            <span>›</span>
            <span className="text-white">{categoryLabel}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{categoryLabel}</h1>
          {categoryMeta?.description && (
            <p className="text-green-200 text-lg max-w-2xl">{categoryMeta.description}</p>
          )}
        </div>
      </section>

      {/* Scope note */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-start gap-2">
          <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-green-700">
            Be Strong content is for educational awareness only. For individualised dietary advice, refer athletes to a registered dietitian or registered nutritionist.
          </p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse h-28" />
              ))}
            </div>
          ) : (
            <>
              {/* Articles */}
              {articles.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    Articles
                    <span className="ml-2 text-sm font-normal text-gray-400">{articles.length}</span>
                  </h2>
                  <div className="space-y-4">
                    {articles.map(article => (
                      <Link
                        key={article.id}
                        to={`/be-strong/articles/${article.slug}`}
                        className="group block bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-sm transition-all p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              {article.accessLevel === 'FREE' && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Free</span>
                              )}
                              {article.accessLevel === 'ENROLLED' && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Enrolled</span>
                              )}
                              {article.isFeatured && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Featured</span>
                              )}
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors text-lg leading-snug mb-1">
                              {article.title}
                            </h3>
                            {article.summary && (
                              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{article.summary}</p>
                            )}
                            {article.reviewerName && (
                              <p className="text-xs text-gray-400 mt-2">
                                Reviewed by {article.reviewerName}
                                {article.reviewerQualification && ` — ${article.reviewerQualification}`}
                                {article.lastReviewedAt && ` · ${new Date(article.lastReviewedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-right">
                            {article.readMinutes && (
                              <p className="text-xs text-gray-400 mb-2">{article.readMinutes} min</p>
                            )}
                            <span className="text-green-600 text-sm font-medium group-hover:translate-x-0.5 inline-block transition-transform">
                              Read →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Downloads */}
              {downloads.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    Downloads &amp; Templates
                    <span className="ml-2 text-sm font-normal text-gray-400">{downloads.length}</span>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {downloads.map(dl => (
                      <div key={dl.id} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{dl.fileType}</span>
                              {dl.accessLevel === 'FREE' && (
                                <span className="text-xs text-green-600 font-medium">Free</span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{dl.title}</h3>
                            {dl.description && (
                              <p className="text-xs text-gray-500 leading-relaxed">{dl.description}</p>
                            )}
                            <button
                              className="mt-3 text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
                              onClick={() => alert('Downloads available after full content integration')}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download {dl.fileType}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {articles.length === 0 && downloads.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">Content coming soon</h3>
                  <p className="text-gray-400 text-sm">More Be Strong resources are being developed for this category.</p>
                  <Link to="/be-strong" className="text-green-600 hover:text-green-700 text-sm font-medium mt-4 inline-block">
                    ← Back to Be Strong
                  </Link>
                </div>
              )}

              {/* Back link */}
              <div className="mt-8">
                <Link to="/be-strong" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Be Strong
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
