---
id: hooks-workflows.explicit-validation-hook
title: Hook de validación explícito
summary: Ejecutar controles reproducibles sin ocultar efectos ni alterar el resultado validado.
type: pattern
domain: hooks-workflows
status: stable
version: 1.0.1
difficulty: foundation
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [hooks, validation, automation]
related: [quality-engineering.pre-merge]
lastModified: 2026-11-25
inputs:
  - "Disparador y alcance de validación"
  - "Comandos reales y política ante fallos"
outputs:
  - "Contrato de hook con comandos, efectos y resultado esperado"
useCases:
  - "Automatizar una validación repetible con efectos explícitos"
---

# Pattern: Hook de Validación Explícito

## Problema

Una tarea necesita validaciones repetibles, pero automatizarlas puede esconder comandos, mutaciones o fallos.

## Solución

Define el hook como contrato:

- **Trigger:** evento exacto que lo activa.
- **Entradas:** archivos, diff o artefacto validado.
- **Acción:** comando real y directorio.
- **Efectos:** lectura o escritura esperada.
- **Resultado:** estados y evidencia.
- **Fallo:** bloqueo, advertencia o retry.
- **Autoridad:** permisos y aprobación requerida.

El hook valida; no modifica silenciosamente aquello que está validando.

## Cuándo usarlo

- controles pre-merge;
- validación documental;
- comprobaciones post-task;
- gates de release.

## Cuándo evitarlo

- acciones irreversibles sin confirmación;
- procesos no idempotentes sin protección;
- validaciones que requieren juicio humano no reducible a reglas.

## Ventajas

- reproducibilidad;
- fallos comprensibles;
- integración independiente de herramienta;
- evidencia consistente.

## Desventajas

- mantenimiento adicional;
- latencia;
- riesgo de falsa confianza si la cobertura no está documentada.

## Ejemplo

Un hook post-task resuelve enlaces Markdown y devuelve rutas rotas. No reescribe enlaces automáticamente ni marca la tarea como aprobada.
