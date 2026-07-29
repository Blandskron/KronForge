# Propuesta de Evolución del Repositorio

> [!NOTE]
> Este documento conserva la decisión histórica que originó la arquitectura por dominios en v2. La arquitectura vigente de v3 está en [FRAMEWORK_ARCHITECTURE.md](architecture/FRAMEWORK_ARCHITECTURE.md) y sus decisiones en [docs/adr/](adr/README.md).

## Estado de la propuesta

- **Fecha:** 2026-07-28
- **Alcance:** evolución mayor de biblioteca de prompts a biblioteca de ingeniería asistida por IA.
- **Decisión:** adoptar una arquitectura por dominios con tipos de activos reutilizables.
- **Compatibilidad:** conservar el prompt maestro y las rutas públicas esenciales mientras se migra el catálogo.

> [!IMPORTANT]
> Este documento es la compuerta arquitectónica previa a la implementación. Describe el destino, las reglas de diseño y la migración antes de modificar la estructura del catálogo.

## 1. Análisis crítico del estado actual

El repositorio ya ofrece una base profesional: un prompt maestro agnóstico, doce prompts de calidad, tres skills, documentación agents-first, versionado y un sitio estático sin build. El flujo `Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar` es claro y debe conservarse como mecanismo operativo.

La arquitectura actual fue diseñada para un producto centrado en prompts. Esa forma deja de escalar cuando el producto incorpora skills, templates, checklists, playbooks, patrones, anti-patrones y referencias:

- `prompts/quality/` agrupa objetivos distintos bajo una categoría demasiado amplia.
- `skills/` está separada del conocimiento de dominio al que pertenece.
- no existe un contrato documental común para los distintos tipos de activos;
- el README raíz concentra inventario, explicación, estructura y operación;
- la navegación web conoce rutas y colecciones mediante configuración manual;
- no hay taxonomía, metadatos ni reglas de enlaces cruzados;
- las guías específicas de proveedor ocupan espacio raíz aunque el producto declara ser agnóstico;
- el catálogo no tiene política explícita para deprecación, madurez o crecimiento.

### Clasificación del contenido existente

| Contenido | Estado | Decisión |
|---|---|---|
| Prompt maestro | Vigente y útil | Conservar como puerta de entrada |
| Prompts de calidad | Vigentes, valiosos y poco clasificados | Migrar por dominio sin duplicarlos |
| Skills actuales | Útiles pero con esquema desigual | Normalizar y ubicar por dominio |
| `docs/agent/` | Vigente como ejemplo operativo | Conservar completo |
| README y sitio | Vigentes pero acoplados al catálogo anterior | Reorientar hacia navegación por dominios |
| Guías de Claude, Gemini y Copilot | Compatibilidad específica | Conservar como adaptadores delgados, no como núcleo |
| Changelog y versionado | Vigentes | Extender a todos los activos |
| Licencia | Legal y protegida | Conservar sin cambios |

## 2. Problemas encontrados

1. **Taxonomía insuficiente.** “Quality” mezcla testing, seguridad, arquitectura, performance y entrega.
2. **Separación por formato.** Prompts y skills viven lejos de sus contextos de uso.
3. **Sin contrato común.** No existen secciones mínimas, metadatos ni criterios de aceptación uniformes.
4. **Descubrimiento manual.** Para hallar un activo hay que conocer su carpeta o leer tablas mantenidas a mano.
5. **Escalabilidad limitada.** Cientos de archivos planos elevarían colisiones de nombres, duplicidad y costo de navegación.
6. **Cobertura parcial.** No hay activos reutilizables de templates, checklists, playbooks, patrones, anti-patrones o referencias.
7. **Vínculos débiles.** Los activos no declaran prerrequisitos, relacionados, alternativas ni salidas reutilizables.
8. **Gobernanza centrada en prompts.** SemVer, changelog y validación no cubren de forma expresa todo el catálogo.
9. **Mensaje de producto desactualizado.** El repo se define como colección de prompts, no como sistema de conocimiento reutilizable.
10. **Web acoplada.** La interfaz depende de listas y rutas específicas del catálogo anterior.

## 3. Oportunidades de mejora

- convertir cada dominio en una unidad navegable y mantenible;
- reutilizar un vocabulario común de activos y madurez;
- crear índices humanos simples y manifiestos legibles por agentes;
- mantener los activos autocontenidos y enlazados entre sí;
- separar conocimiento universal de ejemplos específicos de tecnología;
- habilitar crecimiento incremental sin crear carpetas vacías ni contenido de relleno;
- usar el repositorio como ejemplo vivo de sus propias convenciones;
- conservar el sitio estático y cargar contenido canónico desde Markdown.

## 4. Nueva arquitectura de información

La unidad primaria será el **dominio de ingeniería**. Dentro de cada dominio convivirán solo los tipos de activo que aporten valor:

```txt
library/
  README.md
  catalog.json
  domains/
    <domain>/
      README.md
      prompts/
      skills/
      templates/
      checklists/
      playbooks/
      patterns/
      anti-patterns/
      references/
```

