/**
 * loader.js — Carga de archivos remotos vía fetch con fallback local.
 * Importado por: app.js, navigation.js, quality.js, models.js.
 */

import { docsDatabase, fallbacks } from './config.js';

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

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        target.innerText = await response.text();
    } catch (error) {
        console.warn(`No se pudo cargar ${filePath}. Usando fallback local.`, error);

        if (fallbackKey && docsDatabase[fallbackKey]) {
            target.innerText = docsDatabase[fallbackKey].code;
        } else if (filePath.includes('prompt')) {
            target.innerText = fallbacks.prompt;
        } else if (filePath.includes('CLAUDE')) {
            target.innerText = fallbacks.claude;
        } else if (filePath.includes('GEMINI')) {
            target.innerText = fallbacks.gemini;
        } else if (filePath.includes('copilot')) {
            target.innerText = fallbacks.copilot;
        } else if (filePath.includes('usage-example')) {
            target.innerText = fallbacks.usage;
        } else if (filePath.includes('PROMPT_VERSIONING')) {
            target.innerText = fallbacks.versioning;
        }
    }
}
