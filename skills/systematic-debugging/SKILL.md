---
name: systematic-debugging
description: Ejecuta depuración sistemática basada en causa raíz: reproducir, aislar hipótesis, verificar con evidencia y blindar con prueba de regresión antes de cerrar. Úsala ante fallos intermitentes, bugs en producción, regresiones o errores de integración.
license: MIT
allowed-tools: Read Grep Glob Edit Write Bash
metadata:
  framework: "agents-first"
  asset-id: "software-development.systematic-debugging"
  asset-version: "1.0.0"
  domain: "software-development"
  status: "stable"
  repo-compatibility: "tool-agnostic"
  canonical: "library/domains/software-development/skills/systematic-debugging/SKILL.md"
---

# Skill: Systematic Debugging

Prohíbe parches por ensayo y error. Todo arreglo debe partir de una causa raíz verificada.

## Procedimiento

1. **Reproducir de forma determinista:** captura el comando, entrada, estado y error exacto. Si no puedes reproducirlo, recopila telemetría o acota las condiciones antes de tocar código.
2. **Leer evidencia antes de hipotetizar:** inspecciona el stack trace completo, commits recientes y contratos de entrada/salida.
3. **Formular y contrastar hipótesis:** plantea una hipótesis falsable a la vez y compruébala leyendo código o ejecutando una verificación acotada.
4. **Fijar prueba de regresión:** escribe una prueba que falle reproduciendo el defecto antes de aplicar la corrección.
5. **Corregir la causa raíz:** aplica el cambio mínimo en el punto de origen (no silencies excepciones ni parches síntomas en capas superiores).
6. **Verificar suite completa:** confirma que la regresión pasa y no se rompieron otros módulos.

## Restricciones

- Nunca desactives validaciones, tipos ni pruebas para hacer desaparecer un error.
- Si tras 2–3 intentos la hipótesis no explica el síntoma, detente y replantea la investigación desde la evidencia.

## Procedencia

Proyección generada del activo canónico [`library/domains/software-development/skills/systematic-debugging/SKILL.md`](../../library/domains/software-development/skills/systematic-debugging/SKILL.md).

No edites este archivo: modifica la fuente en `library/` y ejecuta `npm run build:skills`.
La puerta de calidad falla si esta proyección queda desactualizada.
