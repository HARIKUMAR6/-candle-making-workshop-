// LTR / RTL controller. Layout reacts through CSS logical properties and
// Tailwind's rtl:/ltr: variants — JS only flips the attribute.
// Any [data-dir-toggle] button switches direction; its [data-dir-label] shows the current one.

import { storage } from './storage.js';

const KEY = 'ew-dir';
const root = document.documentElement;
let initialised = false;

export const getDir = () => (root.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr');
export const isRTL = () => getDir() === 'rtl';

export function syncDirControls() {
  const label = getDir().toUpperCase();
  document.querySelectorAll('[data-dir-toggle] [data-dir-label]').forEach((el) => { el.textContent = label; });
}

export function setDir(dir) {
  root.setAttribute('dir', dir);
  storage.set(KEY, dir);
  syncDirControls();
  document.dispatchEvent(new CustomEvent('ew:dirchange', { detail: { dir } }));
}

export function initDirection() {
  if (initialised) return;
  initialised = true;

  if (!root.hasAttribute('dir')) root.setAttribute('dir', 'ltr');
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-dir-toggle]')) setDir(isRTL() ? 'ltr' : 'rtl');
  });
  document.addEventListener('ew:controls-rendered', syncDirControls);
  syncDirControls();
}
