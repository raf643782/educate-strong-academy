/**
 * Lightweight GA4 analytics wrapper.
 *
 * All tracking is gated on VITE_GA_MEASUREMENT_ID. If the env var is
 * absent (development, staging, or pre-launch production) no network
 * requests are made and no window.gtag is defined.
 *
 * No personal data is collected or transmitted — only event names,
 * page paths, and anonymous interaction metadata.
 */

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(..._args: unknown[]) {
    window.dataLayer!.push(arguments);
  }
  window.gtag = gtag;
  window.gtag('js', new Date());
  // Disable automatic page views — trackPageView handles them after
  // each SPA navigation so the path is always correct.
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageView(path: string): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag('event', name, params);
}
