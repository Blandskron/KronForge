---
id: mcp-integration.mcp-security
title: Checklist de seguridad MCP
summary: Revisar autoridad, datos y efectos antes de habilitar una integración MCP.
type: checklist
domain: mcp-integration
status: stable
version: 1.0.0
difficulty: intermediate
projects: [ai-application, agent-platform, developer-tool]
compatibility: protocol-oriented
models: [any]
tags: [mcp, security, permissions]
related:
  - mcp-integration.mcp-topology
  - security.security-audit
---

# Checklist de Seguridad MCP

Registra `Cumple`, `No cumple` o `No aplica` con evidencia.

## Autoridad

- [ ] Host, cliente, servidor y sistemas externos están identificados.
- [ ] Cada capacidad tiene permisos mínimos.
- [ ] Acciones sensibles requieren consentimiento visible.
- [ ] La disponibilidad de una tool no equivale a autorización.

## Datos

- [ ] Resources declaran origen, sensibilidad y vigencia.
- [ ] Secretos no aparecen en logs, errores ni resultados.
- [ ] La integración remota documenta qué datos abandona el entorno.
- [ ] Resultados externos se tratan como contenido no confiable.

## Tools

- [ ] Esquemas de entrada y salida son estrictos.
- [ ] Efectos, idempotencia y rollback están documentados.
- [ ] Timeout, cancelación y límites de tamaño existen.
- [ ] Errores no filtran detalles sensibles.

## Operación

- [ ] La negociación de capacidades falla de forma segura.
- [ ] Existe evidencia auditable de acciones relevantes.
- [ ] Revocación y rotación de credenciales están definidas.
- [ ] El troubleshooting separa transporte, permisos y sistema externo.

## Veredicto

- **Resultado:** Aprobado | Condicionado | Rechazado
- **Bloqueantes:**
- **Evidencia:**
- **Responsable humano:**
