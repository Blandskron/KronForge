---
name: test-driven-development
description: Guía la implementación estricta mediante Test-Driven Development (Red-Green-Refactor) escribiendo pruebas verificables antes del código de producción. Úsala al implementar nuevas funcionalidades, corregir bugs reproducibles o blindar contratos críticos.
license: MIT
allowed-tools: Read Grep Glob Edit Write Bash
metadata:
  framework: "agents-first"
  asset-id: "quality-engineering.test-driven-development"
  asset-version: "1.0.0"
  domain: "quality-engineering"
  status: "stable"
  repo-compatibility: "tool-agnostic"
  canonical: "library/domains/quality-engineering/skills/test-driven-development/SKILL.md"
---

# Skill: Test-Driven Development (Red → Green → Refactor)

Aplica esta skill para construir cambios verificables con evidencia real de fallo previo y solución mínima.

## Regla de oro

Ningún código de producción se escribe antes de tener una prueba automatizada que reproduzca el requisito y falle por la razón esperada.

## Procedimiento

1. **Detectar el comando real de pruebas:** verifica en el repositorio qué runner existe (`npm test`, `pytest`, `go test`, `cargo test`, etc.). Nunca inventes comandos.
2. **Fase RED:** escribe la prueba más pequeña que expresa el comportamiento esperado o reproduce el bug. Ejecútala y confirma que **falla por el motivo correcto** (no por error de sintaxis o import).
3. **Fase GREEN:** escribe el código mínimo y claro necesario para que la nueva prueba y la suite existente pasen.
4. **Fase REFACTOR:** limpia duplicación, nombres y estructura manteniendo todas las pruebas en verde sin cambiar comportamiento externo.
5. **Evidencia:** reporta el comando exacto ejecutado, el fallo observado en RED y el resultado final en GREEN/REFACTOR.

## Restricciones

- No modifiques ni debiliten aserciones existentes para forzar un paso en verde.
- No uses mocks que oculten el comportamiento real bajo prueba cuando existe un fixture liviano reproducible.
- Si una prueba no puede ejecutarse en el entorno actual, repórtala explícitamente como `NOT_RUN`.

## Procedencia

Proyección generada del activo canónico [`library/domains/quality-engineering/skills/test-driven-development/SKILL.md`](../../library/domains/quality-engineering/skills/test-driven-development/SKILL.md).

No edites este archivo: modifica la fuente en `library/` y ejecuta `npm run build:skills`.
La puerta de calidad falla si esta proyección queda desactualizada.
