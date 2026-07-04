import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { CONTACT_EMAIL } from '../../lib/contact';

const TEAM = [
  {
    id: 'paul',
    name: 'Paul Smith',
    role: 'Lead Tutor',
    img: '/assets/paul-smith.avif',
    credentials: [
      '3× UK\'s Strongest Man',
      'Junior UK and World Champion',
      '4× England\'s Strongest Man',
      'World\'s Strongest Man competitor',
      'Coached multiple national and international champions',
      'Co-founder, Mind Body Connect (Charity No. 1173834)',
    ],
    bio: 'Paul brings decades of elite competition and coaching experience to every qualification he delivers. His record speaks for itself — but what makes him exceptional as an educator is the ability to translate that experience into practical, teachable coaching frameworks.',
  },
  {
    id: 'chris',
    name: 'Dr Chris Fitzgerald',
    role: 'Tutor & Programme Lead',
    img: '/assets/chris-fitzgerald.avif',
    credentials: [
      'PhD in Health — published researcher',
      'Natural World\'s Strongest Man athlete',
      'Multiple national Strongman titles',
      'Over a decade with Mind Body Connect charity',
      'Extensive MOD coaching experience',
      'Co-founder, Mind Body Connect (Charity No. 1173834)',
    ],
    bio: 'Chris brings the academic rigour that gives Educate.Strong qualifications their professional credibility. His research background and competition experience sit alongside each other — making every qualification evidence-based and practically grounded.',
  },
  {
    id: 'laura',
    name: 'Laura Hollywood',
    role: 'StrongKidz Coach',
    img: '/assets/laura-hollywood.avif',
    credentials: [
      "Britain's Strongest Woman u73",
      "Europe's Strongest Woman u73",
      'International Strongwoman podiums',
      'StrongKidz co-founder',
      'Youth strength development specialist',
    ],
    bio: 'Laura co-founded StrongKidz with a belief that building physical confidence in young people changes how they see themselves — in the gym and everywhere else. Her competition background and coaching approach make her one of the most compelling youth strength educators in the UK.',
  },
  {
    id: 'victoria',
    name: 'Victoria Wilson',
    role: 'StrongKidz Coach',
    img: '/assets/victoria-wilson.avif',
    credentials: [
      'Strength and Conditioning Coach',
      'Youth development specialist',
      'Powerlifting, weightlifting, and strongwoman competitor',
      'Former Sheffield Steel Roller Derby captain',
      'Sheffield Steel Juniors Strength Coach',
    ],
    bio: 'Victoria brings strength and conditioning expertise and extensive youth sport experience to every StrongKidz session. Her focus on technique, safety, and long-term development makes her an essential part of the programme.',
  },
  {
    id: 'krish',
    name: 'Kris Herbert',
    role: 'Director, Digital & Media',
    img: '/assets/krish-herbert.jpg',
    credentials: [
      'Natural World\'s Strongest Man 2024 — Under 90 kg — Bronze',
      'UK & Ireland\'s Strongest Man 2024 — Under 90 kg — Silver (UKNS)',
      'Wales Strongest Man 2024 — Under 90 kg — Gold (UKNS)',
      'Digital strategy and media production',
      'Education platform development',
    ],
    bio: 'Kris leads the digital presence and media strategy for Educate.Strong, ensuring the Academy platform serves coaches and athletes with a professional, modern experience.',
  },
];

