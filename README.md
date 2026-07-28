# Agents First Repo Docs

Biblioteca abierta de ingeniería de software asistida por IA: conocimiento reutilizable para analizar, diseñar, construir, modernizar, validar, desplegar y mantener software con agentes.

Es agnóstica al modelo, proveedor y stack. Funciona con cualquier agente moderno porque sus activos obligan a observar el repositorio real, distinguir evidencia de supuestos y conservar control humano en decisiones sensibles.

El flujo operativo se mantiene simple: **Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar**.

> [!TIP]
> Explora la versión visual en [GitHub Pages](https://blandskron.github.io/agents-first-repo-docs/) o entra directamente al [catálogo por dominios](library/README.md).

## Qué encontrarás

- un [prompt maestro](prompts/agents-first-documentation-review.prompt.md) para preparar repositorios agents-first;
- una [biblioteca por dominios](library/README.md) con prompts, skills, templates, checklists, playbooks, patrones, anti-patrones y referencias;
- contratos de autoría y un [catálogo legible por herramientas](library/catalog.json);
- documentación operativa en [`docs/agent/`](docs/agent/);
- ejemplos de uso y un sitio estático sin build.

No es una colección masiva de prompts ni una metodología prescriptiva. Es un framework documental liviano: organiza capacidades reutilizables y deja que cada activo se adapte a la evidencia del proyecto objetivo.

## Inicio rápido

### Para auditar un repositorio

1. Abre el [prompt maestro](prompts/agents-first-documentation-review.prompt.md).
2. Copia su contenido en el agente que uses.
3. Entrégale acceso al repositorio objetivo.
4. Exige primero el diagnóstico y el plan.
5. Revisa los cambios sensibles antes de autorizar su aplicación.

### Para una tarea especializada

1. Navega el [índice de dominios](library/README.md#dominios).
2. Elige el activo por resultado y revisa sus entradas y restricciones.
3. Sigue el activo y conserva la evidencia requerida.

## Dominios

| Dominio | Ejemplos de alcance |
|---|---|
| [Arquitectura](library/domains/architecture/README.md) | decisiones, modularidad, DDD y estilos |
| [Desarrollo de software](library/domains/software-development/README.md) | backend, frontend, APIs y refactoring |
| [Datos](library/domains/data/README.md) | modelos, migraciones, contratos y pipelines |
| [Ingeniería de calidad](library/domains/quality-engineering/README.md) | testing, QA, code review y DoD |
| [Seguridad](library/domains/security/README.md) | AppSec, supply chain, secretos e IAM |
| [Entrega y plataforma](library/domains/delivery-platform/README.md) | CI/CD, releases, cloud y contenedores |
| [Confiabilidad y performance](library/domains/reliability-performance/README.md) | observabilidad, incidentes y rendimiento |
| [Experiencia y accesibilidad](library/domains/experience-accessibility/README.md) | UX, UI, WCAG y usabilidad |
| [Ingeniería de IA y agentes](library/domains/ai-agent-engineering/README.md) | agents-first, contexto, evaluación y prompts |
| [Producto y gestión técnica](library/domains/product-technical-management/README.md) | discovery, RFC, planificación y riesgo |
| [Documentación y conocimiento](library/domains/documentation-knowledge/README.md) | auditoría, runbooks y documentación como código |

## Principios

- Leer antes de modificar.
- No inventar comandos, arquitectura, dependencias ni resultados.
- Ser universal por defecto y específico solo después de detectar evidencia.
- Planificar antes de cambiar y pedir aprobación para acciones sensibles.
- No exponer secretos ni relajar pruebas o seguridad para aprobar.
- Enlazar conocimiento común en vez de duplicarlo.
- Priorizar calidad y mantenibilidad sobre volumen.

## Arquitectura del repositorio

```txt
agents-first-repo-docs/
├── prompts/
│   └── agents-first-documentation-review.prompt.md
├── library/
│   ├── README.md
│   ├── catalog.json
│   └── domains/<domain>/
│       ├── README.md
│       ├── prompts/
│       ├── skills/
│       ├── templates/
│       ├── checklists/
│       ├── playbooks/
│       ├── patterns/
│       ├── anti-patterns/
│       └── references/
├── docs/
│   ├── REPOSITORY_EVOLUTION.md
│   ├── CONTRIBUTING_ASSETS.md
│   ├── CHANGELOG.md
│   └── agent/
├── examples/
├── index.html
├── assets/
└── pages/
```

Las subcarpetas de activos se crean solo cuando contienen conocimiento real. El prompt maestro conserva su ruta estable como puerta de entrada.

## Contribuir

Lee [cómo contribuir activos](docs/CONTRIBUTING_ASSETS.md). Toda contribución debe:

- ubicarse en un dominio claro;
- aportar un resultado reusable;
- seguir el contrato de metadatos;
- evitar duplicidad y dependencias innecesarias de proveedor;
- actualizar índices y changelog;
- pasar las [validaciones documentales](docs/agent/TESTS.md).

La arquitectura y el plan de migración están documentados en [REPOSITORY_EVOLUTION.md](docs/REPOSITORY_EVOLUTION.md).

## Uso con agentes

Los agentes deben leer [AGENTS.md](AGENTS.md) antes de trabajar. `CLAUDE.md`, `GEMINI.md` y `.github/copilot-instructions.md` son adaptadores opcionales; el conocimiento canónico no depende de ellos.

## Sitio estático

GitHub Pages sirve [`index.html`](index.html), [`assets/`](assets/) y [`pages/`](pages/) directamente desde la raíz. No existe build system.

## Versionado y licencia

Los activos siguen [versionado semántico y reglas de deprecación](PROMPT_VERSIONING.md). Los cambios notables se registran en [docs/CHANGELOG.md](docs/CHANGELOG.md).

Licencia MIT. Consulta [LICENSE](LICENSE).
