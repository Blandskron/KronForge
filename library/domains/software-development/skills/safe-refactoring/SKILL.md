---
name: safe-refactoring
description: Ejecuta refactorings incrementales preservando comportamiento observable mediante red de pruebas previa, pasos pequeños y verificación continua. Úsala al reducir deuda técnica, simplificar módulos complejos o preparar código legado para nuevas funcionalidades.
license: MIT
allowed-tools: Read Grep Glob Edit Write Bash
metadata:
  framework: agents-first
specRefs:
  - spec: agent-skills
    url: https://agentskills.io/specification
    verified: 2026-11-27
id: software-development.safe-refactoring
title: Refactoring seguro e incremental
summary: Mejorar estructura interna sin alterar comportamiento externo mediante red de pruebas y pasos reversibles.
type: skill
domain: software-development
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [refactoring, technical-debt, maintainability, brownfield]
related: [software-development.brownfield-delta-change, quality-engineering.test-driven-development, software-development.consumer-compatibility]
lastModified: 2026-11-27
inputs:
  - "Módulo objetivo y razón concreta del refactoring"
  - "Suite de pruebas existente"
outputs:
  - "Código simplificado con contratos preservados y pruebas en verde tras cada incremento"
useCases:
  - "Dividir un módulo monolítico en unidades cohesivas"
  - "Eliminar duplicación antes de añadir una nueva capacidad"
---

# Skill: Safe Refactoring

Refactorizar cambia la estructura interna **sin alterar el comportamiento observable**. Nunca mezcles refactoring estructural con nuevas funcionalidades en el mismo paso.

## Procedimiento

1. **Confirmar red de seguridad:** ejecuta las pruebas existentes antes de tocar código. Si el comportamiento actual carece de cobertura, añade pruebas de caracterización primero.
2. **Definir el objetivo acotado:** nombra qué problema estructural resuelves (acoplamiento, duplicación, complejidad) y qué interfaces públicas deben mantenerse intactas.
3. **Aplicar pasos pequeños y reversibles:** realiza una transformación limpia a la vez (extraer función/módulo, simplificar flujo, eliminar código muerto) y ejecuta las pruebas tras cada paso.
4. **Verificar compatibilidad:** confirma que firmas, exportaciones, CLI y formatos de salida siguen siendo compatibles.

## Restricciones

- No cambies comportamiento de negocio "de paso" durante un refactoring.
- Si una prueba falla, revierte el último incremento pequeño en lugar de acumular parches.
