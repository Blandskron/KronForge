---
id: engineering-protocols.benchmark
title: Benchmark reproducible
summary: Producir mediciones comparables declarando pregunta, entorno, línea base, repeticiones, incertidumbre y límites.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.1
difficulty: advanced
projects: [any]
compatibility: stack-agnostic
models: [any]
tags: [benchmark, medicion, reproducibilidad, metodologia, validez]
related:
  - engineering-protocols.protocol-maturity
  - engineering-protocols.evidence-and-gates
  - reliability-performance.performance-basic-validation
protocol:
  code: AFP-008
  maturity: experimental
  actors: [researcher, validator, reviewer]
  dependsOn: [AFP-004]
  observedIn: [agnara]
  lastValidated: 2026-09-07
lastModified: 2026-11-25
inputs:
  - "Pregunta, hipótesis y carga"
  - "Línea base y candidato identificados"
  - "Entorno y versiones exactas"
outputs:
  - "Método y muestras crudas"
  - "Resultados, incertidumbre y límites"
useCases:
  - "Comparar candidatos bajo condiciones controladas"
  - "Reproducir una medición"
---

# AFP-008 — Benchmark Reproducible

Un benchmark no es una medición: es un argumento. Este protocolo define qué debe contener ese argumento para que otro pueda evaluarlo, y por qué un número sin método es peor que ningún número.

## Problema

«Es tres veces más rápido» es una afirmación que no se puede evaluar. Falta todo lo que la haría comprobable: qué hardware, qué configuración, qué carga, cuántas ejecuciones, contra qué línea base, con qué dispersión, con qué calentamiento, en qué versión exacta.

Sin esos datos la afirmación no es falsa: es no verificable, que es peor, porque no puede refutarse.

Los fallos habituales son mecánicos y se repiten:

- comparar una configuración de desarrollo contra una de producción;
- concluir desde una única ejecución;
- elegir el resultado favorable entre varios;
- cambiar más de una variable entre línea base y candidato;
- medir incluyendo trabajo que no es el objeto de la medición;
- no declarar la configuración que produjo el número.

Ninguno requiere mala fe. Todos requieren un método que los impida.

Y el problema no se limita al rendimiento. La misma exigencia aplica a medir efectividad de agentes, calidad de documentación o consumo de contexto: son las áreas donde hoy circulan más afirmaciones y menos método.

## Actores

| Actor | Responsabilidad |
|---|---|
| Researcher | Formula la pregunta y la hipótesis antes de medir. |
| Validator | Ejecuta el procedimiento y conserva las muestras crudas. |
| Reviewer | Evalúa si el método sostiene la interpretación. |

Que la pregunta se formule antes de medir no es formalismo. Una pregunta formulada después de ver los datos casi siempre es la pregunta que esos datos responden bien.

## Ciclo de vida

```text
pregunta → hipótesis → entorno → carga → línea base → candidato
   → procedimiento → repeticiones → resultados → incertidumbre
      → interpretación → límites → reproducción
```

Un benchmark que se detiene en «resultados» no está terminado. Los tres pasos finales son los que lo convierten en evidencia.

## Categorías

El protocolo no es exclusivo del rendimiento:

| Categoría | Qué mide | Dificultad principal |
|---|---|---|
| Rendimiento | Latencia, memoria, capacidad. | Aislar la variable medida. |
| Calidad | Corrección del resultado producido. | Definir corrección de forma observable. |
| Efectividad de agentes | Tareas completadas correctamente sin intervención. | Evitar que la muestra de tareas favorezca a un participante. |
| Confiabilidad | Comportamiento bajo fallo y repetición. | Reproducir el fallo. |
| Calidad documental | Si alguien puede lograr el objetivo con la documentación. | Independencia del evaluador. |
| Completitud de tareas | Proporción de trabajo terminado sin retrabajo. | Definir «terminado» sin ambigüedad. |
| Eficiencia de contexto | Contexto consumido por unidad de trabajo útil. | Comparabilidad entre participantes distintos. |
| Seguridad | Resistencia frente a entradas hostiles. | Cobertura del espacio de ataque. |
| Interoperabilidad | Grado de equivalencia entre implementaciones. | Definir el canon; ver [AFP-007](interface-conformance.protocol.md). |

Las categorías centradas en agentes son las más frágiles. La composición del conjunto de tareas determina el resultado más que cualquier diferencia entre participantes, y quien elige las tareas suele tener una expectativa. Declarar cómo se eligieron es obligatorio.

## Contrato del registro

Un registro de benchmark contiene:

