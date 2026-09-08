import { switchTab } from './navigation.js?v=3.3.0';
import { siteUrl } from './paths.js?v=3.3.0';
import { setMarkdownContent } from './markdown.js?v=3.3.0';
import {
    assetLevel,
    buildPortalHash,
    downloadFilename,
    filterAndSortAssets,
    normalizeSearch,
    resolveRelatedAssets,
    toArray
} from './catalog-utils.js?v=3.3.0';

let catalogPromise;
let catalog;
let activeAssetId = null;
let assetRequestId = 0;
let assetController;
let lastAssetTrigger;

const FILTER_DEFAULTS = Object.freeze({
    query: '',
    type: 'all',
    domain: 'all',
    level: 'all',
    status: 'all',
    compatibility: 'all',
    model: 'all',
    tag: '',
    sort: 'title',
    reading: false
});
const filters = {...FILTER_DEFAULTS};

const TYPE_LABELS = {
    prompt: 'Prompt',
    skill: 'Skill',
    hook: 'Hook',
    subagent: 'Subagent',
    playbook: 'Playbook',
    checklist: 'Checklist',
    template: 'Template',
    adr: 'ADR',
    protocol: 'Protocol',
    pattern: 'Pattern',
    'anti-pattern': 'Anti-pattern',
    runbook: 'Runbook',
    'case-study': 'Case study',
    architecture: 'Architecture',
    reference: 'Reference',
    'best-practice': 'Best practice',
    example: 'Example',
    tutorial: 'Tutorial',
    guide: 'Guide',
    roadmap: 'Roadmap',
    workflow: 'Workflow',
    recipe: 'Recipe',
    snippet: 'Snippet',
    evaluation: 'Evaluation',
    benchmark: 'Benchmark',
    'tool-integration': 'Tool integration',
    'architecture-note': 'Architecture note'
};

