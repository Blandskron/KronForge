---
name: safe-refactoring
description: Ejecuta refactorings incrementales preservando comportamiento observable mediante red de pruebas previa, pasos pequeños y verificación continua. Úsala al reducir deuda técnica, simplificar módulos complejos o preparar código legado para nuevas funcionalidades.
license: MIT
allowed-tools: Read Grep Glob Edit Write Bash
metadata:
  framework: "agents-first"
  asset-id: "software-development.safe-refactoring"
  asset-version: "1.0.0"
  domain: "software-development"
  status: "stable"
  repo-compatibility: "tool-agnostic"
  canonical: "library/domains/software-development/skills/safe-refactoring/SKILL.md"
---

# Skill: Safe Refactoring

Refactorizar cambia la estructura interna **sin alterar el comportamiento observable**. Nunca mezcles refactoring estructural con nuevas funcionalidades en el mismo paso.

## Procedimiento

1. **Confirmar red de seguridad:** ejecuta las pruebas existentes antes de tocar código. Si el comportamiento actual carece de cobertura, añade pruebas de caracterización primero.
2. **Definir el objetivo acotado:** nombra qué problema estructural resuelves (acoplamiento, duplicación, complejidad) y qué interfaces públicas deben mantenerse intactas.
3. **Aplicar pasos pequeños y reversibles:** realiza una transformación limpia a la vez (extraer función/módulo, simplificar flujo, eliminar código muerto) y ejecuta las pruebas tras cada paso.
4. **Verificar compatibilidad:** confirma que firmas, exportaciones, CLI y formatos de salida siguen siendo compatibles.

## Restricciones

- No cambies comportamiento de negocio "de paso" durante un refactoring.
- Si una prueba falla, revierte el último incremento pequeño en lugar de acumular parches.

## Procedencia

Proyección generada del activo canónico [`library/domains/software-development/skills/safe-refactoring/SKILL.md`](../../library/domains/software-development/skills/safe-refactoring/SKILL.md).

No edites este archivo: modifica la fuente en `library/` y ejecuta `npm run build:skills`.
La puerta de calidad falla si esta proyección queda desactualizada.
