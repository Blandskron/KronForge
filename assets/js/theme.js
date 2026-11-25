/** Keep the saved theme and the system preference in sync. */
export function bindThemeToggle() {
    const root = document.documentElement;
    const select = document.getElementById('theme-toggle-btn');
    if (!select) return;
    const preference = matchMedia('(prefers-color-scheme: dark)');
    select.value = root.dataset.themeChoice || 'dark';
    const apply = () => {
        root.dataset.theme = select.value === 'system'
            ? (preference.matches ? 'dark' : 'light')
            : select.value;
        root.dataset.themeChoice = select.value;
    };
    select.addEventListener('change', () => {
        apply();
        try { localStorage.setItem('kronforge-theme', select.value); } catch { /* Storage is optional. */ }
    });
    preference.addEventListener('change', apply);
    apply();
}
