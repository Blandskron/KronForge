---
id: engineering-protocols.vendor-coupled-protocol
title: Protocolo acoplado a proveedores
summary: Escribir el proceso de ingeniería en términos de los productos que hoy lo ejecutan en lugar de roles y capacidades.
type: anti-pattern
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [protocolo, acoplamiento, roles, portabilidad, proveedores]
related:
  - engineering-protocols.multi-agent-collaboration
  - engineering-protocols.protocol-maturity
  - agent-interoperability.protocol-boundaries
---

# Anti-patrón: Protocolo Acoplado a Proveedores

## Descripción

El proceso de ingeniería se escribe en términos de los productos que lo ejecutan hoy. Las reglas nombran herramientas concretas donde deberían nombrar responsabilidades, y los flujos dependen de capacidades específicas de un proveedor sin declararlo.

El resultado funciona perfectamente hasta que algo cambia, y entonces no se puede adaptar: hay que reescribirlo.

## Cómo se ve

```text
El producto A siempre implementa el backend.
El producto B revisa arquitectura.
El producto C se encarga del frontend.

Paso 3: pega el resultado en la interfaz del producto D.

Este protocolo requiere una herramienta con ventana de contexto de N tokens.

La revisión se considera completa cuando el producto E aprueba.
```

También aparece en forma más sutil: un protocolo cuya secuencia solo tiene sentido porque una herramienta concreta funciona de cierta manera, sin que en ningún punto se diga que esa es la razón.

## Por qué parece razonable

Porque es verdad hoy y es concreto. Un equipo que efectivamente usa esos productos escribe lo que hace, y escribir «Implementer» donde todos saben que es un producto concreto parece una abstracción gratuita.

También pesa la observación empírica: si un producto resultó mejor en cierta tarea, fijarlo ahí parece una optimización. El problema es que esa observación caduca — y caduca rápido, porque las capacidades cambian con cada versión — mientras que el documento se queda.

## Consecuencias

- El protocolo muere cuando cambia el proveedor, y el proveedor cambia.
- El conocimiento acumulado no es transferible a otro equipo con otras herramientas.
- La asignación por marca sustituye a la evaluación por capacidad, y nadie vuelve a comprobar si sigue siendo cierta.
- El proyecto no puede distinguir qué parte de su resultado viene del proceso y qué parte de la herramienta.
- Un lector externo no puede adoptar el protocolo sin adoptar el mismo conjunto de productos.

## Cómo se corrige

1. Escribir el cuerpo normativo en roles lógicos: quién planifica, quién implementa, quién revisa, quién valida, quién autoriza.
2. Declarar los requisitos como capacidades verificables, no como productos: «capaz de ejecutar comandos y conservar su salida» en lugar del nombre de la herramienta.
3. Cuando una capacidad concreta sea imprescindible, declararla como requisito y explicar qué ocurre si no está disponible.
4. Aislar lo específico de un producto en una sección de adaptadores explícitamente marcada como no normativa.
5. Si el proyecto mantiene un perfil de capacidades por participante, versionarlo y sostener cada entrada en observación registrada, no en material del proveedor.

## Cómo detectarlo

- Un nombre de producto, modelo o proveedor aparece en el cuerpo normativo.
- Un paso solo tiene sentido conociendo el comportamiento de una herramienta concreta.
- El protocolo no puede explicarse a alguien que usa otras herramientas sin traducirlo.
- La asignación de roles no cita ninguna observación que la sostenga.

Esta detección puede automatizarse: la puerta de calidad de este repositorio rechaza un activo de tipo `protocol` cuyo cuerpo normativo mencione un proveedor, un modelo o un proyecto concreto fuera de las secciones `## Evidencia y límites` y `## Adaptadores no normativos`.

## Confusiones frecuentes

**Nombrar un producto no siempre es acoplamiento.** Citar dónde se observó una práctica es traza de evidencia, y pertenece a la sección de evidencia. Lo que acopla es que el contrato dependa de ese nombre.

**La neutralidad no significa vaguedad.** Un protocolo neutral puede ser extremadamente preciso sobre capacidades, autoridad y evidencia; lo que no fija es quién las provee.

**Un adaptador concreto es útil.** El error no es documentar cómo se ejecuta el protocolo con una herramienta, sino no separarlo del protocolo.

## Patrón alternativo

Aplicar [AFP-003](../protocols/multi-agent-collaboration.protocol.md), que define roles como capacidades lógicas y enrutamiento por capacidad verificada, y redactar con la [plantilla de protocolo](../templates/protocol.template.md), que exige la separación entre cuerpo normativo y adaptadores.
