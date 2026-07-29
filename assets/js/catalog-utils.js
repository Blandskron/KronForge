/**
 * Utilidades puras compartidas por catálogo, router y validaciones.
 * No dependen del DOM y pueden probarse directamente con node:test.
 */

const ROUTE_ALIASES = Object.freeze({
    playbooks: {tabId: 'library', type: 'playbook'},
    skills: {tabId: 'library', type: 'skill'},
    prompts: {tabId: 'library', type: 'prompt'},
    templates: {tabId: 'library', type: 'template'},
    patterns: {tabId: 'library', type: 'pattern'}
});

const FILTER_PARAMS = Object.freeze({
    query: 'q',
    type: 'type',
    domain: 'domain',
    level: 'level',
    status: 'status',
    compatibility: 'compatibility',
    model: 'model',
    tag: 'tag',
    sort: 'sort'
});

export function normalizeSearch(value = '') {
    return String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es')
        .replace(/\s+/g, ' ')
        .trim();
}

export function toArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value === undefined || value === null || value === '') return [];
    return [value];
}

export function assetLevel(asset = {}) {
    return asset.level || asset.difficulty || 'foundation';
}

export function assetSearchText(asset = {}) {
    return normalizeSearch([
        asset.id,
        asset.title,
        asset.name,
        asset.summary,
        asset.description,
        asset.domain,
        asset.category,
        asset.type,
        asset.status,
        assetLevel(asset),
        asset.version,
        ...toArray(asset.tags),
        ...toArray(asset.compatibility),
        ...toArray(asset.models),
        ...toArray(asset.agents),
        ...toArray(asset.useCases)
    ].filter(Boolean).join(' '));
}

export function filterAssets(assets = [], filters = {}) {
    const query = normalizeSearch(filters.query);
    return assets.filter((asset) => {
        const level = assetLevel(asset);
        const compatibility = toArray(asset.compatibility);
        const models = [...toArray(asset.models), ...toArray(asset.agents)];
        return (!filters.type || filters.type === 'all' || asset.type === filters.type)
            && (!filters.domain || filters.domain === 'all' || asset.domain === filters.domain)
            && (!filters.level || filters.level === 'all' || level === filters.level)
            && (!filters.status || filters.status === 'all' || asset.status === filters.status)
            && (!filters.compatibility || filters.compatibility === 'all' || compatibility.includes(filters.compatibility))
            && (!filters.model || filters.model === 'all' || models.includes(filters.model))
            && (!filters.tag || toArray(asset.tags).includes(filters.tag))
            && (!query || assetSearchText(asset).includes(query));
    });
}

export function sortAssets(assets = [], sort = 'title') {
    const result = [...assets];
    const byTitle = (a, b) => String(a.title || a.name || a.id)
        .localeCompare(String(b.title || b.name || b.id), 'es', {sensitivity: 'base'});

    if (sort === 'updated') {
        return result.sort((a, b) => {
            const difference = Date.parse(b.lastModified || 0) - Date.parse(a.lastModified || 0);
            return difference || byTitle(a, b);
        });
    }
    if (sort === 'difficulty') {
        const weight = {foundation: 0, beginner: 0, intermediate: 1, advanced: 2, expert: 3};
        return result.sort((a, b) =>
            (weight[assetLevel(a)] ?? 99) - (weight[assetLevel(b)] ?? 99) || byTitle(a, b));
    }
    if (sort === 'type') {
        return result.sort((a, b) =>
            String(a.type).localeCompare(String(b.type), 'es', {sensitivity: 'base'}) || byTitle(a, b));
    }
    return result.sort(byTitle);
}

export function filterAndSortAssets(assets = [], filters = {}) {
    return sortAssets(filterAssets(assets, filters), filters.sort);
}

export function normalizePortalFilters(filters = {}) {
    const normalized = {};
    for (const key of Object.keys(FILTER_PARAMS)) {
        const value = String(filters[key] ?? '').trim();
        const isDefault = !value
            || ['type', 'domain', 'level', 'status', 'compatibility', 'model'].includes(key) && value === 'all'
            || key === 'sort' && value === 'title';
        if (!isDefault) normalized[key] = value;
    }
    if (filters.reading === true) normalized.reading = true;
    return normalized;
}

export function parsePortalHash(hash = '') {
    const value = String(hash).replace(/^#/, '');
    const [pathPart, queryString = ''] = value.split('?', 2);
    const segments = pathPart.split('/').filter(Boolean).map((segment) => {
        try {
            return decodeURIComponent(segment);
        } catch {
            return segment;
        }
    });
    const routeTab = segments[0] || 'welcome';
    const alias = ROUTE_ALIASES[routeTab];
    const tabId = alias?.tabId || routeTab;
    const params = new URLSearchParams(queryString);
    const filters = {};
    for (const [key, parameter] of Object.entries(FILTER_PARAMS)) {
        const parameterValue = params.get(parameter);
        if (parameterValue) filters[key] = parameterValue;
    }
    if (params.get('view') === 'reading') filters.reading = true;
    return {
        tabId,
        routeTab,
        assetId: tabId === 'library' && segments[1] ? segments.slice(1).join('/') : null,
        type: alias?.type || null,
        filters: normalizePortalFilters(filters)
    };
}

export function buildPortalHash(tabId = 'welcome', assetId = null, filters = {}) {
    const route = parsePortalHash(`#${tabId}`);
    const base = assetId
        ? `#library/${encodeURIComponent(assetId)}`
        : `#${route.routeTab || route.tabId || 'welcome'}`;
    const normalized = normalizePortalFilters(filters);
    if (route.type && normalized.type === route.type) delete normalized.type;
    const params = new URLSearchParams();
    for (const [key, parameter] of Object.entries(FILTER_PARAMS)) {
        if (normalized[key]) params.set(parameter, normalized[key]);
    }
    if (normalized.reading) params.set('view', 'reading');
    const query = params.toString();
    return query ? `${base}?${query}` : base;
}

export function resolveRelatedAssets(catalog = {}, asset = {}) {
    const ids = toArray(asset.related).map((item) =>
        typeof item === 'string' ? item : item?.id).filter(Boolean);
    const byId = new Map((catalog.assets || []).map((candidate) => [candidate.id, candidate]));
    return ids.map((id) => byId.get(id)).filter(Boolean);
}

export function downloadFilename(asset = {}) {
    const fromPath = String(asset.path || '').split('/').filter(Boolean).at(-1);
    if (fromPath) return fromPath;
    const slug = normalizeSearch(asset.id || asset.title || 'asset')
        .replace(/[^a-z0-9.-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${slug || 'asset'}.md`;
}
