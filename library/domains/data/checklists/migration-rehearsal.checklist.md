---
id: data.migration-rehearsal
title: Ensayar una migración de datos
summary: Comparar invariantes antes y después de una migración en un entorno aislado.
type: checklist
domain: data
status: draft
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [migracion, invariantes]
related: [quality-engineering.integration-tests, engineering-protocols.evidence-record]
inputs: [Cambio de datos previsto, Fixture sintético o autorizado, Criterios de reconciliación]
outputs: [Registro del ensayo, Diferencias observadas, Decisión de preparación]
useCases: [Cambio de esquema, Transformación por lotes]
---

# Ensayar una migración de datos

1. Define la unidad de reconciliación. Además del total de registros, usa una clave estable y al menos un invariante de dominio, como unicidad o integridad referencial.
2. Construye un fixture aislado con valores ausentes, límites, registros repetidos si son admisibles y las relaciones que la transformación debe conservar.
3. Registra el estado de partida y ejecuta la migración usando los mecanismos documentados del proyecto. Compara resultados e identifica las diferencias por clave.
4. En el entorno de ensayo, interrumpe una ejecución en un punto controlado. Comprueba si la operación puede reanudarse o si requiere restauración antes de ejecutarse otra vez.
5. Ensaya la recuperación usando una copia autorizada. Si revertir pierde información, registra una estrategia de restauración, sus límites y quién debe autorizarla.

| Invariante | Antes | Después esperado | Observado | Evidencia |
|---|---|---|---|---|
| Regla del dominio | Valor o condición | Resultado acordado | Medición | Referencia al artefacto |

El fixture de ejemplo puede contener activos con y sin etiqueta cuando la etiqueta pasa a una estructura separada. Conserva la asociación con el activo y distingue entre etiqueta ausente y etiqueta vacía si el comportamiento del sistema las diferencia. Guarda el resultado en el [registro de compuerta](../../engineering-protocols/templates/evidence-record.template.md).
