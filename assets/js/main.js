// Entry module — load at the end of <head> with:
//   <script type="module" src="assets/js/main.js"></script>
// Components register first so their markup exists before controllers sync labels.

import './components/site-header.js';
import './components/site-footer.js';
import './components/scroll-top.js';
import { initTheme } from './core/theme.js';
import { initDirection } from './core/direction.js';

initTheme();
initDirection();
