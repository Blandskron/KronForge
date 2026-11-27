import assert from 'node:assert/strict';
import {mkdir, mkdtemp, readFile, realpath, rm, rmdir, symlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {jsonBytes, sha256} from '../scripts/lib/pack-plan.mjs';
import {applyPack, planPack} from '../scripts/lib/pack-store.mjs';

async function setup(t) {
    const temp = await realpath(tmpdir());
    const root = await mkdtemp(path.join(temp, 'kronforge-test-'));
    t.after(async () => {
        const resolved = await realpath(root);
        assert.equal(path.dirname(resolved), temp);
        assert.match(path.basename(resolved), /^kronforge-test-[a-z0-9]+$/i);
        await rm(resolved, {recursive: true, force: true});
    });
    const project = path.join(root, 'project');
    await mkdir(path.join(project, '.git'), {recursive: true});
    await writeFile(path.join(project, 'AGENTS.md'), 'Reglas del consumidor\n');
    const store = path.join(project, '.kronforge-preview');
    return {root, project, store};
}

async function pack(root, id, options = {}) {
    const {version = '1.0.0', contents = 'contenido', requires = [], target = 'handoff/SKILL.md'} = options;
    const directory = await mkdtemp(path.join(root, 'pack-'));
    await mkdir(path.join(directory, 'payload'));
    const payload = 'payload/SKILL.md';
    await writeFile(path.join(directory, payload), contents);
    const manifest = jsonBytes({
        schemaVersion: 1, id, version, license: 'MIT',
        source: {uri: 'urn:kronforge:synthetic', revision: version}, requires,
        profiles: [{id: 'default', files: [target]}],
        files: [{path: payload, target, sha256: sha256(contents)}]
    });
    await writeFile(path.join(directory, 'pack.json'), manifest);
    return {directory, profile: 'default', manifestSha256: sha256(manifest)};
}

test('resuelve dependencias en orden, comparte bytes idénticos y retira solo la generación activa', async (t) => {
    const {root, project, store} = await setup(t);
    const dependency = await pack(root, 'dependency');
    const principal = await pack(root, 'primary', {requires: [{id: 'dependency', version: '1.0.0'}]});
    const request = {roots: ['primary'], packs: [principal, dependency]};
    const {plan, planSha256} = await planPack(project, request);
    await assert.rejects(readFile(path.join(store, 'current.json')), {code: 'ENOENT'});
    const reordered = await planPack(project, {...request, packs: [dependency, principal]});
    assert.equal(reordered.planSha256, planSha256);
    assert.deepEqual(plan.lock.packs.map(({id}) => id), ['dependency', 'primary']);
    assert.deepEqual(plan.lock.files[0].owners, ['dependency', 'primary']);
    await applyPack(project, request, planSha256);
    const pointer = path.join(store, 'current.json');
    const before = await readFile(pointer);
    const repeated = await planPack(project, request);
    assert.deepEqual(repeated.plan.changes, []);
    await applyPack(project, request, repeated.planSha256);
    assert.deepEqual(await readFile(pointer), before);
    await assert.rejects(applyPack(project, request, planSha256), /plan aprobado/);
    const empty = {roots: [], packs: []};
    const retirement = await planPack(project, empty);
    assert.equal(retirement.plan.changes[0].after, null);
    await applyPack(project, empty, retirement.planSha256);
    assert.equal(await readFile(path.join(project, 'AGENTS.md'), 'utf8'), 'Reglas del consumidor\n');
    assert.equal(await readFile(path.join(store, 'generations', plan.generation, 'files/handoff/SKILL.md'), 'utf8'), 'contenido');
});

test('rechaza dependencias ausentes, ciclos, versiones distintas, colisiones y payload alterado', async (t) => {
    const {root, project} = await setup(t);
    const primary = await pack(root, 'a', {requires: [{id: 'b', version: '1.0.0'}]});
    await assert.rejects(planPack(project, {roots: ['a'], packs: [primary]}), /Dependencia ausente/);
    const wrongVersion = await pack(root, 'b', {version: '2.0.0'});
    await assert.rejects(planPack(project, {roots: ['a'], packs: [primary, wrongVersion]}), /Dependencia ausente/);
    const cycle = await pack(root, 'b', {requires: [{id: 'a', version: '1.0.0'}]});
    await assert.rejects(planPack(project, {roots: ['a'], packs: [primary, cycle]}), /cíclica/);
    const colliding = await pack(root, 'b', {contents: 'distinto'});
    await assert.rejects(planPack(project, {roots: ['a'], packs: [primary, colliding]}), /Colisión/);
    await writeFile(path.join(primary.directory, 'payload/SKILL.md'), 'alterado');
    const dependency = await pack(root, 'b');
    await assert.rejects(planPack(project, {roots: ['a'], packs: [primary, dependency]}), /SHA-256 del contenido/);
});

test('impide rutas no portables y rechaza enlaces dentro de un pack', async (t) => {
    const {root, project} = await setup(t);
    const escape = await pack(root, 'pack', {target: '../outside'});
    await assert.rejects(planPack(project, {roots: ['pack'], packs: [escape]}), /Ruta no portable/);
    const linked = await pack(root, 'pack');
    const payload = path.join(linked.directory, 'payload');
    const outside = path.join(root, 'outside');
    await mkdir(outside);
    await writeFile(path.join(outside, 'SKILL.md'), 'contenido');
    await rm(path.join(payload, 'SKILL.md'));
    await rmdir(payload);
    await symlink(outside, payload, 'junction');
    await assert.rejects(planPack(project, {roots: ['pack'], packs: [linked]}), /no admitido/);
});

test('conserva la generación ante fallo, serializa escrituras y permite rollback explícito', async (t) => {
    const {root, project, store} = await setup(t);
    const one = {roots: ['pack'], packs: [await pack(root, 'pack')]};
    const two = {roots: ['pack'], packs: [await pack(root, 'pack', {version: '2.0.0', contents: 'actualizado'})]};
    const first = await planPack(project, one);
    const applications = await Promise.allSettled([
        applyPack(project, one, first.planSha256),
        applyPack(project, one, first.planSha256)
    ]);
    assert.equal(applications.filter(({status}) => status === 'fulfilled').length, 1);
    assert.match(applications.find(({status}) => status === 'rejected').reason.message, /en curso|plan aprobado/);
    const pointer = path.join(store, 'current.json');
    const before = await readFile(pointer);
    const next = await planPack(project, two);
    const generation = path.join(store, 'generations', next.plan.generation);
    await mkdir(generation);
    await writeFile(path.join(generation, 'lock.json'), 'corrupto');
    await assert.rejects(applyPack(project, two, next.planSha256), /Generación archivada alterada/);
    assert.deepEqual(await readFile(pointer), before);
    await rm(path.join(generation, 'lock.json'));
    await rmdir(generation);
    await applyPack(project, two, next.planSha256);
    await assert.rejects(planPack(project, one), /Downgrade requiere autorización/);
    const rollback = {...one, allowDowngrade: true};
    const reverse = await planPack(project, rollback);
    await applyPack(project, rollback, reverse.planSha256);
    assert.deepEqual(await readFile(pointer), before);
    await writeFile(path.join(store, 'generations', first.plan.generation, 'files/handoff/SKILL.md'), 'deriva');
    await assert.rejects(planPack(project, two), /Deriva en archivo gestionado/);
});

test('aplica en un repositorio con ruta absoluta larga', async (t) => {
    const {root} = await setup(t);
    const project = path.join(root, 'long-path'.repeat(16), 'long-path'.repeat(10), 'consumer');
    await mkdir(path.join(project, '.git'), {recursive: true});
    const request = {roots: ['pack'], packs: [await pack(root, 'pack')]};
    const {plan, planSha256} = await planPack(project, request);
    await applyPack(project, request, planSha256);
    assert.equal((await planPack(project, request)).plan.current, plan.generation);
});
