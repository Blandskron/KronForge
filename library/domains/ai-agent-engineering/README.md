# Ingeniería de IA y Agentes

Agentes, subagentes, evaluación, memoria, RAG, integración LLM, prompts y límites de autoridad.

## Activos

- Skill: [actualización del prompt maestro](skills/prompt-update/SKILL.md)
- Playbook: [preparar un repositorio agents-first](playbooks/prepare-agents-first.playbook.md)
- Architecture note: [sistemas de subagentes](architecture-notes/subagent-systems.architecture-note.md)
- Pattern: [delegación por contrato](patterns/subagent-contract.pattern.md)
- Pattern: [roles de agentes y contratos de handoff](patterns/agent-roles-and-handoffs.pattern.md)
- Checklist: [conformidad Agent Skills](checklists/agent-skills-conformance.checklist.md)

## Mapa del dominio

- diseño y ciclo de vida de agentes;
- especialización y coordinación de subagentes;
- memoria, retrieval y RAG;
- evaluación de calidad y seguridad;
- integración de modelos y tools;
- prompt engineering como contrato ejecutable.

## Ruta de aprendizaje

Empieza por el playbook agents-first. Para trabajo multiagente, lee la arquitectura de subagentes y aplica delegación por contrato. Antes de publicar una skill, verifica su conformidad con el formato abierto y revisa su confianza en [cadena de suministro de agentes](../agent-supply-chain/README.md).

## Principio

El conocimiento central es agnóstico al modelo. Las integraciones específicas son adaptadores opcionales.
