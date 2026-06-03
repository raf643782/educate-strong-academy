import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

interface Event {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  coachingNotes?: string;
  judgingCriteria?: string;
  isLaunchPriority: boolean;
}

const CATEGORIES = ['All', 'Press Events', 'Deadlift Events', 'Carry Events', 'Loading Events', 'Pull Events', 'Hold Events'];

const CATEGORY_BADGE: Record<string, string> = {
  'Press Events': 'badge-accent',
  'Deadlift Events': 'badge-grey',
  'Carry Events': 'badge-amber',
  'Loading Events': 'badge-amber',
  'Pull Events': 'badge-grey',
  'Hold Events': 'badge-grey',
};

const CORE_SIX = ['Log Press', 'Axle Press', 'Deadlift', "Farmer's Walk", 'Yoke Walk', 'Atlas Stones'];

export default function EventLibrary() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    api.get('/events')
      .then(res => { setEvents(res.data); setFiltered(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (category === 'All') setFiltered(events);
    else setFiltered(events.filter(e => e.category === category));
  }, [category, events]);

  const coreSix = events.filter(e => CORE_SIX.includes(e.name));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* Header */}
      <section className="pt-navbar es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Competition Reference</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.04em' }}>Event Library</h1>
          <p className="text-es-muted text-lg max-w-2xl">
            Technical breakdowns, coaching notes, judging criteria, and programming guidance for every major Strongman competition event.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4 flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${category === cat ? 'text-white' : 'text-es-muted hover:text-white border border-es-grey-dark hover:border-es-accent'}`}
              style={category === cat ? { background: '#A41C64', border: '1px solid rgba(164,28,100,0.6)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="es-container py-10">

          {/* Core Six featured */}
          {coreSix.length > 0 && category === 'All' && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-black text-white">The Core Six Events</h2>
                <span className="badge-amber">Taught in Level 1</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {coreSix.map(event => (
                  <div
                    key={event.id}
                    className="es-card-hover p-6"
                    style={{ borderTop: '2px solid #E19A47' }}
                  >
                    <span className={`${CATEGORY_BADGE[event.category] || 'badge-grey'} mb-3 inline-block`}>
                      {event.category}
                    </span>
                    <h3 className="text-lg font-black text-white mb-2">{event.name}</h3>
                    {event.description && (
                      <p className="text-sm text-es-muted leading-relaxed line-clamp-3 mb-4">{event.description}</p>
                    )}
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="btn-amber text-xs py-2 px-4"
                    >
                      View Event
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All events */}
          <div>
            {category !== 'All' && (
              <h2 className="text-2xl font-black text-white mb-6">{category}</h2>
            )}
            {category === 'All' && (
              <h2 className="text-2xl font-black text-white mb-6">All Events</h2>
            )}

            {loading ? (
              <div className="text-center py-16 text-es-muted">Loading events...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-es-muted">No events found in this category.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(event => (
                  <div key={event.id} className="es-card-hover flex flex-col p-5">
                    <span className={`${CATEGORY_BADGE[event.category] || 'badge-grey'} mb-3 inline-block`}>
                      {event.category}
                    </span>
                    <h3 className="font-black text-white mb-2">{event.name}</h3>
                    {event.description && (
                      <p className="text-sm text-es-muted leading-relaxed line-clamp-2 mb-4 flex-1">{event.description}</p>
                    )}
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="btn-secondary text-xs py-2"
                    >
                      View Event
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Phase 2 teaser */}
            <div className="mt-10 es-card text-center py-8 border-dashed">
              <p className="text-es-muted font-medium mb-1">More events coming soon</p>
              <p className="text-es-subtle text-sm">Pull Events, Hold Events, Medleys, and Specialty Events will be added in Phase 2.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}
        >
          <div
            className="w-full max-w-2xl rounded-lg overflow-hidden"
            style={{ background: '#1A1A1A', border: '1px solid #3C3C3C', boxShadow: '0 20px 80px rgba(0,0,0,0.9)', marginBottom: '2rem' }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-6" style={{ borderBottom: '1px solid #2C2C2C', background: 'linear-gradient(135deg, rgba(225,154,71,0.1), transparent)' }}>
              <div>
                <p className="es-label mb-1">{selectedEvent.category}</p>
                <h2 className="text-2xl font-black text-white">{selectedEvent.name}</h2>
                <div className="flex gap-2 mt-2">
                  <span className={CATEGORY_BADGE[selectedEvent.category] || 'badge-grey'}>{selectedEvent.category}</span>
                  {selectedEvent.isLaunchPriority && <span className="badge-amber">Core Six</span>}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
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
              {selectedEvent.description && (
                <div>
                  <p className="es-label mb-2">Event Overview</p>
                  <p className="text-es-muted text-sm leading-relaxed">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.coachingNotes && (
                <div>
                  <p className="es-label mb-3">Coaching Notes</p>
                  <div className="es-card-grey p-4 rounded-lg">
                    <p className="text-sm text-es-muted leading-relaxed">{selectedEvent.coachingNotes}</p>
                  </div>
                </div>
              )}

              {selectedEvent.judgingCriteria && (
                <div>
                  <p className="es-label mb-3">Judging Criteria</p>
                  <p className="text-sm text-es-muted leading-relaxed">{selectedEvent.judgingCriteria}</p>
                </div>
              )}

              {!selectedEvent.description && !selectedEvent.coachingNotes && !selectedEvent.judgingCriteria && (
                <div className="text-center py-8">
                  <p className="text-es-muted text-sm">Full event details coming in Phase 2.</p>
                  <p className="text-es-subtle text-xs mt-2">Coaching notes, judging criteria, and programming guidance will be added shortly.</p>
                </div>
              )}

              <div className="pt-2" style={{ borderTop: '1px solid #2C2C2C' }}>
                <p className="text-xs text-es-subtle italic">
                  Event reference data is reviewed by the Educate.Strong coaching and refereeing team.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
