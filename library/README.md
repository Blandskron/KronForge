# Biblioteca de Ingeniería para Agentes IA

Catálogo de conocimiento reutilizable, agnóstico al modelo y organizado por dominios de ingeniería. La unidad principal es el dominio; dentro de él conviven activos ejecutables, conocimiento explicativo, validaciones, integraciones, material de aprendizaje y referencias.

## Cómo usar la biblioteca

1. Elige un dominio.
2. Selecciona el tipo de activo adecuado para tu objetivo.
3. Lee sus entradas, restricciones y criterios de salida.
4. Aplica el flujo **Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar** cuando el activo delegue cambios a un agente.
5. Conserva evidencia de lo ejecutado y revisión humana para decisiones sensibles.

> [!IMPORTANT]
> Un activo guía el trabajo; no reemplaza el análisis del repositorio ni autoriza acciones destructivas.

## Dominios

| Dominio | Propósito | Activos actuales |
|---|---|---|
| [IA y agentes](domains/ai-agent-engineering/README.md) | Agentes, subagentes, evaluación, memoria e integración LLM | Skill, playbook, architecture note, pattern y checklist |
| [Context Engineering](domains/context-engineering/README.md) | Capas, routing, compresión, retrieval, ventanas y horizonte largo | Architecture note y cuatro patterns |
| [Repository Engineering](domains/repository-engineering/README.md) | Repositorios AI-First y contexto mantenible | Playbook |
| [MCP e integraciones](domains/mcp-integration/README.md) | Clientes, servidores, tools, resources y seguridad | Architecture note y checklist |
| [Cadena de suministro de agentes](domains/agent-supply-chain/README.md) | Confianza, procedencia y privilegio mínimo de los artefactos que el agente carga | Architecture note, pattern, anti-pattern y checklist |
| [Interoperabilidad entre agentes](domains/agent-interoperability/README.md) | Comunicación, descubrimiento y confianza entre agentes de distinto dueño | Architecture note y referencia |
| [Hooks y workflows](domains/hooks-workflows/README.md) | Automatización explícita y observable | Pattern |
| [Arquitectura](domains/architecture/README.md) | Decisiones, estilos, modularidad y evolución de sistemas | Prompt y template ADR |
| [Desarrollo de software](domains/software-development/README.md) | Backend, frontend, APIs, integración y refactoring | Índice preparado |
| [Datos](domains/data/README.md) | Modelos, persistencia, migraciones y contratos | Índice preparado |
| [Ingeniería de calidad](domains/quality-engineering/README.md) | Testing, QA, revisión y criterios de cierre | Seis prompts y checklist |
| [Seguridad](domains/security/README.md) | AppSec, supply chain, secretos e IAM | Tres prompts |
| [Entrega y plataforma](domains/delivery-platform/README.md) | CI/CD, releases, contenedores, cloud e infraestructura | Prompt y skill |
| [Confiabilidad y performance](domains/reliability-performance/README.md) | Observabilidad, resiliencia, incidentes y rendimiento | Prompt |
| [Experiencia y accesibilidad](domains/experience-accessibility/README.md) | UX, UI, accesibilidad y arquitectura de información | Referencias |
| [Producto y gestión técnica](domains/product-technical-management/README.md) | Discovery, planificación, RFC, riesgo y liderazgo técnico | Índice preparado |
| [Documentación y conocimiento](domains/documentation-knowledge/README.md) | Documentación como código, auditoría y operación | Skill, patrón y anti-patrón |

## Catálogo v3

[`catalog.json`](catalog.json) usa schema v3 y conserva `domains` y `assets` para los consumidores de v2. Agrega:

- `metadataDefaults`, con autoría, licencia, idioma, modelos y agentes predeterminados verificables;
- `typeDefinitions`, con todos los tipos aceptados, su categoría, carpeta y estado;
- metadatos operativos por activo, incluidos versión, compatibilidad, relaciones y contratos de entrada y salida;
- `specRefs`, con la versión, la URL y la fecha de verificación de cada fuente externa que el activo cita;
- `learningPaths`, con rutas cortas formadas exclusivamente por IDs existentes;
- `lastUpdated`, separado de la versión global del framework.

