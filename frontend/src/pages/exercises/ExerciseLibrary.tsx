/**
 * ExerciseLibrary — fetches real exercises from /api/exercises.
 * Category filter IDs match DB category strings exactly.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  description: string | null;
  techniqueNotes: string | null;
  coachingCues: string | null;
  commonMistakes: string | null;
  progressions: string | null;
  regressions: string | null;
  programmingNotes: string | null;
  videoUrl: string | null;
  equipmentNeeded: string | null;
  musclesWorked: string | null;
  safetyNotes: string | null;
  isCompetitionEvent: boolean;
  isLaunchPriority: boolean;
}

// IDs must match DB category strings exactly
const CATEGORIES_FILTER = [
  { id: 'all',              label: 'All' },
  { id: 'Pressing',         label: 'Press Events' },
  { id: 'Deadlift / Hinge', label: 'Deadlift Events' },
  { id: 'Carry',            label: 'Carry Events' },
  { id: 'Loading',          label: 'Loading Events' },
  { id: 'Pull',             label: 'Pull Events' },
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

function splitLines(text: string | null): string[] {
  if (!text) return [];
  return text.split(/[;\n]/).map(s => s.trim()).filter(Boolean);
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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Support ?category= query param for cross-linking from Event Library
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

  const filtered = activeCategory === 'all'
    ? exercises
    : exercises.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* Header */}
      <section className="pt-navbar es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Exercise Library</p>
          <h1 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.04em' }}>
            Technique &amp; Coaching Reference
          </h1>
          <p className="text-es-muted max-w-xl">
            Coaching cues, technique breakdowns, common mistakes, and progression pathways for Strongman events and accessory work.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4 flex flex-wrap gap-2">
          {CATEGORIES_FILTER.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${activeCategory === cat.id ? 'text-white' : 'text-es-muted hover:text-white border border-es-grey-dark hover:border-es-accent'}`}
              style={activeCategory === cat.id ? { background: '#A41C64', border: '1px solid rgba(164,28,100,0.6)' } : {}}
            >
              {cat.label}
            </button>
          ))}
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
                    No exercises have been published yet for this category.
                    <br />
                    Exercises will be added by the EducateStrong team.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map(ex => (
                    <div key={ex.id} className="es-card-hover flex flex-col p-4">
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
                      <button
                        onClick={() => setSelectedExercise(ex)}
                        className="btn-secondary text-xs text-center py-2"
                      >
                        View Exercise
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedExercise(null); }}
        >
          <div
            className="w-full max-w-2xl rounded-lg overflow-hidden"
            style={{ background: '#1A1A1A', border: '1px solid #3C3C3C', boxShadow: '0 20px 80px rgba(0,0,0,0.9)', marginBottom: '2rem' }}
          >
            {/* Modal header */}
            <div
              className="flex items-start gap-4 p-6"
              style={{ borderBottom: '1px solid #2C2C2C', background: 'linear-gradient(135deg, rgba(164,28,100,0.12), transparent)' }}
            >
              {/* Branded icon */}
              <div style={{
                width: '72px',
                height: '72px',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #1A0D13 0%, #12101A 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(164,28,100,0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(164,28,100,0.2), transparent)',
                }} />
                <CategoryIcon category={selectedExercise.category} size={36} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="es-label mb-1">
                  {CATEGORIES_FILTER.find(c => c.id === selectedExercise.category)?.label ?? selectedExercise.category}
                </p>
                <h2 className="text-2xl font-black text-white leading-tight">{selectedExercise.name}</h2>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className={DIFF_BADGE[selectedExercise.difficulty] || 'badge-grey'}>
                    {difficultyLabel(selectedExercise.difficulty)}
                  </span>
                  {selectedExercise.isCompetitionEvent && (
                    <span className="badge-accent">Competition Event</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded text-es-muted hover:text-white transition-colors flex-shrink-0"
                style={{ background: '#2A2A2A' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6">

              {selectedExercise.description && (
                <div>
                  <p className="es-label mb-2">Description</p>
                  <p className="text-es-muted text-sm leading-relaxed">{selectedExercise.description}</p>
                </div>
              )}

              {selectedExercise.techniqueNotes && (
                <div>
                  <p className="es-label mb-2">Technique Notes</p>
                  <p className="text-es-muted text-sm leading-relaxed">{selectedExercise.techniqueNotes}</p>
                </div>
              )}

              {splitLines(selectedExercise.coachingCues).length > 0 && (
                <div>
                  <p className="es-label mb-3">Coaching Cues</p>
                  <ul className="space-y-2">
                    {splitLines(selectedExercise.coachingCues).map((cue, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-es-muted">
                        <span className="font-black text-xs mt-0.5 flex-shrink-0" style={{ color: '#A41C64' }}>{i + 1}</span>
                        {cue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {splitLines(selectedExercise.commonMistakes).length > 0 && (
                <div>
                  <p className="es-label mb-3">Common Mistakes</p>
                  <ul className="space-y-2">
                    {splitLines(selectedExercise.commonMistakes).map((m, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-es-muted">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#E19A47' }} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedExercise.safetyNotes && (
                <div
                  className="p-4 rounded-lg"
                  style={{ background: 'rgba(164,28,100,0.06)', border: '1px solid rgba(164,28,100,0.15)' }}
                >
                  <p className="es-label mb-2">Safety Notes</p>
                  <p className="text-sm text-es-muted leading-relaxed">{selectedExercise.safetyNotes}</p>
                </div>
              )}

              {(selectedExercise.progressions || selectedExercise.regressions) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedExercise.progressions && (
                    <div className="es-card-grey p-4 rounded-lg">
                      <p className="es-label mb-2">Progressions</p>
                      <p className="text-sm text-es-muted leading-relaxed">{selectedExercise.progressions}</p>
                    </div>
                  )}
                  {selectedExercise.regressions && (
                    <div className="es-card-grey p-4 rounded-lg">
                      <p className="es-label mb-2">Regressions</p>
                      <p className="text-sm text-es-muted leading-relaxed">{selectedExercise.regressions}</p>
                    </div>
                  )}
                </div>
              )}

              {(selectedExercise.equipmentNeeded || selectedExercise.musclesWorked) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedExercise.equipmentNeeded && (
                    <div>
                      <p className="es-label mb-2">Equipment</p>
                      <p className="text-sm text-es-muted">{selectedExercise.equipmentNeeded}</p>
                    </div>
                  )}
                  {selectedExercise.musclesWorked && (
                    <div>
                      <p className="es-label mb-2">Muscles Worked</p>
                      <p className="text-sm text-es-muted">{selectedExercise.musclesWorked}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedExercise.programmingNotes && (
                <div>
                  <p className="es-label mb-2">Programming Notes</p>
                  <p className="text-sm text-es-muted leading-relaxed">{selectedExercise.programmingNotes}</p>
                </div>
              )}

              {selectedExercise.videoUrl && (
                <div>
                  <p className="es-label mb-2">Video</p>
                  <a
                    href={selectedExercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm inline-block"
                  >
                    Watch Video
                  </a>
                </div>
              )}

              {/* Cross-link to Event Library */}
              {selectedExercise.isCompetitionEvent && (
                <div style={{ borderTop: '1px solid #2C2C2C', paddingTop: '16px' }}>
                  <p className="text-xs text-es-subtle mb-2">Competition reference</p>
                  <Link
                    to="/events"
                    className="text-xs font-semibold transition-colors hover:opacity-80"
                    style={{ color: '#A41C64' }}
                    onClick={() => setSelectedExercise(null)}
                  >
                    View this event in the Event Library
                  </Link>
                </div>
              )}

              {!selectedExercise.description &&
                !selectedExercise.coachingCues &&
                !selectedExercise.techniqueNotes && (
                  <p className="text-xs text-es-subtle italic">
                    Detailed content for this exercise will be added by the EducateStrong coaching team.
                  </p>
                )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
