/**
 * app.js — Orquestador principal de la aplicación.
 * Inicializa todos los componentes al cargar el DOM y reacciona a la carga lazy de páginas.
 */

import { bindSidebar } from './sidebar.js?v=3.5.0';
import { bindNavigation, switchTab } from './navigation.js?v=3.5.0';
import { bindCopyButtons } from './copy.js?v=3.5.0';
import { bindThemeToggle } from './theme.js?v=3.5.0';
import { loadFileContent } from './loader.js?v=3.5.0';
import {
    bindCatalogShell,
    renderDomains,
    renderLearningPaths,
    renderLibrary,
    syncHomeStats
} from './catalog-v3.js?v=3.5.0';
import { parsePortalHash } from './catalog-utils.js?v=3.5.0';

// Módulos inicializados bajo demanda (lazy-loaded pages)
import { bindTreeView } from './tree.js?v=3.5.0';
import { bindModelTabs } from './models.js?v=3.5.0';
import { bindAssuranceDashboard } from './dashboard.js?v=3.5.0';

// Escuchar evento personalizado de navegación lazy
document.addEventListener('page:loaded', (event) => {
    const { tabId } = event.detail;
    
    switch (tabId) {
        case 'prompt':
            loadFileContent('prompts/agents-first-documentation-review.prompt.md', 'prompt-code-display');
            break;
        case 'welcome':
            syncHomeStats();
            break;
        case 'quickstart':
            bindAssuranceDashboard();
            break;
        case 'domains':
            renderDomains();
            break;
        case 'library':
            renderLibrary();
            break;
        case 'learning':
            renderLearningPaths();
            break;
        case 'roadmap':
            loadFileContent('docs/ROADMAP.md', 'roadmap-content');
            break;
        case 'contributing':
            loadFileContent('docs/CONTRIBUTING_ASSETS.md', 'contributing-content');
            break;
        case 'changelog':
            loadFileContent('docs/CHANGELOG.md', 'changelog-content');
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
    document.querySelector('.skip-link')?.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('main-content')?.focus();
    });
    bindCatalogShell();
    bindSidebar();
    bindNavigation();
    bindCopyButtons();
    bindThemeToggle();

    // Determinar tab inicial por hash (o default a welcome)
    const initialRoute = parsePortalHash(window.location.hash);
    switchTab(initialRoute.routeTab, {
        assetId: initialRoute.assetId,
        filters: initialRoute.filters,
        historyMode: 'none'
    });
});
