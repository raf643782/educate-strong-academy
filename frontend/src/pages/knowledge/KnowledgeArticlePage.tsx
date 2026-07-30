import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { getKnowledgeArticleBySlug, isSanityConfigured, type SanityKnowledgeArticle } from '../../lib/sanity';
import { isApprovedKnowledgeSlug } from '../../lib/approvedKnowledgeArticles';
import PortableTextRenderer from '../../components/knowledge/PortableTextRenderer';
import FaqAccordion from '../../components/knowledge/FaqAccordion';
import PublicReferencesList from '../../components/knowledge/PublicReferencesList';

const CANONICAL_ORIGIN = 'https://educate-strong-academy.vercel.app';

export default function KnowledgeArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const approved = Boolean(slug && isApprovedKnowledgeSlug(slug));

  const [article, setArticle] = useState<SanityKnowledgeArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useDocumentHead({
    title: article ? article.seoTitle || article.title : 'Article Not Found',
    description: article?.metaDescription,
    canonical: article ? `${CANONICAL_ORIGIN}/knowledge/${article.slug}` : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    if (!approved) {
      setLoading(false);
      return;
    }
    if (!isSanityConfigured) {
      setError('Knowledge Hub content is not available right now.');
      setLoading(false);
      return;
    }
    setLoading(true);
    getKnowledgeArticleBySlug(slug)
      .then(setArticle)
      .catch(() => setError('Failed to load this article.'))
      .finally(() => setLoading(false));
  }, [slug, approved]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-es-muted">Loading…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!approved || error || !article) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white mb-2">Article not found</h2>
            {error && <p className="text-es-muted text-sm mb-4">{error}</p>}
            <Link to="/knowledge" className="text-sm font-medium" style={{ color: '#A41C64' }}>
              Back to Knowledge Hub
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      <main className="flex-1">
        <div className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <nav className="flex items-center gap-2 text-xs mb-5" style={{ color: '#A41C64' }}>
              <Link to="/knowledge" className="hover:text-white transition-colors" style={{ color: '#A41C64' }}>
                Knowledge Hub
              </Link>
              {article.pathway && (
                <>
                  <span className="text-es-subtle">/</span>
                  <span style={{ color: '#A41C64' }}>{article.pathway.title}</span>
                </>
              )}
            </nav>

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
              {article.h1 || article.title}
            </h1>
            {article.metaDescription && (
              <p className="text-es-muted text-lg leading-relaxed max-w-2xl">{article.metaDescription}</p>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PortableTextRenderer value={article.body} />

          {article.faq && article.faq.length > 0 && (
            <div className="mt-12 pt-8" style={{ borderTop: '1px solid #2C2C2C' }}>
              <h3 className="font-bold text-white mb-4 text-lg">Frequently Asked Questions</h3>
              <FaqAccordion items={article.faq} />
            </div>
          )}

          <PublicReferencesList items={article.publicReferences} />

          {article.cta?.ctaText && (
            <div
              className="mt-10 rounded-xl p-6"
              style={{ background: 'rgba(164,28,100,0.06)', border: '1px solid rgba(164,28,100,0.2)' }}
            >
              <p className="text-es-muted text-sm leading-relaxed">{article.cta.ctaText}</p>
              {article.cta.destinationUrl && (
                <Link to={article.cta.destinationUrl} className="text-sm font-semibold" style={{ color: '#A41C64' }}>
                  Learn more →
                </Link>
              )}
            </div>
          )}

          <div className="mt-10">
            <Link
              to="/knowledge"
              className="font-medium flex items-center gap-1 text-sm"
              style={{ color: '#A41C64' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Knowledge Hub
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
