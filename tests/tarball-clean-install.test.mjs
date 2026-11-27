import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp, readdir, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function runNpm(args, cwd) {
    if (process.env.npm_execpath && process.env.npm_execpath.endsWith('.js')) {
        return spawnSync(process.execPath, [process.env.npm_execpath, ...args], {cwd, encoding: 'utf8'});
    }
    if (process.platform === 'win32') {
        return spawnSync('cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args], {cwd, encoding: 'utf8'});
    }
    return spawnSync('npm', args, {cwd, encoding: 'utf8'});
}

test('instalación limpia desde tarball npm .tgz ejecuta el ciclo operativo completo sin archivos faltantes', async () => {
    const workDir = await mkdtemp(path.join(os.tmpdir(), 'kronforge-tgz-'));
    const packDir = path.join(workDir, 'pack');
    const consumerDir = path.join(workDir, 'consumer');
    const targetRepo = path.join(workDir, 'target-python-repo');

    try {
        await import('node:fs/promises').then(async (fs) => {
            await fs.mkdir(packDir, {recursive: true});
            await fs.mkdir(consumerDir, {recursive: true});
            await fs.mkdir(targetRepo, {recursive: true});
        });

        const packRun = runNpm(['pack', '--pack-destination', packDir], ROOT);
        assert.equal(packRun.status, 0, packRun.stderr);

        const tarballs = (await readdir(packDir)).filter((f) => f.endsWith('.tgz'));
        assert.equal(tarballs.length, 1);
        const tarballPath = path.join(packDir, tarballs[0]);

        await writeFile(path.join(consumerDir, 'package.json'), JSON.stringify({name: 'clean-consumer', private: true}));
        const installRun = runNpm(['install', tarballPath, '--no-audit', '--no-fund'], consumerDir);
        assert.equal(installRun.status, 0, installRun.stderr);

        // Prepare a Brownfield Python target repo
        await writeFile(path.join(targetRepo, 'pyproject.toml'), '[tool.pytest.ini_options]\n');
        await writeFile(path.join(targetRepo, 'AGENTS.md'), '# Reglas previas del equipo Python\n');
        await writeFile(path.join(targetRepo, 'README.md'), '# Python Service\n');
        await writeFile(path.join(targetRepo, 'LICENSE'), 'MIT\n');
        await writeFile(path.join(targetRepo, 'SECURITY.md'), '# Security\n');

        const installedCli = path.join(consumerDir, 'node_modules', 'kronforge', 'scripts', 'cli.mjs');

        const detectRun = spawnSync(process.execPath, [installedCli, 'detect', targetRepo, '--json'], {encoding: 'utf8'});
        assert.equal(detectRun.status, 0, detectRun.stderr);
        assert.ok(JSON.parse(detectRun.stdout).languages.includes('python'));

        const initRun = spawnSync(process.execPath, [installedCli, 'init', targetRepo, '--profile', 'opensource', '--json'], {encoding: 'utf8'});
        assert.equal(initRun.status, 0, initRun.stderr);
        assert.equal(JSON.parse(initRun.stdout).applied, true);

        const validateRun = spawnSync(process.execPath, [installedCli, 'validate', targetRepo, '--json'], {encoding: 'utf8'});
        assert.equal(validateRun.status, 0, validateRun.stderr);
        assert.equal(JSON.parse(validateRun.stdout).status, 'PASS');

        const scoreRun = spawnSync(process.execPath, [installedCli, 'score', targetRepo, '--json'], {encoding: 'utf8'});
        assert.equal(scoreRun.status, 0, scoreRun.stderr);
        assert.ok(JSON.parse(scoreRun.stdout).total >= 70);

        const contextRun = spawnSync(process.execPath, [installedCli, 'context', targetRepo, '--task', 'seguridad', '--budget', '1000', '--json'], {encoding: 'utf8'});
        assert.equal(contextRun.status, 0, contextRun.stderr);
        assert.ok(JSON.parse(contextRun.stdout).selected.length >= 1);
    } finally {
        await rm(workDir, {recursive: true, force: true});
    }
});
