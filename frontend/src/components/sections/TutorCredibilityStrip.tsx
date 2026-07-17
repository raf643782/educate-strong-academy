import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Tutor {
  id: string;
  name: string;
  role: string;
  credential: string;
  img: string;
  initials: string;
  bio: string;
  credentials: string[];
}

/**
 * Order is mandatory: Paul Smith, Dr Chris Fitzgerald, Kris Herbert,
 * Laura Hollywood, Victoria Wilson — at every breakpoint. Kris Herbert
 * is a Strongman competitor and Natural World's Strongest Man 2024
 * bronze medallist who leads the Academy's digital and media platform;
 * he has no StrongKidz role. Bios and full credential lists are reused
 * verbatim from the already-published, verified team data on the About
 * page (pages/public/About.tsx) rather than written fresh here, so
 * nothing below is new or unverified.
 */
const TUTORS: Tutor[] = [
  {
    id: 'paul',
    name: 'Paul Smith',
    role: 'Lead Tutor',
    credential: "3× UK's Strongest Man",
    img: '/assets/paul-smith.avif',
    initials: 'PS',
    bio: 'Paul brings decades of elite competition and coaching experience to every qualification he delivers. His record speaks for itself — but what makes him exceptional as an educator is the ability to translate that experience into practical, teachable coaching frameworks.',
    credentials: [
      "3× UK's Strongest Man",
      "World's Strongest Man competitor",
      'Coached multiple national and international champions',
    ],
  },
  {
    id: 'chris',
    name: 'Dr Chris Fitzgerald',
    role: 'Tutor and Programme Lead',
    credential: 'PhD in Health, Natural WSM Athlete',
    img: '/assets/chris-fitzgerald.avif',
    initials: 'CF',
    bio: 'Chris brings the academic rigour that gives Educate.Strong qualifications their professional credibility. His research background and competition experience sit alongside each other — making every qualification evidence-based and practically grounded.',
    credentials: [
      'PhD in Health — published researcher',
      "Natural World's Strongest Man athlete",
      'Multiple national Strongman titles',
    ],
  },
  {
    id: 'kris',
    name: 'Kris Herbert',
    role: 'Digital and Media',
    credential: 'Natural WSM 2024 Bronze',
    img: '/assets/krish-herbert.jpg',
    initials: 'KH',
    bio: "A Natural World's Strongest Man 2024 bronze medallist, Kris also leads the digital presence and media strategy for Educate.Strong, ensuring the Academy platform serves coaches and athletes with a professional, modern experience.",
    credentials: [
      "Natural World's Strongest Man 2024 — Under 90kg — Bronze",
      "UK & Ireland's Strongest Man 2024 — Under 90kg — Silver",
      'Digital strategy and media production',
    ],
  },
  {
    id: 'laura',
    name: 'Laura Hollywood',
    role: 'StrongKidz Coach',
    credential: "Britain's Strongest Woman u73",
    img: '/assets/laura-hollywood.avif',
    initials: 'LH',
    bio: 'Laura co-founded StrongKidz with a belief that building physical confidence in young people changes how they see themselves — in the gym and everywhere else. Her competition background and coaching approach make her one of the most compelling youth strength educators in the UK.',
    credentials: [
      "Britain's Strongest Woman u73",
      'StrongKidz co-founder',
      'Youth strength development specialist',
    ],
  },
  {
    id: 'victoria',
    name: 'Victoria Wilson',
    role: 'StrongKidz Coach',
    credential: 'Strength and Conditioning Coach',
    img: '/assets/victoria-wilson.avif',
    initials: 'VW',
    bio: 'Victoria brings strength and conditioning expertise and extensive youth sport experience to every StrongKidz session. Her focus on technique, safety, and long-term development makes her an essential part of the programme.',
    credentials: [
      'Strength and Conditioning Coach',
      'Youth development specialist',
      'Powerlifting, weightlifting, and strongwoman competitor',
    ],
  },
];

