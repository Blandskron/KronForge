/**
 * navigation.js — Enrutamiento de tabs con carga lazy de páginas HTML.
 *
 * Cada tab-pane en index.html arranca vacío. Al activarse por primera vez
 * se hace fetch de pages/{tabId}.html y se inyecta el contenido.
 * Los fetches exitosos se guardan en pageCache para no repetirlos.
 *
 * Expone switchTab en window para que los botones inline de las páginas
 * (onclick="switchTab(...)") funcionen con ES modules.
 */

import { closeSidebar } from './sidebar.js?v=3.0.0-r2';
import { siteUrl } from './paths.js?v=3.0.0-r2';
import { buildPortalHash, parsePortalHash } from './catalog-utils.js?v=3.0.0-r2';

/** Tabs ya cargadas en el DOM. */
const pageCache = new Set();
let navigationRequestId = 0;
const labels = {
    welcome: 'Inicio',
    quickstart: 'Quick Start',
    domains: 'Dominios',
    library: 'Biblioteca',
    learning: 'Rutas de aprendizaje',
    prompt: 'Prompt principal',
    roadmap: 'Roadmap',
    contributing: 'Contribución',
    changelog: 'Changelog',
    versioning: 'Versionado',
    structure: 'Estructura',
    models: 'Uso por agente',
    example: 'Caso de uso'
};

/**
 * Activa una tab: actualiza nav, muestra el pane y carga su contenido si aún no está cacheado.
 * @param {string} tabId
 */
export async function switchTab(tabId, options = {}) {
    const requestId = ++navigationRequestId;
    const route = parsePortalHash(`#${tabId}`);
    const routeTab = options.assetId ? 'library' : route.routeTab;
    tabId = route.tabId;
    if (!document.getElementById(tabId)) tabId = 'welcome';
    /* ── Actualizar nav items ── */
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
        const isLibraryShortcut = item.hasAttribute('data-type');
        const active = item.getAttribute('data-tab') === tabId
            && (route.type ? item.dataset.type === route.type : !isLibraryShortcut);
        item.classList.toggle('active', active);
        if (active) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
    });

    /* ── Mostrar pane correcto ── */
    document.querySelectorAll('.tab-pane').forEach((pane) => {
        const active = pane.id === tabId;
        pane.classList.toggle('active', active);
        pane.setAttribute('aria-hidden', String(!active));
    });

    /* ── Registrar la navegación para que Atrás/Adelante funcionen ── */
    const routeFilters = options.filters ?? route.filters;
    const nextHash = buildPortalHash(routeTab, options.assetId || null, routeFilters);
    if (options.historyMode !== 'none' && window.location.hash !== nextHash) {
        const method = options.historyMode === 'replace' ? 'replaceState' : 'pushState';
        history[method](null, '', nextHash);
    }

    /* ── Cargar contenido de la página si no está cacheado ── */
    if (!pageCache.has(tabId)) {
        await loadPage(tabId);
    }
    if (requestId !== navigationRequestId) return;

    const breadcrumb = document.getElementById('breadcrumbs');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="#welcome">Framework</a><i class="fa-solid fa-chevron-right" aria-hidden="true"></i><span>${labels[tabId] || tabId}</span>`;
    }

    document.dispatchEvent(new CustomEvent('route:changed', {
        detail: {
            tabId,
            routeTab,
            assetId: options.assetId || route.assetId || null,
            type: route.type,
            filters: routeFilters
        }
    }));

    closeSidebar();
}

/**
 * Carga el HTML de pages/{tabId}.html en el pane correspondiente
 * y dispara el evento 'page:loaded' para que app.js inicialice los bindings.
 * @param {string} tabId
 */
async function loadPage(tabId) {
    const section = document.getElementById(tabId);
    if (!section) return;

    try {
        section.setAttribute('aria-busy', 'true');
        const res = await fetch(siteUrl(`pages/${tabId}.html`, true));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        section.innerHTML = await res.text();
        pageCache.add(tabId);
        document.dispatchEvent(new CustomEvent('page:loaded', { detail: { tabId } }));
        return true;
    } catch (err) {
        console.warn(`No se pudo cargar pages/${tabId}.html`, err);
        const pageSource = siteUrl(`pages/${tabId}.html`);
        section.innerHTML = `
            <div class="page-error" role="alert">
                <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                <h2>No se pudo cargar esta página</h2>
                <p>Comprueba la conexión o vuelve a intentarlo. La fuente HTML también está disponible directamente.</p>
                <div class="page-error-actions">
                    <button class="btn btn-primary" type="button" data-page-retry="${tabId}">
                        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reintentar
                    </button>
                    <a class="btn btn-secondary" href="${pageSource}">Abrir HTML</a>
                </div>
            </div>`;
        return false;
    } finally {
        section.removeAttribute('aria-busy');
    }
}

/** Enlaza los nav-items del sidebar con switchTab. */
export function bindNavigation() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const routeTarget = item.getAttribute('href')?.replace(/^#/, '')
                || item.getAttribute('data-tab');
            switchTab(routeTarget);
        });
    });

    /* Hash navigation desde el back button o links directos */
    window.addEventListener('hashchange', () => {
        const route = parsePortalHash(window.location.hash);
        switchTab(route.routeTab, {
            assetId: route.assetId,
            filters: route.filters,
            historyMode: 'none'
        });
    });

    document.addEventListener('click', async (event) => {
        const retry = event.target.closest('[data-page-retry]');
        if (!retry) return;
        const tabId = retry.dataset.pageRetry;
        if (!await loadPage(tabId)) return;
        const route = parsePortalHash(window.location.hash);
        if (route.tabId !== tabId) return;
        await switchTab(route.routeTab, {
            assetId: route.assetId,
            filters: route.filters,
            historyMode: 'none'
        });
    });
}

/* ── Exponer switchTab globalmente para los onclick inline de las páginas ── */
window.switchTab = switchTab;
