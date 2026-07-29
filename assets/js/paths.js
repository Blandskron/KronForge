/**
 * Rutas absolutas del sitio calculadas desde este módulo.
 *
 * Usar import.meta.url evita que los fetch dependan de la URL visible:
 * funciona igual en localhost y bajo /agents-first-repo-docs/ en GitHub Pages.
 */
export const SITE_ROOT = new URL('../../', import.meta.url);
export const SITE_VERSION = '3.0.0';

export function siteUrl(relativePath, versioned = false) {
    const url = new URL(relativePath, SITE_ROOT);
    if (versioned) url.searchParams.set('v', SITE_VERSION);
    return url.href;
}
