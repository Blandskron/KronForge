# Skills del Catálogo

Las skills canónicas viven junto a su dominio:

| Skill | Ruta | Propósito |
|---|---|---|
| Prompt Update | [`library/domains/ai-agent-engineering/skills/prompt-update/SKILL.md`](../../library/domains/ai-agent-engineering/skills/prompt-update/SKILL.md) | Actualizar el prompt maestro y versionarlo |
| Documentation Audit | [`library/domains/documentation-knowledge/skills/documentation-audit/SKILL.md`](../../library/domains/documentation-knowledge/skills/documentation-audit/SKILL.md) | Auditar consistencia y seguridad documental |
| GitHub Pages Release | [`library/domains/delivery-platform/skills/github-pages-release/SKILL.md`](../../library/domains/delivery-platform/skills/github-pages-release/SKILL.md) | Validar la publicación del sitio estático |

Este archivo se conserva como índice de compatibilidad. Para descubrir todos los tipos de activo, usa [`library/README.md`](../../library/README.md).

## Superficie distribuible

Las mismas skills se publican en [`skills/`](../../skills/README.md) con el formato abierto Agent Skills. Esa carpeta es una proyección generada: la fuente sigue siendo el Markdown del dominio.

- Regenerar: `npm run build:skills`.
- Verificar: la puerta de calidad falla si la proyección difiere de su fuente.
- Contrato del formato: [checklist de conformidad](../../library/domains/ai-agent-engineering/checklists/agent-skills-conformance.checklist.md).
- Confianza antes de adoptar una skill ajena: [checklist OWASP Agentic Skills Top 10](../../library/domains/agent-supply-chain/checklists/owasp-agentic-skills-top-10.checklist.md).
