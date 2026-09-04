---
id: mcp-integration.mcp-security
title: Checklist de seguridad MCP
summary: Revisar autoridad, datos y efectos antes de habilitar una integración MCP.
type: checklist
domain: mcp-integration
status: stable
version: 2.0.0
difficulty: intermediate
projects: [ai-application, agent-platform, developer-tool]
compatibility: protocol-oriented
models: [any]
tags: [mcp, security, permissions]
related:
  - mcp-integration.mcp-topology
  - security.security-audit
specRefs:
  - spec: mcp
    version: "2026-07-28"
    url: https://modelcontextprotocol.io/specification/2026-07-28/changelog
    verified: 2026-09-03
---

# Checklist de Seguridad MCP

Registra `Cumple`, `No cumple` o `No aplica` con evidencia.

## Autoridad

- [ ] Host, cliente, servidor y sistemas externos están identificados.
- [ ] Cada capacidad tiene permisos mínimos.
- [ ] Acciones sensibles requieren consentimiento visible.
- [ ] La disponibilidad de una tool no equivale a autorización.

## Autorización

- [ ] El emisor de los tokens se valida, no solo su firma.
- [ ] Las credenciales de cliente están vinculadas a su emisor.
- [ ] El registro de clientes usa la vía documentada por la especificación vigente.
- [ ] El alcance concedido corresponde a las capacidades realmente usadas.

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

## Estado y caché

- [ ] El diseño no asume una sesión de protocolo entre solicitudes.
- [ ] El estado de la conversación tiene ubicación y autoridad declaradas.
- [ ] El alcance de caché de un resultado no cruza identidades.
- [ ] La vigencia declarada corresponde a la sensibilidad del dato.

## Operación

- [ ] La resolución de capacidades falla de forma segura.
- [ ] El enrutamiento intermedio no depende de inspeccionar cuerpos sensibles.
- [ ] Existe evidencia auditable de acciones relevantes.
- [ ] Revocación y rotación de credenciales están definidas.
- [ ] El troubleshooting separa transporte, autorización y sistema externo.

## Compatibilidad

- [ ] Se declaró contra qué revisión de la especificación se diseñó.
- [ ] Las extensiones opcionales usadas están documentadas como dependencias.
- [ ] Las características deprecadas tienen fecha y plan de migración.

## Veredicto

- **Resultado:** Aprobado | Condicionado | Rechazado
- **Revisión de especificación:**
- **Bloqueantes:**
- **Evidencia:**
- **Responsable humano:**

## Fuentes

- [Especificación MCP 2026-07-28, registro de cambios](https://modelcontextprotocol.io/specification/2026-07-28/changelog), verificada el 2026-09-03.
