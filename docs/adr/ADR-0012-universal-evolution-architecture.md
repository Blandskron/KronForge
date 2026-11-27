# ADR-0012 — Evolución hacia Universal Agents-First Engineering Framework

- **Estado:** `accepted`
- **Fecha:** 2026-11-27
- **Responsable:** Maintainer de KronForge
- **Relacionado:** [ADR-0001](ADR-0001-layered-framework-v3.md), [ADR-0003](ADR-0003-zero-dependency-quality-gate.md), [ADR-0009](ADR-0009-pack-composition-and-distribution.md), [ADR-0010](ADR-0010-pinned-installation-and-trust.md), [ADR-0011](ADR-0011-external-adoption-before-cli.md)

## Contexto

KronForge `v3.4.x` consolidó una arquitectura documental de 7 capas, un catálogo v3 verificable, 12 protocolos de ingeniería (`AFP-000`..`AFP-011`), un prototipo criptográfico de packs locales (`scripts/lib/pack-store.mjs`) y distribución en npm con OIDC Trusted Publishing sin dependencias.

La auditoría competitiva del Ciclo 0 (GitHub Spec Kit, BMAD Method, Superpowers, OpenSpec, Agent OS, NAEOS y estándares abiertos `agentskills.io` / AAIF) mostró que la principal brecha de adopción de KronForge no está en su conocimiento base, sino en la capa operativa: detección de stack, instalación selectiva y reversible en repositorios consumidores, especificación incremental (Greenfield/Brownfield), evaluación reproducible de repositorios externos y experiencia de CLI/API sin dependencias.

Al mismo tiempo, `ADR-0011` (`proposed`) sugería diferir la CLI hasta validar adopción externa, pero `kronforge` ya opera como paquete público en npm con comandos de lectura.

## Decisión

1. **Conservar y evolucionar la arquitectura de 7 capas** sin reemplazar nombres por moda ni introducir un runtime obligatorio de agentes:
   - *Integration & Orientation* (entradas, adaptadores delgados, `skills/`, `llms.txt`).
   - *Operational* (detección de stack, perfiles, packs selectivos, generador de contexto e instalador con lock SHA-256 y rollback).
   - *Protocol & Execution* (protocolos normativos `AFP-*`, SDD, change management, skills y workflows).
   - *Knowledge* (Markdown canónico por dominio y proyección `catalog.json` v3).
   - *Governance* (políticas, permisos, supply chain y mapeos de compliance sin reclamar certificación).
   - *Verification & Assurance* (validadores, score universal para repositorios consumidores y Evidence Engine).
   - *Presentation & Distribution* (portal estático GitHub Pages, npm OIDC y Dashboard client-side).
2. **Adoptar una CLI progresiva zero-dependencies** (actualizando la postura propuesta en `ADR-0011`):
   - Comandos de lectura y diagnóstico (`detect`, `audit`, `score`, `validate`, `doctor`, `packs`) sin mutar el árbol de trabajo.
   - Comandos de gestión operativa (`init`, `install`, `update`, `uninstall`, `rollback`) con `--dry-run`, lock local `.kronforge/lock.json`, preservación de archivos locales, detección de deriva y rollback explícito.
3. **Preservar compatibilidad hacia atrás y SemVer disciplinado:** las capacidades de los Ciclos 1–6 son aditivas sobre `catalog-v3.schema.json` y los comandos actuales (`prompt`, `list`, `show`, `domains`, `llms`). No se fuerza un salto a `4.0.0` sin ruptura verificada de contrato.

## Alternativas y consecuencias

- **Crear un runtime o daemon propio (estilo control plane pesado):** descartado; violaría el principio de cero dependencias y adopción progresiva sin runtime.
- **Mantener solo adopción manual por copia/pega:** descartado; frena la adopción repetible en proyectos reales y desaprovecha la distribución npm OIDC ya operativa.
- **Consecuencia:** toda nueva capacidad operativa debe cumplir los mismos estándares de seguridad del sistema de archivos (`ADR-0010`), pruebas automatizadas en `node:test` y `npm run quality`.

## Validación

Cada ciclo del [Roadmap Estratégico](../STRATEGIC_EVOLUTION_ROADMAP.md) cierra con pruebas unitarias y de integración multi-stack, verificación de idempotencia y conflictos, `npm run quality` en verde y evidencia persistida en el repositorio.
