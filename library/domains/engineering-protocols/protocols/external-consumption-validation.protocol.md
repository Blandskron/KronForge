---
id: engineering-protocols.external-consumption-validation
title: Validación de consumo externo
summary: Probar el producto desde fuera del repositorio, con el mecanismo de entrega real y solo documentación pública.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.1
difficulty: advanced
projects: [any]
compatibility: stack-agnostic
models: [any]
tags: [clean-room, validacion, empaquetado, documentacion, consumo-externo]
related:
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.release-readiness
  - documentation-knowledge.invented-commands
  - delivery-platform.release-readiness-review
protocol:
  code: AFP-006
  maturity: experimental
  actors: [validator, human-owner]
  dependsOn: [AFP-004]
  observedIn: [agnara]
  lastValidated: 2026-09-07
lastModified: 2026-11-25
inputs:
  - "Artefacto candidato exacto con versión y hash"
  - "Canal real de entrega y documentación pública"
outputs:
  - "Resultado PASS o FAIL desde un entorno limpio"
  - "Registro reproducible de consumo"
useCases:
  - "Validar que un consumidor externo puede usar un candidato publicado o publicable"
---

# AFP-006 — Validación de Consumo Externo

También llamada validación en sala limpia. Responde una pregunta que las pruebas internas no pueden responder: si alguien ajeno al repositorio puede usar el producto.

## Problema

Un proyecto puede tener miles de pruebas en verde y estar roto para todos sus usuarios.

La razón es que las pruebas se ejecutan dentro del repositorio, donde existen cosas que el consumidor no tendrá: rutas de importación privilegiadas, módulos internos accesibles, configuración de desarrollo, dependencias instaladas por otra vía, archivos que el artefacto publicado no incluye, y variables de entorno que alguien puso hace meses.

Cada una de esas condiciones es invisible desde dentro. La suite no las declara porque no las necesita declarar: están ahí. El resultado es un producto que funciona exactamente en un lugar del mundo, y ese lugar es la máquina donde se desarrolló.

Hay un segundo fallo, más silencioso: la documentación. Un comando documentado que nunca se ejecutó desde un entorno limpio es una hipótesis. El repositorio no puede distinguir entre «esto funciona» y «esto funcionaba cuando se escribió», porque dentro del repositorio funciona de todos modos.

## Actores

| Actor | Responsabilidad |
|---|---|
| Validator | Construye el entorno aislado, ejecuta y registra. |
| Human owner | Decide si un fallo invalida el candidato o se acepta con limitación declarada. |

## Ciclo de vida

```text
candidato identificado
   → entorno limpio construido
      → instalación por el mecanismo real de entrega
         → reproducción usando solo documentación pública
            → evidencia registrada
               ├─ PASS
               └─ FAIL → candidato invalidado → vuelve a implementación
```

Un fallo aquí invalida el candidato. No se corrige el entorno de validación para que pase: eso convierte la validación en una ceremonia que confirma lo que ya se creía.

## Contrato

### Frontera de aislamiento

El entorno de validación no tiene acceso a:

- el árbol de fuentes del proyecto;
- instalaciones editables o enlazadas al repositorio;
- rutas de búsqueda que apunten al repositorio;
- módulos internos no declarados como públicos;
- configuración local del entorno de desarrollo;
- parches o ajustes aplicados en tiempo de prueba;
- credenciales o accesos que un consumidor no tendría.

Si el validador necesita alguna de estas cosas para que funcione, el resultado es `FAIL` — y ese es precisamente el defecto que la validación existe para encontrar.

### Artefacto candidato

Se valida el artefacto exacto que se entregaría, identificado sin ambigüedad: versión, nombre y hash. No una reconstrucción equivalente. «Equivalente» es la palabra que oculta la diferencia entre lo que se probó y lo que se publica.

### Mecanismo de entrega real

La instalación usa el mismo mecanismo que usará el consumidor. El protocolo no es específico de un ecosistema; se aplica a cualquier forma de entrega:

| Forma de entrega | Qué significa entorno limpio |
|---|---|
| Paquete de biblioteca | Entorno nuevo, instalación desde el artefacto, sin acceso al repositorio. |
| Imagen de contenedor | Contenedor nuevo desde la imagen publicada, sin volúmenes del desarrollo. |
| Binario de línea de comandos | Máquina o entorno sin cadena de compilación del proyecto. |
| Distribución de kit de desarrollo | Proyecto nuevo que solo declara la dependencia publicada. |
| Interfaz de red | Cliente externo contra el despliegue real, sin acceso interno. |
| Plantilla de proyecto | Proyecto generado en un directorio nuevo, ejecutado allí. |

### Solo superficie pública

