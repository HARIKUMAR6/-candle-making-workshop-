// Small markup partials shared by <site-header> and <site-footer>.
// One definition each, so the logo and the preference controls never drift apart.

import { brand } from '../data/site.js';
import { icons } from './icons.js';

/**
 * Brand lockup. `dir="ltr"` + `lang="en"` keep the wordmark identical in RTL:
 * a logo is artwork — it is placed at the inline-start, but never mirrored or re-set
 * in a different typeface.
 *
 * Wordmark scale steps with the space the bar has: 27px → 32px (sm) → 30px at lg, where the
 * full nav first appears and the bar is fullest → 34px (xl). `compact` keeps a fixed 24px
 * for narrow containers (the mobile menu sheet).
 *
 * Emblem: the flame path fills ~2/3 of its 24-unit icon box, so the box is sized at ~1.6× the
 * wordmark's font size. The drawn flame then matches the wordmark in height and weight at
 * every step. Square box → the flame is scaled, never stretched. The tight gap offsets the
 * icon's built-in side padding.
 */
const WORDMARK = {
  full: 'text-[1.6875rem] sm:text-[2rem] lg:text-[1.875rem] xl:text-[2.125rem]',
  compact: 'text-[1.5rem]',
};
const EMBLEM = {
  full: 'size-[2.75rem] sm:size-[3.25rem] lg:size-[2.875rem] xl:size-[3.5rem]',
  compact: 'size-[2.5rem]',
};

export const logo = ({ descriptor = true, href = 'index.html', compact = false } = {}) => `
  <a href="${href}" class="logo group inline-flex shrink-0 items-center gap-1 text-ink" dir="ltr" lang="en">
    <span class="-ms-1.5 shrink-0 text-accent transition-transform duration-500 group-hover:-rotate-6">${icons.flame({ size: 40, cls: `block ${compact ? EMBLEM.compact : EMBLEM.full}` })}</span>
    <span class="flex flex-col leading-none">
      <span class="font-brand tracking-tight ${compact ? WORDMARK.compact : WORDMARK.full}">${brand.name}</span>
      ${descriptor ? `<span class="mt-1 hidden text-[0.625rem] font-bold uppercase tracking-[0.2em] text-muted sm:block">${brand.descriptor}</span>` : ''}
    </span>
    <span class="sr-only">— home</span>
  </a>`;

/**
 * Theme toggle: a true toggle button, circular (.pref-btn--round). Its name is stable
 * ("Dark theme"); state is exposed with aria-pressed (managed by core/theme.js).
 */
export const themeToggle = ({ size = 18 } = {}) => `
  <button type="button" class="pref-btn pref-btn--round" data-theme-toggle aria-pressed="false" aria-label="Dark theme" title="Toggle dark theme">
    <span class="hidden dark:inline">${icons.sun({ size })}</span>
    <span class="dark:hidden">${icons.moon({ size })}</span>
  </button>`;

/**
 * Direction toggle: a text-only pill showing the current direction (no icon).
 * Accessible name = "Text direction: LTR" (visible text included, WCAG 2.5.3).
 */
export const dirToggle = () => `
  <button type="button" class="pref-btn pref-btn--pill" data-dir-toggle title="Switch text direction">
    <span class="sr-only">Text direction:</span> <span data-dir-label>LTR</span>
  </button>`;
