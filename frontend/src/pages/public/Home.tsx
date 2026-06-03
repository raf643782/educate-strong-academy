import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ImagePlaceholder from '../../components/media/ImagePlaceholder';
import VideoTestimonialCard from '../../components/testimonials/VideoTestimonialCard';
import TestimonialGrid from '../../components/testimonials/TestimonialGrid';
import TutorCard from '../../components/tutors/TutorCard';
import PathwayVisualiser from '../../components/pathway/PathwayVisualiser';
import CommunitySection from '../../components/community/CommunitySection';
import { TUTORS } from '../../data/tutorsData';
import { getHomepageTestimonials, getFeaturedVideoTestimonial } from '../../data/testimonialsData';
import { PATHWAYS } from '../../data/pathwayData';
import api from '../../lib/api';

interface CourseAPI {
  id: string;
  title: string;
  slug: string;
  pathway: string;
  level: number;
  durationHours?: number;
  summary?: string;
}

const coachingPathway = PATHWAYS.find(p => p.id === 'coaching')!;
const writtenTestimonials = getHomepageTestimonials();
const featuredVideo = getFeaturedVideoTestimonial();

const ACCREDITATION_ITEMS = [
  { label: 'Active IQ Accredited', note: 'Ofqual-regulated qualification' },
  { label: 'Endorsed by WHEA.GB', note: 'Level 1 Refereeing' },
  { label: 'Armed Forces Strongman', note: 'Endorsed partner' },
  { label: 'Mind Body Connect', note: 'Charity No. 1173834' },
];

const PATHWAY_CARDS = [
  {
    marker: 'C',
    title: 'Coaching Pathway',
    label: 'COACHING',
    levels: 'Levels 1, 2 & 3',
    badge: 'Active IQ Accredited',
    desc: 'From beginner coaching fundamentals to high-performance athlete management. Build the knowledge — and the credential — to coach Strongman properly.',
    link: '/courses/level-1-coaching-strongman',
    cta: 'View Level 1 Coaching',
  },
  {
    marker: 'R',
    title: 'Refereeing Pathway',
    label: 'REFEREEING',
    levels: 'Level 1',
    badge: 'WHEA.GB Endorsed',
    desc: 'The first formal Strongman refereeing certification in the UK. Endorsed by WHEA.GB and Armed Forces Strongman.',
    link: '/courses/level-1-strongman-refereeing',
    cta: 'View Refereeing Course',
  },
  {
    marker: 'SK',
    title: 'StrongKidz',
    label: 'STRONGKIDZ',
    levels: 'Youth Programme',
    badge: 'Safeguarding Trained',
    desc: 'A weekly youth strength programme developing physical confidence, resilience, and functional movement in children — and coach education for those who deliver it.',
    link: '/strongkidz',
    cta: 'Learn About StrongKidz',
  },
];

