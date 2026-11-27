---
id: product-technical-management.feature-spec
title: Especificación funcional y técnica trazable
summary: Definir requisitos, criterios de aceptación verificables, diseño acotado y matriz de trazabilidad hacia pruebas y evidencias.
type: template
domain: product-technical-management
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [spec-driven, requirements, acceptance-criteria, traceability]
related: [architecture.project-constitution, product-technical-management.change-brief, engineering-protocols.evidence-and-gates]
lastModified: 2026-11-27
inputs:
  - "Problema o necesidad validada"
  - "Constitución del proyecto y restricciones existentes"
outputs:
  - "Especificación versionada con IDs de requisitos, criterios de aceptación y trazabilidad a pruebas"
useCases:
  - "Iniciar una funcionalidad nueva bajo Spec-Driven Development"
  - "Acotar alcance y criterios de aceptación antes de implementar"
---

# Especificación: [ID-SPEC] — [Título]

- **Estado:** `draft` | `approved` | `implemented` | `archived`
- **Responsable:**
- **Constitución / ADRs aplicables:**

## 1. Contexto y objetivo

- **Problema observado:**
- **Resultado medible esperado:**
- **Fuera de alcance:**

## 2. Requisitos y criterios de aceptación

| ID | Requisito | Criterio de aceptación verificable | Prioridad |
|---|---|---|---|
| `REQ-001` | Descripción concreta del comportamiento | Dado [contexto], cuando [acción], entonces [resultado comprobable] | P0 |
| `REQ-002` | Restricción de seguridad, rendimiento o compatibilidad | Condición negativa o límite verificable | P0 |

## 3. Contratos e interfaces afectadas

- **Entradas / salidas / APIs / CLI:**
- **Compatibilidad hacia atrás:**
- **Riesgos y mitigaciones:**

## 4. Plan de tareas atómicas

- [ ] `T1`: ...
- [ ] `T2`: ...

## 5. Matriz de trazabilidad y evidencia

| Requisito | Archivos modificados | Prueba automatizada / verificación | Veredicto (`PASS`/`FAIL`/`NOT_RUN`) |
|---|---|---|---|
| `REQ-001` | `ruta/archivo` | `comando o test exacto` | `NOT_RUN` |
| `REQ-002` | `ruta/archivo` | `comando o test exacto` | `NOT_RUN` |
