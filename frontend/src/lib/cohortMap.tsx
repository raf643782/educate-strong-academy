/**
 * Shared real-data venue map primitives, used by both the homepage
 * cohort spotlight and any course page date section that shows a real
 * confirmed cohort. Real coordinates only — no fake pin, no search box.
 */
import { useState } from 'react';

export function hasValidCoords(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): latitude is number {
  return (
    typeof latitude === 'number' && typeof longitude === 'number' &&
    Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
  );
}

export function VenueMap({ latitude, longitude, label }: { latitude: number; longitude: number; label: string }) {
  const [failed, setFailed] = useState(false);
  const span = 0.01;
  const bbox = `${longitude - span},${latitude - span},${longitude + span},${latitude + span}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  if (failed) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 220, background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-xs text-white/35 px-6 text-center">Map unavailable right now — see the address and directions link above.</p>
      </div>
    );
  }

  return (
    <iframe
      title={`Map showing ${label}`}
      src={src}
      style={{ border: 0, width: '100%', minHeight: 220 }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
