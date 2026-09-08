---
id: engineering-protocols.repository-state
title: Estado del repositorio y ciclo del agente
summary: Obligar a un agente a reconstruir el estado del repositorio antes de modificarlo.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [repositorio, estado, ciclo, observacion, agentes]
related:
  - engineering-protocols.work-delegation
  - engineering-protocols.completion-and-stop
  - repository-engineering.design-ai-first-repository
protocol:
  code: AFP-001
  maturity: experimental
  actors: [any-agent, human-owner]
  dependsOn: []
  observedIn: [agnara]
  lastValidated: 2026-09-07
---

# AFP-001 — Estado del Repositorio y Ciclo del Agente

Un agente profesional no empieza una tarea escribiendo código. Empieza reconstruyendo qué es cierto en el repositorio ahora mismo.

Este protocolo define el ciclo mínimo que precede a cualquier modificación, y qué debe poder responder el agente antes de tener derecho a editar un archivo.

## Problema

El fallo característico de un agente sobre un proyecto real no es escribir código incorrecto. Es escribir código correcto para un repositorio que ya no existe: reimplementar algo que otro agente terminó ayer, contradecir una decisión registrada hace tres semanas, o modificar un área que otra tarea tiene bloqueada.

Ninguno de esos fallos es detectable revisando el diff. Todos son detectables observando el estado antes de empezar.

El problema se agrava con el tamaño. En un repositorio pequeño, el contexto cabe en la ventana y la observación es implícita. En un repositorio grande con varios participantes, el estado solo existe en artefactos, y quien no los lee está trabajando sobre una suposición.

## Actores

| Actor | Responsabilidad |
|---|---|
| Any agent | Ejecuta el ciclo completo antes de modificar. No delega la observación en su memoria de sesión. |
| Human owner | Mantiene inspeccionables los artefactos que el ciclo exige leer. |

Este protocolo no distingue roles: aplica a cualquier participante que vaya a modificar el repositorio, incluidos los humanos.

## Ciclo de vida

```text
OBSERVE → TRIAGE → SELECT → PLAN → EXECUTE → VERIFY → REVIEW → RECONCILE
   ↑                                                               │
   └───────────────────────────────────────────────────────────────┘
```

El ciclo se repite. Un agente que termina en `RECONCILE` vuelve a `OBSERVE`, no a `EXECUTE`: el repositorio cambió, incluso si lo cambió él mismo.

### OBSERVE

Reconstruir el estado sin modificar nada. Las observaciones mínimas:

| Observación | Responde |
|---|---|
| Rama actual y árbol de trabajo | ¿Estoy donde creo que estoy? ¿Hay cambios sin confirmar? |
| Estado del remoto | ¿Mi rama está desactualizada? |
| Trabajo en curso de otros | ¿Alguien está en esta área? |
| Integración continua | ¿La rama base está sana? |
| Decisiones registradas | ¿Esto ya se decidió? |
| Roadmap y release objetivo | ¿Esto pertenece a este ciclo? |
| Bloqueos declarados | ¿Hay algo detenido que me afecte? |
| Restricciones de seguridad y autoridad | ¿Qué no puedo tocar? |

Cuál de estas observaciones es barata depende del proyecto. Cuál es obligatoria, no: un agente que no puede responder «¿alguien está trabajando en esta área?» no ha observado.

### TRIAGE

Ordenar lo observado por prioridad, no por interés. Un orden por defecto razonable:

```text
1. seguridad o hotfix
2. rama base o integración continua rota
3. trabajo propio con cambios solicitados pendientes
4. trabajo propio listo para integrar
5. bloqueos de trabajo activo en el roadmap
6. tarea accionable de mayor prioridad
7. siguiente elemento del backlog que necesite una tarea
8. deuda y mantenimiento
```

La regla que este orden codifica: no abandones trabajo revisable a medio terminar para empezar algo más interesante. Un agente que deja tres ramas sin integrar y empieza una cuarta está produciendo deuda de coordinación, no progreso.

### SELECT

Elegir exactamente una unidad de trabajo y adquirir su propiedad de forma visible para los demás. Cómo se adquiere depende del proyecto — asignación, comentario, lease, etiqueta — pero debe cumplir dos condiciones: ser observable por otro participante y ser liberable si el agente desaparece.

