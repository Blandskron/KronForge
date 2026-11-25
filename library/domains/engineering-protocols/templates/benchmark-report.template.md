---
id: engineering-protocols.benchmark-report
title: Informe de benchmark
summary: Publicar una medición con método, incertidumbre, interpretación y límites suficientes para evaluarla.
type: template
domain: engineering-protocols
status: stable
version: 1.0.1
difficulty: intermediate
projects: [any]
compatibility: stack-agnostic
models: [any]
tags: [benchmark, medicion, reproducibilidad, metodo]
related:
  - engineering-protocols.benchmark
  - reliability-performance.performance-basic-validation
lastModified: 2026-11-25
inputs:
  - "Pregunta, versiones, carga y entorno"
  - "Procedimiento y muestras observadas"
outputs:
  - "Informe con comparación, incertidumbre, amenazas a la validez y reproducción"
useCases:
  - "Publicar un benchmark que otro equipo pueda evaluar"
---

# Benchmark [ID] — [título]

- **Categoría:** rendimiento | calidad | efectividad de agentes | confiabilidad | calidad documental | completitud de tareas | eficiencia de contexto | seguridad | interoperabilidad
- **Fecha:** YYYY-MM-DD
- **Estado:** este informe es inmutable; una medición nueva es un informe nuevo que referencia a este.

## Pregunta

[Qué se quiere saber, en una frase.]

## Hipótesis

[Qué se espera y por qué. Declarada antes de medir.]

## Entorno

| Aspecto | Valor |
|---|---|
| Hardware | [procesador, memoria] |
| Sistema | [sistema y versión] |
| Plataforma de ejecución | [versión exacta y modo] |
| Otros componentes relevantes | [versiones exactas] |

## Carga

[Qué se ejecuta, con qué datos, cuántas veces por ejecución.]

## Línea base

[Contra qué se compara, con su versión exacta y su configuración.]

## Candidato

[Qué se mide, con su confirmación exacta y su configuración.]

[La línea base y el candidato deben diferir en una sola variable. Si difieren en dos, el resultado no atribuye.]

## Procedimiento

- Calentamiento: [cuánto y por qué]
- Orden de escenarios: [rotado / fijo, y la razón]
- Frontera de medición: incluye [qué]; excluye [qué]
- Verificación de corrección: [cómo, fuera de las muestras cronometradas]

## Repeticiones

- Ejecuciones: [número]
- Agregación: [cómo se combinan]

## Resultados

| Escenario | Mediana | Percentil alto | Dispersión |
|---|---|---|---|
| [escenario] | [valor] | [valor] | [valor] |

Muestras crudas: [dónde se conservan]

## Incertidumbre

[Qué variación se observó y qué la explica.]

## Interpretación

Se puede concluir:

- [conclusión sostenida por los datos]

No se puede concluir:

- [afirmación que los datos no sostienen]

## Amenazas a la validez

- [Qué podría explicar el resultado además de la hipótesis]
- [Qué se controló]
- [Qué no se pudo controlar]

## Límites

- [Qué no se midió]

## Reproducción

```bash
[comando exacto]
```

> Elimina las instrucciones entre corchetes al completar el informe. Una sola ejecución no es un benchmark: es una observación.
