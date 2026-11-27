---
id: software-development.brownfield-delta-change
title: Gestión de cambios incrementales en sistemas existentes (Brownfield)
summary: Evolucionar bases de código existentes separando la verdad viva de propuestas de cambio aisladas con deltas, impacto y rollback.
type: playbook
domain: software-development
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [brownfield, change-management, delta-spec, rollback]
related: [product-technical-management.feature-spec, software-development.consumer-compatibility, software-development.safe-refactoring]
lastModified: 2026-11-27
inputs:
  - "Repositorio existente con comportamiento en producción"
  - "Necesidad de cambio o corrección"
outputs:
  - "Propuesta de cambio con delta de especificación, análisis de impacto, pruebas y plan de rollback"
useCases:
  - "Modificar un sistema legado sin romper consumidores existentes"
  - "Coordinar cambios paralelos sin corromper la documentación viva"
---

# Playbook: Cambio Incremental en Sistemas Existentes (Brownfield)

En proyectos existentes (*brownfield*), reescribir especificaciones completas o modificar código sin aislar el delta introduce regresiones silenciosas. Este playbook separa la **verdad viva** del **cambio en curso**.

## Principio operativo

1. **Verdad viva (`docs/specs/`):** describe cómo se comporta el sistema hoy.
2. **Cambio aislado (`docs/changes/<change-id>/`):** contiene solo lo que cambia (`proposal.md`, `delta-spec.md`, `tasks.md` y plan de rollback).
3. **Consolidación (`archive`):** solo después de pasar pruebas y revisión, el delta se integra en la verdad viva.

## Fases obligatorias

### 1. Explorar y fijar línea base
- Lee el código real, pruebas existentes y contratos públicos afectados.
- Ejecuta la suite de pruebas actual y registra su resultado como línea base.

### 2. Redactar propuesta y análisis de impacto
- Identifica consumidores, APIs, schemas, migraciones de datos y efectos secundarios.
- Clasifica compatibilidad (`compatible`, `deprecación`, `ruptura que requiere aprobación`).

### 3. Definir delta y plan de rollback
- Describe únicamente lo que se añade, modifica o retira respecto al comportamiento vigente.
- Documenta cómo revertir código, configuración y datos si falla la verificación.

### 4. Implementar en incrementos pequeños y verificables
- Aplica cambios acotados con pruebas de regresión que cubran tanto el comportamiento nuevo como el previo.

### 5. Verificar, consolidar y archivar
- Confirma que todos los checks reales pasan sin relajar controles.
- Integra el delta en la documentación viva y registra el cambio en el changelog.
