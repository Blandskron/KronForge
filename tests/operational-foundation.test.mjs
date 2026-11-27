import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
    applyInstall,
    applyUninstall,
    detectRepository,
    rollbackInstall,
    runDoctor
} from '../scripts/api.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts', 'cli.mjs');

async function withTempRepo(callback) {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'kronforge-c1-'));
    try {
        await callback(dir);
    } finally {
        await rm(dir, {recursive: true, force: true});
    }
}

test('detectRepository identifica stacks Node/TS, Python y Go sin inventar comandos', async () => {
    await withTempRepo(async (dir) => {
        await writeFile(path.join(dir, 'package.json'), JSON.stringify({
            name: 'demo-ts',
            scripts: {test: 'node --test', build: 'tsc'},
            devDependencies: {typescript: '^5.0.0'}
        }));
        await writeFile(path.join(dir, 'tsconfig.json'), '{}');
        await mkdir(path.join(dir, '.github', 'workflows'), {recursive: true});

        const report = await detectRepository(dir);
        assert.equal(report.name, 'demo-ts');
        assert.ok(report.languages.includes('javascript'));
        assert.ok(report.languages.includes('typescript'));
        assert.equal(report.commands.test, 'npm test');
        assert.equal(report.commands.build, 'npm run build');
        assert.equal(report.ci.githubActions, true);
    });

    await withTempRepo(async (dir) => {
        await writeFile(path.join(dir, 'pyproject.toml'), '[tool.pytest.ini_options]\n[tool.ruff]\n');
        await writeFile(path.join(dir, 'go.mod'), 'module example.com/demo\n');

        const report = await detectRepository(dir);
        assert.ok(report.languages.includes('python'));
        assert.ok(report.languages.includes('go'));
        assert.equal(report.commands.test, 'pytest');
        assert.equal(report.commands.lint, 'ruff check .');
    });
});

test('init soporta dry-run, idempotencia, preserva AGENTS.md en brownfield y genera adaptadores', async () => {
    await withTempRepo(async (dir) => {
        await writeFile(path.join(dir, 'AGENTS.md'), '# Reglas propias existentes\n');
        await writeFile(path.join(dir, 'package.json'), JSON.stringify({name: 'brownfield-app', scripts: {test: 'vitest'}}));

        const dry = await applyInstall(dir, {init: true, profile: 'startup', dryRun: true});
        assert.equal(dry.applied, false);
        assert.equal(dry.dryRun, true);
        assert.ok(dry.plan.summary.create > 0);

        const first = await applyInstall(dir, {init: true, profile: 'startup', adapters: ['claude', 'cursor']});
        assert.equal(first.applied, true);
        assert.equal(await readFile(path.join(dir, 'AGENTS.md'), 'utf8'), '# Reglas propias existentes\n');
        const suggested = await readFile(path.join(dir, '.kronforge', 'AGENTS.suggested.md'), 'utf8');
        assert.ok(suggested.includes('npm test'));
        const claudeAdapter = await readFile(path.join(dir, 'CLAUDE.md'), 'utf8');
        assert.ok(claudeAdapter.includes('AGENTS.md'));

        const second = await applyInstall(dir, {init: true, profile: 'startup', adapters: ['claude', 'cursor']});
        assert.equal(second.applied, true);
        assert.equal(second.plan.summary.create, 0);
        assert.equal(second.plan.summary.update, 0);
        assert.equal(second.plan.summary.conflict, 0);
    });
});

test('install selectivo, detección de deriva/conflictos, uninstall seguro, rollback y doctor funcionan de extremo a extremo', async () => {
    await withTempRepo(async (dir) => {
        const initRes = await applyInstall(dir, {init: true, profile: 'startup'});
        assert.equal(initRes.applied, true);

        const secRes = await applyInstall(dir, {packs: ['security', 'gitflow']});
        assert.equal(secRes.applied, true);
        assert.ok(secRes.lock.packs.some((p) => p.id === 'security'));
        assert.ok(secRes.lock.packs.some((p) => p.id === 'gitflow'));

        const driftedTarget = path.join(dir, '.kronforge', 'packs', 'security', 'security-audit.prompt.md');
        await writeFile(driftedTarget, '# Modificado por el equipo local\n');

        const doctorDrifted = await runDoctor(dir);
        assert.equal(doctorDrifted.healthy, true);
        assert.ok(doctorDrifted.issues.some((i) => i.code === 'LOCAL_DRIFT'));

        const blockedUpdate = await applyInstall(dir, {update: true});
        assert.equal(blockedUpdate.applied, false);
        assert.equal(blockedUpdate.blockedByConflicts, true);

        const uninstallRes = await applyUninstall(dir, ['security']);
        assert.equal(uninstallRes.applied, true);
        assert.equal(uninstallRes.plan.preserved.length, 1);
        assert.equal(await readFile(driftedTarget, 'utf8'), '# Modificado por el equipo local\n');

        const rollbackRes = await rollbackInstall(dir);
        assert.equal(rollbackRes.rolledBack, true);
        assert.ok(rollbackRes.lock.packs.some((p) => p.id === 'security'));
    });
});

test('el CLI ejecuta detect, packs, init --dry-run y doctor con salida JSON válida', async () => {
    await withTempRepo(async (dir) => {
        await writeFile(path.join(dir, 'Cargo.toml'), '[package]\nname = "demo-rs"\n');

        const packsRun = spawnSync(process.execPath, [CLI, 'packs', '--json'], {encoding: 'utf8'});
        assert.equal(packsRun.status, 0);
        const packsJson = JSON.parse(packsRun.stdout);
        assert.ok(packsJson.profiles.length >= 3);
        assert.ok(packsJson.packs.length >= 7);

        const detectRun = spawnSync(process.execPath, [CLI, 'detect', dir, '--json'], {encoding: 'utf8'});
        assert.equal(detectRun.status, 0);
        const detectJson = JSON.parse(detectRun.stdout);
        assert.ok(detectJson.languages.includes('rust'));
        assert.equal(detectJson.commands.test, 'cargo test');

        const initRun = spawnSync(process.execPath, [CLI, 'init', dir, '--profile', 'opensource', '--json'], {encoding: 'utf8'});
        assert.equal(initRun.status, 0);
        const initJson = JSON.parse(initRun.stdout);
        assert.equal(initJson.applied, true);

        const doctorRun = spawnSync(process.execPath, [CLI, 'doctor', dir, '--json'], {encoding: 'utf8'});
        assert.equal(doctorRun.status, 0);
        const doctorJson = JSON.parse(doctorRun.stdout);
        assert.equal(doctorJson.healthy, true);
        assert.equal(doctorJson.profile, 'opensource');
    });
});
