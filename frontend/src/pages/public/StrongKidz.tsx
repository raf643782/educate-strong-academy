import { useEffect, useRef, useState } from 'react';
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

const SESSION_FIELDS = [
  { label: 'Location', value: 'Sheffield — exact venue to be confirmed' },
  { label: 'Age range', value: 'To be confirmed' },
  { label: 'Group size', value: 'To be confirmed' },
  { label: 'Session length', value: 'To be confirmed' },
  { label: 'Price', value: 'To be confirmed' },
];

const COACH_WHO_FOR = [
  'PE teachers and school sport staff',
  'Youth coaches and club leaders',
  'Fitness instructors working with children',
  'Gym owners wanting to run youth sessions',
  'Community sport leaders',
  'Anyone with a passion for youth development',
];

const COACH_WHAT_YOU_LEARN = [
  'Safeguarding responsibilities specific to youth sport',
  'Youth development principles and age-appropriate coaching',
  'Age-appropriate movement progressions and loading',
  'Session planning for group youth coaching',
  'Parent communication and consent processes',
];

const PARENT_FAQS = [
  {
    q: 'What is StrongKidz?',
    a: "StrongKidz is Educate Strong's youth strength programme — Strongman-inspired training focused on movement, confidence and positive experiences of strength for children in Sheffield, delivered by safeguarding-trained coaches.",
  },
  {
    q: 'Who is StrongKidz for?',
    a: 'StrongKidz is for children and young people in Sheffield who want to build strength, movement confidence and a positive introduction to training, under experienced, safeguarding-trained coaching.',
  },
  {
    q: 'What happens in a StrongKidz session?',
    a: 'Exact session structure and duration are being finalised and will be confirmed when you register your interest. Sessions are built around age-appropriate strength and movement coaching, with technique always placed before intensity.',
  },
  {
    q: 'Is strength training appropriate for children?',
    a: "Age-appropriate strength and movement coaching, delivered correctly, is a recognised way to build young people's physical confidence and movement skills. StrongKidz sessions are coached by qualified, safeguarding-trained coaches who prioritise technique over intensity throughout.",
  },
  {
    q: 'What information do I need to provide before my child joins?',
    a: "All participants require a signed consent and health information form before attending, along with Educate.Strong's photography and filming consent where relevant.",
  },
  {
    q: 'How do I register interest?',
    a: 'Register your interest online and Educate.Strong will be in touch directly with availability, venue and session details. No payment is required at this stage.',
  },
];

const COACH_FAQS = [
  {
    q: 'What is StrongKidz Coach Education?',
    a: 'StrongKidz Coach Education is a professional certification for adults who want to deliver the StrongKidz programme safely and effectively, covering safeguarding, youth development, age-appropriate movement, session planning and parent communication.',
  },
  {
    q: 'Who can take the StrongKidz Coach Education course?',
    a: "It's designed for PE teachers and school sport staff, youth coaches and club leaders, fitness instructors working with children, gym owners, community sport leaders, and anyone with a genuine interest in youth development.",
  },
  {
    q: 'How do I register for Coach Education?',
    a: 'Explore the certification page for full details, or register your interest directly and Educate.Strong will be in touch.',
  },
];

const SCHEMA_ID = 'strongkidz-faq-schema';

