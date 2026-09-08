---
id: engineering-protocols.unverified-gate-claim
title: Compuerta aprobada sin ejecución
summary: Reportar una compuerta como aprobada apoyándose en inferencia, memoria o en la afirmación de otro participante.
type: anti-pattern
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [evidencia, compuertas, verificacion, alucinacion]
related:
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.completion-and-stop
  - documentation-knowledge.invented-commands
---

# Anti-patrón: Compuerta Aprobada sin Ejecución

## Descripción

Un participante declara que una compuerta pasó sin haberla ejecutado sobre el estado actual del código. La declaración puede venir de una inferencia razonable, de un resultado recordado, de una ejecución parcial extrapolada, o de la afirmación de otro participante que tampoco la ejecutó.

El texto resultante es indistinguible del de una verificación real.

## Cómo se ve

```text
Todas las pruebas pasan.
Verifiqué que la compilación funciona.
Esto es equivalente a lo que ya estaba cubierto, así que el comportamiento se mantiene.
El agente anterior confirmó que la suite estaba en verde.
```

Ninguna de estas frases contiene un comando, una observación ni un estado del código. Las cuatro se leen como evidencia.

## Por qué parece razonable

Porque casi siempre acierta. Un participante competente que infiere «esto no rompe nada» tiene razón la mayoría de las veces, y las veces que acierta refuerzan el hábito. El coste llega concentrado y tarde, en el caso que no era como los anteriores.

Contribuye además una asimetría de esfuerzo: ejecutar la compuerta cuesta minutos, inferirla cuesta segundos, y el resultado se ve igual en ambos casos.

Y hay una tercera causa, específica de los sistemas automáticos: el lenguaje natural no distingue ejecutar de suponer. «Verifiqué» describe correctamente ambas cosas, así que un participante puede declararlo sin ninguna intención de engañar.

## Consecuencias

- La compuerta deja de cumplir su función: no puede fallar, luego no mide.
- El siguiente participante toma la afirmación como premisa y construye encima.
- El defecto aparece más tarde, más lejos de su causa y más caro de diagnosticar.
- La confianza en todas las demás afirmaciones del proyecto baja, incluidas las verdaderas.
- Una compuerta falsamente verde es peor que una roja: la roja detiene el trabajo, la verde lo deja avanzar sobre una base que nadie comprobó.

## Cómo se corrige

1. Ejecutar la compuerta sobre el estado actual y registrar el comando exacto y la observación exacta.
2. Cuando no pueda ejecutarse, declarar `NOT_RUN` con la razón. Es un resultado legítimo.
3. Registrar la evidencia contra el estado del código que la produjo, para que caduque cuando ese código cambie.
4. Al citar la evidencia de otro participante, verificar que exista y siga vigente; una cita a una afirmación no es evidencia.

## Cómo detectarlo

- La afirmación no contiene comando ni observación.
- El resultado se resume («todo verde») en lugar de citarse.
- La evidencia es anterior al último cambio del código que cubría.
- Una compuerta lleva mucho tiempo sin fallar nunca.
- El registro dice que una compuerta manual está satisfecha y ninguna persona la evaluó.

## Confusiones frecuentes

**No es lo mismo que equivocarse.** Un participante que ejecuta y observa mal comete un error corregible. Uno que no ejecuta no cometió un error: no produjo información.

**No se resuelve pidiendo más cuidado.** El problema es que el formato de salida no distingue ejecución de inferencia. Se resuelve exigiendo comando y observación, que sí distinguen.

**Un participante que dice «no pude verificarlo» no está fallando.** Está entregando exactamente la información que el revisor necesita.

## Patrón alternativo

Aplicar [AFP-004](../protocols/evidence-and-gates.protocol.md), que separa afirmación, ejecución, observación, evidencia, compuerta y veredicto, y registrar el resultado con el [registro de evidencia](../templates/evidence-record.template.md).
