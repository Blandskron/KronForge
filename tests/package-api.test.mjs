import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
    getAsset,
    listAssets,
    listDomains,
    loadCatalog,
    loadPackageMeta,
    readAssetMarkdown,
    readLlmsTxt,
    readMasterPrompt
} from '../scripts/api.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts', 'cli.mjs');

test('la API del paquete expone catálogo, dominios, activos, prompt maestro y llms.txt', async () => {
    const pkg = await loadPackageMeta();
    const catalog = await loadCatalog();
    assert.equal(pkg.version, catalog.frameworkVersion);

    const domains = await listDomains();
    assert.ok(domains.length >= 10);

    const assets = await listAssets();
    assert.equal(assets.length, catalog.assets.length);

    const first = assets[0];
    const detailed = await getAsset(first.id);
    assert.equal(detailed.id, first.id);

    const markdown = await readAssetMarkdown(first.id);
    assert.ok(markdown.length > 50);

    const prompt = await readMasterPrompt();
    assert.ok(prompt.includes('AGENTS.md'));

    const llms = await readLlmsTxt();
    assert.ok(llms.includes('KronForge'));

    assert.equal(pkg.types, './scripts/api.d.ts');
    assert.equal(pkg.exports['.'].types, './scripts/api.d.ts');
    await access(path.join(ROOT, 'scripts', 'api.d.ts'));
});

test('el CLI kronforge responde a --version, domains, list --json y show', async () => {
    const pkg = await loadPackageMeta();

    const versionRun = spawnSync(process.execPath, [CLI, '--version'], {encoding: 'utf8'});
    assert.equal(versionRun.status, 0);
    assert.equal(versionRun.stdout.trim(), pkg.version);

    const domainsRun = spawnSync(process.execPath, [CLI, 'domains', '--json'], {encoding: 'utf8'});
    assert.equal(domainsRun.status, 0);
    const domains = JSON.parse(domainsRun.stdout);
    assert.ok(Array.isArray(domains) && domains.length >= 10);

    const listRun = spawnSync(process.execPath, [CLI, 'list', '--type', 'protocol', '--json'], {encoding: 'utf8'});
    assert.equal(listRun.status, 0);
    const protocols = JSON.parse(listRun.stdout);
    assert.ok(Array.isArray(protocols) && protocols.length >= 1);

    const showRun = spawnSync(process.execPath, [CLI, 'show', protocols[0].id], {encoding: 'utf8'});
    assert.equal(showRun.status, 0);
    assert.ok(showRun.stdout.length > 50);
});
