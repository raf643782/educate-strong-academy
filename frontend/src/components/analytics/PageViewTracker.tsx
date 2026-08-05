import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';

/**
 * Fires a GA4 page_view event on every SPA route change.
 * Renders nothing — drop it anywhere inside <BrowserRouter>.
 */
export default function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}