function escapeHtml(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function labelFor(value = '') {
    return TYPE_LABELS[value] || String(value)
        .replaceAll('-', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function uniqueValues(values) {
    return [...new Set(values.flatMap(toArray).filter(Boolean))]
        .sort((a, b) => String(a).localeCompare(String(b), 'es', {sensitivity: 'base'}));
}

function setOptions(select, values, allLabel, selected) {
    if (!select) return;
    select.innerHTML = `<option value="all">${escapeHtml(allLabel)}</option>${values
        .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(labelFor(value))}</option>`)
        .join('')}`;
    select.value = values.includes(selected) ? selected : 'all';
}

function showCatalogError(target, message = 'No se pudo cargar el catálogo.') {
    if (!target) return;
    target.innerHTML = `
        <div class="empty-state" role="alert">
            <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            <h3>${escapeHtml(message)}</h3>
            <p>Comprueba la conexión y vuelve a intentarlo.</p>
            <button class="btn btn-secondary" type="button" data-catalog-retry>
                <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reintentar
            </button>
        </div>`;
}

export async function loadCatalog(force = false) {
    if (force) {
        catalogPromise = null;
        catalog = null;
    }
    if (!catalogPromise) {
        catalogPromise = fetch(siteUrl('library/catalog.json', true))
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then((data) => {
                catalog = data;
                return data;
            })
            .catch((error) => {
                catalogPromise = null;
                throw error;
            });
    }
    return catalogPromise;
}

function domainById(id) {
    return catalog?.domains?.find((domain) => domain.id === id);
}

function countAssets(domainId) {
    return catalog?.assets?.filter((asset) => asset.domain === domainId).length || 0;
}

export async function syncHomeStats() {
    try {
        const data = await loadCatalog();
        const latest = (data.assets || [])
            .map((asset) => asset.lastModified)
            .filter(Boolean)
            .sort()
            .at(-1) || data.lastUpdated;
        const values = {
            'home-domain-count': data.domains?.length || 0,
            'home-asset-count': data.assets?.length || 0,
            'home-type-count': new Set((data.assets || []).map((asset) => asset.type)).size,
            'home-last-updated': latest || '—'
        };
        Object.entries(values).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    } catch {
        document.getElementById('home-last-updated')?.replaceChildren('No disponible');
    }
}

export async function renderDomains(force = false) {
    const grid = document.getElementById('domain-grid');
    if (!grid) return;
    try {
        const data = await loadCatalog(force);
        const render = (scope = 'all') => {
            const domains = (data.domains || []).filter((domain) => {
                if (scope === 'pillar') return domain.pillar;
                if (scope === 'software') return !domain.pillar;
                return true;
            });
            grid.innerHTML = domains.map((domain, index) => `
                <button class="domain-card" type="button" data-domain-link="${escapeHtml(domain.id)}">
                    <span class="domain-index">${String(index + 1).padStart(2, '0')}</span>
                    <span class="domain-count">${countAssets(domain.id)} activos</span>
                    <h3>${escapeHtml(domain.title)}</h3>
                    <p>${escapeHtml(domain.summary)}</p>
                    <span class="domain-open">Explorar <i class="fa-solid fa-arrow-right"></i></span>
                </button>
            `).join('');
        };

        document.querySelectorAll('[data-domain-scope]').forEach((button) => {
            button.addEventListener('click', () => {
                document.querySelectorAll('[data-domain-scope]').forEach((item) => {
                    item.classList.toggle('active', item === button);
                    item.setAttribute('aria-pressed', String(item === button));
                });
                render(button.dataset.domainScope);
            });
        });
        render();
    } catch {
        showCatalogError(grid);
    }
}

function renderTypeFilters(data) {
    const container = document.getElementById('library-type-filters');
    if (!container) return;
    const counts = new Map();
    (data.assets || []).forEach((asset) => counts.set(asset.type, (counts.get(asset.type) || 0) + 1));
    const definitions = new Map((data.typeDefinitions || []).map((definition) => {
        const id = typeof definition === 'string' ? definition : definition.id;
        return [id, typeof definition === 'string' ? labelFor(id) : definition.title || labelFor(id)];
    }));
    const types = [...counts.keys()]
        .filter(Boolean)
        .sort((a, b) => (definitions.get(a) || labelFor(a))
            .localeCompare(definitions.get(b) || labelFor(b), 'es'));
    container.innerHTML = `
        <button class="filter-chip" type="button" data-type="all">Todos <span>${data.assets?.length || 0}</span></button>
        ${types.map((type) => `
            <button class="filter-chip" type="button" data-type="${escapeHtml(type)}">
                ${escapeHtml(definitions.get(type) || labelFor(type))} <span>${counts.get(type) || 0}</span>
            </button>`).join('')}`;
    updateFilterControls();
}

function updateFilterControls() {
    document.querySelectorAll('#library-type-filters [data-type]').forEach((button) => {
        const active = button.dataset.type === filters.type;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });
    const pairs = {
        'library-domain-filter': filters.domain,
        'library-difficulty-filter': filters.level,
        'library-status-filter': filters.status,
        'library-compatibility-filter': filters.compatibility,
        'library-model-filter': filters.model,
        'library-sort': filters.sort
    };
    Object.entries(pairs).forEach(([id, value]) => {
        const control = document.getElementById(id);
        if (control && [...control.options].some((option) => option.value === value)) control.value = value;
    });
    const search = document.getElementById('library-search');
    if (search && search.value !== filters.query) search.value = filters.query;
    const activeTag = document.getElementById('library-active-tag');
    if (activeTag) {
        activeTag.hidden = !filters.tag;
        activeTag.querySelector('strong').textContent = filters.tag;
    }
}

function syncFilterHash(historyMode = 'replace') {
    if (document.querySelector('.tab-pane.active')?.id !== 'library') return;
    const nextHash = buildPortalHash('library', activeAssetId, filters);
    if (window.location.hash === nextHash) return;
    const method = historyMode === 'push' ? 'pushState' : 'replaceState';
    history[method](null, '', nextHash);
}

function renderAssetGrid() {
    const grid = document.getElementById('asset-grid');
    const count = document.getElementById('library-result-count');
    if (!grid || !catalog) return;

    const results = filterAndSortAssets(catalog.assets || [], filters);
    if (count) count.textContent = `${results.length} ${results.length === 1 ? 'activo' : 'activos'}`;

    if (!results.length) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-compass"></i>
                <h3>No encontramos activos</h3>
                <p>Prueba otro término o limpia los filtros.</p>
            </div>`;
        return;
    }

    grid.innerHTML = results.map((asset) => {
        const domain = domainById(asset.domain);
        const tags = toArray(asset.tags).slice(0, 4);
        return `
            <article class="asset-card">
                <button class="asset-card-main" type="button" data-asset-link="${escapeHtml(asset.id)}">
                    <span class="asset-card-top">
                        <span class="asset-type">${escapeHtml(labelFor(asset.type))}</span>
                        <span class="asset-status">${escapeHtml(asset.status || 'draft')}</span>
                    </span>
                    <h3>${escapeHtml(asset.title || asset.name || asset.id)}</h3>
                    <p>${escapeHtml(asset.summary || asset.description || '')}</p>
                    <span class="asset-card-meta">
                        <span>${escapeHtml(domain?.title || asset.domain)}</span>
                        <span>${escapeHtml(assetLevel(asset))}</span>
                        ${asset.version ? `<span>v${escapeHtml(asset.version)}</span>` : ''}
                    </span>
                </button>
                ${tags.length ? `<div class="card-tags">${tags.map((tag) =>
                    `<button type="button" data-tag-filter="${escapeHtml(tag)}">#${escapeHtml(tag)}</button>`).join('')}</div>` : ''}
            </article>`;
    }).join('');
}

