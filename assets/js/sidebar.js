/**
 * sidebar.js — Control del sidebar: apertura, cierre y toggle desktop/móvil.
 * Importado por: navigation.js, app.js.
 */

/** Detecta si el layout es móvil (sidebar tipo drawer). */
export function isMobileLayout() {
    return window.matchMedia('(max-width: 820px)').matches;
}

/** Abre el sidebar en móvil. */
export function openSidebar() {
    document.body.classList.remove('sidebar-collapsed');
    document.body.classList.add('sidebar-open');
}

/** Cierra el sidebar en móvil. No afecta al estado colapsado en desktop. */
export function closeSidebar() {
    document.body.classList.remove('sidebar-open');
}

/** Alterna entre sidebar expandido y colapsado en desktop. */
function toggleDesktopSidebar() {
    if (isMobileLayout()) {
        closeSidebar();
        return;
    }

    document.body.classList.toggle('sidebar-collapsed');
    const collapsed = document.body.classList.contains('sidebar-collapsed');

    const btn = document.getElementById('sidebar-close');
    if (btn) {
        const label = collapsed ? 'Expandir navegación' : 'Colapsar navegación';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
    }
}

/** Enlaza todos los controles del sidebar. */
export function bindSidebar() {
    document.getElementById('mobile-menu-btn')?.addEventListener('click', openSidebar);
    document.getElementById('sidebar-close')?.addEventListener('click', toggleDesktopSidebar);
    document.getElementById('sidebar-backdrop')?.addEventListener('click', closeSidebar);

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
    });
}
