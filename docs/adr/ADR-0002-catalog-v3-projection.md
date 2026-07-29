# ADR-0002: Markdown canónico y catálogo v3 como proyección

- **Estado:** accepted
- **Fecha:** 2026-07-28
- **Responsable:** maintainer del repositorio
- **Reemplaza:** contrato de catálogo schema v2

## Contexto

El portal necesita versión, compatibilidad, relaciones, agentes, licencia, actualización y contratos para descubrimiento. Duplicar todo el cuerpo Markdown en JSON crearía dos fuentes de verdad. Mantener solo nueve campos impide presentar v3.

## Decisión

El Markdown conserva contenido y front matter canónicos. `library/catalog.json` publica una proyección rica, explícita y validada:

- identidad, ruta y clasificación;
- versión, estado y nivel;
- compatibilidad de modelos y agentes;
- idioma, licencia y actualización;
- relaciones y dependencias;
- contratos de entradas, salidas, ejemplos, duración, complejidad y casos de uso cuando estén declarados.

Los campos de contrato pueden estar vacíos durante la migración, pero su ausencia será visible en métricas; no se rellenarán con texto genérico. El schema v3 distingue campos obligatorios y cobertura progresiva.

Las rutas de aprendizaje viven en el catálogo y solo enlazan IDs existentes.

## Alternativas consideradas

### Parsear todo el front matter en el navegador

- evita proyección duplicada;
- obliga a descargar cada activo para buscar y filtrar;
- rechazada.

### Generar el catálogo durante un build

- reduce edición manual;
- introduce una fase obligatoria incompatible con el portal sin build;
- rechazada por ahora.

### Mantener schema v2

- conserva simplicidad;
- no satisface descubrimiento ni validación v3;
- rechazada.

## Consecuencias

### Positivas

- búsqueda y filtros sin descargar todo el corpus;
- relaciones y aprendizaje navegables;
- cobertura de metadatos medible;
- contenido portable.

### Negativas y riesgos

- algunos metadatos se reflejan en dos superficies;
- contribuciones deben actualizar catálogo;
- se necesita validación estricta de paridad.

## Validación

- JSON Schema v3;
- IDs, rutas y relaciones únicos y resolubles;
- paridad de front matter;
- rutas de aprendizaje sin referencias inexistentes;
- portal consume únicamente la proyección y el Markdown canónicos.

