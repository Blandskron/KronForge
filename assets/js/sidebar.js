/**
 * sidebar.js — Control del sidebar: apertura, cierre y toggle desktop/móvil.
 * Importado por: navigation.js, app.js.
 */

/** Detecta si el layout es móvil (sidebar tipo drawer). */
export function isMobileLayout() {
    return window.matchMedia('(max-width: 820px)').matches;
}

function syncSidebarAccessibility() {
    const mobile = isMobileLayout();
    const open = mobile && document.body.classList.contains('sidebar-open');
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('mobile-menu-btn');
    const closeButton = document.getElementById('sidebar-close');
    const backdrop = document.getElementById('sidebar-backdrop');

    menuButton?.setAttribute('aria-expanded', String(open));
    sidebar?.setAttribute('aria-hidden', String(mobile && !open));
    if (sidebar) sidebar.inert = mobile && !open;
    backdrop?.setAttribute('aria-hidden', String(!open));

    if (closeButton) {
        const collapsed = document.body.classList.contains('sidebar-collapsed');
        const label = mobile
            ? 'Cerrar navegación'
            : collapsed ? 'Expandir navegación' : 'Colapsar navegación';
        closeButton.setAttribute('aria-label', label);
        closeButton.setAttribute('title', label);
    }
}

/** Abre el sidebar en móvil. */
export function openSidebar() {
    document.body.classList.remove('sidebar-collapsed');
    document.body.classList.add('sidebar-open');
    syncSidebarAccessibility();
    document.getElementById('sidebar-close')?.focus();
}

/** Cierra el sidebar en móvil. No afecta al estado colapsado en desktop. */
export function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const restoreFocus = isMobileLayout()
        && document.body.classList.contains('sidebar-open')
        && sidebar?.contains(document.activeElement);
    document.body.classList.remove('sidebar-open');
    syncSidebarAccessibility();
    if (restoreFocus) document.getElementById('mobile-menu-btn')?.focus();
}

/** Alterna entre sidebar expandido y colapsado en desktop. */
function toggleDesktopSidebar() {
    if (isMobileLayout()) {
        closeSidebar();
        return;
    }

    document.body.classList.toggle('sidebar-collapsed');
    syncSidebarAccessibility();
}

/** Enlaza todos los controles del sidebar. */
export function bindSidebar() {
    document.getElementById('mobile-menu-btn')?.addEventListener('click', openSidebar);
    document.getElementById('sidebar-close')?.addEventListener('click', toggleDesktopSidebar);
    document.getElementById('sidebar-backdrop')?.addEventListener('click', closeSidebar);
    syncSidebarAccessibility();

    /* Escape cierra el sidebar en móvil */
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });

    /* En resize, limpiar estado inconsistente */
    window.addEventListener('resize', () => {
        if (isMobileLayout()) {
            document.body.classList.remove('sidebar-collapsed');
        } else {
            closeSidebar();
        }
        syncSidebarAccessibility();
    });
}
