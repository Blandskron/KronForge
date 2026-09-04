---
id: context-engineering.context-compaction
title: Compactación de contexto
summary: Resumir y reiniciar la ventana antes de agotarla para sostener tareas largas.
type: pattern
domain: context-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [ai-application, agent-platform, research-workflow]
compatibility: model-agnostic
models: [any]
tags: [context, compaction, long-horizon, memory]
related:
  - context-engineering.progressive-context
  - context-engineering.persistent-notes
specRefs:
  - spec: anthropic-context-engineering
    url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    verified: 2026-09-03
---

# Pattern: Compactación de Contexto

## Contexto

Una tarea de horizonte largo —una migración, una auditoría, una investigación— genera más historial del que cabe en una ventana de contexto. El agente no puede simplemente seguir acumulando.

## Problema

Al acercarse al límite, las opciones ingenuas fallan de formas distintas y todas malas: truncar por el principio pierde el objetivo original, truncar por el final pierde el trabajo reciente, y esperar al límite obliga a decidir sin margen.

Hay un segundo problema, menos visible: mucho antes de llenarse, la ventana ya degrada la calidad. El historial acumulado compite con las instrucciones vigentes.

## Solución

Resumir el contenido de la ventana y reiniciarla con ese resumen como punto de partida.

El resumen se diseña, no se improvisa. Debe conservar:

1. **objetivo y criterios de salida**, textualmente;
2. **decisiones tomadas** y su razón;
3. **restricciones vigentes**, incluidas las de seguridad y aprobación;
4. **estado actual**: qué está hecho, qué está en curso, qué falta;
5. **punteros a la fuente**: rutas y referencias, no el contenido;
6. **pendientes y bloqueos** con su condición de desbloqueo.

Y debe descartar de forma explícita: exploración que no cambió ninguna decisión, contenido de archivos ya recuperable por su ruta, y salidas de herramientas que solo confirmaron una hipótesis.

### Cuándo disparar

No esperes al límite. La guía pública de referencia sitúa el umbral entre **5.000 y 20.000 tokens** para cargas simples y entre **50.000 y 100.000** para tareas complejas, medidos como margen restante antes del límite.

El número exacto depende del modelo y de la tarea. La regla estable es otra: **compacta mientras todavía hay margen para escribir un buen resumen**. Un resumen redactado bajo presión de ventana es peor que el historial que reemplaza.

## Cuándo usarlo

- tareas que superan una sola ventana;
- agentes que operan por horas o entre sesiones;
- flujos donde la exploración genera mucho más volumen que las conclusiones.

## Cuándo evitarlo

- tareas que caben cómodamente en una ventana: compactar añade riesgo sin beneficio;
- trabajo donde la precisión textual del historial es el producto, como una revisión legal o una auditoría de diff;
- cuando no hay forma de recuperar la fuente a partir de los punteros del resumen.

## Ventajas

- sostiene tareas sin límite práctico de duración;
- reduce la competencia entre historial e instrucciones vigentes;
- obliga a explicitar el estado, que también sirve para revisión humana.

## Desventajas

- toda compactación pierde información, y no siempre se sabe cuál hasta que hace falta;
- un resumen que omite una restricción la elimina de hecho;
- el resumen puede arrastrar un error y consolidarlo como si fuera un hecho establecido;
- la compactación repetida amplifica ambos efectos.

## Mitigación de la pérdida

- Conserva las restricciones de forma literal, no resumida.
- Deja punteros a la fuente en vez de resúmenes de archivos.
- Registra qué se descartó, no solo qué se conservó.
- Combina con [notas persistentes](persistent-notes.pattern.md): lo que debe sobrevivir con certeza se escribe fuera de la ventana.

## Relación con subagentes

Delegar es la otra forma de contener el crecimiento del contexto: el especialista consume su propia ventana y devuelve una síntesis breve. Ver [delegación por contrato](../../ai-agent-engineering/patterns/subagent-contract.pattern.md).

Compactación y delegación no compiten. La primera sostiene un hilo largo; la segunda evita que ese hilo crezca.

## Ejemplo

Una migración lleva 40 archivos revisados. Antes de compactar, el agente escribe: objetivo literal, las cuatro decisiones de diseño con su razón, la lista de archivos migrados, el archivo en curso, los tres pendientes y la restricción de no tocar migraciones de base de datos sin aprobación. Descarta la exploración de los 36 archivos que no cambiaron nada.

## Validación

Después de compactar, verifica que el resumen basta para responder: qué se pide, qué no se puede hacer, qué se decidió y por qué, y cuál es el siguiente paso. Si alguna respuesta requiere el historial anterior, el resumen está incompleto.

## Fuentes

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), verificada el 2026-09-03.
