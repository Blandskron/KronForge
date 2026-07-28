/**
 * Convierte cada fragmento pages/*.html en una entrada navegable.
 *
 * Al abrir el archivo directamente, redirige al shell y conserva la sección
 * en el hash. Cuando el fragmento se inyecta con innerHTML, el navegador no
 * ejecuta este script y el contenido se muestra normalmente dentro del portal.
 */
const page = window.location.pathname.split('/').at(-1)?.replace(/\.html$/, '') || 'welcome';
const shell = new URL('../../index.html', import.meta.url);
shell.hash = page;
window.location.replace(shell.href);
