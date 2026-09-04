# MCP e Integración de Herramientas

Arquitectura y operación segura de sistemas basados en Model Context Protocol: clientes, servidores, tools, resources y prompts.

## Mapa del dominio

- fundamentos y roles;
- descubrimiento y capacidades;
- tools, resources y prompts;
- límites de confianza;
- autenticación, autorización y consentimiento;
- diseño de clientes y servidores;
- observabilidad y troubleshooting;
- integraciones opcionales.

## Activos

- Architecture note: [topología MCP y límites de confianza](architecture-notes/mcp-topology.architecture-note.md)
- Checklist: [seguridad de una integración MCP](checklists/mcp-security.checklist.md)

## Ruta de aprendizaje

Lee primero la topología. Usa después la checklist para revisar una integración concreta.

## Límites

Este dominio no sustituye la especificación oficial ni documenta APIs cambiantes como verdades permanentes. Las integraciones de proveedor deben vivir en `tool-integrations/` y declarar versión y fecha de revisión.

Sus activos están escritos contra la revisión `2026-07-28` de la especificación, declarada en `specRefs`. Esa revisión eliminó el estado del protocolo: un diseño anterior puede contener una suposición implícita de sesión. Antes de reutilizar este contenido, comprueba la [frescura de la referencia](../../../docs/SPEC_FRESHNESS.md).
