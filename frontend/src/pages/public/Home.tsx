import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Badge, { pathwayVariant } from '../../components/ui/Badge';
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

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data)).catch(() => {});
  }, []);

  const pathwayLabel = (p: string) =>
    p === 'COACHING' ? 'Coaching' : p === 'REFEREEING' ? 'Refereeing' : 'StrongKidz';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-900 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-600/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              <span className="text-amber-400 text-sm font-medium">Professional Coach Education</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              The UK's Professional<br />
              <span className="text-amber-500">Strongman</span> Coach Education
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              Educate.Strong delivers accredited qualifications for Strongman coaches, referees, and youth session leaders. Evidence-based, practically focused, built by coaches for coaches.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Explore Courses
              </Link>
              <Link
                to="/knowledge"
                className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Knowledge Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pathway Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Three Learning Pathways</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Qualifications designed for every role in the Strongman community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Coaching Pathway',
                label: 'COACHING',
                levels: 'Levels 1, 2 & 3',
                marker: 'C',
                desc: 'From beginner coaching fundamentals through to high-performance athlete management. Build the knowledge to coach at every level of the sport.',
                link: '/courses',
              },
              {
                title: 'Refereeing Pathway',
                label: 'REFEREEING',
                levels: 'Level 1',
                marker: 'R',
                desc: 'Learn to officiate Strongman competitions consistently and fairly. Covers event rules, judging decisions, competition operations, and safety.',
                link: '/courses',
              },
              {
                title: 'StrongKidz Pathway',
                label: 'STRONGKIDZ',
                levels: 'Level 1',
                marker: 'SK',
                desc: 'Professional education for coaches delivering youth Strongman sessions. Covers safeguarding, youth development, and age-appropriate programming.',
                link: '/courses',
              },
            ].map(p => (
              <div key={p.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-4">
                  {p.marker}
                </div>
                <Badge variant={pathwayVariant(p.label)} className="mb-4">{pathwayLabel(p.label)}</Badge>
                <h3 className="text-xl font-bold text-gray-900 mb-1 mt-3">{p.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{p.levels}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{p.desc}</p>
                <Link
                  to={p.link}
                  className="text-amber-600 hover:text-amber-700 text-sm font-semibold inline-flex items-center gap-1"
                >
                  View courses <span>&rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      {courses.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">All Qualifications</h2>
                <p className="text-gray-500">Start your professional development journey.</p>
              </div>
              <Link to="/courses" className="text-amber-600 hover:text-amber-700 font-semibold text-sm hidden md:block">
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map(course => (
                <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-gray-900 to-amber-900 flex items-end p-5">
                    <div className="flex gap-2">
                      <Badge variant={pathwayVariant(course.pathway)}>{pathwayLabel(course.pathway)}</Badge>
                      <Badge variant={course.level === 1 ? 'level1' : course.level === 2 ? 'level2' : 'level3'}>
                        Level {course.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 leading-snug">{course.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.summary || course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{course.durationHours}h</span>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                      >
                        View course &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Educate.Strong?</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Built specifically for Strongman. Not adapted from generic fitness education.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'Accredited Courses',
                desc: 'Recognised qualifications mapped to national coaching frameworks. Your certificate means something.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Expert Team',
                desc: 'Developed by experienced Strongman coaches and sports science professionals who understand the sport at every level.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                title: 'Practical Learning',
                desc: 'Case studies, event coaching guides, programming assignments, and practical observation tasks grounded in real coaching.',
              },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-amber-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start your coaching education?</h2>
          <p className="text-amber-100 text-lg mb-8">Enrol in Level 1 Fundamentals of Coaching Strongman today.</p>
          <Link
            to="/courses/level-1-coaching-strongman"
            className="bg-white text-amber-700 hover:bg-amber-50 font-bold px-8 py-4 rounded-lg transition-colors text-lg inline-block"
          >
            Start Level 1
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
