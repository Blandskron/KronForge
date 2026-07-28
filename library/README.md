# Biblioteca de Ingeniería para Agentes IA

Catálogo de conocimiento reutilizable, agnóstico al modelo y organizado por dominios de ingeniería. La unidad principal es el dominio; dentro de él conviven prompts, skills, templates, checklists, playbooks, patrones, anti-patrones y referencias.

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
| [Arquitectura](domains/architecture/README.md) | Decisiones, estilos, modularidad y evolución de sistemas | Prompt y template ADR |
| [Desarrollo de software](domains/software-development/README.md) | Backend, frontend, APIs, integración y refactoring | Índice preparado |
| [Datos](domains/data/README.md) | Modelos, persistencia, migraciones y contratos | Índice preparado |
| [Ingeniería de calidad](domains/quality-engineering/README.md) | Testing, QA, revisión y criterios de cierre | Seis prompts y checklist |
| [Seguridad](domains/security/README.md) | AppSec, supply chain, secretos e IAM | Tres prompts |
| [Entrega y plataforma](domains/delivery-platform/README.md) | CI/CD, releases, contenedores, cloud e infraestructura | Prompt y skill |
| [Confiabilidad y performance](domains/reliability-performance/README.md) | Observabilidad, resiliencia, incidentes y rendimiento | Prompt |
| [Experiencia y accesibilidad](domains/experience-accessibility/README.md) | UX, UI, accesibilidad y arquitectura de información | Referencias |
| [Ingeniería de IA y agentes](domains/ai-agent-engineering/README.md) | Agents-first, contexto, evaluación y automatización | Skill y playbook |
| [Producto y gestión técnica](domains/product-technical-management/README.md) | Discovery, planificación, RFC, riesgo y liderazgo técnico | Índice preparado |
| [Documentación y conocimiento](domains/documentation-knowledge/README.md) | Documentación como código, auditoría y operación | Skill, patrón y anti-patrón |

## Tipos de activo

| Tipo | Úsalo para |
|---|---|
| Prompt | Delegar un objetivo acotado a un agente |
| Skill | Ejecutar una capacidad repetible con entradas y salida definidas |
| Template | Crear un documento o artefacto con estructura consistente |
| Checklist | Verificar un control o momento operativo de forma independiente |
| Playbook | Conducir un proceso con fases y decisiones |
| Pattern | Reutilizar una solución con contexto y trade-offs |
| Anti-pattern | Detectar y corregir una práctica perjudicial |
| Reference | Encontrar fuentes primarias con contexto de uso |

## Índice para herramientas

[`catalog.json`](catalog.json) declara dominios y activos canónicos. El Markdown sigue siendo la fuente de contenido; el manifiesto existe para descubrimiento y validación.

## Contribuir

Lee [cómo contribuir activos](../docs/CONTRIBUTING_ASSETS.md) antes de agregar contenido. No crees carpetas vacías ni activos de relleno.
