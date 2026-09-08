---
id: engineering-protocols.interface-conformance
title: Conformidad entre interfaces
summary: Demostrar que varias interfaces del mismo sistema implementan la misma semántica, no solo que cada una funciona.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: advanced
projects: [any]
compatibility: protocol-agnostic
models: [any]
tags: [conformidad, adaptadores, semantica, equivalencia, interoperabilidad]
related:
  - engineering-protocols.evidence-and-gates
  - agent-interoperability.protocol-boundaries
  - mcp-integration.mcp-topology
protocol:
  code: AFP-007
  maturity: experimental
  actors: [validator, reviewer]
  dependsOn: [AFP-004]
  observedIn: [agnara]
  lastValidated: 2026-09-07
---

# AFP-007 — Conformidad entre Interfaces

Cuando un sistema expone la misma capacidad por varias interfaces, probar cada una por separado no demuestra que se comporten igual. Este protocolo define cómo se demuestra la equivalencia.

## Problema

Un sistema expone una capacidad de tres formas: invocación directa, sobre una interfaz de red y a través de un protocolo de herramientas. Cada superficie tiene su suite y las tres están en verde.

Eso no dice nada sobre la pregunta que importa:

> ¿Se comportan igual?

Las suites independientes verifican que cada adaptador hace algo razonable. No verifican que hagan lo mismo. Y las divergencias que aparecen no son cosméticas: una entrada inválida rechazada en un adaptador y aceptada en otro es un fallo de autorización esperando a ser encontrado; un error que en una superficie oculta detalles internos y en otra los filtra es una fuga.

Estas divergencias son invisibles para las pruebas por adaptador precisamente porque cada adaptador se prueba contra su propia expectativa. Solo aparecen cuando se comparan entre sí.

## Actores

| Actor | Responsabilidad |
|---|---|
| Validator | Ejecuta la matriz de conformidad y registra las divergencias. |
| Reviewer | Decide si una divergencia es una desviación aceptada o un defecto. |

## Ciclo de vida

```text
comportamiento canónico definido
   → proyección por adaptador declarada
      → matriz ejecutada sobre escenarios equivalentes
         → divergencias clasificadas
            ├─ equivalente
            ├─ desviación conocida y registrada
            └─ defecto → corrección
```

## Contrato

### Comportamiento canónico

Existe una definición del comportamiento independiente de toda interfaz. Los adaptadores lo proyectan; no lo redefinen.

Sin un canon, la conformidad no tiene contra qué medirse y degenera en comparar adaptadores entre sí, donde el más antiguo se convierte en la referencia por antigüedad.

### Equivalencia, no identidad

La conformidad exige equivalencia semántica, no identidad de representación. Un mismo rechazo puede expresarse como un código de estado numérico en una interfaz y como un error estructurado en otra: son equivalentes si significan lo mismo y se producen en las mismas condiciones.

Lo que debe ser idéntico es la decisión; lo que puede diferir es su codificación.

### Dimensiones

| Dimensión | Qué se compara |
|---|---|
| Éxito | Misma entrada válida produce el mismo resultado observable. |
| Validación | La misma entrada inválida se rechaza en todas, por la misma razón. |
| Fallo | El mismo fallo se clasifica igual y expone lo mismo. |
| Autorización | La decisión de permitir o denegar ocurre en el mismo punto y con el mismo resultado. |
| Esquema | Los contratos publicados describen la misma forma de datos. |
| Observabilidad | El mismo evento produce señales correlacionables. |
| Capacidades opcionales | Lo que un adaptador no soporta se declara, no se simula. |

La dimensión de autorización es la que más defectos revela. El punto del ciclo en que se decide autorizar suele diferir entre adaptadores sin que nadie lo haya decidido, y un adaptador que autoriza después de producir el efecto no es equivalente a otro que autoriza antes, por más que ambos terminen devolviendo el mismo error.

### Matriz de conformidad

El artefacto central. Un escenario por fila, un adaptador por columna, el resultado esperado en cada celda:

| Escenario | Directa | Red | Protocolo |
|---|---|---|---|
| Solicitud válida | éxito | 200 | éxito |
| Entrada inválida | `invalid_input` | 400 | error de herramienta |
| No autorizado | `forbidden` | 403 | error de herramienta |
| Recurso ausente | sin resultado | 404 | error de protocolo |
| Fallo interno | `internal_failure` | 500 | error redactado |

Las celdas se derivan del canon, no de lo que cada adaptador hace hoy. Una matriz construida observando el comportamiento actual documenta el estado; no lo verifica.

### Desviaciones conocidas

Una divergencia deliberada se registra con su razón y su alcance. Lo que no se acepta es una desviación no declarada, ni una marca de fallo esperado que se mantiene indefinidamente para que la suite siga verde.

Un fallo esperado permanente no es una desviación aceptada: es un defecto con una etiqueta que impide verlo. Toda marca de este tipo declara su condición de retirada.

### Capacidades opcionales

Un adaptador puede no soportar algo que otro sí. La regla es que la ausencia se declara y nunca se simula: anunciar una capacidad que no está implementada es peor que no anunciarla, porque el consumidor construye sobre ella.

Que la biblioteca subyacente de un protocolo soporte una revisión no es evidencia de que el adaptador la implemente. Son afirmaciones distintas y la primera se confunde con la segunda con frecuencia.

## Falla

| Situación | Comportamiento |
|---|---|
| Un adaptador diverge sin declaración | Defecto. Se corrige o se registra como desviación. |
| Un adaptador anuncia lo que no implementa | Defecto de alta severidad. |
| La matriz no puede ejecutarse en un adaptador | `NOT_RUN` declarado; no se infiere equivalencia. |
| El canon no existe | El protocolo no puede aplicarse. Definir el canon es el trabajo previo. |

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` mantiene una matriz semántica entre invocación directa, interfaz de red y protocolo de herramientas, con evidencia ejecutable en una suite de conformidad dedicada, y declara explícitamente que registra equivalencia y no identidad byte a byte. Define un vocabulario canónico de fallos neutral respecto del transporte y un orden de ejecución fijo — políticas antes de la materialización de la entrada, y esta antes de la validación estricta — que es exactamente la clase de invariante que las suites por adaptador no comparan. Declara sus desviaciones y su alcance diferido de forma explícita. Su documento de compuertas exige que cada adaptador registre la revisión de especificación soportada, las capacidades opcionales no soportadas y la versión de la suite, y establece que el soporte de una revisión por parte de la biblioteca subyacente es necesario pero insuficiente para afirmar conformidad.

Lo que no lo sostiene: la evidencia proviene de un único sistema con tres adaptadores, todos del mismo autor y el mismo ecosistema. Las siete dimensiones de esta página cubren las que ese sistema ejercita; no hay evidencia sobre conformidad entre implementaciones de organizaciones distintas, que es el caso donde el protocolo sería más valioso y más difícil. La política de retirada obligatoria para marcas de fallo esperado se propone aquí y no está implementada como comprobación automática en ningún repositorio auditado.

## Qué no afirma este protocolo

- No afirma conformidad con una especificación externa. Afirma consistencia interna entre las interfaces de un mismo sistema.
- No afirma que las interfaces sean intercambiables para el consumidor.
- No sustituye las suites por adaptador; se apoya en ellas.
- No define qué interfaces debe exponer un sistema.
- No convierte una matriz completa en garantía de ausencia de divergencias fuera de los escenarios probados.
