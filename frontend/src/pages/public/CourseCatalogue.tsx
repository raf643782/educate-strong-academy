import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Badge, { pathwayVariant, levelVariant } from '../../components/ui/Badge';
import api from '../../lib/api';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary?: string;
  pathway: string;
  level: number;
  durationHours?: number;
}

type Filter = 'ALL' | 'COACHING' | 'REFEREEING' | 'STRONGKIDZ';

const pathwayLabel = (p: string) =>
  p === 'COACHING' ? 'Coaching' : p === 'REFEREEING' ? 'Refereeing' : 'StrongKidz';

export default function CourseCatalogue() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? courses : courses.filter(c => c.pathway === filter);

  const tabs: { label: string; value: Filter }[] = [
    { label: 'All Courses', value: 'ALL' },
    { label: 'Coaching', value: 'COACHING' },
    { label: 'Refereeing', value: 'REFEREEING' },
    { label: 'StrongKidz', value: 'STRONGKIDZ' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Course Catalogue</h1>
          <p className="text-gray-400 text-lg">Professional Strongman qualifications for coaches, referees, and youth leaders.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-10">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === tab.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading courses...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-44 bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 flex items-end p-5">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={pathwayVariant(course.pathway)}>{pathwayLabel(course.pathway)}</Badge>
                    <Badge variant={levelVariant(course.level)}>Level {course.level}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-amber-700 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                    {course.summary || course.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.durationHours}h
                    </div>
                    <Link
                      to={`/courses/${course.slug}`}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
