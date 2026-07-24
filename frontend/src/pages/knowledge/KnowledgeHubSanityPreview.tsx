/**
 * Stage 1 Sanity proof-of-concept — NOT linked in any navigation.
 *
 * Lists Knowledge Hub articles from Sanity, in parallel with (and without
 * touching) the live, hardcoded /knowledge pages. Once Stage 2 rewires the
 * real Knowledge Hub pages to Sanity, this preview route can be retired.
 *
 * Named "...Sanity..." (not just "KnowledgeHubPreview") to avoid clashing
 * with the unrelated homepage section component at
 * components/sections/KnowledgeHubPreview.tsx.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { getPublishedKnowledgeArticles, isSanityConfigured, type SanityKnowledgeArticle } from '../../lib/sanity';

export default function KnowledgeHubSanityPreview() {
  useDocumentHead({
    title: 'Knowledge Hub Preview (Sanity)',
    description: 'Internal Stage 1 preview of Sanity-powered Knowledge Hub content. Not linked in navigation.',
  });

  const [articles, setArticles] = useState<SanityKnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSanityConfigured) {
      setError('Sanity is not configured yet. Add VITE_SANITY_PROJECT_ID (and related env vars) to enable this preview — see frontend/.env.local.');
      setLoading(false);
      return;
    }
    getPublishedKnowledgeArticles()
      .then(setArticles)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load articles from Sanity.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      <section className="pt-navbar es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Internal Preview — Stage 1</p>
          <h1 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.04em' }}>
            Knowledge Hub (Sanity Preview)
          </h1>
          <p className="text-es-muted max-w-xl">
            This route renders Knowledge Hub content from Sanity as a proof of concept. It does not
            affect the live Knowledge Hub at <code>/knowledge</code>.
          </p>
        </div>
      </section>

      <div className="es-section flex-1">
        <div className="es-container">
          {loading && <p className="text-es-muted">Loading…</p>}

          {!loading && error && (
            <div className="es-card p-6">
              <p className="font-semibold text-white mb-1">Not available yet</p>
              <p className="text-es-muted text-sm leading-relaxed">{error}</p>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="es-card text-center py-16">
              <p className="text-es-muted mb-2">No published articles found in Sanity yet.</p>
              <p className="text-es-subtle text-sm">Add and publish articles in Sanity Studio to see them here.</p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map(article => (
                <div key={article._id} className="es-card-hover flex flex-col p-5">
                  <h3 className="font-bold text-white text-base leading-snug mb-2 flex-1">{article.title}</h3>
                  <p className="text-es-muted text-sm leading-relaxed mb-4">{article.metaDescription}</p>
                  <Link to={`/knowledge-hub-preview/${article.slug}`} className="btn-secondary text-sm text-center">
                    Read Article
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
