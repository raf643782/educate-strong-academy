import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { buildExerciseMeta } from '../../lib/libraryMeta';
import { pickRelatedExercises, pickEventsForExercise } from '../../lib/relatedContent';
import { apiToPublicSlug, publicToApiSlug } from '../../lib/exerciseSlugs';
import { readEmbeddedLibraryData } from '../../lib/initialData';

export interface Exercise {
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
}

interface EventSummary {
  id: string;
  name: string;
  slug: string;
  category: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  Pressing: 'Pressing',
  'Deadlift / Hinge': 'Deadlift & Hinge',
  Carry: 'Carry',
  Loading: 'Loading',
  Pull: 'Pull',
  Accessories: 'Accessories',
  Conditioning: 'Conditioning',
};

const DIFF_LABEL: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  ELITE: 'Elite',
};

function splitLines(text: string | null): string[] {
  if (!text) return [];
  return text.split(/[;\n]/).map(s => s.trim()).filter(Boolean);
}

/**
 * Pure content — no Navbar/Footer, no auth dependency, data supplied via
 * props only. This is the piece reused by both the client route (below)
 * and the build-time prerender script, so the two can never diverge.
 */
export function ExerciseDetailContent({
  exercise,
  relatedExercises,
  relatedEvents,
}: {
  exercise: Exercise;
  relatedExercises: Exercise[];
  relatedEvents: EventSummary[];
}) {
  const pairedEvent = relatedEvents.find(e => e.name === exercise.name);
  const otherRelatedEvents = relatedEvents.filter(e => e.name !== exercise.name);

  return (
    <div style={{ background: '#0D0D0D' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4">
          <ol className="flex items-center gap-2 text-xs" style={{ color: '#75757D' }}>
            <li><Link to="/exercises" className="hover:text-white transition-colors">Exercise Library</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white/70">{exercise.name}</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-12">
          <p className="es-label mb-3">{CATEGORY_LABEL[exercise.category] ?? exercise.category}</p>
          <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.04em' }}>{exercise.name}</h1>
          {exercise.description && (
            <p className="text-es-muted text-lg max-w-2xl leading-relaxed mb-4">{exercise.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <span className={exercise.difficulty === 'BEGINNER' ? 'badge-grey' : 'badge-accent'}>
              {DIFF_LABEL[exercise.difficulty] ?? exercise.difficulty}
            </span>
            {exercise.isCompetitionEvent && <span className="badge-amber">Competition Event</span>}
          </div>
        </div>
      </section>

      <div className="es-section">
        <div className="es-container max-w-3xl">
          <div className="space-y-8">

            {(exercise.musclesWorked || exercise.equipmentNeeded) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {exercise.musclesWorked && (
                  <div>
                    <p className="es-label mb-2">What It Develops</p>
                    <p className="text-sm text-es-muted leading-relaxed">{exercise.musclesWorked}</p>
                  </div>
                )}
                {exercise.equipmentNeeded && (
                  <div>
                    <p className="es-label mb-2">Equipment Needed</p>
                    <p className="text-sm text-es-muted leading-relaxed">{exercise.equipmentNeeded}</p>
                  </div>
                )}
              </div>
            )}

            {exercise.techniqueNotes && (
              <div>
                <p className="es-label mb-2">Setup & Movement</p>
                <p className="text-sm text-es-muted leading-relaxed">{exercise.techniqueNotes}</p>
              </div>
            )}

            {splitLines(exercise.coachingCues).length > 0 && (
              <div>
                <p className="es-label mb-3">Coaching Cues</p>
                <ul className="space-y-2">
                  {splitLines(exercise.coachingCues).map((cue, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-es-muted">
                      <span className="font-black text-xs mt-0.5 flex-shrink-0" style={{ color: '#A41C64' }}>{i + 1}</span>
                      {cue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {splitLines(exercise.commonMistakes).length > 0 && (
              <div>
                <p className="es-label mb-3">Common Mistakes</p>
                <ul className="space-y-2">
                  {splitLines(exercise.commonMistakes).map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-es-muted">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#E19A47' }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety — always visible, never collapsed */}
            {exercise.safetyNotes && (
              <div className="p-4 rounded-lg" style={{ background: 'rgba(164,28,100,0.06)', border: '1px solid rgba(164,28,100,0.15)' }}>
                <p className="es-label mb-2">Safety Considerations</p>
                <p className="text-sm text-es-muted leading-relaxed">{exercise.safetyNotes}</p>
              </div>
            )}

            {(exercise.progressions || exercise.regressions) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {exercise.progressions && (
                  <div className="es-card-grey p-4 rounded-lg">
                    <p className="es-label mb-2">Progressions</p>
                    <p className="text-sm text-es-muted leading-relaxed">{exercise.progressions}</p>
                  </div>
                )}
                {exercise.regressions && (
                  <div className="es-card-grey p-4 rounded-lg">
                    <p className="es-label mb-2">Regressions</p>
                    <p className="text-sm text-es-muted leading-relaxed">{exercise.regressions}</p>
                  </div>
                )}
              </div>
            )}

            {exercise.programmingNotes && (
              <details className="es-card-grey rounded-lg p-4">
                <summary className="es-label cursor-pointer">Programming Considerations</summary>
                <p className="text-sm text-es-muted leading-relaxed mt-3">{exercise.programmingNotes}</p>
              </details>
            )}

            {pairedEvent && (
              <div style={{ borderTop: '1px solid #2C2C2C', paddingTop: '20px' }}>
                <p className="es-label mb-2">Competition Relevance</p>
                <p className="text-sm text-es-muted leading-relaxed">
                  This movement is contested in competition as {pairedEvent.name}. For rules, judging and scoring, see{' '}
                  <Link to={`/events/${pairedEvent.slug}`} className="es-inline-link font-semibold" style={{ color: '#A41C64' }}>
                    {pairedEvent.name} in the Event Library
                  </Link>.
                </p>
              </div>
            )}

            {/* Related content */}
            {(relatedExercises.length > 0 || otherRelatedEvents.length > 0) && (
              <div style={{ borderTop: '1px solid #2C2C2C', paddingTop: '20px' }}>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedExercises.length > 0 && (
                    <div>
                      <p className="es-label mb-3">Related Exercises</p>
                      <ul className="space-y-2">
                        {relatedExercises.map(r => (
                          <li key={r.slug}>
                            <Link to={`/exercises/${apiToPublicSlug(r.slug)}`} className="text-sm font-semibold es-inline-link" style={{ color: '#A41C64' }}>
                              {r.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {otherRelatedEvents.length > 0 && (
                    <div>
                      <p className="es-label mb-3">Related Events</p>
                      <ul className="space-y-2">
                        {otherRelatedEvents.map(r => (
                          <li key={r.slug}>
                            <Link to={`/events/${r.slug}`} className="text-sm font-semibold es-inline-link" style={{ color: '#A41C64' }}>
                              {r.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contextual course CTA */}
            <div className="rounded-lg p-5" style={{ background: 'rgba(164,28,100,0.06)', border: '1px solid rgba(164,28,100,0.2)' }}>
              <p className="text-sm font-bold text-white mb-1">Want the full coaching framework?</p>
              <p className="text-xs text-es-muted leading-relaxed mb-2">
                Session plans, assessment guidance and tutor-supported coaching for this movement are covered
                inside the Level 1 Coaching Strongman course.
              </p>
              <Link to="/courses/level-1-coaching-strongman" className="text-xs font-semibold" style={{ color: '#A41C64' }}>
                Explore the Level 1 Coaching course →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/** Route-facing component: fetches real data client-side, handles
 * loading/error/not-found, sets document head. Accepts an optional
 * ssrExercise prop used only by the build-time prerender script — when
 * absent (the normal client-navigation case) this behaves exactly like
 * every other data-fetching page in the app. */
export default function ExerciseDetail({ ssrExercise }: { ssrExercise?: Exercise }) {
  const { slug: publicSlug } = useParams<{ slug: string }>();

  // Build-time-embedded data for this exact route, if this page was
  // prerendered — read once, synchronously, so the first client render
  // (which hydrateRoot in main.tsx expects to match the server output)
  // uses the same data that produced the static HTML, with no refetch.
  const [embedded] = useState(() =>
    ssrExercise ? null : readEmbeddedLibraryData<Exercise>('exercise', publicSlug)
  );

  const [exercise, setExercise] = useState<Exercise | null>(ssrExercise ?? embedded?.record ?? null);
  const [relatedExercises, setRelatedExercises] = useState<Exercise[]>((embedded?.relatedExercises as Exercise[]) ?? []);
  const [relatedEvents, setRelatedEvents] = useState<EventSummary[]>((embedded?.relatedEvents as EventSummary[]) ?? []);
  const [loading, setLoading] = useState(!ssrExercise && !embedded);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (ssrExercise || embedded) return; // already have complete, matching data
    if (!publicSlug) return;
    const apiSlug = publicToApiSlug(publicSlug);
    setLoading(true);
    setNotFound(false);
    api.get<Exercise>(`/exercises/${apiSlug}`)
      .then(res => setExercise({ ...res.data, slug: apiToPublicSlug(res.data.slug) }))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [publicSlug, ssrExercise, embedded]);

  useEffect(() => {
    if (!exercise) return;
    if (embedded) return; // related content already known from embedded data
    Promise.all([
      api.get<Exercise[]>('/exercises'),
      api.get<EventSummary[]>('/events'),
    ]).then(([exRes, evRes]) => {
      setRelatedExercises(pickRelatedExercises(exRes.data, { ...exercise, slug: publicToApiSlug(exercise.slug)! }));
      setRelatedEvents(pickEventsForExercise(evRes.data, { ...exercise, slug: publicToApiSlug(exercise.slug)! }));
    }).catch(() => {});
  }, [exercise, embedded]);

  const meta = exercise ? buildExerciseMeta(exercise) : null;
  useDocumentHead({
    title: meta?.title || 'Exercise',
    description: meta?.description,
    canonical: meta?.canonical,
    ogImage: undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-es-muted text-sm pt-navbar">Loading exercise...</div>
        <Footer />
      </div>
    );
  }

  if (notFound || !exercise) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-navbar">
          <div className="text-center">
            <h1 className="text-2xl font-black text-white mb-2">Exercise not found</h1>
            <p className="text-es-muted text-sm mb-4">This exercise may have been renamed or is no longer published.</p>
            <Link to="/exercises" className="text-sm font-medium" style={{ color: '#A41C64' }}>
              Back to the Exercise Library
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
        <ExerciseDetailContent exercise={exercise} relatedExercises={relatedExercises} relatedEvents={relatedEvents} />
      </main>
      <Footer />
    </div>
  );
}
