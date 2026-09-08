---
id: engineering-protocols.work-delegation
title: Delegación y handoff de trabajo
summary: Entregar una tarea con contexto suficiente para ejecutarla y transferirla sin depender de memoria conversacional.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [delegacion, handoff, contrato, tareas, contexto]
related:
  - engineering-protocols.repository-state
  - engineering-protocols.completion-and-stop
  - engineering-protocols.evidence-and-gates
  - ai-agent-engineering.subagent-contract
  - context-engineering.persistent-notes
protocol:
  code: AFP-002
  maturity: experimental
  actors: [delegator, executor, human-owner]
  dependsOn: [AFP-001]
  observedIn: [agnara]
  lastValidated: 2026-09-07
---

# AFP-002 — Delegación y Handoff de Trabajo

Una tarea entregada a un agente es un contrato, no una instrucción. Este protocolo define qué debe contener ese contrato para que se pueda ejecutar sin conversación previa, y cómo se transfiere el trabajo cuando otro participante debe continuarlo.

## Problema

«Implementa autenticación» es ejecutable por alguien que ya conoce el proyecto. Para cualquier otro es una invitación a inventar: inventar el alcance, inventar los criterios de aceptación, inventar qué se puede tocar y qué no.

El fallo simétrico ocurre en la transferencia. Cuando un participante termina a medias y otro continúa, la información que hace falta suele estar en una conversación que el segundo no puede leer. El resultado no es que el trabajo se pierda: es que se rehace, y se rehace distinto.

Ambos problemas tienen la misma causa. El estado necesario para trabajar vive fuera del repositorio.

## Actores

| Actor | Responsabilidad |
|---|---|
| Delegator | Redacta el contrato. Es responsable de que sea ejecutable sin él presente. |
| Executor | Ejecuta dentro del alcance, produce la evidencia declarada y emite el handoff. |
| Human owner | Autoriza los contratos que exceden la autoridad delegada. |

El delegator puede ser un humano, un agente planificador o el propio proyecto a través de su backlog. Lo que no puede ser es implícito.

## Ciclo de vida

```text
redactado → aceptado → en ejecución → handoff → cerrado
                │            │           │
                │            │           └─→ transferido a otro executor
                │            └─→ bloqueado / requiere decisión
                └─→ rechazado por contrato insuficiente
```

Un executor puede y debe rechazar un contrato insuficiente. Aceptar una tarea mal especificada y completarla con suposiciones produce trabajo que parece terminado y no lo está.

## Contrato de delegación

El contenido mínimo. Los campos marcados como condicionales se omiten cuando no aplican, no se rellenan con texto vacío.

| Campo | Obligatorio | Qué resuelve |
|---|---|---|
| Identificador | sí | Referenciar la tarea desde evidencia, ramas y decisiones. |
| Objetivo | sí | Qué resultado se busca, en una frase. |
| Contexto | sí | Por qué existe la tarea ahora. |
| Fuentes de verdad | sí | Qué documentos gobiernan; el executor no debe inferirlos. |
| Alcance permitido | sí | Qué superficies puede modificar. |
| Cambios prohibidos | sí | Qué no debe tocarse aunque parezca razonable. |
| Dependencias | condicional | Qué debe existir antes. |
| Criterios de aceptación | sí | Cuándo el resultado es correcto, en términos observables. |
| Compuertas de calidad | sí | Qué debe ejecutarse y aprobar. |
| Evidencia esperada | sí | Qué debe entregarse como prueba. |
| Nivel de autoridad | sí | Qué puede hacer sin preguntar. |
| Condición de detención | condicional | Cuándo abandonar en lugar de insistir. |
| Condición de escalamiento | sí | A quién y con qué acudir. |
| Propiedad | sí | Quién responde por la tarea. |

Los criterios de aceptación son el campo que más trabajo ahorra y el que peor se escribe. Esto:

```markdown
## Criterios de aceptación
- login válido funciona;
- token inválido devuelve 401;
- token expirado devuelve 401;
- no se registran tokens en logs.
```

es traducible a pruebas. Esto:

```markdown
## Criterios de aceptación
- la autenticación debe funcionar correctamente.
```

