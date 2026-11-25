---
id: mcp-integration.mcp-topology
title: Topología MCP y límites de confianza
summary: Diseñar clientes, servidores y capacidades MCP con autoridad explícita.
type: architecture-note
domain: mcp-integration
status: stable
version: 2.0.1
difficulty: foundation
projects: [ai-application, agent-platform, developer-tool]
compatibility: protocol-oriented
models: [any]
tags: [mcp, tools, resources, security]
related: [mcp-integration.mcp-security]
specRefs:
  - spec: mcp
    version: "2026-07-28"
    url: https://modelcontextprotocol.io/specification/2026-07-28/changelog
    verified: 2026-09-03
lastModified: 2026-11-25
inputs:
  - "Host, cliente y servidor previstos"
  - "Capacidades, datos y límites de autoridad"
outputs:
  - "Mapa de componentes y fronteras de confianza"
  - "Decisiones de autorización, estado y ciclo de vida"
useCases:
  - "Diseñar una integración MCP"
  - "Revisar responsabilidades en una topología existente"
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

## Núcleo sin estado

La revisión `2026-07-28` de la especificación eliminó el estado del protocolo. El cambio es de arquitectura, no de detalle:

- no hay sesión de protocolo ni encabezado de sesión en el transporte HTTP;
- no hay intercambio inicial de negociación previo a las solicitudes;
- un servidor remoto se opera como cualquier otra carga HTTP;
- las capacidades se resuelven por solicitud, no por una sesión previamente establecida.

La consecuencia práctica: **el estado que la conversación necesite es responsabilidad de la aplicación, no del transporte**. Un diseño que asumía continuidad garantizada entre solicitudes debe declarar dónde vive ese estado y quién lo autoriza.

Los diseños escritos antes de esta revisión suelen contener una suposición implícita de sesión. Revísalos antes de reutilizarlos.

## Enrutamiento y caché

- El enrutamiento intermedio se decide con encabezados, sin inspeccionar el cuerpo de la solicitud.
- Los resultados de listado y de recursos pueden declarar tiempo de vida y alcance de caché.

Ambas propiedades son decisiones de arquitectura con efecto en seguridad: un alcance de caché mal elegido expone resultados de una identidad a otra.

## Tools

Representan acciones. Deben tener nombre, esquema, efectos, idempotencia, errores y permisos claros. Una tool disponible no implica autorización automática para usarla.

## Resources

Representan contexto direccionable. Deben declarar origen, sensibilidad, frescura y reglas de lectura. Cuando declaren caché, la vigencia forma parte del contrato.

## Prompts

Representan plantillas ofrecidas por el servidor. No deben elevar permisos ni ocultar acciones.

## Autorización

La revisión vigente endureció la autorización:

- validación del emisor de los tokens;
- credenciales de cliente vinculadas al emisor;
- documentos de metadatos de cliente como vía preferente de registro.

El principio de diseño no cambió: la autoridad se concede por identidad verificada y alcance explícito, nunca por disponibilidad de la capacidad.

## Extensiones y ciclo de vida

Las capacidades nuevas pueden llegar como extensiones opcionales en vez de modificar el núcleo, y cada característica recorre un ciclo de vida declarado con una ventana mínima entre su deprecación y su retiro.

Para el diseño esto significa que **depender de una extensión es una decisión de acoplamiento** que debe documentarse igual que cualquier dependencia.

## Decisiones de arquitectura

- El host conserva la decisión de consentimiento.
- El servidor aplica mínimo privilegio aunque el cliente falle.
- Las capacidades se descubren, no se asumen.
- El estado de la conversación es responsabilidad de la aplicación.
- Los resultados no confiables se tratan como datos, no como instrucciones.
- Las integraciones remotas requieren política explícita de datos.
- La versión de la especificación contra la que se diseñó se declara y se revisa.

## Troubleshooting

Diagnostica por capas: transporte, esquema, autorización, permiso, sistema externo y presentación en el host. Registra errores sin incluir secretos ni payloads sensibles.

## Fuentes

- [Especificación MCP 2026-07-28, registro de cambios](https://modelcontextprotocol.io/specification/2026-07-28/changelog), verificada el 2026-09-03.
