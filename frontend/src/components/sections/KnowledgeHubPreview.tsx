import { Link } from 'react-router-dom';

interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  colour: string;
}

const ARTICLES: Article[] = [
  {
    slug: 'coaching-the-log-press',
    category: 'Coaching',
    title: 'Coaching the Log Press: Technique Cues That Work',
    excerpt: 'The log press is the most technical overhead movement in Strongman. These are the cues that make the difference between a grind and a clean rep.',
    readTime: '5 min read',
    colour: '#A41C64',
  },
  {
    slug: 'athlete-screening-strongman',
    category: 'Safety',
    title: 'Why Athlete Screening Matters Before Your First Session',
    excerpt: "Screening isn't box-ticking. It's the single most important thing you can do before putting a new athlete under load in a Strongman context.",
    readTime: '4 min read',
    colour: '#C0246E',
  },
  {
    slug: 'yoke-fundamentals',
    category: 'Events',
    title: 'Yoke Fundamentals: What Coaches Often Miss',
    excerpt: 'Most coaches focus on leg drive. The coaches who get the best results out of yoke focus on something else entirely.',
    readTime: '6 min read',
    colour: '#E19A47',
  },
];

function ArticleCard({ article }: { article: Article }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col transition-transform motion-safe:hover:-translate-y-0.5"
      style={{
        background: '#131313',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${article.colour}44`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Category pill */}
      <span
        className="inline-block self-start text-xs font-bold px-2.5 py-1 rounded-full mb-3"
        style={{ background: `${article.colour}22`, color: article.colour }}
      >
        {article.category}
      </span>

      {/* Title */}
      <h3 className="font-bold text-white text-sm leading-snug mb-2 flex-1">
        {article.title}
      </h3>

      {/* Excerpt */}
      <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {article.excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs" style={{ color: '#555' }}>{article.readTime}</span>
        <Link
          to="/knowledge"
          className="text-xs font-semibold transition-colors"
          style={{ color: article.colour }}
        >
          Read Article →
        </Link>
      </div>
    </div>
  );
}

export default function KnowledgeHubPreview() {
  return (
    <section style={{ background: '#0A0A0A', padding: '96px 0' }}>
      <div className="es-container">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="es-label mb-3">Knowledge Hub</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            Coaching Insights from the Field
          </h2>
          <p style={{ color: '#888' }}>
            Free coaching articles, technique breakdowns, and programming insights for Strongman coaches.
          </p>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
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
