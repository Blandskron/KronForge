---
id: architecture.project-constitution
title: Constitución del proyecto
summary: Definir principios innegociables, fronteras técnicas, permisos y criterios de calidad que rigen toda especificación y cambio.
type: template
domain: architecture
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [constitution, spec-driven, governance, architecture]
related: [architecture.adr, product-technical-management.feature-spec, engineering-protocols.evidence-and-gates]
lastModified: 2026-11-27
inputs:
  - "Propósito del producto o sistema"
  - "Restricciones legales, de seguridad y de arquitectura vigentes"
outputs:
  - "Documento constitucional versionado que actúa como norma superior de specs y agentes"
useCases:
  - "Establecer guardrails antes de usar Spec-Driven Development"
  - "Alinear personas y agentes sobre reglas que ninguna tarea puede relajar"
---

# Constitución del Proyecto

> Este documento define los principios innegociables del proyecto. Ninguna especificación, plan ni cambio generado por humanos o agentes puede contradecirlo sin una decisión arquitectónica aprobada (ADR).

## 1. Propósito y fronteras del sistema

- **Objetivo del sistema:**
- **Qué NO es este sistema (exclusiones explícitas):**
- **Stack verificado y dependencias permitidas:**

## 2. Invariantes de calidad y seguridad

- Ningún cambio se aprueba sin pruebas reproducibles ejecutadas sobre el código real.
- Ningún secreto, credencial o dato personal real se guarda en el repositorio ni en logs.
- Toda operación destructiva, migración irreversible o publicación externa requiere aprobación humana explícita.
- No se relajan pruebas, validaciones ni controles de seguridad para forzar un estado en verde.

## 3. Reglas de arquitectura y compatibilidad

- **Contratos públicos que deben preservar compatibilidad:**
- **Política de dependencias:** (justificación obligatoria, licencia permitida, auditoría previa)
- **Estrategia de versionado y deprecación:**

## 4. Contrato para agentes

- Leer `AGENTS.md`, esta constitución y la especificación activa antes de modificar código.
- Separar siempre evidencia verificada, inferencias y pendientes.
- Detenerse y consultar si una especificación entra en conflicto con esta constitución.

## 5. Proceso de enmienda

Toda modificación a esta constitución requiere un [ADR](adr.template.md) aprobado por el maintainer responsable y actualización del changelog.
