# ADR-0009 — Composición de packs y distribución portable

- **Estado** `proposed`
- **Fecha** 2026-11-27
- **Responsable propuesto** Maintainer del framework
- **Relacionado** [ADR-0002](ADR-0002-catalog-v3-projection.md), [ADR-0004](ADR-0004-agent-skills-projection-and-spec-freshness.md) y [ADR-0007](ADR-0007-evidence-citation-not-dependency.md)

## Contexto

Los activos canónicos y el catálogo permiten descubrir y leer capacidades individuales. Un resultado transversal requiere seleccionar y entregar juntos varios activos, resolver sus recursos locales y orientar al consumidor. Agent Plugins ofrece una estructura común para la parte que carga un host. [Agent Plugins 1.0.0](https://agent-plugins.org/specification).

## Decisión propuesta

Conservar el catálogo v3 y el Markdown por dominio. Introducir un manifiesto de composición versionado solo cuando el piloto demuestre los campos requeridos. Empezar con distribución manual verificable. Proyectar Agent Skills y Agent Plugins sobre los mismos assets para clientes que los soporten. Cada extensión de proveedor vive en un adaptador con alcance de soporte explícito. El pack de referencia se origina en activos con derechos confirmados y puede incluir citas externas sin adquirir una dependencia operativa de la fuente.

## Alternativas y consecuencias

Extender v3 mezclaría composición e inventario editorial y acoplaría la evolución del portal a las instalaciones. Adoptar solo Agent Plugins dejaría al consumidor pasos de aplicación y verificación del proyecto sin contrato. Crear un formato propio de plugin duplicaría un estándar con implementaciones disponibles. La propuesta añade una superficie de datos mínima y exige verificar que las proyecciones no diverjan.

## Validación

Comparar una ruta manual y la proyección usando el mismo escenario obligatorio y la matriz del [roadmap](../KRONFORGE_EVOLUTION_ROADMAP.md). El maintainer aprueba el manifiesto tras observar el piloto y revisar el [contrato](../architecture/KRONFORGE_PACK_CONTRACTS.md).
