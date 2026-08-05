import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { KNOWLEDGE_ARTICLES, KNOWLEDGE_CATEGORIES } from '../../data/knowledgeArticles';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { SITE_URL } from '../../lib/siteUrl';

const CATEGORIES = KNOWLEDGE_CATEGORIES;

const LEVEL_COLOUR: Record<string, string> = {
  Foundation:  'badge-accent',
  Coaching:    'badge-accent',
  Refereeing:  'badge-grey',
  Advanced:    'badge-amber',
  Youth:       'badge-amber',
  Nutrition:   'badge-grey',
};

export function KnowledgeHubContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.some(c => c.id === categoryParam) ? categoryParam : 'all'
  );

  useEffect(() => {
    const next = searchParams.get('category') || 'all';
    setActiveCategory(CATEGORIES.some(c => c.id === next) ? next : 'all');
  }, [searchParams]);

  function selectCategory(id: string) {
    setActiveCategory(id);
    if (id === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: id });
    }
  }

  const filtered = activeCategory === 'all'
    ? KNOWLEDGE_ARTICLES
    : KNOWLEDGE_ARTICLES.filter(a => a.category === activeCategory);

  return (
    <>
      {/* Header */}
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

      {/* Category filters */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4 flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={`px-4 py-3 rounded text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'text-es-muted hover:text-white border border-es-grey-dark hover:border-es-accent'
              }`}
              style={activeCategory === cat.id ? { background: '#A41C64', border: '1px solid rgba(164,28,100,0.6)' } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="es-section flex-1">
        <div className="es-container">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-es-muted">
              {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="es-card text-center py-16">
              <p className="text-es-muted mb-2">No articles in this category yet.</p>
              <p className="text-es-subtle text-sm">Content is being developed — check back soon.</p>
              <button onClick={() => selectCategory('all')} className="btn-secondary text-sm mt-4">
                View all resources
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(article => (
                <div key={article.id} className="es-card-hover flex flex-col p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={LEVEL_COLOUR[article.level] || 'badge-grey'}>{article.level}</span>
                    <span className="text-xs text-es-subtle">{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug mb-2 flex-1">{article.title}</h3>
                  <p className="text-es-muted text-sm leading-relaxed mb-4">{article.summary}</p>
                  <Link
                    to={`/knowledge/${article.slug}`}
                    className="btn-secondary text-sm text-center"
                  >
                    Read Article
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
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

    </>
  );
}

export default function KnowledgeHub() {
  useDocumentHead({
    title: 'Knowledge Hub',
    description: 'Practical articles, coaching guides, and evidence-based resources for Strongman coaches, referees, and athletes.',
    canonical: `${SITE_URL}/knowledge`,
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <main className="flex-1">
        <KnowledgeHubContent />
      </main>
      <Footer />
    </div>
  );
}
