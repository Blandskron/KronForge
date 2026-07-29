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

async function writeClipboard(content) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
        return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Clipboard unavailable');
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
            if (target?.dataset.loadState && target.dataset.loadState !== 'ready') {
                showToast('El archivo todavía no está disponible');
                return;
            }
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
            document.body.append(anchor);
            anchor.click();
            anchor.remove();
            setTimeout(() => URL.revokeObjectURL(url), 0);
            showToast(`Descarga preparada: ${filename}`);
            return;
        }

        const copyButton = e.target.closest('[data-copy-target]');
        if (copyButton) {
            const target = document.getElementById(copyButton.dataset.copyTarget);
            if (target?.dataset.loadState && target.dataset.loadState !== 'ready') {
                showToast('El contenido todavía no está disponible');
                return;
            }
            const content = target?.dataset.rawMarkdown || target?.innerText;
            if (content) {
                try {
                    await writeClipboard(content);
                    showToast(copyButton.dataset.copyMessage || 'Markdown copiado');
                } catch {
                    showToast('No se pudo acceder al portapapeles');
                }
            }
            return;
        }
    });
}
