---
id: engineering-protocols.completion-and-stop
title: Completitud, falla y detención
summary: Definir cuándo una tarea terminó, cuándo debe detenerse y con qué evidencia se declara cada resultado.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [falla, detencion, completitud, bloqueo, escalamiento]
related:
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.work-delegation
  - engineering-protocols.repository-state
protocol:
  code: AFP-011
  maturity: experimental
  actors: [executor, reviewer, human-owner]
  dependsOn: [AFP-004]
  observedIn: [agnara]
  lastValidated: 2026-09-07
---

# AFP-011 — Completitud, Falla y Detención

Un protocolo que solo describe qué hacer cuando todo funciona no es un protocolo. Este define los resultados posibles de una unidad de trabajo, incluidos los que no son «terminado».

## Problema

Un participante que no puede completar una tarea tiene dos salidas malas y una buena. Las malas: declarar éxito de todos modos, o quedarse en silencio. La buena —declarar el estado real con la evidencia que lo sostiene— requiere que exista un vocabulario para hacerlo.

Sin ese vocabulario, «no pude verificar esto» no tiene forma de expresarse como resultado legítimo, y la presión hacia el resultado favorable es constante: un agente entrenado para ser útil interpreta «no terminé» como fallo propio, y busca la formulación que más se parezca a haber terminado.

El coste no lo paga quien declara. Lo paga el siguiente, que construye sobre una premisa falsa.

## Actores

| Actor | Responsabilidad |
|---|---|
| Executor | Declara el resultado real con su evidencia. |
| Reviewer | Verifica que el resultado declarado corresponda a la evidencia. |
| Human owner | Decide lo que ningún resultado automático puede decidir. |

## Ciclo de vida

```text
en ejecución
   ├─→ COMPLETO
   ├─→ BLOQUEADO
   ├─→ REQUIERE_REVISIÓN
   ├─→ REQUIERE_DECISIÓN
   ├─→ CANDIDATO_INVÁLIDO
   ├─→ DIFERIDO
   └─→ SUSTITUIDO
```

Ninguno de estos estados es un fallo del participante. El único fallo es declarar uno que no corresponde.

## Vocabulario de resultados

| Estado | Significado | Evidencia obligatoria |
|---|---|---|
| `COMPLETO` | Criterios de aceptación satisfechos y compuertas aprobadas. | Evidencia de cada compuerta obligatoria. |
| `BLOQUEADO` | No se puede avanzar por una causa externa. | Qué falta, qué se intentó, qué compuerta queda afectada. |
| `REQUIERE_REVISIÓN` | Trabajo hecho, pendiente de revisión independiente. | Diferencia, evidencia y nivel de revisión posible. |
| `REQUIERE_DECISIÓN` | Hay una elección que el ejecutor no tiene autoridad para tomar. | Opciones, consecuencias y recomendación. |
| `CANDIDATO_INVÁLIDO` | Una validación descalificó el resultado. | Qué validación, con qué observación. |
| `DIFERIDO` | Deliberadamente pospuesto. | Razón y condición de reanudación. |
| `SUSTITUIDO` | Otro trabajo lo dejó sin objeto. | Qué lo sustituye. |

`COMPLETO` es el único que exige evidencia de todas las compuertas obligatorias. Los demás exigen evidencia de por qué no se llegó ahí, que suele ser más informativa.

Un ejemplo de declaración completa de bloqueo:

```markdown
ESTADO: BLOQUEADO

Razón:
La verificación multiplataforma no puede ejecutarse: el entorno de una de
las plataformas declaradas no está disponible.

Intentado:
Ejecución local en las otras dos plataformas: aprobada.

Evidencia faltante:
Compatibilidad en la plataforma no disponible.

Compuerta afectada:
Empaquetado multiplataforma.

Siguiente acción recomendada:
Esperar el registro autoritativo antes de integrar.
```

Compárese con la alternativa que este protocolo existe para impedir: «Todo funciona correctamente.»

## Condiciones de detención

Situaciones en las que la respuesta correcta es detenerse, no insistir:

