import http from 'node:http';
import path from 'node:path';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {ROOT, fromRoot, readJson, toPosix, walk} from './lib/repository.mjs';

const BASE_PATH = '/KronForge';
const mime = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
    '.svg': 'image/svg+xml'
};

async function regularFile(target) {
    try {
        return (await stat(target)).isFile();
    } catch {
        return false;
    }
}

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname !== BASE_PATH && !pathname.startsWith(BASE_PATH + '/')) {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('Not found');
        return;
    }
    pathname = pathname.slice(BASE_PATH.length) || '/';
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    let target = path.resolve(ROOT, relative);
    let status = 200;
    const hiddenPath = relative !== '.nojekyll'
        && relative.split('/').some((segment) => segment.startsWith('.'));
    if (hiddenPath || !target.startsWith(ROOT + path.sep) || !await regularFile(target)) {
        target = fromRoot('404.html');
        status = 404;
    }
    response.writeHead(status, {
        'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store'
    });
    createReadStream(target).pipe(response);
});

await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
});

const address = server.address();
const origin = `http://127.0.0.1:${address.port}${BASE_PATH}`;
const catalog = await readJson(fromRoot('library/catalog.json'));
const routes = new Set([
    '/',
    '/index.html',
    '/404.html',
    '/.nojekyll',
    '/llms.txt',
    '/library/catalog.json',
    '/library/learning-guidance.json',
    '/docs/LEARNING_GUIDANCE.md',
    '/docs/learning-quality-example.md',
    '/docs/LEARNING_LABS.md',
    '/docs/audits/KRONFORGE_LEARNING_CASE.md',
    '/skills/README.md',
    '/prompts/agents-first-documentation-review.prompt.md',
    '/docs/ROADMAP.md',
    '/docs/CONTRIBUTING_ASSETS.md',
    '/docs/CHANGELOG.md',
    '/examples/usage-example.md',
    '/PROMPT_VERSIONING.md',
    '/CLAUDE.md',
    '/GEMINI.md',
    ...catalog.domains.map((domain) => `/library/${domain.index}`),
    ...catalog.assets.map((asset) => `/library/${asset.path}`)
]);

for (const directory of ['tutorials', 'cases']) {
    for (const file of await walk(fromRoot('docs', directory), (target) => target.endsWith('.md'))) {
        routes.add(`/${toPosix(path.relative(ROOT, file))}`);
    }
}

for (const file of await walk(fromRoot('pages'), (target) => target.endsWith('.html'))) {
    routes.add(`/${toPosix(path.relative(ROOT, file))}`);
}
for (const file of await walk(fromRoot('assets'), (target) => /\.(?:css|js|png|svg|woff2)$/.test(target))) {
    routes.add(`/${toPosix(path.relative(ROOT, file))}`);
}

const errors = [];
try {
    for (const route of routes) {
        const response = await fetch(`${origin}${route}`);
        if (response.status !== 200) {
            errors.push(`${route}: HTTP ${response.status}`);
            continue;
        }
        const expected = path.extname(new URL(route, 'http://local').pathname).toLowerCase();
        const contentType = response.headers.get('content-type') || '';
        if (expected && mime[expected] && !contentType.startsWith(mime[expected].split(';')[0])) {
            errors.push(`${route}: MIME ${contentType}`);
        }
        await response.arrayBuffer();
    }

    const missing = await fetch(`${origin}/route-that-must-not-exist`);
    if (missing.status !== 404) errors.push(`Ruta desconocida: HTTP ${missing.status}`);

    const hidden = await fetch(`${origin}/.github/copilot-instructions.md`);
    if (hidden.status !== 404) errors.push(`Ruta oculta de Pages: HTTP ${hidden.status}`);

    const outside = await fetch(`http://127.0.0.1:${address.port}/index.html`);
    if (outside.status !== 404) errors.push(`Ruta fuera del base path: HTTP ${outside.status}`);
} finally {
    await new Promise((resolve) => server.close(resolve));
}

console.log('\nKronForge — smoke test GitHub Pages\n');
console.log(`${routes.size} rutas verificadas bajo ${BASE_PATH}/`);
for (const error of errors) console.error(`✗ ${error}`);
if (!errors.length) console.log('✓ Todas las rutas, estados y MIME son correctos');
else process.exitCode = 1;
