# Runbook Operativo

Este repositorio no tiene backend, base de datos ni servicios persistentes. Su operación consiste en mantener un sitio estático para GitHub Pages y una biblioteca de activos Markdown organizada por dominios.

## Operación Local

La verificación automatizada no necesita iniciar un proceso persistente:

```powershell
npm run quality
```

Para una revisión visual interactiva, sirve la raíz como la publicará GitHub Pages:

```powershell
python -m http.server 8026 --bind 127.0.0.1
```

Luego abre:

```txt
http://127.0.0.1:8026/index.html
```

> [!NOTE]
> Si `python` no está en `PATH`, usa cualquier servidor estático equivalente. No hay build de producción ni instalación de dependencias.

## Archivos de Entrada del Sitio

- `index.html`: estructura de la página (shell).
- `.nojekyll`: obliga a GitHub Pages a publicar Markdown y recursos estáticos sin transformarlos.
- `assets/css/`: diseño visual responsive modular (`base.css`, `layout.css`, `components.css`, `portal.css`, `responsive.css`).
- `assets/js/`: lógica en ES modules nativos (`app.js`, `navigation.js`, `catalog.js`, etc.).
- `pages/`: vistas HTML dinámicas de cada tab (`welcome.html`, `prompt.html`, etc.).
- `library/catalog.json`: índice v3 y rutas de aprendizaje consumidos en ejecución.
- `library/schema/catalog-v3.schema.json`: contrato verificable del catálogo.

## Validación Operativa

Antes de publicar cambios:

1. Ejecutar `npm run quality`.
2. Servir la raíz del repositorio por HTTP local para la revisión visual.
3. Confirmar que `index.html` cargue y los recursos de `assets/` devuelvan `200` sin errores de consola.
4. Verificar que la pestaña del prompt cargue `prompts/agents-first-documentation-review.prompt.md`.
5. Verificar Inicio, Quick Start, Dominios, Biblioteca, Aprendizaje, Roadmap, Contribución y Changelog.
6. Buscar sin depender de tildes o mayúsculas; combinar filtros, orden y tags.
7. Abrir un activo, navegar sus relaciones y compartir su URL `#library/<asset-id>`.
8. Confirmar que Atrás/Adelante restablezcan pestaña y activo.
9. Confirmar que el Markdown se renderice como contenido editorial y que el front matter no sea visible.
10. Verificar que Copiar y Descargar conserven el Markdown original, no el HTML renderizado ni un mensaje de error.
11. Confirmar breadcrumbs, modo lectura, modo oscuro, foco visible y navegación móvil/teclado.
12. Confirmar que `.nojekyll` exista; sin este marcador, GitHub Pages puede transformar los activos Markdown con front matter y romper sus rutas `.md`.

## Problemas Frecuentes

### El prompt no carga en navegador local con doble clic

Los navegadores suelen bloquear `fetch()` sobre archivos locales por políticas CORS.

Solución:

- Servir con HTTP local como se indica arriba.
- En GitHub Pages, `fetch()` funciona con rutas relativas.
- El portal resuelve páginas, documentos y catálogo desde la URL del módulo `assets/js/paths.js`; no depende del directorio de la URL visible.
- Los archivos `pages/*.html` son fragmentos canónicos: al abrirlos directamente redirigen a `index.html#seccion` para conservar navegación, estilos y contexto.
- Las rutas desconocidas pasan por `404.html`; las secciones conocidas se recuperan como navegación por hash.

### El sitio no puede cargar una fuente canónica

El portal muestra un error visible, bloquea copia y descarga, y ofrece reintentar. Revisa:

- la ruta exacta y sus mayúsculas/minúsculas;
- que el Markdown exista en el branch publicado;
- que la respuesta sea `200` y no una página HTML de error;
- para Copilot, que la fuente raw verificada en `assets/js/models.js` siga disponible, porque GitHub Pages no publica `.github/`.

### Enlaces internos rotos

Ejecuta la validación indicada en `docs/agent/TESTS.md` y corrige rutas relativas antes de cerrar.
