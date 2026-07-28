/**
 * copy.js — Toast de notificación y botones de copia al portapapeles.
 *
 * Usa delegación de eventos desde document para que funcione aunque
 * los botones estén dentro de páginas cargadas dinámicamente.
 */

/** Muestra el toast de confirmación. */
export function showToast(message = "Copiado al portapapeles") {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.querySelector('span').innerText = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
}

/**
 * Enlaza todos los botones de copia usando event delegation desde document.
 * Se llama una sola vez en el init; funciona para botones en páginas dinámicas.
 */
export function bindCopyButtons() {
    document.addEventListener('click', async (e) => {
        const downloadButton = e.target.closest('[data-download-target]');
        if (downloadButton) {
            const target = document.getElementById(downloadButton.dataset.downloadTarget);
            const content = target?.dataset.rawMarkdown || target?.innerText;
            if (!content) return;
            const filename = downloadButton.dataset.downloadName
                || target.dataset.sourceName
                || 'documento.md';
            const blob = new Blob([content], {type: 'text/markdown;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            anchor.click();
            URL.revokeObjectURL(url);
            showToast(`Descarga preparada: ${filename}`);
            return;
        }

        const copyButton = e.target.closest('[data-copy-target]');
        if (copyButton) {
            const target = document.getElementById(copyButton.dataset.copyTarget);
            const content = target?.dataset.rawMarkdown || target?.innerText;
            if (content) {
                await navigator.clipboard.writeText(content);
                showToast(copyButton.dataset.copyMessage || 'Markdown copiado');
            }
            return;
        }

        /* Botón "Copiar Prompt" del prompt principal */
        if (e.target.closest('.copy-prompt-trigger')) {
            const text = document.getElementById('prompt-code-display')?.innerText;
            if (text) {
                await navigator.clipboard.writeText(text);
                showToast('Prompt copiado correctamente');
            }
            return;
        }

        /* Botón "Copiar Prompt" de la pestaña de calidad */
        if (e.target.closest('#copy-quality-prompt')) {
            const text = document.getElementById('quality-prompt-display')?.innerText;
            if (text && text !== 'Selecciona un prompt para verlo...') {
                await navigator.clipboard.writeText(text);
                showToast('Prompt de calidad copiado');
            }
            return;
        }

        /* Botón "Copiar" del visor de modelos */
        if (e.target.closest('.copy-model-content')) {
            const text = document.getElementById('model-code-display')?.innerText;
            if (text) {
                await navigator.clipboard.writeText(text);
                showToast('Plantilla copiada');
            }
        }
    });
}
