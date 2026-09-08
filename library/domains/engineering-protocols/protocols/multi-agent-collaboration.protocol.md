---
id: engineering-protocols.multi-agent-collaboration
title: Colaboración multiagente
summary: Coordinar varios agentes sobre un mismo repositorio mediante roles, autoridad y propiedad explícitas.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: advanced
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [multiagente, roles, autoridad, concurrencia, atribucion]
related:
  - engineering-protocols.repository-state
  - engineering-protocols.work-delegation
  - engineering-protocols.independent-review
  - engineering-protocols.decision-records
  - agent-interoperability.agent-cards-and-trust
protocol:
  code: AFP-003
  maturity: experimental
  actors: [planner, implementer, reviewer, validator, release-agent, maintainer, research-agent, human-owner]
  dependsOn: [AFP-001, AFP-002]
  observedIn: [agnara]
  lastValidated: 2026-09-07
---

# AFP-003 — Colaboración Multiagente

El protocolo central de la suite. Define cómo varios agentes trabajan sobre un mismo proyecto sin convertir el repositorio en un conflicto permanente, y cómo se preserva la autoridad humana cuando la mayor parte del trabajo la ejecutan sistemas automáticos.

## Problema

Coordinar varios agentes no es un problema de capacidad. Cada agente puede ser individualmente competente y el conjunto seguir produciendo un repositorio incoherente.

Las causas se repiten:

- dos participantes editan la misma superficie sin saberlo;
- el estado del proyecto vive en conversaciones privadas que nadie más puede leer;
- todos implementan y nadie revisa, o quien revisa parte de la explicación de quien implementó;
- el desacuerdo se resuelve por insistencia o por consenso, no por evidencia;
- la autoridad se difumina hasta que nadie sabe quién autorizó un cambio.

Ninguna se resuelve con un prompt mejor. Todas se resuelven con un contrato explícito sobre roles, propiedad y autoridad.

## Actores

Los roles son capacidades lógicas, no productos. Un proyecto asigna qué participante cumple cada rol y esa asignación puede cambiar sin cambiar el protocolo.

| Rol | Responsabilidad | Autoridad típica |
|---|---|---|
| Planner | Convierte dirección en tareas ejecutables con dependencias. | Crear y ordenar tareas. |
| Implementer | Ejecuta un contrato de delegación dentro de su alcance. | Modificar las superficies declaradas. |
| Reviewer | Revisa desde la evidencia, no desde la narrativa del implementador. | Bloquear la integración. |
| Validator | Ejecuta compuertas y produce evidencia reproducible. | Declarar una compuerta no aprobada. |
| Release agent | Prepara candidatos y verifica compuertas de publicación. | Preparar; no publicar. |
| Maintainer | Triage, deuda, dependencias, deriva documental. | Abrir y priorizar trabajo. |
| Research agent | Investiga alternativas y produce comparaciones. | Ninguna sobre el código. |
| Human owner | Decide lo que la evidencia no puede decidir. | Toda la que no esté delegada. |

Un mismo participante puede cumplir varios roles en trabajo de bajo riesgo. La combinación que nunca es válida es implementer y reviewer sobre el mismo cambio de alto riesgo — ver [AFP-005](independent-review.protocol.md).

### Fronteras de autoridad

La autoridad se declara por lo que un participante puede hacer, no por lo que sabe hacer. Un ejemplo de declaración:

```markdown
## Autoridad del agente

Permitido:
- modificar archivos fuente dentro del alcance asignado;
- crear pruebas;
- crear ramas;
- abrir propuestas de cambio.

Prohibido:
- integrar en la rama principal;
- publicar artefactos;
- modificar secretos;
- desplegar a producción.

Requiere aprobación humana:
- publicación de una versión;
- migración de datos;
- dependencia con permisos críticos;
- cambio de las reglas de este documento.
```

La última línea importa más de lo que parece. Un agente que puede relajar las reglas que lo gobiernan no está gobernado. Las mejoras al proceso se proponen y se revisan; nunca se aplican en silencio para que la automatización sea más cómoda.

## Ciclo de vida

```text
descubrimiento de participantes
   → asignación de roles
      → propiedad de tarea
         → ejecución (paralela o secuencial)
            → evidencia
               → revisión independiente
                  → reconciliación
                     → cierre
```

En cualquier punto puede aparecer conflicto o bloqueo, y ambos tienen salida definida.

### Propiedad de tarea