export default function Home() {
  const [featuredCourse, setFeaturedCourse] = useState<CourseAPI | null>(null);

  useEffect(() => {
    api.get('/courses/level-1-coaching-strongman').then(res => setFeaturedCourse(res.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── SECTION 1: HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-gray-900 text-white min-h-[88vh] flex items-center">
        {/* Background image layer */}
        <div className="absolute inset-0 overflow-hidden">
          <ImagePlaceholder
            label="Hero background — coaching session on gym floor — Educate.Strong to provide"
            aspectRatio="16/9"
            className="w-full h-full rounded-none opacity-30"
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-5">
              The UK's Original Strongman Coaching Qualification
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              Become a Better Coach.{' '}
              <span className="text-amber-400">Earn the Credentials</span>{' '}
              to Prove It.
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Educate.Strong delivers Active IQ accredited Strongman coaching qualifications,
              refereeing certifications, and youth programme education — built by coaches who have
              competed at the highest level of the sport.
            </p>
            {/* Key facts */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
              {['Active IQ Accredited', 'Practical In-Person Delivery', 'Maximum 10 Participants per Course'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1 h-1 bg-amber-500 rounded-full flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/courses"
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Explore Courses
              </Link>
              <Link
                to="/about"
                className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium px-8 py-4 rounded-lg transition-colors"
              >
                Learn About Educate.Strong
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: TRUST BAR ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {ACCREDITATION_ITEMS.map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">{item.label}</span>
                <span className="text-gray-400 hidden sm:inline">— {item.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: PATHWAY SELECTOR ──────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Three Pathways. One Academy.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Whatever your role in Strongman, Educate.Strong has a qualification pathway built for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PATHWAY_CARDS.map(p => (
              <div key={p.label} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-sm transition-all flex flex-col">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xs font-bold">{p.marker}</span>
                </div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">{p.levels}</span>
                  <span className="text-xs border border-amber-300 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                    {p.badge}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">{p.desc}</p>
                <Link
                  to={p.link}
                  className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 mt-auto"
                >
                  {p.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: TUTOR CREDIBILITY ─────────────────────────────────── */}
      <section className="bg-gray-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Built by Coaches Who Have Done It</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Educate.Strong's tutors bring decades of competition, coaching, and academic experience
              to every qualification.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            {TUTORS.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} variant="compact" />
            ))}
          </div>
          <div className="text-center">
            <Link to="/about" className="text-amber-400 hover:text-amber-300 text-sm font-medium">
              Meet the full team →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FEATURED COURSE ───────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                  Most popular
                </span>
                <span className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded font-medium">
                  Active IQ Accredited
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Level 1 Fundamentals of Coaching Strongman
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                The UK's original Strongman coaching course. Two days. Six core events. Maximum ten
                participants. Practical, hands-on coaching with Paul Smith and Dr Chris Fitzgerald.
              </p>
              {/* Key facts */}
              <div className="flex flex-wrap gap-2 mb-5">
                {['Two-day course', 'Active IQ Level 1', 'From £500'].map(f => (
                  <span key={f} className="text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded">
                    {f}
                  </span>
                ))}
              </div>
              {/* Events */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Log Press', 'Axle Press', 'Deadlift', "Farmer's Walk", 'Yoke', 'Atlas Stones'].map(e => (
                  <span key={e} className="text-xs bg-gray-900 text-gray-200 px-2.5 py-1 rounded font-medium">
                    {e}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/courses/level-1-coaching-strongman"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
                >
                  View Course Details
                </Link>
                <a
                  href="mailto:educate.strongltd@gmail.com?subject=Register%20Interest%20—%20Level%201%20Coaching"
                  className="border border-gray-300 text-gray-700 hover:border-gray-400 font-medium px-6 py-3 rounded-lg transition-colors text-sm"
                >
                  Register Interest
                </a>
              </div>
            </div>
            {/* Image */}
            <ImagePlaceholder
              label="Level 1 Coaching — course photography — coaching session on gym floor — Educate.Strong to provide"
              aspectRatio="4/3"
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 6: VIDEO TESTIMONIAL ─────────────────────────────────── */}
      {featuredVideo && (
        <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-6">What Coaches Say</p>
            <VideoTestimonialCard testimonial={featuredVideo} layout="split" />
            <div className="mt-6 text-center">
              <Link to="/about" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                Read more coach stories →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 7: WRITTEN TESTIMONIALS ─────────────────────────────── */}
      {writtenTestimonials.length > 0 && (
        <section className="bg-white py-16 md:py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TestimonialGrid
              testimonials={writtenTestimonials}
              columns={3}
              heading="Coaches Who Have Made the Move"
              subheading="From personal trainers and gym owners to armed forces coaches and competitive athletes."
            />
          </div>
        </section>
      )}

      {/* ── SECTION 8: LEARNING PATHWAY VISUALISER ───────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              A Complete Professional Pathway
            </h2>
            <p className="text-gray-500 max-w-xl">
              You are not buying a single course. You are entering a structured professional development
              pathway with a recognised qualification at every level.
            </p>
          </div>
          <PathwayVisualiser pathway={coachingPathway} compact />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/courses"
              className="bg-gray-900 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: ACCREDITATIONS ────────────────────────────────────── */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professionally Accredited. Formally Endorsed.</h2>
          <p className="text-gray-500 mb-8 max-w-2xl">Educate.Strong qualifications are backed by recognised awarding organisations and endorsed by Strongman governing bodies.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACCREDITATION_ITEMS.map(item => (
              <div key={item.label} className="border border-gray-200 rounded-xl p-4">
                <div className="h-8 bg-gray-100 rounded mb-3 flex items-center px-2">
                  <span className="text-xs text-gray-400">{item.label} — logo pending permission</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: STRONGKIDZ PREVIEW ──────────────────────────────── */}
      <section className="bg-gray-900 text-white py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Youth Programme</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Developing the Next Generation</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                StrongKidz is a weekly functional strength programme for children. Physical confidence,
                mental resilience, social connection — developed safely, with expert coaching, from a
                young age.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Physical Development', 'Mental Resilience', 'Social Confidence'].map(t => (
                  <span key={t} className="text-xs border border-gray-700 text-gray-300 px-3 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/strongkidz" className="bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  Learn About StrongKidz
                </Link>
                <Link to="/courses/strongkidz-coach-education" className="border border-gray-600 text-gray-300 hover:text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
                  Become a StrongKidz Coach
                </Link>
              </div>
            </div>
            <ImagePlaceholder
              label="StrongKidz — environment or equipment photograph — no child faces until parental consent confirmed"
              aspectRatio="4/3"
              className="rounded-xl opacity-80"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 11: EATSTRONG PREVIEW ────────────────────────────────── */}
      <section className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-xs text-green-700 font-semibold uppercase tracking-widest mb-1">EatStrong</p>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Nutrition Education Built for Strongman</h2>
              <p className="text-gray-500 text-sm max-w-lg">
                Evidence-based, scope-of-practice aware nutrition education for coaches and athletes.
                Not generic nutrition advice repurposed for strength sport — built specifically for it.
              </p>
            </div>
            <Link
              to="/eatstrong"
              className="flex-shrink-0 border border-green-700 text-green-700 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Explore EatStrong
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 12: KNOWLEDGE HUB PREVIEW ───────────────────────────── */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">The Knowledge Hub</h2>
              <p className="text-gray-500 text-sm">Reference articles and coaching guides for Strongman coaches and athletes.</p>
            </div>
            <Link to="/knowledge" className="text-amber-600 hover:text-amber-700 text-sm font-medium hidden sm:block">
              Browse all articles →
            </Link>
          </div>
          {/* Article preview cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { cat: 'Event Technique', title: 'Atlas Stone Technique: What Coaches Need to Know', time: '8 min read' },
              { cat: 'Safe Practice', title: 'Risk Assessment for Strongman Training Environments', time: '6 min read' },
              { cat: 'Programming', title: "How to Build a Beginner's First 12 Weeks", time: '10 min read' },
            ].map(a => (
              <div key={a.title} className="border border-gray-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all">
                <p className="text-xs text-amber-600 font-medium mb-2">{a.cat}</p>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2">{a.title}</h3>
                <p className="text-xs text-gray-400">{a.time} · Free</p>
              </div>
            ))}
          </div>
          <div className="mt-5 sm:hidden">
            <Link to="/knowledge" className="text-amber-600 text-sm font-medium">Browse all articles →</Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 13: COMMUNITY ────────────────────────────────────────── */}
      <CommunitySection />

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start?</h2>
            <p className="text-gray-400 mb-6">
              New course dates are released throughout the year. Register your interest to be notified
              when the next course is confirmed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Explore Courses
              </Link>
              <a
                href="mailto:educate.strongltd@gmail.com?subject=Register%20Interest%20—%20Educate.Strong%20Academy"
                className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium px-8 py-4 rounded-lg transition-colors"
              >
                Register Interest
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
