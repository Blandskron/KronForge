import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir, mkdtemp, readFile, realpath, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

const temp = await realpath(tmpdir());
const root = await mkdtemp(path.join(temp, 'kronforge-pilot-'));
const repo = path.join(root, 'consumer');
const artifact = path.join(root, 'fixture.json');
const target = 'release-checklist.md';
const rules = '# AGENTS.md\n\nUse Git locally. Preserve consumer files.\n';
const payload = JSON.stringify({
    description: 'Synthetic release checklist for the internal KronForge pilot',
    files: {[target]: '# Release checklist\n\nRun the local gate and record its exit code.\n'}
});
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const expectedDigest = digest(payload);
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^GIT_/i.test(key)));
env.GIT_CONFIG_NOSYSTEM = '1';
env.GIT_CONFIG_GLOBAL = path.join(root, 'empty.gitconfig');

function git(...args) {
    const result = spawnSync('git', ['-c', `core.hooksPath=${path.join(root, 'hooks')}`,
        '-c', 'core.autocrlf=false', '-c', 'commit.gpgsign=false', ...args],
    {cwd: repo, env, encoding: 'utf8'});
    if (result.error) throw result.error;
    assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`);
    return result.stdout.trim();
}

async function plan() {
    const bytes = await readFile(artifact);
    assert.equal(digest(bytes), expectedDigest, 'Digest del fixture incorrecto');
    const content = Buffer.from(JSON.parse(bytes).files[target], 'utf8');
    try {
        const existing = await readFile(path.join(repo, target));
        assert.deepEqual(existing, content, 'Colisión con archivo local');
        return [];
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
    return [{target, content}];
}

async function apply(changes) {
    for (const {target: destination, content} of changes) {
        await writeFile(path.join(repo, destination), content, {flag: 'wx'});
    }
}

function pass(scenario, evidence) {
    console.log(`PASS ${scenario} · ${evidence}`);
}

try {
    await mkdir(repo);
    await mkdir(path.join(root, 'hooks'));
    await writeFile(env.GIT_CONFIG_GLOBAL, '');
    console.log(`Fixture SHA-256 ${expectedDigest} · ${process.platform} · Node ${process.version} · ${git('--version')}`);
    git('init', '--initial-branch=principal');
    git('config', 'user.name', 'KronForge Synthetic Pilot');
    git('config', 'user.email', 'pilot@example.invalid');
    await writeFile(path.join(repo, 'AGENTS.md'), rules);
    await writeFile(path.join(repo, 'version.txt'), '1.0.0\n');
    await writeFile(path.join(repo, 'behavior.txt'), 'needs-fix\n');
    await writeFile(path.join(repo, 'gate.mjs'), [
        'import {readFileSync} from "node:fs";',
        'const [version, behavior] = process.argv.slice(2);',
        'const read = (file) => readFileSync(file, "utf8").trim();',
        'if (read("version.txt") !== version || read("behavior.txt") !== behavior) process.exitCode = 1;',
        ''
    ].join('\n'));
    git('add', '.');
    git('commit', '-m', 'Synthetic consumer baseline');
    const baseline = git('rev-parse', 'HEAD');
    const main = git('branch', '--show-current');
    git('branch', 'soporte-1');
    git('config', 'pilot.maintenanceBranch', 'soporte-1');
    const maintenance = git('config', '--get', 'pilot.maintenanceBranch');

    await writeFile(artifact, `${payload}\n`);
    await assert.rejects(plan, /Digest del fixture incorrecto/);
    assert.equal(git('status', '--porcelain'), '');
    await writeFile(artifact, payload);
    pass('integridad', 'snapshot alterado rechazado con árbol limpio');

    await writeFile(path.join(repo, target), 'consumer work\n');
    const collisionState = git('status', '--porcelain');
    await assert.rejects(plan, /Colisión con archivo local/);
    assert.equal(git('status', '--porcelain'), collisionState);
    assert.equal(await readFile(path.join(repo, target), 'utf8'), 'consumer work\n');
    assert.equal(await readFile(path.join(repo, 'AGENTS.md'), 'utf8'), rules);
    await rm(path.join(repo, target));
    pass('colisión', 'archivo consumidor y AGENTS.md preservados');

    const changes = await plan();
    assert.deepEqual(changes.map((change) => change.target), [target]);
    assert.equal(git('status', '--porcelain'), '');
    await apply(changes);
    assert.equal(git('status', '--porcelain'), `?? ${target}`);
    assert.deepEqual(await readFile(path.join(repo, target)), changes[0].content);
    const repeated = await plan();
    assert.deepEqual(repeated, []);
    await apply(repeated);
    git('add', '--', target);
    git('commit', '-m', 'Apply synthetic checklist');
    const adoption = git('rev-parse', 'HEAD');
    pass('adopción', `base ${baseline}, adopción ${adoption}, segunda aplicación vacía`);

    const gate = (version, behavior) => {
        const result = spawnSync(process.execPath, ['gate.mjs', version, behavior], {cwd: repo, env});
        if (result.error) throw result.error;
        assert.equal(result.signal, null);
        return result.status;
    };

    git('switch', '-c', 'release-local');
    await writeFile(path.join(repo, 'version.txt'), '2.0.0\n');
    assert.equal(gate('2.0.0', 'needs-fix'), 0);
    git('commit', '-am', 'Prepare synthetic release 2.0.0');
    const release = git('rev-parse', 'HEAD');
    git('switch', main);
    git('merge', '--ff-only', 'release-local');
    assert.equal(git('rev-parse', main), release);
    assert.equal(git('rev-parse', maintenance), baseline);
    pass('release', `${main} en ${release}, ${maintenance} en la base, gate=0`);

    git('switch', maintenance);
    assert.equal(gate('1.0.0', 'fixed'), 1);
    await writeFile(path.join(repo, 'behavior.txt'), 'fixed\n');
    assert.equal(gate('1.0.0', 'fixed'), 0);
    git('commit', '-am', 'Fix synthetic behavior on maintenance line');
    const hotfix = git('rev-parse', 'HEAD');
    git('switch', main);
    git('cherry-pick', hotfix);
    assert.equal(gate('2.0.0', 'fixed'), 0);
    pass('hotfix', `${maintenance} en ${hotfix}, ${main} en ${git('rev-parse', 'HEAD')}, gates=1/0/0`);

    await writeFile(path.join(repo, 'consumer-note.txt'), 'existing consumer work\n');
    const beforeRevert = git('rev-parse', 'HEAD');
    git('revert', '--no-edit', adoption);
    assert.equal(git('diff', '--name-status', beforeRevert, 'HEAD'), `D\t${target}`);
    assert.equal(git('status', '--porcelain'), '?? consumer-note.txt');
    assert.equal(await readFile(path.join(repo, 'consumer-note.txt'), 'utf8'), 'existing consumer work\n');
    assert.equal(await readFile(path.join(repo, 'AGENTS.md'), 'utf8'), rules);
    assert.equal(gate('2.0.0', 'fixed'), 0);
    assert.equal(git('remote'), '');
    assert.equal(git('tag', '--list'), '');
    pass('reversión', 'solo se retiró la checklist, reglas y cambios del consumidor preservados');
} finally {
    const resolved = await realpath(root);
    assert.equal(path.dirname(resolved), temp);
    assert.match(path.basename(resolved), /^kronforge-pilot-[a-z0-9]+$/i);
    await rm(resolved, {recursive: true, force: true});
}
