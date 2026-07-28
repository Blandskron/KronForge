---
id: mcp-integration.mcp-topology
title: Topología MCP y límites de confianza
summary: Diseñar clientes, servidores y capacidades MCP con autoridad explícita.
type: architecture-note
domain: mcp-integration
status: stable
version: 1.0.0
difficulty: foundation
projects: [ai-application, agent-platform, developer-tool]
compatibility: protocol-oriented
models: [any]
tags: [mcp, tools, resources, security]
related: [mcp-integration.mcp-security]
---

# Architecture Note: Topología MCP y Límites de Confianza

## Componentes

- **Host:** aplicación que controla la experiencia, permisos y ciclo de vida.
- **Cliente:** conexión del host con un servidor y sus capacidades.
- **Servidor:** expone tools, resources o prompts dentro de una autoridad definida.
- **Sistema externo:** servicio, repositorio o dato al que el servidor puede acceder.

## Límites de confianza

```text
Usuario
  |
  v
Host y política de consentimiento
  |
  +-- Cliente A --> Servidor local --> Repositorio
  |
  +-- Cliente B --> Servidor remoto --> Servicio externo
```

Cada cruce declara:

- identidad;
- datos transferidos;
- acciones permitidas;
- consentimiento;
- timeout y cancelación;
- evidencia y auditoría.

## Tools

Representan acciones. Deben tener nombre, esquema, efectos, idempotencia, errores y permisos claros. Una tool disponible no implica autorización automática para usarla.

## Resources

Representan contexto direccionable. Deben declarar origen, sensibilidad, frescura y reglas de lectura.

## Prompts

Representan plantillas ofrecidas por el servidor. No deben elevar permisos ni ocultar acciones.

## Decisiones de arquitectura

- El host conserva la decisión de consentimiento.
- El servidor aplica mínimo privilegio aunque el cliente falle.
- Las capacidades se descubren, no se asumen.
- Los resultados no confiables se tratan como datos, no como instrucciones.
- Las integraciones remotas requieren política explícita de datos.

## Troubleshooting

Diagnostica por capas: transporte, negociación, esquema, permiso, sistema externo y presentación en el host. Registra errores sin incluir secretos ni payloads sensibles.
