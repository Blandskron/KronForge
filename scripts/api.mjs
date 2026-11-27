import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CATALOG_PATH = path.join(PACKAGE_ROOT, 'library', 'catalog.json');
export const MASTER_PROMPT_PATH = path.join(PACKAGE_ROOT, 'prompts', 'agents-first-documentation-review.prompt.md');
export const LLMS_TXT_PATH = path.join(PACKAGE_ROOT, 'llms.txt');

export async function loadPackageMeta() {
    return JSON.parse(await readFile(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
}

export async function loadCatalog() {
    return JSON.parse(await readFile(CATALOG_PATH, 'utf8'));
}

export async function listDomains() {
    const catalog = await loadCatalog();
    return catalog.domains || [];
}

export async function listAssets(filters = {}) {
    const catalog = await loadCatalog();
    const {domain, type, status, tag, query} = filters;
    const normalizedQuery = query ? String(query).trim().toLocaleLowerCase('es') : '';

    return (catalog.assets || []).filter((asset) => {
        if (domain && asset.domain !== domain) return false;
        if (type && asset.type !== type) return false;
        if (status && asset.status !== status) return false;
        if (tag && !(asset.tags || []).includes(tag)) return false;
        if (normalizedQuery) {
            const haystack = [asset.id, asset.title, asset.summary, ...(asset.tags || [])]
                .join(' ')
                .toLocaleLowerCase('es');
            if (!haystack.includes(normalizedQuery)) return false;
        }
        return true;
    });
}

export async function getAsset(id) {
    const catalog = await loadCatalog();
    const asset = (catalog.assets || []).find((item) => item.id === id);
    if (!asset) return null;
    const fullPath = path.resolve(PACKAGE_ROOT, 'library', asset.path);
    return {...asset, fullPath};
}

export async function readAssetMarkdown(id) {
    const asset = await getAsset(id);
    if (!asset) throw new Error(`Activo no encontrado: ${id}`);
    return readFile(asset.fullPath, 'utf8');
}

export async function readMasterPrompt() {
    return readFile(MASTER_PROMPT_PATH, 'utf8');
}

export async function readLlmsTxt() {
    return readFile(LLMS_TXT_PATH, 'utf8');
}
