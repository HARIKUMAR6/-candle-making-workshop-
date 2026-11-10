// <site-footer> — shared footer. Content comes from data/site.js; logo and
// preference controls come from partials.js (same markup as the header).
//
// Layout (shared .shell so edges align with header/main):
//   base: brand · Studio | Workshops & kits (2 cols) · Visit
//   md:   brand full row, then Studio | Workshops & kits | Visit
//   lg:   brand 4 | Studio 2 | Workshops & kits 2 | Visit 3 (12-col grid)
// Every value comes from data/site.js, so the footer never disagrees with the Contact page.

import { brand, contact, nav, primaryCta, social, workshopFormats } from '../data/site.js';
import { icons } from './icons.js';
import { logo, themeToggle, dirToggle } from './partials.js';

const pages = nav.flatMap((i) => i.children ?? [i]);
const page = (id) => pages.find((p) => p.id === id);
// Studio: the site's own pages; Workshops & kits gets its own column.
const studioLinks = ['home-1', 'home-2', 'about', 'contact'].map(page).filter(Boolean);
const makeLinks = [
  page('workshops') && { label: 'All workshops', href: page('workshops').href },
  ...workshopFormats.map((f) => ({ label: f.label, href: `workshops.html#${f.id}` })),
  page('kits') && { label: 'Candle-making kits', href: page('kits').href },
].filter(Boolean);

const linkList = (items) => `
  <ul class="mt-5 grid gap-3">
    ${items.map((l) => `<li><a href="${l.href}" class="footer-link">${l.label}</a></li>`).join('')}
  </ul>`;

const address = contact.address.confirmed && contact.address.lines
  ? `<address class="not-italic text-text">${contact.address.lines.join('<br>')}</address>` : '';

// Pages that end with their own booking section opt out of the closing invitation
// with <site-footer data-invitation="off"> so the same call to action isn't repeated.
const invitation = () => `
      <!-- Closing invitation -->
      <div class="flex flex-col gap-8 border-b border-line py-section-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p class="eyebrow">Light something you made</p>
          <p class="mt-4 max-w-[18ch] font-display text-h2 text-ink">Come for one evening. <em class="accent-word">Leave with a craft.</em></p>
        </div>
        <a href="${primaryCta.href}" class="btn btn-primary btn-lg self-start md:self-auto">${primaryCta.label} ${icons.arrowEnd({ size: 18 })}</a>
      </div>`;

const template = (year, { withInvitation = true } = {}) => `
  <footer class="surface-section border-t border-line">
    <div class="shell">
      ${withInvitation ? invitation() : ''}

      <!-- Brand + social · Studio · Workshops & kits · Visit -->
      <div class="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-3 lg:grid-cols-12">
        <div class="col-span-2 md:col-span-3 lg:col-span-4">
          ${logo({ href: 'index.html' })}
          <p class="meta mt-5 max-w-[42ch]">${brand.intro}</p>
          <div class="mt-7">
            <h2 id="footer-social" class="footer-heading">Follow us</h2>
            <ul class="mt-4 flex flex-wrap items-center gap-3" aria-labelledby="footer-social">
              ${social.map((s) => `
                <li><a href="${s.href}" class="social-btn" target="_blank" rel="noopener noreferrer" aria-label="${s.label} (opens in a new tab)" title="${s.label}">
                  ${icons[s.icon]({ size: 20 })}
                </a></li>`).join('')}
            </ul>
          </div>
        </div>

        <nav aria-labelledby="footer-studio" class="lg:col-span-2 lg:col-start-6">
          <h2 id="footer-studio" class="footer-heading">Studio</h2>
          ${linkList(studioLinks)}
        </nav>

        <nav aria-labelledby="footer-make" class="lg:col-span-2">
          <h2 id="footer-make" class="footer-heading">Workshops &amp; kits</h2>
          ${linkList(makeLinks)}
        </nav>

        <div class="col-span-2 md:col-span-1 lg:col-span-3 lg:col-start-10">
          <h2 class="footer-heading">Visit &amp; contact</h2>
          <div class="mt-5 grid gap-4">
            ${address}
            <a href="mailto:${brand.email}" class="footer-link inline-flex items-center gap-2.5 justify-self-start">
              ${icons.mail({ size: 18, cls: 'shrink-0 text-accent' })}<span class="bidi-ltr break-all">${brand.email}</span>
            </a>
            <a href="contact.html#enquiry" class="link-arrow justify-self-start">Send an enquiry ${icons.arrowEnd({ size: 16 })}</a>
          </div>
        </div>
      </div>

      <!-- Legal · preferences -->
      <div class="flex flex-col-reverse gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-small text-muted">© ${year} ${brand.name}. All rights reserved. Hand-poured, small-batch.</p>
        <div class="flex items-center gap-2">${dirToggle()}${themeToggle()}</div>
      </div>
    </div>
  </footer>`;

class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-rendered')) return;
    this.innerHTML = template(new Date().getFullYear(), { withInvitation: this.dataset.invitation !== 'off' });
    this.setAttribute('data-rendered', '');
    this.dispatchEvent(new CustomEvent('ew:controls-rendered', { bubbles: true }));
  }
}

if (!customElements.get('site-footer')) customElements.define('site-footer', SiteFooter);