Ver [AFP-003](multi-agent-collaboration.protocol.md) para la propiedad bajo concurrencia.

### PLAN

Antes de editar, escribir el plan donde otro pueda leerlo:

- objetivo de la tarea;
- criterios de aceptación;
- frontera arquitectónica afectada;
- pruebas esperadas;
- documentación probable;
- lo que explícitamente no se va a hacer.

Si la tarea implica una decisión arquitectónica no registrada, el plan se detiene y se abre la decisión bajo [AFP-010](decision-records.protocol.md). Cementar una decisión dentro de una implementación es la forma más cara de tomarla.

### EXECUTE

Modificar únicamente dentro del alcance declarado. El trabajo descubierto fuera de alcance se convierte en una tarea nueva, no en un diff más grande.

### VERIFY

Ejecutar las compuertas aplicables y conservar su evidencia. Una compuerta no ejecutada no se reporta como aprobada — ver [AFP-004](evidence-and-gates.protocol.md).

### REVIEW

Someter el trabajo a revisión independiente cuando el riesgo lo exija — ver [AFP-005](independent-review.protocol.md).

### RECONCILE

Cerrar el ciclo en los artefactos: actualizar la tarea, liberar la propiedad, registrar lo que quedó pendiente y confirmar que el estado del repositorio refleja lo ocurrido. Un ciclo que termina sin reconciliar deja al siguiente agente observando un estado falso.

## Contrato de observación

Un repositorio que adopta este protocolo debe permitir responder estas preguntas leyendo artefactos, sin conversación previa:

```text
¿Qué proyecto es este?
¿Qué puedo modificar?
¿Qué no puedo modificar?
¿Qué arquitectura existe?
¿Qué decisiones ya fueron tomadas?
¿Qué tarea debo realizar?
¿Quién está trabajando en otra parte?
¿Cómo verifico mi trabajo?
¿Quién debe revisarlo?
¿Qué evidencia debo producir?
¿Cuándo puedo decir que terminé?
¿Cuándo debo detenerme?
```

Si alguna de estas preguntas solo puede responderse preguntando a una persona, el repositorio todavía no es observable, y el protocolo no puede cumplirse por más disciplina que ponga el agente.

## Falla

| Situación | Comportamiento |
|---|---|
| El estado no puede observarse | No seleccionar trabajo. Reportar qué artefacto falta. |
| Dos artefactos se contradicen | Detenerse y escalar; no elegir el más conveniente. |
| La propiedad no puede adquirirse | Seleccionar otra tarea sin colisión, o detenerse. |
| El plan revela una decisión no registrada | Abrir la decisión antes de implementar. |

Ver [AFP-011](completion-and-stop.protocol.md) para el vocabulario de resultados.

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: el ciclo se ejerce en `Blandskron/agnara`, cuyo modelo operativo define un bucle equivalente y lo ata a artefactos concretos — el agente consulta el estado del enjambre y las tareas sin colisión antes de seleccionar, y el propio repositorio declara que el estado necesario para entender el progreso debe ser visible en artefactos y no en memoria privada del agente. Existe además una regla explícita de triage con orden de prioridad y la instrucción de no abandonar trabajo revisable a medio terminar.

Lo que no lo sostiene: no existe medición de si el ciclo reduce retrabajo frente a no seguirlo, ni evidencia de un segundo proyecto. El contrato de doce preguntas de esta página es una generalización propuesta aquí, no una práctica observada: ningún repositorio auditado las responde todas hoy. La lista de observaciones mínimas tampoco está priorizada por coste, y en un repositorio grande algunas de ellas son caras.

## Qué no afirma este protocolo

- No afirma que observar garantice una implementación correcta. Afirma que no observar garantiza un porcentaje de trabajo desperdiciado.
- No prescribe herramientas de observación, ni asume plataforma de alojamiento, sistema de tareas o integración continua.
- No sustituye la coordinación bajo concurrencia; eso pertenece a [AFP-003](multi-agent-collaboration.protocol.md).
- No define qué compuertas aplican al proyecto; eso pertenece a [AFP-004](evidence-and-gates.protocol.md).
- No afirma que el orden de triage propuesto sea óptimo. Es un orden por defecto que el proyecto puede sustituir declarándolo.
