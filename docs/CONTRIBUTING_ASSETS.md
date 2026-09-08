# Contribuir Activos a la Biblioteca

## Antes de crear

1. Busca objetivos equivalentes en [`library/catalog.json`](../library/catalog.json).
2. Elige un dominio por la capacidad principal, no por una herramienta concreta.
3. Justifica por qué un enlace a un activo existente no resuelve el caso.
4. Confirma que el tipo existe en `typeDefinitions` de [`library/catalog.json`](../library/catalog.json).
5. Lee el [JSON Schema del catálogo v3](../library/schema/catalog-v3.schema.json) y el contrato editorial aplicable.

## Metadatos obligatorios

```yaml
---
id: domain.unique-slug
title: Título humano
summary: Resultado concreto en una frase.
type: prompt
category: execution
domain: domain
status: draft
version: 0.1.0
level: foundation
difficulty: foundation
projects: [any]
compatibility: model-agnostic
models: [any]
agents: [markdown-compatible]
language: es
author: "@usuario"
license: MIT
lastModified: YYYY-MM-DD
tags: [tag]
dependencies: []
related: []
inputs: []
outputs: []
examples: []
estimatedTime: null
complexity: null
useCases: []
---
```

- `id` debe ser único y estable.
- `title` es el nombre humano y `summary` es la descripción breve; no agregues aliases `name` o `description` salvo que el formato del tipo los exija, como ocurre con `SKILL.md`.
- `type` debe ser un ID de `typeDefinitions`.
- `category` debe coincidir con la categoría declarada por el tipo.
- `status` puede ser `draft`, `stable` o `deprecated`.
- `version` sigue SemVer.
- `level` y `difficulty` pueden ser `foundation`, `intermediate` o `advanced`. Durante schema v3 ambos se conservan por compatibilidad y deben coincidir.
- `projects` describe alcances aplicables sin asumir un stack.
- `compatibility` expresa el contrato general; las integraciones concretas se aíslan.
- `models: [any]` declara compatibilidad agnóstica.
- `agents: [markdown-compatible]` declara que el activo funciona con agentes capaces de leer Markdown; un agente concreto solo se agrega cuando existe evidencia.
- `language` usa una etiqueta de idioma; la biblioteca actual usa `es`.
- `author`, `license` y `lastModified` deben ser verificables. La licencia predeterminada del repositorio es `MIT`.
- `dependencies` contiene IDs necesarios para aplicar el activo.
- `related` contiene IDs existentes y relaciones útiles.
- `protocol` es obligatorio para el tipo `protocol` y está prohibido en cualquier otro tipo. Declara `code` (`AFP-NNN`), `maturity`, `actors`, `dependsOn`, `observedIn` y `lastValidated`. Ver [ADR-0006](adr/ADR-0006-protocol-asset-type.md).
- `specRefs` es obligatorio cuando el activo afirma algo sobre una especificación o publicación externa, y se omite cuando no lo hace. Cada entrada declara `spec`, `url` y `verified`, más `version` si la fuente la publica. La puerta de calidad advierte a los 90 días y falla a los 180 sin re-verificar. Ver [frescura verificable](SPEC_FRESHNESS.md).
- `inputs`, `outputs`, `examples` y `useCases` son listas de descriptores breves.
- `estimatedTime` expresa minutos enteros o `null`.
- `complexity` puede ser `low`, `medium`, `high` o `null`; no es un alias de `level`.
- Usa arrays vacíos y `null` cuando el dato no esté declarado. No deduzcas contratos, tiempos ni compatibilidades desde prosa libre.

## Fuente canónica y catálogo materializado

El Markdown es la fuente canónica del activo. [`library/catalog.json`](../library/catalog.json) materializa los metadatos efectivos para consumo estático:

1. Conserva exactamente ID, título, resumen, tipo, dominio, estado, versión, dificultad, proyectos, compatibilidad, modelos, tags y relaciones declarados por el activo.
2. Materializa los defaults verificables del repositorio cuando corresponda.
3. Declara la ruta relativa desde `library/`.
4. Mantiene vacíos o nulos los campos contractuales no declarados.

Todo cambio en el catálogo o en una skill debe regenerar las superficies con `npm run build`. Ni `skills/` ni `llms.txt` se editan a mano y la puerta de calidad falla si divergen de su fuente.