| Sección | Contenido |
|---|---|
| Pregunta | Qué se quiere saber, en una frase. |
| Hipótesis | Qué se espera y por qué. Declarada antes de medir. |
| Entorno | Hardware, sistema, versiones exactas de todo lo relevante. |
| Carga | Qué se ejecuta, con qué datos, cuántas veces. |
| Línea base | Contra qué se compara, con su versión exacta. |
| Candidato | Qué se mide, con su confirmación exacta. |
| Procedimiento | Calentamiento, orden de escenarios, frontera de medición. |
| Repeticiones | Cuántas ejecuciones y cómo se agregan. |
| Resultados | Mediana, percentil alto, dispersión. Muestras crudas conservadas. |
| Incertidumbre | Qué variación se observó y qué la explica. |
| Interpretación | Qué se puede concluir. Y qué no. |
| Límites | Qué no se midió. |
| Reproducción | Comando exacto para repetirlo. |

La [plantilla de informe de benchmark](../templates/benchmark-report.template.md) materializa estas secciones.

### Reglas de integridad

1. **Nunca comparar configuraciones asimétricas.** Una configuración de desarrollo contra una optimizada no mide la diferencia entre los sistemas; mide la diferencia entre las configuraciones.
2. **Fijar versiones exactas.** Una comparación sin versiones fijadas no es reproducible.
3. **Verificar corrección fuera de la medición.** Comprobar que el resultado es correcto, pero no dentro de la muestra cronometrada.
4. **Rotar el orden de los escenarios.** El orden introduce sesgo por efectos de caché y calentamiento.
5. **Conservar las muestras crudas.** El resumen no permite reevaluar; las muestras sí.
6. **Declarar la frontera de medición.** Qué se incluyó y qué se excluyó del cronómetro.
7. **Separar las capas medidas.** Cuando intervienen varios componentes, sus resultados no se mezclan en un solo número.
8. **Una única variable entre línea base y candidato.** Si cambian dos, el resultado no atribuye.
9. **La medición no es una compuerta de umbral en máquina ajena.** Un umbral derivado de una estación de trabajo no es reproducible en otra; lo que se verifica automáticamente es el cumplimiento del método, no un valor absoluto.

### Interpretación

La sección de interpretación declara qué se puede concluir y qué no. Ejemplos de conclusiones que un solo benchmark no sostiene:

- que el sistema sea más rápido en general;
- que la diferencia se mantenga bajo otra carga;
- que la diferencia importe para un usuario real;
- que la causa sea la que se supone.

### Amenazas a la validez

Todo registro declara al menos: qué podría explicar el resultado además de la hipótesis, qué se controló y qué no se pudo controlar. Un benchmark sin amenazas a la validez declaradas está afirmando implícitamente que no las tiene, lo cual es falso en todos los casos.

### Versionado

Un registro de benchmark es inmutable. Una medición nueva es un registro nuevo que referencia al anterior. Corregir un registro publicado destruye la comparabilidad histórica, que era su razón de existir.

## Falla

| Situación | Comportamiento |
|---|---|
| El entorno no puede fijarse | Declarar la variación como amenaza a la validez. |
| El resultado varía más de lo esperable | No publicar la mediana como conclusión; investigar la dispersión. |
| La línea base no es comparable | No publicar la comparación. Publicar la medición absoluta. |
| Solo hay una ejecución | No es un benchmark. Es una observación. |

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` mantiene una sección de integridad de benchmarks con reglas equivalentes a varias de las de esta página. Prohíbe explícitamente medir una configuración de desarrollo contra competidores optimizados. Exige fijar versiones de los sistemas comparados fuera de las dependencias distribuibles, ejercitar salida equivalente y correcta, validar la corrección fuera de cada muestra cronometrada, rotar el orden de los escenarios, conservar las muestras crudas y registrar explícitamente la frontera de medición incluida y excluida. Exige mantener separados los resultados de framework, servidor y red. Y establece que la comprobación automática verifica el cumplimiento del contrato del benchmark y nunca un umbral de latencia derivado de una estación de trabajo. Su lista de metadatos obligatorios cubre sistema, procesador, versión y modo de la plataforma de ejecución, servidor, número de trabajadores, serializador, carga, concurrencia, comando y confirmación exacta.

Lo que no lo sostiene: el proyecto observado tiene mediciones de línea base sin presupuestos ni compuerta de regresión, de modo que la parte del protocolo referida a comparación longitudinal no está ejercida. Las nueve categorías de esta página son una generalización propuesta aquí: solo las de rendimiento están observadas, y las centradas en efectividad de agentes, calidad documental y eficiencia de contexto no tienen ninguna implementación conocida. Las secciones de hipótesis previa, incertidumbre y amenazas a la validez se proponen aquí por rigor metodológico, no porque se hayan observado en un registro real.

## Qué no afirma este protocolo

- No afirma que un benchmark reproducible sea representativo del uso real.
- No define métricas concretas para ninguna categoría.
- No afirma que las nueve categorías sean medibles hoy con igual rigor. Las de agentes son las más débiles.
- No convierte una medición en una promesa de comportamiento futuro.
- No sustituye la validación de corrección; una medición sobre un resultado incorrecto no mide nada.
