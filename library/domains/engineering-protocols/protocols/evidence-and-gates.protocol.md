---
id: engineering-protocols.evidence-and-gates
title: Evidencia y compuertas de calidad
summary: Separar lo que un agente afirma de lo que ejecutó, observó y puede demostrar.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.1
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [evidencia, quality-gates, verificacion, reproducibilidad, definition-of-done]
related:
  - engineering-protocols.completion-and-stop
  - engineering-protocols.independent-review
  - quality-engineering.pre-merge
  - quality-engineering.definition-of-done-review
  - documentation-knowledge.invented-commands
protocol:
  code: AFP-004
  maturity: experimental
  actors: [executor, validator, reviewer, human-owner]
  dependsOn: [AFP-001]
  observedIn: [agnara]
  lastValidated: 2026-09-07
lastModified: 2026-11-25
inputs:
  - "Cambio identificado y criterios de aceptación"
  - "Compuertas y autoridad declaradas"
outputs:
  - "Registro de comando, observación y estado del código"
  - "Veredicto por compuerta y razones de omisión"
useCases:
  - "Demostrar que un cambio cumple criterios"
  - "Revisar vigencia de evidencia antes de integrar"
---

# AFP-004 — Evidencia y Compuertas de Calidad

Este es el protocolo del que dependen casi todos los demás. Define la diferencia entre que un participante diga que algo funciona y que exista una razón para creerlo.

## Problema

Un agente puede escribir «todas las pruebas pasan». Esa frase es compatible con al menos cuatro situaciones distintas:

- ejecutó las pruebas y pasaron;
- ejecutó una parte y extrapoló;
- recordó un resultado de hace veinte minutos y el código cambió desde entonces;
- infirió el resultado del código sin ejecutar nada.

Las cuatro producen el mismo texto. Solo una es evidencia.

El problema no es la deshonestidad, es la ambigüedad del lenguaje natural sobre acciones. «Verifiqué» describe tanto una ejecución como una lectura atenta, y quien lee no puede distinguirlas. En un proyecto con varios participantes, esa ambigüedad se acumula: cada afirmación no verificada se convierte en una premisa del siguiente, hasta que una compuerta se declara aprobada sobre una cadena que nadie ejecutó.

## Actores

| Actor | Responsabilidad |
|---|---|
| Executor | Ejecuta, observa y registra. No reporta lo que no ejecutó. |
| Validator | Produce evidencia reproducible de las compuertas del proyecto. |
| Reviewer | Verifica que la evidencia sostenga la afirmación, no que exista. |
| Human owner | Decide las compuertas que exigen juicio y no pueden automatizarse. |

## Vocabulario

Seis conceptos que el lenguaje natural mezcla y que este protocolo separa:

| Concepto | Definición | Ejemplo |
|---|---|---|
| **Afirmación** | Lo que un participante sostiene. | «El paquete funciona.» |
| **Ejecución** | Una acción concreta que ocurrió. | Se ejecutó el comando de pruebas. |
| **Observación** | El resultado que la ejecución produjo. | `1842 passed`. |
| **Evidencia** | Un registro verificable que liga ejecución y observación a un estado del código. | Comando, salida y confirmación exacta. |
| **Compuerta** | Una condición que el proyecto exige. | «La suite completa aprueba.» |
| **Veredicto** | La conclusión sobre la compuerta. | `PASS`, `FAIL`, `NOT_RUN`. |

La regla central del protocolo, y la más incómoda de cumplir:

> Un participante nunca reporta una compuerta como aprobada si no la ejecutó o no obtuvo evidencia autoritativa de que otro la ejecutó.

Su corolario es más incómodo todavía: reportar una compuerta como aprobada sin haberla ejecutado es un fallo más grave que una compuerta en rojo. Una compuerta roja detiene el trabajo; una compuerta falsamente verde lo deja avanzar sobre una base que nadie comprobó.

## Ciclo de vida

