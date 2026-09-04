# Skills distribuibles

Superficie generada en el formato abierto Agent Skills para que un cliente compatible pueda
descubrir y cargar estas skills sin conocer la estructura interna del repositorio.

| Skill | Activo canónico |
|---|---|
| [`documentation-audit`](documentation-audit/SKILL.md) | [`library/domains/documentation-knowledge/skills/documentation-audit/SKILL.md`](../library/domains/documentation-knowledge/skills/documentation-audit/SKILL.md) |
| [`github-pages-release`](github-pages-release/SKILL.md) | [`library/domains/delivery-platform/skills/github-pages-release/SKILL.md`](../library/domains/delivery-platform/skills/github-pages-release/SKILL.md) |
| [`prompt-update`](prompt-update/SKILL.md) | [`library/domains/ai-agent-engineering/skills/prompt-update/SKILL.md`](../library/domains/ai-agent-engineering/skills/prompt-update/SKILL.md) |

## Contrato

- La fuente de verdad es el Markdown de `library/domains/<dominio>/skills/`.
- Este directorio se regenera con `npm run build:skills` y se compromete en Git.
- `npm run validate` falla si la proyección difiere de su fuente.
- El front matter aquí contiene solo campos del formato abierto; los metadatos del
  repositorio viajan en `metadata`.

Antes de adoptar una skill de este o de cualquier otro repositorio, aplica la
[checklist OWASP Agentic Skills Top 10](../library/domains/agent-supply-chain/checklists/owasp-agentic-skills-top-10.checklist.md)
y la [checklist de conformidad](../library/domains/ai-agent-engineering/checklists/agent-skills-conformance.checklist.md).
