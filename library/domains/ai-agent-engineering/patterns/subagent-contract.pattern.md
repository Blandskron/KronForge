---
id: ai-agent-engineering.subagent-contract
title: Delegación por contrato
summary: Delegar una subtarea con alcance, autoridad y entrega verificable.
type: pattern
domain: ai-agent-engineering
status: stable
version: 1.1.0
difficulty: intermediate
projects: [agent-platform, complex-repository, research-workflow]
compatibility: model-agnostic
models: [any]
tags: [agents, subagents, delegation]
related:
  - ai-agent-engineering.subagent-systems
  - context-engineering.context-compaction
specRefs:
  - spec: anthropic-context-engineering
    url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    verified: 2026-09-03
---

# Pattern: Delegación por Contrato

## Problema

Una instrucción como “revisa seguridad” produce solapamiento, profundidad impredecible y resultados difíciles de integrar.

## Solución

El coordinador entrega un contrato:

```text
Objetivo:
Alcance:
Fuera de alcance:
Entradas:
Autoridad:
Salida esperada:
Evidencia:
Condición de bloqueo:
```

El especialista no amplía autoridad por iniciativa propia. Si descubre trabajo adicional, lo reporta como recomendación.

## Aislamiento de contexto

El contrato tiene un efecto que suele pasarse por alto y que a menudo es la razón principal para delegar: **el contexto del especialista no vuelve al coordinador**.

Un especialista puede explorar de forma extensa —decenas de miles de tokens— y devolver una síntesis breve. El detalle de esa exploración se queda en su ventana; el coordinador recibe solo el resultado y conserva presupuesto para integrar.

```text
Coordinador                 Especialista
-----------                 ------------
contrato  ------------->    exploración extensa
                                  |
resultado <-------------    síntesis breve
```

Esto convierte la delegación en una técnica de contexto, no solo de organización. Y añade un criterio de diseño: **la salida esperada debe caber en el presupuesto del coordinador**. Un contrato que pide "todo lo que encuentres" anula la ventaja.

La contrapartida es real: lo que no entra en la síntesis se pierde. Si el coordinador necesitará el detalle más adelante, el contrato debe exigir que el especialista lo persista en un artefacto direccionable en vez de narrarlo. Ver [notas persistentes](../../context-engineering/patterns/persistent-notes.pattern.md).

Para sostener un hilo largo sin delegar, la técnica complementaria es la [compactación de contexto](../../context-engineering/patterns/context-compaction.pattern.md).

## Cuándo usarlo

- delegación a especialistas;
- contención del crecimiento de contexto en tareas exploratorias;
- trabajo paralelo;
- auditorías por dominio;
- comparación independiente.

## Cuándo evitarlo

- tarea indivisible;
- contexto compartido demasiado grande;
- cambios simultáneos en los mismos archivos;
- decisiones que requieren conversación humana directa.

## Ventajas

- integración predecible;
- permisos explícitos;
- menos duplicación;
- bloqueos accionables.

## Desventajas

- costo de diseñar contratos;
- puede limitar descubrimientos si el alcance es demasiado estrecho;
- requiere un coordinador que valide resultados.

## Ejemplo

“Revisa únicamente enlaces relativos de Markdown. No edites archivos. Devuelve ruta, línea, destino y causa para cada fallo.”
