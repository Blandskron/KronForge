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

import { closeSidebar } from './sidebar.js';
import { siteUrl } from './paths.js';

/** Tabs ya cargadas en el DOM. */
const pageCache = new Set();
const labels = {
    welcome: 'Inicio',
    quickstart: 'Quick Start',
    domains: 'Dominios',
    library: 'Biblioteca',
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
export async function switchTab(tabId) {
    const aliases = {playbooks: 'library', skills: 'library', prompts: 'library', templates: 'library', patterns: 'library'};
    tabId = aliases[tabId] || tabId;
    if (!document.getElementById(tabId)) tabId = 'welcome';
    /* ── Actualizar nav items ── */
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
        const isLibraryShortcut = item.hasAttribute('data-type');
        item.classList.toggle('active', item.getAttribute('data-tab') === tabId && !isLibraryShortcut);
    });

    /* ── Mostrar pane correcto ── */
    document.querySelectorAll('.tab-pane').forEach((pane) => {
        pane.classList.toggle('active', pane.id === tabId);
    });

    /* ── Registrar la navegación para que Atrás/Adelante funcionen ── */
    if (window.location.hash !== `#${tabId}`) {
        history.pushState(null, '', `#${tabId}`);
    }

    /* ── Cargar contenido de la página si no está cacheado ── */
    if (!pageCache.has(tabId)) {
        await loadPage(tabId);
    }

    const breadcrumb = document.getElementById('breadcrumbs');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="#welcome">Framework</a><i class="fa-solid fa-chevron-right" aria-hidden="true"></i><span>${labels[tabId] || tabId}</span>`;
    }

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
    } finally {
        section.removeAttribute('aria-busy');
    }
}

/** Enlaza los nav-items del sidebar con switchTab. */
export function bindNavigation() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            switchTab(item.getAttribute('data-tab'));
        });
    });

    /* Hash navigation desde el back button o links directos */
    window.addEventListener('hashchange', () => {
        const tab = window.location.hash.replace('#', '') || 'welcome';
        switchTab(tab);
    });

    document.addEventListener('click', (event) => {
        const retry = event.target.closest('[data-page-retry]');
        if (!retry) return;
        loadPage(retry.dataset.pageRetry);
    });
}

/* ── Exponer switchTab globalmente para los onclick inline de las páginas ── */
window.switchTab = switchTab;
