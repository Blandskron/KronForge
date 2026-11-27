---
name: structured-code-review
description: Realiza revisiones de código estructuradas e independientes priorizando seguridad, corrección, contratos, pruebas y mantenibilidad con evidencia por archivo y línea. Úsala antes de aprobar un PR o tras completar un cambio relevante.
license: MIT
allowed-tools: Read Grep Glob Bash
metadata:
  framework: agents-first
specRefs:
  - spec: agent-skills
    url: https://agentskills.io/specification
    verified: 2026-11-27
id: quality-engineering.structured-code-review
title: Revisión estructurada de código
summary: Auditar diffs por severidad técnica (seguridad, contratos, pruebas, mantenibilidad) con hallazgos accionables.
type: skill
domain: quality-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [code-review, quality, security, verification]
related: [quality-engineering.code-quality-review, quality-engineering.pre-merge, engineering-protocols.independent-review]
lastModified: 2026-11-27
inputs:
  - "Diff o lista de archivos modificados"
  - "Especificación, issue o contexto del cambio"
outputs:
  - "Lista priorizada de hallazgos (Bloqueante / Importante / Sugerencia) con archivo, evidencia y propuesta"
useCases:
  - "Revisar un pull request antes del merge"
  - "Ejecutar una revisión independiente de cambios generados por otro agente"
---

# Skill: Structured Code Review

Separa hechos verificables de preferencias de estilo y prioriza riesgos reales.

## Orden de inspección

1. **Corrección y contratos:** ¿cumple los requisitos? ¿rompe compatibilidad pública o esquemas?
2. **Seguridad y privacidad:** validación de entradas, secretos, permisos mínimos, path traversal, inyecciones y manejo de errores.
3. **Pruebas y evidencia:** ¿existen pruebas que fallen sin el cambio? ¿se ejecutaron realmente los checks?
4. **Mantenibilidad y alcance:** complejidad innecesaria, duplicación, efectos secundarios fuera de alcance.

## Formato de hallazgos

Clasifica cada hallazgo explícitamente:
- **Bloqueante:** impide merge (bug, vulnerabilidad, ruptura silenciosa, pruebas ausentes o falsas).
- **Importante:** debe corregirse o registrarse como deuda técnica aceptada.
- **Sugerencia:** mejora opcional no bloqueante.

## Restricciones

- Cita siempre la ruta y línea exacta que respalda cada hallazgo.
- No apruebes un cambio cuyas compuertas obligatorias no hayan sido ejecutadas (`NOT_RUN`).
- Si eres el mismo agente que escribió el código, declara explícitamente que se trata de una autorrevisión y no de una revisión independiente.