function resetFilters() {
    Object.assign(filters, FILTER_DEFAULTS);
    document.body.classList.remove('reading-mode');
    updateFilterControls();
    renderAssetGrid();
    syncFilterHash();
}

export async function renderLibrary(force = false) {
    const grid = document.getElementById('asset-grid');
    if (!grid) return;
    try {
        const data = await loadCatalog(force);
        const domains = (data.domains || []).map((domain) => domain.id);
        const levels = uniqueValues((data.assets || []).map(assetLevel));
        const statuses = uniqueValues((data.assets || []).map((asset) => asset.status));
        const compatibility = uniqueValues((data.assets || []).map((asset) => asset.compatibility));
        const models = uniqueValues((data.assets || []).flatMap((asset) => [
            ...toArray(asset.models),
            ...toArray(asset.agents)
        ]));

        const domainSelect = document.getElementById('library-domain-filter');
        if (domainSelect) {
            domainSelect.innerHTML = `<option value="all">Todos los dominios</option>${(data.domains || [])
                .map((domain) => `<option value="${escapeHtml(domain.id)}">${escapeHtml(domain.title)}</option>`)
                .join('')}`;
            domainSelect.value = domains.includes(filters.domain) ? filters.domain : 'all';
        }
        setOptions(document.getElementById('library-difficulty-filter'), levels, 'Cualquier nivel', filters.level);
        setOptions(document.getElementById('library-status-filter'), statuses, 'Cualquier estado', filters.status);
        setOptions(document.getElementById('library-compatibility-filter'), compatibility, 'Toda compatibilidad', filters.compatibility);
        setOptions(document.getElementById('library-model-filter'), models, 'Todos los agentes/modelos', filters.model);
        renderTypeFilters(data);

        const version = document.getElementById('catalog-version');
        if (version) version.textContent = `framework ${data.frameworkVersion || '3.3.0'} · schema v${data.schemaVersion || 3}`;

        const librarySearch = document.getElementById('library-search');
        if (librarySearch) librarySearch.oninput = (event) => {
            filters.query = event.target.value;
            renderAssetGrid();
            syncFilterHash();
        };
        document.querySelectorAll('#library-type-filters [data-type]').forEach((button) => {
            button.addEventListener('click', () => {
                filters.type = button.dataset.type;
                updateFilterControls();
                renderAssetGrid();
                syncFilterHash();
            });
        });
        [
            ['library-domain-filter', 'domain'],
            ['library-difficulty-filter', 'level'],
            ['library-status-filter', 'status'],
            ['library-compatibility-filter', 'compatibility'],
            ['library-model-filter', 'model'],
            ['library-sort', 'sort']
        ].forEach(([id, key]) => {
            const control = document.getElementById(id);
            if (control) control.onchange = (event) => {
                filters[key] = event.target.value;
                renderAssetGrid();
                syncFilterHash();
            };
        });
        const clearFilters = document.getElementById('library-clear-filters');
        if (clearFilters) clearFilters.onclick = resetFilters;
        updateFilterControls();
        renderAssetGrid();
    } catch {
        showCatalogError(grid);
    }
}

function metadataValue(value) {
    const values = toArray(value);
    if (!values.length) return '';
    return values.map((item) => {
        const display = typeof item === 'object'
            ? item.title || item.name || item.id || JSON.stringify(item)
            : item;
        return `<span class="meta-token">${escapeHtml(display)}</span>`;
    }).join('');
}

