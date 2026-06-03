import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ImagePlaceholder from '../../components/media/ImagePlaceholder';
import TutorCard from '../../components/tutors/TutorCard';
import TestimonialGrid from '../../components/testimonials/TestimonialGrid';
import { TUTORS } from '../../data/tutorsData';
import { TESTIMONIALS } from '../../data/testimonialsData';
import GalleryGrid from '../../components/media/GalleryGrid';

const strongkidzTutors = TUTORS.filter(t => t.id === 'laura-hollywood' || t.id === 'victoria-wilson');
const parentTestimonials = TESTIMONIALS.filter(t => t.courseSlug === 'strongkidz');

const GALLERY_PLACEHOLDERS = Array.from({ length: 6 }, (_, i) => ({
  id: `gallery-${i + 1}`,
  alt: 'StrongKidz session photograph — awaiting parental consent. Do not publish until consent is confirmed for each child shown.',
}));

const BENEFITS = [
  {
    title: 'Physical Development',
    description: 'Functional strength, coordination, and movement quality. No powerlifting, no maximum loads. Age-appropriate loading with technique before all else.',
  },
  {
    title: 'Mental Resilience',
    description: 'Learning to try difficult things. Understanding that hard work produces results. The psychological confidence that comes from proving to yourself you can do something hard.',
  },
  {
    title: 'Social Confidence',
    description: 'Training in a group. Supporting peers. The community culture of strength sport — encouragement, not competition — at an age where that distinction matters enormously.',
  },
];

type AudienceTab = 'parents' | 'coaches';

