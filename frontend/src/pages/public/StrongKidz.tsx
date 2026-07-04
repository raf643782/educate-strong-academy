import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { CONTACT_EMAIL } from '../../lib/contact';
import { useDocumentHead } from '../../hooks/useDocumentHead';

type Tab = 'parents' | 'coaches';

const BENEFITS = [
  {
    title: 'Physical Development',
    desc: 'Functional strength, coordination, and movement quality. Age-appropriate loading — technique always before intensity.',
  },
  {
    title: 'Mental Resilience',
    desc: 'Learning that hard work produces results. The psychological confidence that comes from proving to yourself you can do something difficult.',
  },
  {
    title: 'Social Confidence',
    desc: 'Training alongside peers. Encouraging others. The community culture of strength sport at an age where it shapes who you become.',
  },
];

const SAFEGUARDING = [
  'All StrongKidz coaches hold current DBS (Disclosure and Barring Service) clearances',
  'All coaches hold safeguarding qualifications specific to youth sport',
  'Session content is age-appropriate — no maximum loads, no adult lifting protocols',
  'All participants require a signed consent and health information form before attending',
  'Photography and filming policy: confirmed written consent required before any images are shared',
  'Any safeguarding concern can be raised directly with Educate.Strong',
];

export default function StrongKidz() {
  useDocumentHead({
    title: 'StrongKidz',
    description: 'Youth strength education — functional movement, coordination, and confidence for young athletes.',
  });

  const [tab, setTab] = useState<Tab>('parents');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050506' }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="pt-navbar relative overflow-hidden"
        style={{
          background: [
            'radial-gradient(ellipse 100% 70% at 30% -10%, rgba(164,28,100,0.22) 0%, transparent 55%)',
            'radial-gradient(ellipse 55% 55% at 90% 80%, rgba(194,24,106,0.07) 0%, transparent 52%)',
            '#050506',
          ].join(', '),
        }}
      >
        <div className="es-container py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="es-label mb-4">Youth Strength Programme</p>
              <h1
                className="text-4xl md:text-5xl font-black text-white mb-5"
                style={{ letterSpacing: '-0.04em' }}
              >
                StrongKidz
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed" style={{ color: '#B8B8BE' }}>
                A weekly functional strength programme for children. Physical confidence, mental
                resilience, and social development — built safely, with expert coaching.
              </p>

              {/* Audience tabs */}
              <div
                className="flex gap-1.5 p-1.5 rounded-xl mb-8 inline-flex"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {(['parents', 'coaches'] as Tab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="text-sm font-semibold transition-all duration-200"
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      background: tab === t ? 'rgba(164,28,100,0.22)' : 'transparent',
                      border: `1px solid ${tab === t ? 'rgba(194,24,106,0.40)' : 'transparent'}`,
                      color: tab === t ? '#C2186A' : 'rgba(255,255,255,0.40)',
                    }}
                  >
                    {t === 'parents' ? 'For Parents' : 'For Coaches'}
                  </button>
                ))}
              </div>
            </div>

            {/* Image */}
            <div
              className="rounded-2xl overflow-hidden h-80 lg:h-96"
              style={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img
                src="/assets/strongkidz.avif"
                alt="StrongKidz programme"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PARENT JOURNEY ──────────────────────────────────────────────── */}
      {tab === 'parents' && (
        <>
          {/* SAFEGUARDING — must be first */}
          <section
            style={{
              background: '#050506',
              padding: '64px 0',
              borderTop: '1px solid rgba(194,24,106,0.08)',
              borderBottom: '1px solid rgba(194,24,106,0.08)',
            }}
          >
            <div className="es-container">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(164,28,100,0.12)', border: '1px solid rgba(164,28,100,0.28)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: '#C2186A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text-white">Your Child's Safety Is Our Priority</h2>
                </div>

                <div
                  className="rounded-2xl p-6 mb-5"
                  style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <ul className="space-y-3">
                    {SAFEGUARDING.map(item => (
                      <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#B8B8BE' }}>
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C2186A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(225,154,71,0.07)', border: '1px solid rgba(225,154,71,0.22)' }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: '#E19A47' }}>
                    Any concern about safeguarding can be raised directly by contacting{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section
            style={{
              background: [
                'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(164,28,100,0.14) 0%, transparent 52%)',
                '#050506',
              ].join(', '),
              padding: '64px 0',
              borderBottom: '1px solid rgba(194,24,106,0.08)',
            }}
          >
            <div className="es-container">
              <div className="mb-10">
                <p className="es-label mb-3">What Your Child Develops</p>
                <h2
                  className="text-3xl font-black text-white"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  More Than Physical Strength
                </h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                {BENEFITS.map(b => (
                  <div
                    key={b.title}
                    className="rounded-2xl p-6"
                    style={{
                      background: '#151519',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderTop: '2px solid #B37A20',
                    }}
                  >
                    <h3 className="font-bold text-white mb-3">{b.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#75757D' }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How sessions work */}
          <section
            style={{
              background: '#050506',
              padding: '64px 0',
              borderBottom: '1px solid rgba(194,24,106,0.08)',
            }}
          >
            <div className="es-container">
              <div className="max-w-2xl">
                <p className="es-label mb-3">Sessions</p>
                <h2
                  className="text-3xl font-black text-white mb-5"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  What a StrongKidz Session Looks Like
                </h2>
                <div
                  className="rounded-2xl p-6 mb-4"
                  style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p
                    className="text-xs uppercase tracking-widest font-semibold mb-2"
                    style={{ color: '#55555E' }}
                  >
                    Session Structure
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#75757D' }}>
                    Specific session structure, duration, group size, and activity details to be confirmed by
                    Educate.Strong. This section will be updated with exact session information before the
                    public launch.
                  </p>
                </div>
                <p className="text-sm" style={{ color: '#55555E' }}>
                  Sessions are currently based in Sheffield. Contact Educate.Strong for details on availability and location.
                </p>
              </div>
            </div>
          </section>

          {/* Coaches */}
          <section
            style={{
              background: [
                'radial-gradient(ellipse 80% 55% at 88% 30%, rgba(164,28,100,0.10) 0%, transparent 52%)',
                '#050506',
              ].join(', '),
              padding: '64px 0',
              borderBottom: '1px solid rgba(194,24,106,0.08)',
            }}
          >
            <div className="es-container">
              <div className="mb-8">
                <p className="es-label mb-3">The Coaches</p>
                <h2
                  className="text-3xl font-black text-white"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Expert, Qualified, Safeguarding-Trained
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                {[
                  {
                    name: 'Laura Hollywood',
                    role: 'StrongKidz Coach & Co-founder',
                    img: '/assets/laura-hollywood.avif',
                    creds: ["Britain's Strongest Woman u73", "Europe's Strongest Woman u73", 'Youth strength development specialist'],
                  },
                  {
                    name: 'Victoria Wilson',
                    role: 'StrongKidz Coach',
                    img: '/assets/victoria-wilson.avif',
                    creds: ['Strength and Conditioning Coach', 'Youth sport specialist', 'Sheffield Steel Juniors Strength Coach'],
                  },
                ].map(coach => (
                  <div
                    key={coach.name}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="h-48" style={{ background: '#1B1B20' }}>
                      <img src={coach.img} alt={coach.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="p-5">
                      <p className="font-bold text-white mb-0.5">{coach.name}</p>
                      <p className="text-xs font-semibold mb-3" style={{ color: '#C2186A' }}>{coach.role}</p>
                      <ul className="space-y-1">
                        {coach.creds.map(c => (
                          <li key={c} className="text-xs flex items-center gap-2" style={{ color: '#75757D' }}>
                            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#C2186A' }} />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Register */}
          <section
            style={{
              background: [
                'radial-gradient(ellipse 100% 70% at 50% 50%, rgba(164,28,100,0.18) 0%, transparent 60%)',
                '#050506',
              ].join(', '),
              padding: '80px 0',
            }}
          >
            <div className="es-container max-w-2xl">
              <p className="es-label mb-3">Get Involved</p>
              <h2
                className="text-3xl font-black text-white mb-4"
                style={{ letterSpacing: '-0.03em' }}
              >
                Interested in StrongKidz for Your Child?
              </h2>
              <p className="mb-8" style={{ color: '#B8B8BE' }}>
                Sessions are Sheffield-based. Spaces are limited. Register your interest and
                Educate.Strong will be in touch with availability and session details.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register-interest?interest=StrongKidz%20(Parent)"
                  className="btn-primary"
                >
                  Register Interest
                </Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className="btn-secondary">
                  Contact Educate.Strong
                </a>
              </div>
              <p className="text-xs mt-4" style={{ color: '#55555E' }}>No payment required at this stage.</p>
            </div>
          </section>
        </>
      )}

      {/* ── COACH JOURNEY ──────────────────────────────────────────────── */}
      {tab === 'coaches' && (
        <>
          <section
            style={{
              background: [
                'radial-gradient(ellipse 90% 60% at 20% 10%, rgba(164,28,100,0.16) 0%, transparent 52%)',
                '#050506',
              ].join(', '),
              padding: '64px 0',
              borderTop: '1px solid rgba(194,24,106,0.08)',
              borderBottom: '1px solid rgba(194,24,106,0.08)',
            }}
          >
            <div className="es-container">
              <div className="max-w-3xl">
                <p className="es-label mb-3">Deliver StrongKidz</p>
                <h2
                  className="text-3xl font-black text-white mb-5"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Earn the Qualification. Run the Programme.
                </h2>
                <p className="leading-relaxed mb-8" style={{ color: '#B8B8BE' }}>
                  StrongKidz Coach Education is a professional certification for adults who want to deliver
                  the StrongKidz programme safely and effectively. Covers safeguarding, youth development,
                  age-appropriate movement, session planning, and parent communication.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    'PE teachers and school sport staff',
                    'Youth coaches and club leaders',
                    'Fitness instructors working with children',
                    'Gym owners wanting to run youth sessions',
                    'Community sport leaders',
                    'Anyone with a passion for youth development',
                  ].map(item => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-sm rounded-xl p-3"
                      style={{
                        background: '#151519',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: '#B8B8BE',
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: '#B37A20' }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link to="/courses/strongkidz-coach-education" className="btn-primary">
                    Explore Certification
                  </Link>
                  <Link
                    to="/register-interest?interest=StrongKidz%20Coach%20Education"
                    className="btn-secondary"
                  >
                    Ask a Question
                  </Link>
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
