---
id: engineering-protocols.protocol-maturity
title: Madurez y validación de protocolos
summary: Graduar un protocolo desde propuesta hasta estable exigiendo evidencia distinta en cada escalón.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [protocolo, madurez, evidencia, validacion, falsabilidad]
related:
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.decision-records
protocol:
  code: AFP-000
  maturity: experimental
  actors: [protocol-author, reviewer, human-owner]
  dependsOn: []
  observedIn: [agents-first-repo-docs]
  lastValidated: 2026-09-07
---

# AFP-000 — Madurez y Validación de Protocolos

Este es el metaprotocolo. Gobierna a los demás: define qué significa que un protocolo esté validado, qué evidencia exige cada escalón y cómo se degrada cuando la evidencia deja de sostenerlo.

Existe porque el modo más barato de destruir la credibilidad de un framework de protocolos es publicar una práctica que funcionó una vez y llamarla estándar.

## Problema

Un protocolo documentado se lee igual que un protocolo demostrado. El Markdown no distingue entre «esto lo pensamos el martes» y «esto sobrevivió a tres proyectos independientes». Sin una etiqueta explícita y verificable, el lector asume la interpretación más favorable, y quien escribe no necesita mentir para que eso ocurra.

La consecuencia no es reputacional, es operativa: un equipo adopta un protocolo creyendo que está probado, falla, y no puede distinguir si falló por el protocolo o por su implementación, porque nunca supo qué se había demostrado realmente.

## Actores

| Actor | Responsabilidad |
|---|---|
| Protocol author | Propone el protocolo, declara su madurez inicial y la evidencia que la sostiene. |
| Reviewer | Verifica que la evidencia declarada sostenga el escalón declarado, y solo ese. |
| Human owner | Autoriza la promoción a `validated` y `stable`. Ningún agente promueve por sí mismo. |

Un mismo actor puede ocupar más de un rol en los escalones bajos. Para `validated` y `stable`, autor y revisor deben ser distintos: la promoción es exactamente el tipo de juicio que un autor no puede emitir sobre su propio trabajo. Ver [AFP-005](independent-review.protocol.md).

## Ciclo de vida

```text
proposed → experimental → observed → reproduced → validated → stable
     ↑            ↑            ↑           ↑           ↑
     └────────────┴────────────┴───────────┴───────────┘
        degradación por evidencia caduca o refutada
```

La transición nunca salta escalones. Un protocolo brillante que nadie ejecutó sigue siendo `proposed`.

### `proposed`

El protocolo está escrito y es internamente coherente. Nadie lo ha ejecutado.

Evidencia exigida: ninguna, salvo la definición completa — actores, ciclo de vida, evidencia esperada y qué no afirma.

### `experimental`

Al menos un proyecto lo ejecutó deliberadamente, no por accidente.

Evidencia exigida: identificación del proyecto y del periodo, más una descripción de qué se hizo distinto por seguir el protocolo. «Lo usamos» no es evidencia; «el protocolo cambió esta decisión concreta» sí lo es.

### `observed`

El protocolo se sostuvo durante varios ciclos en ese proyecto y produjo efectos registrados en artefactos inspeccionables.

Evidencia exigida: artefactos concretos — Issues, PR, registros de evidencia, decisiones — que existan porque el protocolo los exigía, y al menos un caso en que el protocolo detuvo o corrigió algo que de otro modo habría pasado.

### `reproduced`

Un segundo proyecto, con otro equipo o con otros agentes, lo aplicó y obtuvo un resultado comparable.

Evidencia exigida: identificación del segundo proyecto y una comparación explícita de qué se transfirió sin cambios y qué hubo que adaptar. La adaptación no invalida la reproducción; ocultarla sí.

Este es el escalón que la mayoría de los protocolos publicados nunca alcanza, y el primero que distingue un protocolo de una anécdota.

### `validated`

Existe evidencia medida, no solo observada: un experimento controlado, o un conjunto de casos donde el protocolo se comparó con su ausencia.

Evidencia exigida: un registro reproducible bajo [AFP-008](benchmark.protocol.md), con su método, sus límites y sus amenazas a la validez declaradas. Requiere autorización del human owner.

### `stable`

El protocolo lleva suficiente tiempo validado como para que su contrato pueda tratarse como una promesa. Cambiarlo rompe adopciones existentes.

