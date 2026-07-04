import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <div className="pt-navbar flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <p className="es-label mb-4" style={{ color: '#A41C64' }}>404</p>
          <h1 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.03em' }}>
            Page not found
          </h1>
          <p className="text-es-muted mb-8">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="btn-primary text-sm">Back to Home</Link>
            <Link to="/knowledge" className="btn-secondary text-sm">Knowledge Hub</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
