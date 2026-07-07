/**
 * theme.js — Toggle entre modo claro y oscuro.
 */

/** Enlaza el botón de cambio de tema. */
export function bindThemeToggle() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const icon = btn.querySelector('i');
        const span = btn.querySelector('span');

        if (isDark) {
            document.body.removeAttribute('data-theme');
            if (icon) icon.className = 'fa-solid fa-moon';
            if (span) span.innerText = 'Modo Oscuro';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            if (icon) icon.className = 'fa-solid fa-sun';
            if (span) span.innerText = 'Modo Claro';
        }
    });
}
