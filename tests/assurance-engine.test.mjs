import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
    applyInstall,
    auditRepository,
    evaluateSkills,
    renderAssuranceMarkdown,
    scoreRepository
} from '../scripts/api.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts', 'cli.mjs');

async function withTempRepo(callback) {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'kronforge-c5-'));
    try {
        await callback(dir);
    } finally {
        await rm(dir, {recursive: true, force: true});
    }
}

test('scoreRepository y auditRepository puntúan un repositorio externo con evidencia trazable AFP-004', async () => {
    await withTempRepo(async (dir) => {
        await writeFile(path.join(dir, 'README.md'), '# Demo\n');
        await writeFile(path.join(dir, 'LICENSE'), 'MIT\n');
        await writeFile(path.join(dir, 'SECURITY.md'), '# Security\n');
        await writeFile(path.join(dir, 'CHANGELOG.md'), '# Changelog\n');
        await writeFile(path.join(dir, 'package.json'), JSON.stringify({name: 'demo-app', scripts: {test: 'node --test'}}));
        await mkdir(path.join(dir, '.github', 'workflows'), {recursive: true});
        await applyInstall(dir, {init: true, profile: 'opensource'});

        const score = await scoreRepository(dir);
        assert.ok(score.total >= 75);
        assert.ok(['A', 'B'].includes(score.grade));
        assert.equal(score.verdict, 'PASS');

        const audit = await auditRepository(dir);
        assert.equal(audit.protocol, 'AFP-004');
        assert.match(audit.digestSha256, /^[a-f0-9]{64}$/);
        const md = renderAssuranceMarkdown(audit);
        assert.ok(md.includes('KronForge Assurance Report'));
        assert.ok(md.includes(audit.digestSha256));
    });
});

test('evaluateSkills evalúa las 7 skills proyectadas del propio KronForge con 100% PASS', async () => {
    const evalRes = await evaluateSkills(ROOT);
    assert.ok(evalRes.total >= 7);
    assert.equal(evalRes.passed, evalRes.total);
});

test('el CLI kronforge ejecuta score, audit y report --format md|json', async () => {
    const scoreRun = spawnSync(process.execPath, [CLI, 'score', ROOT, '--json'], {encoding: 'utf8'});
    assert.equal(scoreRun.status, 0);
    const scoreJson = JSON.parse(scoreRun.stdout);
    assert.ok(scoreJson.total >= 80);

    const auditRun = spawnSync(process.execPath, [CLI, 'audit', ROOT, '--json'], {encoding: 'utf8'});
    assert.equal(auditRun.status, 0);
    const auditJson = JSON.parse(auditRun.stdout);
    assert.equal(auditJson.protocol, 'AFP-004');

    const reportRun = spawnSync(process.execPath, [CLI, 'report', ROOT, '--format', 'md'], {encoding: 'utf8'});
    assert.equal(reportRun.status, 0);
    assert.ok(reportRun.stdout.includes('# KronForge Assurance Report'));
});
