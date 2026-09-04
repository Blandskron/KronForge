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

function lineIndent(line) {
    return line.length - line.trimStart().length;
}

function parseBlock(lines, start, indent) {
    let index = start;

    if (index < lines.length && lineIndent(lines[index]) === indent && /^-\s/.test(lines[index].trimStart())) {
        const items = [];
        while (index < lines.length) {
            const line = lines[index];
            if (!line.trim()) {
                index += 1;
                continue;
            }
            if (lineIndent(line) !== indent || !/^-\s/.test(line.trimStart())) break;

            const rest = line.trimStart().replace(/^-\s*/, '');
            if (/^[A-Za-z][A-Za-z0-9_-]*:(?:\s|$)/.test(rest)) {
                const itemLines = [' '.repeat(indent + 2) + rest];
                index += 1;
                while (index < lines.length) {
                    if (!lines[index].trim()) {
                        index += 1;
                        continue;
                    }
                    if (lineIndent(lines[index]) < indent + 2) break;
                    itemLines.push(lines[index]);
                    index += 1;
                }
                items.push(parseBlock(itemLines, 0, indent + 2)[0]);
            } else {
                items.push(parseScalar(rest));
                index += 1;
            }
        }
        return [items, index];
    }

    const map = {};
    while (index < lines.length) {
        const line = lines[index];
        if (!line.trim() || lineIndent(line) > indent) {
            index += 1;
            continue;
        }
        if (lineIndent(line) < indent) break;

        const entry = line.trim().match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
        if (!entry) {
            index += 1;
            continue;
        }

        const key = entry[1];
        const inline = entry[2] ?? '';
        if (inline.trim() !== '') {
            map[key] = parseScalar(inline);
            index += 1;
            continue;
        }

        let lookahead = index + 1;
        while (lookahead < lines.length && !lines[lookahead].trim()) lookahead += 1;
        if (lookahead < lines.length && lineIndent(lines[lookahead]) > indent) {
            const [nested, next] = parseBlock(lines, lookahead, lineIndent(lines[lookahead]));
            map[key] = nested;
            index = next;
        } else {
            map[key] = '';
            index += 1;
        }
    }
    return [map, index];
}

export function parseFrontMatter(source) {
    const normalized = String(source).replace(/\r\n?/g, '\n');
    if (!normalized.startsWith('---\n')) return {data: null, body: normalized};
    const end = normalized.indexOf('\n---\n', 4);
    if (end === -1) return {data: null, body: normalized};

    const [data] = parseBlock(normalized.slice(4, end).split('\n'), 0, 0);
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