function TutorCard({ tutor, featured, isOpen, onToggle }: { tutor: Tutor; featured: boolean; isOpen: boolean; onToggle: () => void }) {
  const bioId = `tutor-bio-${tutor.id}`;
  return (
    <div className={`es-tutor-card${isOpen ? ' is-open' : ''}`}>
      <div
        className="es-tutor-card-image"
        style={{ border: featured ? '1px solid rgba(194,24,106,0.35)' : '1px solid transparent' }}
      >
        <img
          src={tutor.img}
          alt={`${tutor.name}, ${tutor.role}`}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = 'none';
            const parent = el.parentElement;
            if (parent) {
              parent.style.display = 'flex';
              parent.style.alignItems = 'center';
              parent.style.justifyContent = 'center';
              parent.style.color = 'rgba(255,255,255,0.4)';
              parent.style.fontWeight = '700';
              const span = document.createElement('span');
              span.textContent = tutor.initials;
              span.setAttribute('aria-hidden', 'true');
              parent.appendChild(span);
            }
          }}
        />

        <div className="es-tutor-bio-panel" id={bioId} role="region" aria-label={`${tutor.name} biography`} aria-hidden={!isOpen}>
          <p className="text-xs text-white/75 leading-relaxed mb-2">{tutor.bio}</p>
          <ul className="space-y-1">
            {tutor.credentials.map((c) => (
              <li key={c} className="text-[10.5px] text-white/45 leading-snug">{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Info — outside the image box, always visible regardless of bio state */}
      <div>
        <p className="font-bold text-[#F5F5F7] text-sm mb-0.5 mt-4">{tutor.name}</p>
        <p className="text-xs text-[#75757D] mb-2.5">{tutor.role}</p>
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full leading-none"
          style={{ background: 'rgba(164,28,100,0.12)', color: '#C2186A', border: '1px solid rgba(194,24,106,0.20)' }}
        >
          {tutor.credential}
        </span>
        <div>
          <button
            type="button"
            className="es-tutor-bio-toggle"
            aria-expanded={isOpen}
            aria-controls={bioId}
            onClick={onToggle}
          >
            {isOpen ? 'Hide bio ↑' : 'Read bio ↓'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TutorCredibilityStrip() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      aria-labelledby="tutors-heading"
      style={{
        background: [
          'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(164,28,100,0.16) 0%, transparent 52%)',
          'radial-gradient(ellipse 55% 65% at 4% 80%, rgba(194,24,106,0.09) 0%, transparent 52%)',
          'radial-gradient(ellipse 45% 55% at 96% 55%, rgba(164,28,100,0.08) 0%, transparent 50%)',
          '#050506',
        ].join(', '),
        borderTop: '1px solid rgba(194,24,106,0.08)',
        borderBottom: '1px solid rgba(194,24,106,0.08)',
        padding: '96px 0',
      }}
    >
      <div className="es-container-wide">
        {/* Header */}
        <div className="mb-10">
          <div style={{ maxWidth: '640px' }}>
            <p className="es-label mb-3">Experience Behind the Academy</p>
            <h2
              id="tutors-heading"
              className="font-black text-[#F5F5F7] leading-tight mb-4"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                letterSpacing: '-0.035em',
              }}
            >
              Learn From People Who Know the Sport
            </h2>
            <p className="text-[#B8B8BE] leading-relaxed" style={{ maxWidth: '580px' }}>
              Educate Strong is delivered by coaches, competitors and educators with practical
              experience across Strongman. Together, they bring years of competition, coaching and
              professional expertise to the courses, technical resources and learning pathways
              across the Academy. Explore their backgrounds and the knowledge they contribute.
            </p>
            <Link
              to="/about"
              className="es-inline-link text-sm font-semibold inline-block mt-4 transition-colors duration-200 hover:text-[#C2186A]"
              style={{ color: '#75757D' }}
            >
              Meet the Team
            </Link>
          </div>
        </div>

        {/* Tutor grid — portrait cards, mandatory order, biography panel per card */}
        <div className="es-tutor-grid">
          {TUTORS.map((tutor, i) => (
            <div className="es-tutor-card-wrap" key={tutor.id}>
              <TutorCard
                tutor={tutor}
                featured={i === 0}
                isOpen={openId === tutor.id}
                onToggle={() => setOpenId((cur) => (cur === tutor.id ? null : tutor.id))}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
