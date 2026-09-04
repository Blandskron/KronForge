/**
 * models.js — Pestaña de instrucciones por modelo de IA.
 * Llamado desde app.js al recibir el evento page:loaded para 'models'.
 */

import { loadFileContent } from './loader.js?v=3.2.0';

const MODEL_CONFIG = {
    claude: {
        intro: "Recomendaciones para usar el prompt maestro con Claude sin acoplarlo a un stack específico.",
        path:  "CLAUDE.md",
        file:  "CLAUDE.md"
    },
    gemini: {
        intro: "Recomendaciones para usar el prompt maestro con Gemini aprovechando lectura amplia y evidencia local.",
        path:  "GEMINI.md",
        file:  "GEMINI.md"
    },
    copilot: {
        intro: "Instrucciones de contexto para GitHub Copilot dentro de este repositorio.",
        path:  ".github/copilot-instructions.md",
        file:  ".github/copilot-instructions.md",
        alternatives: [
            "https://raw.githubusercontent.com/Blandskron/agents-first-repo-docs/main/.github/copilot-instructions.md"
        ]
    }
};

/** Enlaza los botones de selección de modelo con el visor de instrucciones. */
export function bindModelTabs() {
    document.querySelectorAll('.tabs-control .tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tabs-control .tab-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const config = MODEL_CONFIG[btn.getAttribute('data-model')];
            if (!config) return;

            const intro = document.getElementById('model-intro-text');
            const path  = document.getElementById('model-file-path');
            const download = document.querySelector('[data-download-target="model-code-display"]');

            if (intro) intro.innerText = config.intro;
            if (path)  path.innerText  = config.path;
            if (download) download.dataset.downloadName = config.file.split('/').at(-1);

            loadFileContent(config.file, 'model-code-display', {alternatives: config.alternatives});
        });
    });

    /* Cargar el primer modelo (Claude) por defecto */
    loadFileContent('CLAUDE.md', 'model-code-display');
}
