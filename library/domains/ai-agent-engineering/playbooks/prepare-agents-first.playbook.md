---
id: ai-agent-engineering.prepare-agents-first
title: Preparar un repositorio agents-first
summary: Reducir incertidumbre para agentes sin perjudicar la experiencia humana.
type: playbook
domain: ai-agent-engineering
status: stable
version: 1.0.1
difficulty: foundation
projects: [new, existing, legacy, monorepo]
compatibility: model-agnostic
models: [any]
tags: [agents-first, documentation]
related: [documentation-knowledge.documentation-audit]
lastModified: 2026-11-25
inputs:
  - "Repositorio accesible en lectura"
  - "Objetivo de preparación e instrucciones existentes"
outputs:
  - "Diagnóstico con evidencia"
  - "Mapa de archivos y permisos"
  - "Cambios autorizados y validaciones registradas"
useCases:
  - "Preparar un repositorio existente para colaboradores humanos y agentes"
---

# Playbook: Preparar un Repositorio Agents-First

## Objetivo

Hacer que humanos y agentes puedan comprender, modificar y validar un repositorio con seguridad y evidencia local.

## Precondiciones

- Acceso de lectura al repositorio.
- Responsable humano para aprobar acciones sensibles.
- Capacidad de ejecutar validaciones reales cuando existan.

## Fase 1 — Auditar

1. Lee raíces, manifests, CI, documentación e instrucciones existentes.
2. Detecta propósito, stack, límites, comandos reales y áreas sensibles.
3. Clasifica documentación vigente, incompleta, contradictoria, histórica y obsoleta.
4. Registra pendientes sin convertirlos en hechos.

**Salida:** diagnóstico de solo lectura con evidencia.

## Fase 2 — Diseñar

1. Define entradas breves para humanos y agentes.
2. Lleva detalles a documentos especializados solo si reducen incertidumbre.
3. Declara permisos, pruebas, seguridad y operación aplicables.
4. Presenta archivos a crear, actualizar, conservar o retirar.

**Punto de decisión:** obtén aprobación antes de eliminaciones, cambios productivos o incompatibilidades.

## Fase 3 — Implementar

1. Migra información útil antes de retirar documentos.
2. Crea enlaces entre entradas y fuentes especializadas.
3. No inventes comandos ni completes vacíos con contenido aspiracional.
4. Mantén adaptadores específicos de herramientas pequeños y opcionales.

## Fase 4 — Validar

1. Ejecuta pruebas y validadores que el repositorio realmente declare.
2. Verifica enlaces, bloques Markdown, referencias y secretos.
3. Revisa el diff y documenta lo no validado.

## Rollback

Si la nueva documentación contradice la implementación o rompe flujos de descubrimiento, conserva el contenido anterior, marca la contradicción y revierte solo los archivos documentales afectados mediante un cambio revisable. No reescribas historial.

## Criterios de salida

- propósito, comandos y límites son encontrables;
- los agentes saben qué pueden modificar y qué requiere aprobación;
- humanos conservan un README claro;
- la evidencia de validación es reproducible;
- no quedan rutas internas rotas ni secretos expuestos.
