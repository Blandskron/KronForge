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

## Matriz

| Agente o familia | Archivo específico presente | Uso recomendado | Estado verificable |
|---|---|---|---|
| Claude | [`CLAUDE.md`](../CLAUDE.md) | Entregar el núcleo y usar el adaptador solo para orientación breve | Adaptador mantenido; autodetección no garantizada |
| Gemini | [`GEMINI.md`](../GEMINI.md) | Entregar el núcleo y usar el adaptador solo para orientación breve | Adaptador mantenido; autodetección no garantizada |
| GitHub Copilot | [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) | Usar las instrucciones del repositorio junto al núcleo enlazado | Archivo presente; comportamiento depende del producto |
| Codex | `AGENTS.md` | Proporcionar acceso al repositorio y exigir lectura del núcleo | Compatible por contrato Markdown; descubrimiento depende del entorno |
| GPT o ChatGPT | Ninguno | Adjuntar o pegar `AGENTS.md` y el activo seleccionado | Uso manual documentado |
| Cursor | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Aider | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| OpenHands | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Roo Code | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Windsurf | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Cline | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Continue | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Amazon Q | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Qodo | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Kiro | Ninguno | Entregar explícitamente el núcleo en contexto | Sin adaptador nativo verificado |
| Otro agente basado en Markdown | Ninguno | Proporcionar `AGENTS.md`, contexto local y el activo necesario | Compatible si acepta el contenido; capacidades no garantizadas |

La ausencia de un adaptador no significa incompatibilidad. Evita crear archivos específicos hasta confirmar que aportan descubrimiento o comportamiento real.

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
