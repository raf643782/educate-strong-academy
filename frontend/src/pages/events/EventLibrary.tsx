/**
 * EventLibrary — fetches real events from /api/events.
 *
 * Stage 3: every card links to its own dedicated, prerendered page
 * (/events/<slug>) as the primary destination — the old quick-view
 * modal was removed for the same reason it was removed from the
 * Exercise Library: it duplicated dedicated-page content with none of
 * a dedicated page's benefits, once every event has a real page.
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { SITE_URL } from '../../lib/siteUrl';
import EntryImage from '../../components/media/EntryImage';
import BreadcrumbSchema from '../../components/content/BreadcrumbSchema';

interface Event {
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
  isLaunchPriority: boolean;
  imageUrl?: string | null;
  imageAlt?: string | null;
}

// "Static Events" (Stage 5 closure) covers stationary max-hold events like
// Hercules Hold — distinct from a generic "Hold Events" family, which was
// considered earlier and rejected as not a standard Strongman grouping.
const CATEGORIES = ['All', 'Press Events', 'Deadlift Events', 'Carry Events', 'Loading Events', 'Pull Events', 'Static Events'];

const CATEGORY_BADGE: Record<string, string> = {
  'Press Events':    'badge-accent',
  'Deadlift Events': 'badge-grey',
  'Carry Events':    'badge-amber',
  'Loading Events':  'badge-amber',
  'Pull Events':     'badge-grey',
  'Static Events':   'badge-grey',
};

const CORE_SIX = ['Log Press', 'Axle Press', 'Deadlift', "Farmer's Walk", 'Yoke Walk', 'Atlas Stones'];

export default function EventLibrary() {
  useDocumentHead({
    title: 'Strongman Event Library | Rules, Judging and Training',
    description: 'Explore how major Strongman events are judged and scored, with common formats, rule variations and links to the technique behind each event.',
    canonical: `${SITE_URL}/events`,
    ogImage: undefined,
  });

  const [events, setEvents]     = useState<Event[]>([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const loadEvents = useCallback(() => {
    setLoading(true);
    setError(null);
    api.get<Event[]>('/events')
      .then(res => setEvents(res.data))
      .catch(() => setError('Failed to load events. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const filtered = useMemo(() => {
    let list = category === 'All' ? events : events.filter(e => e.category === category);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.description ?? '').toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.technicalNotes ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [events, category, query]);

  const coreSix = events.filter(e => CORE_SIX.includes(e.name));

  const hasActiveFilters = category !== 'All' || query.trim().length > 0;
  const resultCountLabel = `${filtered.length} ${filtered.length === 1 ? 'event' : 'events'}${hasActiveFilters ? ' found' : ''}`;

  const resetFilters = useCallback(() => {
    setQuery('');
    setCategory('All');
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Event Library', path: '/events' }]} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-navbar" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4">
          <ol className="flex items-center gap-2 text-xs" style={{ color: '#75757D' }}>
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white/70">Event Library</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Competition Reference</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.04em' }}>Strongman Event Library</h1>
          <p className="text-es-muted text-lg max-w-2xl">
            Explore major Strongman competition events through common formats, judging criteria, scoring, rule
            variations and direct links to the technique behind each event.
          </p>
        </div>
      </section>

      {/* Search + filters */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4 space-y-3">
          <label htmlFor="event-search" className="sr-only">Search events</label>
          <input
            id="event-search"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events, e.g. &quot;deadlift&quot; or &quot;stones&quot;"
            className="text-sm rounded px-4 py-2.5 w-full max-w-md"
            style={{ background: '#1B1B20', border: '1px solid #2C2C2C', color: 'white' }}
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`px-4 py-3 rounded text-sm font-semibold transition-all ${category === cat ? 'text-white' : 'text-es-muted hover:text-white border border-es-grey-dark hover:border-es-accent'}`}
                style={category === cat ? { background: '#A41C64', border: '1px solid rgba(164,28,100,0.6)' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {!loading && !error && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm text-es-muted" aria-live="polite">{resultCountLabel}</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  aria-label="Reset search and filters"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: '#A41C64' }}
                >
                  Reset search and filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="es-container py-10">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="es-card-grey rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded mb-4 w-24" />
                  <div className="h-5 bg-white/10 rounded mb-3 w-3/4" />
                  <div className="h-3 bg-white/10 rounded mb-2" />
                  <div className="h-3 bg-white/10 rounded mb-2 w-5/6" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                  <div className="h-8 bg-white/10 rounded mt-5" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-es-muted mb-4">{error}</p>
              <button onClick={loadEvents} className="btn-primary">Retry</button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Core Six featured */}
              {coreSix.length > 0 && category === 'All' && !query && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-black text-white">The Core Six Events</h2>
                    <span className="badge-amber">Taught in Level 1</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {coreSix.map(event => (
                      <Link
                        key={event.id}
                        to={`/events/${event.slug}`}
                        className="es-card-hover p-6 block"
                        style={{ borderTop: '2px solid #E19A47' }}
                      >
                        <EntryImage
                          imageUrl={event.imageUrl}
                          category={event.category}
                          compact
                          className="mb-3"
                        />
                        <span className={`${CATEGORY_BADGE[event.category] || 'badge-grey'} mb-3 inline-block`}>
                          {event.category}
                        </span>
                        <h3 className="text-lg font-black text-white mb-2">{event.name}</h3>
                        {event.description && (
                          <p className="text-sm text-es-muted leading-relaxed line-clamp-3 mb-4">{event.description}</p>
                        )}
                        <span className="btn-amber text-xs py-2 px-4 inline-block">
                          View Event
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All / filtered events */}
              <div>
                <h2 className="text-2xl font-black text-white mb-6">
                  {category === 'All' ? 'All Events' : category}
                </h2>

                {filtered.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-es-muted mb-4">No events match your current search or category filter.</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      aria-label="Clear search and filters"
                      className="btn-secondary text-sm py-2 px-5"
                    >
                      Clear search and filters
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(event => (
                      <Link
                        key={event.id}
                        to={`/events/${event.slug}`}
                        className="es-card-hover flex flex-col p-5"
                      >
                        <EntryImage
                          imageUrl={event.imageUrl}
                          category={event.category}
                          compact
                          className="mb-3"
                        />
                        <span className={`${CATEGORY_BADGE[event.category] || 'badge-grey'} mb-3 inline-block`}>
                          {event.category}
                        </span>
                        <h3 className="font-black text-white mb-2">{event.name}</h3>
                        {event.description && (
                          <p className="text-sm text-es-muted leading-relaxed line-clamp-2 mb-4 flex-1">{event.description}</p>
                        )}
                        <span className="btn-secondary text-xs py-2 text-center">
                          View Event
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-10 es-card text-center py-8 border-dashed">
                  <p className="text-es-muted font-medium mb-1">More events coming soon</p>
                  <p className="text-es-subtle text-sm">Additional event types are in development and will be added by the EducateStrong team.</p>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