Evidencia exigida: todo lo anterior, más adopción externa verificable y una política de compatibilidad declarada. Requiere autorización del human owner.

### Degradación

Un protocolo baja de escalón cuando:

- la evidencia que lo sostenía caduca sin re-verificarse;
- un proyecto reporta que el protocolo falló de un modo que el protocolo no anticipaba;
- una revisión determina que la evidencia declarada nunca sostuvo el escalón.

Bajar de escalón no es un fracaso del protocolo. Ocultar que debía bajar sí lo es.

## Contrato de declaración

Todo protocolo declara en su front matter:

```yaml
protocol:
  code: AFP-000
  maturity: experimental
  actors: [protocol-author, reviewer, human-owner]
  dependsOn: []
  observedIn: [nombre-del-proyecto]
  lastValidated: 2026-09-07
```

`observedIn` es la traza hacia la evidencia. Un protocolo en `experimental` o superior con `observedIn` vacío es una contradicción, y la puerta de calidad lo rechaza.

`lastValidated` es la fecha de la última reevaluación de madurez, no la de la última edición. Un protocolo cuya madurez no se reevalúa envejece: la puerta advierte a los 180 días y falla a los 365. El razonamiento es el mismo que sostiene la [política de frescura](../../../../docs/SPEC_FRESHNESS.md) para fuentes externas — una afirmación sin re-verificar es una afirmación sobre el pasado — con un umbral más largo porque un protocolo cambia más despacio que una especificación.

## Criterios de evaluación

Un revisor evalúa el protocolo contra estas once dimensiones antes de aceptar una promoción. Las que no apliquen se declaran como no aplicables en lugar de omitirse en silencio.

| Dimensión | Pregunta que responde |
|---|---|
| Corrección | ¿Lo que describe es cierto en los casos que declara cubrir? |
| Completitud | ¿Cubre el ciclo entero, incluida la falla? |
| Reproducibilidad | ¿Otro equipo obtendría un resultado comparable siguiéndolo? |
| Portabilidad | ¿Funciona fuera del proyecto que lo originó? |
| Independencia de modelo | ¿Sobrevive si cambian todos los agentes participantes? |
| Legibilidad humana | ¿Una persona puede auditarlo sin ejecutar nada? |
| Descubribilidad por máquina | ¿Un agente puede encontrarlo y saber si le aplica? |
| Seguridad | ¿Introduce autoridad, superficie o confianza nuevas? |
| Manejo de falla | ¿Dice qué hacer cuando no se puede cumplir? |
| Requisitos de evidencia | ¿Distingue afirmación de prueba? |
| Falsabilidad | ¿Existe un resultado observable que lo refutaría? |

La última es la que más protocolos reprueba. Un protocolo que ninguna observación podría contradecir no es un protocolo: es una preferencia estilística.

## Evidencia y límites

Este metaprotocolo se aplica a sí mismo y declara `experimental`.

Lo que sostiene ese escalón: la escala se ejerce hoy en `agents-first-repo-docs`, donde cada protocolo de la suite declara su escalón y la puerta de calidad rechaza una declaración incoherente — madurez fuera de vocabulario, `observedIn` vacío por encima de `proposed`, o dependencia hacia un protocolo inexistente. El mecanismo de caducidad está implementado y es ejecutable.

Lo que no lo sostiene: la escala no ha sido aplicada por ningún proyecto externo, no existe evidencia de que seis escalones sean mejor calibración que cinco o siete, y ningún protocolo de esta suite ha alcanzado `reproduced`. La escala está inspirada en la práctica de separar estado observado de estado prometido — el repositorio `Blandskron/agnara` mantiene un vocabulario equivalente para subsistemas, con un test de arquitectura que verifica la parte comprobable por máquina y una regla explícita de que el estado se declara en un único archivo — pero esa práctica sostiene la utilidad de separar «existe» de «funciona», no la calibración concreta de esta escala.

## Qué no afirma este protocolo

- No afirma que un protocolo `stable` sea correcto para todo proyecto. Afirma que su contrato es estable.
- No afirma que los seis escalones estén calibrados. Afirma que separarlos es mejor que no separarlos.
- No sustituye a la revisión: la etiqueta resume una revisión, no la reemplaza.
- No convierte adopción en corrección. Un protocolo ampliamente adoptado y equivocado sigue equivocado.
- No define cómo medir efectividad de agentes; eso pertenece a [AFP-008](benchmark.protocol.md).
