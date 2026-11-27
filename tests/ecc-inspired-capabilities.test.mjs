import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
    applyInstall,
    createCheckpoint,
    listLearningCandidates,
    promoteLearningCandidate,
    recordLearningCandidate,
    repairInstall,
    saveMemoryEntry,
    searchMemory,
    validateRepositoryGovernance
} from '../scripts/api.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts', 'cli.mjs');

async function withTempDir(callback) {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'kronforge-ecc-'));
    try {
        await callback(dir);
    } finally {
        await rm(dir, {recursive: true, force: true});
    }
}

test('repairInstall restaura archivos gestionados ausentes y genera adaptador Codex', async () => {
    await withTempDir(async (dir) => {
        await applyInstall(dir, {init: true, profile: 'startup', adapters: ['codex']});
        const codexAdapter = await readFile(path.join(dir, '.codex', 'AGENTS.md'), 'utf8');
        assert.ok(codexAdapter.includes('AGENTS.md'));

        const target = path.join(dir, '.kronforge', 'packs', 'testing', 'pre-merge.checklist.md');
        await rm(target);

        const repaired = await repairInstall(dir);
        assert.equal(repaired.repaired, true);
        assert.ok(repaired.missing.includes('.kronforge/packs/testing/pre-merge.checklist.md'));
        assert.ok((await readFile(target, 'utf8')).length > 20);
    });
});

test('Agent Config & MCP Shield detecta permisos excesivos, HTTP inseguro e inyección en hooks', async () => {
    await withTempDir(async (dir) => {
        await mkdir(path.join(dir, '.claude'), {recursive: true});
        await writeFile(path.join(dir, '.claude', 'settings.json'), JSON.stringify({
            dangerouslyDisableSandbox: true,
            permissions: {allow: ['Bash(*)']}
        }));
        await writeFile(path.join(dir, '.mcp.json'), JSON.stringify({
            mcpServers: {remote: {url: 'http://untrusted.example.com/mcp'}}
        }));

        const report = await validateRepositoryGovernance(dir);
        assert.equal(report.status, 'FAIL');
        assert.ok(report.errors.some((e) => e.code === 'AGENT_SHIELD_EXCESSIVE_PERMISSIONS'));
        assert.ok(report.warnings.some((w) => w.code === 'AGENT_SHIELD_INSECURE_MCP_HTTP'));
    });
});

test('memory, checkpoints y aprendizaje continuo en cuarentena exigen aprobación humana explícita', async () => {
    await withTempDir(async (dir) => {
        const saved = await saveMemoryEntry(dir, {
            title: 'Decisión de pruebas',
            content: 'Usar fixtures aislados en os.tmpdir().',
            tags: ['testing']
        });
        assert.equal(saved.saved, true);

        const found = await searchMemory(dir, 'tmpdir');
        assert.equal(found.matches.length, 1);

        const cp = await createCheckpoint(dir, {label: 'pre-release', notes: '58 tests ok'});
        assert.match(cp.sha256, /^[a-f0-9]{64}$/);

        const cand = await recordLearningCandidate(dir, {
            title: 'Evitar shell true en Windows',
            lesson: 'Invocar npm-cli.js via process.execPath evita DEP0190 y EINVAL.',
            evidence: 'tests/tarball-clean-install.test.mjs'
        });
        assert.equal(cand.status, 'candidate');
        assert.equal(cand.trusted, false);

        await assert.rejects(
            () => promoteLearningCandidate(dir, cand.id, {approved: false}),
            /aprobación humana/i
        );

        const promoted = await promoteLearningCandidate(dir, cand.id, {approved: true});
        assert.equal(promoted.promoted, true);
        assert.equal(promoted.candidate.trusted, true);

        const list = await listLearningCandidates(dir);
        assert.equal(list.candidates[0].status, 'promoted');

        const cliCheck = spawnSync(process.execPath, [CLI, 'learn', 'list', '--dir', dir, '--json'], {encoding: 'utf8'});
        assert.equal(cliCheck.status, 0);
        assert.equal(JSON.parse(cliCheck.stdout).candidates.length, 1);
    });
});