| Situación | Estado | Por qué detenerse |
|---|---|---|
| Los requisitos se contradicen | `REQUIERE_DECISIÓN` | Elegir uno es decidir sin autoridad. |
| Falta evidencia y no puede obtenerse | `BLOQUEADO` | Continuar produce una compuerta falsamente verde. |
| El registro autoritativo no puede ejecutarse | `BLOQUEADO` | Los resultados locales no lo sustituyen. |
| Una dependencia externa no está disponible | `BLOQUEADO` | Simular la dependencia valida la simulación. |
| Otro participante modificó la misma área | `REQUIERE_REVISIÓN` | Reconciliar antes de continuar. |
| La arquitectura es ambigua | `REQUIERE_DECISIÓN` | Implementar cementa una decisión no tomada. |
| Aparece un riesgo de seguridad | `REQUIERE_REVISIÓN` | Exige revisión con perfil de seguridad. |
| Una validación falla | `CANDIDATO_INVÁLIDO` | Es el resultado, no un obstáculo. |
| El alcance crece inesperadamente | `REQUIERE_DECISIÓN` | Ampliar el alcance unilateralmente rompe el contrato. |
| Una compuerta exigida no puede demostrarse | `BLOQUEADO` | Es exactamente lo que el protocolo prohíbe declarar aprobado. |

### El principio

> No fabricar completitud.

Un participante que no puede demostrar que terminó, no terminó. La afirmación de haber terminado no es una conclusión que se derive del esfuerzo invertido.

Su corolario práctico: detenerse conserva el trabajo. Antes de detenerse, el ejecutor preserva el estado alcanzado, registra la evidencia obtenida y emite el handoff correspondiente bajo [AFP-002](work-delegation.protocol.md). Un bloqueo bien documentado es trabajo entregado; un bloqueo silencioso es trabajo perdido.

### Qué no es una condición de detención

Estas situaciones exigen continuar, no detenerse:

- la tarea resultó más difícil de lo estimado;
- la solución no es elegante;
- existe una alternativa que parece mejor pero está fuera de alcance;
- una compuerta falló y puede corregirse.

Detenerse ante estas produce el fallo opuesto: tareas abandonadas a medias que otro debe reconstruir. La detención es para lo que no se puede resolver dentro del contrato, no para lo que resulta incómodo.

## Escalamiento

Un escalamiento válido contiene: el estado, la evidencia obtenida, lo que falta, qué compuerta queda afectada, las opciones consideradas y una recomendación.

Escalar sin recomendación traslada el trabajo de análisis a quien decide. Escalar sin opciones lo obliga a empezar de cero. La recomendación no compromete la decisión: la informa.

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` establece como comportamiento ante bloqueo no fabricar éxito, preservar el estado de trabajo, crear o actualizar el registro del bloqueo, explicar la evidencia y pasar a otra tarea independiente cuando sea seguro. Su documento de compuertas exige que, cuando una compuerta no puede ejecutarse localmente, se declare con precisión cuál y con qué evidencia, que no se rebaje ninguna política para sortearla, que no se marque el trabajo como completo apoyándose solo en resultados locales, y que se dependa del registro autoritativo antes de integrar. La herramienta de preparación de publicación implementa estados equivalentes a varios de esta página — satisfecho, parcial, no satisfecho, caducado y requiere revisión — y trata una compuerta marcada como satisfecha sin evidencia como error y no como advertencia.

Lo que no lo sostiene: el vocabulario de siete estados de esta página es una generalización propuesta aquí. El proyecto observado implementa cinco estados de compuerta, no siete estados de tarea, y no distingue explícitamente `DIFERIDO` de `SUSTITUIDO`. No existe medición de con qué frecuencia un participante declara un estado incorrecto ni de si tener el vocabulario reduce esa frecuencia, que es la pregunta que decidiría si este protocolo funciona. La lista de diez condiciones de detención se deriva de fallos observados y de razonamiento, no de un registro sistemático de incidentes.

## Qué no afirma este protocolo

- No afirma que un participante con estos estados los use correctamente. Afirma que sin ellos no puede.
- No define qué compuertas son obligatorias; eso pertenece a [AFP-004](evidence-and-gates.protocol.md).
- No convierte `BLOQUEADO` en un resultado aceptable indefinidamente. Un bloqueo es una tarea nueva para alguien.
- No sustituye la revisión: declarar `COMPLETO` no es aprobarse a uno mismo.
- No afirma que detenerse sea siempre correcto. La detención tiene su propio coste, y este protocolo declara cuándo no aplica.
