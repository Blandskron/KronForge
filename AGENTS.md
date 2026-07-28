# Instrucciones de Agente (AGENTS.md)

Este repositorio mantiene una biblioteca de ingeniería de software asistida por IA, organizada por dominios, más una página estática para navegar y copiar sus activos.

El producto real es el conocimiento reutilizable: prompts, skills, templates, checklists, playbooks, patrones, anti-patrones y referencias. El repositorio completo actúa como ejemplo vivo del estándar.

## Propósito

Entregar capacidades reutilizables con adopción inmediata: **Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar**. Los activos deben funcionar sin asumir tecnologías ni proveedores.

El proyecto puede presentarse como framework documental liviano, nunca como metodología pesada o runtime. Debe mantenerse universal, simple de adoptar y suficientemente profesional para servir como modelo.

## Stack Detectado

- **Tipo:** repositorio de documentación, prompts y sitio estático.
- **Lenguajes:** Markdown, HTML, CSS y JavaScript vanilla.
- **Build:** no hay build system; GitHub Pages puede servir los archivos raíz directamente.
- **Control de versiones:** Git.

## Lectura Prioritaria

1. [README.md](README.md)
2. [prompts/agents-first-documentation-review.prompt.md](prompts/agents-first-documentation-review.prompt.md)
3. [library/README.md](library/README.md)
4. [docs/REPOSITORY_EVOLUTION.md](docs/REPOSITORY_EVOLUTION.md)
5. [docs/AI_ENGINEERING_FRAMEWORK_STRATEGY.md](docs/AI_ENGINEERING_FRAMEWORK_STRATEGY.md)
6. [docs/ROADMAP.md](docs/ROADMAP.md)
7. [docs/CONTRIBUTING_ASSETS.md](docs/CONTRIBUTING_ASSETS.md)
8. [PROMPT_VERSIONING.md](PROMPT_VERSIONING.md)
9. [docs/agent/PERMISSIONS.md](docs/agent/PERMISSIONS.md)
10. [docs/agent/TESTS.md](docs/agent/TESTS.md)
11. [docs/agent/RUNBOOK.md](docs/agent/RUNBOOK.md)

## Superficie Editable

Puedes modificar:

- `prompts/agents-first-documentation-review.prompt.md`
- `library/**`
- `README.md`
- `docs/CHANGELOG.md`
- `examples/usage-example.md`
- `docs/**/*.md`
- `index.html`, `assets/**`, `pages/**`
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
- Mantén el portal como presentación de `library/catalog.json` y Markdown canónico, no como segunda fuente de verdad.
- El schema v2 del catálogo requiere título, resumen, dificultad, dominio, tipo, estado, tags y ruta por activo.
- Toda mejora relevante del prompt o la documentación debe registrarse en `docs/CHANGELOG.md`.
- No agregues referencias a archivos de instrucciones específicos de una plataforma si esos archivos no existen en el repositorio.
- Este repositorio es ejemplo profesional del estándar: conserva completo el set de `docs/agent/`, incluso cuando un archivo documente que una dimensión no aplica.
- Los prompts ejecutables deben obligar al agente a leer antes de modificar, prohibir comandos inventados, exigir plan antes de cambios y no relajar pruebas o seguridad para aprobar validaciones.

## Validación

Antes de cerrar una tarea:

1. Verifica enlaces internos de Markdown.
2. Comprueba que los bloques de código Markdown estén cerrados.
3. Revisa que el sitio `index.html` pueda cargar el prompt y los documentos enlazados.
4. Confirma que `docs/CHANGELOG.md` refleje cambios semánticos del prompt.
5. Revisa que no se hayan introducido referencias a archivos inexistentes.

## Definición de Terminado

Una tarea está terminada cuando:

- El prompt sigue siendo copiable y universal.
- La documentación del repo es coherente consigo misma.
- La página estática presenta el proyecto y permite copiar el prompt.
- Los cambios están registrados en `docs/CHANGELOG.md` cuando corresponde.
- Las validaciones documentales fueron ejecutadas o se explica por qué no aplican.
