// Enquiry / workshop booking form — progressive enhancement of a semantic <form>.
//
// - Validates on blur (per field) and on submit (whole form + error summary).
// - Booking-only fields live in <fieldset data-show-when="workshop"> and are disabled
//   while hidden, so they are neither validated nor submitted.
// - Submission goes to `forms.enquiryEndpoint` (site.js). While that is null nothing is
//   sent: the visitor is told so plainly and offered the same message by email.
//   Nothing ever claims a booking is confirmed.

import { contact, forms, workshopFormats } from '../data/site.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS = /^[+\d\s().-]+$/;

const MESSAGES = {
  name: (v) => (!v ? 'Enter your full name.' : v.length < 2 ? 'Enter at least 2 characters.' : ''),
  email: (v) => (!v ? 'Enter your email address.' : !EMAIL.test(v) ? 'Enter an email address like name@example.com.' : ''),
  phone: (v) => {
    if (!v) return '';
    const digits = v.replace(/\D/g, '');
    if (!PHONE_CHARS.test(v)) return 'Use digits, spaces, +, ( ) or - only.';
    if (digits.length < 7 || digits.length > 15) return 'Enter a phone number with 7 to 15 digits.';
    return '';
  },
  enquiryType: (v) => (!v ? 'Choose what your enquiry is about.' : ''),
  workshop: (v) => (!v ? 'Choose a workshop, or “Not sure yet”.' : ''),
  participants: (v) => {
    if (!v) return 'Enter how many people are coming.';
    const n = Number(v);
    return !Number.isInteger(n) || n < 1 ? 'Enter a whole number, 1 or more.' : n > 99 ? 'For groups larger than 99, tell us in your message.' : '';
  },
  date: (v, el) => (v && el.min && v < el.min ? 'Choose a date from today onwards.' : ''),
  message: (v) => (!v ? 'Write a short message.' : v.length < 10 ? 'Tell us a little more (at least 10 characters).' : ''),
};

const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };

