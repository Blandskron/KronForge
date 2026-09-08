---
id: engineering-protocols.agnara-case-study
title: Agnara como banco de pruebas multiagente
summary: Qué prácticas de la suite de protocolos se ejercen realmente en un repositorio operado por varios agentes, y qué no demuestran todavía.
type: case-study
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [caso, evidencia, multiagente, trazabilidad, limitaciones]
related:
  - engineering-protocols.protocol-maturity
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.multi-agent-collaboration
  - engineering-protocols.release-readiness
specRefs:
  - spec: agnara
    version: develop@7bd2525
    url: https://github.com/Blandskron/agnara
    verified: 2026-09-07
---

# Caso: Agnara como Banco de Pruebas Multiagente

`Blandskron/agnara` es el proyecto del que se extrajo la mayor parte de la evidencia empírica de esta suite. Este documento registra qué se observó, qué generalización motivó y qué sigue sin demostrar.

No es una recomendación del proyecto ni una descripción de sus capacidades como framework. Es un registro de prácticas de ingeniería observadas, con sus límites.

**Estado auditado:** rama `develop`, confirmación `7bd2525`, el 2026-09-07.

## Contexto

Un framework de capacidades en Python, mantenido por una persona y desarrollado en gran parte por agentes de IA que trabajan sobre el mismo repositorio. Al momento de la auditoría llevaba tres versiones alfa publicadas y preparaba la cuarta.

El problema de ingeniería que enfrenta no es generar código. Es que varios participantes automáticos modifiquen un repositorio compartido sin que el resultado sea incoherente, y que las afirmaciones sobre ese resultado sean verificables.

## Participantes

El repositorio mantiene un registro de identidades autorizadas para atribución en el control de versiones. En la confirmación auditada contiene tres entradas: un agente de OpenAI autorizado el 2026-09-01, uno de Google el mismo día y uno de Anthropic el 2026-09-05. Cada entrada declara su cuenta, su identificador público y una URL de evidencia.

Sobre las 250 confirmaciones más recientes de `develop`, la distribución de coautoría declarada es:

| Identidad en el trailer | Confirmaciones |
|---|---|
| `Codex <codex@openai.com>` | 408 |
| `gemini-cli <…@users.noreply.github.com>` | 56 |
| `Claude Opus 5 <noreply@anthropic.com>` | 42 |
| `Claude <noreply@anthropic.com>` | 31 |
| Identidades humanas | 26 |
| `Antigravity <antigravity@google.com>` | 3 |

El recuento supera al de confirmaciones porque una misma confirmación puede declarar varios coautores.

Las cifras confirman que el experimento multiagente es real y sostenido, no una demostración puntual. También revelan dos desviaciones respecto de la política del propio repositorio, que se registran aquí como hallazgo: la entrada `Claude Opus 5` no coincide con el nombre declarado en el registro para esa identidad, y `Antigravity <antigravity@google.com>` no corresponde a ninguna entrada autorizada. La política del proyecto exige identidad autorizada y verificable, y prohíbe convertir un nombre de modelo o un dominio de proveedor en identidad. Ambas desviaciones son exactamente el fallo que esa política describe, ocurriendo bajo la política.

Esto no invalida el mecanismo. Ilustra algo que la suite generaliza en [AFP-003](../protocols/multi-agent-collaboration.protocol.md): una política de atribución sin comprobación automática se erosiona, y el propio repositorio reconoce que su compuerta de integridad de atribución es una revisión manual a la espera de un registro en el que se pueda confiar.

## Modelo operativo observado

### Coordinación por propiedad atómica

El repositorio es el plano de control. La dirección vive en el roadmap, la planificación en el backlog, y las unidades ejecutables son incidencias de la plataforma de alojamiento, coordinadas por sus comentarios.

Cada incidencia ejecutable declara un bloque de metadatos con su alcance de escritura y de lectura como rutas, más sus dependencias y conflictos. Una herramienta de coordinación evalúa las incidencias abiertas, extrae alcances y reservas activas, y devuelve la siguiente tarea lista que no colisiona con trabajo en curso. La reserva se adquiere publicando una reclamación y releyendo los comentarios en orden cronológico: el proceso termina con éxito si ganó la carrera y con fallo si otro llegó antes. Las reservas expiran a las dos horas, de modo que un participante que se cae no bloquea la tarea indefinidamente.

Para agentes concurrentes en la misma máquina, el repositorio exige árboles de trabajo aislados y lo declara como obligación, no como recomendación.

**Generalizado en:** [AFP-003](../protocols/multi-agent-collaboration.protocol.md), como las cuatro propiedades que debe tener un mecanismo de propiedad — atómico, observable, expirable, liberable — sin prescribir esta implementación.

### Roles desacoplados de productos

El modelo operativo define roles de planificación, implementación, revisión, publicación y mantenimiento, y declara explícitamente que son responsabilidades y no necesariamente productos distintos. La propiedad de implementación se distingue de la propiedad de revisión, y un agente que revisa una propuesta de cambio no puede reclamar la incidencia de implementación original.

