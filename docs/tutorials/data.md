# Ensayar una migración con datos sintéticos

**Nivel** · Intermedio

**Prerrequisito** · Trabajar sobre una copia de dos filas sintéticas y conservar el origen intacto.

Consulta [Ensayo de migración de datos](../../library/domains/data/checklists/migration-rehearsal.checklist.md) antes de empezar.

## Ejercicio

1. Escribe una tabla de origen con las filas `A abierta` y `B cerrada`. En la copia, convierte cada estado a un campo booleano llamado `activa`.
2. Cuenta dos registros y dos IDs únicos. Compara la fila A con el objetivo `true` y la B con `false`. Añade en una copia separada una fila con un estado desconocido y declárala rechazada.
3. Ensaya la vuelta con la tabla de origen que guardaste. Registra qué conteos coinciden, qué discrepancia bloquea el avance y quién retomaría la decisión.

## Entrega y aceptación

Un registro con conteos, dos equivalencias, un rechazo controlado y evidencia de recuperación. Las dos filas válidas conservan sus IDs y la fila desconocida queda pendiente de revisión.

[Volver a los tutoriales por dominio](README.md) · [Caso reproducible de Contratos del catálogo v3](../cases/catalog-contracts.md)
