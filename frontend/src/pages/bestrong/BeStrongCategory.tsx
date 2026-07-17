import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { CONTACT_EMAIL } from '../../lib/contact';
import { useDocumentHead } from '../../hooks/useDocumentHead';

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
  locked?: boolean;
}

interface Download {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fileType: string;
  accessLevel: string;
  locked?: boolean;
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
  basics:          'BASICS',
  competition:     'COMPETITION',
  recovery:        'RECOVERY',
  making_weight:   'MAKING_WEIGHT',
  hydration:       'HYDRATION',
  supplements:     'SUPPLEMENTS',
  coaches_guide:   'COACHES_GUIDE',
  youth_nutrition: 'YOUTH_NUTRITION',
  downloads:       'DOWNLOADS',
};

export default function EatStrongCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const categoryKey = CATEGORY_KEY_MAP[categorySlug || ''] || (categorySlug || '').toUpperCase();

  const [articles, setArticles] = useState<Article[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [categoryMeta, setCategoryMeta] = useState<CategoryMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadMsgId, setDownloadMsgId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get(`/be-strong/articles?category=${categoryKey}`),
      api.get(`/be-strong/downloads?category=${categoryKey}`),
      api.get('/be-strong/categories'),
    ])
      .then(([artRes, dlRes, catRes]) => {
        setArticles(artRes.data);
        setDownloads(dlRes.data);
        const meta = catRes.data.find((c: CategoryMeta) => c.key === categoryKey);
        setCategoryMeta(meta || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryKey]);

  const categoryLabel = categoryMeta?.label || categoryKey.replace(/_/g, ' ');

  useDocumentHead({
    title: `${categoryLabel} — EatStrong`,
    description: categoryMeta?.description,
    canonical: categorySlug ? `https://educate-strong-academy.vercel.app/eatstrong/category/${categorySlug}` : undefined,
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      <section className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-12">
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: '#A41C64' }}>
            <Link to="/eatstrong" className="hover:text-white transition-colors" style={{ color: '#A41C64' }}>EatStrong</Link>
            <span className="text-es-subtle">/</span>
            <span className="text-white">{categoryLabel}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.03em' }}>{categoryLabel}</h1>
          {categoryMeta?.description && (
            <p className="text-es-muted max-w-2xl text-base leading-relaxed">
              {categoryMeta.description}
            </p>
          )}
        </div>
      </section>

      <div style={{ background: 'rgba(225,154,71,0.06)', borderBottom: '1px solid rgba(225,154,71,0.2)' }}>
        <div className="es-container py-2.5">
          <p className="text-xs leading-relaxed" style={{ color: '#E19A47', opacity: 0.85 }}>
            EatStrong content is for educational awareness only. For individualised dietary
            advice, refer athletes to a registered dietitian or registered nutritionist.
          </p>
        </div>
      </div>

      <main className="flex-1" style={{ background: '#0D0D0D' }}>
        <div className="es-container py-10">

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="es-card p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : (
            <>
              {/* Articles */}
              {articles.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-lg font-black text-white mb-4">
                    Articles
                    <span className="ml-2 text-sm font-normal text-es-subtle">{articles.length}</span>
                  </h2>
                  <div className="space-y-3">
                    {articles.map(article => (
                      <Link
                        key={article.id}
                        to={`/eatstrong/articles/${article.slug}`}
                        className="group block es-card-hover p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {article.accessLevel === 'FREE' && (
                                <span className="badge-grey text-xs">Free</span>
                              )}
                              {article.accessLevel !== 'FREE' && article.locked && (
                                <span className="badge-accent text-xs">Learner pathway</span>
                              )}
                              {article.isFeatured && (
                                <span className="badge-amber text-xs">Featured</span>
                              )}
                            </div>
                            <h3 className="font-bold text-white leading-snug mb-1">
                              {article.title}
                            </h3>
                            {article.summary && (
                              <p className="text-es-muted text-sm leading-relaxed line-clamp-2">
                                {article.summary}
                              </p>
                            )}
                            {article.reviewerName && (
                              <p className="text-xs text-es-subtle mt-2">
                                Reviewed by {article.reviewerName}
                                {article.reviewerQualification && ` — ${article.reviewerQualification}`}
                                {article.lastReviewedAt &&
                                  ` · ${new Date(article.lastReviewedAt).toLocaleDateString('en-GB', {
                                    month: 'long',
                                    year: 'numeric',
                                  })}`}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-right">
                            {article.readMinutes && (
                              <p className="text-xs text-es-subtle mb-1">{article.readMinutes} min</p>
                            )}
                            <span className="text-xs font-semibold" style={{ color: '#A41C64' }}>Read</span>
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
                  <h2 className="text-lg font-black text-white mb-4">
                    Downloads and Templates
                    <span className="ml-2 text-sm font-normal text-es-subtle">{downloads.length}</span>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {downloads.map(dl => (
                      <div key={dl.id} className="es-card p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.2)' }}>
                            <svg className="w-5 h-5" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="badge-grey text-xs">{dl.fileType}</span>
                              {dl.accessLevel === 'FREE' && (
                                <span className="text-xs text-es-muted">Free</span>
                              )}
                              {dl.locked && (
                                <span className="text-xs font-semibold" style={{ color: '#E19A47' }}>In the learner pathway</span>
                              )}
                            </div>
                            <h3 className="font-semibold text-white text-sm leading-snug mb-1">
                              {dl.title}
                            </h3>
                            {dl.description && (
                              <p className="text-xs text-es-muted leading-relaxed">{dl.description}</p>
                            )}
                            {dl.locked ? (
                              <p className="mt-3 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                These templates are included inside the full learner pathway.{' '}
                                <Link to="/register-interest?type=general" className="font-semibold" style={{ color: '#A41C64' }}>
                                  Register your interest →
                                </Link>
                              </p>
                            ) : (
                              <>
                                <button
                                  className="mt-3 text-xs font-semibold" style={{ color: '#A41C64' }}
                                  onClick={() => setDownloadMsgId(prev => prev === dl.id ? null : dl.id)}
                                >
                                  Download {dl.fileType}
                                </button>
                                {downloadMsgId === dl.id && (
                                  <div
                                    className="mt-2 rounded-lg p-3 text-xs leading-relaxed"
                                    style={{ background: 'rgba(225,154,71,0.08)', border: '1px solid rgba(225,154,71,0.2)', color: '#E19A47' }}
                                  >
                                    Download files will be available once document hosting is configured. In the meantime, contact{' '}
                                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>
                                    {' '}to request this resource.
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {articles.length === 0 && downloads.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="font-semibold text-es-muted mb-2">Content coming soon</h3>
                  <p className="text-es-subtle text-sm">
                    More EatStrong resources are being developed for this category.
                  </p>
                  <Link
                    to="/eatstrong"
                    className="text-sm font-medium mt-4 inline-block"
                    style={{ color: '#A41C64' }}
                  >
                    Back to EatStrong
                  </Link>
                </div>
              )}

              <div className="mt-8">
                <Link
                  to="/eatstrong"
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: '#A41C64' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to EatStrong
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
