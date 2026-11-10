// Zero-dependency static server for local development.
// ES modules require http(s) — opening pages via file:// will not load JS.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PORT = Number(process.env.PORT) || 5173;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};
// Allowlist: only what a production host would publish — root pages and /assets.
const isPublic = (path) => /^\/[\w-]+\.html$/.test(path) || path.startsWith('/assets/') || path === '/favicon.ico';

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT) || !isPublic(path)) throw Object.assign(new Error(), { code: 'ENOENT' });
    if (!(await stat(file)).isFile()) throw Object.assign(new Error(), { code: 'ENOENT' });
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  }
}).listen(PORT, () => console.log(`Ember & Wick → http://localhost:${PORT}/styleguide.html`));