export default function StrongKidz() {
  const canonicalUrl = 'https://educate-strong-academy.vercel.app/strongkidz';

  useDocumentHead({
    title: 'StrongKidz — Youth Strength Programme in Sheffield',
    description:
      "StrongKidz is Educate Strong's youth strength programme in Sheffield — movement, confidence and positive experiences of strength for children, coached by safeguarding-trained coaches. Also home to StrongKidz Coach Education for adults.",
    canonical: canonicalUrl,
  });

  const [tab, setTab] = useState<Tab>('parents');
  const parentsTabRef = useRef<HTMLButtonElement>(null);
  const coachesTabRef = useRef<HTMLButtonElement>(null);

  // FAQPage schema — only for the real, visible FAQ content above.
  useEffect(() => {
    const allFaqs = [...PARENT_FAQS, ...COACH_FAQS];
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = SCHEMA_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(SCHEMA_ID)?.remove();
    };
  }, []);

  const switchTab = (next: Tab) => {
    setTab(next);
    (next === 'parents' ? parentsTabRef : coachesTabRef).current?.focus();
  };

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      switchTab(tab === 'parents' ? 'coaches' : 'parents');
    }
  };

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
        <div className="es-container-wide py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="es-label mb-4">Youth Strength Programme</p>
              <h1
                className="text-4xl md:text-5xl font-black text-white mb-5"
                style={{ letterSpacing: '-0.04em' }}
              >
                StrongKidz
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed" style={{ color: '#B8B8BE' }}>
                A weekly Strongman-inspired strength programme for children in Sheffield —
                developed around movement, confidence and positive experiences of strength.
                Age-appropriate coaching from experienced, safeguarding-trained coaches,
                delivered with care.
              </p>

              {/* Audience portal tabs */}
              <div
                role="tablist"
                aria-label="StrongKidz audience"
                className="flex gap-1.5 p-1.5 rounded-xl mb-2 inline-flex"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <button
                  ref={parentsTabRef}
                  role="tab"
                  id="strongkidz-tab-parents"
                  aria-selected={tab === 'parents'}
                  aria-controls="strongkidz-panel-parents"
                  tabIndex={tab === 'parents' ? 0 : -1}
                  onClick={() => switchTab('parents')}
                  onKeyDown={handleTabKeyDown}
                  className="text-sm font-semibold transition-all duration-200 motion-reduce:transition-none"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    background: tab === 'parents' ? 'rgba(164,28,100,0.22)' : 'transparent',
                    border: `1px solid ${tab === 'parents' ? 'rgba(194,24,106,0.40)' : 'transparent'}`,
                    color: tab === 'parents' ? '#C2186A' : 'rgba(255,255,255,0.40)',
                  }}
                >
                  For Parents
                </button>
                <button
                  ref={coachesTabRef}
                  role="tab"
                  id="strongkidz-tab-coaches"
                  aria-selected={tab === 'coaches'}
                  aria-controls="strongkidz-panel-coaches"
                  tabIndex={tab === 'coaches' ? 0 : -1}
                  onClick={() => switchTab('coaches')}
                  onKeyDown={handleTabKeyDown}
                  className="text-sm font-semibold transition-all duration-200 motion-reduce:transition-none"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    background: tab === 'coaches' ? 'rgba(164,28,100,0.22)' : 'transparent',
                    border: `1px solid ${tab === 'coaches' ? 'rgba(194,24,106,0.40)' : 'transparent'}`,
                    color: tab === 'coaches' ? '#C2186A' : 'rgba(255,255,255,0.40)',
                  }}
                >
                  For Coaches
                </button>
              </div>
              <p className="text-xs mb-8" style={{ color: '#55555E' }}>
                {tab === 'parents'
                  ? 'Showing information for parents and families.'
                  : 'Showing information for coaches and organisations.'}
              </p>
            </div>

            {/* Image */}
            <div
              className="rounded-2xl overflow-hidden h-80 lg:h-[26rem]"
              style={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img
                src="/assets/strongkidz.avif"
                alt="Young athletes taking part in a coached StrongKidz strength session"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PARENT PORTAL ────────────────────────────────────────────────── */}
      <div
        id="strongkidz-panel-parents"
        role="tabpanel"
        aria-labelledby="strongkidz-tab-parents"
        hidden={tab !== 'parents'}
      >
        {/* What StrongKidz Is */}
        <section
          style={{ background: '#050506', padding: '64px 0', borderTop: '1px solid rgba(194,24,106,0.08)', borderBottom: '1px solid rgba(194,24,106,0.08)' }}
        >
          <div className="es-container-wide">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
              <div>
                <p className="es-label mb-3">What StrongKidz Is</p>
                <h2 className="text-2xl md:text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
                  A Coached Introduction to Strength, Built Around Young People
                </h2>
              </div>
              <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#B8B8BE' }}>
                StrongKidz introduces children to Strongman-inspired strength training —
                movement, confidence and positive experiences of strength, through
                age-appropriate coaching rather than a scaled-down adult programme. Every
                session is led by coaches with real competition and youth-coaching experience,
                with technique always placed before intensity.
              </p>
            </div>
          </div>
        </section>

        {/* Safeguarding */}
        <section style={{ background: '#050506', padding: '64px 0', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
          <div className="es-container-wide">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(164,28,100,0.12)', border: '1px solid rgba(164,28,100,0.28)' }}>
                  <svg className="w-5 h-5" style={{ color: '#C2186A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-white">How StrongKidz Approaches Safeguarding</h2>
              </div>

              <div className="rounded-2xl p-6 mb-5" style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#B8B8BE' }}>
                  Full safeguarding, Coach verification and booking information will be confirmed before sessions open.
                </p>
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(225,154,71,0.07)', border: '1px solid rgba(225,154,71,0.22)' }}>
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
            background: ['radial-gradient(ellipse 90% 55% at 50% 0%, rgba(164,28,100,0.14) 0%, transparent 52%)', '#050506'].join(', '),
            padding: '64px 0',
            borderBottom: '1px solid rgba(194,24,106,0.08)',
          }}
        >
          <div className="es-container-wide">
            <div className="mb-10">
              <p className="es-label mb-3">What Your Child Develops</p>
              <h2 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>More Than Physical Strength</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5 mb-8">
              {BENEFITS.map(b => (
                <div key={b.title} className="rounded-2xl p-6" style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)', borderTop: '2px solid #B37A20' }}>
                  <h3 className="font-bold text-white mb-3">{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#75757D' }}>{b.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: '#75757D' }}>
              Nutrition also plays a part in how young athletes feel and perform. See{' '}
              <Link to="/eatstrong/articles/nutrition-young-strongman-athletes" className="es-inline-link font-semibold" style={{ color: '#C2186A' }}>
                Nutrition for Young Strongman Athletes
              </Link>{' '}
              on EatStrong.
            </p>
          </div>
        </section>

        {/* Sessions */}
        <section style={{ background: '#050506', padding: '64px 0', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
          <div className="es-container-wide">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
              <div className="max-w-xl">
                <p className="es-label mb-3">Sessions</p>
                <h2 className="text-3xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>What a StrongKidz Session Looks Like</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#75757D' }}>
                  Exact session structure, timetable and pricing are being finalised by
                  Educate.Strong and will be confirmed here before public launch. Register your
                  interest to be contacted directly as soon as details are available.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}>
                <dl>
                  {SESSION_FIELDS.map((f, i) => (
                    <div
                      key={f.label}
                      className="flex items-center justify-between px-5 py-4"
                      style={i > 0 ? { borderTop: '1px solid rgba(255,255,255,0.06)' } : undefined}
                    >
                      <dt className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#55555E' }}>{f.label}</dt>
                      <dd className="text-sm font-semibold text-right" style={{ color: '#75757D' }}>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Coaches */}
        <section
          style={{
            background: ['radial-gradient(ellipse 80% 55% at 88% 30%, rgba(164,28,100,0.10) 0%, transparent 52%)', '#050506'].join(', '),
            padding: '64px 0',
          }}
        >
          <div className="es-container-wide">
            <div className="mb-8">
              <p className="es-label mb-3">The Coaches</p>
              <h2 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>Experienced and Safeguarding-Trained</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mb-6">
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
                <div key={coach.name} className="rounded-2xl overflow-hidden" style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)' }}>
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
            <Link to="/about" className="es-inline-link text-sm font-semibold" style={{ color: '#C2186A' }}>
              Meet the full Educate Strong team →
            </Link>
          </div>
        </section>
      </div>

      {/* ── COACH PORTAL ──────────────────────────────────────────────── */}
      <div
        id="strongkidz-panel-coaches"
        role="tabpanel"
        aria-labelledby="strongkidz-tab-coaches"
        hidden={tab !== 'coaches'}
      >
        <section
          style={{
            background: ['radial-gradient(ellipse 90% 60% at 20% 10%, rgba(164,28,100,0.16) 0%, transparent 52%)', '#050506'].join(', '),
            padding: '64px 0',
            borderTop: '1px solid rgba(194,24,106,0.08)',
            borderBottom: '1px solid rgba(194,24,106,0.08)',
          }}
        >
          <div className="es-container-wide">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
              <div>
                <p className="es-label mb-3">Deliver StrongKidz</p>
                <h2 className="text-3xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>
                  Earn the Qualification. Run the Programme.
                </h2>
                <p className="leading-relaxed mb-8 max-w-xl" style={{ color: '#B8B8BE' }}>
                  StrongKidz Coach Education is a professional certification for adults who want
                  to deliver the StrongKidz programme safely and effectively. This is currently
                  Educate Strong's entry point for coaches wanting to deliver StrongKidz
                  sessions.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Link to="/courses/strongkidz-coach-education" className="btn-primary">Explore Certification</Link>
                  <Link to="/register-interest?type=strongkidz" className="btn-secondary">Ask a Question</Link>
                </div>
                <p className="text-sm" style={{ color: '#75757D' }}>
                  Coaching a wider age range or sport? Browse the full{' '}
                  <Link to="/courses" className="es-inline-link font-semibold" style={{ color: '#C2186A' }}>Course Catalogue</Link>, or read{' '}
                  <Link to="/knowledge/strongman-safety-screening" className="es-inline-link font-semibold" style={{ color: '#C2186A' }}>
                    Strongman Safety: Screening and Risk Management for Coaches
                  </Link>{' '}
                  on the Knowledge Hub.
                </p>
              </div>

              <div>
                <p className="es-label mb-3">Who It's For</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {COACH_WHO_FOR.map(item => (
                    <div key={item} className="flex items-center gap-2.5 text-sm rounded-xl p-3" style={{ background: '#151519', border: '1px solid rgba(255,255,255,0.07)', color: '#B8B8BE' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#B37A20' }} />
                      {item}
                    </div>
                  ))}
                </div>
                <p className="es-label mb-3">What You'll Learn</p>
                <ul className="space-y-2">
                  {COACH_WHAT_YOU_LEARN.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: '#B8B8BE' }}>
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C2186A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── FAQ (both audiences, always visible) ─────────────────────────── */}
      <section style={{ background: '#050506', padding: '64px 0', borderBottom: '1px solid rgba(194,24,106,0.08)' }}>
        <div className="es-container-wide">
          <div className="mb-10 max-w-2xl">
            <p className="es-label mb-3">Questions</p>
            <h2 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>Frequently Asked Questions</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-4" style={{ color: '#C2186A' }}>For Parents</h3>
              <div className="space-y-5">
                {PARENT_FAQS.map(f => (
                  <div key={f.q}>
                    <p className="font-bold text-white text-sm mb-1.5">{f.q}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#75757D' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-4" style={{ color: '#C2186A' }}>For Coaches</h3>
              <div className="space-y-5">
                {COACH_FAQS.map(f => (
                  <div key={f.q}>
                    <p className="font-bold text-white text-sm mb-1.5">{f.q}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#75757D' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOWER CTA (always visible, both portals) ──────────────────────── */}
      <section
        className="es-grit"
        style={{
          background: ['radial-gradient(ellipse 90% 70% at 50% 50%, rgba(164,28,100,0.20) 0%, transparent 62%)', '#050506'].join(', '),
          position: 'relative',
        }}
      >
        <div className="es-container-wide py-16 md:py-20">
          <div className="max-w-2xl mb-10">
            <p className="es-label mb-3">Get Involved</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
              Bring StrongKidz to Your Child — or Deliver It Yourself
            </h2>
            <p className="text-base leading-relaxed" style={{ color: '#B8B8BE' }}>
              Whether you're a parent interested in StrongKidz for your child, or a coach
              wanting to deliver the programme, the next step is the same: register your
              interest and Educate.Strong will be in touch directly. No payment is required at
              this stage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-xl font-black text-white mb-2">For Parents</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#B8B8BE' }}>
                Sessions are Sheffield-based with limited spaces. Register your interest and
                you'll be contacted with availability and session details.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/register-interest?type=strongkidz" className="btn-primary">Register Interest</Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className="btn-secondary">Contact Educate.Strong</a>
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-xl font-black text-white mb-2">For Coaches</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#B8B8BE' }}>
                Earn the StrongKidz Coach Education certification and deliver the programme
                yourself — covering safeguarding, youth development and session planning.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/courses/strongkidz-coach-education" className="btn-primary">Explore Certification</Link>
                <Link to="/register-interest?type=strongkidz" className="btn-secondary">Ask a Question</Link>
              </div>
            </div>
          </div>

          <p className="text-xs mt-6" style={{ color: '#55555E' }}>No payment required at this stage.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
