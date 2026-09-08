import { switchTab } from './navigation.js';
import { siteUrl } from './paths.js';
import { setMarkdownContent } from './markdown.js';

let catalogPromise;
let catalog;
let selectedType = 'all';
let selectedDomain = 'all';
let selectedDifficulty = 'all';
let pendingAssetId = null;

const typeLabels = {
    prompt: 'Prompt',
    skill: 'Skill',
    playbook: 'Playbook',
    template: 'Template',
    checklist: 'Checklist',
    protocol: 'Protocol',
    pattern: 'Pattern',
    'anti-pattern': 'Anti-pattern',
    reference: 'Reference',
    example: 'Example',
    'case-study': 'Case study',
    'best-practice': 'Best practice',
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

export async function loadCatalog() {
    if (!catalogPromise) {
        catalogPromise = fetch(siteUrl('library/catalog.json', true))
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then((data) => {
                catalog = data;
                return data;
            });
    }
    return catalogPromise;
}

function domainById(id) {
    return catalog?.domains.find((domain) => domain.id === id);
}

function countAssets(domainId) {
    return catalog?.assets.filter((asset) => asset.domain === domainId).length || 0;
}

export async function syncHomeStats() {
    const data = await loadCatalog();
    const domainCount = document.getElementById('home-domain-count');
    const assetCount = document.getElementById('home-asset-count');
    if (domainCount) domainCount.textContent = data.domains.length;
    if (assetCount) assetCount.textContent = data.assets.length;
}

export async function renderDomains() {
    const data = await loadCatalog();
    const grid = document.getElementById('domain-grid');
    if (!grid) return;

    const render = (scope = 'all') => {
        const domains = data.domains.filter((domain) => {
            if (scope === 'pillar') return domain.pillar;
            if (scope === 'software') return !domain.pillar;
            return true;
        });
        grid.innerHTML = domains.map((domain, index) => `
            <button class="domain-card" data-domain-link="${escapeHtml(domain.id)}">
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
            document.querySelectorAll('[data-domain-scope]').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            render(button.dataset.domainScope);
        });
    });

    render();
}

function assetSearchText(asset) {
    return [
        asset.id,
        asset.title,
        asset.summary,
        asset.domain,
        asset.type,
        asset.difficulty,
        ...(asset.tags || [])
    ].join(' ').toLowerCase();
}

function renderAssetGrid() {
    const grid = document.getElementById('asset-grid');
    const count = document.getElementById('library-result-count');
    const query = document.getElementById('library-search')?.value.trim().toLowerCase() || '';
    if (!grid || !catalog) return;

    const results = catalog.assets.filter((asset) => {
        const matchesType = selectedType === 'all' || asset.type === selectedType;
        const matchesDomain = selectedDomain === 'all' || asset.domain === selectedDomain;
        const matchesDifficulty = selectedDifficulty === 'all' || asset.difficulty === selectedDifficulty;
        const matchesQuery = !query || assetSearchText(asset).includes(query);
        return matchesType && matchesDomain && matchesDifficulty && matchesQuery;
    });

    count.textContent = `${results.length} ${results.length === 1 ? 'activo' : 'activos'}`;

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
        return `
            <button class="asset-card" data-asset-link="${escapeHtml(asset.id)}">
                <div class="asset-card-top">
                    <span class="asset-type">${escapeHtml(typeLabels[asset.type] || asset.type)}</span>
                    <span class="asset-status">${escapeHtml(asset.status)}</span>
                </div>
                <h3>${escapeHtml(asset.title)}</h3>
                <p>${escapeHtml(asset.summary)}</p>
                <div class="asset-card-meta">
                    <span>${escapeHtml(domain?.title || asset.domain)}</span>
                    <span>${escapeHtml(asset.difficulty || 'foundation')}</span>
                </div>
            </button>`;
    }).join('');
}

function applyType(type = 'all') {
    selectedType = type;
    document.querySelectorAll('#library-type-filters [data-type]').forEach((button) => {
        button.classList.toggle('active', button.dataset.type === selectedType);
    });
    renderAssetGrid();
}

function applyDomain(domain = 'all') {
    selectedDomain = domain;
    const select = document.getElementById('library-domain-filter');
    if (select) select.value = domain;
    renderAssetGrid();
}

export async function renderLibrary() {
    const data = await loadCatalog();
    const domainSelect = document.getElementById('library-domain-filter');
    const version = document.getElementById('catalog-version');
    if (!domainSelect) return;

    domainSelect.innerHTML = `<option value="all">Todos los dominios</option>${data.domains
        .map((domain) => `<option value="${escapeHtml(domain.id)}">${escapeHtml(domain.title)}</option>`)
        .join('')}`;
    domainSelect.value = selectedDomain;
    if (version) version.textContent = `framework ${data.frameworkVersion} · schema v${data.schemaVersion}`;

    document.querySelectorAll('#library-type-filters [data-type]').forEach((button) => {
        button.addEventListener('click', () => applyType(button.dataset.type));
    });
    document.getElementById('library-search')?.addEventListener('input', renderAssetGrid);
    domainSelect.addEventListener('change', () => {
        selectedDomain = domainSelect.value;
        renderAssetGrid();
    });
    document.getElementById('library-difficulty-filter')?.addEventListener('change', (event) => {
        selectedDifficulty = event.target.value;
        renderAssetGrid();
    });
    document.getElementById('library-clear-filters')?.addEventListener('click', () => {
        selectedType = 'all';
        selectedDomain = 'all';
        selectedDifficulty = 'all';
        const search = document.getElementById('library-search');
        const difficulty = document.getElementById('library-difficulty-filter');
        if (search) search.value = '';
        if (difficulty) difficulty.value = 'all';
        applyDomain('all');
        applyType('all');
    });
    document.getElementById('asset-viewer-close')?.addEventListener('click', closeAsset);
    applyType(selectedType);
    if (pendingAssetId) {
        const assetId = pendingAssetId;
        pendingAssetId = null;
        openAsset(assetId);
    }
}

export async function openAsset(assetId) {
    await loadCatalog();
    if (!document.getElementById('asset-viewer')) {
        pendingAssetId = assetId;
        await switchTab('library');
        return;
    }

    const asset = catalog.assets.find((item) => item.id === assetId);
    if (!asset) return;
    const viewer = document.getElementById('asset-viewer');
    const domain = domainById(asset.domain);
    viewer.hidden = false;
    document.getElementById('asset-grid').hidden = true;
    document.querySelector('.library-meta').hidden = true;
    document.getElementById('asset-viewer-title').textContent = asset.title;
    document.getElementById('asset-viewer-breadcrumb').textContent = `${domain?.title || asset.domain} / ${typeLabels[asset.type] || asset.type}`;
    document.getElementById('asset-viewer-meta').innerHTML = `
        <span class="asset-type">${escapeHtml(typeLabels[asset.type] || asset.type)}</span>
        <dl>
            <div><dt>Dominio</dt><dd>${escapeHtml(domain?.title || asset.domain)}</dd></div>
            <div><dt>Dificultad</dt><dd>${escapeHtml(asset.difficulty)}</dd></div>
            <div><dt>Estado</dt><dd>${escapeHtml(asset.status)}</dd></div>
            <div><dt>ID</dt><dd><code>${escapeHtml(asset.id)}</code></dd></div>
        </dl>
        <div class="asset-tags">${(asset.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>`;
    const content = document.getElementById('asset-viewer-content');
    const download = document.getElementById('download-asset-content');
    content.dataset.rawMarkdown = '';
    content.dataset.sourceName = asset.path.split('/').at(-1);
    content.textContent = 'Cargando...';
    if (download) download.dataset.downloadName = content.dataset.sourceName;
    try {
        const response = await fetch(siteUrl(`library/${asset.path}`, true));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setMarkdownContent(content, await response.text());
    } catch {
        content.classList.remove('markdown-body');
        content.textContent = 'No se pudo cargar el activo. Abre su fuente en el repositorio.';
    }
    viewer.scrollIntoView({behavior: 'smooth', block: 'start'});
}

function closeAsset() {
    const viewer = document.getElementById('asset-viewer');
    if (!viewer) return;
    viewer.hidden = true;
    document.getElementById('asset-grid').hidden = false;
    document.querySelector('.library-meta').hidden = false;
}

export function bindCatalogShell() {
    document.addEventListener('click', async (event) => {
        const typedNav = event.target.closest('.nav-item[data-type]');
        if (typedNav) selectedType = typedNav.dataset.type;

        const domainLink = event.target.closest('[data-domain-link]');
        if (domainLink) {
            event.preventDefault();
            selectedDomain = domainLink.dataset.domainLink;
            await switchTab('library');
            applyDomain(selectedDomain);
        }

        const assetLink = event.target.closest('[data-asset-link]');
        if (assetLink) {
            event.preventDefault();
            openAsset(assetLink.dataset.assetLink);
        }

        const tabLink = event.target.closest('[data-tab-link]');
        if (tabLink) {
            event.preventDefault();
            switchTab(tabLink.dataset.tabLink);
        }
    });

    const globalSearch = document.getElementById('global-search');
    globalSearch?.addEventListener('input', async () => {
        await switchTab('library');
        const search = document.getElementById('library-search');
        if (search) {
            search.value = globalSearch.value;
            renderAssetGrid();
            search.focus();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
            event.preventDefault();
            globalSearch?.focus();
        }
        if (event.key === 'Escape') closeAsset();
    });
}
