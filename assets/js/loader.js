/**
 * loader.js — Carga de archivos remotos vía fetch con fallback local.
 * Importado por: app.js, catalog.js y models.js.
 */

import { docsDatabase, fallbacks } from './config.js';
import { siteUrl } from './paths.js';
import { setMarkdownContent } from './markdown.js';

/**
 * Carga el contenido de un archivo remoto y lo escribe en un elemento del DOM.
 * Si el fetch falla, usa el fallback local correspondiente.
 *
 * @param {string} filePath - Ruta relativa del archivo a cargar (desde la raíz del sitio).
 * @param {string} elementId - ID del elemento donde se escribirá el contenido.
 * @param {string|null} fallbackKey - Clave en docsDatabase para usar como fallback (opcional).
 */
export async function loadFileContent(filePath, elementId, fallbackKey = null) {
    const target = document.getElementById(elementId);
    if (!target) return;

    let content = '';
    try {
        const response = await fetch(siteUrl(filePath, true));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        content = await response.text();
    } catch (error) {
        console.warn(`No se pudo cargar ${filePath}. Usando fallback local.`, error);

        if (fallbackKey && docsDatabase[fallbackKey]) {
            content = docsDatabase[fallbackKey].code;
        } else if (filePath.includes('prompt')) {
            content = fallbacks.prompt;
        } else if (filePath.includes('CLAUDE')) {
            content = fallbacks.claude;
        } else if (filePath.includes('GEMINI')) {
            content = fallbacks.gemini;
        } else if (filePath.includes('copilot')) {
            content = fallbacks.copilot;
        } else if (filePath.includes('usage-example')) {
            content = fallbacks.usage;
        } else if (filePath.includes('PROMPT_VERSIONING')) {
            content = fallbacks.versioning;
        }
    }

    target.dataset.sourceName = filePath.split('/').at(-1);
    setMarkdownContent(target, content);
}
