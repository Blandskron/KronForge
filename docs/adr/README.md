# Registro de Decisiones Arquitectónicas

Este directorio registra decisiones estructurales reales del framework.

## Estados

- `proposed`: en discusión;
- `accepted`: vigente;
- `superseded`: reemplazada por otra decisión;
- `rejected`: evaluada y no adoptada.

## Índice

| ADR | Estado | Decisión |
|---|---|---|
| [ADR-0001](ADR-0001-layered-framework-v3.md) | accepted | Arquitectura v3 por capas y evolución gradual |
| [ADR-0002](ADR-0002-catalog-v3-projection.md) | accepted | Markdown canónico y catálogo v3 como proyección |
| [ADR-0003](ADR-0003-zero-dependency-quality-gate.md) | accepted | Quality gate reproducible sin dependencias |
| [ADR-0004](ADR-0004-agent-skills-projection-and-spec-freshness.md) | accepted | Proyección de skills conforme al estándar y frescura verificable |
| [ADR-0005](ADR-0005-discovery-surface-and-score-calibration.md) | accepted | Superficie de descubrimiento `llms.txt` y recalibración del score |
| [ADR-0006](ADR-0006-protocol-asset-type.md) | accepted | Tipo de activo `protocol` y capa de protocolos de ingeniería |
| [ADR-0007](ADR-0007-evidence-citation-not-dependency.md) | accepted | La evidencia externa se cita, no se aloja |
| [ADR-0008](ADR-0008-kronforge-portal-identity.md) | accepted | Identidad y publicación de KronForge |
| [ADR-0009](ADR-0009-pack-composition-and-distribution.md) | proposed | Composición de packs y distribución portable |
| [ADR-0010](ADR-0010-pinned-installation-and-trust.md) | proposed | Instalación fijada, aprobada y recuperable |
| [ADR-0011](ADR-0011-external-adoption-before-cli.md) | proposed | Adopción externa como condición para ampliar la automatización |

Para una decisión nueva, usa la [plantilla ADR](../../library/domains/architecture/templates/adr.template.md), elimina instrucciones y actualiza este índice.

