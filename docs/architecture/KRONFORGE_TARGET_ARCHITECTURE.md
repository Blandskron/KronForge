# Arquitectura objetivo de KronForge

**Estado** Propuesta para revisión. Base en la [arquitectura v3](FRAMEWORK_ARCHITECTURE.md) y los [hallazgos de auditoría](../audits/KRONFORGE_EVOLUTION_AUDIT.md).

La biblioteca sigue siendo utilizable por una persona o un agente con acceso a Markdown. Un **pack** reúne una selección versionada de activos para un resultado concreto. Un **perfil** selecciona capacidades y requisitos del proyecto consumidor. Un **adaptador** traduce esa selección a la superficie de una herramienta concreta. Un **validador** comprueba una condición observable. Un **gate** decide si se puede avanzar sobre la base de esas comprobaciones y las aprobaciones exigidas.

## Responsabilidades por capa

| Capa vigente | Evolución propuesta |
|---|---|
| Orientación | README, AGENTS.md, prompt maestro y una guía por pack. Cada guía empieza por cuándo usarlo, requisitos, diff esperado, permisos, verificación y recuperación. |
| Protocolo | Reusar AFP para estado, delegación, evidencia, conformidad, revisión y publicación. El criterio de madurez permanece en AFP-000. |
| Conocimiento | Mantener documentos canónicos por dominio. Las políticas describen restricciones del proyecto y los patrones explican decisiones. Cada regla ejecutada referencia una fuente de autoridad. |
| Ejecución | Prompts para auditoría guiada, skills para tareas recurrentes, workflows para secuencia y responsables, templates para resultados, scripts para comprobaciones deterministas y hooks optativos para feedback temprano. Evaluaciones miden comportamiento y benchmarks comparan alternativas con un método reproducible. |
| Gobernanza | Ownership, SemVer, deprecación, canal de seguridad y decisión humana de publicar. Cada pack define sus mantenedores, alcance de soporte y política de confianza. |
| Presentación | Catálogo v3 y portal mantienen descubrimiento, copia, descarga y URLs. Una futura vista de packs se alimenta de manifiestos públicos versionados. Los perfiles del consumidor y sus resultados privados quedan en su proyecto. |
| Automatización | Reusar validadores y proyecciones. Generar entregables autocontenidos desde fuentes canónicas, validar su hash y probar el consumo real. Los adaptadores de CI invocan las mismas comprobaciones que la ruta manual. |

## Fuentes de autoridad y distribución

1. Los activos canónicos permanecen en `library/domains/`. Cada pack referencia IDs y versiones exactas a partir de un snapshot. El manifiesto aporta los datos que solo existen al componer el pack, como selección, mapeos y permisos. El catálogo conserva sus campos editoriales y el portal conserva el Markdown canónico.
2. El primer artefacto es un archivo portable que se puede inspeccionar y aplicar manualmente desde un release verificable. El plan registra exactamente qué se instalará. Los archivos operativos del pack quedan autocontenidos. Una cita externa puede perder verificabilidad sin impedir la operación local.
3. Para skills destinadas a hosts compatibles, una exportación optativa usa Agent Skills y Agent Plugins 1.0.0. Los marketplaces y herramientas de instalación son canales. Una exportación debe declarar qué conserva y qué omite. Una omisión que afecte a un gate obligatorio bloquea la afirmación de equivalencia.
4. Las reglas del consumidor, los permisos del host y las aprobaciones humanas gobiernan cada ejecución. Una instrucción del pack puede solicitar acciones dentro de este marco. El instalador materializa contenido y permanece separado de su activación. CI, hooks, MCP, permisos de red y credenciales se habilitan mediante decisiones explícitas del proyecto.

## Recorrido de adopción

| Paso | Resultado observable |
|---|---|
| Copiar y pegar | El equipo identifica el perfil, la versión exacta y el artefacto, lee la guía y escoge entre consumo documental o instalación gestionada. |
| Auditar | Se inspeccionan reglas del repo, requisitos, colisiones, permisos y cambios propuestos. Se muestran las diferencias y el método de recuperación. |
| Aprobar | El dueño del proyecto aprueba el plan concreto. Cualquier ampliación de privilegios o cambio de bytes requiere otro plan. |
| Aplicar | Se instala la selección y se verifica el estado. El equipo decide qué hooks, jobs y conectores activar después. |
| Verificar | Un consumidor puede producir el resultado esperado, repetir instalación, detectar deriva y recuperar el estado. El gate conserva evidencia del artefacto y del entorno exactos. |

## CLI opcional

Comparar tres caminos en el piloto. La guía y Git cubren inspección y revisión de diffs con mínima carga de mantenimiento. Los instaladores de skills y plugins cubren destinos nativos cuando el cliente los soporta. Un script del repositorio puede comprobar invariantes repetitivas de un pack. Solo vale abrir un RFC de CLI si al menos dos consumidores independientes registran la misma fricción en varios ciclos y el script o los canales existentes dejan una brecha medible.

Una futura CLI sería un cliente del [contrato de packs](KRONFORGE_PACK_CONTRACTS.md). Empezaría por inspección, plan y verificación. La aplicación, actualización y retiro llegarían después de probar recuperación y equivalencia con el proceso documentado. Sus límites serían el repositorio elegido, una versión explícita y el conjunto de archivos gestionados. El piloto debe seguir funcionando sin una CLI de KronForge, una cuenta externa, una extensión propietaria o un servicio de KronForge.
