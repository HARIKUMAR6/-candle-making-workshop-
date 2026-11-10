// Contact page details rendered from site.js (single source of truth).
// A value is presented as genuine only when it is confirmed; unconfirmed values carry a
// visible note, and missing values are described honestly rather than invented.

import { contact, social } from '../data/site.js';
import { hasConfirmedLocation, mapUrls } from './studio-map.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const telHref = (v) => 'tel:' + v.replace(/[^\d+]/g, '');
const pending = (text = 'To be confirmed') => `<span class="tag tag-outline mt-2">${text}</span>`;
const missing = (text) => `<p class="text-muted">${text}</p>`;

const icon = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  pin: '<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const svg = (p) => `<svg class="text-accent" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

const item = (key, label, body) => `
  <div class="border-t border-line pt-5" data-contact-item="${key}">
    <dt class="flex items-center gap-3 footer-heading">${svg(icon[key])}${label}</dt>
    <dd class="mt-3">${body}</dd>
  </div>`;

export function renderContactList(dl) {
  const { email, phone, address, hours } = contact;
  const parts = [
    item('mail', 'Email', email.value
      ? `<a class="link-arrow" href="mailto:${esc(email.value)}"><span class="bidi-ltr break-all">${esc(email.value)}</span></a>${email.confirmed ? '' : pending('Email to be confirmed')}`
      : missing('Not published yet — please use the enquiry form.')),
    item('phone', 'Phone', phone.value && phone.confirmed
      ? `<a class="link-arrow" href="${telHref(phone.value)}"><span class="bidi-ltr">${esc(phone.value)}</span></a>`
      : missing('Not published yet — please use the enquiry form or email.')),
    item('pin', 'Studio address', address.lines && address.confirmed
      ? `<address class="not-italic">${address.lines.map(esc).join('<br>')}</address>`
      : missing('To be confirmed.')),
    item('clock', 'Hours', hours.value && hours.confirmed
      ? hours.value.map((h) => `<p>${esc(h)}</p>`).join('')
      : missing('To be confirmed.')),
  ];
  const verifiedSocial = social.filter((s) => s.verified);
  if (verifiedSocial.length) {
    parts.push(`<div class="border-t border-line pt-5 sm:col-span-2" data-contact-item="social"><dt class="footer-heading">Follow along</dt><dd class="mt-3 flex flex-wrap gap-x-6 gap-y-2">${verifiedSocial.map((s) => `<a class="link" href="${esc(s.href)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}<span class="sr-only"> (opens in a new tab)</span></a>`).join('')}</dd></div>`);
  }
  dl.innerHTML = parts.join('');
}

export function renderVisitInfo(el) {
  const { address, hours, visitNotes, location } = contact;
  const blocks = [];
  if (address.lines && address.confirmed) blocks.push(`<address class="lead not-italic">${address.lines.map(esc).join('<br>')}</address>`);
  if (hours.value && hours.confirmed) blocks.push(`<div><p class="footer-heading">Visiting hours</p>${hours.value.map((h) => `<p class="mt-2">${esc(h)}</p>`).join('')}</div>`);
  if (visitNotes.value && visitNotes.confirmed) blocks.push(`<p>${esc(visitNotes.value)}</p>`);
  if (hasConfirmedLocation(location)) {
    const u = mapUrls(location);
    blocks.push(`<div class="hero-actions"><a class="btn btn-primary" href="${u.directions}" target="_blank" rel="noopener noreferrer">Get directions<span class="sr-only"> (opens OpenStreetMap in a new tab)</span></a><a class="btn btn-secondary" href="${u.view}" target="_blank" rel="noopener noreferrer">Open larger map<span class="sr-only"> (opens in a new tab)</span></a></div>`);
  }
  if (!blocks.length) {
    blocks.push(`<p>The studio’s address, visiting hours and directions will be published here as soon as they are confirmed.</p>
      <p class="text-muted">Until then, send us an enquiry and we’ll help you plan your visit.</p>
      <div class="hero-actions"><a class="btn btn-primary" href="#enquiry">Send an enquiry</a></div>`);
  }
  el.innerHTML = blocks.join('');
  el.dataset.state = blocks.length && address.confirmed ? 'confirmed' : 'pending';
}
