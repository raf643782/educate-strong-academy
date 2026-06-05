import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Article {
  id: number;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  level: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'refereeing', label: 'Refereeing' },
  { id: 'strongkidz', label: 'StrongKidz' },
  { id: 'eatstrong', label: 'EatStrong' },
  { id: 'programming', label: 'Programming' },
  { id: 'athlete', label: 'Athlete Development' },
  { id: 'competition', label: 'Competition' },
];

const ARTICLES = [
  {
    id: 1, category: 'coaching', title: 'Teaching the Hip Hinge: A Coach\'s Framework',
    summary: 'The hip hinge underpins almost every major Strongman event. Here is how to teach it progressively to beginner athletes.',
    readTime: '8 min', level: 'Foundation',
  },
  {
    id: 2, category: 'coaching', title: 'Coaching Cues That Actually Work',
    summary: 'External focus cues vs internal focus — what the research says and how to apply it on the gym floor during practical coaching.',
    readTime: '6 min', level: 'Foundation',
  },
  {
    id: 3, category: 'refereeing', title: 'Good Lift vs No Lift: Developing Consistency',
    summary: 'Consistent judging decisions come from clear criteria, not instinct. A practical guide to standardising your calls across events.',
    readTime: '7 min', level: 'Refereeing',
  },
  {
    id: 4, category: 'programming', title: 'Building Your First 12-Week Strongman Block',
    summary: 'A practical guide to periodisation for beginner and intermediate Strongman athletes — event selection, volume, and progression.',
    readTime: '12 min', level: 'Coaching',
  },
  {
    id: 5, category: 'athlete', title: 'Managing Fatigue Across a Competition Season',
    summary: 'Understanding accumulative fatigue, deload protocols, and how to time your athletes to peak on competition day.',
    readTime: '10 min', level: 'Advanced',
  },
  {
    id: 6, category: 'strongkidz', title: 'Age-Appropriate Loading: What the Evidence Says',
    summary: 'A practical overview of youth strength training research and how to apply it safely in StrongKidz sessions.',
    readTime: '9 min', level: 'Youth',
  },
  {
    id: 7, category: 'eatstrong', title: 'Competition Day Nutrition: A Practical Guide',
    summary: 'What to eat, when to eat, and how to fuel across a full day of Strongman competition events.',
    readTime: '8 min', level: 'Nutrition',
  },
  {
    id: 8, category: 'competition', title: 'Event Selection Strategy for First-Time Competitors',
    summary: 'How coaches should approach event selection to maximise athlete performance and confidence at their first competition.',
    readTime: '7 min', level: 'Coaching',
  },
  {
    id: 9, category: 'coaching', title: 'Risk Assessment for Strongman Training Environments',
    summary: 'A coach\'s practical guide to identifying and managing risk before sessions involving heavy implements.',
    readTime: '6 min', level: 'Foundation',
  },
  {
    id: 10, category: 'refereeing', title: 'Briefing Athletes: Before the Event Starts',
    summary: 'A structured approach to athlete briefings that reduces disputes, improves clarity, and sets the tone for fair officiating.',
    readTime: '5 min', level: 'Refereeing',
  },
];

const LEVEL_COLOUR: Record<string, string> = {
  'Foundation': 'badge-accent',
  'Coaching': 'badge-accent',
  'Refereeing': 'badge-grey',
  'Advanced': 'badge-amber',
  'Youth': 'badge-amber',
  'Nutrition': 'badge-grey',
};

export default function KnowledgeHub() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filtered = activeCategory === 'all'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

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
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
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
              <button onClick={() => setActiveCategory('all')} className="btn-secondary text-sm mt-4">
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
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="btn-secondary text-sm text-center"
                  >
                    Read Article
                  </button>
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

      <Footer />

      {/* Article modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedArticle(null); }}
        >
          <div className="w-full max-w-2xl rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2C2C2C' }}>
            {/* Modal header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #2C2C2C' }}>
              <div className="flex items-center gap-3">
                <span className={LEVEL_COLOUR[selectedArticle.level] || 'badge-grey'}>{selectedArticle.level}</span>
                <span className="text-xs text-es-subtle">{selectedArticle.readTime}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-es-muted hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <h2 className="text-xl font-black text-white mb-4 leading-snug">{selectedArticle.title}</h2>
              <p className="text-es-muted leading-relaxed mb-6">{selectedArticle.summary}</p>
              <div
                className="rounded-lg p-4 text-sm"
                style={{ background: 'rgba(164,28,100,0.07)', border: '1px solid rgba(164,28,100,0.15)', color: '#A41C64' }}
              >
                Full article content for this category is launching with Phase 2. More articles in the{' '}
                <strong>{CATEGORIES.find(c => c.id === selectedArticle.category)?.label || selectedArticle.category}</strong>{' '}
                category are also in development.
              </div>
            </div>

            <div className="px-6 py-4 flex justify-end" style={{ borderTop: '1px solid #2C2C2C' }}>
              <button onClick={() => setSelectedArticle(null)} className="btn-secondary text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
