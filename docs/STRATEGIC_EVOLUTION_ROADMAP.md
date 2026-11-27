# KronForge — Strategic Evolution Roadmap (Ciclos 0–7)

- **Estado:** Aprobado por el owner el 2026-11-27.
- **Base arquitectónica:** [ADR-0012](adr/ADR-0012-universal-evolution-architecture.md) y [FRAMEWORK_ARCHITECTURE.md](architecture/FRAMEWORK_ARCHITECTURE.md).
- **Regla de continuidad:** Este archivo actúa como checkpoint persistente para que cualquier agente o mantenedor pueda retomar la ejecución desde la última tarea validada.
- **Política de publicación:** Los ciclos son unidades de trabajo; no se publican versiones en npm ni tags públicos hasta el Go/No-Go del Ciclo 7.

## Estados permitidos

`Pending` · `In Progress` · `Blocked` · `In Review` · `Validated` · `Completed`

---

## Ciclo 0 — Research & Discovery

| ID | Tarea | Prioridad | Estado | Evidencia / Artefacto |
|---|---|---|---|---|
| `C0-T1` | Investigación competitiva (Spec Kit, BMAD, Superpowers, OpenSpec, Agent OS, NAEOS, estándares abiertos) | P0 | `Completed` | Matriz competitiva aprobada en Ciclo 0 |
| `C0-T2` | Auditoría integral de KronForge `v3.4.3` y clasificación de capacidades A–I | P0 | `Completed` | Inventario verificado (66 activos, 18 dominios, `pack-store.mjs`) |
| `C0-T3` | Contraste de arquitectura objetivo y diseño de CLI/API zero-deps | P0 | `Completed` | [ADR-0012](adr/ADR-0012-universal-evolution-architecture.md) |
| `C0-T4` | Persistencia del roadmap maestro y decisiones en `docs/` | P0 | `Completed` | Este documento y [docs/adr/README.md](adr/README.md) |

---

## Ciclo 1 — Operational Foundation

- **Objetivo:** Dotar a KronForge de detección real de stack, perfiles de proyecto, packs selectivos de ingeniería, generador de contexto/adaptadores y ciclo de vida seguro (`init`, `detect`, `install`, `update`, `uninstall`, `rollback`, `doctor`) sin dependencias externas.
- **Dependencia:** Ciclo 0 aprobado.

| ID | Tarea | Prioridad | Dependencias | Estado | Criterios de aceptación |
|---|---|---|---|---|---|
| `C1-T1` | Stack & Repo Detector (`scripts/lib/detector.mjs`) | P0 | `C0-T4` | `Completed` | Detecta lenguajes, package managers, comandos reales, Git, CI, agentes existentes y recomienda perfil/packs sin inventar comandos. |
| `C1-T2` | Catálogo de Engineering Packs y Project Profiles (`scripts/lib/packs.mjs`) | P0 | `C1-T1` | `Completed` | Define perfiles (`startup`, `opensource`, `enterprise`) y packs (`agents-first`, `testing`, `security`, `gitflow`, `architecture`, `spec-driven`, `data-privacy`) referenciando activos canónicos existentes. |
| `C1-T3` | Instalador seguro con lock SHA-256, dry-run, conflictos y rollback (`scripts/lib/installer.mjs`) | P0 | `C1-T2` | `Completed` | Soporta `plan`, `apply`, `update`, `uninstall`, `rollback`, `doctor`; bloquea path traversal/symlinks; preserva archivos modificados localmente; es idempotente. |
| `C1-T4` | Context & Agent Adapter Generator (`scripts/lib/context-generator.mjs`) | P0 | `C1-T1`, `C1-T3` | `Completed` | Genera `AGENTS.md` con comandos detectados (sin pisar uno existente) y adaptadores delgados para Claude, Gemini, Copilot y Cursor. |
| `C1-T5` | Integración en CLI, API, tipos TS y pruebas multi-stack (`scripts/cli.mjs`, `scripts/api.mjs`, `scripts/api.d.ts`, `tests/operational-foundation.test.mjs`) | P0 | `C1-T1`..`C1-T4` | `Completed` | Comandos `detect`, `packs`, `init`, `install`, `update`, `uninstall`, `rollback`, `doctor` operativos; `npm run quality` en verde. |