function renderAssetMetadata(asset, domain) {
    const fields = [
        ['Dominio', domain?.title || asset.domain],
        ['Categoría', asset.category],
        ['Tipo', labelFor(asset.type)],
        ['Nivel', assetLevel(asset)],
        ['Estado', asset.status],
        ['Versión', asset.version],
        ['Compatibilidad', asset.compatibility],
        ['Modelos', asset.models],
        ['Agentes', asset.agents],
        ['Lenguaje', asset.language],
        ['Autor', asset.author],
        ['Licencia', asset.license],
        ['Actualizado', asset.lastModified],
        ['Complejidad', asset.complexity],
        ['Tiempo estimado', asset.estimatedTime],
        ['Dependencias', asset.dependencies],
        ['Entradas', asset.inputs],
        ['Salidas', asset.outputs],
        ['Ejemplos', asset.examples],
        ['Casos de uso', asset.useCases],
        ['ID', asset.id]
    ].filter(([, value]) => toArray(value).length);

    return `
        <dl>${fields.map(([label, value]) => `
            <div><dt>${escapeHtml(label)}</dt><dd>${metadataValue(value)}</dd></div>`).join('')}
        </dl>
        <div class="asset-tags">${toArray(asset.tags).map((tag) =>
            `<button type="button" data-tag-filter="${escapeHtml(tag)}">#${escapeHtml(tag)}</button>`).join('')}</div>`;
}

function renderRelated(asset) {
    const container = document.getElementById('asset-related');
    if (!container || !catalog) return;
    const related = resolveRelatedAssets(catalog, asset);
    container.hidden = !related.length;
    container.innerHTML = related.length ? `
        <div class="section-heading compact">
            <div><span class="eyebrow">Continuar explorando</span><h3>Activos relacionados</h3></div>
        </div>
        <div class="related-grid">${related.map((item) => `
            <button type="button" class="related-card" data-asset-link="${escapeHtml(item.id)}">
                <span>${escapeHtml(labelFor(item.type))}</span>
                <strong>${escapeHtml(item.title || item.name || item.id)}</strong>
                <small>${escapeHtml(item.summary || '')}</small>
            </button>`).join('')}</div>` : '';
}

function updateAssetBreadcrumb(asset, domain) {
    const local = document.getElementById('asset-viewer-breadcrumb');
    if (local) local.textContent = `${domain?.title || asset.domain} / ${labelFor(asset.type)}`;
    const global = document.getElementById('breadcrumbs');
    if (global) {
        global.innerHTML = `
            <a href="#welcome">Framework</a>
            <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
            <a href="#library" data-tab-link="library">Biblioteca</a>
            <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
            <span>${escapeHtml(asset.title || asset.name || asset.id)}</span>`;
    }
}

async function loadAssetSource(asset) {
    const content = document.getElementById('asset-viewer-content');
    const retry = document.getElementById('retry-asset-content');
    if (!content) return;

    assetController?.abort();
    assetController = new AbortController();
    const requestId = ++assetRequestId;
    const sourceUrl = siteUrl(`library/${asset.path}`, true);
    content.dataset.rawMarkdown = '';
    content.dataset.loadError = 'false';
    content.dataset.loadState = 'loading';
    content.dataset.sourceName = downloadFilename(asset);
    content.classList.add('markdown-body');
    content.textContent = 'Cargando…';
    content.setAttribute('aria-busy', 'true');
    if (retry) retry.hidden = true;

    try {
        const response = await fetch(sourceUrl, {signal: assetController.signal});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const markdown = await response.text();
        if (requestId !== assetRequestId) return;
        setMarkdownContent(content, markdown, {baseUrl: siteUrl(`library/${asset.path}`)});
    } catch (error) {
        if (error.name === 'AbortError' || requestId !== assetRequestId) return;
        content.classList.remove('markdown-body');
        content.dataset.loadError = 'true';
        content.dataset.loadState = 'error';
        content.innerHTML = `
            <div class="asset-load-error" role="alert">
                <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                <strong>No se pudo cargar el activo.</strong>
                <span>Reintenta o abre la fuente Markdown.</span>
            </div>`;
        if (retry) retry.hidden = false;
    } finally {
        if (requestId === assetRequestId) content.removeAttribute('aria-busy');
    }
}