export function initEnquiryForm(form) {
  if (!form || form.dataset.enhanced) return;
  form.dataset.enhanced = '';
  const summary = form.querySelector('[data-error-summary]');
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = submit.querySelector('[data-label]');
  const conditional = [...form.querySelectorAll('[data-show-when]')];
  const workshopSelect = form.elements.workshop;
  const dateInput = form.elements.date;

  // Options come from site.js so labels match the rest of the site.
  if (workshopSelect && workshopSelect.options.length <= 1) {
    workshopFormats.forEach((f) => workshopSelect.add(new Option(f.label, f.id)));
    workshopSelect.add(new Option('Not sure yet — help me choose', 'not-sure'));
  }
  if (dateInput) dateInput.min = todayISO();

  const field = (name) => form.elements[name];
  const errorEl = (name) => form.querySelector(`[data-error-for="${name}"]`);
  const value = (name) => { const el = field(name); if (!el) return ''; return (el instanceof RadioNodeList ? el.value : el.value).trim(); };

  function setError(name, msg) {
    const el = field(name);
    const err = errorEl(name);
    if (!el || !err) return;
    const targets = el instanceof RadioNodeList ? [...el] : [el];
    targets.forEach((t) => (msg ? t.setAttribute('aria-invalid', 'true') : t.removeAttribute('aria-invalid')));
    err.querySelector('[data-text]').textContent = msg;
    err.hidden = !msg;
  }

  // `:disabled` (not `.disabled`) — fields inside a disabled <fieldset> report .disabled === false.
  const isActive = (name) => { const el = field(name); const first = el instanceof RadioNodeList ? el[0] : el; return !!first && !first.matches(':disabled'); };

  function validate(name) {
    if (!isActive(name) || !MESSAGES[name]) return '';
    const el = field(name);
    const msg = MESSAGES[name](value(name), el instanceof RadioNodeList ? el[0] : el);
    setError(name, msg);
    return msg;
  }

  function syncConditional() {
    const type = value('enquiryType');
    conditional.forEach((group) => {
      const on = group.dataset.showWhen.split(' ').includes(type);
      group.hidden = !on;
      group.disabled = !on; // disabled fieldsets are skipped by validation and FormData
      if (!on) group.querySelectorAll('[name]').forEach((el) => setError(el.name, ''));
    });
  }

  function setType(type, workshop) {
    const radio = form.querySelector(`input[name="enquiryType"][value="${type}"]`);
    if (radio) radio.checked = true;
    syncConditional();
    if (workshop && workshopSelect) workshopSelect.value = workshop;
  }

  // Pre-fill from links like contact.html?enquiry=scent-blending or ?enquiry=kits
  const preset = new URLSearchParams(location.search).get('enquiry');
  if (preset === 'kits') setType('kit');
  else if (preset === 'general') setType('general');
  else if (preset === 'workshop' || workshopFormats.some((f) => f.id === preset)) setType('workshop', workshopFormats.some((f) => f.id === preset) ? preset : '');
  else syncConditional();

  // In-page CTAs like <a href="#enquiry" data-preset="workshop"> also pre-select a type.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-preset]');
    if (a) setType(a.dataset.preset);
  });

  form.addEventListener('change', (e) => {
    if (e.target.name === 'enquiryType') { syncConditional(); validate('enquiryType'); }
  });
  // Validate a field when the user leaves it; once shown, errors update live as they type.
  form.addEventListener('focusout', (e) => { if (e.target.name && e.target.type !== 'radio') validate(e.target.name); });
  form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') validate(e.target.name); });

  function showSummary(errors) {
    if (!errors.length) { summary.hidden = true; return; }
    summary.querySelector('ul').innerHTML = errors.map(([name, msg]) => {
      const el = field(name); const id = (el instanceof RadioNodeList ? el[0] : el).id;
      return `<li><a class="link" href="#${id}">${msg}</a></li>`;
    }).join('');
    summary.hidden = false;
    summary.focus();
  }
  summary.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault(); document.getElementById(a.getAttribute('href').slice(1))?.focus();
  });

  function showStatus(kind, html) {
    status.className = `notice notice-${kind}`;
    status.innerHTML = html;
    status.hidden = false;
    status.focus();
  }

  function mailtoFallback(data) {
    if (!contact.email.value) return '';
    const lines = [
      `Name: ${data.get('name')}`, `Email: ${data.get('email')}`, data.get('phone') ? `Phone: ${data.get('phone')}` : '',
      `Enquiry: ${form.querySelector('input[name="enquiryType"]:checked')?.dataset.label || ''}`,
      data.get('workshop') ? `Workshop: ${workshopSelect.selectedOptions[0]?.text}` : '',
      data.get('participants') ? `Participants: ${data.get('participants')}` : '',
      data.get('date') ? `Preferred date: ${data.get('date')}` : '',
      '', data.get('message'),
    ].filter((l, i, a) => l !== '' || a[i - 1] !== '');
    const subject = `Enquiry from ${data.get('name')}`;
    return `mailto:${contact.email.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  let submitting = false;
  function setSubmitting(on) {
    submitting = on;
    submit.disabled = on;
    submit.setAttribute('aria-busy', String(on));
    submitLabel.textContent = on ? 'Sending…' : submitLabel.dataset.idle;
    form.toggleAttribute('data-submitting', on);
  }
  submitLabel.dataset.idle = submitLabel.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return; // duplicate-submission guard
    status.hidden = true;
    const names = ['name', 'email', 'phone', 'enquiryType', 'workshop', 'participants', 'date', 'message'];
    const errors = names.map((n) => [n, validate(n)]).filter(([, m]) => m);
    showSummary(errors);
    if (errors.length) return;

    const data = new FormData(form);
    if (data.get('company')) return; // honeypot filled → bot; silently stop

    if (!forms.enquiryEndpoint) {
      const mailto = mailtoFallback(data);
      showStatus('info', `
        <p class="font-semibold text-ink">Your enquiry has not been sent.</p>
        <p class="mt-1">Online enquiries aren’t connected yet, so nothing has left this page. Your details are still in the form.</p>
        ${mailto ? `<p class="mt-4"><a class="btn btn-primary btn-sm" href="${mailto}">Send it by email instead</a></p><p class="mt-2 text-small">This opens your email app with your message filled in.</p>` : ''}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(forms.enquiryEndpoint, { method: forms.enquiryMethod || 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const name = String(data.get('name')).split(' ')[0];
      form.reset();
      syncConditional();
      showStatus('success', `
        <p class="font-semibold text-ink">Thank you, ${name.replace(/[<>&]/g, '')} — your enquiry has been sent.</p>
        <p class="mt-1">This is not a booking confirmation. We’ll reply by email to confirm details and availability.</p>`);
    } catch {
      const mailto = mailtoFallback(data);
      showStatus('error', `
        <p class="font-semibold text-ink">We couldn’t send your enquiry.</p>
        <p class="mt-1">Nothing was lost — your details are still in the form. Please try again${mailto ? `, or <a class="link" href="${mailto}">send it by email</a>` : ''}.</p>`);
    } finally {
      setSubmitting(false);
    }
  });
}
