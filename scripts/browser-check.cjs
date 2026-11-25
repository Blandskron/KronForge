const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const { tmpdir } = require('node:os');
const { createHash } = require('node:crypto');
const tools = process.env.KF_BROWSER_TOOLS;
const load = name => require(tools ? path.resolve(tools, name) : name);
const root = path.resolve(__dirname, '..');
const output = process.env.KF_AUDIT_OUT || path.join(tmpdir(), 'kronforge-evidence');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.md':'text/plain', '.json':'application/json', '.woff2':'font/woff2' };
const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url, 'http://127.0.0.1');
        if (!url.pathname.startsWith('/KronForge/')) throw Error('unknown mount');
        const file = path.resolve(root, decodeURIComponent(url.pathname.slice(11)) || 'index.html');
        if (!file.startsWith(root + path.sep) || path.relative(root, file).split(path.sep).some(part => part.startsWith('.'))) throw Error('outside site');
        const body = await fs.readFile(file);
        res.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream'});
        res.end(body);
    } catch { res.writeHead(404).end(); }
});
(async () => {
    await new Promise(resolve => server.listen(process.env.KF_PORT || 0, '127.0.0.1', resolve));
    const url = 'http://127.0.0.1:' + server.address().port + '/KronForge/';
    if (process.argv.includes('--serve')) { console.log(url); return; }
    const { chromium } = load('playwright');
    const { AxeBuilder } = load('@axe-core/playwright');
    const browser = await chromium.launch();
    await fs.mkdir(output, { recursive:true });
    try {
        const context = await browser.newContext({viewport:{width:1200,height:630}, reducedMotion:'reduce'});
        const page = await context.newPage();
        page.setDefaultTimeout(8000);
        if (process.argv.includes('--social')) {
            await page.goto(url + 'assets/img/kronforge-social.svg');
            await page.locator('svg').waitFor();
            await page.screenshot({path:path.join(root, 'assets/img/kronforge-social.png')});
            return;
        }
        const result = [];
        const remote = [];
        context.on('request', req => { if (!req.url().startsWith(url) && !req.url().startsWith('data:')) remote.push(req.url()); });
        const audit = async (view, theme) => {
            await page.evaluate(async () => {
                await document.fonts.ready;
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            });
            const report = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22a','wcag22aa']).analyze();
            result.push({view, theme, violations:report.violations.map(({id,nodes}) => ({id, targets:nodes.map(({target,failureSummary}) => ({target,failureSummary}))}))});
        };
        await page.setViewportSize({width:1440,height:1000});
        await page.goto(url);
        await page.getByRole('heading',{name:'KronForge',exact:true}).waitFor();
        await page.waitForFunction(() => document.getElementById('home-asset-count')?.textContent.trim() === '62');
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Saltar al contenido');
        await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content');
        await page.evaluate(() => document.activeElement.blur());
        await audit('inicio', 'oscuro');
        const first = await page.screenshot({path:path.join(output,'inicio-oscuro.png'), animations:'disabled'});
        const replay = await page.screenshot({animations:'disabled'});
        assert.equal(first.equals(replay), true, 'non-deterministic screenshot within the same viewport');
        await page.getByLabel('Tema', {exact:true}).selectOption('light');
        await page.reload();
        await page.getByRole('heading',{name:'KronForge',exact:true}).waitFor();
        await page.waitForFunction(() => document.getElementById('home-asset-count')?.textContent.trim() === '62');
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.pillar-card h3')).color === 'rgb(24, 35, 56)');
        await audit('inicio', 'claro');
        await page.screenshot({path:path.join(output,'inicio-claro.png'), animations:'disabled'});
        await page.emulateMedia({colorScheme:'dark'});
        await page.getByLabel('Tema', {exact:true}).selectOption('system');
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
        await page.emulateMedia({colorScheme:'light'});
        await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
        await page.getByLabel('Tema', {exact:true}).selectOption('dark');
        await page.locator('.forge-resource-grid a[href="#library?type=protocol"]').click();
        await page.locator('#library-search').waitFor();
        await page.waitForFunction(() => document.querySelector('#asset-grid button'));
        assert.match(page.url(), /type=protocol/);
        await audit('biblioteca', 'oscuro');
        await page.locator('#asset-grid button[data-asset-link]').first().click();
        await page.locator('#asset-viewer:not([hidden])').waitFor();
        await page.waitForFunction(() => document.getElementById('asset-viewer-content')?.dataset.loadState === 'ready');
        await page.getByRole('button',{name:'Copiar', exact:true}).waitFor();
        await context.grantPermissions(['clipboard-read','clipboard-write']);
        const markdown = await page.locator('#asset-viewer-content').getAttribute('data-raw-markdown');
        await page.getByRole('button',{name:'Copiar', exact:true}).click();
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), markdown);
        const downloaded = page.waitForEvent('download');
        await page.getByRole('button',{name:'Descargar', exact:true}).click();
        const tempFile = await (await downloaded).path();
        assert.equal(await fs.readFile(tempFile,'utf8'), markdown);
        await page.locator('#toast.hidden').waitFor({state:'attached'});
        await page.getByRole('button',{name:'Modo lectura'}).click();
        await page.waitForFunction(() => document.getElementById('asset-reading-mode')?.getAttribute('aria-pressed') === 'true');
        await audit('lectura', 'oscuro');
        await page.screenshot({path:path.join(output,'lectura.png'), animations:'disabled'});
        for (const width of [360,768]) {
            await page.setViewportSize({width,height:800});
            await page.goto(url);
            await page.getByRole('heading',{name:'KronForge',exact:true}).waitFor();
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
            await audit('inicio-' + width, 'oscuro');
            if (width === 360) {
                await page.screenshot({path:path.join(output,'inicio-movil.png'), animations:'disabled',fullPage:true});
                await page.getByRole('button',{name:'Abrir navegación'}).click();
                await page.keyboard.press('Escape');
                assert.equal(await page.getByRole('button',{name:'Abrir navegación'}).getAttribute('aria-expanded'), 'false');
            }
        }
        assert.deepEqual(remote, []);
        await fs.writeFile(path.join(output,'axe.json'), JSON.stringify(result,null,2));
        console.log(JSON.stringify(result,null,2));
        assert.ok(result.every(entry => !entry.violations.length), 'axe violations');
        const names = ['inicio-claro.png', 'inicio-movil.png', 'lectura.png'];
        const images = Object.fromEntries(await Promise.all(names.map(async name =>
            [name, createHash('sha256').update(await fs.readFile(path.join(output,name))).digest('hex')])));
        const appearance = { platform:process.platform, browser:browser.version(), images };
        await fs.writeFile(path.join(output, 'visual.json'), JSON.stringify(appearance, null, 2) + '\n');
        if (process.argv.includes('--compare')) {
            const baseline = JSON.parse(await fs.readFile(path.join(root, 'tests/kronforge-visual-baseline.json'), 'utf8'));
            assert.deepEqual(appearance, baseline, 'Regresión visual respecto de la referencia del navegador');
        }
    } finally {
        await browser.close();
        server.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
