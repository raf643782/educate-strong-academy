import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { getPublishedKnowledgeArticles, isSanityConfigured, type SanityKnowledgeArticle } from '../../lib/sanity';

const CANONICAL_URL = 'https://educate-strong-academy.vercel.app/knowledge';

export default function KnowledgeHub() {
  useDocumentHead({
    title: 'Knowledge Hub',
    description: 'Practical articles, coaching guides, and evidence-based resources for Strongman coaches, referees, and athletes.',
    canonical: CANONICAL_URL,
  });

  const [articles, setArticles] = useState<SanityKnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSanityConfigured) {
      setError('Knowledge Hub content is not available right now.');
      setLoading(false);
      return;
    }
    getPublishedKnowledgeArticles()
      .then(setArticles)
      .catch(() => setError('Failed to load Knowledge Hub articles.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      <section className="pt-navbar es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Knowledge Hub</p>
          <h1 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.04em' }}>
            Coaching Intelligence
          </h1>
          <p className="text-es-muted max-w-xl">
            Practical articles, coaching guides, and evidence-based resources for Strongman coaches, referees, and athletes.
          </p>
        </div>
      </section>

      <div className="es-section flex-1">
        <div className="es-container">
          {loading && <p className="text-es-muted">Loading…</p>}

          {!loading && error && (
            <div className="es-card text-center py-16">
              <p className="text-es-muted mb-2">{error}</p>
              <p className="text-es-subtle text-sm">Check back soon.</p>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="es-card text-center py-16">
              <p className="text-es-muted mb-2">No articles available yet.</p>
              <p className="text-es-subtle text-sm">Content is being developed — check back soon.</p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <>
              <p className="text-sm text-es-muted mb-6">
                {articles.length} resource{articles.length !== 1 ? 's' : ''}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.map(article => (
                  <div key={article._id} className="es-card-hover flex flex-col p-5">
                    {article.pathway && (
                      <span className="badge-accent mb-3 self-start">{article.pathway.title}</span>
                    )}
                    <h3 className="font-bold text-white text-base leading-snug mb-2 flex-1">{article.title}</h3>
                    <p className="text-es-muted text-sm leading-relaxed mb-4">{article.metaDescription}</p>
                    <Link to={`/knowledge/${article.slug}`} className="btn-secondary text-sm text-center">
                      Read Article
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <section style={{ background: '#111111', borderTop: '1px solid #2C2C2C' }}>
        <div className="es-container py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-white mb-1">More resources coming soon</h3>
              <p className="text-es-muted text-sm">The Knowledge Hub grows with every course cohort and coaching insight.</p>
            </div>
            <Link to="/courses" className="btn-primary text-sm flex-shrink-0">Explore Courses</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
