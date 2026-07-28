# Context Engineering

Diseño del contexto que humanos y agentes necesitan para decidir y ejecutar con precisión. Incluye fuentes, selección, routing, compresión, memoria, retrieval y presupuestos de contexto.

## Mapa del dominio

1. **Fuentes:** repositorio, conversación, herramientas, memoria y sistemas de conocimiento.
2. **Selección:** relevancia, permisos, vigencia y alcance.
3. **Transformación:** normalización, resumen, chunking y compresión.
4. **Entrega:** orden, formato, ventana, presupuesto y validación.

## Activos

- Architecture note: [capas de contexto](architecture-notes/context-layers.architecture-note.md)
- Pattern: [contexto progresivo](patterns/progressive-context.pattern.md)

## Ruta de aprendizaje

Empieza por las capas de contexto. Aplica después contexto progresivo para evitar cargar información detallada antes de que la tarea la necesite.

## Límites

La memoria y coordinación de múltiples agentes pertenecen también a [ingeniería de IA y agentes](../ai-agent-engineering/README.md). La organización física del repositorio pertenece a [repository engineering](../repository-engineering/README.md).
