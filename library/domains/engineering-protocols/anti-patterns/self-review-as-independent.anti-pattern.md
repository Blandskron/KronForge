---
id: engineering-protocols.self-review-as-independent
title: Autorrevisión presentada como revisión independiente
summary: Presentar la revisión del propio trabajo, o el acuerdo entre participantes, como si fuera revisión independiente.
type: anti-pattern
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [revision, independencia, sesgo, gobernanza]
related:
  - engineering-protocols.independent-review
  - engineering-protocols.multi-agent-collaboration
---

# Anti-patrón: Autorrevisión Presentada como Revisión Independiente

## Descripción

El proyecto declara que sus cambios pasan por revisión, pero la revisión la ejecuta quien implementó, o un participante que parte de la explicación del implementador, o varios participantes cuyo acuerdo se presenta como verificación.

El registro dice «revisado». La propiedad que la revisión debía aportar no está.

## Cómo se ve

```text
Revisé mi implementación y está correcta.

Implementé todo correctamente. Revisa mi solución.
> La implementación parece correcta. Aprobado.

Tres agentes coincidieron en que el diseño es adecuado.

Aprobación automática: la integración continua está en verde.
```

El segundo caso es el más común y el más difícil de ver, porque formalmente hubo dos participantes. Pero el revisor empezó leyendo la narrativa del implementador, y a partir de ahí su tarea fue confirmar o refutar esa narrativa en lugar de evaluar el cambio contra lo que se pidió.

## Por qué parece razonable

Porque las tres formas producen el artefacto esperado: existe un registro de revisión. Cuando el proyecto tiene una sola identidad disponible, además, la alternativa aparente es no tener revisión, y algo parece mejor que nada.

El acuerdo entre varios participantes automáticos resulta especialmente convincente porque imita la revisión por pares. Pero dos sistemas entrenados sobre material parecido tienden a considerar razonable lo mismo: su coincidencia aporta menos información de la que aparenta, y la aporta precisamente en los casos donde comparten el error.

## Consecuencias

- Los errores de comprensión sobreviven: son exactamente los que el autor no puede ver en su propio trabajo.
- El registro del proyecto sobrestima la fuerza de su proceso, y esa sobrestimación se propaga a quien decide publicar.
- Las áreas de alto riesgo reciben la misma revisión nominal que un cambio trivial.
- Cuando aparece un defecto, el proyecto no puede distinguir si su revisión falló o si nunca existió.

## Cómo se corrige

1. Declarar el nivel de independencia alcanzado junto al veredicto, en lugar de declarar solo que hubo revisión.
2. Cuando solo hay una identidad, ejecutar la autorrevisión y nombrarla autorrevisión. No configurar una aprobación imposible ni fabricar una.
3. Para cambios de alto riesgo, exigir revisión independiente real: si no está disponible, el cambio espera o se escala.
4. Invertir el orden de lectura del revisor: fuentes primarias primero, explicación del implementador después.
5. Tratar el acuerdo entre participantes como una señal débil, nunca como evidencia.

## Cómo detectarlo

- El veredicto no declara el nivel de independencia.
- El revisor cita la explicación del implementador y no la tarea ni la diferencia.
- La revisión no contiene ningún hallazgo, ni siquiera de severidad baja, de forma sistemática.
- El autor cerró un hallazgo propio de severidad alta.
- La revisión no podría haber terminado en rechazo.

El último criterio es el más útil: si la revisión estructuralmente no podía concluir «no integrar», no era una revisión.

## Confusiones frecuentes

**La autorrevisión no es inútil.** Detecta descuidos, y un proyecto con una sola identidad debe hacerla. Lo que no puede es llamarse de otra manera.

**La integración continua en verde no es una revisión.** Verifica lo que alguien pensó en verificar. No evalúa si se resolvió el problema correcto.

**Más revisores no producen más independencia** si todos parten del mismo resumen.

## Patrón alternativo

Aplicar [AFP-005](../protocols/independent-review.protocol.md), que define cuatro niveles de independencia, exige declarar cuál se alcanzó y fija el orden de lectura que preserva la independencia del revisor.
