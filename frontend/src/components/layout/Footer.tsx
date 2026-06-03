import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-white font-bold text-lg mb-2">
              Educate<span className="text-amber-500">.</span>Strong
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-3">
              Professional Strongman coach education. Accredited qualifications for coaches, referees, and youth session leaders.
            </p>
            <a
              href="mailto:educate.strongltd@gmail.com"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              educate.strongltd@gmail.com
            </a>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Learn</h4>
            <ul className="space-y-2.5">
              <li><Link to="/courses" className="text-gray-400 hover:text-white text-sm transition-colors">Course Catalogue</Link></li>
              <li><Link to="/courses/level-1-coaching-strongman" className="text-gray-400 hover:text-white text-sm transition-colors">Level 1 Coaching</Link></li>
              <li><Link to="/courses/level-1-strongman-refereeing" className="text-gray-400 hover:text-white text-sm transition-colors">Level 1 Refereeing</Link></li>
              <li><Link to="/strongkidz" className="text-gray-400 hover:text-white text-sm transition-colors">StrongKidz</Link></li>
              <li><Link to="/eatstrong" className="text-green-400 hover:text-green-300 text-sm transition-colors">EatStrong</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5">
              <li><Link to="/knowledge" className="text-gray-400 hover:text-white text-sm transition-colors">Knowledge Hub</Link></li>
              <li><Link to="/exercises" className="text-gray-400 hover:text-white text-sm transition-colors">Exercise Library</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white text-sm transition-colors">Event Library</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5">
              <li><Link to="/register" className="text-gray-400 hover:text-white text-sm transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
              <li><Link to="/certificates" className="text-gray-400 hover:text-white text-sm transition-colors">Certificates</Link></li>
              <li><Link to="/cpd" className="text-gray-400 hover:text-white text-sm transition-colors">CPD Log</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Educate.Strong Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Active IQ Accredited</span>
            <span>·</span>
            <span>WHEA.GB Endorsed</span>
            <span>·</span>
            <span>Armed Forces Strongman</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
