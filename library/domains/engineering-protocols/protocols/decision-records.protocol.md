---
id: engineering-protocols.decision-records
title: Registros de decisión
summary: Separar una pregunta abierta de una decisión tomada, y hacer ambas descubribles antes de tocar arquitectura.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.1
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [adr, rfc, decisiones, roadmap, gobernanza]
related:
  - engineering-protocols.repository-state
  - engineering-protocols.multi-agent-collaboration
  - architecture.adr
  - architecture.architecture-validation
protocol:
  code: AFP-010
  maturity: experimental
  actors: [proposer, reviewer, human-owner, any-agent]
  dependsOn: [AFP-001]
  observedIn: [agents-first-repo-docs, agnara]
  lastValidated: 2026-09-07
lastModified: 2026-11-25
inputs:
  - "Pregunta abierta y alternativas"
  - "Evidencia, restricciones y autoridad de decisión"
outputs:
  - "Propuesta o decisión duradera con identificador"
  - "Índice y referencias desde las superficies afectadas"
useCases:
  - "Evaluar una propuesta abierta"
  - "Registrar una decisión de arquitectura"
---

# AFP-010 — Registros de Decisión

Define el ciclo que va de una pregunta abierta a una decisión duradera, y cómo se mantiene descubrible para quien llegue después.

## Problema

Un participante nuevo modifica arquitectura sin saber que esa arquitectura se decidió deliberadamente y por qué. La decisión existía, pero vivía en un hilo de comentarios, en la memoria de alguien, o en un documento que nadie relaciona con el código que está tocando.

El resultado no es solo trabajo perdido. Es que la decisión se revierte sin haberse evaluado, y la razón original —que probablemente seguía siendo válida— se descubre de nuevo, más tarde y más caro.

El fallo simétrico también es común: registrar una decisión después de haberla implementado, para justificarla. Un registro escrito así no documenta una decisión; documenta una racionalización, y es peor que no tener registro porque parece que hubo deliberación.

## Actores

| Actor | Responsabilidad |
|---|---|
| Proposer | Abre la pregunta cuando todavía es una pregunta. |
| Reviewer | Cuestiona la propuesta; puede rechazarla. |
| Human owner | Acepta o rechaza. |
| Any agent | Consulta las decisiones vigentes antes de modificar arquitectura. |

## Ciclo de vida

```text
pregunta abierta
   → PROPUESTA (RFC)
      → discusión → revisión
         ├─ ACEPTADA → decisión registrada (ADR) → implementación
         └─ RECHAZADA → registrada con su razón
                              │
   decisión vigente ──────────┴──→ SUSTITUIDA por una decisión posterior
```

La propuesta pregunta **si deberíamos**. El registro de decisión declara **qué decidimos y por qué**. Confundirlos produce los dos fallos descritos arriba.

## Propuesta abierta

Se escribe cuando el diseño está genuinamente abierto y la decisión sería cara de revertir. No es un cuaderno de notas y no sustituye al registro de decisión una vez que la decisión existe.

Contenido:

| Sección | Contenido |
|---|---|
| Motivación | Por qué esto importa ahora. |
| Problema | Qué está mal o falta. |
| Alcance | Qué cubre y qué deja fuera. |
| Diseño propuesto | La propuesta concreta. |
| Alternativas | Las consideradas, con su razón de descarte. |
| Compatibilidad | Qué se rompe. |
| Migración | Cómo pasa quien ya usa lo anterior. |
| Seguridad | Qué superficie o autoridad cambia. |
| Impacto operativo | Qué cambia para quien opera el sistema. |
| Preguntas abiertas | Lo que la propuesta no resuelve. |

La sección de preguntas abiertas es la que distingue una propuesta honesta de una decisión disfrazada. Una propuesta sin preguntas abiertas suele ser una decisión ya tomada buscando aprobación.

No se exige propuesta para cambios triviales. Exigirla para todo produce el resultado contrario al buscado: nadie las escribe y las decisiones vuelven a los comentarios.

## Registro de decisión

Se escribe cuando la decisión ya se tomó, y describe la decisión — no la implementación.

| Sección | Contenido |
|---|---|
| Estado | `propuesta`, `aceptada`, `rechazada` o `sustituida`. |
| Contexto | Qué situación obligó a decidir. |
| Decisión | Qué se decidió, en términos inequívocos. |
| Alternativas consideradas | Con su razón de descarte. |
| Consecuencias | Positivas y negativas. Ambas. |
| Evidencia | Qué sostuvo la decisión. |
| Propuesta relacionada | Qué pregunta responde. |
| Implementación | Dónde vive el resultado. |

Un registro sin consecuencias negativas es sospechoso. Toda decisión arquitectónica cuesta algo; no declarar el coste no lo elimina, solo lo hace invisible para quien deba revisarla más tarde.

La [plantilla de registro de decisión](../../architecture/templates/adr.template.md) y la [plantilla de propuesta](../../architecture/templates/rfc.template.md) materializan estas secciones.

### Cuándo se exige

| Situación | ¿Registro? |
|---|---|
| Cambia una frontera de arquitectura | Sí. |
| Cambia un contrato público | Sí. |
| Cambia el modelo de seguridad o autoridad | Sí. |
| Se adopta o retira una dependencia estructural | Sí. |
| Se decide deliberadamente no hacer algo | Sí. |
| Cambia el proceso de calidad o publicación | Sí. |
| Corrección dentro de una estructura existente | No. |
| Refactorización sin cambio de contrato | No. |

