---
id: context-engineering.persistent-notes
title: Notas persistentes
summary: Escribir fuera de la ventana lo que debe sobrevivir a la compactación y a la sesión.
type: pattern
domain: context-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [ai-application, agent-platform, research-workflow]
compatibility: model-agnostic
models: [any]
tags: [context, memory, notes, long-horizon]
related:
  - context-engineering.context-compaction
  - context-engineering.context-layers
specRefs:
  - spec: anthropic-context-engineering
    url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    verified: 2026-09-03
---

# Pattern: Notas Persistentes

## Contexto

La ventana de contexto es memoria de trabajo: se llena, se compacta y se pierde. Toda tarea que dure más que una ventana necesita un lugar donde el estado sobreviva.

## Problema

Confiar el estado a la conversación tiene tres fallos. La compactación puede descartarlo. Un reinicio lo elimina. Y nadie puede revisarlo sin leer todo el historial.

El síntoma típico no es el olvido total: es que el agente recuerda **una versión** de la decisión, ligeramente distinta de la que se tomó.

## Solución

El agente escribe su estado en un artefacto externo y direccionable —un archivo del repositorio, una nota de tarea, un registro— y lo relee al empezar cada ciclo.

Una nota persistente útil declara:

- **objetivo** y criterios de salida, textualmente;
- **decisiones** con fecha y razón, en orden;
- **restricciones** vigentes, sobre todo las de seguridad y aprobación;
- **estado** por unidad de trabajo: pendiente, en curso, hecho, bloqueado;
- **hallazgos** que cambian el plan, separados de los que solo lo confirman;
- **pendientes** con su condición de desbloqueo.

Tres reglas hacen la diferencia:

1. **Se escribe cuando algo cambia, no al final.** Una nota escrita al cierre no protege de nada.
2. **Se escribe en el destino, no en la respuesta.** Un estado narrado al usuario y no persistido se pierde igual.
3. **Distingue hecho de inferencia.** Una nota que mezcla ambos convierte una hipótesis en premisa del siguiente ciclo.

## Cuándo usarlo

- tareas que cruzan compactaciones o sesiones;
- trabajo que otra persona o agente debe poder retomar;
- procesos donde la trazabilidad de las decisiones importa tanto como el resultado.

## Cuándo evitarlo

- tareas cortas que caben en una ventana: el coste de mantener la nota supera su valor;
- cuando el estado contiene datos sensibles y el destino no tiene el control de acceso adecuado;
- cuando no hay quien revise ni retire notas obsoletas.

## Ventajas

- el estado sobrevive a la compactación y al reinicio;
- una persona puede auditar el razonamiento sin leer el historial;
- otro agente puede retomar la tarea desde un punto explícito;
- las decisiones quedan fechadas y atribuibles.

## Desventajas

- una nota desactualizada es peor que ninguna: se lee como vigente;
- el mantenimiento compite con el trabajo real;
- persistir estado crea una superficie de datos que hay que gobernar como cualquier otra;
- el agente puede confiar en su propia nota errónea sin volver a la fuente.

## Riesgo específico

Una nota persistente es contexto que el agente **volverá a obedecer**. Si un contenido no confiable entra en ella, se convierte en instrucción duradera. Trata la escritura de notas con el mismo criterio que cualquier otro contenido que el agente cargará después: ver [instrucciones externas no verificadas](../../agent-supply-chain/anti-patterns/untrusted-external-instructions.anti-pattern.md).

## Ejemplo

Un agente que moderniza un servicio mantiene un archivo de tarea con el objetivo literal, seis decisiones fechadas, la restricción de no modificar infraestructura sin aprobación y una tabla de módulos con su estado. Al reanudar tras una compactación, lo relee antes de actuar y no reconstruye nada de memoria.

## Validación

Corta el historial y entrega solo la nota. Si el agente no puede continuar correctamente con ella, la nota está incompleta: eso es la prueba, no la lectura del documento.

## Fuentes

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), verificada el 2026-09-03.
