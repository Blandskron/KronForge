---
id: context-engineering.context-layers
title: Capas de contexto
summary: Separar fuentes, selección, transformación y entrega del contexto.
type: architecture-note
domain: context-engineering
status: stable
version: 1.0.1
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [context, routing, retrieval, memory]
related: [context-engineering.progressive-context]
lastModified: 2026-11-25
inputs:
  - "Reglas persistentes, estado del proyecto y tarea activa"
  - "Fuentes que se pueden consultar bajo demanda"
outputs:
  - "Mapa de capas de contexto"
  - "Orden de carga y fuentes de verdad"
useCases:
  - "Organizar el contexto de un proyecto sin mezclar reglas con datos transitorios"
---

# Architecture Note: Capas de Contexto

## Problema

Tratar el contexto como un bloque único mezcla información relevante, ruido, datos sensibles y contenido obsoleto. El resultado consume presupuesto y dificulta explicar por qué un agente recibió cierta información.

## Arquitectura

### 1. Fuentes

- archivos y contratos del repositorio;
- solicitud y decisiones de la conversación;
- resultados de herramientas;
- memoria de tarea u organización;
- retrieval desde fuentes autorizadas.

Cada fuente declara propietario, sensibilidad, vigencia y forma de actualización.

### 2. Selección

El router decide qué fuentes necesita la tarea según:

- objetivo y fase;
- alcance del agente;
- permisos;
- frescura;
- costo y presupuesto;
- riesgo de omisión.

### 3. Transformación

El contenido seleccionado puede normalizarse, deduplicarse, resumirse o dividirse. Toda transformación debe conservar enlaces a la fuente y distinguir texto literal de síntesis.

### 4. Entrega

El paquete final define:

- orden;
- formato;
- prioridad;
- presupuesto;
- instrucciones aplicables;
- criterio para solicitar contexto adicional.

## Flujo

```text
Fuentes -> Política y routing -> Transformación -> Paquete de contexto -> Agente
                      ^                                  |
                      +---------- evidencia -------------+
```

## Decisiones

- La selección ocurre por tarea, no por disponibilidad.
- Los secretos no se incorporan solo porque sean accesibles.
- Un resumen no reemplaza la fuente cuando la precisión textual es crítica.
- El agente puede pedir contexto adicional; no debe completar vacíos como hechos.

## Señales de calidad

- se puede explicar por qué cada elemento fue incluido;
- la fuente original permanece localizable;
- información obsoleta o fuera de alcance queda excluida;
- el paquete cabe en el presupuesto sin perder restricciones críticas;
- la salida cita evidencia suficiente para revisión.
