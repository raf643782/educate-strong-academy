import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { KNOWLEDGE_ARTICLES, KNOWLEDGE_CATEGORIES, type KnowledgeArticle } from '../../data/knowledgeArticles';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import BreadcrumbSchema from '../../components/content/BreadcrumbSchema';

const LEVEL_COLOUR: Record<string, string> = {
  Foundation:  'badge-accent',
  Coaching:    'badge-accent',
  Refereeing:  'badge-grey',
  Advanced:    'badge-amber',
  Youth:       'badge-amber',
  Nutrition:   'badge-grey',
};

/**
 * Pure content — no Navbar/Footer. Accepts the already-resolved article
 * as a prop so it can be reused by the build-time prerender (entry-server
 * renderShell) and the client route without duplicating rendering logic.
 */
export function KnowledgeArticleContent({ article }: { article: KnowledgeArticle }) {
  const categoryLabel = KNOWLEDGE_CATEGORIES.find(c => c.id === article.category)?.label || article.category;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Knowledge Hub', path: '/knowledge' },
          { name: article.title, path: `/knowledge/${article.slug}` },
        ]}
      />
      {/* Article header */}
      <div className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-5" style={{ color: '#A41C64' }}>
            <Link to="/knowledge" className="hover:text-white transition-colors" style={{ color: '#A41C64' }}>Knowledge Hub</Link>
            <span className="text-es-subtle">/</span>
            <span style={{ color: '#A41C64' }}>{categoryLabel}</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <span className={LEVEL_COLOUR[article.level] || 'badge-grey'}>{article.level}</span>
            <span className="text-xs text-es-subtle">{article.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            {article.title}
          </h1>
          <p className="text-es-muted text-lg leading-relaxed max-w-2xl">{article.summary}</p>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {article.body.split('\n\n').map((para, i) => (
            <p key={i} className="text-es-muted leading-relaxed text-base">{para}</p>
          ))}
          <div style={{ borderTop: '1px solid #2C2C2C', marginTop: '24px', paddingTop: '16px' }}>
            <p className="text-xs text-es-subtle italic">
              Content reviewed by the Educate.Strong coaching team. This article is for educational reference — it does not replace qualified instruction or professional coaching.
            </p>
          </div>
        </div>

        {/* Soft paywall CTA — free overview, paid depth */}
        <div
          className="mt-10 rounded-xl p-6"
          style={{ background: 'rgba(164,28,100,0.06)', border: '1px solid rgba(164,28,100,0.2)' }}
        >
          <p className="font-bold text-white mb-2">Want the full coaching framework?</p>
          <p className="text-es-muted text-sm leading-relaxed mb-4">
            This topic is covered in depth inside the Level 1 Coaching Strongman course.
          </p>
          <Link to="/courses/level-1-coaching-strongman" className="text-sm font-semibold" style={{ color: '#A41C64' }}>
            Explore the Level 1 Coaching course →
          </Link>
        </div>

        {/* Related content */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #2C2C2C' }}>
          <h3 className="font-bold text-es-muted mb-4 text-sm uppercase tracking-wide">
            Related resources
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              to={`/knowledge?category=${article.category}`}
              className="flex items-center gap-3 es-card p-4 hover:border-es-accent transition-colors"
            >
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.2)' }}>
                <svg className="w-4 h-4" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-es-subtle mb-0.5">More in</p>
                <p className="text-sm font-semibold text-white">{categoryLabel}</p>
              </div>
            </Link>
            <Link
              to="/courses"
              className="flex items-center gap-3 es-card p-4 hover:border-es-accent transition-colors"
            >
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(225,154,71,0.1)', border: '1px solid rgba(225,154,71,0.2)' }}>
                <svg className="w-4 h-4 text-es-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-es-subtle mb-0.5">Continue your development</p>
                <p className="text-sm font-semibold text-white">Coaching Qualifications</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Back navigation */}
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
    </>
  );
}

export default function KnowledgeArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = KNOWLEDGE_ARTICLES.find(a => a.slug === slug);

  useDocumentHead({
    title: article ? `${article.title} — Knowledge Hub` : 'Article Not Found',
    description: article?.summary,
  });

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white mb-2">Article not found</h2>
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
        <KnowledgeArticleContent article={article} />
      </main>
      <Footer />
    </div>
  );
}
