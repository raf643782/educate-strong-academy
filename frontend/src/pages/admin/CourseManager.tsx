import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../lib/api';

interface Course {
  id: string;
  title: string;
  slug: string;
  pathway: string;
  level: number;
  isPublished: boolean;
  durationHours?: number;
  sortOrder: number;
  _count: { modules: number; enrolments: number };
  modules: { _count: { lessons: number } }[];
}

const pathwayLabel: Record<string, string> = {
  COACHING: 'Coaching',
  REFEREEING: 'Refereeing',
  STRONGKIDZ: 'StrongKidz',
};

const pathwayColour: Record<string, string> = {
  COACHING: 'bg-amber-100 text-amber-700',
  REFEREEING: 'bg-blue-100 text-blue-700',
  STRONGKIDZ: 'bg-green-100 text-green-700',
};

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/courses')
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const togglePublish = async (course: Course) => {
    setUpdating(course.id);
    try {
      await api.put(`/admin/courses/${course.id}`, { isPublished: !course.isPublished });
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isPublished: !c.isPublished } : c));
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  const totalLessons = (course: Course) => course.modules.reduce((sum, m) => sum + (m._count?.lessons || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-1">
                <Link to="/admin" className="hover:text-amber-700">Admin</Link> › Courses
              </p>
              <h1 className="text-3xl font-bold text-gray-900">Course Manager</h1>
            </div>
            <button
              className="bg-gray-200 text-gray-500 text-sm font-medium px-4 py-2 rounded-lg cursor-not-allowed"
              title="Coming in Stage 2"
              disabled
            >
              + Add Course
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="h-5 w-64 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-48 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Pathway</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Modules</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Lessons</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Enrolments</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{course.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Level {course.level} · {course.durationHours}h</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${pathwayColour[course.pathway] || 'bg-gray-100 text-gray-600'}`}>
                          {pathwayLabel[course.pathway] || course.pathway}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <span className="text-sm text-gray-600">{course._count.modules}</span>
                      </td>
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <span className="text-sm text-gray-600">{totalLessons(course)}</span>
                      </td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell">
                        <span className="text-sm text-gray-600">{course._count.enrolments}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => togglePublish(course)}
                          disabled={updating === course.id}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                            course.isPublished ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                            course.isPublished ? 'translate-x-4' : 'translate-x-0.5'
                          }`} />
                        </button>
                        <p className="text-xs text-gray-400 mt-0.5">{course.isPublished ? 'Live' : 'Draft'}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/courses/${course.slug}`}
                          className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                        >
                          Preview
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {courses.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-400">No courses found.</p>
                </div>
              )}
            </div>
          )}

          {/* Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">Full course and module editing available in Stage 2. Use the toggle to publish or unpublish courses.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
