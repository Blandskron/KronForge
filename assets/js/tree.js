/**
 * tree.js — Árbol de archivos de la pestaña Estructura.
 * Llamado desde app.js al recibir el evento page:loaded para 'structure'.
 */

import { docsDatabase } from './config.js?v=3.0.0-r2';
import { setMarkdownContent } from './markdown.js?v=3.0.0-r2';

/** Enlaza los nodos del árbol de archivos con la previsualización lateral. */
export function bindTreeView() {
    /* ── Nodos de archivo ── */
    document.querySelectorAll('.tree-node.file').forEach((node) => {
        node.addEventListener('click', () => {
            document.querySelectorAll('.tree-node.file').forEach((n) => n.classList.remove('active'));
            node.classList.add('active');

            const fileData = docsDatabase[node.getAttribute('data-file')];
            if (!fileData) return;

            const title   = document.getElementById('file-title');
            const status  = document.getElementById('file-status');
            const desc    = document.getElementById('file-description');
            const preview = document.getElementById('file-code-preview');

            if (title)   title.innerText   = fileData.title;
            if (status)  status.innerText  = fileData.status;
            if (desc)    desc.innerText    = fileData.description;
            if (preview) {
                preview.dataset.sourceName = `${node.getAttribute('data-file').replace(/-md$/, '')}.md`;
                setMarkdownContent(preview, fileData.code);
            }
        });
    });

    /* ── Nodos de directorio: toggle expand/collapse ── */
    document.querySelectorAll('.tree-node.directory').forEach((dirNode) => {
        dirNode.addEventListener('click', () => {
            dirNode.classList.toggle('expanded');
            const sibling = dirNode.nextElementSibling;
            if (sibling?.classList.contains('tree-children')) {
                sibling.style.display = dirNode.classList.contains('expanded') ? 'flex' : 'none';
            }
        });
    });

    /* Seleccionar el primer archivo por defecto */
    document.querySelector('.tree-node.file')?.click();
}