export default function StrongKidz() {
  const [activeTab, setActiveTab] = useState<AudienceTab>('parents');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Trust badges */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-3">
          {['Safeguarding Trained Coaches', 'Weekly Programme', 'Sheffield-Based'].map(b => (
            <span key={b} className="text-xs border border-amber-500/30 bg-amber-500/10 text-amber-300 px-3 py-1 rounded font-medium uppercase tracking-wide">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
              Developing Strength, Confidence, and Resilience in Young People
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
              StrongKidz is a weekly youth strength programme for children, built on the belief that
              physical confidence — developed safely and with expert guidance — changes how young people
              see themselves and the world.
            </p>
            {/* Audience selector */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('parents')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'parents'
                    ? 'bg-amber-600 text-white'
                    : 'border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'
                }`}
              >
                For Parents
              </button>
              <button
                onClick={() => setActiveTab('coaches')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'coaches'
                    ? 'bg-amber-600 text-white'
                    : 'border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'
                }`}
              >
                For Coaches and Educators
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARENT JOURNEY ─────────────────────────────────────────────── */}
      {activeTab === 'parents' && (
        <>
          {/* SAFEGUARDING — must appear first for parent audience */}
          <section className="bg-white border-b border-gray-100 py-14 md:py-18">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Your Child's Safety Is Our Priority
                  </h2>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                  <ul className="space-y-3">
                    {[
                      'All StrongKidz coaches hold current DBS (Disclosure and Barring Service) clearances',
                      'All coaches hold safeguarding qualifications specific to youth sport',
                      'Session content is age-appropriate — no maximum loads, no powerlifting',
                      'All participants require a signed consent and health information form before attending',
                      'Photography and filming policy: confirmed written consent required before any images are shared',
                    ].map(item => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-amber-800">
                    Placeholder — session ratios to be confirmed by Educate.Strong before this section goes live.
                    Any concern about safeguarding can be raised by contacting{' '}
                    <a href="mailto:educate.strongltd@gmail.com" className="underline">educate.strongltd@gmail.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why StrongKidz */}
          <section className="bg-gray-50 border-b border-gray-100 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                    Why We Built StrongKidz
                  </h2>
                  <div className="bg-white border border-dashed border-gray-200 rounded-xl p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                      Placeholder — founder statement
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed italic">
                      This section will contain a personal statement from Laura Hollywood explaining
                      the motivation for creating StrongKidz and what she believes functional physical
                      confidence does for young people. To be provided by Educate.Strong in first-person,
                      authentic language — not marketing copy.
                    </p>
                  </div>
                </div>
                <ImagePlaceholder
                  label="StrongKidz environment or equipment photograph — no child faces until parental consent confirmed — Educate.Strong to provide"
                  aspectRatio="4/3"
                  className="rounded-xl"
                />
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="bg-white border-b border-gray-100 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                What Your Child Develops
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {BENEFITS.map(b => (
                  <div key={b.title} className="border border-gray-200 rounded-xl p-6">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How sessions work */}
          <section className="bg-gray-50 border-b border-gray-100 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                  What a StrongKidz Session Looks Like
                </h2>
                <div className="bg-white border border-dashed border-gray-200 rounded-xl p-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                    Placeholder — session structure
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    This section should describe a typical session: duration, structure (warm-up,
                    skill work, games, cool-down), typical activities, group size, and environment.
                    Parents need to visualise what their child will be doing. Educate.Strong to provide
                    specific session structure details.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Meet the coaches */}
          <section className="bg-white border-b border-gray-100 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Meet the StrongKidz Coaches
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {strongkidzTutors.map(t => (
                  <TutorCard key={t.id} tutor={t} variant="course" />
                ))}
              </div>
            </div>
          </section>

          {/* Parent testimonials */}
          {parentTestimonials.length > 0 && (
            <section className="bg-gray-50 border-b border-gray-100 py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <TestimonialGrid
                  testimonials={parentTestimonials}
                  columns={2}
                  heading="What Parents Say"
                  subheading="Written testimonials from parents of StrongKidz participants."
                  showCourse={false}
                />
              </div>
            </section>
          )}

          {/* Gallery */}
          <section className="bg-white border-b border-gray-100 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">StrongKidz in Action</h2>
              </div>
              <GalleryGrid
                items={GALLERY_PLACEHOLDERS}
                columns={3}
                placeholderLabel="StrongKidz session photograph — parental consent required per child — do not publish until confirmed"
              />
              <p className="text-xs text-gray-400 mt-4">
                Session photographs will appear here once written parental consent is obtained for each child shown.
                All images are displayed with the parent or guardian's permission.
              </p>
            </div>
          </section>

          {/* Register interest */}
          <section className="bg-gray-900 text-white py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">Interested in StrongKidz for Your Child?</h2>
              <p className="text-gray-300 mb-2">
                Sessions are based in Sheffield. Spaces are limited.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Register your interest and we will be in touch with availability and session details.
              </p>
              <a
                href="mailto:educate.strongltd@gmail.com?subject=StrongKidz%20—%20Register%20Interest%20(Parent)"
                className="inline-block bg-amber-600 hover:bg-amber-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
              >
                Register Interest
              </a>
              <p className="text-xs text-gray-500 mt-3">
                No payment required at this stage. We will contact you directly.
              </p>
            </div>
          </section>
        </>
      )}

      {/* ── COACH JOURNEY ──────────────────────────────────────────────── */}
      {activeTab === 'coaches' && (
        <>
          <section className="bg-white border-b border-gray-100 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                  Deliver StrongKidz. Earn the Qualification.
                </h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  StrongKidz Coach Education is a professional certification for adults who want to
                  deliver the StrongKidz programme safely and effectively. It covers safeguarding,
                  youth development, age-appropriate movement, session planning, and parent communication.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">Who Should Do This</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {['PE teachers and school sport staff', 'Youth coaches and club leaders', 'Fitness instructors working with children', 'Gym owners wanting to run youth sessions'].map(role => (
                      <div key={role} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                        {role}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/courses/strongkidz-coach-education"
                    className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
                  >
                    Explore StrongKidz Coach Certification
                  </Link>
                  <a
                    href="mailto:educate.strongltd@gmail.com?subject=StrongKidz%20Coach%20Education%20Enquiry"
                    className="border border-gray-300 text-gray-700 hover:border-gray-400 font-medium px-7 py-3.5 rounded-lg transition-colors text-sm"
                  >
                    Ask a Question
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
