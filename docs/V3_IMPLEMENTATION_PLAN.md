# Plan de Implementación v3

> **Estado:** implementado y validado el 2026-07-28. La publicación de tag o release queda fuera de esta entrega.

## Principio de entrega

v3 prioriza arquitectura, gobernanza y calidad. No intenta llenar todos los dominios ni implementar cada idea del roadmap. La plataforma debe poder crecer antes de crecer en volumen.

## Lote 1 — Arquitectura y contratos

- arquitectura de capas y ownership;
- ADR de arquitectura, catálogo y validación;
- schema v3 compatible;
- fuente canónica en Markdown y proyección de descubrimiento en JSON;
- rutas de aprendizaje que solo enlazan activos existentes.

## Lote 2 — Gobernanza

- documentos comunitarios raíz;
- owners y maintainers basados en evidencia del repositorio;
- plantillas de issues y pull requests;
- política unificada de compatibilidad, deprecación y release;
- estándares documentales, review checklist y Definition of Done.

Los contactos privados no confirmados se documentan como pendientes; no se inventan.

## Lote 3 — Calidad

- `node scripts/validate.mjs`;
- `node scripts/smoke-site.mjs`;
- pruebas con `node:test`;
- workflow de GitHub Actions con permisos mínimos;
- AI Repository Score reproducible.

`package.json` solo expone comandos reproducibles; no se incorpora lockfile, descarga de paquetes, bundler ni dependencia runtime.

## Lote 4 — Experiencia web

- rutas compartibles de activos;
- búsqueda normalizada y filtros v3;
- metadatos, relaciones y tags interactivos;
- modo lectura, fuente, copia y descarga;
- estadísticas derivadas;
- página de aprendizaje;
- roadmap cargado desde Markdown canónico.

## Lote 5 — Expansión futura

Queda deliberadamente fuera de esta entrega:

- llenar los tres dominios sin activos;
- crear adaptadores físicos para cada agente;
- traducciones;
- cientos de examples, recipes o snippets;
- integraciones específicas no verificadas;
- publicación de tags o releases.

Estas capacidades se ordenan en el roadmap v3.5–v5.

## Validación final

1. ejecutar validación documental y del catálogo;
2. ejecutar tests unitarios del portal;
3. ejecutar smoke test bajo `/agents-first-repo-docs/`;
4. comprobar enlaces, cercas, versiones y referencias;
5. probar navegación y visor en navegador;
6. revisar `git diff --check`;
7. confirmar que no se modificó `LICENSE` ni se eliminaron rutas públicas.

La puerta final terminó con 0 errores, 12 pruebas unitarias aprobadas, 96 rutas HTTP verificadas y AI Repository Score 98/100.
