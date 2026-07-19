import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { buildEventMeta } from '../../lib/libraryMeta';
import { pickExercisesForEvent, pickRelatedEvents } from '../../lib/relatedContent';
import { apiToPublicSlug } from '../../lib/exerciseSlugs';
import { readEmbeddedLibraryData } from '../../lib/initialData';

export interface Event {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  technicalNotes?: string;
  coachingNotes?: string;
  judgingCriteria?: string;
  programmingNotes?: string;
  commonErrors?: string;
  videoUrl?: string | null;
  isLaunchPriority: boolean;
}

interface ExerciseSummary {
  id: string;
  name: string;
  slug: string;
  category: string;
}

const CATEGORY_BADGE: Record<string, string> = {
  'Press Events':    'badge-accent',
  'Deadlift Events': 'badge-grey',
  'Carry Events':    'badge-amber',
  'Loading Events':  'badge-amber',
  'Pull Events':     'badge-grey',
  'Static Events':   'badge-grey',
};

function splitLines(text?: string): string[] {
  if (!text) return [];
  return text.split(/[;\n]/).map(s => s.trim()).filter(Boolean);
}

/** Pure content — no Navbar/Footer, no auth dependency. Shared between
 * the client route and the build-time prerender script. */
export function EventDetailContent({
  event,
  relatedExercises,
  relatedEvents,
}: {
  event: Event;
  relatedExercises: ExerciseSummary[];
  relatedEvents: Event[];
}) {
  const isRefereeingRelevant = !!event.judgingCriteria;

  return (
    <div style={{ background: '#0D0D0D' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4">
          <ol className="flex items-center gap-2 text-xs" style={{ color: '#75757D' }}>
            <li><Link to="/events" className="hover:text-white transition-colors">Event Library</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white/70">{event.name}</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-12">
          <p className="es-label mb-3">{event.category}</p>
          <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.04em' }}>{event.name}</h1>
          {event.description && (
            <p className="text-es-muted text-lg max-w-2xl leading-relaxed mb-4">{event.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <span className={CATEGORY_BADGE[event.category] || 'badge-grey'}>{event.category}</span>
            {event.isLaunchPriority && <span className="badge-amber">Core Six</span>}
          </div>
        </div>
      </section>

      <div className="es-section">
        <div className="es-container max-w-3xl">
          <div className="space-y-8">

            {event.technicalNotes && (
              <div>
                <p className="es-label mb-2">Common Competition Formats</p>
                <p className="text-sm text-es-muted leading-relaxed">{event.technicalNotes}</p>
              </div>
            )}

            {event.coachingNotes && (
              <div className="es-card-grey p-4 rounded-lg">
                <p className="es-label mb-2">Coaching Notes</p>
                <p className="text-sm text-es-muted leading-relaxed">{event.coachingNotes}</p>
              </div>
            )}

            {event.judgingCriteria && (
              <div className="p-4 rounded-lg" style={{ background: 'rgba(164,28,100,0.06)', border: '1px solid rgba(164,28,100,0.15)' }}>
                <p className="es-label mb-2">Judging Standards & Rule Variations</p>
                <p className="text-sm text-es-muted leading-relaxed">{event.judgingCriteria}</p>
                <p className="text-xs text-es-subtle mt-2 italic">
                  Rules vary by federation, promoter, and competition. Confirm specific rules before each event.
                </p>
              </div>
            )}

            {splitLines(event.commonErrors).length > 0 && (
              <div>
                <p className="es-label mb-3">Common No-Lifts and Penalties</p>
                <ul className="space-y-2">
                  {splitLines(event.commonErrors).map((err, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-es-muted">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#E19A47' }} />
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.programmingNotes && (
              <details className="es-card-grey rounded-lg p-4">
                <summary className="es-label cursor-pointer">Training Guidance</summary>
                <p className="text-sm text-es-muted leading-relaxed mt-3">{event.programmingNotes}</p>
              </details>
            )}

            {/* Training guidance points to the Exercise Library rather than repeating technique */}
            {relatedExercises.length > 0 && (
              <div style={{ borderTop: '1px solid #2C2C2C', paddingTop: '20px' }}>
                <p className="es-label mb-2">Learn the Technique</p>
                <p className="text-sm text-es-muted leading-relaxed">
                  For setup, coaching cues and progressions, see{' '}
                  {relatedExercises.map((r, i) => (
                    <span key={r.slug}>
                      <Link to={`/exercises/${apiToPublicSlug(r.slug)}`} className="es-inline-link font-semibold" style={{ color: '#A41C64' }}>
                        {r.name}
                      </Link>
                      {i < relatedExercises.length - 1 ? ', ' : ''}
                    </span>
                  ))}{' '}
                  in the Exercise Library.
                </p>
              </div>
            )}

            {relatedEvents.length > 0 && (
              <div>
                <p className="es-label mb-3">Related Events</p>
                <ul className="space-y-2">
                  {relatedEvents.map(r => (
                    <li key={r.slug}>
                      <Link to={`/events/${r.slug}`} className="text-sm font-semibold es-inline-link" style={{ color: '#A41C64' }}>
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contextual course CTAs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg p-5" style={{ background: 'rgba(164,28,100,0.06)', border: '1px solid rgba(164,28,100,0.2)' }}>
                <p className="text-sm font-bold text-white mb-1">Coaching this event?</p>
                <p className="text-xs text-es-muted leading-relaxed mb-2">
                  Programming and coaching guidance for this event is covered inside the Level 1 Coaching Strongman course.
                </p>
                <Link to="/courses/level-1-coaching-strongman" className="text-xs font-semibold" style={{ color: '#A41C64' }}>
                  Explore Level 1 Coaching →
                </Link>
              </div>
              {isRefereeingRelevant && (
                <div className="rounded-lg p-5" style={{ background: 'rgba(225,154,71,0.06)', border: '1px solid rgba(225,154,71,0.2)' }}>
                  <p className="text-sm font-bold text-white mb-1">Judging this event?</p>
                  <p className="text-xs text-es-muted leading-relaxed mb-2">
                    Judging standards and officiating practice for this event are covered inside the Level 1 Strongman Refereeing certification.
                  </p>
                  <Link to="/courses/level-1-strongman-refereeing" className="text-xs font-semibold" style={{ color: '#E19A47' }}>
                    Explore Level 1 Refereeing →
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventDetail({ ssrEvent }: { ssrEvent?: Event }) {
  const { slug } = useParams<{ slug: string }>();

  const [embedded] = useState(() => (ssrEvent ? null : readEmbeddedLibraryData<Event>('event', slug)));

  const [event, setEvent] = useState<Event | null>(ssrEvent ?? embedded?.record ?? null);
  const [relatedExercises, setRelatedExercises] = useState<ExerciseSummary[]>((embedded?.relatedExercises as ExerciseSummary[]) ?? []);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>((embedded?.relatedEvents as Event[]) ?? []);
  const [loading, setLoading] = useState(!ssrEvent && !embedded);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (ssrEvent || embedded) return;
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    api.get<Event>(`/events/${slug}`)
      .then(res => setEvent(res.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug, ssrEvent, embedded]);

  useEffect(() => {
    if (!event) return;
    if (embedded) return;
    Promise.all([
      api.get<ExerciseSummary[]>('/exercises'),
      api.get<Event[]>('/events'),
    ]).then(([exRes, evRes]) => {
      setRelatedExercises(pickExercisesForEvent(exRes.data, event));
      setRelatedEvents(pickRelatedEvents(evRes.data, event));
    }).catch(() => {});
  }, [event, embedded]);

  const meta = event ? buildEventMeta(event) : null;
  useDocumentHead({
    title: meta?.title || 'Event',
    description: meta?.description,
    canonical: meta?.canonical,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-es-muted text-sm pt-navbar">Loading event...</div>
        <Footer />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-navbar">
          <div className="text-center">
            <h1 className="text-2xl font-black text-white mb-2">Event not found</h1>
            <p className="text-es-muted text-sm mb-4">This event may have been renamed or is no longer published.</p>
            <Link to="/events" className="text-sm font-medium" style={{ color: '#A41C64' }}>
              Back to the Event Library
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
        <EventDetailContent event={event} relatedExercises={relatedExercises} relatedEvents={relatedEvents} />
      </main>
      <Footer />
    </div>
  );
}
