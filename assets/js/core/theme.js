// Light / dark theme controller.
// The initial value is applied pre-paint by preferences.js; this module handles changes.
// Any [data-theme-toggle] button is a toggle: stable name, state via aria-pressed.

import { storage } from './storage.js';

const KEY = 'ew-theme';
const root = document.documentElement;
let initialised = false;

export const getTheme = () => (root.dataset.theme === 'dark' ? 'dark' : 'light');

export function syncThemeControls() {
  const pressed = String(getTheme() === 'dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => btn.setAttribute('aria-pressed', pressed));
}

export function setTheme(theme, { persist = true } = {}) {
  // Swap every token in one frame: suspend transitions so surfaces don't fade at different speeds.
  root.setAttribute('data-theme-switching', '');
  root.dataset.theme = theme;
  if (persist) storage.set(KEY, theme);
  syncThemeControls();
  requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute('data-theme-switching')));
  document.dispatchEvent(new CustomEvent('ew:themechange', { detail: { theme } }));
}

export const toggleTheme = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');

export function initTheme() {
  if (initialised) return;
  initialised = true;

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-theme-toggle]')) toggleTheme();
  });
  // Follow OS changes only while the visitor hasn't chosen explicitly.
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!storage.get(KEY)) setTheme(e.matches ? 'dark' : 'light', { persist: false });
  });
  // Components that render controls later announce themselves.
  document.addEventListener('ew:controls-rendered', syncThemeControls);
  syncThemeControls();
}
