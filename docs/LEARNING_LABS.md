# Prácticas guiadas de KronForge

Trabaja en una copia local con los permisos correspondientes. Usa datos sintéticos para los ejercicios y registra el estado del código antes de ejecutar controles. Las primeras prácticas recorren instrucciones y contexto. Las últimas comprueban un cambio y su entrega.

Continúa con los [tutoriales por dominio](tutorials/README.md) para producir un entregable revisable o con los [casos reproducibles](cases/README.md) para repetir comprobaciones de KronForge.

## 1. Revisar un prompt

Toma una instrucción del [prompt maestro](../prompts/agents-first-documentation-review.prompt.md). Busca el comando o archivo al que remite dentro del repositorio elegido. Reescribe la instrucción para declarar qué evidencia necesita y qué hacer cuando falte. Compara ambas versiones sobre la misma entrada y guarda una nota con la diferencia observada. Usa la [guía de actualización](../skills/prompt-update/SKILL.md) si el cambio afecta a un prompt versionado.

## 2. Delegar a un agente

Elige una tarea de documentación que pueda revisarse por separado. Completa el [contrato de delegación](../library/domains/engineering-protocols/templates/delegation-contract.template.md) con una ruta editable, un criterio de aceptación y un límite de autoridad. Pide al agente que cite la evidencia antes de editar. Entrega el contrato y un registro de lo que el agente propuso o ejecutó.

## 3. Evaluar una integración MCP

Elige una acción de lectura de documentación. Dibuja dónde viven el cliente, el servidor y los datos que procesaría esa acción, con la [referencia de topología](../library/domains/mcp-integration/README.md). Recorre la [lista de comprobación de seguridad](../library/domains/mcp-integration/checklists/mcp-security.checklist.md) y documenta quién autorizaría el acceso, qué se entregaría y qué límites verificarías. El resultado de este ejercicio es el diseño revisable. Las pruebas contra un servidor concreto requieren una ejecución aparte.

## 4. Registrar una decisión de arquitectura

Lee la [decisión sobre catálogo y Markdown](adr/ADR-0002-catalog-v3-projection.md). Identifica una fuente canónica y un consumidor. Describe otra forma de mantenerlos en sincronía y registra su costo de revisión y recuperación ante fallos. Completa una copia de la [plantilla ADR](../library/domains/architecture/templates/adr.template.md) con una señal observable que obligaría a reconsiderar la decisión.

## 5. Verificar un cambio

Completa el [ejercicio reproducible de calidad](learning-quality-example.md). Luego elige un cambio concreto y usa el [prompt de regresión](../library/domains/quality-engineering/prompts/regression-qa.prompt.md) para identificar una comprobación directa y otra de un consumidor. Registra los comandos reales, los resultados y los escenarios pendientes.

## 6. Revisar la autoridad de una skill

Selecciona una skill local cuya procedencia puedas identificar. Enumera los archivos que lee, las herramientas que solicita y las salidas que podría escribir. Aplica el [criterio de privilegio mínimo](../library/domains/agent-supply-chain/README.md). Entrega una decisión de adopción con referencias a instrucciones concretas y las condiciones para reconsiderarla.

## 7. Preparar un sitio para GitHub Pages

Usa la [skill de publicación](../skills/github-pages-release/SKILL.md) y ejecuta `npm run smoke` en KronForge. Selecciona del resultado una ruta de página, un recurso estático y una fuente canónica que deban estar disponibles después del despliegue. Registra las rutas y qué comprobarías en la URL pública. Cierra con una decisión de preparación y la aprobación humana que corresponde al entorno de destino.