requiere interpretación, y cada participante la interpretará distinto. Un criterio de aceptación que no puede convertirse en una observación no es un criterio.

La [plantilla de contrato de delegación](../templates/delegation-contract.template.md) materializa estos campos.

### Serialización

Markdown es la base válida. El protocolo no exige una serialización concreta: exige que los campos existan, sean legibles por una persona y estén en un artefacto que un participante nuevo pueda leer sin permiso especial.

Una proyección legible por máquina se añade cuando hay un consumidor real que la necesita — un enrutador de tareas, un detector de colisión de alcance — y no antes. Un contrato con metadatos que nadie consume es burocracia con sintaxis.

## Handoff

Un handoff es válido cuando un participante nuevo, sin acceso a la conversación anterior, puede reconstruir:

| Debe reconstruir | Contenido |
|---|---|
| Qué se pidió | Referencia al contrato. |
| Qué se inspeccionó | Qué se leyó antes de decidir. |
| Qué se decidió | Decisiones tomadas y su razón. |
| Qué cambió | Archivos y superficies modificadas. |
| Qué falta | Trabajo pendiente, explícito. |
| Qué falló | Intentos descartados y por qué. |
| Qué evidencia existe | Comandos ejecutados y sus resultados. |
| Qué no debe cambiarse | Invariantes que el siguiente podría romper sin saberlo. |
| Qué debería ocurrir después | La siguiente acción recomendada. |

El campo que casi siempre falta es «qué falló». Sin él, el siguiente participante repite el camino descartado, y suele descartarlo por la misma razón después de gastar el mismo tiempo.

La [plantilla de handoff](../templates/handoff-receipt.template.md) materializa estos campos.

### Relación con otros artefactos

Un handoff no es una fuente de verdad nueva. Se distingue así:

| Artefacto | Qué posee |
|---|---|
| Contrato de delegación | Qué se pidió y bajo qué restricciones. |
| Handoff | El estado de una transferencia concreta, en un momento concreto. |
| Descripción de PR | Qué contiene un cambio propuesto. |
| Registro de decisión | Por qué se decidió algo, de forma duradera. |
| Registro de evidencia | Qué se ejecutó y qué resultó. |
| Changelog | Qué cambió para quien consume el producto. |

Si un handoff empieza a contener decisiones arquitectónicas duraderas, esas decisiones están en el lugar equivocado: pertenecen a [AFP-010](decision-records.protocol.md). El handoff es transitorio por diseño y nadie lo mantendrá actualizado.

## Falla

| Situación | Comportamiento |
|---|---|
| El contrato no declara criterios de aceptación | Rechazar. No inferirlos. |
| El alcance permitido no basta para el objetivo | Escalar antes de ampliarlo unilateralmente. |
| Aparece trabajo fuera de alcance | Crear una tarea nueva; no ensanchar el diff. |
| El executor desaparece a mitad | El handoff parcial es preferible a ninguno. |

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` opera con tareas que declaran alcance de escritura y lectura como rutas explícitas, más dependencias y conflictos, y usa esa declaración para decidir qué trabajo puede ejecutarse en paralelo. La separación entre propiedad de implementación y propiedad de revisión también está declarada y ejercida. El repositorio exige además que el estado necesario para entender el progreso viva en artefactos y no en memoria del agente, que es la premisa central de este protocolo.

Lo que no lo sostiene: el contrato de catorce campos de esta página es una generalización propuesta aquí, no una plantilla observada en producción — el proyecto auditado declara alcance y dependencias, no los otros once campos. El handoff estructurado con «qué falló» no se observó como artefacto formal en ningún repositorio auditado; se propone porque su ausencia es un fallo repetido, no porque su presencia esté medida. No existe evidencia de que un contrato completo reduzca el retrabajo frente a uno parcial.

## Qué no afirma este protocolo

- No afirma que un contrato completo garantice una implementación correcta.
- No afirma que los catorce campos sean el conjunto mínimo. Afirma que los omitidos deben omitirse conscientemente.
- No exige una serialización concreta ni una plataforma de tareas.
- No define quién revisa el resultado; eso pertenece a [AFP-005](independent-review.protocol.md).
- No define cuándo la tarea está terminada; eso pertenece a [AFP-011](completion-and-stop.protocol.md).
