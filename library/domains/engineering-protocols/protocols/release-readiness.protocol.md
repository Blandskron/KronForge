---
id: engineering-protocols.release-readiness
title: Preparación de publicación
summary: Separar terminar funcionalidad de estar listo para publicar, y reservar la autorización de publicar a una persona.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.1
difficulty: advanced
projects: [any]
compatibility: stack-agnostic
models: [any]
tags: [release, publicacion, candidato, autorizacion, evidencia]
related:
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.external-consumption-validation
  - engineering-protocols.completion-and-stop
  - delivery-platform.release-readiness-review
protocol:
  code: AFP-009
  maturity: experimental
  actors: [release-agent, validator, human-owner]
  dependsOn: [AFP-004, AFP-006]
  observedIn: [agnara]
  lastValidated: 2026-09-07
lastModified: 2026-11-25
inputs:
  - "Candidato identificado y alcance de publicación"
  - "Evidencia vigente de las compuertas aplicables"
outputs:
  - "Veredicto de preparación con bloqueos"
  - "Registro de autorización y evidencia del candidato"
useCases:
  - "Evaluar un candidato antes de publicarlo"
---

# AFP-009 — Preparación de Publicación

«Terminamos las funcionalidades» y «estamos listos para publicar» son afirmaciones distintas, y el software se rompe en el espacio que las separa.

## Problema

Publicar es la acción menos reversible de un proyecto. Un artefacto publicado puede estar instalado en máquinas ajenas antes de que alguien note el defecto, y retirarlo no lo desinstala.

Dos fallos producen la mayor parte del daño. El primero es tratar la ausencia de trabajo pendiente como preparación: no quedan tareas, luego se publica. El segundo es que un sistema automático publique porque la validación pasó, sin que nadie haya autorizado publicar. Validar y autorizar son actos distintos, y el segundo no se deriva del primero.

Hay un tercer fallo, más sutil: la evidencia de preparación se acumula durante semanas y para cuando se publica describe un código que ya no existe.

## Actores

| Actor | Responsabilidad |
|---|---|
| Release agent | Prepara el candidato y verifica las compuertas. No publica. |
| Validator | Produce la evidencia de cada compuerta. |
| Human owner | Autoriza la publicación. Es el único que puede. |

La separación entre preparar y publicar es el núcleo del protocolo. Un participante automático puede llevar el candidato hasta el borde y no cruzarlo.

## Ciclo de vida

```text
DESARROLLO
   → CANDIDATO          identidad inmutable fijada
      → VALIDACIÓN      compuertas ejecutadas, evidencia registrada
         ├─ NO_LISTO    → vuelve a desarrollo
         └─ LISTO
            → AUTORIZACIÓN   decisión humana explícita
               → PUBLICACIÓN
                  → VERIFICACIÓN POSTERIOR
```

La transición que nunca es automática es `LISTO → AUTORIZACIÓN`. Ninguna combinación de compuertas verdes la cruza.

## Contrato

### Identidad del candidato

Un candidato es un estado inmutable e identificable: versión exacta y confirmación exacta. Toda la evidencia se registra contra esa identidad.

Un candidato que sigue recibiendo cambios no es un candidato: es una rama, y su evidencia caduca a cada modificación.

### Compuertas de publicación

Las que un proyecto suele necesitar. Cada una se declara con su clase según [AFP-004](evidence-and-gates.protocol.md):

| Compuerta | Pregunta |
|---|---|
| Suite completa | ¿Pasa sobre el candidato exacto? |
| Plataformas soportadas | ¿En todas las declaradas? |
| Artefacto | ¿Se construye y su metadato es correcto? |
| Consumo externo | ¿Alguien de fuera puede instalarlo y usarlo? Ver [AFP-006](external-consumption-validation.protocol.md). |
| Seguridad | ¿Se ejecutaron los análisis exigidos por el alcance declarado? |
| Documentación | ¿Describe lo que se publica, no lo que se planeaba? |
| Migración | ¿Existe guía para quien viene de la versión anterior? |
| Defectos conocidos | ¿Están registrados y son aceptables? |
| Notas de publicación | ¿Existen y son exactas? |
| Consistencia de versión | ¿Todas las referencias declaran la misma? |
| Credenciales | ¿La autorización de publicación existe y su alcance es el correcto? |

### La evidencia caduca

