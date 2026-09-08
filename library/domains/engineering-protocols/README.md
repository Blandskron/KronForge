# Protocolos de Ingeniería con Agentes

Ciclos de vida normativos para que personas y agentes planifiquen, deleguen, implementen, revisen, validen, midan y publiquen software sobre un mismo repositorio.

Este dominio existe porque un prompt describe una tarea y un protocolo describe una forma de trabajar. Cuando varios participantes actúan sobre el mismo proyecto, lo que hace falta no es un prompt más largo: es un contrato explícito sobre roles, autoridad, evidencia y detención.

## Qué es un protocolo aquí

Un activo de tipo `protocol` describe una interacción normativa con **actores, ciclo de vida, contrato, evidencia, compuertas, estados de falla y madurez declarada**. Se distingue de los tipos vecinos:

| Tipo | Qué describe |
|---|---|
| `protocol` | Un ciclo normativo multi-actor con estados, evidencia y compuertas. |
| `playbook` | Un procedimiento para que un actor logre un resultado. |
| `pattern` | Una solución recurrente a un problema, sin ciclo de vida. |
| `architecture-note` | Una estructura o concepto, sin normatividad. |
| `checklist` | Una compuerta puntual de verificación. |
| `runbook` | La respuesta operativa a una situación. |

Un protocolo declara además metadatos propios — código estable, madurez, actores, dependencias, dónde se observó y cuándo se revalidó — que la puerta de calidad verifica. Ver [ADR-0006](../../../docs/adr/ADR-0006-protocol-asset-type.md).

## Grafo de la suite

```text
AFP-000  madurez y validación ──── gobierna a todos

AFP-001  estado del repositorio
    │
    ├──→ AFP-002  delegación y handoff
    │        │
    │        └──→ AFP-003  colaboración multiagente
    │
    └──→ AFP-004  evidencia y compuertas
             │
             ├──→ AFP-005  revisión independiente
             ├──→ AFP-006  validación de consumo externo
             ├──→ AFP-007  conformidad entre interfaces
             ├──→ AFP-008  benchmark
             ├──→ AFP-009  preparación de publicación
             └──→ AFP-011  completitud, falla y detención

AFP-010  registros de decisión ──── rodea el ciclo completo
```

## Estado de madurez

Ningún protocolo de esta suite está validado. Todos declaran `experimental` bajo la escala de [AFP-000](protocols/protocol-maturity.protocol.md), y ninguno ha alcanzado `reproduced` porque falta un segundo proyecto independiente.

| Protocolo | Madurez | Depende de |
|---|---|---|
| [AFP-000 — madurez y validación](protocols/protocol-maturity.protocol.md) | `experimental` | — |
| [AFP-001 — estado del repositorio](protocols/repository-state.protocol.md) | `experimental` | — |
| [AFP-002 — delegación y handoff](protocols/work-delegation.protocol.md) | `experimental` | AFP-001 |
| [AFP-003 — colaboración multiagente](protocols/multi-agent-collaboration.protocol.md) | `experimental` | AFP-001, AFP-002 |
| [AFP-004 — evidencia y compuertas](protocols/evidence-and-gates.protocol.md) | `experimental` | AFP-001 |
| [AFP-005 — revisión independiente](protocols/independent-review.protocol.md) | `experimental` | AFP-004 |
| [AFP-006 — validación de consumo externo](protocols/external-consumption-validation.protocol.md) | `experimental` | AFP-004 |
| [AFP-007 — conformidad entre interfaces](protocols/interface-conformance.protocol.md) | `experimental` | AFP-004 |
| [AFP-008 — benchmark reproducible](protocols/benchmark.protocol.md) | `experimental` | AFP-004 |
| [AFP-009 — preparación de publicación](protocols/release-readiness.protocol.md) | `experimental` | AFP-004, AFP-006 |
| [AFP-010 — registros de decisión](protocols/decision-records.protocol.md) | `experimental` | AFP-001 |
| [AFP-011 — completitud, falla y detención](protocols/completion-and-stop.protocol.md) | `experimental` | AFP-004 |

## Activos

### Protocolos

