# Interoperabilidad entre Agentes

Comunicación, descubrimiento y confianza entre agentes que no comparten dueño, modelo ni implementación.

Este dominio existe porque el problema es distinto al de conectar un agente con sus herramientas. Allí el agente controla al servidor. Aquí el interlocutor es otro sistema con sus propios objetivos, su propia autoridad y su propia opacidad.

## Mapa del dominio

- identidad y descubrimiento de agentes;
- declaración de capacidades y su verificación;
- confianza, firma y procedencia;
- delegación de tareas entre organizaciones;
- límites de responsabilidad y evidencia;
- selección de protocolo según el problema.

## Activos

- Architecture note: [tarjetas de agente y confianza entre pares](architecture-notes/agent-cards-and-trust.architecture-note.md)
- Reference: [fronteras entre protocolos de agente](references/protocol-boundaries.references.md)

## Ruta de aprendizaje

Empieza por las fronteras entre protocolos para situar el problema y no elegir por moda. Lee después las tarjetas de agente para entender cómo se declara y se verifica una capacidad ajena.

## Relación con otros dominios

- [MCP e integraciones](../mcp-integration/README.md) cubre la conexión entre un agente y sus herramientas o datos.
- [Cadena de suministro de agentes](../agent-supply-chain/README.md) cubre la confianza en artefactos que el agente carga; aquí se cubre la confianza en sistemas con los que dialoga.
- [IA y agentes](../ai-agent-engineering/README.md) cubre la delegación dentro de un mismo sistema.

## Límites

Este dominio no reproduce las especificaciones ni documenta APIs concretas como verdades permanentes. Enseña las decisiones de arquitectura y confianza que siguen siendo válidas cuando la versión cambia.

Los protocolos citados declaran versión y fecha de verificación mediante `specRefs`. Consulta la [frescura verificable](../../../docs/SPEC_FRESHNESS.md) antes de tratar cualquier afirmación como vigente.
