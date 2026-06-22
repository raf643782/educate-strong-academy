/**
 * ExerciseLibrary — fetches real exercises from /api/exercises.
 * Hardcoded EXERCISES array has been removed; all data comes from the database.
 */

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

// Shape returned by GET /api/exercises (Prisma Exercise model)
interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string; // BEGINNER | INTERMEDIATE | ADVANCED | ELITE
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

const CATEGORIES_FILTER = [
  { id: 'all', label: 'All' },
  { id: 'press', label: 'Press Events' },
  { id: 'deadlift', label: 'Deadlift Events' },
  { id: 'carry', label: 'Carry Events' },
  { id: 'loading', label: 'Loading Events' },
  { id: 'pull', label: 'Pull Events' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'conditioning', label: 'Conditioning' },
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
  return text.split('\n').map(s => s.trim()).filter(Boolean);
}

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
            Technique & Coaching Reference
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
              <button onClick={loadExercises} className="btn-primary">
                Retry
              </button>
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
                    <div key={ex.id} className="es-card-hover flex flex-col p-5">
                      <div className="flex items-center justify-between mb-3">
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
                      {ex.equipmentNeeded && (
                        <p className="text-es-subtle text-xs mb-4 line-clamp-1">{ex.equipmentNeeded}</p>
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
              className="flex items-start justify-between p-6"
              style={{ borderBottom: '1px solid #2C2C2C', background: 'linear-gradient(135deg, rgba(164,28,100,0.12), transparent)' }}
            >
              <div>
                <p className="es-label mb-1">
                  {CATEGORIES_FILTER.find(c => c.id === selectedExercise.category)?.label ?? selectedExercise.category}
                </p>
                <h2 className="text-2xl font-black text-white">{selectedExercise.name}</h2>
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

              {selectedExercise.techniqueNotes && (
                <div>
                  <p className="es-label mb-2">Technique Notes</p>
                  <p className="text-es-muted text-sm leading-relaxed">{selectedExercise.techniqueNotes}</p>
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

              {selectedExercise.progressions && (
                <div className="es-card-grey p-4 rounded-lg">
                  <p className="es-label mb-2">Progressions</p>
                  <p className="text-sm text-es-muted leading-relaxed">{selectedExercise.progressions}</p>
                </div>
              )}

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

              {selectedExercise.safetyNotes && (
                <div>
                  <p className="es-label mb-2">Safety Notes</p>
                  <p className="text-sm text-es-muted">{selectedExercise.safetyNotes}</p>
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
                    Watch Video →
                  </a>
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
