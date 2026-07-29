# Estándares de Documentación

## Propósito

Estas reglas mantienen el framework legible, reusable y verificable para personas y agentes. Aplican a Markdown, políticas, ejemplos, adaptadores y contenido presentado por el portal.

Los contratos especializados de activos viven en [CONTRIBUTING_ASSETS.md](CONTRIBUTING_ASSETS.md).

## Audiencia y fuente canónica

- `README.md` orienta a personas.
- `AGENTS.md` define el contrato operativo común para agentes.
- `docs/agent/` documenta operación, permisos, pruebas, seguridad y configuración del repositorio.
- `library/` contiene los activos canónicos.
- `library/catalog.json` es el índice estructurado del catálogo.
- El portal presenta Markdown y catálogo canónicos; no debe convertirse en una segunda fuente de verdad.
- Los adaptadores de herramientas solo documentan diferencias reales y enlazan al núcleo común.

Cuando dos documentos puedan ser canónicos para la misma regla, se debe elegir uno y convertir los demás en índices o enlaces breves.

## Lenguaje y estilo

- Usa español claro como idioma principal del repositorio.
- Conserva términos técnicos ampliamente reconocidos cuando una traducción reduzca precisión.
- Define siglas y conceptos especializados en su primera aparición.
- Prefiere frases directas, encabezados descriptivos y listas acotadas.
- Separa hechos observados, decisiones, inferencias y pendientes.
- No presentes aspiraciones como capacidades implementadas.
- Evita superlativos, afirmaciones de compatibilidad total y métricas sin evidencia.

## Estructura Markdown

- Un solo título `#` por documento.
- Jerarquía de encabezados incremental, sin saltos innecesarios.
- Bloques de código con lenguaje cuando se conozca y cercas correctamente cerradas.
- Tablas solo cuando faciliten una comparación; deben tener encabezados claros.
- Enlaces relativos para archivos del repositorio y URLs absolutas para recursos externos.
- Texto descriptivo en enlaces; evita “haz clic aquí”.
- Fechas en formato `YYYY-MM-DD`.
- Rutas, IDs, campos y comandos entre backticks.

No documentes un comando como ejecutable si no existe o no fue verificado en el repositorio.

## Accesibilidad

- Toda imagen informativa debe tener texto alternativo útil.
- No dependas únicamente del color, iconos o emojis para comunicar estado.
- Usa etiquetas comprensibles para controles y enlaces.
- Mantén párrafos, listas y tablas utilizables en pantallas estrechas.
- Evita diagramas cuando una explicación lineal sea más accesible.

## Nombres y rutas

- Usa `kebab-case` ASCII para nuevas rutas generales, salvo convenciones reconocidas como `README.md`, `AGENTS.md`, `SKILL.md` o archivos comunitarios de GitHub.
- Los nombres deben describir resultado o responsabilidad, no una herramienta de moda.
- Conserva rutas públicas estables. Un cambio requiere la política de compatibilidad y deprecación de [`PROMPT_VERSIONING.md`](../PROMPT_VERSIONING.md).
- No crees carpetas vacías ni archivos para aparentar cobertura.

## Contenido ejecutable y ejemplos

Prompts, skills, playbooks, hooks y ejemplos deben:

- leer evidencia antes de modificar;
- declarar entradas, restricciones, salida y límites;
- exigir plan antes de cambios relevantes;
- no relajar pruebas o seguridad;
- no incluir secretos, datos personales o credenciales reales;
- distinguir comandos ilustrativos de comandos verificados;
- conservar control humano en acciones sensibles.

## Enlaces y referencias

- Verifica que cada enlace interno resuelva desde el documento que lo contiene.
- Verifica anclas cuando enlaces una sección.
- Prioriza fuentes primarias para afirmaciones normativas o técnicas.
- Registra fecha de revisión cuando una referencia externa pueda cambiar.
- No copies documentación externa extensa; resume y enlaza.

## Metadatos e índices

Los activos deben cumplir el schema vigente y mantener alineados:

1. front matter del archivo;
2. índice del dominio;
3. `library/catalog.json`;
4. relaciones por ID;
5. versión y estado.

No inventes autoría, licencia, compatibilidad, fecha de revisión o soporte de agentes. Usa un pendiente explícito cuando la información requiera decisión humana.

## Cambios y trazabilidad

Actualiza, según impacto:

- changelog para cambios notables;
- versión del activo y framework;
- roadmap cuando cambie una entrega;
- ADR para decisiones estructurales;
- runbook y pruebas para cambios operativos;
- README o navegación para cambios en la experiencia pública.

La política de lifecycle está en [`PROMPT_VERSIONING.md`](../PROMPT_VERSIONING.md) y la revisión de cierre en [QUALITY_GATES.md](QUALITY_GATES.md).
