/**
 * VenueMap — a single, real, no-API-key map embed (OpenStreetMap's
 * public embed endpoint) pinning one venue.
 *
 * No search field, no fake result, no dependency added. Pan and zoom
 * are OpenStreetMap's own native controls, not custom UI. If the
 * iframe fails to load (blocked network, offline), onError swaps in a
 * plain text fallback with the same Get Directions link, so the
 * essential information and action are never solely inside the map.
 * The pin itself is static — no continuous animation.
 */
import { useState } from 'react';

export default function VenueMap({
  latitude,
  longitude,
  label,
  directionsUrl,
}: {
  latitude: number;
  longitude: number;
  label: string;
  directionsUrl: string;
}) {
  const [failed, setFailed] = useState(false);
  const delta = 0.01;
  const bbox = [longitude - delta, latitude - delta, longitude + delta, latitude + delta].join(',');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  if (failed) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center gap-3 rounded-xl"
        style={{ height: '260px', background: '#151519', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-sm text-white/50 px-6">Map preview unavailable right now. The venue details above are correct.</p>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold" style={{ color: '#C2186A' }}>
          Get Directions →
        </a>
      </div>
    );
  }

  return (
    <iframe
      title={`Map showing the venue location for ${label}`}
      src={src}
      onError={() => setFailed(true)}
      style={{ width: '100%', height: '260px', border: 0, borderRadius: '12px', filter: 'grayscale(0.15) contrast(1.05)' }}
      loading="lazy"
    />
  );
}
