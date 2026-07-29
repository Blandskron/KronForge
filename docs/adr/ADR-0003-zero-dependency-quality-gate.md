# ADR-0003: Quality gate reproducible sin dependencias

- **Estado:** accepted
- **Fecha:** 2026-07-28
- **Responsable:** maintainer del repositorio
- **Reemplaza:** validación exclusivamente manual

## Contexto

El repositorio no tiene build system. Sus principales fallos posibles son documentales: enlaces, metadatos, relaciones, versiones, navegación y publicación. Agregar linters y gestores de paquetes elevaría el onboarding y crearía una toolchain mayor que el producto.

## Decisión

Usar Node.js estándar para:

- validación integral;
- smoke test HTTP;
- pruebas unitarias con `node:test`;
- AI Repository Score.

GitHub Actions ejecutará las mismas órdenes que una persona o agente usa localmente. El workflow tendrá permisos `contents: read` y no publicará ni modificará el repositorio.

## Alternativas consideradas

### Suite npm con linters especializados

- ofrece reglas maduras;
- requiere manifiesto, lockfile y mantenimiento de dependencias;
- pospuesta hasta que la cobertura lo justifique.

### Solo checklist manual

- cero toolchain;
- no evita regresiones ni produce evidencia repetible;
- rechazada.

### Validación exclusiva en GitHub

- centraliza resultados;
- dificulta reproducir fallos antes de un push;
- rechazada.

## Consecuencias

### Positivas

- una orden local;
- CI reproducible;
- sin instalación;
- reglas adaptadas al contrato real.

### Negativas y riesgos

- el parser de front matter será deliberadamente limitado;
- no sustituye validación editorial humana;
- se debe mantener el validador al cambiar el schema.

## Validación

- `node scripts/validate.mjs`;
- `node --test`;
- `node scripts/smoke-site.mjs`;
- workflow con las mismas órdenes y permisos mínimos.

