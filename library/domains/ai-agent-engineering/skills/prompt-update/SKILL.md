---
name: prompt-update
description: Actualizar un prompt canónico con versionado, trazabilidad y validación.
id: ai-agent-engineering.prompt-update
title: Actualización de prompt
summary: Actualizar un prompt canónico sin degradar su contrato.
type: skill
domain: ai-agent-engineering
status: stable
version: 1.0.0
tags: [prompts, versioning]
related: [documentation-knowledge.documentation-audit]
---

# Skill: Actualización de Prompt

## Objetivo

Modificar un prompt sin degradar su universalidad, seguridad, contrato ni trazabilidad.

## Cuándo utilizarla

Para cambiar reglas, fases, entregables, restricciones o redacción de un prompt estable.

## Cuándo no utilizarla

Para crear un activo de otro tipo o hacer cambios editoriales fuera de prompts.

## Entradas esperadas

- solicitud y resultado esperado;
- prompt actual y activos relacionados;
- política de versionado;
- reglas del repositorio.

## Resultado esperado

Prompt actualizado, versión clasificada, changelog registrado y validaciones reportadas.

## Restricciones

- Leer el prompt completo antes de editar.
- No acoplarlo a un modelo o stack salvo que su alcance lo declare.
- No relajar aprobación, pruebas o seguridad para simplificar la ejecución.
- No inventar comandos ni rutas.

## Procedimiento

1. Lee el prompt, relacionados y [política de versionado](../../../../../PROMPT_VERSIONING.md).
2. Explica el cambio de contrato y clasifícalo como MAJOR, MINOR o PATCH.
3. Aplica el cambio mínimo coherente.
4. Actualiza `version`, relacionados e índices cuando corresponda.
5. Registra el cambio en [CHANGELOG](../../../../../docs/CHANGELOG.md).
6. Ejecuta las [pruebas documentales](../../../../../docs/agent/TESTS.md).
7. Revisa el diff para descartar cambios fuera de alcance.

## Buenas prácticas

- Separar condiciones obligatorias de ejemplos.
- Usar fases y salidas verificables.
- Reutilizar checklists o templates mediante enlaces cuando eviten duplicación.

## Checklist

- [ ] El objetivo permanece claro.
- [ ] Entradas, restricciones y salida son coherentes.
- [ ] Lee antes de modificar y prohíbe comandos inventados.
- [ ] Exige plan y evidencia cuando puede causar cambios.
- [ ] No reduce controles de prueba o seguridad.
- [ ] Versión, catálogo e historial están alineados.

## Errores frecuentes

- Agregar casos específicos al núcleo universal.
- Cambiar comportamiento y clasificarlo como PATCH.
- Duplicar reglas que ya tienen una fuente canónica.
- Actualizar el prompt sin validar sus enlaces.

## Documentos relacionados

- [Prompt maestro](../../../../../prompts/agents-first-documentation-review.prompt.md)
- [Guía de contribución](../../../../../docs/CONTRIBUTING_ASSETS.md)

## Prompts compatibles

- Todos los prompts del catálogo que sigan el contrato común.

## Skills relacionadas

- [Auditoría documental](../../../documentation-knowledge/skills/documentation-audit/SKILL.md)
