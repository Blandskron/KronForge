---
id: documentation-knowledge.documentation-as-code
title: Documentación como código
summary: Mantener documentación versionada, revisable y validable junto al sistema.
type: pattern
domain: documentation-knowledge
status: stable
version: 1.0.1
difficulty: foundation
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [documentation, governance]
related: [documentation-knowledge.documentation-audit]
lastModified: 2026-11-25
inputs:
  - "Documentación ligada a cambios del producto"
  - "Flujo de revisión y versionado del repositorio"
outputs:
  - "Proceso de revisión documental junto con el código"
  - "Controles de consistencia y vigencia"
useCases:
  - "Mantener documentación que evoluciona con el código"
---

# Patrón: Documentación como Código

## Descripción

Gestionar documentación con el mismo ciclo de cambios, revisión, versionado y validación que los artefactos del repositorio.

## Cuándo usarlo

- Cuando la documentación cambia junto al código o configuración.
- Cuando rutas, comandos o contratos deben revisarse en el mismo diff.
- Cuando agentes necesitan una fuente local y trazable.

## Cuándo evitarlo

- Para conocimiento restringido que no puede residir en el repositorio.
- Cuando una fuente externa es canónica y duplicarla generaría divergencia.

## Ventajas

- Historia y autoría visibles.
- Revisión contextual.
- Enlaces y formato validables.
- Menor distancia entre implementación y explicación.

## Desventajas

- Requiere disciplina de actualización.
- Markdown no reemplaza herramientas especializadas para todo tipo de contenido.
- Puede fragmentar conocimiento si no existe navegación.

## Ejemplo

Un cambio de configuración actualiza en el mismo diff el archivo de ejemplo, el runbook y la prueba del enlace. El README enlaza al runbook en vez de copiarlo.

## Fuerzas y trade-offs

La cercanía mejora consistencia, pero no convierte cada detalle en documentación permanente. Se documenta lo que reduce riesgo o incertidumbre.
