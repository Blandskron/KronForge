import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {discoverContext, routeContext} from '../scripts/api.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts', 'cli.mjs');

async function withTempRepo(callback) {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'kronforge-c3-'));
    try {
        await callback(dir);
    } finally {
        await rm(dir, {recursive: true, force: true});
    }
}

test('discoverContext clasifica niveles, detecta convenciones y advierte adaptadores desvinculados', async () => {
    await withTempRepo(async (dir) => {
        await writeFile(path.join(dir, 'AGENTS.md'), '# AGENTS\nReglas breves.\n');
        await writeFile(path.join(dir, 'CLAUDE.md'), '# Reglas duplicadas sin enlace\n');
        await writeFile(path.join(dir, '.editorconfig'), 'root = true\n');
        await mkdir(path.join(dir, 'docs', 'memory'), {recursive: true});
        await writeFile(path.join(dir, 'docs', 'memory', 'session.md'), '# Memoria\nEstado actual.\n');

        const report = await discoverContext(dir);
        assert.ok(report.summary.totalFiles >= 4);
        assert.ok(report.summary.conventionsDetected.includes('.editorconfig'));
        assert.ok(report.warnings.some((w) => w.code === 'ADAPTER_NOT_LINKING_AGENTS'));
    });
});

test('routeContext respeta presupuesto de tokens y prioriza documentos relevantes a la tarea', async () => {
    await withTempRepo(async (dir) => {
        await writeFile(path.join(dir, 'AGENTS.md'), '# AGENTS\nReglas base.\n');
        await writeFile(path.join(dir, 'SECURITY.md'), '# Seguridad\nPolítica de vulnerabilidades.\n');
        await writeFile(path.join(dir, 'README.md'), `# README\n${'Texto extenso '.repeat(400)}\n`);

        const routed = await routeContext(dir, {task: 'auditar seguridad y auth', budget: 120});
        const selectedPaths = routed.selected.map((s) => s.path);
        assert.ok(selectedPaths.includes('AGENTS.md'));
        assert.ok(selectedPaths.includes('SECURITY.md'));
        assert.ok(routed.deferred.some((d) => d.path === 'README.md'));
        assert.ok(routed.savedTokens > 0);
    });
});

test('el CLI kronforge context soporta discovery y routing JSON', async () => {
    await withTempRepo(async (dir) => {
        await writeFile(path.join(dir, 'AGENTS.md'), '# AGENTS\nReglas.\n');
        await writeFile(path.join(dir, 'SECURITY.md'), '# Security\nPolitica.\n');

        const run = spawnSync(process.execPath, [CLI, 'context', dir, '--task', 'seguridad', '--budget', '500', '--json'], {encoding: 'utf8'});
        assert.equal(run.status, 0);
        const json = JSON.parse(run.stdout);
        assert.equal(json.budget, 500);
        assert.ok(json.selected.some((item) => item.path === 'SECURITY.md'));
    });
});
