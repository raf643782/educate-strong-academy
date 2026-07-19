/**
 * ExerciseLibrary — fetches real exercises from /api/exercises.
 * Category filter IDs match DB category strings exactly.
 *
 * Stage 2: every card links to its own dedicated, prerendered page
 * (/exercises/<slug>) as the primary destination — the old quick-view
 * modal was removed. It duplicated the same content with none of a
 * dedicated page's benefits (its own URL, canonical, related content,
 * shareability) and gave no clear secondary value once every exercise
 * has a real page to link to.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { apiToPublicSlug } from '../../lib/exerciseSlugs';
import { SITE_URL } from '../../lib/siteUrl';

interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  description: string | null;
  equipmentNeeded: string | null;
  isCompetitionEvent: boolean;
  isLaunchPriority: boolean;
}

// IDs must match DB category strings exactly. Labels use training
// language rather than borrowing "Events" wording — that distinction
// belongs to the Event Library, not here.
const CATEGORIES_FILTER = [
  { id: 'all',              label: 'All' },
  { id: 'Pressing',         label: 'Pressing' },
  { id: 'Deadlift / Hinge', label: 'Deadlift and Hinge' },
  { id: 'Carry',            label: 'Carry' },
  { id: 'Loading',          label: 'Loading' },
  { id: 'Pull',             label: 'Pull' },
  { id: 'Accessories',      label: 'Accessories' },
  { id: 'Conditioning',     label: 'Conditioning' },
];

const DIFF_BADGE: Record<string, string> = {
  BEGINNER: 'badge-grey',
  INTERMEDIATE: 'badge-accent',
  ADVANCED: 'badge-amber',
  ELITE: 'badge-amber',
};

function difficultyLabel(d: string): string {
  const map: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    ELITE: 'Elite',
  };
  return map[d] ?? d;
}

// ── Category icon SVGs ────────────────────────────────────────────────────────

function CategoryIcon({ category, size = 32 }: { category: string; size?: number }) {
  const col = 'rgba(164,28,100,0.7)';

  if (category === 'Pressing') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="5" y="13" width="22" height="4" rx="2" fill={col} />
        <rect x="1" y="10" width="5" height="10" rx="2" fill={col} />
        <rect x="26" y="10" width="5" height="10" rx="2" fill={col} />
        <circle cx="16" cy="7" r="3" fill={col} />
        <rect x="14.5" y="9" width="3" height="5" rx="1" fill={col} />
      </svg>
    );
  }
  if (category === 'Deadlift / Hinge') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="14" width="28" height="4" rx="2" fill={col} />
        <rect x="2" y="10" width="6" height="12" rx="2" fill={col} />
        <rect x="24" y="10" width="6" height="12" rx="2" fill={col} />
        <rect x="14" y="4" width="4" height="11" rx="1.5" fill={col} />
      </svg>
    );
  }
  if (category === 'Carry') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="7" r="4" fill={col} />
        <path d="M9 14 C9 14 7 16 7 20 L11 28 L14 27 L12 21 L16 23 L20 21 L18 27 L21 28 L25 20 C25 16 23 14 23 14 Z" fill={col} />
        <rect x="2" y="15" width="3" height="8" rx="1.5" fill={col} />
        <rect x="27" y="15" width="3" height="8" rx="1.5" fill={col} />
      </svg>
    );
  }
  if (category === 'Loading') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="20" r="9" fill={col} />
        <rect x="13" y="6" width="6" height="8" rx="1.5" fill={col} opacity="0.6" />
        <rect x="11" y="12" width="10" height="3" rx="1" fill={col} opacity="0.5" />
      </svg>
    );
  }
  if (category === 'Pull') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="7" r="3.5" fill={col} />
        <path d="M10 26 L16 11 L22 26" stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="4" y="24" width="24" height="4" rx="2" fill={col} opacity="0.55" />
      </svg>
    );
  }
  if (category === 'Conditioning') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M5 24 C5 15 9 7 16 7 C23 7 27 15 27 24" stroke={col} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="16" cy="24" r="3" fill={col} />
        <line x1="16" y1="21" x2="16" y2="14" stroke={col} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  // Accessories — default barbell
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="5" y="14" width="22" height="4" rx="2" fill={col} />
      <rect x="2" y="11" width="4" height="10" rx="2" fill={col} />
      <rect x="26" y="11" width="4" height="10" rx="2" fill={col} />
    </svg>
  );
}

// ── Branded exercise placeholder ──────────────────────────────────────────────

function ExercisePlaceholder({ category, compact = false }: { category: string; compact?: boolean }) {
  const height = compact ? '64px' : '96px';
  const iconSize = compact ? 22 : 32;
  const catLabel = CATEGORIES_FILTER.find(c => c.id === category)?.label ?? category;

  return (
    <div
      style={{
        height,
        background: 'linear-gradient(135deg, #1A0D13 0%, #12101A 100%)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(164,28,100,0.14)',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(164,28,100,0.14), transparent)',
      }} />
      <CategoryIcon category={category} size={iconSize} />
      <span style={{
        position: 'absolute',
        bottom: compact ? '5px' : '7px',
        right: '9px',
        fontSize: '9px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.10em',
        color: 'rgba(164,28,100,0.5)',
      }}>
        {catLabel}
      </span>
    </div>
  );
}

// ── Page component ────────────────────────────────────────────────────────────

export default function ExerciseLibrary() {
  useDocumentHead({
    title: 'Strongman Exercise Library | Technique and Training Guides',
    description: 'Explore coaching cues, common mistakes, progressions and regressions for Strongman movements, from Atlas Stones to Yoke Walk.',
    canonical: `${SITE_URL}/exercises`,
    ogImage: undefined,
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [beginnerOnly, setBeginnerOnly] = useState(false);

  // Support ?category= query param for cross-linking from Event Library.
  // This does not create a separate indexable URL — the hub's canonical
  // always points at the bare /exercises URL regardless of query state.
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES_FILTER.some(c => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const loadExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Exercise[]>('/exercises');
      setExercises(res.data);
    } catch {
      setError('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadExercises(); }, [loadExercises]);

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? exercises : exercises.filter(e => e.category === activeCategory);
    if (beginnerOnly) list = list.filter(e => e.difficulty === 'BEGINNER');
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.description ?? '').toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.equipmentNeeded ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [exercises, activeCategory, beginnerOnly, query]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* Header */}
      <section className="pt-navbar es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Technique and Coaching Reference</p>
          <h1 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.04em' }}>
            Strongman Exercise Library
          </h1>
          <p className="text-es-muted max-w-2xl">
            Coaching cues, technique breakdowns, common mistakes and progression pathways for Strongman events
            and accessory work, written for beginners, coaches and competitive athletes.
          </p>
        </div>
      </section>

      {/* Search + filters */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <label htmlFor="exercise-search" className="sr-only">Search exercises</label>
            <input
              id="exercise-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search exercises, e.g. &quot;grip&quot; or &quot;carry&quot;"
              className="text-sm rounded px-4 py-2.5 flex-1 min-w-[220px]"
              style={{ background: '#1B1B20', border: '1px solid #2C2C2C', color: 'white' }}
            />
            <label className="flex items-center gap-2 text-sm text-es-muted cursor-pointer select-none px-3 py-2.5 rounded" style={{ border: '1px solid #2C2C2C' }}>
              <input
                type="checkbox"
                checked={beginnerOnly}
                onChange={e => setBeginnerOnly(e.target.checked)}
                className="w-4 h-4"
              />
              Beginner-suitable only
            </label>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES_FILTER.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`px-4 py-3 rounded text-sm font-semibold transition-all ${activeCategory === cat.id ? 'text-white' : 'text-es-muted hover:text-white border border-es-grey-dark hover:border-es-accent'}`}
                style={activeCategory === cat.id ? { background: '#A41C64', border: '1px solid rgba(164,28,100,0.6)' } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="es-section flex-1">
        <div className="es-container">

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="es-card-grey rounded-lg p-5 animate-pulse">
                  <div className="h-16 bg-white/6 rounded mb-4" />
                  <div className="h-4 bg-white/10 rounded mb-3 w-20" />
                  <div className="h-5 bg-white/10 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-white/10 rounded mb-1" />
                  <div className="h-3 bg-white/10 rounded mb-1 w-5/6" />
                  <div className="h-8 bg-white/10 rounded mt-4" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-es-muted mb-4">{error}</p>
              <button onClick={loadExercises} className="btn-primary">Retry</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-es-muted">
                  {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filtered.length === 0 ? (
                <div
                  className="text-center py-20"
                  style={{ border: '1px solid #2C2C2C', borderRadius: '12px', background: '#111' }}
                >
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', lineHeight: 1.7 }}>
                    No exercises match your search or filters.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map(ex => (
                    <Link
                      key={ex.id}
                      to={`/exercises/${apiToPublicSlug(ex.slug)}`}
                      className="es-card-hover flex flex-col p-4"
                    >
                      <ExercisePlaceholder category={ex.category} compact />
                      <div className="flex items-center justify-between mt-3 mb-2">
                        <span className={DIFF_BADGE[ex.difficulty] || 'badge-grey'}>{difficultyLabel(ex.difficulty)}</span>
                        {ex.isCompetitionEvent && (
                          <span className="badge-accent text-xs">Competition</span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-base leading-snug mb-2 flex-1">{ex.name}</h3>
                      {ex.description ? (
                        <p className="text-es-muted text-xs leading-relaxed mb-4 line-clamp-2">{ex.description}</p>
                      ) : (
                        <p className="text-es-subtle text-xs mb-4 italic">Details coming soon</p>
                      )}
                      <span className="btn-secondary text-xs text-center py-2">
                        View Exercise
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
