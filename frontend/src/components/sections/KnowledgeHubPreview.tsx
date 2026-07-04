import { Link } from 'react-router-dom';
import { KNOWLEDGE_ARTICLES } from '../../data/knowledgeArticles';

interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  competition: 'Competition Preparation',
  coaching:    'Event Technique',
  athlete:     'Safe Practice',
};

const PREVIEW_SLUGS = ['how-to-read-a-strongman-event-sheet', 'atlas-stone-technique', 'start-strongman-safely'];

const ARTICLES: Article[] = PREVIEW_SLUGS.map(slug => {
  const article = KNOWLEDGE_ARTICLES.find(a => a.slug === slug)!;
  return {
    slug: article.slug,
    category: CATEGORY_LABELS[article.category] || article.category,
    title: article.title,
    excerpt: article.summary,
    readTime: `${article.readTime} read`,
  };
});

function ArticleCard({ article }: { article: Article }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: '#151519',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(194,24,106,0.35)';
        el.style.boxShadow = '0 8px 40px rgba(164,28,100,0.16)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.style.boxShadow = '';
      }}
    >
      {/* Magenta top accent */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #A41C64, #C2186A)', flexShrink: 0 }} />

      <div className="p-6 flex flex-col flex-1">
        {/* Category pill */}
        <span
          className="self-start text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full mb-4"
          style={{ background: 'rgba(194,24,106,0.12)', color: '#C2186A' }}
        >
          {article.category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-[#F5F5F7] text-base leading-snug mb-3 flex-1">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[#75757D] leading-relaxed mb-5">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-[#5A5A62]">{article.readTime}</span>
          <Link
            to={`/knowledge/${article.slug}`}
            className="text-xs font-semibold text-[#C2186A] transition-colors duration-150 hover:text-[#A41C64]"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeHubPreview() {
  return (
    <section
      style={{
        background: [
          'radial-gradient(ellipse 110% 60% at 50% 0%, rgba(164,28,100,0.20) 0%, transparent 50%)',
          'radial-gradient(ellipse 65% 55% at 88% 100%, rgba(194,24,106,0.10) 0%, transparent 52%)',
          'radial-gradient(ellipse 45% 45% at 5% 60%, rgba(164,28,100,0.08) 0%, transparent 50%)',
          'var(--es-bg-page)',
        ].join(', '),
        padding: '96px 0',
        borderTop: '1px solid rgba(194,24,106,0.08)',
      }}
    >
      <div className="es-container">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="es-label mb-3">Knowledge Hub</p>
          <h2
            className="font-black text-[#F5F5F7] leading-tight mb-4"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              letterSpacing: '-0.035em',
            }}
          >
            Learn Between Sessions
          </h2>
          <p className="text-[#B8B8BE]">
            A growing library of event technique, safe practice and programming articles.
          </p>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {ARTICLES.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link to="/knowledge" className="btn-secondary">
            Browse All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
