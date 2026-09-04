# Lifecycle, Versionado y Compatibilidad

Este documento es la política canónica para versionar, deprecar, mantener compatibilidad y publicar releases del framework, el catálogo, el prompt maestro y los activos.

## Superficies versionadas

| Superficie | Identificador | Fuente |
|---|---|---|
| Framework | `MAJOR.MINOR.PATCH` | `library/catalog.json.frameworkVersion` |
| Schema del catálogo | entero incremental | `library/catalog.json.schemaVersion` |
| Activo | `MAJOR.MINOR.PATCH` | front matter canónico |
| Prompt maestro | `MAJOR.MINOR.PATCH` | metadatos y changelog |

La versión global debe coincidir en catálogo, portal, changelog y cualquier texto visible de release. El schema avanza de manera independiente.

## Versionado semántico

### MAJOR

Cambio incompatible en contratos, rutas públicas, IDs estables, schema o comportamiento obligatorio.

Ejemplos:

- retirar una fase de aprobación;
- reinterpretar entradas o salidas;
- cambiar el significado de campos existentes;
- eliminar activos estables sin transición;
- reorganizar rutas públicas sin migración.

### MINOR

Capacidad nueva compatible.

Ejemplos:

- agregar un activo, dominio o tipo;
- añadir campos opcionales con valores por defecto claros;
- incorporar validaciones o salidas opcionales;
- ampliar el portal sin romper rutas.

### PATCH

Corrección compatible que no cambia el contrato.

Ejemplos:

- reparar enlaces o navegación;
- corregir redacción o accesibilidad;
- ajustar presentación sin alterar contenido canónico;
- precisar una regla sin agregar obligaciones.

La versión de un activo puede avanzar sin modificar la de todos los demás. La versión global cambia cuando una release publica el conjunto.

## Estados y madurez

- `draft`: en diseño; puede cambiar sin garantía de compatibilidad.
- `stable`: apto para reutilización y protegido por esta política.
- `deprecated`: disponible durante la transición y con reemplazo documentado.

Un estado no sustituye la versión ni la evidencia de validación.

## Política de compatibilidad

Son superficies estables:

- ruta del prompt maestro;
- IDs y rutas de activos `stable`;
- campos existentes del schema publicado;
- hashes y rutas públicas documentadas del portal;
- contratos obligatorios de prompts, skills y políticas.

Un cambio incompatible requiere:

1. justificación y alternativas;
2. ADR cuando sea estructural;
3. incremento MAJOR;
4. guía de migración;
5. actualización coordinada de catálogo, índices, portal y documentación;
6. aprobación del owner.

La compatibilidad de contenido con un agente no garantiza autodetección, permisos ni comportamiento de una herramienta. Consulta [`docs/AGENT_COMPATIBILITY.md`](docs/AGENT_COMPATIBILITY.md).

## Política de deprecación

1. Cambia el estado a `deprecated`.
2. Documenta motivo, reemplazo y pasos de migración.
3. Actualiza `related`, índices, catálogo y changelog.
4. Conserva ID y ruta durante al menos una release MINOR posterior.
5. Retira la superficie en una release MAJOR.

Una retirada urgente por riesgo legal o de seguridad requiere decisión explícita del owner, alternativa segura cuando sea posible y registro público sin divulgar detalles sensibles.

No existe una garantía temporal en días porque el proyecto no tiene cadencia fija. La ventana se mide en releases.

## Política de releases

El owner listado en [`MAINTAINERS.md`](MAINTAINERS.md) autoriza la release. La preparación puede delegarse; la publicación no se presume autorizada.

### Preparación

1. Define alcance y versión.
2. Verifica [Quality Gates](docs/QUALITY_GATES.md).
3. Sincroniza `frameworkVersion`, versiones de activos, portal y documentación.
4. Mueve cambios desde `[Unreleased]` a una sección fechada del changelog.
5. Confirma migraciones, deprecaciones, ADR y roadmap aplicables.
6. Revisa el diff final y obtiene aprobaciones sensibles.

### Publicación

1. Integra el cambio aprobado en la rama predeterminada.
2. Crea el tag `vMAJOR.MINOR.PATCH` sobre el commit aprobado.
3. Verifica GitHub Pages y los activos públicos por HTTP.
4. Si se publica una GitHub Release, deriva sus notas del changelog; no mantengas dos historiales divergentes.

Las versiones históricas sin tag permanecen como registro documental, pero no establecen por sí solas un precedente para futuras releases.

`v3.2.0` es la primera release etiquetada del framework. Las versiones anteriores están descritas en [`docs/CHANGELOG.md`](docs/CHANGELOG.md) y siguen siendo registro documental sin tag.

### Corrección o rollback

Si una release rompe navegación, seguridad o contenido canónico:

- detén promoción adicional;
- documenta el impacto;
- revierte de forma segura o publica un PATCH;
- no reescribas tags o historial remoto sin aprobación explícita.

## Ventana de soporte

La última release estable recibe correcciones. No existe LTS ni soporte garantizado para líneas anteriores salvo declaración explícita en el changelog y `SECURITY.md`.

## Proceso de cambio de un activo

1. Lee el activo, relacionados y reglas del dominio.
2. Clasifica el cambio y su compatibilidad.
3. Actualiza contenido, estado y versión.
4. Alinea índice, catálogo y relaciones.
5. Registra el cambio notable.
6. Ejecuta las validaciones reales.
7. Incluye el activo en una release solo tras la decisión correspondiente.

## Prompt maestro

`prompts/agents-first-documentation-review.prompt.md` conserva una ruta estable. Cambios en reglas siguen SemVer y requieren changelog. Eliminarlo, moverlo sin transición o relajar lectura, planificación, seguridad o aprobación es MAJOR y requiere aprobación humana.
