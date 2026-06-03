import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TutorGrid from '../../components/tutors/TutorGrid';
import VideoTestimonialCard from '../../components/testimonials/VideoTestimonialCard';
import TestimonialGrid from '../../components/testimonials/TestimonialGrid';
import ImagePlaceholder from '../../components/media/ImagePlaceholder';
import { TUTORS } from '../../data/tutorsData';
import { TESTIMONIALS } from '../../data/testimonialsData';

const videoTestimonials = TESTIMONIALS.filter(t => t.isVideo);
const allWritten = TESTIMONIALS.filter(t => !t.isVideo);

const ACCREDITATIONS = [
  {
    name: 'Active IQ',
    description: 'Ofqual-regulated awarding organisation. The Level 1 Fundamentals of Coaching Strongman is a formally accredited qualification.',
    note: 'Logo to be confirmed with Active IQ before display',
  },
  {
    name: 'WHEA.GB',
    description: 'The Level 1 Strongman Refereeing Certification is formally endorsed by WHEA.GB, one of the UK\'s leading Strongman governing bodies.',
    note: 'Logo pending written permission from WHEA.GB',
  },
  {
    name: 'Armed Forces Strongman',
    description: 'Both coaching and refereeing courses are endorsed by Armed Forces Strongman, reflecting the organisation\'s close ties to the armed forces community.',
    note: 'Logo pending written permission from Armed Forces Strongman',
  },
  {
    name: 'Mind Body Connect',
    description: 'Educate.Strong\'s tutors are co-founders of Mind Body Connect (Charity No. 1173834), bringing community-driven values to every programme.',
    note: 'Charity registration confirmed',
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
              About Educate.Strong
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
              Developing the Sport. Developing the Coaches.
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Educate.Strong exists to provide a legitimate, accredited route for Strongman coaching
              education — and a space for children to develop functional strength, confidence, and
              resilience. Built by coaches who have competed and coached at the highest level of the sport.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white border-b border-gray-100 py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                Why Educate.Strong Exists
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Strongman is one of the most technically complex strength sports — and one of the
                  least served by formal coach education. Until Educate.Strong, there was no structured,
                  accredited pathway for coaches who wanted to teach it properly.
                </p>
                <p>
                  The Academy was built to change that. To give Strongman coaches the credentials their
                  knowledge deserves. To give athletes the guarantee that their coach has been assessed,
                  not just self-declared. To give the sport the professional infrastructure it needs to
                  keep growing.
                </p>
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-5 mt-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Placeholder — mission statement</p>
                  <p className="text-sm text-gray-400 italic">
                    This section will contain a more personal mission statement from Educate.Strong.
                    To be provided by Paul Smith and Dr Chris Fitzgerald in their own words.
                  </p>
                </div>
              </div>
            </div>
            <ImagePlaceholder
              label="Team photograph — Educate.Strong full team — high value asset, Educate.Strong to provide"
              aspectRatio="4/3"
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Tutor profiles */}
      <section className="bg-gray-50 border-b border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Meet the Team</h2>
            <p className="text-gray-600 max-w-2xl">
              Every Educate.Strong qualification is delivered by coaches who have trained, competed,
              and coached at the highest level of the sport.
            </p>
          </div>
          <TutorGrid tutors={TUTORS} variant="full" />
        </div>
      </section>

      {/* Accreditations */}
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Accreditations and Endorsements
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Educate.Strong qualifications are backed by recognised awarding organisations and endorsed
            by Strongman governing bodies.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {ACCREDITATIONS.map(item => (
              <div key={item.name} className="border border-gray-200 rounded-xl p-6">
                {/* Logo placeholder */}
                <div className="bg-gray-100 rounded-lg h-10 flex items-center px-3 mb-4">
                  <span className="text-xs text-gray-400 font-medium">
                    {item.name} — {item.note}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video testimonials archive */}
      {videoTestimonials.length > 0 && (
        <section className="bg-gray-50 border-b border-gray-100 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              What Coaches Say — Video Testimonials
            </h2>
            <div className="space-y-10">
              {videoTestimonials.map(t => (
                <VideoTestimonialCard key={t.id} testimonial={t} layout="split" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Written testimonials archive */}
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialGrid
            testimonials={allWritten}
            columns={3}
            heading="Testimonials"
            subheading="From coaches, referees, and parents who have experienced Educate.Strong programmes."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-3">Ready to Start?</h2>
            <p className="text-gray-400 mb-6">
              Explore the coaching qualifications, refereeing certification, or StrongKidz coach education.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
              >
                Explore Courses
              </Link>
              <a
                href="mailto:educate.strongltd@gmail.com"
                className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium px-7 py-3.5 rounded-lg transition-colors text-sm"
              >
                Contact Educate.Strong
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
