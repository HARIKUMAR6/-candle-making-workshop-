// <site-header> — shared header, rendered in light DOM so Tailwind utilities apply.
//
// - Current page comes from <body data-page="…">.
// - Renders once; every listener is bound with an AbortSignal and released in
//   disconnectedCallback, so re-attaching the element never duplicates handlers.
// - Desktop "Home" is a disclosure popover (click to open; closes on selection,
//   outside click, Escape, Tab-out). Arrow keys move through its links.
// - The mobile menu is a modal sheet that slides in from the inline-start edge
//   (left in LTR, right in RTL), with focus trap, scroll lock and backdrop.

import { brand, nav, primaryCta } from '../data/site.js';
import { icons } from './icons.js';
import { logo, themeToggle, dirToggle } from './partials.js';
import { initDisclosure } from '../core/disclosure.js';

const DESKTOP = '(min-width: 64rem)';
const current = () => document.body.dataset.page || '';
const isCurrent = (item) => item.id === current() || (item.children ?? []).some((c) => c.id === current());
const ariaCurrent = (id) => (id === current() ? 'aria-current="page"' : '');

// ---------- Markup ----------

function desktopItem(item) {
  if (!item.children) {
    return `<li><a href="${item.href}" class="nav-link" ${ariaCurrent(item.id)}>${item.label}</a></li>`;
  }
  return `
    <li class="relative" data-disclosure="popover">
      <button type="button" class="nav-link group" aria-expanded="false" aria-controls="nav-${item.id}" ${isCurrent(item) ? 'data-current' : ''}>
        ${item.label}${isCurrent(item) ? '<span class="sr-only">(current section)</span>' : ''}
        ${icons.chevronDown({ size: 16, cls: 'transition-transform duration-300 group-aria-expanded:rotate-180' })}
      </button>
      <ul id="nav-${item.id}" hidden
          class="absolute start-0 top-[calc(100%+0.625rem)] z-10 min-w-44 rounded-md border border-line bg-surface-raised p-1.5 shadow-lift">
        ${item.children.map((c) => `
          <li><a href="${c.href}" class="dropdown-link" ${ariaCurrent(c.id)}>${c.label}</a></li>`).join('')}
      </ul>
    </li>`;
}

// Step number column: w-7 (1.75rem) + gap-4 (1rem) = 2.75rem — the sub-list indent below matches it.
const number = (i) => `<span class="w-7 shrink-0 font-sans text-caption font-bold tabular-nums text-muted" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>`;

function mobileItem(item, i) {
  if (!item.children) {
    return `
      <li class="border-b border-line">
        <a href="${item.href}" class="mobile-link" ${ariaCurrent(item.id)}>${number(i)}<span>${item.label}</span></a>
      </li>`;
  }
  return `
    <li class="border-b border-line" data-disclosure="accordion">
      <button type="button" class="mobile-link w-full group" aria-expanded="${isCurrent(item)}" aria-controls="m-nav-${item.id}" ${isCurrent(item) ? 'data-current' : ''}>
        ${number(i)}<span>${item.label}</span>
        ${icons.chevronDown({ size: 20, cls: 'ms-auto text-muted transition-transform duration-300 group-aria-expanded:rotate-180' })}
      </button>
      <ul id="m-nav-${item.id}" class="grid gap-1 pb-4 ps-[calc(2.75rem-0.875rem)]" ${isCurrent(item) ? '' : 'hidden'}>
        ${item.children.map((c) => `
          <li><a href="${c.href}" class="dropdown-link text-lead" ${ariaCurrent(c.id)}>${c.label}</a></li>`).join('')}
      </ul>
    </li>`;
}