Al contribuir, actualiza el activo, su registro del catálogo y el índice del dominio en el mismo cambio. El catálogo debe seguir cumpliendo [`catalog-v3.schema.json`](../library/schema/catalog-v3.schema.json); el schema valida forma y vocabularios, mientras que la revisión también debe comprobar unicidad, existencia de rutas y referencias entre IDs.

## Contribuir un protocolo

Un activo de tipo `protocol` describe un ciclo de vida normativo multi-actor. Antes de escribir uno, confirma que no puede expresarse como `playbook` —un procedimiento de un actor— ni como `pattern` —una solución sin ciclo de vida—.

Reglas adicionales que la puerta de calidad verifica:

1. **Cuatro secciones obligatorias:** `## Actores`, `## Ciclo de vida`, `## Evidencia y límites` y `## Qué no afirma este protocolo`.
2. **Madurez coherente con la evidencia.** Un escalón por encima de `proposed` exige `observedIn` no vacío. Publicar una propuesta como práctica validada es el fallo que la escala existe para impedir.
3. **Grafo acíclico.** `dependsOn` referencia códigos existentes y el grafo resultante no puede contener ciclos.
4. **Frescura de madurez.** `lastValidated` es la fecha de la última reevaluación, no la de la última edición. Advertencia a los 180 días, error a los 365.
5. **Neutralidad de proveedor.** El cuerpo normativo no menciona proveedores, modelos ni proyectos concretos. Ese nombre solo cabe en `## Evidencia y límites`, donde nombrar la fuente es obligatorio, y en `## Adaptadores no normativos`.
6. **Código estable.** `AFP-NNN` no se reutiliza cuando un protocolo se retira.

Usa la [plantilla de protocolo](../library/domains/engineering-protocols/templates/protocol.template.md) y lee [AFP-000](../library/domains/engineering-protocols/protocols/protocol-maturity.protocol.md) antes de declarar una madurez.

No agregues un tipo nuevo directamente a un activo. Una ampliación de `typeDefinitions` es una decisión estructural, requiere contrato editorial y debe registrarse mediante un ADR en la tarea que la autorice.

## Rutas de aprendizaje

Una ruta de `learningPaths`:

- usa únicamente IDs existentes;
- ordena los activos de introducción a aplicación;
- declara `status` y una cobertura honesta;
- no copia el contenido de los activos;
- se actualiza o degrada su cobertura cuando cambia alguno de sus pasos.

## Reglas de calidad

- Lee antes de modificar y no inventes comandos, arquitectura ni resultados.
- Mantén el activo agnóstico al modelo; limita tecnologías concretas al alcance declarado.
- Declara entradas, restricciones, salida y evidencia cuando el activo sea ejecutable.
- Los prompts deben declarar objetivo, contexto, entradas, salida, dificultad, proyectos, compatibilidad, buenas prácticas y ejemplo.
- Las skills deben declarar problema, dependencias, casos de uso y ejemplo además de su procedimiento.
- Enlaza contenido común en lugar de copiarlo.
- Usa ejemplos mínimos y seguros, sin secretos ni datos reales.
- No relajes pruebas o controles de seguridad para conseguir un resultado positivo.
- Agrega el activo al índice del dominio y a `library/catalog.json`.
- Registra cambios semánticos en `docs/CHANGELOG.md`.

## Revisión

- [ ] Nombre y ruta siguen las convenciones.
- [ ] Metadatos completos e ID único.
- [ ] Tipo, categoría, nivel, dificultad, proyectos y compatibilidad declarados.
- [ ] Autoría, licencia, idioma y fecha verificables.
- [ ] Dependencias y relaciones apuntan a IDs existentes.
- [ ] Contratos desconocidos permanecen vacíos o nulos; no fueron inferidos.
- [ ] Valor reutilizable demostrado.
- [ ] Sin duplicidad sustancial.
- [ ] Enlaces internos válidos.
- [ ] Markdown válido y bloques cerrados.
- [ ] Catálogo compatible con JSON Schema draft 2020-12.
- [ ] Rutas de aprendizaje siguen usando únicamente IDs existentes.
- [ ] Si es un protocolo: secciones obligatorias, madurez sostenida por `observedIn`, grafo acíclico y cuerpo normativo neutral.
- [ ] Índices, sitio y changelog actualizados cuando aplica.
- [ ] Validaciones de `docs/agent/TESTS.md` ejecutadas.

## Deprecación

No borres un activo estable sin una transición. Marca `status: deprecated`, explica el reemplazo, actualiza relacionados e índices y deja la eliminación para una versión mayor cuando rompa rutas públicas.
