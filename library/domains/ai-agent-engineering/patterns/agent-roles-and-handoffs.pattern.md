---
id: ai-agent-engineering.agent-roles-and-handoffs
title: Roles de agentes y contratos de handoff
summary: Definir roles especializados con fronteras de autoridad claras y traspasos verificables sin acoplarse a un runtime propietario.
type: pattern
domain: ai-agent-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [agent-roles, handoffs, multi-agent, delegation]
related: [ai-agent-engineering.subagent-contract, engineering-protocols.work-delegation, engineering-protocols.multi-agent-collaboration, engineering-protocols.independent-review]
lastModified: 2026-11-27
inputs:
  - "Objetivo de ingeniería que requiere múltiples perspectivas o etapas"
  - "Política de permisos del repositorio"
outputs:
  - "Asignación clara de roles, alcance de escritura y contrato de traspaso entre agentes o humanos"
useCases:
  - "Separar implementación de revisión independiente"
  - "Coordinar arquitectura, código, pruebas y auditoría de seguridad en tareas complejas"
---

# Patrón: Roles de Agentes y Contratos de Handoff

Asignar roles explícitos evita que un mismo agente acumule autoridad ilimitada y mejora la trazabilidad sin necesidad de construir un runtime propietario.

## Roles base recomendados

| Rol | Responsabilidad principal | Permisos recomendados | Entregable verificable |
|---|---|---|---|
| **Architect** | Especificaciones, ADRs, fronteras de módulos y análisis de impacto | Solo lectura + edición documental | Spec / ADR aprobado |
| **Implementer** | Código de producción y pruebas unitarias acotadas al alcance | Lectura/escritura en alcance autorizado + tests | Diff + tests en verde |
| **Independent Reviewer** | Auditoría técnica independiente de corrección, contratos y deuda | Solo lectura | Hallazgos por severidad |
| **Security Auditor** | Revisión de secretos, permisos, supply chain y privacidad | Solo lectura + escáneres seguros | Reporte de riesgos y mitigaciones |
| **QA / Release Verifier** | Pruebas de integración, regresión, smoke tests y evidencia final | Ejecución de gates verificados | Registro AFP-004 (`PASS`/`FAIL`) |

## Contrato mínimo de handoff

Todo traspaso entre roles debe incluir:
1. **Alcance y estado real:** rama, commit base y archivos modificados.
2. **Evidencia ejecutada:** comandos corridos y salida observada (nunca solo conclusiones).
3. **Límites y pendientes:** qué no se probó y qué decisiones siguen abiertas.
4. **Criterio de aceptación:** cómo sabe el rol receptor que puede aprobar o devolver la entrega.

## Regla de separación de autoridad

El rol **Implementer** nunca puede certificar su propia entrega como **Independent Reviewer**. Consulta [revisión independiente](../../engineering-protocols/protocols/independent-review.protocol.md) y [delegación de trabajo](../../engineering-protocols/protocols/work-delegation.protocol.md).