const template = () => `
  <a href="#main" class="sr-only-focusable fixed start-4 top-4 z-[70] rounded-sm bg-ink px-4 py-3 font-semibold text-page">Skip to content</a>

  <header data-header class="site-header">
    <div class="shell flex h-full items-center justify-between gap-4 lg:gap-5 xl:gap-8">
      ${logo()}

      <nav aria-label="Primary" class="hidden lg:block">
        <ul class="flex items-center gap-1 lg:[--nav-pad:0.625rem] xl:[--nav-pad:0.875rem]">${nav.map(desktopItem).join('')}</ul>
      </nav>

      <div class="flex items-center gap-1">
        <div class="hidden items-center gap-2 sm:flex">${dirToggle()}${themeToggle()}</div>
        <a href="${primaryCta.href}" class="btn btn-primary btn-sm ms-2 hidden md:inline-flex">${primaryCta.label}</a>
        <button type="button" class="icon-btn -me-2 lg:hidden" aria-controls="mobile-menu" aria-expanded="false" data-menu-open>
          ${icons.menu()}<span class="sr-only">Menu</span>
        </button>
      </div>
    </div>
  </header>

  <div id="mobile-menu" class="offcanvas lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu" inert>
    <div class="offcanvas-backdrop" data-menu-close></div>
    <div class="offcanvas-sheet" data-sheet>
      <div class="flex h-header shrink-0 items-center justify-between border-b border-line px-gutter">
        ${logo({ descriptor: false, compact: true })}
        <button type="button" class="icon-btn -me-2" data-menu-close>${icons.close()}<span class="sr-only">Close menu</span></button>
      </div>
      <nav aria-label="Mobile" class="flex-1 overflow-y-auto overscroll-contain px-gutter">
        <ul>${nav.map(mobileItem).join('')}</ul>
      </nav>
      <div class="grid shrink-0 gap-4 border-t border-line px-gutter py-5">
        <a href="${primaryCta.href}" class="btn btn-accent w-full">${primaryCta.label} ${icons.arrowEnd({ size: 18 })}</a>
        <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <a href="mailto:${brand.email}" class="link text-small"><span class="bidi-ltr">${brand.email}</span></a>
          <div class="flex items-center gap-2">${dirToggle()}${themeToggle()}</div>
        </div>
      </div>
    </div>
  </div>`;

// ---------- Element ----------

class SiteHeader extends HTMLElement {
  #controller = null;

  connectedCallback() {
    if (!this.hasAttribute('data-rendered')) {
      this.innerHTML = template();
      this.setAttribute('data-rendered', '');
    }
    this.#controller?.abort();
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    this.#initScroll(signal);
    this.querySelectorAll('[data-disclosure]').forEach((el) => initDisclosure(el, { signal }));
    this.#initMobileMenu(signal);
    this.dispatchEvent(new CustomEvent('ew:controls-rendered', { bubbles: true }));
  }

  disconnectedCallback() {
    this.#controller?.abort();
    this.#controller = null;
    this.#closeMenu?.({ restoreFocus: false });
  }

  #initScroll(signal) {
    const header = this.querySelector('[data-header]');
    const update = () => header.toggleAttribute('data-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true, signal });
  }

  #closeMenu = null;

  #initMobileMenu(signal) {
    const menu = this.querySelector('#mobile-menu');
    const opener = this.querySelector('[data-menu-open]');
    const root = document.documentElement;
    const focusables = () => [...menu.querySelectorAll('a[href], button:not([disabled])')]
      .filter((el) => el.getClientRects().length && !el.closest('[hidden]'));

    const open = () => {
      menu.inert = false;
      menu.setAttribute('data-open', '');
      opener.setAttribute('aria-expanded', 'true');
      root.setAttribute('data-scroll-lock', '');
      menu.querySelector('[data-sheet] button[data-menu-close]').focus({ preventScroll: true });
    };
    const close = ({ restoreFocus = true } = {}) => {
      if (!menu.hasAttribute('data-open')) return;
      menu.removeAttribute('data-open');
      menu.inert = true;
      opener.setAttribute('aria-expanded', 'false');
      root.removeAttribute('data-scroll-lock');
      if (restoreFocus && opener.getClientRects().length) opener.focus({ preventScroll: true });
    };
    this.#closeMenu = close;

    opener.addEventListener('click', open, { signal });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('[data-menu-close]')) return close();
      // Following a link closes the menu (focus goes to the destination, not the toggle).
      if (e.target.closest('a[href]')) close({ restoreFocus: false });
    }, { signal });
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); return close(); }
      if (e.key !== 'Tab') return;
      const els = focusables();
      const first = els[0];
      const last = els.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }, { signal });
    // Never leave the modal open (and the page scroll-locked) in the desktop layout.
    matchMedia(DESKTOP).addEventListener('change', (e) => e.matches && close({ restoreFocus: false }), { signal });
  }
}

if (!customElements.get('site-header')) customElements.define('site-header', SiteHeader);
