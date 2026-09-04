---
id: agent-interoperability.agent-cards-and-trust
title: Tarjetas de agente y confianza entre pares
summary: Declarar y verificar las capacidades de un agente ajeno antes de delegarle trabajo.
type: architecture-note
domain: agent-interoperability
status: stable
version: 1.0.0
difficulty: intermediate
projects: [agent-platform, ai-application, developer-tool]
compatibility: protocol-oriented
models: [any]
tags: [a2a, interoperability, identity, trust]
related: [agent-interoperability.protocol-boundaries, agent-supply-chain.skill-trust-boundaries]
specRefs:
  - spec: a2a
    version: "1.0.0"
    url: https://a2a-protocol.org/latest/specification/
    verified: 2026-09-03
---

# Architecture Note: Tarjetas de Agente y Confianza entre Pares

## El problema que resuelve

Cuando un agente necesita algo que otro agente sabe hacer, aparece una pregunta que no existe al llamar a una herramienta: **cómo saber qué puede hacer el otro, y por qué creerle**.

Una herramienta expone un esquema y su dueño es quien la invoca. Un agente ajeno es opaco: no expone su implementación, puede cambiar de comportamiento y responde a otra autoridad.

## Tarjeta de agente

El mecanismo de descubrimiento del protocolo A2A es un documento de metadatos —la *Agent Card*— donde un agente declara qué sabe hacer y cómo se le accede.

La revisión `1.0.0`, publicada en enero de 2026, marcó el paso de experimental a producción e incorporó **tarjetas firmadas criptográficamente**, junto con los mecanismos de descubrimiento y confianza asociados.

Ese detalle cambia el modelo de seguridad. Sin firma, la tarjeta es una afirmación de quien la sirve. Con firma, es una afirmación verificable de quien la emitió.

## Lo que una tarjeta no dice

Aquí está la decisión de arquitectura que más se omite: **la firma acredita el origen, no el comportamiento**.

Una tarjeta firmada garantiza que la declaración proviene de quien dice provenir y que no fue alterada en tránsito. No garantiza que el agente haga bien lo que declara, que lo siga haciendo mañana, que trate tus datos como esperas, ni que no esté comprometido.

La confianza en un par se compone de tres decisiones distintas, y confundirlas es el error frecuente:

| Decisión | Qué responde | Qué la resuelve |
|---|---|---|
| Autenticidad | ¿la declaración es de quien dice ser? | firma y verificación |
| Autorización | ¿le concedo esta acción sobre estos datos? | política propia, no la tarjeta |
| Confiabilidad | ¿hace bien lo que declara? | evidencia, historial y revisión |

## Límites de confianza

```text
Tu sistema
  |
  +-- [1] identidad del par ......... verificable por firma
  |
  +-- [2] capacidad declarada ....... afirmación del par, no evidencia
  |
  +-- [3] datos que le envías ....... salen de tu control
  |
  +-- [4] resultado que devuelve .... contenido no confiable
  |
  `-- [5] acciones que ejecuta ...... bajo su autoridad, no la tuya
```

`[4]` es el límite más subestimado. Lo que un agente ajeno devuelve es **contenido no confiable**, del mismo modo que el resultado de una herramienta externa. Si ese texto entra en el contexto como instrucción en vez de como dato, la delegación se convierte en una vía de inyección.

`[3]` tiene consecuencias que exceden lo técnico: delegar a un agente de otra organización es una transferencia de datos y debe declararse como tal.

## Decisiones de arquitectura

- Verificar la firma antes de leer la declaración, no después.
- Conceder autorización desde la política propia; una capacidad declarada no la otorga.
- Tratar toda respuesta ajena como dato, nunca como instrucción.
- Declarar qué datos abandonan el entorno y bajo qué base.
- Fijar la versión del par con la que se integró y revisar cuando cambie.
- Definir qué ocurre cuando el par no responde, responde tarde o responde mal.
- Conservar evidencia de la delegación: qué se pidió, a quién, con qué autoridad y qué se obtuvo.

## Cuándo no delegar a un agente ajeno

- cuando la tarea se resuelve con una herramienta bajo tu control;
- cuando el dato que hay que enviar no puede salir del entorno;
- cuando no existe forma de verificar el resultado;
- cuando la responsabilidad del fallo no está definida entre las partes.

La interoperabilidad es una capacidad, no un objetivo. Delegar añade una frontera de confianza que antes no existía.

## Gobernanza

A2A se gobierna, junto con Model Context Protocol, bajo la Agentic AI Foundation de la Linux Foundation. Eso reduce el riesgo de dependencia de un proveedor, pero no elimina la obligación de declarar contra qué revisión se diseñó una integración.

## Fuentes

- [Especificación A2A](https://a2a-protocol.org/latest/specification/), v1.0.0, verificada el 2026-09-03.