**Generalizado en:** [AFP-003](../protocols/multi-agent-collaboration.protocol.md).

### Ciclo con observación previa

El bucle documentado empieza observando el estado del enjambre y las tareas disponibles antes de seleccionar, e incluye reconciliación al final. Existe un orden de triage explícito que antepone seguridad, rama base rota y trabajo revisable propio a cualquier tarea nueva, con la instrucción de no abandonar trabajo a medio revisar por algo más interesante.

**Generalizado en:** [AFP-001](../protocols/repository-state.protocol.md).

### El estado vive en artefactos

El modelo operativo prohíbe apoyarse en memoria privada del agente para trabajo pendiente, decisiones arquitectónicas, bloqueos, defectos conocidos y requisitos de publicación. Todo eso debe persistir como incidencias, comentarios, decisiones registradas o documentación.

**Generalizado en:** [AFP-002](../protocols/work-delegation.protocol.md) y [AFP-001](../protocols/repository-state.protocol.md).

## Evidencia y compuertas

Esta es la parte más fuerte del caso y la que sostiene [AFP-004](../protocols/evidence-and-gates.protocol.md).

El documento de compuertas del proyecto establece que reportar una compuerta como aprobada sin haberla ejecutado es un fallo peor que una construcción en rojo. No es una recomendación aislada: el mecanismo está implementado.

La herramienta de evaluación de preparación de publicación separa tres clases de compuerta y las trata de forma distinta:

| Clase | Comportamiento implementado |
|---|---|
| Automática | Se re-deriva del repositorio en cada ejecución. El archivo de estado no puede afirmar algo que el repositorio contradiga. |
| Por evidencia | Válida solo mientras la confirmación sobre la que se registró sigue vigente. Caduca cuando cambian los archivos que declara cubrir. |
| Manual | La herramienta nunca puede satisfacerla. Requiere juicio humano. |

Su documentación interna lo resume así: una compuerta marcada como satisfecha sin evidencia es un error, no una advertencia. Y la nota de estado añade una formulación que la suite adoptó como principio: una evidencia registrada no puede sobrevivir al código que describía.

La herramienta declara explícitamente que no publica, no etiqueta y no cambia versiones. La separación entre medir preparación y autorizar publicación está implementada en el código, no solo documentada.

**Generalizado en:** [AFP-004](../protocols/evidence-and-gates.protocol.md) y [AFP-009](../protocols/release-readiness.protocol.md).

## Validación de consumo externo

La compuerta de empaquetado no se ejecuta contra el árbol de fuentes. Construye los artefactos, crea un entorno fuera del espacio de trabajo, instala las dependencias de terceros propias de los adaptadores, instala después el conjunto completo de artefactos propios con el acceso al índice deshabilitado, y ejecuta la comprobación con el intérprete de ese entorno en modo aislado. Importar desde el código fuente es imposible por construcción.

En paralelo, un manifiesto clasifica cada exportación pública de cada distribución, y una prueba de arquitectura falla si un ejemplo, una guía o un proyecto generado alcanza un módulo no clasificado como público.

**Hallazgo real producido por este mecanismo:** consumir la nueva interfaz pública desde fuera reveló un defecto del framework que las pruebas internas no habían detectado — el enlace de objetos JSON a tipos de datos estándar en la frontera de red — que derivó en una decisión arquitectónica registrada y su corrección. Es la evidencia más concreta del caso: la validación externa encontró algo que la validación interna no podía encontrar.

El proyecto declara además, de forma explícita, que nada en el repositorio puede satisfacer sus compuertas externas por sí solo, y que pasar las pruebas internas no es evidencia de que un consumidor externo pueda hacer lo mismo.

**Generalizado en:** [AFP-006](../protocols/external-consumption-validation.protocol.md).

## Conformidad entre interfaces

El proyecto mantiene una matriz semántica entre invocación directa, interfaz de red y protocolo de herramientas, con evidencia ejecutable en una suite dedicada. Declara que registra equivalencia y no identidad byte a byte, define un vocabulario canónico de fallos neutral respecto del transporte, y fija un orden de ejecución — políticas, luego materialización de la entrada, luego validación estricta — que es precisamente el tipo de invariante que las suites por adaptador no comparan entre sí.

Su documento de compuertas exige que cada adaptador registre la revisión de especificación soportada, las capacidades opcionales no soportadas y la versión de la suite, y establece que el soporte de una revisión por parte de la biblioteca subyacente es necesario pero insuficiente para afirmar conformidad.

**Generalizado en:** [AFP-007](../protocols/interface-conformance.protocol.md).

## Registro de decisiones

El repositorio mantiene decisiones registradas y propuestas abiertas separadas, con la regla de que una propuesta contiene una pregunta abierta y que, una vez respondida, la respuesta pertenece a una decisión que la propuesta debe nombrar. Una prueba de arquitectura verifica que cada número identifique exactamente un documento; existe porque un número identificó dos.

Mantiene además un mapa que declara qué documento posee qué verdad, con la regla de preferir una cita a una copia, y comprobaciones automáticas sobre la parte verificable.

