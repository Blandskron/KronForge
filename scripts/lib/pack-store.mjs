import {randomUUID} from 'node:crypto';
import {lstat, mkdir, mkdtemp, realpath, rename, rm, rmdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {jsonBytes, readPackFile, resolvePacks, sha256} from './pack-plan.mjs';

async function exists(target) {
    try {
        return await lstat(target);
    } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
    }
}

async function verifyDirectory(target) {
    const stat = await exists(target);
    if (stat && (stat.isSymbolicLink() || !stat.isDirectory())) {
        throw new Error(`Directorio de estado no admitido: ${target}`);
    }
    return Boolean(stat);
}

async function readCurrent(store) {
    if (!await verifyDirectory(store) || !await exists(path.join(store, 'current.json'))) {
        return {generation: null, lock: {schemaVersion: 1, packs: [], files: []}};
    }
    const {generation} = JSON.parse(await readPackFile(store, 'current.json'));
    if (typeof generation !== 'string' || !/^[a-f0-9]{64}$/.test(generation)) {
        throw new Error('Puntero de generación inválido');
    }
    const lockBytes = await readPackFile(store, `generations/${generation}/lock.json`);
    if (sha256(lockBytes) !== generation) throw new Error('Deriva en el lock del consumidor');
    const lock = JSON.parse(lockBytes);
    for (const {target, sha256: digest} of lock.files) {
        const relative = `generations/${generation}/files/${target}`;
        if (!await exists(path.join(store, relative)) || sha256(await readPackFile(store, relative)) !== digest) {
            throw new Error(`Deriva en archivo gestionado: ${target}`);
        }
    }
    return {generation, lock};
}

function compareVersion(left, right) {
    const leftParts = left.split('.').map(BigInt);
    const rightParts = right.split('.').map(BigInt);
    for (const [index, part] of leftParts.entries()) {
        if (part !== rightParts[index]) return part < rightParts[index] ? -1 : 1;
    }
    return 0;
}

async function prepare(project, request) {
    const root = await realpath(project);
    const git = await exists(path.join(root, '.git'));
    if (!git || !(git.isDirectory() || git.isFile())) {
        throw new Error('El destino debe ser la raíz de un repositorio Git local');
    }
    const store = path.join(root, '.kronforge-preview');
    const current = await readCurrent(store);
    const {lock, contents} = await resolvePacks(request);
    const priorPacks = new Map(current.lock.packs.map((pack) => [pack.id, pack]));
    for (const pack of lock.packs) {
        const prior = priorPacks.get(pack.id);
        if (!prior) continue;
        if (prior.source.uri !== pack.source.uri) throw new Error(`Cambio de origen: ${pack.id}`);
        const comparison = compareVersion(pack.version, prior.version);
        if (comparison === 0 && prior.manifestSha256 !== pack.manifestSha256) {
            throw new Error(`La misma versión cambió de contenido: ${pack.id}`);
        }
        if (comparison < 0 && request.allowDowngrade !== true) {
            throw new Error(`Downgrade requiere autorización en el plan: ${pack.id}`);
        }
    }
    const priorFiles = new Map(current.lock.files.map((file) => [file.target, file.sha256]));
    const changes = [];
    for (const {target, sha256: digest} of lock.files) {
        const before = priorFiles.get(target) ?? null;
        if (before !== digest) changes.push({target, before, after: digest});
        priorFiles.delete(target);
    }
    for (const [target, before] of priorFiles) changes.push({target, before, after: null});
    const lockBytes = jsonBytes(lock);
    if (lockBytes.length > 1024 * 1024) throw new Error('El lock supera el tamaño admitido');
    const generation = sha256(lockBytes);
    const plan = {schemaVersion: 1, root, current: current.generation, generation,
        allowDowngrade: request.allowDowngrade === true, changes, lock};
    return {plan, contents, store};
}

export async function planPack(project, request) {
    const {plan} = await prepare(project, request);
    return {plan, planSha256: sha256(jsonBytes(plan))};
}

async function writeGeneration(generations, plan, contents) {
    const destination = path.join(generations, plan.generation);
    if (await verifyDirectory(destination)) {
        const lock = await readPackFile(destination, 'lock.json');
        if (sha256(lock) !== plan.generation) throw new Error('Generación archivada alterada');
        for (const file of plan.lock.files) {
            if (sha256(await readPackFile(destination, `files/${file.target}`)) !== file.sha256) {
                throw new Error(`Generación archivada alterada: ${file.target}`);
            }
        }
        return;
    }
    const staging = await mkdtemp(path.toNamespacedPath(path.join(generations, 'stage-')));
    try {
        await mkdir(path.join(staging, 'files'));
        for (const {target, bytes} of contents.values()) {
            const file = path.join(staging, 'files', target);
            await mkdir(path.dirname(file), {recursive: true});
            await writeFile(file, bytes, {flag: 'wx'});
        }
        await writeFile(path.join(staging, 'lock.json'), jsonBytes(plan.lock), {flag: 'wx'});
        await rename(staging, destination);
    } catch (error) {
        const resolved = await realpath(staging);
        if (path.dirname(resolved) === generations && path.basename(resolved).startsWith('stage-')) {
            await rm(resolved, {recursive: true, force: true});
        }
        throw error;
    }
}

export async function applyPack(project, request, approvedSha256) {
    const preview = await prepare(project, request);
    if (sha256(jsonBytes(preview.plan)) !== approvedSha256) throw new Error('El plan aprobado ya no coincide');
    if (preview.plan.current === preview.plan.generation) return preview.plan;

    const {store} = preview;
    if (!await verifyDirectory(store)) await mkdir(store).catch((error) => {
        if (error.code !== 'EEXIST') throw error;
    });
    await verifyDirectory(store);
    const guard = path.join(store, 'write-lock');
    await mkdir(guard).catch((error) => {
        if (error.code === 'EEXIST') throw new Error('Otra aplicación está en curso o requiere recuperación');
        throw error;
    });
    try {
        const {plan, contents} = await prepare(project, request);
        if (sha256(jsonBytes(plan)) !== approvedSha256) throw new Error('El plan aprobado ya no coincide');
        const generations = path.join(store, 'generations');
        if (!await verifyDirectory(generations)) await mkdir(generations);
        await writeGeneration(generations, plan, contents);
        const candidate = path.join(store, `current-${randomUUID()}.json`);
        await writeFile(candidate, jsonBytes({generation: plan.generation}), {flag: 'wx'});
        try {
            await rename(candidate, path.join(store, 'current.json'));
        } finally {
            await rm(candidate, {force: true});
        }
        return plan;
    } finally {
        await rmdir(guard);
    }
}
