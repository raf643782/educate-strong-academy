import type { TutorData } from '../../data/coursePageData';

interface CourseTutorsProps {
  heading: string;
  intro?: string;
  tutors: TutorData[];
}

export default function CourseTutors({ heading, intro, tutors }: CourseTutorsProps) {
  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14 md:py-18">
      <div className="es-container-wide">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>{heading}</h2>
          {intro && <p className="text-es-muted text-base leading-relaxed max-w-2xl">{intro}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {tutors.map(tutor => (
            <div key={tutor.name} className="es-card overflow-hidden flex flex-col">
              {/* Photo */}
              <div className="h-52" style={{ background: '#1B1B20' }}>
                {tutor.photoUrl ? (
                  <img
                    src={tutor.photoUrl}
                    alt={tutor.photoAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : tutor.photoAlt ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-es-grey-dark mb-3 flex items-center justify-center">
                      <span className="text-xl font-black text-es-subtle">
                        {tutor.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-xs text-es-subtle">{tutor.photoAlt}</p>
                  </div>
                ) : null}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="font-black text-white mb-0.5">{tutor.name}</p>
                <p className="text-xs font-semibold mb-4" style={{ color: '#A41C64' }}>{tutor.role}</p>
                <ul className="space-y-1.5 mb-4">
                  {tutor.credentials.slice(0, 4).map((c: string) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-es-muted">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-es-subtle leading-relaxed mt-auto">{tutor.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
