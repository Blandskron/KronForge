import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildPackManifest, evaluateSkills, scaffoldSkill, verifyPackManifest} from '../scripts/api.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts', 'cli.mjs');

async function withTempDir(callback) {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'kronforge-c6-'));
    try {
        await callback(dir);
    } finally {
        await rm(dir, {recursive: true, force: true});
    }
}

test('scaffoldSkill crea una skill conforme a agentskills.io que aprueba evaluateSkills', async () => {
    await withTempDir(async (dir) => {
        const res = await scaffoldSkill(dir, {name: 'release-check', title: 'Release Check'});
        assert.equal(res.created, true);
        assert.equal(res.path, 'skills/release-check/SKILL.md');

        const evaluation = await evaluateSkills(dir);
        assert.equal(evaluation.total, 1);
        assert.equal(evaluation.passed, 1);
    });
});

test('buildPackManifest y verifyPackManifest detectan integridad válida y alteración de bytes', async () => {
    await withTempDir(async (dir) => {
        await writeFile(path.join(dir, 'guide.md'), '# Pack Guide\n');
        const built = await buildPackManifest(dir, {id: 'community.demo', version: '1.0.0'});
        assert.equal(built.fileCount, 1);

        const ok = await verifyPackManifest(dir);
        assert.equal(ok.status, 'PASS');

        await writeFile(path.join(dir, 'guide.md'), '# Tampered\n');
        const tampered = await verifyPackManifest(dir);
        assert.equal(tampered.status, 'FAIL');
        assert.equal(tampered.errors[0].code, 'DIGEST_MISMATCH');
    });
});

test('el CLI ejecuta skill new, pack build y pack verify en JSON', async () => {
    await withTempDir(async (dir) => {
        const skillRun = spawnSync(process.execPath, [CLI, 'skill', 'new', 'audit-helper', '--dir', dir, '--json'], {encoding: 'utf8'});
        assert.equal(skillRun.status, 0);
        assert.equal(JSON.parse(skillRun.stdout).name, 'audit-helper');

        const buildRun = spawnSync(process.execPath, [CLI, 'pack', 'build', dir, '--id', 'community.audit', '--version', '1.0.0', '--json'], {encoding: 'utf8'});
        assert.equal(buildRun.status, 0);
        assert.equal(JSON.parse(buildRun.stdout).fileCount, 1);

        const verifyRun = spawnSync(process.execPath, [CLI, 'pack', 'verify', dir, '--json'], {encoding: 'utf8'});
        assert.equal(verifyRun.status, 0);
        assert.equal(JSON.parse(verifyRun.stdout).status, 'PASS');
    });
});
