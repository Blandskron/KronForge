---
id: documentation-knowledge.invented-commands
title: Comandos inventados
summary: Detectar y corregir instrucciones ejecutables sin respaldo en el repositorio.
type: anti-pattern
domain: documentation-knowledge
status: stable
version: 1.0.1
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [documentation, safety]
related: [documentation-knowledge.documentation-as-code]
lastModified: 2026-11-25
inputs:
  - "Comandos citados en documentación"
  - "Manifiestos, scripts o CI que definen su uso"
outputs:
  - "Inventario de comandos respaldados o pendientes"
  - "Correcciones de argumentos y contexto"
useCases:
  - "Revisar un runbook o prompt antes de publicarlo"
---

# Anti-patrón: Comandos Inventados

## Qué evitar

Documentar comandos plausibles por convención —por ejemplo, asumir un script `test` o `deploy`— sin encontrarlos en manifests, CI, scripts o documentación verificable.

## Señales

- El comando no aparece en ninguna fuente ejecutable.
- Mezcla gestores de paquetes o herramientas no declaradas.
- Usa variables o entornos no documentados.
- Nadie puede reproducir el resultado.

## Consecuencias

- pérdida de tiempo y confianza;
- fallos destructivos o despliegues incorrectos;
- agentes que amplifican una suposición en documentos posteriores.

## Cómo detectarlo

1. Extrae cada bloque y comando inline.
2. Identifica la fuente local que lo define.
3. Compara argumentos y directorio de ejecución.
4. Marca como pendiente todo lo que no tenga respaldo.

## Cómo corregirlo

Reemplaza el comando por una referencia a la fuente real. Si el proceso falta, escribe `Pendiente de confirmar` y solicita definición humana; no rellenes el vacío.

## Prevención

- Revisar comandos en cada cambio documental.
- Mantener una única fuente canónica.
- Validar por ejecución segura cuando sea posible.

## Patrón alternativo

[Documentación como código](../patterns/documentation-as-code.pattern.md).
