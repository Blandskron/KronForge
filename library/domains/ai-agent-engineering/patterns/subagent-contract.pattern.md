---
id: ai-agent-engineering.subagent-contract
title: Delegación por contrato
summary: Delegar una subtarea con alcance, autoridad y entrega verificable.
type: pattern
domain: ai-agent-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [agent-platform, complex-repository, research-workflow]
compatibility: model-agnostic
models: [any]
tags: [agents, subagents, delegation]
related: [ai-agent-engineering.subagent-systems]
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

## Cuándo usarlo

- delegación a especialistas;
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
