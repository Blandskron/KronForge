# Preparar KronForge para trabajo agents-first

## Antes y decisión

Antes de `74b1559`, el repositorio tenía un prompt y documentación operativa parcial. El commit conservó una entrada para personas y otra para agentes, y añadió documentos especializados para configuración, esquema de datos, seguridad y operación.

## Reproducción

Con Git y el historial de KronForge, inspecciona el cambio desde la raíz.

```text
git diff --name-status 74b1559^ 74b1559 -- AGENTS.md README.md docs/agent
git diff 74b1559^ 74b1559 -- AGENTS.md README.md
```

## Resultado observado

La comparación mostró cambios en `AGENTS.md` y `README.md` y altas de `CONFIG.md`, `DATA_SCHEMA.md`, `RUNBOOK.md` y `SECURITY.md` bajo `docs/agent/`. La separación permite rastrear decisiones operativas desde el punto de entrada. Comprueba el mapa vigente a partir de [AGENTS.md](../../AGENTS.md).

La evidencia demuestra qué cambió en la estructura. La facilidad de incorporación de otra persona o agente requiere observación adicional.

[Volver a los casos reproducibles](README.md)
