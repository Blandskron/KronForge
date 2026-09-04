# Instrucciones de Agente (AGENTS.md)

Este repositorio mantiene Agents First Framework v3: una plataforma documental abierta de AI Engineering, organizada por capas y dominios, más un portal estático para descubrir, relacionar, copiar y descargar sus activos.

El producto real es el conocimiento reutilizable: prompts, skills, hooks, subagentes, integraciones MCP, templates, checklists, playbooks, decisiones, patrones, anti-patrones, runbooks, casos y referencias. El repositorio completo actúa como ejemplo vivo del estándar.

## Propósito

Entregar capacidades reutilizables con adopción inmediata: **Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar**. Los activos deben funcionar sin asumir tecnologías ni proveedores.

El proyecto puede presentarse como plataforma o framework documental liviano, nunca como metodología pesada o runtime. Debe mantenerse universal, simple de adoptar y suficientemente profesional para servir como modelo.

## Stack Detectado

- **Tipo:** repositorio de documentación, prompts y sitio estático.
- **Lenguajes:** Markdown, HTML, CSS y JavaScript vanilla.
- **Producción:** no hay build system; GitHub Pages sirve los archivos raíz directamente.
- **Calidad:** scripts Node.js sin dependencias externas para validar, probar y puntuar el repositorio.
- **Control de versiones:** Git.

## Lectura Prioritaria

1. [README.md](README.md)
2. [prompts/agents-first-documentation-review.prompt.md](prompts/agents-first-documentation-review.prompt.md)
3. [library/README.md](library/README.md)
4. [docs/architecture/FRAMEWORK_ARCHITECTURE.md](docs/architecture/FRAMEWORK_ARCHITECTURE.md)
5. [docs/adr/README.md](docs/adr/README.md)
6. [docs/ROADMAP.md](docs/ROADMAP.md)
7. [CONTRIBUTING.md](CONTRIBUTING.md)
8. [docs/CONTRIBUTING_ASSETS.md](docs/CONTRIBUTING_ASSETS.md)
9. [docs/QUALITY_GATES.md](docs/QUALITY_GATES.md)
10. [docs/AGENT_COMPATIBILITY.md](docs/AGENT_COMPATIBILITY.md)
11. [docs/SPEC_FRESHNESS.md](docs/SPEC_FRESHNESS.md)
12. [PROMPT_VERSIONING.md](PROMPT_VERSIONING.md)
13. [docs/agent/PERMISSIONS.md](docs/agent/PERMISSIONS.md)
14. [docs/agent/TESTS.md](docs/agent/TESTS.md)
15. [docs/agent/RUNBOOK.md](docs/agent/RUNBOOK.md)

## Superficie Editable

Puedes modificar:

- `prompts/agents-first-documentation-review.prompt.md`
- `library/**`
- `README.md`
- `docs/CHANGELOG.md`
- `examples/usage-example.md`
- `docs/**/*.md`
- `index.html`, `assets/**`, `pages/**`
- `scripts/**`, `tests/**`, `package.json`
- `skills/**` y `llms.txt` únicamente mediante `npm run build`; nunca a mano
- `.github/workflows/**`, `.github/ISSUE_TEMPLATE/**`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CODEOWNERS`
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `GOVERNANCE.md`, `MAINTAINERS.md`
- `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`

## Requiere Aprobación Humana

Pide aprobación antes de:

- Cambiar o eliminar `LICENSE`.
- Eliminar el prompt principal.
- Hacer cambios incompatibles en la estructura esperada por el prompt.
- Reescribir historial Git, tags o ramas remotas.
- Eliminar carpetas completas como `prompts/`, `library/`, `docs/` o `examples/`.

## Reglas Operativas

- El prompt principal debe seguir siendo universal y agnóstico al stack.
- Todos los activos de `library/` deben ser universales por defecto, declarar sus límites y usar detalles de stack solo cuando el objetivo lo requiera.
- El mensaje público debe mantener claro que sirve para cualquier agente moderno y cualquier tecnología.
- El flujo recomendado debe ser Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar.
- No documentes comandos que no existan en este repositorio.
- Mantén el sitio estático sin dependencias de build.
- Evita duplicar contenido extenso entre Markdown y JavaScript; si hay fallback, debe ser claramente secundario.
- Organiza activos por dominio; no restaures carpetas planas por tipo.
- No crees subcarpetas o activos de relleno.
- Mantén `library/catalog.json` y los índices de dominio alineados con los archivos canónicos.
- `skills/` y `llms.txt` son proyecciones generadas. Edita la fuente canónica en `library/` y regenera; no modifiques el destino.
- Toda skill debe cumplir el formato abierto: `name` en minúsculas igual al directorio, `description` que explique qué hace y cuándo usarla, cuerpo bajo 500 líneas.
- Ninguna skill puede obtener instrucciones desde una URL externa en ejecución. El contenido necesario se empaqueta o se versiona.
- Todo activo que afirme algo sobre una fuente externa declara `specRefs` con `spec`, `url` y `verified`. Actualizar `verified` sin abrir la fuente invalida el control.
- Al re-verificar una referencia, corrige el activo si la fuente cambió, clasifica el cambio con SemVer y regístralo en el changelog.
- Mantén el portal como presentación de `library/catalog.json` y Markdown canónico, no como segunda fuente de verdad.
- El schema v3 del catálogo requiere metadatos de identidad, clasificación, compatibilidad, relaciones, contrato, mantenimiento y ruta por activo.
- Las relaciones y rutas de aprendizaje solo pueden referenciar IDs existentes.
- Registra decisiones arquitectónicas duraderas como ADR en `docs/adr/`.
- No eleves el AI Repository Score con archivos o metadatos de relleno.
- Toda mejora relevante del prompt o la documentación debe registrarse en `docs/CHANGELOG.md`.
- No agregues referencias a archivos de instrucciones específicos de una plataforma si esos archivos no existen en el repositorio.
- Este repositorio es ejemplo profesional del estándar: conserva completo el set de `docs/agent/`, incluso cuando un archivo documente que una dimensión no aplica.
- Los prompts ejecutables deben obligar al agente a leer antes de modificar, prohibir comandos inventados, exigir plan antes de cambios y no relajar pruebas o seguridad para aprobar validaciones.

## Validación

Antes de cerrar una tarea ejecuta `npm run quality`, o documenta con precisión por qué un control no aplica. Esa puerta comprueba:

1. catálogo, schema, front matter, relaciones e índices;
2. frescura de referencias externas declaradas en `specRefs`;
3. conformidad de las skills con el formato abierto y proyecciones `skills/` y `llms.txt` al día;
4. enlaces, anclas, cercas Markdown y patrones de secretos;
5. sintaxis JavaScript, navegación y recursos del portal;
6. pruebas unitarias y smoke test bajo el subdirectorio de GitHub Pages;
7. AI Repository Score y paridad de versión/roadmap.

Además, confirma que `docs/CHANGELOG.md` refleje los cambios semánticos.

## Definición de Terminado

Una tarea está terminada cuando:

- El prompt sigue siendo copiable y universal.
- La documentación del repo es coherente consigo misma.
- La página estática presenta el proyecto y permite copiar el prompt.
- Las URLs directas, copia y descarga conservan el activo Markdown canónico.
- Catálogo, schema, índices, proyección de skills y portal permanecen alineados.
- Los cambios están registrados en `docs/CHANGELOG.md` cuando corresponde.
- `npm run quality` termina sin errores o se explica por qué un control no pudo ejecutarse.
