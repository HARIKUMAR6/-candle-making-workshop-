// Accessible disclosure (button + controlled panel), shared by desktop and mobile nav.
//
// Markup: <el data-disclosure="popover|accordion">
//           <button aria-expanded="false" aria-controls="panel-id">…</button>
//           <ul id="panel-id" hidden>…links…</ul>
//         </el>
//
// popover:   closes on outside click, Tab-out, Escape and link selection.
//            ArrowDown/ArrowUp on the button open it and focus the first/last link;
//            inside, arrows cycle and Home/End jump.
// accordion: toggles in place (used inside the mobile sheet); Escape is left to the sheet.
//
// Native semantics are kept: a real <button>, real links, aria-expanded/aria-controls only.

export function initDisclosure(root, { signal } = {}) {
  const button = root.querySelector(':scope > button[aria-controls]');
  const panel = button && document.getElementById(button.getAttribute('aria-controls'));
  if (!panel) return;
  const popover = root.dataset.disclosure === 'popover';
  const links = () => [...panel.querySelectorAll('a[href]')];
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  const set = (open) => {
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  const focusLink = (index) => {
    const items = links();
    items[(index + items.length) % items.length]?.focus();
  };

  set(isOpen()); // normalise initial state from markup
  button.addEventListener('click', () => set(!isOpen()), { signal });

  if (!popover) return;

  button.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      set(true);
      focusLink(e.key === 'ArrowDown' ? 0 : -1);
    }
  }, { signal });

  panel.addEventListener('keydown', (e) => {
    const items = links();
    const i = items.indexOf(document.activeElement);
    const keys = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: -1 };
    if (e.key in keys) { e.preventDefault(); focusLink(keys[e.key]); }
  }, { signal });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) { e.preventDefault(); set(false); button.focus(); }
  }, { signal });

  // Tab / Shift+Tab leaving the item closes it.
  root.addEventListener('focusout', (e) => {
    if (e.relatedTarget && !root.contains(e.relatedTarget)) set(false);
  }, { signal });

  // Selecting a destination closes the menu.
  panel.addEventListener('click', (e) => { if (e.target.closest('a[href]')) set(false); }, { signal });

  // Click anywhere else closes it.
  document.addEventListener('pointerdown', (e) => { if (isOpen() && !root.contains(e.target)) set(false); }, { signal });
}
