# Instrucciones de Agente (AGENTS.md)

Este repositorio mantiene prompts profesionales para documentar, auditar y validar repositorios de software con agentes de IA, más una página estática para navegar y copiarlos.

El producto real son los prompts. El repositorio completo actúa como ejemplo vivo del resultado esperado: documentación clara para humanos, rutas operativas para agentes y reglas de seguridad verificables.

## Propósito

Entregar un estándar reutilizable de adopción inmediata: **Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar**. El usuario copia el prompt principal, lo entrega a su agente de IA y ese agente audita, limpia y reconstruye la documentación del repositorio objetivo sin asumir tecnologías.

Este repo no debe presentarse como framework ni metodología pesada. Debe mantenerse como una herramienta universal, simple de adoptar y suficientemente profesional para servir como modelo.

## Stack Detectado

- **Tipo:** repositorio de documentación, prompts y sitio estático.
- **Lenguajes:** Markdown, HTML, CSS y JavaScript vanilla.
- **Build:** no hay build system; GitHub Pages puede servir los archivos raíz directamente.
- **Control de versiones:** Git.

## Lectura Prioritaria

1. [README.md](README.md)
2. [prompts/agents-first-documentation-review.prompt.md](prompts/agents-first-documentation-review.prompt.md)
3. [prompts/quality/README.md](prompts/quality/README.md)
4. [PROMPT_VERSIONING.md](PROMPT_VERSIONING.md)
5. [examples/usage-example.md](examples/usage-example.md)
6. [docs/agent/PERMISSIONS.md](docs/agent/PERMISSIONS.md)
7. [docs/agent/TESTS.md](docs/agent/TESTS.md)
8. [docs/agent/RUNBOOK.md](docs/agent/RUNBOOK.md)
9. [docs/skills/README.md](docs/skills/README.md)

## Superficie Editable

Puedes modificar:

- `prompts/agents-first-documentation-review.prompt.md`
- `prompts/quality/**`
- `README.md`
- `docs/CHANGELOG.md`
- `examples/usage-example.md`
- `docs/**/*.md`
- `skills/**/*.md`
- `index.html`, `assets/**`, `pages/**`
- `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`

## Requiere Aprobación Humana

Pide aprobación antes de:

- Cambiar o eliminar `LICENSE`.
- Eliminar el prompt principal.
- Hacer cambios incompatibles en la estructura esperada por el prompt.
- Reescribir historial Git, tags o ramas remotas.
- Eliminar carpetas completas como `prompts/`, `docs/`, `examples/` o `skills/`.

## Reglas Operativas

- El prompt principal debe seguir siendo universal y agnóstico al stack.
- Los prompts de la biblioteca `prompts/quality/` deben ser universales y agnósticos al stack.
- El mensaje público debe mantener claro que sirve para cualquier agente moderno y cualquier tecnología.
- El flujo recomendado debe ser Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar.
- No documentes comandos que no existan en este repositorio.
- Mantén el sitio estático sin dependencias de build.
- Evita duplicar contenido extenso entre Markdown y JavaScript; si hay fallback, debe ser claramente secundario.
- Toda mejora relevante del prompt o la documentación debe registrarse en `docs/CHANGELOG.md`.
- No agregues referencias a archivos de instrucciones específicos de una plataforma si esos archivos no existen en el repositorio.
- Este repositorio es ejemplo profesional del estándar: conserva completo el set de `docs/agent/`, incluso cuando un archivo documente que una dimensión no aplica.
- Los prompts de calidad deben obligar al agente a leer antes de modificar, prohibir comandos inventados, exigir plan antes de cambios y no relajar pruebas o seguridad para aprobar validaciones.

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
