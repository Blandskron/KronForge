/**
 * loader.js — Carga fuentes Markdown canónicas vía fetch.
 * Importado por: app.js y models.js.
 */

import { siteUrl } from './paths.js?v=3.3.0';
import { setMarkdownContent } from './markdown.js?v=3.3.0';

const activeLoads = new WeakMap();

/**
 * Carga el contenido de un archivo remoto y lo escribe en un elemento del DOM.
 * Si el fetch falla, muestra un estado degradado y permite reintentar.
 *
 * @param {string} filePath - Ruta relativa del archivo a cargar (desde la raíz del sitio).
 * @param {string} elementId - ID del elemento donde se escribirá el contenido.
 * @param {{alternatives?: string[]}} options - Fuentes canónicas alternativas verificadas.
 */
export async function loadFileContent(filePath, elementId, options = {}) {
    const target = document.getElementById(elementId);
    if (!target) return;
    activeLoads.get(target)?.abort();
    const controller = new AbortController();
    activeLoads.set(target, controller);

    target.dataset.loadState = 'loading';
    target.dataset.loadError = 'false';
    target.dataset.rawMarkdown = '';
    target.classList.add('markdown-body');
    target.textContent = 'Cargando…';
    target.setAttribute('aria-busy', 'true');

    const candidates = [
        siteUrl(filePath, true),
        ...(options.alternatives || [])
    ];
    let content;
    let sourceUrl;
    let lastError;
    try {
        for (const candidate of candidates) {
            try {
                const response = await fetch(candidate, {signal: controller.signal});
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                content = await response.text();
                sourceUrl = candidate;
                break;
            } catch (error) {
                if (controller.signal.aborted) return;
                lastError = error;
            }
        }
        if (content === undefined) throw lastError || new Error('Sin fuente disponible');
        if (activeLoads.get(target) !== controller) return;

        target.dataset.sourceName = filePath.split('/').at(-1);
        setMarkdownContent(target, content, {baseUrl: sourceUrl});
    } catch (error) {
        if (controller.signal.aborted || activeLoads.get(target) !== controller) return;
        console.warn(`No se pudo cargar la fuente canónica ${filePath}.`, error);
        target.dataset.loadState = 'error';
        target.dataset.loadError = 'true';
        target.classList.remove('markdown-body');
        target.innerHTML = `
            <div class="asset-load-error" role="alert">
                <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                <strong>No se pudo cargar la fuente canónica.</strong>
                <span>Copiar y descargar permanecen bloqueados para evitar contenido incompleto.</span>
                <button class="btn btn-secondary" type="button" data-document-retry>
                    <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reintentar
                </button>
            </div>`;
        target.querySelector('[data-document-retry]')?.addEventListener('click', () =>
            loadFileContent(filePath, elementId, options));
    } finally {
        if (activeLoads.get(target) === controller) {
            target.removeAttribute('aria-busy');
            activeLoads.delete(target);
        }
    }
}
