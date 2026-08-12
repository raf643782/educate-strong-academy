import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initAnalytics } from './lib/analytics';

initAnalytics();

const container = document.getElementById('root')!;

// Prerendered public Exercise/Event pages ship with real markup already
// inside #root (see scripts/prerender.mjs) — those must be hydrated so
// the browser reuses the existing DOM instead of tearing it down and
// redrawing it. Every other route's #root is empty on load, exactly as
// before, and continues mounting via createRoot with no change in
// behaviour (including every protected/authenticated route).
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
