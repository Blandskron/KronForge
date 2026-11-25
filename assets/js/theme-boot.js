(() => {
    let choice = 'dark';
    try {
        const stored = localStorage.getItem('kronforge-theme') ?? localStorage.getItem('agents-first-theme');
        if (['light', 'dark', 'system'].includes(stored)) choice = stored;
    } catch {
        // The site still applies a theme when storage is unavailable.
    }
    const root = document.documentElement;
    root.dataset.themeChoice = choice;
    root.dataset.theme = choice === 'system'
        ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : choice;
})();
