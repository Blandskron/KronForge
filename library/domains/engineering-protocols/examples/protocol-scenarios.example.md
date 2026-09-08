---
id: engineering-protocols.protocol-scenarios
title: Escenarios de aplicación de los protocolos
summary: Cinco recorridos concretos que muestran qué protocolos intervienen y qué evidencia produce cada uno.
type: example
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [ejemplos, escenarios, aplicacion, evidencia]
related:
  - engineering-protocols.repository-state
  - engineering-protocols.multi-agent-collaboration
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.release-readiness
---

# Escenarios de Aplicación

Cinco recorridos que muestran cómo se componen los protocolos. Todos son neutrales respecto de proveedores: donde aparece un rol, cualquier participante capaz puede ocuparlo.

Los escenarios están ordenados de menor a mayor exigencia de protocolo. El primero muestra que la suite no obliga a usarla entera.

## A — Un agente y un human owner

El caso más común y el que más protocolo puede omitir.

**Situación.** Una persona pide corregir un defecto acotado. Existe un solo participante automático.

**Protocolos que intervienen:** [AFP-001](../protocols/repository-state.protocol.md), [AFP-004](../protocols/evidence-and-gates.protocol.md), [AFP-011](../protocols/completion-and-stop.protocol.md).

**Recorrido.**

1. El agente observa: rama, árbol de trabajo, estado de la rama base, decisiones que afecten al área.
2. Selecciona; no hay competencia por la propiedad, así que el mecanismo se reduce a declarar en qué trabaja.
3. Planifica: objetivo, criterio de aceptación, alcance.
4. Ejecuta dentro del alcance.
5. Verifica y registra comando y observación.
6. Autorrevisa y **declara el nivel L0**. No lo llama revisión independiente.
7. Declara `COMPLETO` con la evidencia, o el estado que corresponda.

**Qué se omite legítimamente:** propiedad atómica, enrutamiento por capacidad, resolución de conflictos, matriz de conformidad.

**Lo que no se omite:** la evidencia y la declaración honesta del nivel de revisión. Son las dos cosas que no dependen del número de participantes.

## B — Planificador, implementador y revisor independiente

**Situación.** Tres roles distintos sobre una funcionalidad de riesgo medio.

**Protocolos que intervienen:** A + [AFP-002](../protocols/work-delegation.protocol.md), [AFP-003](../protocols/multi-agent-collaboration.protocol.md), [AFP-005](../protocols/independent-review.protocol.md).

**Recorrido.**

1. El planner redacta el contrato de delegación con fuentes de verdad, alcance permitido, cambios prohibidos, criterios de aceptación y evidencia esperada.
2. El implementer acepta. Si los criterios no son observables, **rechaza el contrato** en lugar de inferirlos.
3. Implementa, verifica, registra evidencia y emite el handoff.
4. El reviewer lee en el orden que preserva la independencia: tarea, criterios, diferencia, pruebas, evidencia, arquitectura. **La explicación del implementador va al final.**
5. Emite veredicto con nivel de independencia declarado y hallazgos clasificados por severidad.
6. Si hay hallazgos bloqueantes: corrección y **re-revisión**. Un hallazgo corregido sin verificar sigue abierto.

**Punto de fallo característico.** Que el reviewer empiece por el resumen del implementer. Formalmente hay dos participantes; la propiedad que hacía valiosa la revisión no está.

## C — Tres implementaciones distintas sobre una misma incidencia

**Situación.** Tres participantes automáticos con capacidades distintas y una unidad de trabajo que puede dividirse.

**Protocolos que intervienen:** B + la parte de concurrencia de [AFP-003](../protocols/multi-agent-collaboration.protocol.md).

**Recorrido.**

1. El planner descompone en tres tareas y declara el alcance de escritura de cada una.
2. Se comprueba el solapamiento. Dos tareas tocan un contrato compartido: **se secuencian**, no se paralelizan.
3. La tercera es independiente y se ejecuta en paralelo, en un árbol de trabajo aislado.
4. Cada participante adquiere propiedad de forma atómica y observable, con expiración.
5. El enrutamiento se decide por capacidad requerida frente a capacidad verificada, no por marca.
6. Tras integrar, **las compuertas se re-ejecutan sobre el resultado combinado**. Que las tres ramas pasaran por separado no es evidencia de que su unión pase.

