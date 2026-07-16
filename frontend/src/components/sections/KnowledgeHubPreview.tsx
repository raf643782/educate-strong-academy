import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
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

interface LibraryItem {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  isLaunchPriority?: boolean;
}

function useLibraryPreview(path: 'exercises' | 'events') {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/${path}`)
      .then((res) => {
        if (cancelled) return;
        const all: LibraryItem[] = res.data ?? [];
        const priority = all.filter((i) => i.isLaunchPriority);
        const picked = (priority.length >= 3 ? priority : all).slice(0, 3);
        setItems(picked);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { items, state };
}

function LibrarySkeletonCard() {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="h-3 w-24 rounded-full mb-4 animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="h-4 w-full rounded mb-2 animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="h-4 w-2/3 rounded mb-4 animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="h-3 w-full rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}

function LibraryCard({ item, kind }: { item: LibraryItem; kind: 'exercises' | 'events' }) {
  return (
    <Link
      to={`/${kind}`}
      className="rounded-2xl p-6 flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <span
        className="self-start text-[10px] font-bold uppercase tracking-[0.10em] px-2.5 py-1 rounded-full mb-4"
        style={{ background: 'rgba(194,24,106,0.12)', color: '#C2186A' }}
      >
        {item.category}
      </span>
      <h4 className="font-bold text-[#F5F5F7] text-base leading-snug mb-2 flex-1">{item.name}</h4>
      {item.description && (
        <p className="text-sm text-[#75757D] leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>
      )}
    </Link>
  );
}

function LibraryColumn({
  eyebrow,
  title,
  desc,
  cta,
  to,
  kind,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  to: string;
  kind: 'exercises' | 'events';
}) {
  const { items, state } = useLibraryPreview(kind);
  return (
    <div>
      <span className="text-[10px] font-bold uppercase tracking-[0.10em]" style={{ color: '#75757D' }}>{eyebrow}</span>
      <h3 className="font-bold text-white text-lg mt-2 mb-2">{title}</h3>
      <p className="text-sm text-white/45 leading-relaxed mb-5">{desc}</p>

      <div className="grid gap-3 mb-5">
        {state === 'loading' && Array.from({ length: 2 }).map((_, i) => <LibrarySkeletonCard key={i} />)}
        {state === 'ready' && items.slice(0, 2).map((item) => <LibraryCard key={item.id} item={item} kind={kind} />)}
        {state === 'error' && (
          <p className="text-xs text-white/30 italic">
            Live examples are drawn directly from the {kind === 'exercises' ? 'Exercise' : 'Event'} Library and could
            not load right now.
          </p>
        )}
      </div>

      <Link to={to} className="text-sm font-semibold" style={{ color: '#C2186A' }}>
        {cta} →
      </Link>
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
      aria-labelledby="learn-strongman-heading"
    >
      <div className="es-container-wide">
        {/* Header */}
        <div className="mb-12" style={{ maxWidth: '720px' }}>
          <p className="es-label mb-3">Knowledge and Technical Learning</p>
          <h2
            id="learn-strongman-heading"
            className="font-black text-[#F5F5F7] leading-tight mb-4"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              letterSpacing: '-0.035em',
            }}
          >
            Strongman Training, Explained
          </h2>
          <p className="text-[#B8B8BE] leading-relaxed">
            Good coaching starts with good information. The Knowledge Hub covers programming, safe
            practice and competition preparation. The Exercise Library breaks individual lifts down
            into technique, common mistakes and coaching cues. The Event Library explains how each
            competition event works, how it is judged, and how to train for it. Together they are
            built for coaches and athletes, and open to anyone learning Strongman for the first time.
          </p>
        </div>

        {/* Knowledge Hub articles, full width row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {ARTICLES.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* Exercise Library + Event Library, live proof of depth */}
        <div className="grid md:grid-cols-2 gap-10 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <LibraryColumn
            eyebrow="Exercise Library"
            title="Strongman Exercises, One Lift at a Time"
            desc="Real entries from the library, showing exactly the kind of technique and coaching cue detail every event and accessory movement gets."
            cta="Browse the Exercise Library"
            to="/exercises"
            kind="exercises"
          />
          <LibraryColumn
            eyebrow="Event Library"
            title="How Strongman Events Actually Work"
            desc="Real entries from the library, covering rules, judging and how each event is trained, drawn live from the same source the full library uses."
            cta="Browse the Event Library"
            to="/events"
            kind="events"
          />
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link to="/knowledge" className="btn-secondary">
            Browse the Knowledge Hub
          </Link>
        </div>
      </div>
    </section>
  );
}