La reproducción usa exclusivamente lo que el producto declara como público. Alcanzar un módulo interno para que el ejemplo funcione invalida la validación, porque demuestra lo contrario de lo que se quería demostrar.

Esta regla tiene una consecuencia útil: obliga al proyecto a declarar qué es público. Un proyecto que no puede decir qué superficie es pública no puede ejecutar este protocolo, y esa incapacidad es en sí misma un hallazgo.

### Reproducción solo con documentación

El validador construye algo real usando únicamente la documentación pública. No el conocimiento del equipo, no el código de ejemplo del repositorio, no la memoria de cómo se hacía antes.

Lo que esto verifica no es que el producto funcione, sino que la documentación sea suficiente para usarlo. Son dos afirmaciones distintas y los proyectos las confunden constantemente.

Un comando documentado que se supone funcional debería poder ejecutarse, o estar marcado explícitamente como ilustrativo. La tercera opción —un comando que parece ejecutable y no lo es— es la que produce el desgaste real, y es la que este protocolo elimina.

### Clasificación de fallos

| Clase | Significado | Efecto |
|---|---|---|
| Artefacto | El artefacto no se instala o está incompleto. | Invalida el candidato. |
| Superficie | Lo público no basta para el caso documentado. | Invalida el candidato. |
| Documentación | El artefacto sirve, la documentación no. | Invalida el candidato para publicación. |
| Entorno | El fallo es del entorno de validación. | No invalida; se corrige y se repite. |

La cuarta clase es la que se abusa. Un fallo se clasifica como de entorno solo cuando se puede demostrar que lo es; en caso de duda, es del candidato.

### Repetición

La validación se repite cuando cambia el artefacto, cuando cambia la documentación que se usó para reproducir, o cuando cambia el mecanismo de entrega. Una validación anterior no cubre un artefacto nuevo, por pequeña que sea la diferencia.

## Evidencia

El registro de una validación de consumo externo contiene, como mínimo:

```text
Artefacto:        nombre, versión, hash
Confirmación:     el estado del código que lo produjo
Entorno:          sistema, versión de la plataforma de ejecución
Aislamiento:      qué se excluyó explícitamente
Instalación:      comando exacto y resultado
Reproducción:     qué se construyó y con qué documentación
Resultado:        observación exacta
Limitaciones:     qué no se validó
```

## Falla

| Situación | Comportamiento |
|---|---|
| El artefacto no se instala | `FAIL`. Candidato invalidado. |
| Hace falta un módulo interno | `FAIL`. Es el defecto buscado. |
| La documentación no basta | `FAIL` para publicación. |
| El entorno limpio no puede construirse | `NOT_RUN` declarado. Nunca `PASS`. |
| Pasa con salvedades | `PASS` con las limitaciones registradas explícitamente. |

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` ejecuta este protocolo como compuerta de publicación. Su verificación de empaquetado instala los artefactos construidos en un entorno externo al espacio de trabajo con el acceso al índice de paquetes deshabilitado, y ejecuta la comprobación con el intérprete de ese entorno en modo aislado, de modo que importar desde el árbol de fuentes es imposible. Una prueba de arquitectura verifica que ningún ejemplo ni guía alcance un módulo no clasificado como público, y el proyecto mantiene un manifiesto explícito de superficie pública que hace esa comprobación mecánica en lugar de dejarla a la revisión. Su registro de publicación conserva comando, entorno y resultado observado. El mecanismo produjo un hallazgo real: la nota de estado de publicación registra que consumir la interfaz pública desde fuera reveló un defecto del framework que las pruebas internas no habían detectado, y que ese defecto derivó en una decisión arquitectónica y su corrección. El proyecto declara además, de forma explícita, que sus pruebas internas no son evidencia de que un consumidor externo pueda hacer lo mismo.

Lo que no lo sostiene: la evidencia proviene de un solo ecosistema de empaquetado. La tabla de seis formas de entrega de esta página es una generalización propuesta aquí; solo la primera está observada. La regla de reproducción exclusivamente desde documentación pública está declarada como criterio de publicación en el proyecto observado pero su gate correspondiente todavía no ha sido satisfecho, de modo que su viabilidad práctica no está demostrada. No existe medición de cuántos defectos detecta este protocolo frente a no ejecutarlo.

## Qué no afirma este protocolo

- No afirma que el producto sea correcto. Afirma que es consumible.
- No sustituye pruebas de integración; responde otra pregunta.
- No es específico de un ecosistema de empaquetado.
- No garantiza que funcione en toda plataforma; solo en las que se validaron.
- No valida rendimiento, seguridad ni conformidad. Esos son [AFP-008](benchmark.protocol.md), [AFP-005](independent-review.protocol.md) y [AFP-007](interface-conformance.protocol.md).