Antes de modificar, un participante adquiere la propiedad de la tarea de forma observable. Un mecanismo de propiedad utilizable debe cumplir cuatro condiciones:

1. **Atómico.** Dos participantes que compiten no pueden ganar ambos. El mecanismo debe resolver la carrera, no confiar en que no ocurra.
2. **Observable.** Cualquier otro participante puede consultar quién posee qué sin preguntar.
3. **Expirable.** Un participante que desaparece no bloquea la tarea para siempre.
4. **Liberable.** La propiedad se suelta explícitamente al terminar.

Un mecanismo concreto que satisface las cuatro: la tarea declara su alcance de escritura como rutas, el participante publica una reclamación en el propio artefacto de la tarea, relee las reclamaciones en orden cronológico y solo procede si ganó la carrera, con expiración por tiempo. El protocolo no exige ese mecanismo; exige las cuatro propiedades.

### Paralelo y secuencial

El paralelismo no es superior por defecto. Es una optimización que introduce riesgo de reconciliación.

El trabajo puede ejecutarse en paralelo cuando:

- los alcances de escritura no se solapan;
- no comparten invariantes que un cambio pueda romper del lado del otro;
- no existe dependencia declarada entre las tareas;
- cada participante trabaja en un directorio de trabajo aislado.

Debe permanecer secuencial cuando:

- una tarea depende del resultado de otra;
- ambas tocan un contrato compartido — un esquema, una interfaz pública, un formato de configuración;
- el orden de integración cambia el resultado;
- la reconciliación sería más cara que la espera.

El aislamiento de directorio de trabajo no es opcional para participantes concurrentes en la misma máquina. Compartir un árbol de trabajo entre dos agentes que editan produce corrupción silenciosa: cada uno observa cambios que no hizo y los interpreta como estado del repositorio.

Tras integrar trabajo paralelo, las compuertas se re-ejecutan sobre el resultado combinado. Que dos ramas pasaran por separado no es evidencia de que su unión pase.

### Transferencia de contexto

El estado que otro participante necesita vive en artefactos inspeccionables. Nunca en memoria de sesión.

Esto incluye, como mínimo: trabajo pendiente, decisiones arquitectónicas, bloqueos, defectos conocidos y requisitos de publicación. Un agente que responde «eso lo discutimos antes» a un participante nuevo ha convertido su conversación en una dependencia del proyecto.

Ver [AFP-002](work-delegation.protocol.md) para el formato de transferencia.

## Resolución de conflictos

Cuando dos participantes discrepan, el desacuerdo se resuelve por evidencia, en este orden. Solo se avanza al siguiente nivel cuando el anterior no decide.

```text
1. fuentes de verdad declaradas
2. criterios de aceptación de la tarea
3. evidencia reproducible
4. arquitectura y gobernanza registradas
5. experimento o medición
6. decisión del human owner
```

Lo que no resuelve un conflicto: la votación entre agentes. Tres participantes de acuerdo no constituyen evidencia; constituyen tres opiniones correlacionadas, y suelen estar correlacionadas precisamente porque comparten el mismo sesgo de entrenamiento o el mismo contexto de entrada.

Un desacuerdo arquitectónico significativo que la evidencia no resuelve se registra como decisión abierta bajo [AFP-010](decision-records.protocol.md). No se deja enterrado en un hilo de comentarios: el siguiente participante que llegue al mismo punto merece encontrar la discusión, no repetirla.

## Enrutamiento por capacidad

Un proyecto no asigna roles por marca. Asigna por capacidad verificada frente a lo que la tarea exige.

Dimensiones de capacidad que suelen distinguir participantes:

```text
planificación            revisión de código
implementación           pruebas y depuración
análisis de contexto     investigación
amplio                   arquitectura
interacción con          seguridad
navegador                documentación
acceso a herramientas    autoridad sobre el sistema de archivos
                         autoridad sobre la plataforma de alojamiento
```

Un proyecto puede mantener un perfil de capacidades versionado, con una condición: cada capacidad declarada debe apoyarse en observación registrada, no en material promocional del proveedor. Un perfil de capacidades sin evidencia es una preferencia disfrazada de arquitectura.

Fijar «este participante siempre hace backend» acopla el proceso a un proveedor concreto. Cuando ese participante cambie —y cambiará— el protocolo debe sobrevivir sin reescribirse.

## Atribución y procedencia