async function openAsset(assetId, focusTarget = null) {
    if (!document.getElementById('asset-viewer')) return;
    try {
        await loadCatalog();
    } catch {
        showCatalogError(document.getElementById('asset-grid'));
        return;
    }
    const asset = catalog.assets?.find((item) => item.id === assetId);
    if (!asset) {
        history.replaceState(null, '', buildPortalHash('library', null, filters));
        if (activeAssetId) closeAsset();
        return;
    }

    activeAssetId = assetId;
    if (focusTarget) lastAssetTrigger = focusTarget;
    const viewer = document.getElementById('asset-viewer');
    const grid = document.getElementById('asset-grid');
    const libraryMeta = document.querySelector('.library-meta');
    const controls = document.querySelector('.library-discovery');
    const domain = domainById(asset.domain);
    viewer.hidden = false;
    if (grid) grid.hidden = true;
    if (libraryMeta) libraryMeta.hidden = true;
    if (controls) controls.hidden = true;

    document.getElementById('asset-viewer-title').textContent = asset.title || asset.name || asset.id;
    document.getElementById('asset-viewer-summary').textContent = asset.summary || asset.description || '';
    document.getElementById('asset-viewer-meta').innerHTML = renderAssetMetadata(asset, domain);
    const download = document.getElementById('download-asset-content');
    if (download) download.dataset.downloadName = downloadFilename(asset);
    const source = document.getElementById('open-asset-source');
    if (source) source.href = siteUrl(`library/${asset.path}`);
    updateAssetBreadcrumb(asset, domain);
    renderRelated(asset);
    const readingButton = document.getElementById('asset-reading-mode');
    document.body.classList.toggle('reading-mode', filters.reading);
    if (readingButton) {
        readingButton.setAttribute('aria-pressed', String(filters.reading));
        readingButton.querySelector('span').textContent = filters.reading ? 'Salir de lectura' : 'Modo lectura';
    }
    await loadAssetSource(asset);
    viewer.focus({preventScroll: true});
    viewer.scrollIntoView({behavior: 'smooth', block: 'start'});
}

function closeAsset(restoreFocus = true, resetBreadcrumb = true) {
    activeAssetId = null;
    assetController?.abort();
    document.body.classList.remove('reading-mode');
    filters.reading = false;
    const readingButton = document.getElementById('asset-reading-mode');
    if (readingButton) readingButton.setAttribute('aria-pressed', 'false');
    const viewer = document.getElementById('asset-viewer');
    const grid = document.getElementById('asset-grid');
    const libraryMeta = document.querySelector('.library-meta');
    const controls = document.querySelector('.library-discovery');
    if (viewer) viewer.hidden = true;
    if (grid) grid.hidden = false;
    if (libraryMeta) libraryMeta.hidden = false;
    if (controls) controls.hidden = false;
    const related = document.getElementById('asset-related');
    if (related) related.hidden = true;
    const breadcrumb = document.getElementById('breadcrumbs');
    if (breadcrumb && resetBreadcrumb) {
        breadcrumb.innerHTML = '<a href="#welcome">Framework</a><i class="fa-solid fa-chevron-right" aria-hidden="true"></i><span>Biblioteca</span>';
    }
    if (restoreFocus) lastAssetTrigger?.focus?.({preventScroll: true});
}

function toggleReadingMode(button) {
    const active = document.body.classList.toggle('reading-mode');
    filters.reading = active;
    button.setAttribute('aria-pressed', String(active));
    button.querySelector('span').textContent = active ? 'Salir de lectura' : 'Modo lectura';
    syncFilterHash();
}

function assetIdsForLearningPath(path) {
    const direct = path.assets || path.assetIds || path.items || [];
    const fromSteps = (path.steps || []).map((step) =>
        typeof step === 'string' ? step : step.assetId || step.asset || step.id);
    return [...toArray(direct), ...fromSteps]
        .map((item) => typeof item === 'string' ? item : item.assetId || item.asset || item.id)
        .filter(Boolean);
}

