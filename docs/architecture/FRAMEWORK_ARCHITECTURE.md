# Arquitectura de KronForge v3

## Propósito

KronForge es una plataforma documental abierta para diseñar, documentar y evolucionar proyectos AI-First y Human-Friendly. No es un runtime, SDK ni metodología prescriptiva.

La arquitectura v3 separa responsabilidades para que el repositorio pueda crecer a cientos o miles de activos sin convertir el portal, el catálogo o los adaptadores en fuentes alternativas.

## Capas

### 1. Orientación

Entradas para humanos y agentes:

- `README.md`;
- `AGENTS.md`;
- prompt maestro;
- quick start;
- rutas de aprendizaje;
- matriz de compatibilidad.

### 2. Protocolo

Ciclos de vida normativos con actores, contratos, evidencia, compuertas y estados de falla. Es la única capa cuyos activos declaran madurez verificable y dependencias entre sí:

- `protocol`.

Se separa de Conocimiento porque un protocolo prescribe comportamiento y un patrón lo describe, y se separa de Ejecución porque no conduce una tarea concreta: gobierna cómo varios actores conducen las suyas. Ver [ADR-0006](../adr/ADR-0006-protocol-asset-type.md).

### 3. Conocimiento

Conceptos y decisiones reutilizables:

- dominios;
- patrones y anti-patrones;
- referencias;
- arquitecturas;
- ADR;
- guías, tutoriales y casos de estudio.

### 4. Ejecución

Activos que conducen trabajo:

- prompts;
- skills;
- hooks;
- subagents;
- playbooks;
- checklists;
- templates;
- runbooks;
- workflows;
- recipes;
- snippets;
- evaluaciones y benchmarks.

### 5. Gobernanza

Contratos de comunidad y mantenimiento:

- contribución;
- conducta;
- seguridad;
- soporte;
- ownership;
- versionado;
- compatibilidad;
- deprecación;
- releases;
- estándares documentales;
- quality gates.

### 6. Presentación

Portal estático progresivo:

- HTML, CSS y JavaScript nativo;
- rutas por hash compatibles con GitHub Pages;
- catálogo y Markdown cargados desde su fuente;
- búsqueda, filtros, relaciones y rutas de aprendizaje;
- lectura, copia y descarga.

### 7. Automatización

Calidad reproducible sin toolchain de aplicación:

- scripts Node.js estándar;
- pruebas con `node:test`;
- smoke test HTTP;
- GitHub Actions;
- AI Repository Score.

## Arquitectura de información

```txt
Entradas
  README.md
  AGENTS.md
  Portal
      |
      v
library/catalog.json ---- library/schema/catalog-v3.schema.json
      |
      +-- domains/<domain>/README.md
      |
      +-- domains/<domain>/<asset-type>/<asset>.md
      |
      +-- learningPaths[] -> IDs existentes

docs/
  architecture/
  adr/
  agent/
  audits/
  governance y políticas especializadas

scripts/ + tests/ + .github/workflows/
```

## Unidad de organización

El dominio sigue siendo la unidad primaria. Tecnologías, estilos y proveedores son facetas salvo que el volumen y ownership justifiquen un dominio propio.

Una carpeta de tipo se crea únicamente cuando contiene un activo canónico. v3 reconoce los tipos siguientes sin obligar a materializarlos todos:

- `protocol`;
- `prompt`;
- `skill`;
- `hook`;
- `subagent`;
- `mcp-integration`;
- `playbook`;
- `checklist`;
- `template`;
- `adr`;
- `pattern`;
- `anti-pattern`;
- `runbook`;
- `case-study`;
- `architecture`;
- `architecture-note`;
- `reference`;
- `best-practice`;
- `example`;
- `tutorial`;
- `guide`;
- `roadmap`;
- `workflow`;
- `recipe`;
- `snippet`;
- `evaluation`;
- `benchmark`;
- `tool-integration`.

## Fuente de verdad

1. El Markdown del activo es la fuente canónica de contenido y front matter.
2. `library/catalog.json` es una proyección explícita para descubrimiento.
3. El schema documenta la proyección.
4. El validador bloquea diferencias en identidad, versión, estado, dominio, tipo, nivel, compatibilidad, modelos y relaciones.
5. El portal nunca mantiene copias extensas del cuerpo de los activos.

## Identidad y relaciones

- ID estable: `<domain>.<slug>`.
- Ruta pública estable mientras el activo sea `stable`.
- Relaciones simples compatibles: `related: [asset-id]`.
- Dependencias explícitas compatibles: `dependencies: [asset-id]`.
- Una ruta de aprendizaje solo puede referenciar IDs existentes.

Las relaciones tipadas (`supersedes`, `implements`, `example-of`, `next-step`) quedan reservadas para una evolución futura. No forman parte del schema v3 hasta que catálogo, validador y portal las soporten de extremo a extremo.

## Compatibilidad

El núcleo es compatible con cualquier agente capaz de leer Markdown mediante copia/pega o acceso al repositorio. La autodetección de archivos es una capacidad diferente y debe documentarse solo cuando esté verificada.

Los adaptadores:

- enlazan `AGENTS.md` y los activos canónicos;
- contienen únicamente diferencias de descubrimiento o uso;
- no redefinen seguridad, pruebas o arquitectura;
- pueden evolucionar sin cambiar el núcleo.

## Escalabilidad

La arquitectura evita:

- índices planos globales;
- un archivo por proveedor sin diferencias reales;
- carpetas vacías;
- cuerpos Markdown duplicados en JSON;
- generación automática no reproducible;
- subdominios creados por moda.

Cuando un dominio crezca, puede agregar un índice temático o facetas declarativas antes de crear niveles adicionales de carpetas.

## Compatibilidad con GitHub Pages

- publicación desde la raíz;
- `.nojekyll` obligatorio;
- rutas resueltas desde `import.meta.url`;
- navegación por hash;
- `404.html` de recuperación;
- sin build, bundler ni framework;
- cualquier script de calidad es de mantenimiento, no requisito para servir el sitio.

## Ownership

- maintainers custodian releases, políticas y arquitectura transversal;
- CODEOWNERS expresa revisión solicitada, no reemplaza gobernanza;
- dominios pueden adquirir owners cuando existan contributors responsables;
- decisiones estructurales se registran en `docs/adr/`;
- cambios sensibles siguen `AGENTS.md` y `docs/agent/PERMISSIONS.md`.

## Evolución

v3 establece arquitectura, gobernanza, automatización y portal enriquecido. La expansión masiva de la biblioteca se pospone hasta que métricas y contribución demuestren demanda real.
