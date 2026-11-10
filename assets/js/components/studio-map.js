// Studio map — OpenStreetMap embed (no API key, no extra dependency).
//
// Renders ONLY a confirmed location (site.js → contact.location.confirmed === true with
// numeric lat/lng). Anything else renders an honest "location to be confirmed" state:
// never a guessed pin or a city-centre placeholder.

const ZOOM_SPAN = { lat: 0.0035, lng: 0.006 }; // ≈ street-level bounding box around the pin

export const hasConfirmedLocation = (loc) =>
  !!loc && loc.confirmed === true && Number.isFinite(loc.lat) && Number.isFinite(loc.lng);

/** URLs for a confirmed location (embed, full map, directions). */
export function mapUrls({ lat, lng }) {
  const bbox = [lng - ZOOM_SPAN.lng, lat - ZOOM_SPAN.lat, lng + ZOOM_SPAN.lng, lat + ZOOM_SPAN.lat].map((n) => n.toFixed(6)).join(',');
  return {
    embed: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(6)},${lng.toFixed(6)}`,
    view: `https://www.openstreetmap.org/?mlat=${lat.toFixed(6)}&mlon=${lng.toFixed(6)}#map=17/${lat.toFixed(6)}/${lng.toFixed(6)}`,
    directions: `https://www.openstreetmap.org/directions?to=${lat.toFixed(6)}%2C${lng.toFixed(6)}`,
  };
}

const pinIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`;

/**
 * Render into `container` (a `.frame` with an aspect ratio). `addressText` is used for the
 * accessible title. Returns 'map' | 'pending' so callers/tests know which state rendered.
 */
export function renderStudioMap(container, location, addressText = '') {
  if (!hasConfirmedLocation(location)) {
    container.innerHTML = `
      <div class="photo-pending">
        ${pinIcon}
        <span class="photo-pending__label">Location to be confirmed</span>
        <span class="photo-pending__subject">The studio’s address hasn’t been published yet, so no location is shown. An interactive map will appear here once it is confirmed.</span>
      </div>`;
    container.dataset.state = 'pending';
    return 'pending';
  }
  const urls = mapUrls(location);
  const label = location.label || 'Studio location';
  container.innerHTML = `
    <iframe class="absolute inset-0 size-full border-0" src="${urls.embed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      title="Interactive map: ${label}${addressText ? ', ' + addressText : ''}. Use the map controls or keyboard to zoom and pan."></iframe>`;
  container.dataset.state = 'map';
  return 'map';
}
