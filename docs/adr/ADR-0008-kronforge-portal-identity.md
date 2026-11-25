# ADR-0008 · Identidad y publicación de KronForge

- Estado: accepted
- Fecha: 2026-11-25

## Contexto

El repositorio y su alojamiento público se trasladaron a KronForge. El portal y el descubrimiento para agentes conservaban enlaces absolutos al subdirectorio anterior. La biblioteca ya tenía un modelo de datos relacional, renderizado documental y filtros que podían sostener la nueva identidad.

## Decisión

Usar el subdirectorio de Pages `/KronForge/` para metadatos y descubrimiento. Conservar identificadores, paths de activos, anchors, IDs de schema, licencia y versión del framework. Servir los recursos de presentación de forma local. Componer las entradas nuevas con las rutas y filtros que ya consume el catálogo.

## Alternativas

Cambiar los identificadores junto con la marca habría obligado a actualizar consumidores y evidencia histórica. Introducir un framework de interfaz habría añadido una cadena de build para funciones que ya resuelven los módulos ES nativos.

## Consecuencias

El smoke test verifica el subdirectorio nuevo y los recursos locales. La revisión de contrato sigue en el gate existente y la verificación visual es opcional con herramientas instaladas fuera del portal. El subdirectorio público anterior requeriría su propio mecanismo de redirección.
