---
id: engineering-protocols.evidence-record
title: Registro de evidencia de compuerta
summary: Registrar qué se ejecutó, qué se observó y contra qué estado del código, para que la evidencia pueda caducar.
type: template
domain: engineering-protocols
status: stable
version: 1.0.1
difficulty: foundation
projects: [any]
compatibility: stack-agnostic
models: [any]
tags: [evidencia, compuertas, verificacion, caducidad]
related:
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.release-readiness
inputs:
  - Identificador del estado del código
  - Comandos ejecutados
  - Observaciones y artefactos
outputs:
  - Registro de compuertas
  - Límites y condiciones de caducidad
useCases:
  - Entrega de evidencia a un revisor
---

# Registro de evidencia — [tarea o candidato]

- **Confirmación:** `[identificador exacto del estado del código]`
- **Fecha:** YYYY-MM-DD
- **Producido por:** [rol lógico]
- **Superficies cubiertas:** `[rutas]` | no declaradas

[La confirmación es lo que permite que este registro caduque. Sin ella, el registro afirma algo sobre un código que ya no se puede identificar.]

## Entorno

| Aspecto | Valor |
|---|---|
| Sistema | [sistema y versión] |
| Plataforma de ejecución | [versión exacta] |
| Registro autoritativo | local | integración continua |

## Compuertas

| Compuerta | Clase | Comando | Observación | Veredicto |
|---|---|---|---|---|
| [pregunta que responde] | automática / evidencia / manual | `[comando exacto]` | [salida exacta o recuento] | PASS / FAIL / NOT_RUN / STALE / NEEDS_REVIEW |

[Registra la observación, no un resumen. «1842 passed» es una observación; «todo verde» no lo es.]

## Compuertas no ejecutadas

| Compuerta | Razón | Efecto |
|---|---|---|
| [compuerta] | [por qué no pudo ejecutarse] | [qué queda sin demostrar] |

[NOT_RUN es un veredicto legítimo. Convertirlo en PASS es el fallo que este registro existe para impedir.]

## Artefactos

| Artefacto | Identidad |
|---|---|
| [nombre] | [versión y hash] |

## Qué no se validó

- [Límite explícito de este registro]

## Caducidad

Este registro deja de ser válido cuando cambian las superficies cubiertas. Al cambiar, se reporta como `STALE` y se re-ejecuta; no se arrastra como aprobado.

> Elimina las instrucciones entre corchetes al completar el registro. Una compuerta marcada como satisfecha sin evidencia es un error, no una advertencia.
