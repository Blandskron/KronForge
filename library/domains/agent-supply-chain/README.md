# Cadena de Suministro de Agentes

Confianza, procedencia y privilegio mínimo en los artefactos que un agente carga y ejecuta: skills, instrucciones distribuidas, registries y reuso entre plataformas.

Este dominio existe porque un activo documental dejó de ser solo lectura. Cuando un agente descubre una skill, la carga en su contexto y actúa sobre ella, ese archivo se comporta como código con permisos.

## Mapa del dominio

- límites de confianza de una skill;
- procedencia, firma y verificación;
- privilegio mínimo y herramientas declaradas;
- instrucciones cargadas desde fuentes externas;
- distribución, registries y actualización;
- reuso entre plataformas y pérdida de metadatos;
- gobernanza y visibilidad organizacional.

## Activos

- Architecture note: [límites de confianza de una skill](architecture-notes/skill-trust-boundaries.architecture-note.md)
- Pattern: [privilegio mínimo en herramientas de skill](patterns/least-privilege-skill-tools.pattern.md)
- Anti-pattern: [instrucciones externas no verificadas](anti-patterns/untrusted-external-instructions.anti-pattern.md)
- Checklist: [OWASP Agentic Skills Top 10](checklists/owasp-agentic-skills-top-10.checklist.md)

## Ruta de aprendizaje

Empieza por los límites de confianza para entender qué autoridad concede cargar una skill. Aplica después el patrón de privilegio mínimo al diseñar una, y el anti-patrón al revisar una ajena. Usa la checklist como compuerta antes de publicar o adoptar.

## Relación con otros dominios

- [MCP e integraciones](../mcp-integration/README.md) cubre la autoridad de tools y resources en tiempo de conexión; aquí se cubre la autoridad del artefacto antes de ejecutarse.
- [Seguridad](../security/README.md) cubre AppSec y supply chain del software; aquí se cubre el artefacto que instruye al agente.
- [IA y agentes](../ai-agent-engineering/README.md) cubre el contrato editorial de una skill; aquí se cubre su contrato de confianza.

## Límites

Este dominio no publica escáneres, firmas ni listas de skills maliciosas concretas. La investigación pública demuestra que los escáneres se evaden y que las listas envejecen. Lo que se documenta aquí son decisiones de arquitectura y revisión que siguen siendo válidas cuando la herramienta de turno cambia.

Este dominio tampoco sustituye la fuente primaria. Las referencias externas declaran versión y fecha de verificación mediante `specRefs`; consulta [frescura verificable](../../../docs/SPEC_FRESHNESS.md).
