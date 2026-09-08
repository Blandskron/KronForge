---
id: engineering-protocols.handoff-receipt
title: Recibo de handoff entre participantes
summary: Transferir trabajo a otro participante sin depender de la conversación anterior.
type: template
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [handoff, transferencia, contexto, continuidad]
related:
  - engineering-protocols.work-delegation
  - engineering-protocols.multi-agent-collaboration
---

# Handoff — Tarea [ID]

- **Emitido por:** [rol lógico y, si existe, identidad verificable]
- **Fecha:** YYYY-MM-DD
- **Estado del trabajo:** COMPLETO | BLOQUEADO | REQUIERE_REVISIÓN | REQUIERE_DECISIÓN | CANDIDATO_INVÁLIDO | DIFERIDO | SUSTITUIDO

## Qué se pidió

[Referencia al contrato de delegación. No lo copies.]

## Qué se inspeccionó

- [Qué se leyó antes de decidir]

[Esto ahorra al siguiente participante repetir la observación.]

## Qué se decidió

- [Decisión tomada y su razón]

[Si una decisión es duradera y arquitectónica, no pertenece aquí: regístrala como decisión y cítala.]

## Qué cambió

- `[archivo o superficie]`
- `[archivo o superficie]`

## Qué se intentó y se descartó

- [Camino explorado] — descartado porque [razón]

[El campo que más se omite y más tiempo ahorra. Sin él, el siguiente repite el camino.]

## Evidencia

| Compuerta | Comando | Resultado |
|---|---|---|
| [compuerta] | `[comando exacto]` | [observación exacta] |

[Solo lo que se ejecutó realmente. Una compuerta no ejecutada se declara como NOT_RUN con su razón.]

## Qué falta

- [Trabajo pendiente, explícito]

## Qué no debe cambiarse

- [Invariante que el siguiente podría romper sin saberlo, y por qué existe]

## Riesgos que permanecen

- [Riesgo conocido y no resuelto]

## Siguiente acción recomendada

[Qué haría el emisor si continuara.]

> Elimina las instrucciones entre corchetes al completar el recibo. Un handoff es transitorio: no lo conviertas en fuente de verdad duradera.