export async function renderLearningPaths(force = false) {
    const container = document.getElementById('learning-path-grid');
    if (!container) return;
    try {
        const data = await loadCatalog(force);
        const paths = data.learningPaths || [];
        if (!paths.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <h3>Las rutas de aprendizaje están en preparación</h3>
                    <p>El catálogo v3 publicará recorridos compuestos únicamente por activos existentes.</p>
                    <button class="btn btn-secondary" type="button" data-tab-link="library">Explorar biblioteca</button>
                </div>`;
            return;
        }
        container.innerHTML = paths.map((path, index) => {
            const ids = assetIdsForLearningPath(path);
            const assets = ids.map((id) => data.assets.find((asset) => asset.id === id)).filter(Boolean);
            return `
                <article class="learning-card">
                    <div class="learning-card-header">
                        <span>${String(index + 1).padStart(2, '0')}</span>
                        <span>${escapeHtml(path.coverage || path.level || path.difficulty || path.status || 'available')} · ${assets.length} activos</span>
                    </div>
                    <h3>${escapeHtml(path.title || path.name || path.id)}</h3>
                    <p>${escapeHtml(path.summary || path.description || `Recorrido guiado con ${assets.length} activos canónicos.`)}</p>
                    ${path.estimatedTime ? `<small><i class="fa-regular fa-clock"></i> ${escapeHtml(path.estimatedTime)}</small>` : ''}
                    <ol>${assets.map((asset) => `
                        <li><button type="button" data-asset-link="${escapeHtml(asset.id)}">
                            <span>${escapeHtml(labelFor(asset.type))}</span>
                            <strong>${escapeHtml(asset.title || asset.name || asset.id)}</strong>
                        </button></li>`).join('')}</ol>
                </article>`;
        }).join('');
    } catch {
        showCatalogError(container);
    }
}

export function bindCatalogShell() {
    document.addEventListener('route:changed', (event) => {
        const {tabId, assetId, type, filters: routeFilters = {}} = event.detail;
        if (tabId === 'library') {
            Object.assign(filters, FILTER_DEFAULTS, routeFilters);
            if (type) filters.type = type;
            if (assetId) openAsset(assetId);
            else if (activeAssetId) closeAsset(true, true);
        } else if (activeAssetId) {
            closeAsset(false, false);
        }
        if (tabId === 'library' && catalog) {
            updateFilterControls();
            renderAssetGrid();
        }
    });

    document.addEventListener('click', async (event) => {
        const catalogRetry = event.target.closest('[data-catalog-retry]');
        if (catalogRetry) {
            const tab = document.querySelector('.tab-pane.active')?.id;
            if (tab === 'domains') renderDomains(true);
            else if (tab === 'learning') renderLearningPaths(true);
            else renderLibrary(true);
            return;
        }

        const domainLink = event.target.closest('[data-domain-link]');
        if (domainLink) {
            event.preventDefault();
            Object.assign(filters, FILTER_DEFAULTS, {domain: domainLink.dataset.domainLink});
            await switchTab('library', {filters});
            updateFilterControls();
            renderAssetGrid();
            return;
        }

        const assetLink = event.target.closest('[data-asset-link]');
        if (assetLink) {
            event.preventDefault();
            lastAssetTrigger = assetLink;
            await switchTab('library', {assetId: assetLink.dataset.assetLink, filters});
            return;
        }

        const tag = event.target.closest('[data-tag-filter]');
        if (tag) {
            event.preventDefault();
            filters.tag = tag.dataset.tagFilter;
            filters.reading = false;
            await switchTab('library', {filters});
            updateFilterControls();
            renderAssetGrid();
            return;
        }

        const tabLink = event.target.closest('[data-tab-link]');
        if (tabLink) {
            event.preventDefault();
            switchTab(tabLink.dataset.tabLink);
            return;
        }

        if (event.target.closest('#asset-viewer-close')) {
            filters.reading = false;
            switchTab('library', {filters});
            return;
        }

        const reading = event.target.closest('#asset-reading-mode');
        if (reading) {
            toggleReadingMode(reading);
            return;
        }

        if (event.target.closest('#retry-asset-content') && activeAssetId) {
            const asset = catalog?.assets?.find((item) => item.id === activeAssetId);
            if (asset) loadAssetSource(asset);
        }
    });

    const globalSearch = document.getElementById('global-search');
    globalSearch?.addEventListener('input', async () => {
        const alreadyInLibrary = document.querySelector('.tab-pane.active')?.id === 'library';
        Object.assign(filters, FILTER_DEFAULTS, {query: globalSearch.value});
        await switchTab('library', {
            filters,
            historyMode: alreadyInLibrary ? 'replace' : undefined
        });
        const search = document.getElementById('library-search');
        if (search) search.value = globalSearch.value;
        renderAssetGrid();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
            event.preventDefault();
            globalSearch?.focus();
        }
        if (event.key === 'Escape' && activeAssetId) {
            event.preventDefault();
            filters.reading = false;
            switchTab('library', {filters});
        }
    });
}
