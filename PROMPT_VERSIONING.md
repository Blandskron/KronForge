# Versionado de Activos

Este documento define el ciclo de vida del prompt maestro y de todos los activos canónicos en `library/`.

## Versionado semántico

Cada activo declara `version: MAJOR.MINOR.PATCH` en sus metadatos.

### MAJOR

Cambios incompatibles en entradas, salida, restricciones, fases obligatorias o ruta pública sin transición.

Ejemplos:

- eliminar una fase de aprobación;
- cambiar el significado de un resultado;
- retirar un activo estable sin deprecación;
- alterar de forma incompatible la estructura que un prompt exige crear.

### MINOR

Capacidades compatibles que amplían el activo.

Ejemplos:

- agregar una validación o escenario;
- incorporar una salida opcional;
- publicar un activo nuevo;
- añadir un tipo de activo o dominio sin romper los existentes.

### PATCH

Correcciones que no cambian el contrato.

Ejemplos:

- ortografía, claridad o formato;
- reparación de enlaces;
- precisión editorial sin nuevas obligaciones.

## Versionado del repositorio

El repositorio usa una versión global para releases del catálogo:

- **MAJOR:** reorganización incompatible, cambio del contrato común o retiro masivo.
- **MINOR:** dominios, activos o capacidades compatibles.
- **PATCH:** correcciones editoriales, web o validaciones sin cambio semántico de activos.

La versión de un activo puede avanzar sin obligar a que todos los demás cambien.

## Estados

- `draft`: en diseño; puede cambiar sin compatibilidad.
- `stable`: apto para reutilización y sujeto a SemVer.
- `deprecated`: sigue disponible durante la transición y declara su reemplazo.

## Deprecación

1. Marca el activo como `deprecated`.
2. Explica el motivo y enlaza el reemplazo.
3. Actualiza `related`, índices y `catalog.json`.
4. Conserva la ruta durante una ventana de transición.
5. Retira el activo en una versión mayor si la ruta pública se rompe.

## Proceso de cambio

1. Lee el activo, relacionados y reglas del dominio.
2. Clasifica el cambio.
3. Actualiza contenido y versión del activo.
4. Actualiza índice del dominio y `library/catalog.json` cuando aplique.
5. Registra el cambio en `docs/CHANGELOG.md`.
6. Ejecuta `docs/agent/TESTS.md`.
7. Crea un tag solo cuando exista una decisión de release; nunca lo inventes ni lo publiques sin autorización.

## Prompt maestro

`prompts/agents-first-documentation-review.prompt.md` conserva una ruta estable por compatibilidad. Sus cambios de reglas siguen SemVer y requieren una entrada explícita en el changelog. Eliminarlo o moverlo sin transición es un cambio MAJOR y requiere aprobación humana.
