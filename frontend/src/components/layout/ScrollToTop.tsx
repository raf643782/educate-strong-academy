/**
 * ScrollToTop — scrolls to the top of the page on every route change.
 * Skips scroll when the URL contains a hash (anchor links).
 * Must be placed inside <BrowserRouter> in App.tsx.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If the URL has a hash, let the browser handle anchor scrolling naturally.
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return null;
}
