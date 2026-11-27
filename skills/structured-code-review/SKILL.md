---
name: structured-code-review
description: Realiza revisiones de código estructuradas e independientes priorizando seguridad, corrección, contratos, pruebas y mantenibilidad con evidencia por archivo y línea. Úsala antes de aprobar un PR o tras completar un cambio relevante.
license: MIT
allowed-tools: Read Grep Glob Bash
metadata:
  framework: "agents-first"
  asset-id: "quality-engineering.structured-code-review"
  asset-version: "1.0.0"
  domain: "quality-engineering"
  status: "stable"
  repo-compatibility: "tool-agnostic"
  canonical: "library/domains/quality-engineering/skills/structured-code-review/SKILL.md"
---

# Skill: Structured Code Review

Separa hechos verificables de preferencias de estilo y prioriza riesgos reales.

## Orden de inspección

1. **Corrección y contratos:** ¿cumple los requisitos? ¿rompe compatibilidad pública o esquemas?
2. **Seguridad y privacidad:** validación de entradas, secretos, permisos mínimos, path traversal, inyecciones y manejo de errores.
3. **Pruebas y evidencia:** ¿existen pruebas que fallen sin el cambio? ¿se ejecutaron realmente los checks?
4. **Mantenibilidad y alcance:** complejidad innecesaria, duplicación, efectos secundarios fuera de alcance.

## Formato de hallazgos

Clasifica cada hallazgo explícitamente:
- **Bloqueante:** impide merge (bug, vulnerabilidad, ruptura silenciosa, pruebas ausentes o falsas).
- **Importante:** debe corregirse o registrarse como deuda técnica aceptada.
- **Sugerencia:** mejora opcional no bloqueante.

## Restricciones

- Cita siempre la ruta y línea exacta que respalda cada hallazgo.
- No apruebes un cambio cuyas compuertas obligatorias no hayan sido ejecutadas (`NOT_RUN`).
- Si eres el mismo agente que escribió el código, declara explícitamente que se trata de una autorrevisión y no de una revisión independiente.

## Procedencia

Proyección generada del activo canónico [`library/domains/quality-engineering/skills/structured-code-review/SKILL.md`](../../library/domains/quality-engineering/skills/structured-code-review/SKILL.md).

No edites este archivo: modifica la fuente en `library/` y ejecuta `npm run build:skills`.
La puerta de calidad falla si esta proyección queda desactualizada.
