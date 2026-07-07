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

/** Tabs ya cargadas en el DOM. */
const pageCache = new Set();

/**
 * Activa una tab: actualiza nav, muestra el pane y carga su contenido si aún no está cacheado.
 * @param {string} tabId
 */
export async function switchTab(tabId) {
    /* ── Actualizar nav items ── */
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
        item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
    });

    /* ── Mostrar pane correcto ── */
    document.querySelectorAll('.tab-pane').forEach((pane) => {
        pane.classList.toggle('active', pane.id === tabId);
    });

    /* ── Actualizar hash sin disparar hashchange ── */
    if (window.location.hash !== `#${tabId}`) {
        history.replaceState(null, '', `#${tabId}`);
    }

    /* ── Cargar contenido de la página si no está cacheado ── */
    if (!pageCache.has(tabId)) {
        await loadPage(tabId);
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
        const res = await fetch(`pages/${tabId}.html`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        section.innerHTML = await res.text();
        pageCache.add(tabId);
        document.dispatchEvent(new CustomEvent('page:loaded', { detail: { tabId } }));
    } catch (err) {
        console.warn(`No se pudo cargar pages/${tabId}.html`, err);
        /* Si el HTML ya estaba preinyectado (fallback estático), marcar como cacheado */
        if (section.children.length > 0) {
            pageCache.add(tabId);
            document.dispatchEvent(new CustomEvent('page:loaded', { detail: { tabId } }));
        }
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
}

/* ── Exponer switchTab globalmente para los onclick inline de las páginas ── */
window.switchTab = switchTab;
