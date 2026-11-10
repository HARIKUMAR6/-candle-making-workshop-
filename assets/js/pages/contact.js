// Contact page: details, visit info and map from site.js; enquiry form behaviour.
import { contact } from '../data/site.js';
import { renderContactList, renderVisitInfo } from '../components/contact-details.js';
import { renderStudioMap } from '../components/studio-map.js';
import { initEnquiryForm } from '../components/enquiry-form.js';

const list = document.querySelector('[data-contact-list]');
if (list) renderContactList(list);

const visit = document.querySelector('[data-visit-info]');
if (visit) renderVisitInfo(visit);

const map = document.querySelector('[data-studio-map]');
if (map) {
  const address = contact.address.confirmed && contact.address.lines ? contact.address.lines.join(', ') : '';
  const state = renderStudioMap(map, contact.location, address);
  const caption = document.querySelector('[data-map-caption]');
  if (caption && state === 'map') caption.textContent = 'Zoom and pan the map to get your bearings around the studio.';
}

initEnquiryForm(document.querySelector('form[data-enquiry-form]'));
