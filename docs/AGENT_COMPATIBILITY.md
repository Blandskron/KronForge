# Compatibilidad con Agentes

## Alcance de la compatibilidad

El contenido del framework es Markdown, agnóstico al modelo y utilizable por cualquier agente capaz de recibir archivos o texto como contexto.

Esto **no garantiza** que una herramienta:

- descubra automáticamente un archivo;
- soporte todas las instrucciones o formatos;
- tenga permisos para leer, escribir, navegar o ejecutar comandos;
- conserve el mismo comportamiento entre versiones.

La compatibilidad es de contenido y contrato. La integración efectiva depende de la herramienta, su versión y la forma en que el usuario le entrega contexto.

## Núcleo canónico

1. [`AGENTS.md`](../AGENTS.md): reglas operativas del repositorio.
2. [`README.md`](../README.md): entrada humana y mapa del producto.
3. [Prompt maestro](../prompts/agents-first-documentation-review.prompt.md): auditoría y evolución de repositorios.
4. [`library/catalog.json`](../library/catalog.json): descubrimiento estructurado.
5. [`docs/agent/`](agent/): permisos, pruebas, runbook, seguridad y configuración.

Un adaptador nunca puede relajar este núcleo.

## Gobernanza de los estándares que este repositorio usa

Dos de los formatos que el framework consume dejaron de pertenecer a un proveedor:

- `AGENTS.md` y Model Context Protocol se donaron a la **Agentic AI Foundation**, una fundación de la Linux Foundation con gobernanza neutral y comité técnico.
- El formato **Agent Skills**, desarrollado originalmente por Anthropic, se liberó como estándar abierto y hoy lo implementan decenas de clientes.

Esto cambia el criterio del framework: apoyarse en estos formatos ya no es apostar por el roadmap de una empresa. Sigue siendo obligatorio declarar la versión consultada y su fecha de verificación mediante [`specRefs`](SPEC_FRESHNESS.md).

> [!NOTE]
> Las afirmaciones de esta sección y de la matriz se verificaron el 2026-09-03 contra las fuentes enlazadas al final. Vuelve a comprobarlas antes de tratarlas como vigentes.

## Matriz

`Skills` indica que el producto aparece como cliente del formato abierto en el catálogo oficial del estándar. No dice desde qué rutas carga skills ni con qué permisos las ejecuta: eso lo define cada producto y debe comprobarse en su documentación.

| Agente o familia | Archivo específico presente | Skills | Uso recomendado |
|---|---|---|---|
| Claude y Claude Code | [`CLAUDE.md`](../CLAUDE.md) | sí | Entregar el núcleo; el adaptador solo aporta orientación breve |
| Gemini CLI | [`GEMINI.md`](../GEMINI.md) | sí | Entregar el núcleo; el adaptador solo aporta orientación breve |
| GitHub Copilot y VS Code | [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) | sí | Usar las instrucciones del repositorio junto al núcleo enlazado |
| ChatGPT y Codex | `AGENTS.md` | sí | Proporcionar acceso al repositorio y exigir lectura del núcleo |
| Cursor | Ninguno | sí | Entregar explícitamente el núcleo en contexto |
| OpenHands | Ninguno | sí | Entregar explícitamente el núcleo en contexto |
| Roo Code | Ninguno | sí | Entregar explícitamente el núcleo en contexto |
| Kiro | Ninguno | sí | Entregar explícitamente el núcleo en contexto |
| Qodo | Ninguno | sí | Entregar explícitamente el núcleo en contexto |
| goose | Ninguno | sí | Entregar explícitamente el núcleo en contexto |
| Aider | Ninguno | no verificado | Entregar explícitamente el núcleo en contexto |
| Windsurf | Ninguno | no verificado | Entregar explícitamente el núcleo en contexto |
| Cline | Ninguno | no verificado | Entregar explícitamente el núcleo en contexto |
| Continue | Ninguno | no verificado | Entregar explícitamente el núcleo en contexto |
| Amazon Q | Ninguno | no verificado | Entregar explícitamente el núcleo en contexto |
| Otro agente basado en Markdown | Ninguno | no verificado | Proporcionar `AGENTS.md`, contexto local y el activo necesario |

`no verificado` significa que no se comprobó, no que sea incompatible. El núcleo sigue siendo utilizable por copia o acceso al repositorio en cualquiera de los casos.

La ausencia de un adaptador no significa incompatibilidad. Evita crear archivos específicos hasta confirmar que aportan descubrimiento o comportamiento real.

## Skills distribuibles

Los clientes marcados con `sí` pueden cargar las skills de este repositorio desde [`skills/`](../skills/README.md), que se publica en el formato abierto. Antes de adoptar cualquier skill —de este repositorio o de otro— aplica la [checklist OWASP Agentic Skills Top 10](../library/domains/agent-supply-chain/checklists/owasp-agentic-skills-top-10.checklist.md): cargar una skill concede autoridad sobre el procedimiento del agente.

## Fuentes

- [Agent Skills, catálogo de clientes](https://agentskills.io/clients), verificado el 2026-09-03.
- [Especificación Agent Skills](https://agentskills.io/specification), verificada el 2026-09-03.
- [Formación de la Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), verificada el 2026-09-03.

## Política de adaptadores

Un adaptador nuevo debe:

- corresponder a una convención verificada de la herramienta;
- enlazar al núcleo en lugar de copiarlo;
- contener solo diferencias necesarias;
- declarar límites y no prometer autodetección;
- evitar versiones de modelos o APIs no verificadas;
- tener owner y ruta de revisión.

Cuando una herramienta cambie su convención, actualiza o depreca el adaptador mediante [`PROMPT_VERSIONING.md`](../PROMPT_VERSIONING.md).

## Uso seguro

Independientemente del agente:

- lee antes de modificar;
- detecta comandos y stack reales;
- propone plan antes de cambios relevantes;
- solicita aprobación para acciones sensibles;
- no expone secretos ni relaja pruebas;
- reporta evidencia, límites y pendientes.
