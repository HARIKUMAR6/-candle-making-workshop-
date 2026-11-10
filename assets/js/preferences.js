/*
 * Pre-paint preferences — load in <head> WITHOUT defer/async:
 *   <script src="assets/js/preferences.js"></script>
 * Applies the saved/system theme and text direction before first paint
 * so there is no flash of the wrong theme or a layout jump in RTL.
 * Kept dependency-free and tiny on purpose.
 */
(function () {
  var root = document.documentElement;
  var read = function (key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  };

  var theme = read('ew-theme');
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', theme);

  var dir = read('ew-dir');
  if (dir === 'rtl' || dir === 'ltr') root.setAttribute('dir', dir);
})();
