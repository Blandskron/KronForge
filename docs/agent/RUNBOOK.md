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
- `assets/css/`: diseño visual responsive modular (`base.css`, `layout.css`, `components.css`, `quality.css`, `responsive.css`).
- `assets/js/`: lógica en ES modules nativos (`app.js` orquestador, `navigation.js`, etc.).
- `pages/`: vistas HTML dinámicas de cada tab (`welcome.html`, `prompt.html`, etc.).

## Validación Operativa

Antes de publicar cambios:

1. Servir la raíz del repositorio por HTTP local.
2. Confirmar que `index.html` cargue correctamente y los recursos de `assets/` devuelvan `200` en consola.
3. Verificar que la pestaña del prompt cargue `prompts/agents-first-documentation-review.prompt.md`.
4. Verificar que la pestaña "Catálogo de Prompts" permita navegar a los prompts canónicos de varios dominios.
5. Verificar que el botón de copiar use el contenido visible del prompt activo.
6. Confirmar navegación por hash: `#prompt`, `#quality`, `#structure`, `#models`, `#example`, `#versioning`.

## Problemas Frecuentes

### El prompt no carga en navegador local con doble clic

Los navegadores suelen bloquear `fetch()` sobre archivos locales por políticas CORS.

Solución:

- Servir con HTTP local como se indica arriba.
- En GitHub Pages, `fetch()` funciona con rutas relativas.

### El sitio muestra contenido fallback

El fallback de `index.js` es secundario. Si aparece en GitHub Pages, revisa:

- Ruta del archivo Markdown.
- Mayúsculas/minúsculas del path.
- Que el archivo exista en el branch publicado.

### Enlaces internos rotos

Ejecuta la validación indicada en `docs/agent/TESTS.md` y corrige rutas relativas antes de cerrar.
