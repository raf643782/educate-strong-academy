import { Link } from 'react-router-dom';

/* Partner logo component — handles both real images and text fallbacks */
function PartnerLogo({
  src, alt, textFallback, className = '',
}: {
  src?: string; alt: string; textFallback: string; className?: string;
}) {
  if (src) {
    return (
      <div className={`flex items-center justify-center h-10 px-3 rounded ${className}`}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #3C3C3C' }}>
        <img src={src} alt={alt} className="h-6 w-auto opacity-75 object-contain" />
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center h-10 px-3 rounded ${className}`}
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #3C3C3C' }}>
      <span className="text-xs font-bold text-es-muted">{textFallback}</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#080808', borderTop: '1px solid #2C2C2C' }}>

      {/* Partner / trust logos strip */}
      <div style={{ background: '#0D0D0D', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-6">
          <p className="text-xs text-es-subtle uppercase tracking-widest mb-4">Partners &amp; Recognition</p>
          <div className="flex flex-wrap items-center gap-3">
            {/* Active IQ */}
            <PartnerLogo
              textFallback="Active IQ Accredited"
              alt="Active IQ"
            />
            {/* WHEA.GB */}
            <PartnerLogo
              textFallback="WHEA.GB Endorsed"
              alt="WHEA.GB — World Heavy Events Association"
            />
            {/* British Army */}
            <PartnerLogo
              src="/assets/british-army-logo.webp"
              alt="British Army — Armed Forces Strongman Partner"
              textFallback="Armed Forces"
            />
            {/* Mind Body Connect */}
            <PartnerLogo
              src="/assets/mind-body-connect-logo.avif"
              alt="Mind Body Connect — Charity No. 1173834"
              textFallback="Mind Body Connect"
            />
          </div>
          <p className="text-xs text-es-subtle mt-3">
            Built around recognised education standards, practical Strongman experience, and trusted delivery partners.
          </p>
        </div>
      </div>

      {/* Main footer columns */}
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

        {/* Divider */}
        <div className="es-divider mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-es-subtle">
              &copy; {new Date().getFullYear()} Educate.Strong Ltd. All rights reserved.
            </p>
            {/* VIRES branding — subtle, professional */}
            <p className="text-xs" style={{ color: '#3C3C3C' }}>
              Powered by{' '}
              <span className="font-bold" style={{ color: '#4A4A4A' }}>VIRES</span>
              {' '}— Professional strength sport coaching ecosystem.
            </p>
          </div>
          <a href="mailto:educate.strongltd@gmail.com"
            className="text-xs text-es-subtle hover:text-es-muted transition-colors">
            educate.strongltd@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
