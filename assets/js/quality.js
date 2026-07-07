/**
 * quality.js — Pestaña de Prompts de Validación Interna.
 * Llamado desde app.js al recibir el evento page:loaded para 'quality'.
 */

import { loadFileContent } from './loader.js';

/** Enlaza la lista lateral de prompts de calidad con el visor. */
export function bindQualityTab() {
    const items = document.querySelectorAll('.quality-item');
    if (!items.length) return;

    /* Cargar el primer prompt por defecto */
    const first = items[0];
    if (first) {
        loadFileContent(first.getAttribute('data-prompt'), 'quality-prompt-display');
    }

    items.forEach((item) => {
        item.addEventListener('click', () => {
            items.forEach((i) => i.classList.remove('active'));
            item.classList.add('active');
            loadFileContent(item.getAttribute('data-prompt'), 'quality-prompt-display');
        });
    });
}
