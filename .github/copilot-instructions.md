# GitHub Copilot Instructions

El contrato canónico vive en [`AGENTS.md`](../AGENTS.md). Este adaptador no lo reemplaza ni garantiza un comportamiento idéntico entre productos o versiones.

## Contexto local

- Biblioteca y catálogo canónicos: `library/`.
- Prompt maestro estable: `prompts/agents-first-documentation-review.prompt.md`.
- Operación y validación: `docs/agent/`.
- Protocolos de trabajo entre personas y agentes: `library/domains/engineering-protocols/`.
- Portal estático: `index.html`, `assets/` y `pages/`, sin build.

## Reglas

- Lee el archivo y sus relacionados antes de proponer cambios.
- No inventes frameworks, comandos, versiones, soporte o resultados.
- Mantén catálogo, front matter e índices alineados.
- Enlaza Markdown canónico; no dupliques contenido extenso en HTML o JavaScript.
- Conserva HTML, CSS y JavaScript nativo.
- Exige plan y aprobación para cambios incompatibles o sensibles.
- Verifica enlaces, rutas, Markdown y controles aplicables de `docs/QUALITY_GATES.md`.

La cobertura de otros agentes se documenta en [`docs/AGENT_COMPATIBILITY.md`](../docs/AGENT_COMPATIBILITY.md).
