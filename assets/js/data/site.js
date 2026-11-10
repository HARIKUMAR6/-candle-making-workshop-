// Single source of truth for brand + navigation. Header, footer and pages read from here.

export const brand = {
  name: 'Ember & Wick',
  descriptor: 'Candle Atelier & Workshop',
  // Verified brand facts only (see docs/CONTENT-NEEDS.md).
  intro: 'A candle-making studio teaching the craft by hand — hands-on workshops for every level, and DIY kits for making at home.',
  email: 'hello@emberandwick.studio', // project placeholder — see `contact.email.confirmed`
};

/**
 * Contact & location details — the ONLY place they are defined.
 * Rule: a value is shown as genuine only when `confirmed: true`.
 *  - confirmed: false + value  → shown with a visible "to be confirmed" note
 *  - value: null               → not shown; the page explains it will be published
 * To go live, fill in the value and set confirmed: true. Nothing else needs editing.
 */
export const contact = {
  email: { value: brand.email, confirmed: false },
  phone: { value: null, confirmed: false },          // e.g. '+44 20 7946 0000' (shown as typed, dialled as digits)
  /**
   * Studio address + map location: ONE place, used by Contact details, the visit section
   * and the map. Set by the client's brief (2026-11-10) to a real public venue so the map
   * works end to end; it is NOT the business's verified premises. Before launch, replace
   * both `address.lines` and `location` with the real studio (see docs/CONTENT-NEEDS.md C1/C2).
   * Coordinates are OpenStreetMap's own for this address (Nominatim: way 16306646,
   * "Old Spitalfields Market", postcode E1 6EW), so the pin and the text always agree.
   */
  address: { lines: ['Old Spitalfields Market', 'London E1 6EW', 'United Kingdom'], confirmed: true },
  hours: { value: null, confirmed: false },           // e.g. ['Tue–Fri · 10:00–18:00', 'Sat · 10:00–16:00']
  visitNotes: { value: null, confirmed: false },      // e.g. 'Visits by appointment — the studio is on the first floor.'
  /**
   * Map pin for `address` above (same place). With confirmed: false or null lat/lng the
   * map section shows a "location to be confirmed" state instead of a pin.
   */
  location: { lat: 51.5196, lng: -0.075363, label: 'Ember & Wick studio', confirmed: true },
};

/**
 * Form submission. No backend exists yet. Set `enquiryEndpoint` to an HTTPS URL that
 * accepts a POST of FormData and returns a 2xx status (e.g. a form-handling service
 * or the studio's own server). While it is null the form validates fully but never
 * pretends to send: it tells the visitor nothing was sent and offers to send the same
 * message by email instead.
 */
export const forms = {
  enquiryEndpoint: null,
  enquiryMethod: 'POST',
};

/** Primary navigation. `id` matches <body data-page="…"> to mark the current page. */
export const nav = [
  {
    id: 'home',
    label: 'Home',
    children: [
      { id: 'home-1', label: 'Home 01', href: 'index.html' },
      { id: 'home-2', label: 'Home 02', href: 'home-2.html' },
    ],
  },
  { id: 'about', label: 'About', href: 'about.html' },
  { id: 'workshops', label: 'Workshops', href: 'workshops.html' },
  { id: 'kits', label: 'Kits', href: 'kits.html' },
  { id: 'contact', label: 'Contact', href: 'contact.html' },
];

export const primaryCta = { label: 'Book a workshop', href: 'workshops.html#book' };

/**
 * Social profiles. TODO before launch: replace with the studio's real profile URLs
 * and set `verified: true`. Unverified profiles are not listed as contact details.
 * `icon` maps to a key in components/icons.js.
 */
export const social = [
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/', verified: false },
  { label: 'Pinterest', icon: 'pinterest', href: 'https://www.pinterest.com/', verified: false },
  { label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/', verified: false },
];

/** Workshop formats offered for enquiry (labels must match docs/CONTENT-NEEDS.md #1). */
export const workshopFormats = [
  { id: 'container-candles', label: 'Container candles' },
  { id: 'scent-blending', label: 'Scent blending' },
  { id: 'pillar-candles', label: 'Pillar & decorative candles' },
];
