---
id: context-engineering.token-budget-context-routing
title: Enrutamiento de contexto por presupuesto de tokens
summary: Seleccionar y entregar solo el contexto relevante por niveles de divulgación progresiva para reducir consumo innecesario de tokens y ruido.
type: pattern
domain: context-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [context-routing, token-budget, progressive-disclosure, context-engineering]
related: [context-engineering.context-layers, context-engineering.progressive-context, context-engineering.just-in-time-retrieval, context-engineering.project-memory]
lastModified: 2026-11-27
inputs:
  - "Inventario de documentos y convenciones del repositorio"
  - "Descripción acotada de la tarea y presupuesto objetivo de tokens"
outputs:
  - "Conjunto mínimo priorizado de archivos de contexto por nivel y lista de referencias diferidas"
useCases:
  - "Evitar saturar la ventana de contexto al iniciar una sesión de agente"
  - "Priorizar seguridad, arquitectura o memoria según la tarea solicitada"
---

# Patrón: Enrutamiento de Contexto por Presupuesto de Tokens

Cargar toda la documentación de un repositorio en cada sesión degrada la precisión del agente, aumenta latencia y consume tokens sin aportar valor. Este patrón clasifica el contexto en tres niveles y selecciona solo lo pertinente para la tarea.

## Niveles de divulgación progresiva

1. **Tier 1 — Siempre (`entrypoint`):** `AGENTS.md` breve (<300 líneas) y mapa mínimo del repositorio.
2. **Tier 2 — Bajo demanda (`on-demand`):** convenciones detectadas (`.editorconfig`, `tsconfig.json`, `pyproject.toml`), políticas (`SECURITY.md`, `CONTRIBUTING.md`) y adaptadores delgados.
3. **Tier 3 — Referencia profunda (`deep-reference`):** ADRs individuales, especificaciones, memoria histórica y catálogos detallados, cargados únicamente cuando la tarea los referencia.

## Reglas de selección

- Priorizar Tier 1 sin exceder el presupuesto acordado.
- Puntuar Tier 2 y Tier 3 por afinidad con la tarea (por ejemplo: seguridad, arquitectura, migraciones, memoria).
- Exponer explícitamente qué archivos quedaron **diferidos** (`deferred`) para que el agente pueda abrirlos bajo demanda si la tarea lo exige.
- Detectar y corregir adaptadores que dupliquen reglas en lugar de enlazar `AGENTS.md`.