```text
compuerta declarada
   → ejecutada → observada → registrada → veredicto
        │                                     │
        │                                     └─→ caducada al cambiar el código
        └─→ no ejecutable → NOT_RUN con la razón declarada
```

`NOT_RUN` es un veredicto legítimo. No es un fallo del participante; es información que el revisor necesita. Convertirlo en `PASS` por comodidad es el fallo.

### Caducidad de la evidencia

La evidencia describe un estado del código y muere con él. Una evidencia registrada contra una confirmación deja de ser válida cuando cambian los archivos que cubría.

Esto es lo que separa un registro de evidencia útil de una lista de comprobación marcada: la lista sobrevive a los cambios, la evidencia no. Un proyecto que trata una compuerta como aprobada permanentemente está tratando una observación del pasado como una propiedad del presente.

El mecanismo mínimo: cada registro de evidencia declara la confirmación sobre la que se produjo y, cuando se puede, qué superficies cubría. Al cambiar esas superficies, el registro se reporta como caducado en lugar de aprobado.

## Qué cuenta como evidencia

| Tipo | Válido cuando |
|---|---|
| Comando y salida exacta | Se registra el comando literal y su resultado, no un resumen. |
| Informe de pruebas | Incluye recuento y estado, no «todo verde». |
| Ejecución de integración continua | Se referencia la ejecución concreta, no la existencia del sistema. |
| Hash de artefacto | Identifica el artefacto exacto que se validó. |
| Registro de medición | Cumple [AFP-008](benchmark.protocol.md). |
| Verificación de instalación | Se ejecutó contra el artefacto instalado, no contra el árbol de fuentes. |
| Ejecución en entorno limpio | Cumple [AFP-006](external-consumption-validation.protocol.md). |
| Análisis estático o de seguridad | Se identifica la herramienta, su versión y su configuración. |
| Revisión registrada | Existe el rastro, no solo la afirmación de que se revisó. |

Lo que no cuenta como evidencia, aunque suene igual:

- «Las pruebas deberían pasar.»
- «Esto es equivalente a lo que ya estaba probado.»
- «El código es correcto por inspección.»
- «Otro agente dijo que pasaba.» — salvo que ese otro haya registrado la evidencia y esta siga vigente.
- Una lista de comprobación marcada sin ejecución detrás.
- Documentación que describe el comando que debería funcionar.

## Compuertas de calidad

«Código existente» no equivale a «trabajo terminado». Un proyecto declara explícitamente qué compuertas aplican. Las familias habituales:

| Familia | Pregunta que responde |
|---|---|
| Pruebas unitarias | ¿El comportamiento declarado ocurre, incluidos los caminos de fallo? |
| Integración | ¿Las piezas compuestas se comportan como el diseño supone? |
| Arquitectura | ¿Se respetan las fronteras y la dirección de dependencias? |
| Contratos | ¿La superficie pública se comporta como declara? |
| Tipado | ¿Los tipos son consistentes? |
| Lint y formato | ¿El código cumple las reglas del proyecto? |
| Seguridad | ¿Se analizaron las superficies de riesgo? |
| Documentación | ¿La documentación describe lo implementado? |
| Empaquetado | ¿El artefacto distribuible es correcto? |
| Compatibilidad | ¿Funciona en las plataformas declaradas? |
| Rendimiento | ¿Cambió lo que se prometió no cambiar? |
| Conformidad | ¿Las interfaces equivalentes se comportan igual? |
| Consumo externo | ¿Alguien de fuera puede usarlo? |

### Cómo se seleccionan

Un proyecto no copia la lista de comandos de otro proyecto. Copia el criterio:

1. **Cada compuerta responde una pregunta que el proyecto necesita responder.** Una compuerta sin pregunta es ceremonia.
2. **La compuerta se declara por su pregunta, y el comando es su implementación.** Los comandos cambian con el ecosistema; la pregunta no. Un proyecto que declara «el tipado es consistente» sobrevive a cambiar de herramienta; uno que declara el nombre del comando, no.
3. **Una compuerta que nunca puede fallar no es una compuerta.** Si su resultado es siempre verde, o no mide nada o mide algo que ya está garantizado por otra vía.
4. **La autoridad de la compuerta se declara.** Cuál es el registro autoritativo — la máquina del participante o la integración continua — cambia qué evidencia vale.

