import {createHash} from 'node:crypto';
import {readdir, readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function fromRoot(...parts) {
    return path.join(ROOT, ...parts);
}

export function toPosix(value) {
    return value.split(path.sep).join('/');
}

export async function exists(target) {
    try {
        await stat(target);
        return true;
    } catch {
        return false;
    }
}

export async function readText(target) {
    return readFile(target, 'utf8');
}

export async function readJson(target) {
    return JSON.parse(await readText(target));
}

export async function walk(directory, predicate = () => true) {
    const results = [];
    if (!await exists(directory)) return results;
    for (const entry of await readdir(directory, {withFileTypes: true})) {
        if (entry.name === '.git') continue;
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) results.push(...await walk(target, predicate));
        else if (predicate(target)) results.push(target);
    }
    return results;
}

function parseScalar(value) {
    const trimmed = value.trim();
    if (trimmed === '') return '';
    if (trimmed === 'null' || trimmed === '~') return null;
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const inner = trimmed.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(',').map((item) => parseScalar(item));
    }
    return trimmed.replace(/^(['"])(.*)\1$/, '$2');
}

export function parseFrontMatter(source) {
    const normalized = String(source).replace(/\r\n?/g, '\n');
    if (!normalized.startsWith('---\n')) return {data: null, body: normalized};
    const end = normalized.indexOf('\n---\n', 4);
    if (end === -1) return {data: null, body: normalized};

    const lines = normalized.slice(4, end).split('\n');
    const data = {};
    let activeKey = null;

    for (const line of lines) {
        const key = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
        if (key) {
            activeKey = key[1];
            data[activeKey] = parseScalar(key[2] ?? '');
            continue;
        }
        const item = line.match(/^\s+-\s+(.+)$/);
        if (item && activeKey) {
            if (!Array.isArray(data[activeKey])) data[activeKey] = [];
            data[activeKey].push(parseScalar(item[1]));
        }
    }
    return {data, body: normalized.slice(end + 5)};
}

export function slugifyHeading(value) {
    return String(value)
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
        .trim()
        .replace(/\s+/g, '-');
}

export function sha256(value) {
    return createHash('sha256').update(value).digest('hex');
}

export function normalizeSearch(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

export function semver(value) {
    return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(String(value));
}
