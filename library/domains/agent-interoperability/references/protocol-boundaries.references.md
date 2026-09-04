---
id: agent-interoperability.protocol-boundaries
title: Fronteras entre protocolos de agente
summary: Elegir protocolo por el problema que resuelve, no por su popularidad.
type: reference
domain: agent-interoperability
status: stable
version: 1.0.0
difficulty: foundation
projects: [agent-platform, ai-application, developer-tool]
compatibility: protocol-oriented
models: [any]
tags: [mcp, a2a, interoperability, architecture]
related: [agent-interoperability.agent-cards-and-trust, mcp-integration.mcp-topology]
specRefs:
  - spec: mcp
    version: "2026-07-28"
    url: https://modelcontextprotocol.io/specification/2026-07-28/changelog
    verified: 2026-09-03
  - spec: a2a
    version: "1.0.0"
    url: https://a2a-protocol.org/latest/specification/
    verified: 2026-09-03
  - spec: agent-skills
    url: https://agentskills.io/specification
    verified: 2026-09-03
---

# Reference: Fronteras entre Protocolos de Agente

## Para qué sirve esta referencia

Los formatos y protocolos del ecosistema resuelven problemas distintos y con frecuencia se comparan como si fueran alternativas. No lo son. Esta referencia sitúa cada uno por el problema que ataca, para que la elección no dependa de cuál se mencione más.

## Mapa

| Formato | Problema que resuelve | Relación con el agente |
|---|---|---|
| `AGENTS.md` | qué necesita saber un agente sobre **este repositorio** | instrucciones locales |
| Agent Skills | cómo **hacer** una tarea repetible | procedimiento cargado bajo demanda |
| Model Context Protocol | cómo alcanzar **herramientas y datos** | el agente es el cliente |
| A2A | cómo delegar a **otro agente** | el par tiene su propia autoridad |

Las cuatro capas se combinan: un agente lee `AGENTS.md` para entender el repositorio, activa una skill para saber cómo ejecutar un procedimiento, usa MCP para alcanzar los sistemas que ese procedimiento necesita y, si la tarea excede su alcance, delega por A2A.

## Criterio de elección

La pregunta útil no es cuál protocolo usar, sino **quién tiene la autoridad al otro lado**.

- Si la autoridad es tuya y el otro extremo es pasivo: es una herramienta. **MCP**.
- Si el otro extremo decide cómo hacer el trabajo y responde a otro dueño: es un par. **A2A**.
- Si lo que falta no es acceso sino procedimiento: es conocimiento. **Skills**.
- Si lo que falta es contexto sobre el proyecto: es documentación. **`AGENTS.md`**.

Elegir mal no suele producir un fallo inmediato. Produce un sistema donde la autoridad está mal repartida y nadie sabe quién autorizó qué.

## Estado y gobernanza

| Formato | Referencia consultada | Gobernanza |
|---|---|---|
| `AGENTS.md` | convención abierta | Agentic AI Foundation (Linux Foundation) |
| Agent Skills | especificación pública | estándar abierto, originado en Anthropic |
| MCP | revisión `2026-07-28` | Agentic AI Foundation (Linux Foundation) |
| A2A | versión `1.0.0` | Agentic AI Foundation (Linux Foundation) |

Tres de los cuatro se gobiernan hoy bajo una fundación neutral. Eso cambia el cálculo de dependencia: apoyarse en ellos ya no equivale a apostar por el roadmap de una empresa.

## Cambios que conviene conocer

- **MCP `2026-07-28`** eliminó el estado del protocolo. Un diseño anterior puede asumir una sesión que ya no existe. Ver [topología MCP](../../mcp-integration/architecture-notes/mcp-topology.architecture-note.md).
- **A2A `1.0.0`** pasó a producción e incorporó tarjetas de agente firmadas. Ver [tarjetas de agente](../architecture-notes/agent-cards-and-trust.architecture-note.md).
- **Agent Skills** se consolidó como estándar abierto con adopción amplia entre clientes. Ver [checklist de conformidad](../../ai-agent-engineering/checklists/agent-skills-conformance.checklist.md).

## Lo que esta referencia no hace

No reproduce ninguna especificación, no compara rendimiento y no recomienda un proveedor. Las versiones citadas tienen fecha de verificación declarada en `specRefs`: comprueba la [frescura](../../../../docs/SPEC_FRESHNESS.md) antes de tratarlas como vigentes.

## Fuentes primarias

- [Especificación MCP 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog), verificada el 2026-09-03.
- [Especificación A2A](https://a2a-protocol.org/latest/specification/), verificada el 2026-09-03.
- [Especificación Agent Skills](https://agentskills.io/specification), verificada el 2026-09-03.
- [AGENTS.md](https://github.com/agentsmd/agents.md), verificada el 2026-09-03.
- [Formación de la Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), verificada el 2026-09-03.
