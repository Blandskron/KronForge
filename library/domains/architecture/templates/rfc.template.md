---
id: architecture.rfc
title: Request for Comments
summary: Abrir una pregunta de diseño antes de convertirla en decisión, con alternativas y preguntas sin resolver.
type: template
domain: architecture
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [rfc, propuesta, diseno, decisiones]
related:
  - architecture.adr
  - engineering-protocols.decision-records
---

# RFC-NNNN: [Título]

- **Estado:** Borrador | En discusión | En revisión | Aceptado | Rechazado
- **Fecha:** YYYY-MM-DD
- **Autor:** [rol o persona]
- **Decisión resultante:** [ADR-NNN, o «pendiente»]

## Motivación

[Por qué esta pregunta importa ahora. Qué la hace urgente o inevitable.]

## Problema

[Qué está mal o falta hoy. Observable, no abstracto.]

## Alcance

- Cubre: [qué]
- No cubre: [qué]

## Diseño propuesto

[La propuesta concreta. Suficiente detalle para evaluarla, no para implementarla.]

## Alternativas

### [Alternativa]

- Beneficios:
- Costos:
- Por qué no es la propuesta principal:

[Una propuesta sin alternativas evaluadas es una decisión buscando aprobación.]

## Compatibilidad

[Qué se rompe. Si nada se rompe, dilo explícitamente.]

## Migración

[Cómo pasa quien ya usa lo anterior. Omitir solo si no hay usuarios previos.]

## Seguridad

[Qué superficie, autoridad o frontera de confianza cambia.]

## Impacto operativo

[Qué cambia para quien opera, despliega o mantiene el sistema.]

## Preguntas abiertas

- [Pregunta que esta propuesta no resuelve]

[La sección que distingue una propuesta honesta de una decisión disfrazada. Si no tienes ninguna, revisa si esto ya era una decisión.]

## Proceso de aceptación

- Quién decide: [rol]
- Qué evidencia hace falta para decidir: [qué]
- Qué ocurre al aceptarse: se registra como ADR y esta propuesta lo nombra.

> Elimina las instrucciones entre corchetes al completar la propuesta. Una RFC contiene una pregunta abierta; cuando la pregunta se responde, la respuesta pertenece a un ADR y esta RFC debe citarlo.
