import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {constants} from 'node:fs';
import {copyFile, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {jsonBytes, sha256} from './lib/pack-plan.mjs';

const [kitArgument, outputArgument, python = 'python', extra] = process.argv.slice(2);
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^GIT_/i.test(key)));
env.GIT_CONFIG_NOSYSTEM = '1';
env.GIT_CONFIG_GLOBAL = process.platform === 'win32' ? 'NUL' : '/dev/null';
env.PYTHONDONTWRITEBYTECODE = '1';

function run(cwd, file, args, expected = 0) {
    const result = spawnSync(file, args, {cwd, env, encoding: 'utf8'});
    if (result.error) throw result.error;
    assert.equal(result.status, expected, `${file} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
    return expected === 0 ? result.stdout : result.stderr;
}

const digestFile = async (file) => sha256(await readFile(file));

async function seed(root, stack, sources) {
    const repo = path.join(root, stack);
    await mkdir(repo);
    run(repo, 'git', ['init', '--quiet']);
    for (const [name, bytes] of Object.entries(sources)) await writeFile(path.join(repo, name), bytes);
    await writeFile(path.join(repo, 'AGENTS.md'), '# Consumer rules\n\nPreserve project files.\n');
    run(repo, 'git', ['add', '.']);
    return repo;
}

async function manual(repo, payload, expected) {
    const target = path.join(repo, 'skills/synthetic-handoff/SKILL.md');
    await mkdir(path.dirname(target), {recursive: true});
    const local = Buffer.from('consumer-owned file\n');
    await writeFile(target, local);
    await assert.rejects(copyFile(payload, target, constants.COPYFILE_EXCL), {code: 'EEXIST'});
    assert.deepEqual(await readFile(target), local);
    await rm(target);

    const install = async () => {
        try {
            assert.equal(await digestFile(target), expected, 'Destino ocupado por otros bytes');
            return 0;
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
        await copyFile(payload, target, constants.COPYFILE_EXCL);
        return 1;
    };
    const start = performance.now();
    assert.equal(await digestFile(payload), expected);
    assert.equal(await install(), 1);
    assert.equal(await digestFile(target), expected);
    const milliseconds = performance.now() - start;
    const repeatedWrites = await install();
    assert.equal(repeatedWrites, 0);
    await rm(target);
    await assert.rejects(readFile(target), {code: 'ENOENT'});
    return {result: 'PASS', milliseconds, collisionPreserved: true, repeatedWrites, retired: true};
}

async function declarative(repo, entry, request, update, rollback, retire, payload, expected, nextDigest) {
    const plan = (selection) => JSON.parse(run(repo, process.execPath, [entry, 'plan', repo, selection]));
    const apply = (selection, prepared) =>
        JSON.parse(run(repo, process.execPath, [entry, 'apply', repo, selection, prepared.planSha256]));
    const pointer = path.join(repo, '.kronforge-preview/current.json');
    const installed = (id) => path.join(repo,
        `.kronforge-preview/generations/${id}/files/skills/synthetic-handoff/SKILL.md`);
    const start = performance.now();
    const original = plan(request);
    await assert.rejects(readFile(pointer), {code: 'ENOENT'});
    apply(request, original);
    assert.equal(await digestFile(installed(original.plan.generation)), expected);
    const milliseconds = performance.now() - start;
    const second = plan(request);
    assert.deepEqual(second.plan.changes, []);
    assert.equal(second.plan.current, second.plan.generation);

    const before = await readFile(pointer);
    await writeFile(installed(second.plan.generation), 'synthetic drift\n');
    assert.match(run(repo, process.execPath, [entry, 'plan', repo, request], 1), /Deriva en archivo gestionado/);
    assert.deepEqual(await readFile(pointer), before);
    await copyFile(payload, installed(second.plan.generation));

    const upgraded = apply(update, plan(update));
    assert.equal(await digestFile(installed(upgraded.generation)), nextDigest);
    assert.match(run(repo, process.execPath, [entry, 'plan', repo, request], 1), /Downgrade requiere autorización/);
    const restored = apply(rollback, plan(rollback));
    assert.equal(restored.generation, original.plan.generation);
    assert.equal(await digestFile(installed(restored.generation)), expected);
    assert.deepEqual(apply(retire, plan(retire)).lock.files, []);
    return {result: 'PASS', milliseconds, repeatedWrites: 0, rejectedDrift: true, updated: true,
        blockedUnapprovedDowngrade: true, rolledBack: true, retired: true};
}

try {
    if (!kitArgument || !outputArgument || extra !== undefined) {
        throw new Error('Uso: node scripts/exercise-external-trial.mjs <kit extraído> <carpeta nueva> [python]');
    }
    const root = path.resolve(outputArgument);
    const kit = path.resolve(kitArgument);
    const payload = path.join(kit, 'sample/payload/synthetic-handoff/SKILL.md');
    const request = path.join(kit, 'request.json');
    const retire = path.join(kit, 'retire.json');
    const entry = path.join(kit, 'npm/scripts/pack-preview.mjs');
    const manifest = JSON.parse(await readFile(path.join(kit, 'sample/pack.json'), 'utf8'));
    const expected = manifest.files[0].sha256;
    assert.equal(await digestFile(payload), expected);
    await mkdir(root);

    const newer = path.join(root, 'updated-pack');
    await mkdir(path.join(newer, 'payload/synthetic-handoff'), {recursive: true});
    const changed = Buffer.concat([await readFile(payload), Buffer.from('\nSynthetic update for lifecycle testing.\n')]);
    const nextDigest = sha256(changed);
    const next = {
        ...manifest, version: '1.0.1', source: {...manifest.source, revision: 'fixture-2'},
        files: [{...manifest.files[0], sha256: nextDigest}]
    };
    await writeFile(path.join(newer, next.files[0].path), changed);
    await writeFile(path.join(newer, 'pack.json'), jsonBytes(next));
    const update = path.join(root, 'update.json');
    const rollback = path.join(root, 'rollback.json');
    await writeFile(update, jsonBytes({roots: [manifest.id], packs: [
        {directory: newer, profile: 'default', manifestSha256: sha256(jsonBytes(next))}
    ]}));
    const originalRequest = JSON.parse(await readFile(request, 'utf8'));
    originalRequest.packs[0].directory = path.join(kit, 'sample');
    await writeFile(rollback, jsonBytes({...originalRequest, allowDowngrade: true}));

    const stacks = [
        {name: 'node', executable: process.execPath, args: ['--test', 'app.test.mjs'], sources: {
            'app.mjs': 'export const add = (a, b) => a + b;\n',
            'app.test.mjs': "import assert from 'node:assert/strict';\nimport test from 'node:test';\nimport {add} from './app.mjs';\ntest('adds', () => assert.equal(add(2, 3), 5));\n"
        }},
        {name: 'python', executable: python, args: ['-m', 'unittest', '-v'], sources: {
            'app.py': 'def add(a, b):\n    return a + b\n',
            'test_app.py': 'import unittest\nfrom app import add\n\nclass Addition(unittest.TestCase):\n    def test_add(self):\n        self.assertEqual(add(2, 3), 5)\n'
        }}
    ];
    const results = [];
    for (const [index, stack] of stacks.entries()) {
        const repo = await seed(root, stack.name, stack.sources);
        run(repo, stack.executable, stack.args);
        const paths = index === 0 ? ['manual', 'declarative'] : ['declarative', 'manual'];
        const observed = {};
        for (const route of paths) {
            observed[route] = route === 'manual'
                ? await manual(repo, payload, expected)
                : await declarative(repo, entry, request, update, rollback, retire, payload, expected, nextDigest);
            run(repo, stack.executable, stack.args);
        }
        run(repo, 'git', ['diff', '--exit-code']);
        const untracked = run(repo, 'git', ['ls-files', '--others', '--exclude-standard']).trim();
        assert(untracked.split('\n').every((file) => file.startsWith('.kronforge-preview/')));
        assert.equal(await readFile(path.join(repo, 'AGENTS.md'), 'utf8'), '# Consumer rules\n\nPreserve project files.\n');
        results.push({stack: stack.name, order: paths, projectTests: 'PASS', trackedFilesPreserved: true, ...observed});
    }
    console.log(JSON.stringify({authorRun: true, payloadSha256: expected, results}, null, 2));
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
