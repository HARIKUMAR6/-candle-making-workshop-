// Runs the Tailwind watcher and the static server together (no extra dependencies).
//
// Notes:
// - `--watch=always` is required: plain `--watch` exits as soon as stdin closes
//   (background terminals, CI, editors), after truncating the output file.
// - Both children are spawned with `node` directly (no shell / npx), so stopping
//   this script stops them too and no orphaned watcher keeps the CSS file busy.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(join(root, 'package.json'));
const tailwindCli = join(dirname(require.resolve('@tailwindcss/cli/package.json')), 'dist', 'index.mjs');

const run = (args) => spawn(process.execPath, args, { cwd: root, stdio: ['ignore', 'inherit', 'inherit'] });

const procs = [
  run([tailwindCli, '-i', './src/css/main.css', '-o', './assets/css/styles.css', '--watch=always']),
  run([join(root, 'scripts', 'serve.mjs')]),
];

const stop = () => { procs.forEach((p) => p.kill()); process.exit(); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
procs.forEach((p) => p.on('exit', (code) => { if (code) { console.error(`child exited with ${code}`); stop(); } }));