No es obligatorio crear las nueve subcarpetas en cada dominio. Se crean bajo demanda, cuando exista al menos un activo real. El `README.md` del dominio funciona como índice canónico y `catalog.json` como índice mínimo consumible por herramientas.

### Capas del repositorio

1. **Entrada:** `README.md`, `AGENTS.md`, sitio estático y prompt maestro.
2. **Catálogo:** `library/` con dominios y activos canónicos.
3. **Operación:** `docs/agent/`, políticas, versionado y contribución.
4. **Compatibilidad:** guías específicas de herramientas y enlaces de transición.
5. **Presentación:** `index.html`, `assets/` y `pages/`, sin duplicar el contenido extenso.

## 5. Taxonomía de dominios

La taxonomía agrupa capacidades estables, no tecnologías de moda:

| Dominio | Alcance |
|---|---|
| `architecture` | diseño de sistemas, modularidad, DDD, estilos y decisiones |
| `software-development` | backend, frontend, APIs, refactoring e integración |
| `data` | bases de datos, modelos, migraciones, contratos y pipelines |
| `quality-engineering` | testing, QA, revisión de código y Definition of Done |
| `security` | AppSec, threat modeling, IAM, secretos y supply chain |
| `delivery-platform` | CI/CD, releases, cloud, contenedores e infraestructura |
| `reliability-performance` | observabilidad, resiliencia, incidentes y rendimiento |
| `experience-accessibility` | UX, UI, accesibilidad, SEO y arquitectura de información |
| `ai-agent-engineering` | agents-first, evaluación, contexto, prompts y automatización con IA |
| `product-technical-management` | discovery, planificación, RFC, riesgo y gestión técnica |
| `documentation-knowledge` | documentación, ADR, runbooks y gestión del conocimiento |

Los frameworks y proveedores son **facetas**, no dominios raíz. Un activo de React pertenece a `software-development`; uno de Kubernetes, a `delivery-platform`. Esto evita una taxonomía que cambie al ritmo de herramientas específicas.

## 6. Estructura final objetivo

```txt
agents-first-repo-docs/
├── README.md
├── AGENTS.md
├── CONTRIBUTING.md
├── PROMPT_VERSIONING.md
├── prompts/
│   └── agents-first-documentation-review.prompt.md
├── library/
│   ├── README.md
│   ├── catalog.json
│   └── domains/
│       ├── architecture/
│       ├── software-development/
│       ├── data/
│       ├── quality-engineering/
│       ├── security/
│       ├── delivery-platform/
│       ├── reliability-performance/
│       ├── experience-accessibility/
│       ├── ai-agent-engineering/
│       ├── product-technical-management/
│       └── documentation-knowledge/
├── docs/
│   ├── REPOSITORY_EVOLUTION.md
│   ├── CONTRIBUTING_ASSETS.md
│   ├── CHANGELOG.md
│   └── agent/
├── examples/
├── index.html
├── assets/
├── pages/
└── adaptadores específicos de herramientas
```

## 7. Convenciones de nombres

- Rutas y archivos en `kebab-case`, ASCII y nombres orientados a objetivo.
- Prompts: `<objetivo>.prompt.md`.
- Skills: `<objetivo>/SKILL.md`.
- Templates: `<artefacto>.template.md`.
- Checklists: `<momento-o-control>.checklist.md`.
- Playbooks: `<resultado>.playbook.md`.
- Patrones: `<nombre>.pattern.md`.
- Anti-patrones: `<nombre>.anti-pattern.md`.
- Referencias: `<tema>.references.md`.
- Un nombre describe la capacidad, no el modelo que la ejecuta.
- Las tecnologías específicas se declaran como alcance o tags, no en dominios raíz salvo necesidad real de descubrimiento.

## 8. Contrato de los activos

Todo activo comienza con un bloque de metadatos YAML:

```yaml
---
id: quality-engineering.unit-tests
title: Tests unitarios
summary: Diseñar o mejorar pruebas unitarias basadas en evidencia local.
type: prompt
domain: quality-engineering
status: stable
version: 1.0.0
tags: [testing, unit-tests]
related:
  - quality-engineering.definition-of-done
---
```

Estados permitidos: `draft`, `stable`, `deprecated`. Los enlaces relativos del cuerpo son la fuente de navegación humana; `related` ayuda a agentes e índices.

## 9. Estrategia por tipo de activo

### Prompts

- se organizan por resultado y dominio;
- obligan a leer antes de modificar, detectar comandos reales, proponer plan y entregar evidencia;
- separan diagnóstico, ejecución y validación;
- no incluyen instrucciones exclusivas de proveedor;
- enlazan checklists, templates o skills cuando estos evitan repetir contenido.

### Skills

Cada skill define: objetivo, cuándo usarla, cuándo no usarla, entradas, resultado, restricciones, procedimiento, buenas prácticas, checklist, errores frecuentes, documentos relacionados, prompts compatibles y skills relacionadas.

### Templates

Contienen placeholders explícitos, instrucciones mínimas de uso y criterios para eliminar secciones no aplicables. No presentan datos ficticios como realidad.