El contrato formal está en [`schema/catalog-v3.schema.json`](schema/catalog-v3.schema.json) y usa JSON Schema draft 2020-12. La ruta histórica `schema/catalog.schema.json` se conserva como alias compatible.

### Tipos y categorías

Los tipos se agrupan por su función, sin convertir cada tema en un dominio:

| Categoría | Tipos |
|---|---|
| Ejecución | `prompt`, `skill`, `subagent`, `playbook`, `recipe`, `snippet` |
| Automatización | `hook`, `workflow` |
| Integración | `mcp-integration`, `tool-integration` |
| Validación | `checklist`, `evaluation`, `benchmark` |
| Creación | `template` |
| Arquitectura | `adr`, `architecture`, `architecture-note` |
| Conocimiento | `pattern`, `anti-pattern`, `best-practice` |
| Operación | `runbook` |
| Aprendizaje | `example`, `case-study`, `tutorial`, `guide` |
| Referencia | `reference` |
| Planificación | `roadmap` |

`active` significa que ya existe al menos un activo canónico de ese tipo. `supported` significa que el contrato acepta contribuciones de ese tipo, pero no crea contenido de relleno.

### Fuente de verdad

El Markdown de cada activo sigue siendo la fuente canónica de contenido y metadatos editoriales. El catálogo es un índice materializado y comprometido en Git para que GitHub Pages, agentes y validadores puedan consumirlo sin build ni backend.

- `title` representa el nombre humano y `summary` la descripción breve.
- `type` identifica el contrato concreto; `category` agrupa tipos para descubrimiento.
- `level` es el nivel público; `difficulty` se conserva durante v3 por compatibilidad y ambos deben coincidir.
- Los valores heredables están declarados en `metadataDefaults`, pero cada registro materializa su valor efectivo.
- `inputs`, `outputs`, `examples`, `estimatedTime`, `complexity` y `useCases` quedan vacíos o nulos cuando el Markdown no los declara como metadatos estructurados. El catálogo no infiere hechos desde prosa libre.
- `dependencies` y `related` contienen IDs del mismo catálogo.
- `specRefs` es opcional en el schema y obligatorio por política para todo activo que cite una fuente externa. Ver [frescura verificable](../docs/SPEC_FRESHNESS.md).

### Superficies generadas

El Markdown del dominio es la única fuente de verdad. De él se derivan tres proyecciones comprometidas en Git, todas verificadas por la puerta de calidad:

| Superficie | Para quién | Regenerar |
|---|---|---|
| [`catalog.json`](catalog.json) | portal, validadores y agentes con acceso al repositorio | manual, junto al activo |
| [`skills/`](../skills/README.md) | clientes compatibles con el formato abierto Agent Skills | `npm run build:skills` |
| [`llms.txt`](../llms.txt) | agentes que llegan al sitio publicado | `npm run build:llms` |

`npm run build` regenera las dos últimas. Ninguna se edita a mano: la validación falla si divergen de su fuente.

Los índices de dominio ofrecen orientación humana. El catálogo ofrece el inventario completo y evita que esos índices se conviertan en una segunda base de datos manual.

## Rutas de aprendizaje

El catálogo publica rutas disponibles para Prompt Engineering, AI Engineering, agentes, MCP, hooks, arquitectura, GitHub, DevOps, testing, seguridad y confianza en skills. Cada ruta declara:

- `status`: disponibilidad de la secuencia;
- `coverage`: `introductory`, `partial` o `comprehensive`;
- `assets`: orden de lectura usando solo activos existentes.

Una ruta no copia contenido ni promete cobertura que la biblioteca todavía no tiene.

## Contribuir

Lee [cómo contribuir activos](../docs/CONTRIBUTING_ASSETS.md) antes de agregar contenido. No crees carpetas vacías ni activos de relleno.
