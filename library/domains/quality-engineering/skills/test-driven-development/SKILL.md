---
name: test-driven-development
description: Guía la implementación estricta mediante Test-Driven Development (Red-Green-Refactor) escribiendo pruebas verificables antes del código de producción. Úsala al implementar nuevas funcionalidades, corregir bugs reproducibles o blindar contratos críticos.
license: MIT
allowed-tools: Read Grep Glob Edit Write Bash
metadata:
  framework: agents-first
specRefs:
  - spec: agent-skills
    url: https://agentskills.io/specification
    verified: 2026-11-27
id: quality-engineering.test-driven-development
title: Desarrollo guiado por pruebas (TDD)
summary: Aplicar el ciclo Red-Green-Refactor con pruebas verificables antes de escribir código de producción.
type: skill
domain: quality-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [tdd, testing, quality, workflow]
related: [quality-engineering.unit-tests, quality-engineering.pre-merge, software-development.safe-refactoring]
lastModified: 2026-11-27
inputs:
  - "Requisito o criterio de aceptación verificable"
  - "Comando real de pruebas del repositorio"
outputs:
  - "Pruebas automatizadas que fallaron antes de implementar y pasan tras el cambio"
  - "Evidencia reproducible de la ejecución Red -> Green -> Refactor"
useCases:
  - "Implementar una funcionalidad con contrato claro"
  - "Corregir un defecto garantizando no regresión"
---

# Skill: Test-Driven Development (Red → Green → Refactor)

Aplica esta skill para construir cambios verificables con evidencia real de fallo previo y solución mínima.

## Regla de oro

Ningún código de producción se escribe antes de tener una prueba automatizada que reproduzca el requisito y falle por la razón esperada.

## Procedimiento

1. **Detectar el comando real de pruebas:** verifica en el repositorio qué runner existe (`npm test`, `pytest`, `go test`, `cargo test`, etc.). Nunca inventes comandos.
2. **Fase RED:** escribe la prueba más pequeña que expresa el comportamiento esperado o reproduce el bug. Ejecútala y confirma que **falla por el motivo correcto** (no por error de sintaxis o import).
3. **Fase GREEN:** escribe el código mínimo y claro necesario para que la nueva prueba y la suite existente pasen.
4. **Fase REFACTOR:** limpia duplicación, nombres y estructura manteniendo todas las pruebas en verde sin cambiar comportamiento externo.
5. **Evidencia:** reporta el comando exacto ejecutado, el fallo observado en RED y el resultado final en GREEN/REFACTOR.

## Restricciones

- No modifiques ni debiliten aserciones existentes para forzar un paso en verde.
- No uses mocks que oculten el comportamiento real bajo prueba cuando existe un fixture liviano reproducible.
- Si una prueba no puede ejecutarse en el entorno actual, repórtala explícitamente como `NOT_RUN`.
