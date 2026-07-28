# GitHub Copilot Instructions

Este repositorio contiene una biblioteca de ingeniería asistida por IA, documentación Markdown y una página estática sin build system.

## Contexto del Proyecto

- El catálogo principal vive en `library/`; el prompt maestro conserva `prompts/agents-first-documentation-review.prompt.md`.
- El README está orientado a humanos.
- `AGENTS.md` está orientado a agentes.
- La página en la raíz (`index.html`), las carpetas `assets/` (CSS/JS) y `pages/` (HTML) presentan el proyecto en GitHub Pages.

## Reglas de Generación

- No asumas frameworks, paquetes ni comandos que no existan en este repositorio.
- Mantén el prompt maestro universal y agnóstico.
- Organiza activos por dominio y mantén `library/catalog.json` alineado.
- Evita duplicar grandes bloques de contenido entre Markdown y JavaScript.
- Si actualizas un activo o reglas del estándar, actualiza también `docs/CHANGELOG.md`.
- Conserva HTML, CSS y JS como archivos estáticos simples.

## Validación

- Revisa enlaces Markdown internos.
- Comprueba que no haya rutas a archivos inexistentes.
- Mantén los bloques de código Markdown correctamente cerrados.
- No sugieras cambios en licencia, historial Git o estructura mayor sin aprobación humana.