### Clases de compuerta

Separar las compuertas por cómo se satisfacen evita el fallo más común, que es tratarlas todas igual:

| Clase | Cómo se satisface | Quién puede declararla |
|---|---|---|
| Automática | Se re-deriva del repositorio en cada evaluación. | Cualquiera; el estado declarado no puede contradecir al repositorio. |
| Por evidencia | Existe un registro con comando, resultado y confirmación. | Quien la ejecutó; caduca al cambiar el código cubierto. |
| Manual | Exige juicio arquitectónico, de seguridad o de producto. | Solo una persona autorizada. Ninguna herramienta la aprueba. |

Una compuerta manual que una herramienta puede marcar como aprobada dejó de ser manual, y el proyecto perdió el control que creía tener.

### Cuando una compuerta no puede ejecutarse

Ocurre y no es una emergencia. El comportamiento correcto:

1. declarar con precisión qué compuerta no pudo ejecutarse y por qué;
2. no rebajar una política de seguridad o de sistema para sortearla;
3. no marcar el trabajo como completo apoyándose solo en resultados locales;
4. apoyarse en el registro autoritativo antes de integrar.

## Falla

| Situación | Veredicto |
|---|---|
| La compuerta se ejecutó y aprobó | `PASS` con evidencia. |
| La compuerta se ejecutó y falló | `FAIL` con evidencia. |
| No pudo ejecutarse | `NOT_RUN` con la razón. |
| La evidencia existe pero el código cambió | `STALE`; se re-ejecuta. |
| Exige juicio humano y no lo tuvo | `NEEDS_REVIEW`. |

Ver [AFP-011](completion-and-stop.protocol.md) para cómo estos veredictos determinan el estado de la tarea.

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` implementa el mecanismo completo descrito aquí y es el caso más fuerte de la suite. Su documento de compuertas declara literalmente que reportar una compuerta como aprobada sin haberla ejecutado es un fallo peor que una construcción en rojo. Su herramienta de evaluación de publicación separa las tres clases: las compuertas automáticas se re-derivan del repositorio en cada ejecución, de modo que el archivo de estado no puede afirmar lo que el repositorio contradice; las compuertas por evidencia solo se consideran válidas mientras la confirmación sobre la que se registraron sigue vigente, y caducan al cambiar los archivos que declaran cubrir; y las compuertas manuales nunca pueden ser satisfechas por la herramienta. Una compuerta marcada como satisfecha sin evidencia se trata como error, no como advertencia. Sus registros de publicación conservan comando exacto y resultado observado, y su verificación de empaquetado se ejecuta contra los artefactos instalados fuera del espacio de trabajo en lugar de contra el árbol de fuentes.

Lo que no lo sostiene: el mecanismo está validado en un proyecto de un solo ecosistema y por un único mantenedor. La taxonomía de trece familias de compuertas de esta página es una generalización propuesta aquí y no está observada completa en ningún repositorio. No existe medición de cuántas afirmaciones falsas evita el mecanismo frente a no tenerlo: su valor está argumentado, no medido. La caducidad por cambio de archivos cubiertos supone que las superficies cubiertas se declaran correctamente, y esa declaración es manual.

## Qué no afirma este protocolo

- No afirma que la evidencia garantice corrección. Una prueba puede pasar y el comportamiento ser incorrecto.
- No afirma que las trece familias de compuertas apliquen a todo proyecto. Afirma que las omitidas deben omitirse conscientemente.
- No define comandos. Un protocolo que fija comandos se acopla a un ecosistema.
- No sustituye la revisión humana en decisiones de juicio.
- No afirma que un participante mienta deliberadamente. Afirma que el lenguaje natural no distingue ejecutar de suponer, y que el protocolo debe hacerlo por él.