const ACCREDITATIONS = [
  {
    name: 'Active IQ',
    desc: 'Ofqual-regulated awarding organisation. The Level 1 Fundamentals of Coaching Strongman is a formally accredited qualification.',
  },
  {
    name: 'WHEA.GB',
    desc: 'The Level 1 Strongman Refereeing Certification is formally endorsed by WHEA.GB.',
  },
  {
    name: 'Armed Forces Strongman',
    desc: 'Both coaching and refereeing courses are endorsed by Armed Forces Strongman.',
  },
  {
    name: 'Mind Body Connect',
    desc: 'Our tutors are co-founders of Mind Body Connect (Charity No. 1173834), bringing community-driven values to every programme.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-navbar relative"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(164,28,100,0.22) 0%, transparent 65%), #141414',
        }}
      >
        <div className="es-container py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="es-label mb-4">About Educate.Strong</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-5" style={{ letterSpacing: '-0.04em' }}>
              Developing the Sport.<br />Developing the Coaches.
            </h1>
            <p className="text-es-muted text-lg leading-relaxed">
              Educate.Strong exists to provide a legitimate, accredited route for Strongman coaching
              education — and a space for children to develop functional strength, confidence, and resilience.
              Built by coaches who have competed and coached at the highest level of the sport.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="es-section" style={{ background: '#0D0D0D' }}>
        <div className="es-container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="es-label mb-3">Why We Exist</p>
              <h2 className="text-3xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>
                The Standard Strongman Deserves
              </h2>
              <div className="space-y-4 text-es-muted leading-relaxed">
                <p>
                  Strongman is one of the most technically complex strength sports in existence — and one of
                  the most underserved by formal coach education. Until Educate.Strong, there was no structured,
                  accredited pathway for coaches who wanted to do it properly.
                </p>
                <p>
                  The Academy was built to change that. To give Strongman coaches the credentials their
                  knowledge deserves. To give athletes the guarantee that their coach has been trained and
                  assessed, not just self-declared.
                </p>
                <p>
                  To give the sport the professional infrastructure it needs to keep growing.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'The Mission', text: 'Develop the sport of Strongman by providing a legitimate and accredited route for coaching education and a space for children to develop functional strength.' },
                { label: 'The Standard', text: 'Active IQ accreditation. WHEA.GB endorsement. Armed Forces Strongman recognition. Every qualification carries real institutional weight.' },
                { label: 'The Community', text: 'Through Mind Body Connect and partnerships with the MOD and armed forces community, Educate.Strong delivers education where it matters most.' },
              ].map(item => (
                <div key={item.label} className="es-card p-5">
                  <p className="es-label mb-2">{item.label}</p>
                  <p className="text-sm text-es-muted leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        className="es-section"
        style={{ background: '#111111', borderTop: '1px solid #2C2C2C', borderBottom: '1px solid #2C2C2C' }}
      >
        <div className="es-container">
          <div className="mb-12">
            <p className="es-label mb-3">The Team</p>
            <h2 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
              Coaches Who Have Done It
            </h2>
            <p className="text-es-muted max-w-2xl">
              Every qualification is delivered by practitioners who have trained, competed, and coached
              at the highest level of the sport.
            </p>
          </div>

          <div className="space-y-0 divide-y divide-es-grey-dark">
            {TEAM.map(member => (
              <div key={member.id} className="grid md:grid-cols-3 gap-8 py-10">
                {/* Photo */}
                <div className="md:col-span-1">
                  <div className="rounded-lg overflow-hidden aspect-[3/4] max-w-xs es-photo-placeholder"
                    style={{ background: '#3C3C3C' }}>
                    {member.img ? (
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-black text-es-subtle">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-black text-white mb-1">{member.name}</h3>
                  <p className="text-es-accent font-semibold text-sm mb-5">{member.role}</p>

                  <ul className="space-y-1.5 mb-5">
                    {member.credentials.map(c => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-es-muted">
                        <svg className="w-4 h-4 text-es-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>

                  <div className="es-card-grey p-4">
                    <p className="text-sm text-es-muted leading-relaxed italic">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="es-section" style={{ background: '#0D0D0D' }}>
        <div className="es-container">
          <div className="mb-10">
            <p className="es-label mb-3">Recognition</p>
            <h2 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
              Formally Accredited. Properly Endorsed.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {ACCREDITATIONS.map(item => (
              <div key={item.name} className="es-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge-accent">{item.name}</span>
                </div>
                <p className="text-sm text-es-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          {/* British Army logo */}
          <div className="mt-8 flex items-center gap-4">
            <img src="/assets/partner-british-army.webp" alt="British Army" className="h-10 w-auto opacity-60" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/british-army-logo.webp'; }} />
            <p className="text-sm text-es-subtle">Armed Forces Strongman partner — educational support for serving and veteran personnel.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="es-section"
        style={{ background: '#111111', borderTop: '1px solid #2C2C2C' }}
      >
        <div className="es-container">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
              Ready to Start?
            </h2>
            <p className="text-es-muted mb-8">
              Explore the coaching qualifications, refereeing certification, or StrongKidz coach education.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary">Explore Courses</Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
