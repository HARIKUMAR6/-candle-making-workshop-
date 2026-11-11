// <scroll-to-top> — one shared floating "back to top" button for every page.
//
// - Mounted automatically (main.js imports this module; if a page has no <scroll-to-top>
//   one is appended to <body>), so no page needs its own markup.
// - Hidden at/near the top: `inert` + `data-visible` removed, so it is out of the tab order
//   and the accessibility tree until it is actually shown.
// - Positioned with logical properties (components.css .scroll-top): bottom-right in LTR,
//   bottom-left in RTL, with no JS involved in the direction switch.
// - Honours prefers-reduced-motion: instant jump instead of a smooth scroll.
// - Listeners are bound with an AbortSignal and released on disconnect (same pattern as
//   <site-header>), so re-attaching the element never stacks handlers.

import { icons } from './icons.js';

/** Scroll distance before the button appears: far enough that the header is out of view. */
const threshold = () => Math.max(320, Math.round(window.innerHeight * 0.6));
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

class ScrollToTop extends HTMLElement {
  #controller = null;
  #button = null;

  connectedCallback() {
    if (!this.hasAttribute('data-rendered')) {
      this.innerHTML = `
        <button type="button" class="scroll-top" aria-label="Scroll to top" title="Scroll to top" inert>
          ${icons.arrowUp({ size: 22 })}
        </button>`;
      this.setAttribute('data-rendered', '');
    }
    this.#button = this.querySelector('button');
    this.#controller?.abort();
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    let frame = 0;
    const update = () => {
      frame = 0;
      this.#setVisible(window.scrollY > threshold());
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

    window.addEventListener('scroll', schedule, { passive: true, signal });
    window.addEventListener('resize', schedule, { passive: true, signal });
    this.#button.addEventListener('click', () => this.#scrollToTop(), { signal });
    update();
  }

  disconnectedCallback() {
    this.#controller?.abort();
    this.#controller = null;
  }

  #setVisible(show) {
    this.#button.toggleAttribute('data-visible', show);
    this.#button.inert = !show; // out of the tab order and the accessibility tree while hidden
  }

  #scrollToTop() {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    // The button hides itself at the top, which would strand keyboard focus on a now-inert
    // element and leave the Tab starting point at the end of the page. Reset it to the top.
    const body = document.body;
    const hadTabindex = body.hasAttribute('tabindex');
    if (!hadTabindex) body.setAttribute('tabindex', '-1');
    body.style.outline = 'none';
    body.focus({ preventScroll: true });
    body.addEventListener('blur', () => {
      body.style.outline = '';
      if (!hadTabindex) body.removeAttribute('tabindex');
    }, { once: true });
  }
}

if (!customElements.get('scroll-to-top')) customElements.define('scroll-to-top', ScrollToTop);

// Mount once per page. Module scripts are deferred, so <body> exists by now.
if (!document.querySelector('scroll-to-top')) document.body.append(document.createElement('scroll-to-top'));