La colaboración multiagente introduce un problema de crédito que no existía: varios participantes contribuyen y solo algunos tienen identidad verificable en el sistema de control de versiones.

El protocolo distingue seis cosas que suelen confundirse:

| Concepto | Qué es |
|---|---|
| Human owner | Quien responde por el proyecto. |
| Autor de la confirmación | La identidad que el sistema de versiones registra. |
| Participante agente | Un sistema que contribuyó materialmente. |
| Rol de implementación | Qué trabajo material hizo. |
| Rol de revisión | Qué revisó, registrado en el rastro de revisión. |
| Identidad verificada | Una cuenta comprobable, no un nombre de modelo. |

Reglas:

1. **Nunca inventar una identidad.** El nombre de un modelo, de un producto o de un proveedor no es una cuenta. Un correo plausible no es evidencia de propiedad de esa cuenta.
2. **Atribución solo con participación material y identidad verificable.** Ambas condiciones, no una.
3. **Ningún participante atribuye a otro sin evidencia** de que ese otro participó.
4. **Revisión y autoría son distintas.** Quien solo revisó se acredita en el rastro de revisión, no como coautor.
5. **Cuando no hay identidad verificable, se preserva la transparencia sin fabricar crédito:**

```text
Agente: <nombre usado en la sesión>
Rol: <rol lógico>
Contribución: <trabajo material realizado>
Identidad verificada para atribución: no
```

6. **La atribución legítima sobrevive a las operaciones de historial.** Reescribir, reordenar o condensar confirmaciones no debe descartar crédito real ni duplicar al autor principal.

La procedencia se distribuye así: la autoría aceptada vive en el historial de versiones; los roles operativos, la contribución material y las limitaciones de verificación viven en los artefactos de la tarea y de la revisión.

## Falla

| Situación | Comportamiento |
|---|---|
| Otro participante modificó la misma área | Detenerse, reconciliar, revalidar. No sobrescribir. |
| No se puede adquirir propiedad | Tomar otra tarea sin colisión o detenerse. |
| Discrepancia sin evidencia que la resuelva | Registrar la decisión abierta y escalar. |
| Un rol obligatorio no está disponible | Documentar la limitación; no simularla. |
| La autoridad requerida no está delegada | Solicitar autorización; no ampliarla unilateralmente. |

La cuarta fila es la más importante y la más incumplida. Cuando no hay revisión independiente disponible, el protocolo no permite fingir que la hubo: permite continuar declarando explícitamente que no la hubo.

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` implementa un mecanismo de propiedad con las cuatro propiedades descritas — reclamación publicada en el artefacto de la tarea, relectura cronológica para resolver la carrera, expiración por tiempo y liberación explícita — sobre tareas que declaran su alcance de escritura y lectura como rutas. Exige aislamiento por directorio de trabajo para participantes concurrentes locales. Separa propiedad de implementación de propiedad de revisión, y prohíbe que quien revisa reclame la tarea de implementación. Define roles lógicos explícitamente desacoplados de productos. Su política de atribución exige participación material más identidad autorizada y verificable, rechaza convertir un nombre de modelo en identidad, y documenta al participante no verificable en lugar de inventarle una cuenta. Prohíbe además que un agente rebaje reglas de calidad o seguridad para facilitar su propia automatización.

Lo que no lo sostiene: el proyecto observado opera con un número reducido de identidades de agente, y su propia decisión de gobernanza registra que la revisión independiente es el modelo preferido pero no siempre disponible. El orden de resolución de conflictos de seis niveles es una generalización propuesta aquí; no se observó un caso registrado de conflicto entre agentes resuelto por ese orden. El enrutamiento por capacidad con perfil versionado no está implementado en ningún repositorio auditado: se propone como alternativa a la asignación por marca, sin evidencia de que mejore el resultado. No existe medición de tasa de colisión con y sin el mecanismo de propiedad.

## Qué no afirma este protocolo

- No afirma que más participantes produzcan mejor software.
- No afirma que el paralelismo sea preferible. Afirma que exige condiciones que deben verificarse antes.
- No afirma que el acuerdo entre participantes sea evidencia. Afirma lo contrario.
- No define cómo se revisa; eso pertenece a [AFP-005](independent-review.protocol.md).
- No define qué constituye evidencia; eso pertenece a [AFP-004](evidence-and-gates.protocol.md).
- No garantiza ausencia de conflictos de integración. Afirma que los hace visibles antes de la integración en lugar de después.
