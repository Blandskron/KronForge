# Agents First Repo Docs

Repositorio profesional de prompts para documentar, auditar y validar repositorios de software con agentes de IA.

La idea es simple: **Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar**. Un dev entra, copia el prompt que necesita, lo pega en el agente que use y el agente queda con una misión clara: auditar, limpiar, reconstruir documentación o ejecutar procesos de validación interna de calidad, sin asumir stack, herramienta ni arquitectura.

El producto de este repositorio son los prompts. El repositorio completo funciona como ejemplo vivo de cómo debería verse un proyecto avanzado, profesional y fácil de mantener cuando está preparado para agentes y para humanos.

> [!TIP]
> **Sitio GitHub Pages:** usa la versión visual para leer, navegar y copiar el prompt desde [blandskron.github.io/agents-first-repo-docs](https://blandskron.github.io/agents-first-repo-docs/).

## Qué Entrega Este Repo

- Un prompt maestro universal en [prompts/agents-first-documentation-review.prompt.md](prompts/agents-first-documentation-review.prompt.md).
- Una biblioteca de prompts especializados para validación interna de calidad en [prompts/quality/](prompts/quality/).
- Una estructura documental que sirve como ejemplo real del estándar agents-first.
- Guías de permisos, validación y versionado para mantener los prompts como producto.
- Un set completo de documentos `docs/agent/` como referencia profesional, incluso cuando una dimensión no aplique.
- Ejemplos de skills reutilizables para tareas repetibles.
- Un ejemplo de uso en [examples/usage-example.md](examples/usage-example.md).
- Una página estática con HTML, CSS y JS lista para GitHub Pages.

## Qué No Es

- No es un framework.
- No es una metodología pesada de documentación.
- No obliga a usar un agente, modelo, lenguaje o proveedor específico.
- No reemplaza la revisión humana en cambios sensibles.
- No inventa arquitectura: obliga al agente a detectar la realidad del repositorio antes de actuar.

## Uso Rápido

1. Abre [prompts/agents-first-documentation-review.prompt.md](prompts/agents-first-documentation-review.prompt.md).
2. Copia todo el contenido.
3. Pégalo en tu agente de codificación o documentación.
4. Pide al agente que ejecute primero una auditoría de solo lectura.
5. Revisa y aprueba el plan antes de aplicar cambios.

El prompt está diseñado para funcionar con cualquier agente moderno: no depende de Claude, Gemini, Copilot, ChatGPT, Codex ni de un framework específico.

## Para Quién Es

- Devs que quieren preparar repositorios para trabajo asistido por agentes sin estudiar una guía larga.
- Equipos que reciben repositorios heredados con documentación rota, duplicada o contradictoria.
- Maintainers que necesitan un punto de entrada claro para humanos y agentes.
- Proyectos nuevos que quieren partir con una estructura documental profesional.
- Repositorios backend, frontend, fullstack, infraestructura, datos, SDKs, prompts o documentación pública.

## Para Qué Sirve

Este repositorio ayuda a transformar proyectos con documentación dispersa en proyectos que tienen:

- `AGENTS.md` como punto de entrada para agentes.
- `README.md` claro para humanos.
- Documentos especializados en `docs/agent/`.
- Reglas de permisos, seguridad y validación.
- Comandos reales, no inventados.
- Limpieza segura de documentación obsoleta.
- Skills solo cuando existan tareas repetibles que lo justifiquen.

## Casos de Uso

- Microservicios backend.
- Frontends.
- Aplicaciones fullstack.
- Monorepos.
- Repositorios de infraestructura.
- Bibliotecas y SDKs.
- Repositorios de agentes IA.
- Proyectos heredados con documentación contradictoria.
- Repositorios de prompts, plantillas o documentación pública.

## Estructura del Repositorio

```txt
agents-first-repo-docs/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── PROMPT_VERSIONING.md
├── index.html
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── quality.css
│   │   └── responsive.css
│   └── js/
│       ├── config.js
│       ├── loader.js
│       ├── navigation.js
│       ├── sidebar.js
│       ├── tree.js
│       ├── quality.js
│       ├── models.js
│       ├── copy.js
│       ├── theme.js
│       └── app.js
├── pages/
│   ├── welcome.html
│   ├── prompt.html
│   ├── quality.html
│   ├── structure.html
│   ├── models.html
│   ├── example.html
│   └── versioning.html
├── prompts/
│   ├── agents-first-documentation-review.prompt.md
│   └── quality/
│       ├── README.md
│       ├── unit-tests.prompt.md
│       ├── integration-tests.prompt.md
│       ├── functional-qa.prompt.md
│       ├── regression-qa.prompt.md
│       ├── security-audit.prompt.md
│       ├── dependency-vulnerability-audit.prompt.md
│       ├── docker-image-security-audit.prompt.md
│       ├── code-quality-review.prompt.md
│       ├── architecture-validation.prompt.md
│       ├── performance-basic-validation.prompt.md
│       ├── definition-of-done-review.prompt.md
│       └── release-readiness-review.prompt.md
├── examples/
│   └── usage-example.md
├── docs/
│   ├── CHANGELOG.md
│   ├── skills/
│   │   └── README.md
│   └── agent/
│       ├── PERMISSIONS.md
│       ├── RUNBOOK.md
│       ├── TESTS.md
│       ├── SECURITY.md
│       ├── CONFIG.md
│       └── DATA_SCHEMA.md
├── .github/
│   └── copilot-instructions.md
├── skills/
│   ├── prompt-update/
│   │   └── SKILL.md
│   ├── documentation-audit/
│   │   └── SKILL.md
│   └── github-pages-release/
│       └── SKILL.md
└── LICENSE
```

## Biblioteca de Prompts de Validación Interna

Además del prompt maestro de documentación, este repositorio incluye prompts especializados para procesos de validación interna de calidad de software:

| Prompt | Propósito |
|---|---|
| [unit-tests.prompt.md](prompts/quality/unit-tests.prompt.md) | Tests unitarios |
| [integration-tests.prompt.md](prompts/quality/integration-tests.prompt.md) | Tests de integración |
| [functional-qa.prompt.md](prompts/quality/functional-qa.prompt.md) | QA funcional |
| [regression-qa.prompt.md](prompts/quality/regression-qa.prompt.md) | QA de regresión |
| [security-audit.prompt.md](prompts/quality/security-audit.prompt.md) | Auditoría de ciberseguridad |
| [dependency-vulnerability-audit.prompt.md](prompts/quality/dependency-vulnerability-audit.prompt.md) | Auditoría de vulnerabilidades en dependencias |
| [docker-image-security-audit.prompt.md](prompts/quality/docker-image-security-audit.prompt.md) | Auditoría de seguridad de imágenes Docker |
| [code-quality-review.prompt.md](prompts/quality/code-quality-review.prompt.md) | Revisión de calidad de código |
| [architecture-validation.prompt.md](prompts/quality/architecture-validation.prompt.md) | Validación de arquitectura |
| [performance-basic-validation.prompt.md](prompts/quality/performance-basic-validation.prompt.md) | Validación básica de performance |
| [definition-of-done-review.prompt.md](prompts/quality/definition-of-done-review.prompt.md) | Revisión de Definition of Done |
| [release-readiness-review.prompt.md](prompts/quality/release-readiness-review.prompt.md) | Revisión de release readiness |

Estos prompts no reemplazan el criterio humano. Su objetivo es guiar al agente para trabajar con evidencia local, producir checklists verificables y dejar trazabilidad de la validación realizada.

## Resultado Esperado en un Repo Objetivo

Después de aplicar el prompt, el repositorio auditado puede quedar con una estructura similar a:

```txt
AGENTS.md
README.md
docs/
  agent/
    PERMISSIONS.md
    RUNBOOK.md
    TESTS.md
    SECURITY.md
    CONFIG.md
    DATA_SCHEMA.md
skills/
  <tarea-repetible>/
    SKILL.md
```

No todos los archivos son obligatorios. El agente debe crear solo lo que tenga sentido según evidencia del repositorio analizado.

## Reglas del Estándar

- Leer antes de modificar.
- No asumir stack tecnológico.
- No inventar comandos.
- No inventar arquitectura.
- No eliminar documentación útil sin migrarla.
- No exponer secretos.
- No modificar credenciales.
- Mantener `AGENTS.md` breve, operativo y enlazado.
- Mantener `README.md` útil para humanos.
- Registrar cambios del prompt en [docs/CHANGELOG.md](docs/CHANGELOG.md).

## Norte de Calidad

Un repo convertido con este prompt debe poder responder tres preguntas sin obligar al agente o al dev a investigar desde cero:

- Qué es este proyecto y cómo se trabaja.
- Qué puede tocar un agente y qué requiere aprobación humana.
- Qué comandos, validaciones y documentos son reales según evidencia local.

## Página GitHub Pages

La página estática vive en:

- [index.html](index.html) (punto de entrada en la raíz)
- [assets/](assets/) (archivos CSS y JS modulares)
- [pages/](pages/) (vistas HTML dinámicas)

Está pensada para desplegarse directamente desde la raíz del repositorio en GitHub Pages. No requiere build system.

## Mantenimiento

Cada mejora relevante del prompt debe seguir [PROMPT_VERSIONING.md](PROMPT_VERSIONING.md) y registrarse en [docs/CHANGELOG.md](docs/CHANGELOG.md).

Para actualizar el prompt, usa la guía especializada en [skills/prompt-update/SKILL.md](skills/prompt-update/SKILL.md).

## Licencia

MIT. Consulta [LICENSE](LICENSE).
