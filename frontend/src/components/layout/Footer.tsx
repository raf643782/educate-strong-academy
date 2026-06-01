import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-white font-bold text-lg mb-2">
              Educate<span className="text-amber-500">.</span>Strong
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Professional Strongman Coach Education. Accredited qualifications for coaches, referees, and youth session leaders.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Learning</h4>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-400 hover:text-white text-sm transition-colors">Course Catalogue</Link></li>
              <li><Link to="/knowledge" className="text-gray-400 hover:text-white text-sm transition-colors">Knowledge Hub</Link></li>
              <li><Link to="/exercises" className="text-gray-400 hover:text-white text-sm transition-colors">Exercise Library</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white text-sm transition-colors">Event Library</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-400 hover:text-white text-sm transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
              <li><Link to="/certificates" className="text-gray-400 hover:text-white text-sm transition-colors">Certificates</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Educate.Strong Academy. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Professional Strongman Coach Education
          </p>
        </div>
      </div>
    </footer>
  );
}
