import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  description?: string;
  isCompetitionEvent: boolean;
  isLaunchPriority: boolean;
}

const CATEGORIES = ['All', 'Press Events', 'Deadlift Events', 'Carry Events', 'Loading Events', 'Accessories', 'Mobility'];
const DIFFICULTIES = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'];

const difficultyLabel: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  ELITE: 'Elite',
};

const difficultyColour: Record<string, string> = {
  BEGINNER: 'bg-green-100 text-green-700',
  INTERMEDIATE: 'bg-amber-100 text-amber-700',
  ADVANCED: 'bg-orange-100 text-orange-700',
  ELITE: 'bg-red-100 text-red-700',
};

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filtered, setFiltered] = useState<Exercise[]>([]);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exercises')
      .then(res => { setExercises(res.data); setFiltered(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = exercises;
    if (category !== 'All') result = result.filter(e => e.category === category);
    if (difficulty !== 'All') result = result.filter(e => e.difficulty === difficulty);
    if (search) result = result.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [category, difficulty, search, exercises]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-sm font-medium mb-3 uppercase tracking-wide">Reference Library</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Exercise Library</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Technique breakdowns, coaching cues, progressions, and programming notes for Strongman-specific exercises and key accessories.
          </p>
          <p className="text-gray-500 text-sm mt-4">200 exercises at full build — core events available now</p>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            {/* Category filter */}
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    category === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-1.5 mt-3">
            <span className="text-xs text-gray-500 self-center mr-1">Difficulty:</span>
            {DIFFICULTIES.map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  difficulty === diff
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {diff === 'All' ? 'All' : difficultyLabel[diff]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading exercises...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-2">No exercises found</p>
              <button onClick={() => { setCategory('All'); setDifficulty('All'); setSearch(''); }} className="text-amber-600 hover:text-amber-700 text-sm">Clear filters</button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{filtered.length} exercise{filtered.length !== 1 ? 's' : ''}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(exercise => (
                  <div key={exercise.id} className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${difficultyColour[exercise.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                          {difficultyLabel[exercise.difficulty] || exercise.difficulty}
                        </span>
                        {exercise.isCompetitionEvent && (
                          <span className="text-xs px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-700">Competition Event</span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{exercise.name}</h3>
                    <p className="text-xs text-amber-600 font-medium mb-2">{exercise.category}</p>
                    {exercise.description && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{exercise.description}</p>
                    )}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link
                        to={`/exercises/${exercise.slug}`}
                        className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                      >
                        View Exercise
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
