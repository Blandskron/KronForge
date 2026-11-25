# Definir un hook de validación sin efectos ocultos

**Nivel** · Inicial

**Prerrequisito** · Tener un control existente que genere una salida verificable.

Consulta [Hook de validación explícito](../../library/domains/hooks-workflows/patterns/explicit-validation-hook.pattern.md) antes de empezar.

## Ejercicio

1. Elige `npm run validate` en KronForge. Declara cuándo se ejecutaría, qué lee y qué señal indica fallo.
2. Ejecuta el comando por separado y guarda el resultado. Modela aparte una falta de ejecución y define cómo se informa el pendiente.
3. Redacta el contrato del hook con un disparador, un límite de efectos y una regla de parada. Mantén el ejercicio como diseño, sin instalar el hook.

## Entrega y aceptación

Un contrato de hook y un registro de salida observada. Una persona puede distinguir un fallo real, un control no ejecutado y una verificación aprobada.

[Volver a los tutoriales por dominio](README.md) · [Caso reproducible de Contratos del catálogo v3](../cases/catalog-contracts.md)
