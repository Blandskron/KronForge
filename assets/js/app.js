/**
 * app.js — Orquestador principal de la aplicación.
 * Inicializa todos los componentes al cargar el DOM y reacciona a la carga lazy de páginas.
 */

import { bindSidebar } from './sidebar.js';
import { bindNavigation, switchTab } from './navigation.js';
import { bindCopyButtons } from './copy.js';
import { bindThemeToggle } from './theme.js';
import { loadFileContent } from './loader.js';

// Módulos inicializados bajo demanda (lazy-loaded pages)
import { bindQualityTab } from './quality.js';
import { bindTreeView } from './tree.js';
import { bindModelTabs } from './models.js';

// Escuchar evento personalizado de navegación lazy
document.addEventListener('page:loaded', (event) => {
    const { tabId } = event.detail;
    
    switch (tabId) {
        case 'prompt':
            loadFileContent('prompts/agents-first-documentation-review.prompt.md', 'prompt-code-display');
            break;
        case 'quality':
            bindQualityTab();
            break;
        case 'structure':
            bindTreeView();
            break;
        case 'models':
            bindModelTabs();
            break;
        case 'example':
            loadFileContent('examples/usage-example.md', 'example-markdown-content');
            break;
        case 'versioning':
            loadFileContent('PROMPT_VERSIONING.md', 'versioning-markdown-content');
            break;
    }
});

// Inicialización general al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
    bindSidebar();
    bindNavigation();
    bindCopyButtons();
    bindThemeToggle();

    // Determinar tab inicial por hash (o default a welcome)
    const initialTab = window.location.hash.replace('#', '') || 'welcome';
    switchTab(initialTab);
});
