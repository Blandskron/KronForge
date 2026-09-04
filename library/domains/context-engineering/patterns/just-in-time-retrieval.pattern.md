---
id: context-engineering.just-in-time-retrieval
title: Recuperación bajo demanda
summary: Cargar identificadores ligeros y resolver el contenido solo cuando la tarea lo exige.
type: pattern
domain: context-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [context, retrieval, rag, token-optimization]
related:
  - context-engineering.progressive-context
  - context-engineering.context-layers
specRefs:
  - spec: anthropic-context-engineering
    url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    verified: 2026-09-03
---

# Pattern: Recuperación Bajo Demanda

## Contexto

El conocimiento que una tarea *podría* necesitar es siempre mucho mayor que el que *va* a necesitar. Precargarlo todo es caro y, sobre todo, ruidoso.

## Problema

La precarga tiene un defecto que no se resuelve con más ventana: el contenido cargado por si acaso compite con el contenido relevante, y el agente no puede distinguir entre lo que se le dio porque importaba y lo que se le dio porque estaba disponible.

Hay además un problema de frescura. Lo precargado se congela en el momento de la carga; lo recuperado cuando hace falta refleja el estado actual.

## Solución

Entregar **identificadores ligeros** en lugar de contenido, y resolverlos solo cuando la tarea lo exige.

Un identificador ligero es una ruta de archivo, un ID de activo, una consulta nombrada, una URL de recurso: algo que ocupa una línea y basta para recuperar el contenido completo.

```text
Precarga                        Bajo demanda
--------                        ------------
contenido de 40 archivos        índice con 40 rutas y una línea por archivo
                                        |
                                        v
                                lectura de los 3 que la tarea necesita
```

El diseño consiste en que **el índice sea suficiente para decidir qué abrir**. Si el agente tiene que abrir archivos para saber cuál abrir, el índice falló.

## Cuándo usarlo

- repositorios y bases de conocimiento grandes;
- agentes con herramientas de lectura y búsqueda fiables;
- contenido que cambia entre la planificación y la ejecución;
- tareas donde solo una fracción pequeña del material resulta relevante.

## Cuándo evitarlo

- cuando el agente no tiene forma fiable de recuperar el contenido: entonces el identificador es una promesa incumplible;
- cuando la tarea necesita comparar muchas fuentes a la vez, y el coste de recuperarlas una a una supera al de precargarlas;
- cuando la latencia por recuperación es inaceptable para el caso de uso;
- para restricciones críticas: una regla de seguridad no se deja "para cuando haga falta".

## Ventajas

- el presupuesto se gasta en lo relevante;
- el contenido recuperado está fresco;
- queda registro de qué necesitó realmente la tarea;
- el mismo índice sirve a personas y a agentes.

## Desventajas

- depende por completo de la calidad del índice;
- añade latencia y llamadas de herramienta;
- un identificador roto produce un vacío silencioso, no un error visible;
- el agente puede decidir no recuperar algo que sí necesitaba.

## Relación con RAG

La recuperación bajo demanda no sustituye al retrieval sobre un índice semántico: lo complementa. La diferencia es de mecanismo, no de objetivo. Cuando la estructura ya es navegable —un repositorio, un catálogo, un sistema de archivos— la ruta directa suele ser más precisa y más barata que una búsqueda por similitud.

Elige por la naturaleza del corpus, no por la moda: estructura conocida y direccionable favorece identificadores; corpus grande y no estructurado favorece retrieval.

## Ejemplo

Un agente recibe [`library/catalog.json`](../../../catalog.json) con 34 activos: ID, título, resumen, tipo y ruta. Con eso decide que la tarea necesita dos activos y lee solo esos dos archivos. Nunca cargó los 32 restantes.

## Validación

Registra qué identificadores se resolvieron y cuáles no. Un índice con muchas entradas que jamás se abren indica que sobra material; una tarea que abre casi todo indica que la precarga habría sido más simple.

## Fuentes

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), verificada el 2026-09-03.
