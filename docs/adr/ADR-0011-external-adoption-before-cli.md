# ADR-0011 — Adopción externa como condición para ampliar la automatización

- **Estado** `proposed`
- **Fecha** 2026-11-27
- **Responsable propuesto** Maintainer del framework
- **Relacionado** [ADR-0005](ADR-0005-discovery-surface-and-score-calibration.md) y [ADR-0006](ADR-0006-protocol-asset-type.md)

## Contexto

La calidad local comprueba varias propiedades del repositorio. La instalación, activación y recuperación de un pack dependen también de condiciones de consumo que la CI actual no ejecuta.

## Decisión propuesta

Aplicar AFP-006 al artefacto exacto, AFP-007 a las interfaces que declaren equivalencia y AFP-008 para comparar resultados. Utilizar BLK-ENG-001 como primer candidato condicionado a su fuente. Diferir una CLI propia hasta que la misma fricción aparezca en al menos dos consumidores independientes durante varios ciclos. Si se abre el RFC, empezar por operaciones de lectura y verificación. Mantener disponible la ruta manual en todas las fases.

## Alternativas y consecuencias

Una CLI temprana podría simplificar el onboarding, a cambio de comprometer una interfaz antes de conocer la operación real. Las herramientas existentes cubren instalación de piezas concretas con semánticas propias. La opción propuesta preserva una superficie portable y exige invertir primero en pruebas externas y evidencia.

## Validación

El owner revisa la matriz por cliente, el informe de adopción y la comparación contra guía y herramientas disponibles. Los umbrales y el alcance del piloto se fijan en el [roadmap propuesto](../KRONFORGE_EVOLUTION_ROADMAP.md).