**Hallazgo honesto del propio proyecto:** su índice de propuestas advierte que los campos de estado no distinguen hoy una pregunta viva de una resuelta, y remite al documento que sí es fiable. El proyecto detecta y declara su propia deriva documental en lugar de ocultarla.

**Generalizado en:** [AFP-010](../protocols/decision-records.protocol.md).

## Qué valida este caso

| Protocolo | Qué sostiene esta evidencia |
|---|---|
| [AFP-001](../protocols/repository-state.protocol.md) | Que el ciclo con observación previa y triage explícito se puede operar de forma sostenida. |
| [AFP-002](../protocols/work-delegation.protocol.md) | Que declarar alcance por rutas es suficiente para decidir paralelismo. |
| [AFP-003](../protocols/multi-agent-collaboration.protocol.md) | Que la propiedad atómica con expiración funciona con varios agentes reales. |
| [AFP-004](../protocols/evidence-and-gates.protocol.md) | Que la separación en tres clases de compuerta y la caducidad de evidencia son implementables. |
| [AFP-005](../protocols/independent-review.protocol.md) | Que la separación implementador/revisor puede declararse y sostenerse como política. |
| [AFP-006](../protocols/external-consumption-validation.protocol.md) | Que la validación externa detecta defectos que la interna no detecta. |
| [AFP-007](../protocols/interface-conformance.protocol.md) | Que una matriz de equivalencia semántica entre tres adaptadores es mantenible. |
| [AFP-009](../protocols/release-readiness.protocol.md) | Que preparar y autorizar pueden separarse en el código, no solo en el documento. |
| [AFP-010](../protocols/decision-records.protocol.md) | Que la propiedad documental única es enforzable parcialmente por máquina. |

## Qué no valida este caso

Esta sección es la que impide que el documento se convierta en publicidad.

- **Un solo proyecto.** Ningún protocolo alcanza `reproduced` con esta evidencia. Un segundo proyecto independiente es el requisito que falta.
- **Un solo mantenedor.** El human owner, el operador de los agentes y el autor de los protocolos son la misma persona. La separación entre validar y autorizar no ha sido probada bajo tensión organizativa: nadie ha tenido que negarle una publicación a otro.
- **Un solo ecosistema.** Toda la evidencia de empaquetado y consumo externo proviene de un ecosistema. La generalización a contenedores, binarios, kits de desarrollo o plantillas es propuesta, no observada.
- **Sin medición.** No existe ninguna medición de efectividad. No se sabe si el mecanismo de propiedad reduce colisiones frente a no tenerlo, ni si el vocabulario de estados reduce las declaraciones falsas, ni cuántos defectos evita la revisión independiente. Todos los protocolos de la suite están en `experimental` por esta razón, y ninguno puede pasar a `validated` sin este trabajo.
- **Revisión independiente intermitente.** La decisión que la establece está en estado propuesto, y el proyecto opera con un número reducido de identidades. El nivel más fuerte de independencia no se alcanza de forma consistente.
- **Atribución con deriva observada.** El propio registro de identidades tiene desviaciones, documentadas más arriba.
- **Compuertas de seguridad pendientes.** El proyecto declara que análisis estático de seguridad, auditoría de dependencias, escaneo de secretos, inventario de componentes y firma de artefactos no están configurados. La evidencia sobre el perfil de seguridad de la suite es, por tanto, inexistente.
- **Reproducción documental no demostrada.** La compuerta que exige construir algo usando solo documentación pública está declarada pero todavía no satisfecha.

## Prácticas no generalizadas

Se examinaron y se dejaron deliberadamente fuera de la suite:

| Práctica | Por qué no se generalizó |
|---|---|
| El formato concreto del bloque de metadatos de tarea | Detalle de implementación acoplado a la plataforma de alojamiento. |
| La expiración de dos horas | Valor calibrado para un proyecto concreto; la propiedad generalizable es que exista expiración. |
| Los comandos concretos de las compuertas | Acoplan a un ecosistema; la suite generaliza la pregunta, no el comando. |
| La numeración y ubicación de las decisiones | Convención local sin propiedad transferible. |
| La lista concreta de subsistemas y su estado | Contenido del proyecto, no protocolo. |
| El uso de una herramienta de coordinación en el repositorio | Implementación de la propiedad atómica, no la propiedad en sí. |

## Lecciones

1. **Lo que más valor produjo no fue la coordinación, sino la evidencia.** El mecanismo de caducidad — una evidencia no puede sobrevivir al código que describía — es la idea con mayor razón de transferencia de todo el caso.
2. **La validación externa encontró lo que la interna no podía.** El único defecto de framework atribuible a un protocolo de esta suite lo produjo la validación de consumo externo.
3. **Una política sin comprobación automática se erosiona.** La atribución lo demuestra dentro del mismo repositorio que escribió la política.
4. **Declarar lo que no se demostró es lo que hace utilizable el registro.** Los registros de publicación del proyecto incluyen una sección de lo que la versión no probó, y esa sección es la que permite confiar en el resto.
