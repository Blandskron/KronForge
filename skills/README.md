# Skills distribuibles

Superficie generada en el formato abierto Agent Skills para que un cliente compatible pueda
descubrir y cargar estas skills sin conocer la estructura interna del repositorio.

| Skill | Activo canónico |
|---|---|
| [`documentation-audit`](documentation-audit/SKILL.md) | [`library/domains/documentation-knowledge/skills/documentation-audit/SKILL.md`](../library/domains/documentation-knowledge/skills/documentation-audit/SKILL.md) |
| [`github-pages-release`](github-pages-release/SKILL.md) | [`library/domains/delivery-platform/skills/github-pages-release/SKILL.md`](../library/domains/delivery-platform/skills/github-pages-release/SKILL.md) |
| [`prompt-update`](prompt-update/SKILL.md) | [`library/domains/ai-agent-engineering/skills/prompt-update/SKILL.md`](../library/domains/ai-agent-engineering/skills/prompt-update/SKILL.md) |
| [`safe-refactoring`](safe-refactoring/SKILL.md) | [`library/domains/software-development/skills/safe-refactoring/SKILL.md`](../library/domains/software-development/skills/safe-refactoring/SKILL.md) |
| [`structured-code-review`](structured-code-review/SKILL.md) | [`library/domains/quality-engineering/skills/structured-code-review/SKILL.md`](../library/domains/quality-engineering/skills/structured-code-review/SKILL.md) |
| [`systematic-debugging`](systematic-debugging/SKILL.md) | [`library/domains/software-development/skills/systematic-debugging/SKILL.md`](../library/domains/software-development/skills/systematic-debugging/SKILL.md) |
| [`test-driven-development`](test-driven-development/SKILL.md) | [`library/domains/quality-engineering/skills/test-driven-development/SKILL.md`](../library/domains/quality-engineering/skills/test-driven-development/SKILL.md) |

## Contrato

- La fuente de verdad es el Markdown de `library/domains/<dominio>/skills/`.
- Este directorio se regenera con `npm run build:skills` y se compromete en Git.
- `npm run validate` falla si la proyección difiere de su fuente.
- El front matter aquí contiene solo campos del formato abierto; los metadatos del
  repositorio viajan en `metadata`.

Antes de adoptar una skill de este o de cualquier otro repositorio, aplica la
[checklist OWASP Agentic Skills Top 10](../library/domains/agent-supply-chain/checklists/owasp-agentic-skills-top-10.checklist.md)
y la [checklist de conformidad](../library/domains/ai-agent-engineering/checklists/agent-skills-conformance.checklist.md).