- [AFP-000 — madurez y validación de protocolos](protocols/protocol-maturity.protocol.md)
- [AFP-001 — estado del repositorio y ciclo del agente](protocols/repository-state.protocol.md)
- [AFP-002 — delegación y handoff de trabajo](protocols/work-delegation.protocol.md)
- [AFP-003 — colaboración multiagente](protocols/multi-agent-collaboration.protocol.md)
- [AFP-004 — evidencia y compuertas de calidad](protocols/evidence-and-gates.protocol.md)
- [AFP-005 — revisión independiente](protocols/independent-review.protocol.md)
- [AFP-006 — validación de consumo externo](protocols/external-consumption-validation.protocol.md)
- [AFP-007 — conformidad entre interfaces](protocols/interface-conformance.protocol.md)
- [AFP-008 — benchmark reproducible](protocols/benchmark.protocol.md)
- [AFP-009 — preparación de publicación](protocols/release-readiness.protocol.md)
- [AFP-010 — registros de decisión](protocols/decision-records.protocol.md)
- [AFP-011 — completitud, falla y detención](protocols/completion-and-stop.protocol.md)

### Plantillas

- [Plantilla de protocolo](templates/protocol.template.md)
- [Contrato de delegación de tarea](templates/delegation-contract.template.md)
- [Recibo de handoff](templates/handoff-receipt.template.md)
- [Registro de evidencia de compuerta](templates/evidence-record.template.md)
- [Informe de benchmark](templates/benchmark-report.template.md)

### Anti-patrones

- [Compuerta aprobada sin ejecución](anti-patterns/unverified-gate-claim.anti-pattern.md)
- [Autorrevisión presentada como revisión independiente](anti-patterns/self-review-as-independent.anti-pattern.md)
- [Protocolo acoplado a proveedores](anti-patterns/vendor-coupled-protocol.anti-pattern.md)

### Ejemplo y referencia

- Example: [escenarios de aplicación de los protocolos](examples/protocol-scenarios.example.md)
- Reference: [trabajo previo y terminología equivalente](references/prior-art.reference.md)

## Ruta de adopción

No adoptes la suite entera. Empieza por lo que resuelve un problema que ya tienes.

1. **Si tus agentes reportan resultados que no puedes verificar**, empieza por [AFP-004](protocols/evidence-and-gates.protocol.md) y [AFP-011](protocols/completion-and-stop.protocol.md). Son los dos que más valor producen solos.
2. **Si el trabajo se rehace o se pierde entre sesiones**, añade [AFP-001](protocols/repository-state.protocol.md) y [AFP-002](protocols/work-delegation.protocol.md).
3. **Si hay más de un participante modificando**, añade [AFP-003](protocols/multi-agent-collaboration.protocol.md) y [AFP-005](protocols/independent-review.protocol.md).
4. **Si publicas artefactos**, añade [AFP-006](protocols/external-consumption-validation.protocol.md) y [AFP-009](protocols/release-readiness.protocol.md).
5. **Si escribes tus propios protocolos**, [AFP-000](protocols/protocol-maturity.protocol.md) y la [plantilla](templates/protocol.template.md).

El escenario A de los [ejemplos](examples/protocol-scenarios.example.md) muestra cuánto protocolo puede omitirse legítimamente en el caso más simple.

## Relación con otros dominios

- [Repository Engineering](../repository-engineering/README.md) cubre cómo se estructura un repositorio para que un agente lo entienda; aquí se cubre qué debe hacer el agente antes de modificarlo.
- [Ingeniería de calidad](../quality-engineering/README.md) cubre las compuertas concretas de testing y revisión; aquí se cubre el contrato de evidencia que las hace verificables.
- [Interoperabilidad entre agentes](../agent-interoperability/README.md) cubre la comunicación entre agentes de distinto dueño; aquí se cubre la colaboración de varios agentes sobre un mismo repositorio.
- [Arquitectura](../architecture/README.md) posee las plantillas de decisión y propuesta que [AFP-010](protocols/decision-records.protocol.md) gobierna.
- [Entrega y plataforma](../delivery-platform/README.md) cubre la mecánica de CI/CD y publicación; aquí se cubre la autoridad y la evidencia que la preceden.
- [Seguridad](../security/README.md) cubre AppSec; aquí se cubre cuándo la revisión de seguridad es obligatoria y quién puede cerrarla.

## Límites

Este dominio no publica un runtime, un orquestador ni una herramienta de coordinación. Publica contratos que sobreviven al cambio de herramienta.

Tampoco declara validado nada que no lo esté. La evidencia empírica de la suite proviene hoy de un solo proyecto externo, con un solo mantenedor y un solo ecosistema. Cada protocolo cita esa evidencia en su sección `## Evidencia y límites` y declara ahí mismo qué sostiene y qué no; esa cita es una traza verificable, no una dependencia: el framework se adopta, valida y publica sin conocer ese proyecto. Un protocolo que un lector adopte hoy está adoptando una propuesta razonada con evidencia parcial, no una práctica demostrada.
