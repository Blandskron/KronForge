# Runbook Operativo

Este repositorio no tiene backend, base de datos ni servicios persistentes. Su operación consiste en mantener un sitio estático para GitHub Pages y una biblioteca de activos Markdown organizada por dominios.

## Operación Local

Para revisar el sitio como lo servirá GitHub Pages:

```powershell
python -m http.server 8026 --bind 127.0.0.1
```

Luego abre:

```txt
http://127.0.0.1:8026/index.html
```

> [!NOTE]
> Si `python` no está en `PATH`, usa cualquier servidor estático equivalente. No hay build ni instalación de dependencias.

## Archivos de Entrada del Sitio

- `index.html`: estructura de la página (shell).
- `assets/css/`: diseño visual responsive modular (`base.css`, `layout.css`, `components.css`, `portal.css`, `responsive.css`).
- `assets/js/`: lógica en ES modules nativos (`app.js`, `navigation.js`, `catalog.js`, etc.).
- `pages/`: vistas HTML dinámicas de cada tab (`welcome.html`, `prompt.html`, etc.).

## Validación Operativa

Antes de publicar cambios:

1. Servir la raíz del repositorio por HTTP local.
2. Confirmar que `index.html` cargue correctamente y los recursos de `assets/` devuelvan `200` en consola.
3. Verificar que la pestaña del prompt cargue `prompts/agents-first-documentation-review.prompt.md`.
4. Verificar Quick Start, Dominios, Biblioteca, Roadmap, Contribución y Changelog.
5. Buscar un activo, filtrar por tipo y dominio, abrirlo y copiar su contenido.
6. Confirmar que breadcrumbs, modo oscuro y navegación móvil funcionen.
7. Verificar que los botones de copiar usen el contenido visible.
8. Confirmar navegación por hash: `#welcome`, `#quickstart`, `#domains`, `#library`, `#prompt`, `#roadmap`, `#contributing`, `#example`, `#changelog`, `#versioning`.

## Problemas Frecuentes

### El prompt no carga en navegador local con doble clic

Los navegadores suelen bloquear `fetch()` sobre archivos locales por políticas CORS.

Solución:

- Servir con HTTP local como se indica arriba.
- En GitHub Pages, `fetch()` funciona con rutas relativas.
- El portal resuelve páginas, documentos y catálogo desde la URL del módulo `assets/js/paths.js`; no depende del directorio de la URL visible.
- Los archivos `pages/*.html` son fragmentos canónicos: al abrirlos directamente redirigen a `index.html#seccion` para conservar navegación, estilos y contexto.
- Las rutas desconocidas pasan por `404.html`; las secciones conocidas se recuperan como navegación por hash.

### El sitio muestra contenido fallback

El fallback de `assets/js/config.js` es secundario. Si aparece en GitHub Pages, revisa:

- Ruta del archivo Markdown.
- Mayúsculas/minúsculas del path.
- Que el archivo exista en el branch publicado.

### Enlaces internos rotos

Ejecuta la validación indicada en `docs/agent/TESTS.md` y corrige rutas relativas antes de cerrar.