### Checklists

Son ejecutables de forma independiente, usan estados verificables y exigen evidencia. No sustituyen una decisión profesional con una suma mecánica.

### Playbooks

Describen precondiciones, fases, puntos de decisión, rollback, evidencia y criterios de salida. Un playbook enlaza activos especializados en vez de copiarlos.

### Patrones

Incluyen contexto, problema, solución, cuándo usar, cuándo evitar, ventajas, desventajas, fuerzas, ejemplo agnóstico y relaciones.

### Anti-patrones

Incluyen señales, consecuencias, causas habituales, detección, corrección gradual, prevención y patrones alternativos.

### Referencias

Enlazan fuentes primarias o estándares reconocidos, registran fecha de revisión y resumen por qué importa la fuente. No copian documentación externa.

## 10. Sistema de navegación e índices

- `README.md`: propuesta de valor y rutas rápidas.
- `library/README.md`: índice por dominio, tipo de activo y caso de uso.
- `library/domains/<domain>/README.md`: índice canónico del dominio.
- `library/catalog.json`: manifiesto compacto con dominios y rutas de activos.
- sitio estático: exploración y copia a partir del manifiesto y Markdown canónico.
- cada activo: sección “Relacionados” y metadatos `related`.
- enlaces de compatibilidad: rutas antiguas documentadas durante la transición, sin duplicar el contenido.

Los índices no se llaman “automáticos” si requieren edición manual. La validación comprobará que el manifiesto, los índices y el sistema de archivos coincidan.

## 11. Plan de migración

### Fase A — Fundaciones

1. Crear esta propuesta y aprobar la taxonomía mediante su adopción en el repositorio.
2. Crear `library/`, manifiesto, guía de contribución y plantillas de autoría.
3. Reposicionar README, AGENTS y políticas de versionado.

### Fase B — Migración sin duplicidad

1. Mover los doce prompts de `prompts/quality/` a sus dominios correctos.
2. Normalizar metadatos sin alterar su intención operativa.
3. Mover y completar las skills actuales bajo dominios.
4. Actualizar todos los enlaces y cargadores del sitio.
5. Conservar el prompt maestro en su ruta estable.

### Fase C — Activos de referencia

Crear un conjunto pequeño y de alta calidad que demuestre cada contrato:

- template ADR;
- checklist pre-merge;
- playbook para preparar un repositorio agents-first;
- patrón de documentación como código;
- anti-patrón de comandos inventados;
- referencias de accesibilidad;
- skill normalizada de auditoría documental.

### Fase D — Experiencia de catálogo

1. Adaptar la web a dominios y tipos de activos.
2. Permitir copiar activos desde su fuente canónica.
3. Validar responsive, rutas, errores de carga y ausencia de build.

### Fase E — Crecimiento

Agregar activos por demanda real, con revisión de duplicidad, dueño conceptual, estado de madurez y evidencia de validación.

## 12. Sistema de enlaces cruzados

- Los metadatos usan IDs estables `<domain>.<asset>`.
- El cuerpo usa enlaces relativos navegables en GitHub.
- Los activos relacionados deben aportar un siguiente paso, una alternativa o una dependencia real.
- No se crean enlaces circulares solo para aumentar conectividad.
- Los adaptadores de proveedor enlazan al núcleo universal; el núcleo no depende de ellos.

## 13. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Sobrediseñar el repositorio | Crear carpetas solo cuando exista contenido valioso |
| Romper enlaces públicos | Actualizar referencias en un mismo cambio y conservar el prompt maestro |
| Duplicar contenido durante la migración | Mover activos canónicos y usar enlaces, no copias |
| Taxonomía ambigua | Definir alcance y ejemplos en cada dominio |
| Índices desactualizados | Validar manifiesto, archivos y enlaces en cada cambio |
| Convertir checklists en burocracia | Exigir evidencia y permitir `No aplica` justificado |
| Dependencia de proveedor | Mantener adaptadores delgados fuera del núcleo |
| Crecimiento sin calidad | Estados de madurez, plantilla común y revisión de contribución |

## 14. Beneficios esperados

- descubrimiento predecible para humanos y agentes;
- crecimiento a cientos o miles de activos sin carpetas planas;
- reutilización entre prompts, skills, templates y playbooks;
- menor duplicidad y cambios más localizados;
- incorporación progresiva de tecnologías sin degradar la taxonomía;
- sitio estático como visor del catálogo, no como segunda fuente de verdad;
- gobernanza y validación coherentes para todo el conocimiento reutilizable.

## 15. Criterios de aceptación de la evolución

- existe un catálogo por dominios con contratos documentados;
- los activos actuales tienen una ubicación canónica y enlaces válidos;
- cada tipo de activo introducido tiene al menos un ejemplo de calidad;
- README, AGENTS, web, versionado y changelog reflejan el nuevo producto;
- no se elimina el prompt maestro ni la documentación operativa útil;
- el catálogo sigue siendo agnóstico al modelo y al stack;
- todas las validaciones documentales y del sitio terminan sin errores bloqueantes.
