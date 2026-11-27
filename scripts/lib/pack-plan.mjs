import {createHash} from 'node:crypto';
import {lstat, readFile, realpath} from 'node:fs/promises';
import path from 'node:path';
import {validateJsonSchema} from './json-schema.mjs';

const schema = JSON.parse(await readFile(new URL('../../library/schema/pack-preview.schema.json', import.meta.url), 'utf8'));
const digestPattern = /^[a-f0-9]{64}$/;
const maximumFileBytes = 1024 * 1024;

export function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex');
}

export function jsonBytes(value) {
    return Buffer.from(JSON.stringify(value, null, 2) + '\n');
}

export function safePath(relative) {
    if (typeof relative !== 'string' || relative.length > 240 || !relative.split('/').every((part) =>
        (part === 'SKILL.md' || (/^[a-z0-9][a-z0-9._-]*$/.test(part) && part !== 'skill.md')) && !part.endsWith('.') &&
        !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/.test(part))) {
        throw new Error(`Ruta no portable: ${relative}`);
    }
    return relative;
}

export async function readPackFile(root, relative) {
    const parts = safePath(relative).split('/');
    let current = root;
    for (const [index, part] of parts.entries()) {
        current = path.join(current, part);
        const info = await lstat(current);
        const last = index === parts.length - 1;
        if (info.isSymbolicLink() || (last ? !info.isFile() || info.size > maximumFileBytes : !info.isDirectory())) {
            throw new Error(`Archivo o directorio no admitido: ${relative}`);
        }
    }
    return readFile(current);
}

async function loadPack(entry) {
    if (!digestPattern.test(entry.manifestSha256)) throw new Error('Se requiere un SHA-256 del manifiesto');
    const root = await realpath(entry.directory);
    const bytes = await readPackFile(root, 'pack.json');
    if (sha256(bytes) !== entry.manifestSha256) throw new Error('SHA-256 del manifiesto incorrecto');
    const manifest = JSON.parse(bytes.toString('utf8'));
    if (!bytes.equals(jsonBytes(manifest))) throw new Error('El manifiesto requiere JSON canónico del prototipo');
    const errors = validateJsonSchema(manifest, schema);
    if (errors.length) throw new Error(errors.join('\n'));
    const profile = manifest.profiles.find(({id}) => id === entry.profile);
    if (!profile || new Set(manifest.profiles.map(({id}) => id)).size !== manifest.profiles.length) {
        throw new Error(`Perfil ausente o duplicado en ${manifest.id}`);
    }
    const files = new Map();
    for (const file of manifest.files) {
        safePath(file.path);
        safePath(file.target);
        if (!file.path.startsWith('payload/') || files.has(file.target) || file.target.length > 150) {
            throw new Error(`Origen fuera de payload, destino duplicado o demasiado largo: ${file.target}`);
        }
        files.set(file.target, file);
    }
    for (const selection of manifest.profiles) {
        for (const target of selection.files) {
            if (!files.has(target)) throw new Error(`Destino ausente en el perfil: ${target}`);
        }
    }
    return {root, manifest, profile, files, manifestSha256: entry.manifestSha256};
}

export async function resolvePacks(request) {
    const available = new Map();
    for (const entry of request.packs) {
        const pack = await loadPack(entry);
        const {id} = pack.manifest;
        if (available.has(id)) throw new Error(`Identidad de pack duplicada: ${id}`);
        available.set(id, pack);
    }
    const pending = new Set();
    const visited = new Map();
    function visit(id) {
        if (pending.has(id)) throw new Error(`Dependencia cíclica: ${[...pending, id].join(' → ')}`);
        if (visited.has(id)) return;
        const pack = available.get(id);
        if (!pack) throw new Error(`Pack requerido ausente: ${id}`);
        pending.add(id);
        for (const dependency of [...pack.manifest.requires].sort((a, b) => a.id < b.id ? -1 : 1)) {
            const required = available.get(dependency.id);
            if (!required || required.manifest.version !== dependency.version) {
                throw new Error(`Dependencia ausente o distinta de la fijada: ${dependency.id}`);
            }
            visit(dependency.id);
        }
        pending.delete(id);
        visited.set(id, pack);
    }
    for (const id of [...request.roots].sort()) visit(id);

    const contents = new Map();
    const packs = [];
    for (const [id, pack] of visited) {
        const {version, source, requires} = pack.manifest;
        packs.push({id, version, source, manifestSha256: pack.manifestSha256, profile: pack.profile.id,
            requires: requires.map((item) => item.id).sort()});
        for (const target of pack.profile.files) {
            const file = pack.files.get(target);
            const bytes = await readPackFile(pack.root, file.path);
            if (sha256(bytes) !== file.sha256) throw new Error(`SHA-256 del contenido incorrecto: ${file.path}`);
            const prior = contents.get(target);
            if (prior && prior.sha256 !== file.sha256) throw new Error(`Colisión entre packs: ${target}`);
            if (prior) prior.owners.push(id);
            else contents.set(target, {target, sha256: file.sha256, owners: [id], bytes});
        }
    }
    const targets = [...contents.keys()].sort();
    for (const target of targets) {
        const segments = target.split('/');
        for (let end = 1; end < segments.length; end++) {
            if (contents.has(segments.slice(0, end).join('/'))) {
                throw new Error(`Colisión entre archivo y directorio: ${target}`);
            }
        }
    }
    const files = targets.map((target) => {
        const {sha256: digest, owners} = contents.get(target);
        return {target, sha256: digest, owners: owners.sort()};
    });
    return {lock: {schemaVersion: 1, packs, files}, contents};
}