---

## Ciclo 2 — Engineering Lifecycle

| ID | Tarea | Prioridad | Dependencias | Estado |
|---|---|---|---|---|
| `C2-T1` | Specification Engineering (Project Constitution, specs trazables, criterios de aceptación) | P0 | Ciclo 1 | `Completed` |
| `C2-T2` | Change Management Brownfield (`proposal → delta-spec → design → tasks → archive` + rollback) | P0 | `C2-T1` | `Completed` |
| `C2-T3` | Skills ejecutables `agentskills.io` (TDD, debugging sistemático, code review, refactoring, Git Flow, incidentes) | P0 | Ciclo 1 | `Completed` |
| `C2-T4` | Agent Roles & Handoff Contracts alineados a `AFP-002`, `AFP-003`, `AFP-005` | P1 | `C2-T1` | `Completed` |

---

## Ciclo 3 — Context & Knowledge Engineering

| ID | Tarea | Prioridad | Dependencias | Estado |
|---|---|---|---|---|
| `C3-T1` | Context Discovery Engine (`index` de convenciones reales del repositorio) | P1 | Ciclo 1 | `Completed` |
| `C3-T2` | Project Memory Protocol & Template persistente entre sesiones | P1 | Ciclo 2 | `Completed` |
| `C3-T3` | Context Routing y compresión orientada a presupuesto de tokens | P1 | `C3-T1` | `Completed` |

---

## Ciclo 4 — Governance, Security & Compliance Engineering

| ID | Tarea | Prioridad | Dependencias | Estado |
|---|---|---|---|---|
| `C4-T1` | Governance as Code Validator (`kronforge validate <dir>`) | P1 | Ciclo 1, Ciclo 2 | `Completed` |
| `C4-T2` | Compliance & Privacy Reference Pack (GDPR, Ley 21.719 Chile, OWASP, NIST AI RMF, ISO 27001/42001 — sin claims de certificación) | P1 | `C4-T1` | `Completed` |
| `C4-T3` | Supply Chain Verification para packs y skills externas | P1 | `C4-T1` | `Completed` |

---

## Ciclo 5 — Engineering Assurance & Evidence Engine

| ID | Tarea | Prioridad | Dependencias | Estado |
|---|---|---|---|---|
| `C5-T1` | Universal Repository Score (`kronforge score <dir>` y `kronforge audit <dir>`) | P1 | Ciclo 1, Ciclo 4 | `Completed` |
| `C5-T2` | Evidence Engine (`AFP-004`) con veredictos verificables (`PASS/FAIL/NOT_RUN/STALE/NEEDS_REVIEW`) | P1 | `C5-T1` | `Completed` |
| `C5-T3` | Skill & Workflow Evaluations + Benchmarks reproducibles (`AFP-008`) | P2 | `C5-T2` | `Completed` |

---

## Ciclo 6 — Ecosystem & Developer Experience

| ID | Tarea | Prioridad | Dependencias | Estado |
|---|---|---|---|---|
| `C6-T1` | Skill Builder & Pack Builder CLI (`skill new`, `pack build`, `pack verify`) | P2 | Ciclo 2, Ciclo 5 | `Completed` |
| `C6-T2` | Community Registry Contract & Governance | P2 | `C6-T1` | `Completed` |
| `C6-T3` | Static Engineering Dashboard en GitHub Pages (client-side JSON local, cero backend) | P2 | `C5-T1` | `Completed` |

---

## Ciclo 7 — Stabilization, External Validation & Release Readiness

| ID | Tarea | Prioridad | Dependencias | Estado |
|---|---|---|---|---|
| `C7-T1` | Matriz CI multi-OS (Windows, Linux, macOS) e instalaciones limpias desde `.tgz` | P0 | Ciclos 1–6 | `Pending` |
| `C7-T2` | Validación externa reproducible multi-stack (Greenfield y Brownfield) | P0 | `C7-T1` | `Pending` |
| `C7-T3` | Auditoría final, re-evaluación competitiva, Changelog, Release Notes y Go/No-Go | P0 | `C7-T2` | `Pending` |
