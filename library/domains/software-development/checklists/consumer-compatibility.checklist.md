---
id: software-development.consumer-compatibility
title: Compatibilidad en un cambio de interfaz
summary: Comprobar qué consumidores pueden seguir usando una interfaz modificada.
type: checklist
domain: software-development
status: draft
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [compatibilidad, contratos]
related: [quality-engineering.regression-qa, engineering-protocols.interface-conformance]
inputs: [Contrato actual, Cambio propuesto, Consumidores observados]
outputs: [Matriz de compatibilidad, Plan de transición si corresponde]
useCases: [Evolución de una API, Cambio de un formato exportado]
---

# Compatibilidad en un cambio de interfaz

Registra el comportamiento que consume cada cliente conocido. Incluye errores, valores por defecto, orden y formatos de entrada o salida cuando formen parte del contrato.

| Consumidor | Comportamiento actual | Cambio esperado | Prueba o evidencia |
|---|---|---|---|
| Identificador del consumidor | Resultado documentado | Igual, ampliado o incompatible | Referencia verificable |

- [ ] Se ejecutó la versión anterior del consumidor contra una respuesta o artefacto de la versión candidata.
- [ ] Se comprobó qué pasa ante campos desconocidos, valores ausentes y errores. La aceptación de campos extra depende del consumidor.
- [ ] Se identificaron consumidores sin acceso para probar y se documentó el riesgo residual.
- [ ] Los cambios incompatibles tienen transición acordada, señal de retirada y responsable.

Por ejemplo, añadir una propiedad a un documento puede ser compatible con un lector que ignora claves desconocidas y fallar en un validador estricto. Utiliza ambas pruebas si ambos consumidores existen. Para revisar si dos interfaces expresan la misma semántica aplica el [protocolo de conformidad](../../engineering-protocols/protocols/interface-conformance.protocol.md).
