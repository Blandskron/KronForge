---
id: engineering-protocols.protocol-template
title: Plantilla de protocolo
summary: Redactar un protocolo con actores, ciclo de vida, evidencia, límites y madurez declarada.
type: template
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [protocolo, plantilla, madurez, evidencia]
related:
  - engineering-protocols.protocol-maturity
---

# AFP-NNN — [Título del protocolo]

[Una o dos frases: qué gobierna este protocolo y qué decide. No repitas el título.]

## Front matter

```yaml
id: <dominio>.<slug>
title: <nombre humano>
summary: <resultado concreto en una frase>
type: protocol
domain: <dominio>
status: draft
version: 0.1.0
difficulty: foundation | intermediate | advanced
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [<etiqueta>]
related: []
protocol:
  code: AFP-NNN
  maturity: proposed | experimental | observed | reproduced | validated | stable
  actors: [<rol lógico>]
  dependsOn: [AFP-NNN]
  observedIn: [<proyecto>]
  lastValidated: YYYY-MM-DD
```

## Problema

[Qué falla hoy sin este protocolo. Concreto y observable, no abstracto. Si no puedes nombrar un fallo que ocurre, el protocolo probablemente no hace falta.]

## Actores

| Actor | Responsabilidad |
|---|---|
| [rol lógico] | [qué le corresponde] |

[Roles lógicos, nunca nombres de producto o proveedor. Declara qué autoridad tiene cada uno.]

## Ciclo de vida

[Estados, transiciones y qué las dispara. Un diagrama de texto en un bloque de código y, debajo, la explicación de cada estado.]

## Contrato

[Qué debe cumplirse. Usa tablas cuando el contenido sea enumerable; la prosa larga se lee peor y se verifica peor.]

## Falla

| Situación | Comportamiento |
|---|---|
| [situación] | [qué hacer, con qué estado de AFP-011] |

## Evidencia y límites

Declara `[madurez]`.

Lo que sostiene ese escalón: [evidencia concreta, con el proyecto y el artefacto que la contiene].

Lo que no lo sostiene: [qué falta para el escalón siguiente; qué partes de este documento son propuestas y no observaciones].

[Esta es una de las dos secciones donde nombrar un proyecto, un proveedor o un modelo es legítimo y obligatorio.]

## Qué no afirma este protocolo

- No afirma [afirmación que un lector podría inferir y que sería falsa].
- No define [lo que pertenece a otro protocolo].

## Adaptadores no normativos

[Opcional. La única otra sección donde cabe un nombre concreto. Todo lo que aquí se describa queda explícitamente fuera del contrato.]

---

## Reglas de redacción

1. **Cuatro secciones son obligatorias** y la puerta de calidad las verifica: `## Actores`, `## Ciclo de vida`, `## Evidencia y límites` y `## Qué no afirma este protocolo`.
2. **El cuerpo normativo es neutral respecto de proveedores.** Ningún nombre de modelo, producto, proveedor ni proyecto concreto aparece fuera de `## Evidencia y límites` y `## Adaptadores no normativos`.
3. **La madurez declarada debe corresponder a la evidencia declarada.** Un protocolo por encima de `proposed` con `observedIn` vacío se rechaza.
4. **`dependsOn` referencia protocolos existentes** y el grafo resultante no puede tener ciclos.
5. **Separa lo observado de lo propuesto.** Si una tabla generaliza más allá de lo que se observó, dilo en `Evidencia y límites`.
6. **La sección de qué no afirma no es modestia retórica.** Evita que un lector adopte el protocolo esperando una garantía que no tiene.
7. **`AFP-NNN` es estable y no se reutiliza** cuando un protocolo se retira: el número queda asociado a su historia.

> Elimina las instrucciones entre corchetes y esta sección de reglas al completar el protocolo. No presentes una propuesta como práctica validada.