La quinta fila se omite casi siempre y es de las más útiles: una decisión de no hacer algo se revierte por olvido con más frecuencia que una de hacerlo.

### Estados

Un registro aceptado no se edita para reflejar una realidad posterior. Se sustituye por otro que lo referencia. La historia de las decisiones es tan útil como las decisiones, porque muestra qué se creía cuando se decidió.

Un aviso sobre los estados: cuando un proyecto acumula registros, sus campos de estado se desincronizan de la realidad. Un registro que dice `propuesta` sobre algo implementado hace meses no informa, desinforma. El estado se reconcilia periódicamente, o el proyecto declara explícitamente que su campo de estado no es fiable y cuál es la fuente que sí lo es.

## Descubribilidad

Un participante que va a modificar arquitectura debe poder encontrar las decisiones vigentes que la gobiernan **antes** de empezar. El requisito mínimo:

1. existe un índice de decisiones en una ubicación fija;
2. cada decisión tiene un identificador estable y citable;
3. las decisiones se citan por identificador desde el código, las tareas y la documentación afectados;
4. el orden de lectura está declarado, de modo que un participante nuevo sepa qué leer primero.

Sin el punto 3 el índice existe y nadie lo consulta, porque no hay nada que lo conecte con el trabajo concreto.

## Relación con la planificación

Cinco artefactos que se confunden, con lo que posee cada uno:

| Artefacto | Posee |
|---|---|
| Visión | Por qué existe el proyecto. |
| Roadmap | Etapas de madurez con criterios de entrada y salida. |
| Backlog | Trabajo descompuesto y accionable. |
| Tarea | Una unidad ejecutable con criterios de aceptación. |
| Plan de publicación | Qué debe satisfacer una versión concreta. |

**Un roadmap no es una lista de deseos.** Describe evolución de capacidades con criterios verificables:

```markdown
## Etapa A4

Objetivo: demostrar que aplicaciones externas pueden consumir el framework.

Criterio de entrada: A3 estable.

Capacidades requeridas: empaquetado, superficie pública, exposición por red,
línea de comandos, introspección.

Criterio de salida: validación de consumo externo, pruebas multiplataforma,
reproducción desde documentación, auditoría de preparación.
```

Una etapa se declara completa solo con la evidencia de su criterio de salida. Un roadmap con etapas marcadas completas sin evidencia es una lista de deseos con formato de plan.

**Un roadmap no contiene un backlog.** Cuando los contiene, ambos se desincronizan y nadie sabe cuál gobierna.

**Cada verdad tiene un único dueño.** Si el estado de un subsistema aparece en dos documentos, uno de los dos está equivocado, y el proyecto no sabe cuál. La regla operativa: preferir una cita a una copia.

## Falla

| Situación | Comportamiento |
|---|---|
| Se necesita una decisión no registrada | Abrir la decisión antes de implementar. |
| Dos decisiones se contradicen | Escalar; una debe sustituir a la otra. |
| Una decisión se implementó sin registrarse | Registrarla declarando que es retroactiva. |
| El estado del registro no coincide con la realidad | Reconciliar, o declarar cuál es la fuente fiable. |

Registrar retroactivamente es aceptable si se declara como tal. Lo que no es aceptable es presentar un registro retroactivo como si hubiera precedido a la implementación.

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` mantiene ambos tipos de registro con la distinción explícita de que una propuesta contiene una pregunta abierta y que, una vez respondida, la respuesta pertenece a un registro de decisión que la propuesta debe nombrar. Tiene una prueba de arquitectura que verifica que cada número identifica exactamente un documento, escrita después de que un número identificara dos. Mantiene además un mapa de propiedad documental que declara qué documento posee qué verdad y establece la regla de preferir una cita a una copia, con comprobaciones automáticas sobre la parte verificable. Su propio índice de propuestas advierte que los campos de estado no distinguen hoy una pregunta viva de una resuelta y remite al documento que sí es fiable, que es exactamente el fallo que este protocolo describe y una demostración de que el proyecto lo detecta. `agents-first-repo-docs` mantiene su propio índice de decisiones con identificadores estables y citados desde los documentos afectados.

Lo que no lo sostiene: la desincronización de estados está reconocida y no resuelta en el proyecto observado, de modo que el mecanismo de reconciliación de esta página se propone sin evidencia de que funcione. El requisito de citar decisiones desde el código no está implementado como comprobación automática en ningún repositorio auditado, y sin esa comprobación es una convención que se erosiona. La tabla de cinco artefactos de planificación describe una separación que el proyecto observado alcanzó después de tener el problema, no antes; no hay evidencia de que la separación sea adoptable de forma preventiva.

## Qué no afirma este protocolo

- No afirma que registrar una decisión la haga correcta.
- No exige un formato concreto ni una numeración concreta.
- No afirma que toda decisión merezca registro. Afirma lo contrario para lo trivial.
- No sustituye la revisión; una decisión registrada sigue siendo revisable.
- No garantiza descubribilidad por sí solo: sin citas desde el trabajo concreto, el índice no se consulta.
