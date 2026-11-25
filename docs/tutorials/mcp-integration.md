# Diseñar una integración MCP de solo lectura

**Nivel** · Intermedio

**Prerrequisito** · Identificar qué documento necesita consultar un usuario y quién controla su acceso.

Consulta [Seguridad de MCP](../../library/domains/mcp-integration/checklists/mcp-security.checklist.md) antes de empezar.

## Ejercicio

1. Traza una consulta de documentación desde el usuario al cliente y el servidor. Anota qué datos cruzan cada límite de confianza.
2. Define un permiso de lectura del documento y un caso de acceso denegado. Explica qué respuesta espera el cliente y cómo se registra sin copiar datos sensibles.
3. Revisa el diseño con la lista de seguridad y deja la comprobación de un servidor real como pendiente hasta disponer de uno autorizado.

## Entrega y aceptación

Un diagrama o tabla de límites, un caso permitido y uno denegado, y un veredicto de diseño. Cada lectura tiene autoridad identificada y el caso denegado tiene una respuesta explícita.

[Volver a los tutoriales por dominio](README.md) · [Caso reproducible de Proyección de skills](../cases/skill-projection.md)
