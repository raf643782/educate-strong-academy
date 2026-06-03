import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid #2C2C2C' }}>
      <div className="es-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <img src="/assets/es-logo.png" alt="Educate.Strong" className="h-9 w-auto mb-4" />
            <p className="text-es-muted text-sm leading-relaxed mb-3">
              Professional Strongman education. Accredited qualifications for coaches, referees, and youth session leaders.
            </p>
            <p className="text-es-subtle text-xs italic">Discipline. Integrity. Resilience.</p>
          </div>

          {/* Learn */}
          <div>
            <p className="es-label mb-4">Learn</p>
            <ul className="space-y-2.5">
              {[
                { to: '/courses', l: 'All Courses' },
                { to: '/courses/level-1-coaching-strongman', l: 'Level 1 Coaching' },
                { to: '/courses/level-1-strongman-refereeing', l: 'Level 1 Refereeing' },
                { to: '/strongkidz', l: 'StrongKidz' },
                { to: '/eatstrong', l: 'EatStrong' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-es-subtle hover:text-white transition-colors">
                    {item.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="es-label mb-4">Resources</p>
            <ul className="space-y-2.5">
              {[
                { to: '/knowledge', l: 'Knowledge Hub' },
                { to: '/exercises', l: 'Exercise Library' },
                { to: '/events', l: 'Event Library' },
                { to: '/about', l: 'About' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-es-subtle hover:text-white transition-colors">
                    {item.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="es-label mb-4">Account</p>
            <ul className="space-y-2.5">
              {[
                { to: '/register', l: 'Get Started' },
                { to: '/login', l: 'Sign In' },
                { to: '/dashboard', l: 'Dashboard' },
                { to: '/certificates', l: 'Certificates' },
                { to: '/cpd', l: 'CPD Log' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-es-subtle hover:text-white transition-colors">
                    {item.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="es-divider mb-8" />

        {/* Accreditations */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
          {[
            'Active IQ Accredited',
            'Endorsed by WHEA.GB',
            'Armed Forces Strongman',
            'Mind Body Connect — Charity No. 1173834',
          ].map(item => (
            <span key={item} className="flex items-center gap-1.5 text-xs text-es-subtle">
              <span className="w-1 h-1 rounded-full bg-es-accent flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-es-subtle">
            &copy; {new Date().getFullYear()} Educate.Strong Ltd. All rights reserved.
          </p>
          <a href="mailto:educate.strongltd@gmail.com"
            className="text-xs text-es-subtle hover:text-es-muted transition-colors">
            educate.strongltd@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
