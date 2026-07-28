# Contribuir Activos a la Biblioteca

## Antes de crear

1. Busca objetivos equivalentes en [`library/catalog.json`](../library/catalog.json).
2. Elige un dominio por la capacidad principal, no por una herramienta concreta.
3. Justifica por qué un enlace a un activo existente no resuelve el caso.
4. Lee el contrato del tipo de activo en la [propuesta de evolución](REPOSITORY_EVOLUTION.md#8-contrato-de-los-activos).

## Metadatos obligatorios

```yaml
---
id: domain.unique-slug
title: Título humano
summary: Resultado concreto en una frase.
type: prompt
domain: domain
status: draft
version: 0.1.0
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [tag]
related: []
---
```

- `id` debe ser único y estable.
- `type` debe ser uno de los tipos documentados en el catálogo.
- `status` puede ser `draft`, `stable` o `deprecated`.
- `version` sigue SemVer.
- `difficulty` puede ser `foundation`, `intermediate` o `advanced`.
- `projects` describe alcances aplicables sin asumir un stack.
- `compatibility` expresa el contrato general; las integraciones concretas se aíslan.
- `models: [any]` declara compatibilidad agnóstica.
- `related` contiene IDs existentes y relaciones útiles.

## Reglas de calidad

- Lee antes de modificar y no inventes comandos, arquitectura ni resultados.
- Mantén el activo agnóstico al modelo; limita tecnologías concretas al alcance declarado.
- Declara entradas, restricciones, salida y evidencia cuando el activo sea ejecutable.
- Los prompts deben declarar objetivo, contexto, entradas, salida, dificultad, proyectos, compatibilidad, buenas prácticas y ejemplo.
- Las skills deben declarar problema, dependencias, casos de uso y ejemplo además de su procedimiento.
- Enlaza contenido común en lugar de copiarlo.
- Usa ejemplos mínimos y seguros, sin secretos ni datos reales.
- No relajes pruebas o controles de seguridad para conseguir un resultado positivo.
- Agrega el activo al índice del dominio y a `library/catalog.json`.
- Registra cambios semánticos en `docs/CHANGELOG.md`.

## Revisión

- [ ] Nombre y ruta siguen las convenciones.
- [ ] Metadatos completos e ID único.
- [ ] Dificultad, proyectos y compatibilidad declarados.
- [ ] Valor reutilizable demostrado.
- [ ] Sin duplicidad sustancial.
- [ ] Enlaces internos válidos.
- [ ] Markdown válido y bloques cerrados.
- [ ] Índices, sitio y changelog actualizados cuando aplica.
- [ ] Validaciones de `docs/agent/TESTS.md` ejecutadas.

## Deprecación

No borres un activo estable sin una transición. Marca `status: deprecated`, explica el reemplazo, actualiza relacionados e índices y deja la eliminación para una versión mayor cuando rompa rutas públicas.