**Punto de fallo característico.** Paralelizar porque se puede. El paralelismo es una optimización que introduce coste de reconciliación; cuando el orden de integración cambia el resultado, la ejecución secuencial es la decisión correcta.

## D — Desacuerdo resuelto por evidencia

**Situación.** Dos participantes proponen arquitecturas incompatibles para el mismo problema.

**Protocolos que intervienen:** [AFP-003](../protocols/multi-agent-collaboration.protocol.md), [AFP-008](../protocols/benchmark.protocol.md), [AFP-010](../protocols/decision-records.protocol.md).

**Recorrido.**

1. **Fuentes de verdad.** ¿Alguna decisión vigente ya lo resuelve? Si sí, el desacuerdo terminó y no era arquitectónico: era desconocimiento de una decisión existente.
2. **Criterios de aceptación.** ¿La tarea excluye una de las dos?
3. **Evidencia reproducible.** ¿Hay una prueba que discrimine?
4. **Arquitectura y gobernanza.** ¿Alguna viola una frontera declarada?
5. **Experimento.** Si nada de lo anterior decide, se mide bajo AFP-008: hipótesis previa, una sola variable, repeticiones, amenazas a la validez.
6. **Human owner.** Si la medición no decide, decide una persona, y la decisión se registra con lo que se intentó antes.

**Lo que no ocurre en ningún paso:** consultar a un tercer participante y aplicar mayoría. Tres sistemas de acuerdo no son evidencia; suelen estar correlacionados precisamente donde comparten el error.

**Resultado.** Una decisión registrada que cita el experimento. El siguiente participante que llegue al mismo punto encuentra la discusión en lugar de repetirla.

## E — Un candidato que falla la validación de consumo externo

El escenario que más valor demuestra, porque es el que las pruebas internas no pueden producir.

**Situación.** Todas las compuertas internas están en verde y se prepara la publicación.

**Protocolos que intervienen:** [AFP-009](../protocols/release-readiness.protocol.md), [AFP-006](../protocols/external-consumption-validation.protocol.md), [AFP-004](../protocols/evidence-and-gates.protocol.md), [AFP-011](../protocols/completion-and-stop.protocol.md).

**Recorrido.**

1. El release agent fija la identidad del candidato: versión y confirmación exactas. El candidato deja de recibir cambios.
2. Se ejecutan las compuertas y se registra evidencia contra esa confirmación.
3. Validación de consumo externo: entorno nuevo, instalación por el mecanismo real de entrega, sin acceso al árbol de fuentes, reproducción usando solo documentación pública.
4. **Falla:** el ejemplo documentado necesita un módulo interno para funcionar.
5. Se clasifica como fallo de superficie. **El candidato queda `CANDIDATO_INVÁLIDO`.**
6. No se corrige el entorno de validación para que pase. El fallo es el hallazgo.
7. Vuelve a implementación: o la superficie pública crece deliberadamente, o la documentación deja de prometer algo que la superficie no soporta. Ambas son decisiones, no correcciones.
8. Al corregirse, **la evidencia previa caduca**: el candidato cambió, y todas las compuertas se re-ejecutan.
9. Cuando todas están satisfechas, el estado es `LISTO`. **No publicado.**
10. La publicación requiere autorización humana explícita. Ninguna combinación de compuertas verdes la sustituye.

**Punto de fallo característico.** Conservar la evidencia previa porque «el cambio fue pequeño». Es exactamente el camino por el que se publica un defecto que la suite habría detectado.

## Cómo se componen

```text
AFP-001 estado del repositorio
   → AFP-002 delegación y handoff
      → AFP-003 colaboración multiagente
         → AFP-004 evidencia y compuertas
            → AFP-005 revisión independiente
               → AFP-006 consumo externo
               → AFP-007 conformidad
               → AFP-008 benchmark
                  → AFP-009 preparación de publicación

AFP-000 madurez        gobierna a todos los anteriores
AFP-010 decisiones     rodea el ciclo completo
AFP-011 falla y stop   aplica en cualquier punto
```

Los tres últimos no son etapas: son transversales. Cualquier escenario puede terminar en un estado de AFP-011, y cualquier paso puede requerir una decisión registrada bajo AFP-010.
