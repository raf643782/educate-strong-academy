import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const categoryColour: Record<string, string> = {
  'Press Events': 'bg-blue-100 text-blue-700',
  'Deadlift Events': 'bg-purple-100 text-purple-700',
  'Carry Events': 'bg-green-100 text-green-700',
  'Loading Events': 'bg-amber-100 text-amber-700',
  'Pull Events': 'bg-orange-100 text-orange-700',
  'Hold Events': 'bg-red-100 text-red-700',
};

const CORE_SIX = ['Log Press', 'Axle Press', 'Deadlift', "Farmer's Walk", 'Yoke Walk', 'Atlas Stones'];

export default function EventLibrary() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-sm font-medium mb-3 uppercase tracking-wide">Competition Reference</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Library</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Technical breakdowns, coaching notes, judging criteria, and programming guidance for every major Strongman competition event.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Core Six featured */}
          {coreSix.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">The Core Six Events</h2>
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">Taught in Level 1</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {coreSix.map(event => (
                  <div key={event.id} className="bg-white rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition-all p-6">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium mb-3 inline-block ${categoryColour[event.category] || 'bg-gray-100 text-gray-600'}`}>
                      {event.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.name}</h3>
                    {event.description && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{event.description}</p>
                    )}
                    <Link
                      to={`/events/${event.slug}`}
                      className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                    >
                      View Event
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All events with filter */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Events</h2>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    category === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading events...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500">No events found in this category.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(event => (
                  <div key={event.id} className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all p-5">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium mb-3 inline-block ${categoryColour[event.category] || 'bg-gray-100 text-gray-600'}`}>
                      {event.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2">{event.name}</h3>
                    {event.description && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">{event.description}</p>
                    )}
                    <Link
                      to={`/events/${event.slug}`}
                      className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                    >
                      View Event
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Phase 2 teaser */}
            <div className="mt-10 bg-gray-100 border border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-500 font-medium mb-1">More events coming soon</p>
              <p className="text-gray-400 text-sm">Pull Events, Hold Events, Medleys, and Specialty Events will be added in Phase 2.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