Una compuerta aprobada sobre una confirmación deja de estar aprobada cuando esa confirmación cambia. Un candidato que avanza invalida su propia evidencia.

Esto tiene una consecuencia operativa incómoda y correcta: corregir un defecto durante la validación reinicia la validación. La alternativa —conservar la evidencia previa porque «el cambio fue pequeño»— es exactamente cómo se publica un defecto que la suite habría detectado.

### Porcentaje de preparación

Una métrica agregada de preparación es informativa y nunca decisoria. Un candidato está listo cuando todas las compuertas obligatorias están satisfechas, no cuando el porcentaje supera un valor.

Publicar con un 95 % significa publicar con una compuerta obligatoria sin satisfacer, y el porcentaje existe precisamente para hacer que eso suene aceptable.

### Autorización

La autorización de publicar es explícita, atribuible y posterior a la evidencia. Un proyecto declara quién puede otorgarla.

Un participante automático nunca publica salvo que el repositorio delegue esa autoridad de forma explícita, acotada y revocable. La delegación por omisión —«nadie dijo que no pudiera»— no es delegación.

### Verificación posterior

Publicar no cierra el ciclo. Después se verifica que lo publicado es lo que se validó: que el artefacto disponible corresponde al candidato, que se instala desde el canal real y que su identidad coincide.

Los artefactos validados localmente y los publicados pueden no ser el mismo archivo. Si el proceso de publicación reconstruye, la verificación posterior es la única evidencia sobre lo que la gente realmente recibe.

### Historia inmutable

Lo que una publicación contuvo se registra y no se corrige después. Una nota de publicación que se edita para coincidir con una realidad posterior destruye el registro que la hacía útil.

Un registro de publicación declara qué demostró y qué no demostró. La segunda parte es la que se omite y la que más vale.

## Falla

| Situación | Estado |
|---|---|
| Una compuerta obligatoria no está satisfecha | `NO_LISTO`. |
| La evidencia caducó | `NO_LISTO` hasta re-ejecutar. |
| Una compuerta no puede ejecutarse | `BLOQUEADO` con la compuerta y la razón. |
| Todas satisfechas, sin autorización | `LISTO`, no publicado. |
| La verificación posterior no coincide | Incidente. Se registra y se decide retirada. |

Ver [AFP-011](completion-and-stop.protocol.md) para el vocabulario completo.

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` opera un programa de preparación de publicación con una herramienta de medición que declara explícitamente que no publica, no etiqueta y no cambia versiones. Sus compuertas por evidencia solo se consideran válidas mientras la confirmación sobre la que se registraron sigue vigente, y caducan cuando cambian los archivos que declaran cubrir; una compuerta marcada como satisfecha sin evidencia se trata como error. Sus compuertas manuales no pueden ser satisfechas por la herramienta. El proyecto declara de forma explícita que el porcentaje de preparación es informativo y que una publicación solo está lista cuando cada compuerta obligatoria tiene evidencia registrada contra la confirmación que la produjo. Exige autorización de publicación, licencia y credenciales presentes antes de cualquier subida, y trata la historia de publicaciones como inmutable: sus registros describen lo que cada versión fue, incluido lo que estaba mal. Al publicar la versión anterior, la evidencia no se arrastró al candidato siguiente: se archivó y el nuevo candidato debe volver a establecerla. Su registro histórico incluye una sección explícita de lo que la publicación no demostró.

Lo que no lo sostiene: el ciclo se ha ejercido en publicaciones alfa de un solo proyecto y un solo mantenedor, donde el human owner y el operador de los agentes son la misma persona, de modo que la separación entre validar y autorizar no ha sido probada bajo tensión organizativa real. La verificación posterior está declarada en el programa pero su evidencia registrada corresponde a artefactos de validación local y no a los publicados, según reconoce el propio registro. Las once compuertas de esta página son una generalización; ningún proyecto auditado las tiene todas satisfechas simultáneamente.

## Qué no afirma este protocolo

- No afirma que un candidato listo esté libre de defectos.
- No define un esquema de versionado.
- No afirma que la automatización de publicación sea insegura. Afirma que su autoridad debe ser explícita.
- No sustituye la validación de consumo externo; la incorpora como compuerta.
- No garantiza reversibilidad. La publicación es difícilmente reversible por naturaleza, y por eso exige autorización previa.
