---
id: ai-agent-engineering.subagent-systems
title: Sistemas de subagentes
summary: Diseñar especialización, autoridad, coordinación y memoria entre agentes.
type: architecture-note
domain: ai-agent-engineering
status: stable
version: 1.0.0
difficulty: advanced
projects: [agent-platform, complex-repository, research-workflow]
compatibility: model-agnostic
models: [any]
tags: [agents, subagents, coordination, memory]
related: [ai-agent-engineering.subagent-contract]
---

# Architecture Note: Sistemas de Subagentes

## Cuándo aportan valor

- subtareas independientes y bien acotadas;
- especialización real;
- paralelismo con bajo solapamiento;
- validación cruzada con criterios explícitos.

No aportan valor cuando coordinar cuesta más que ejecutar, el contexto no puede separarse o varias tareas modificarían la misma superficie.

## Componentes

- **Coordinador:** descompone, asigna autoridad y resuelve conflictos.
- **Especialista:** recibe un contrato acotado y devuelve evidencia.
- **Memoria de tarea:** decisiones y artefactos compartidos con vigencia definida.
- **Gate humano:** aprueba decisiones sensibles y expansión de autoridad.

## Jerarquía y comunicación

La jerarquía representa responsabilidad, no calidad. Los mensajes deben incluir:

- objetivo;
- alcance y exclusiones;
- entradas;
- autoridad;
- salida;
- evidencia;
- condición de bloqueo.

## Coordinación

- evita dos escritores sobre el mismo archivo;
- usa IDs de tarea estables;
- diferencia hallazgo, propuesta y cambio aplicado;
- combina resultados solo después de validar incompatibilidades;
- cancela trabajo que perdió relevancia.

## Memoria

Comparte decisiones y fuentes, no transcripciones completas. Cada elemento declara origen, fecha, alcance y si puede reemplazarse.

## Errores comunes

- delegación vaga;
- autoridad implícita;
- subagentes que vuelven a investigar lo mismo;
- resultados sin evidencia;
- coordinación recursiva sin límite;
- consenso aparente entre agentes que comparten el mismo supuesto.
