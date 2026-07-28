# Hooks y Workflows

Automatización observable alrededor de tareas, validaciones, documentación, testing, despliegues y notificaciones.

## Tipos

- pre-task;
- post-task;
- validation;
- documentation;
- testing;
- deployment;
- notification.

## Contrato mínimo

Todo hook declara trigger, entradas, efectos, idempotencia, permisos, timeout, retry, fallo y evidencia.

## Activos

- Pattern: [hook de validación explícito](patterns/explicit-validation-hook.pattern.md)

## Límites

Los hooks coordinan trabajo; no deben esconder mutaciones ni eludir aprobación humana. CI/CD e infraestructura permanecen en [entrega y plataforma](../delivery-platform/README.md).
