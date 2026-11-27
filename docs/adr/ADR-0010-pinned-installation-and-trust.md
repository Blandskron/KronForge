# ADR-0010 — Instalación fijada, aprobada y recuperable

- **Estado** `proposed`
- **Fecha** 2026-11-27
- **Responsable propuesto** Maintainer del framework
- **Relacionado** [ADR-0003](ADR-0003-zero-dependency-quality-gate.md) y [ADR-0006](ADR-0006-protocol-asset-type.md)

## Contexto

Un pack introduce cambios en repositorios ajenos y puede habilitar instrucciones o ejecución. Las relaciones del catálogo describen activos y el proyecto consumidor decide sus permisos. La repetición, actualización y recuperación necesitan conocer los bytes exactos y la propiedad de cada archivo.

## Decisión propuesta

Fijar versiones, origen, commit y digest. Usar un grafo pequeño con versiones exactas, un lock local y un plan aprobado antes de escribir. Separar activación e instalación, verificar procedencia según el canal y publicar una política de compatibilidad y retiro. Limitar escrituras al alcance autorizado y proteger cambios locales. Reusar mecanismos de atestación y firma existentes conforme al [contrato](../architecture/KRONFORGE_PACK_CONTRACTS.md).

## Alternativas y consecuencias

La resolución por rangos y la actualización automática elevan el coste de implementar confianza y reproducibilidad desde el primer ciclo. Una copia sin inventario simplifica la primera aplicación, pero deja sin base la reconciliación posterior. Un lock exige mantener y migrar su formato. En el piloto el proceso puede revisarse y registrarse con Git.

## Validación

Ejecutar escenarios de repeticiones, colisiones, fallos parciales, ampliaciones de permisos, deriva y recuperación. Los resultados se vinculan al artefacto, al entorno y al perfil aprobados antes de adoptar el contrato.
