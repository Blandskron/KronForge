# Context Engineering

Diseño del contexto que humanos y agentes necesitan para decidir y ejecutar con precisión. Incluye fuentes, selección, routing, compresión, memoria, retrieval y presupuestos de contexto.

## Mapa del dominio

1. **Fuentes:** repositorio, conversación, herramientas, memoria y sistemas de conocimiento.
2. **Selección:** relevancia, permisos, vigencia y alcance.
3. **Transformación:** normalización, resumen, chunking y compresión.
4. **Entrega:** orden, formato, ventana, presupuesto y validación.
5. **Horizonte largo:** compactación, estado persistente y recuperación bajo demanda cuando la tarea supera una ventana.

## Activos

- Architecture note: [capas de contexto](architecture-notes/context-layers.architecture-note.md)
- Pattern: [contexto progresivo](patterns/progressive-context.pattern.md)
- Pattern: [recuperación bajo demanda](patterns/just-in-time-retrieval.pattern.md)
- Pattern: [compactación de contexto](patterns/context-compaction.pattern.md)
- Pattern: [notas persistentes](patterns/persistent-notes.pattern.md)
- Pattern: [enrutamiento de contexto por presupuesto de tokens](patterns/token-budget-context-routing.pattern.md)
- Template: [memoria persistente del proyecto](templates/project-memory.template.md)

## Ruta de aprendizaje

Empieza por las capas de contexto. Aplica después contexto progresivo para evitar cargar información detallada antes de que la tarea la necesite, y recuperación bajo demanda para sustituir contenido por identificadores.

Cuando la tarea supere una sola ventana, entran los dos patrones de horizonte largo: compactación para sostener el hilo y notas persistentes para lo que debe sobrevivir con certeza a esa compactación.

## Límites

La memoria y coordinación de múltiples agentes pertenecen también a [ingeniería de IA y agentes](../ai-agent-engineering/README.md). La organización física del repositorio pertenece a [repository engineering](../repository-engineering/README.md).
