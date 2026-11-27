# Contratos propuestos para packs

**Estado** Borrador de diseño. Los nombres y ejemplos sirven para validar el alcance del piloto. La aprobación del contrato y la implementación pertenecen al [roadmap](../KRONFORGE_EVOLUTION_ROADMAP.md).

El [prototipo local](../KRONFORGE_PACK_PREVIEW.md) usa un schema provisional separado y limita las escrituras a generaciones gestionadas. Fija los hashes de los manifiestos en la solicitud del consumidor y registra las diferencias con este contrato objetivo.

## Superficies y validación

Usar JSON Schema 2020-12 para estructura y reglas semánticas separadas para estados, rutas, grafo, permisos y evidencia. Versionar cada formato con `schemaVersion` entero. Un lector rechaza una versión mayor desconocida antes de escribir. Usar UTF-8, claves únicas y schemas fijados localmente. Rechazar campos desconocidos en contratos de instalación para evitar interpretar una intención parcialmente. [JSON Schema 2020-12](https://json-schema.org/draft/2020-12).

| Superficie | Emisor y contenido mínimo |
|---|---|
| Manifiesto de pack | El mantenedor declara `schemaVersion`, `id`, `version`, `license` SPDX, `source` con origen y commit completo, `assets` con ID y versión, `profiles`, `requires` para packs exactos, `files` con fuente, destino, modo y SHA-256, y `effects` solicitados por fase. Guarda la composición y la procedencia, mientras el catálogo conserva sus propios metadatos. |
| Perfil | Entrada del proyecto o selección de un perfil del pack. Expresa `id`, `files`, `gates`, `requirements` de entorno y capacidades opcionales seleccionadas. El proyecto aporta los comandos comprobados y su política puede restringir efectos. Los perfiles del primer pack comparten la mayoría de los activos. |
| Descriptor de release | `packId`, `version`, `artifact` con ubicación y SHA-256 de los bytes, `manifestSha256` y referencia a prueba de procedencia cuando el canal la exija. Se publica separado del archivo que identifica. |
| Plan y aprobación | `operation`, raíz objetivo, estado base, versiones resueltas, digest de artefactos, perfil y política, precondiciones por ruta, cambios y efectos. La aprobación registra actor, alcance y SHA-256 de los bytes del plan revisado. El propósito es vincular la autorización con la operación exacta. En el piloto puede representarse como datos y un diff revisado en el proyecto local. |
| Lock del consumidor | `schemaVersion`, perfil efectivo y su digest, packs resueltos con origen, commit, versión, digest de release y grafo. Incluye inventario ordenado de destinos gestionados, propietarios, modo y digest instalado. El estado se deriva de datos verificables. Fechas y resultados pertenecen a evidencia, de forma que repetir la operación preserve los bytes del lock. |
| Evidencia | Ampliar el [registro AFP-004](../../library/domains/engineering-protocols/templates/evidence-record.template.md) con `schemaVersion`, `gateId`, `artifactSha256`, commit, perfil, entradas, entorno, método o comando, actor, fecha, resultado y referencias verificables. Conservar los veredictos AFP `PASS`, `FAIL`, `NOT_RUN`, `STALE` y `NEEDS_REVIEW`. La excepción registra razón y autoridad por separado. |
| Compatibilidad | Registro por cliente, superficie, versión, OS, perfil, digest probado, escenario, revisión del estándar y resultado. Distinguir soporte documentado, instalación observada, activación correcta y equivalencia de comportamiento. |

Ejemplo ilustrativo de manifiesto para discutir el contrato. El origen y los digests son ficticios. La composición definitiva depende de obtener la fuente de BLK-ENG-001.

```json
{
  "schemaVersion": 1,
  "id": "kronforge.blk-eng-001",
  "version": "0.1.0",
  "license": "MIT",
  "source": {
    "uri": "https://example.invalid/kronforge",
    "commit": "0000000000000000000000000000000000000000"
  },
  "requires": [],
  "assets": [{"id": "quality-engineering.pre-merge", "version": "1.0.0"}],
  "profiles": [
    {"id": "versioned-release", "files": ["docs/engineering/pre-merge.md"], "gates": ["pre-merge"]}
  ],
  "files": [
    {
      "asset": "quality-engineering.pre-merge",
      "path": "payload/pre-merge.md",
      "target": "docs/engineering/pre-merge.md",
      "mode": "0644",
      "sha256": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  ],
  "effects": {"install": ["project-files"], "activate": []}
}
```

En el borrador, cada dependencia de `requires` contiene `id`, `version`, `source` y `artifactSha256`, con la misma forma de origen que el pack raíz. `profiles[].files` selecciona destinos de `files`. Cada destino tiene un único registro dentro del manifiesto. Cada `files[].asset` identifica uno de los activos declarados y el manifiesto identifica el origen de todos los archivos derivados. Si el piloto necesita archivos propios de composición, su procedencia apunta al pack y su commit. Los gates del perfil identifican entradas del plan de validación. Las rutas se escriben con `/` y los digests se codifican como 64 caracteres hexadecimales en minúscula.

La política local prevalece sobre las solicitudes del pack para ubicación, ejecución, red y credenciales. Los efectos efectivos son el subconjunto expresamente aprobado de los efectos solicitados. Si una capacidad obligatoria necesita un efecto denegado, el plan queda bloqueado. Ante varias rutas de instalación, solo una controla cada archivo. El lock pertenece al repositorio consumidor y se conserva junto a su revisión de cambios.

## Resolución determinista

1. Entradas autorizadas: perfil elegido, manifiestos del snapshot, artefactos verificables y lock existente. La primera versión del contrato fija versiones SemVer exactas, incluso cuando existen dependencias transitivas. Un rango o un servicio de resolución requerirían otro caso comprobado.
2. Resolver por identidad de pack y origen autorizado. El grafo parte del pack elegido y agrega sus dependencias obligatorias. Capacidades opcionales se incluyen solo por selección explícita del perfil. Rechazar ciclos, nodos ausentes, duplicación de ID por otro origen, dos versiones de un mismo ID y digests contradictorios. Ordenar topológicamente con desempate lexicográfico.
3. Cruzar cada activo con el catálogo del snapshot por ID y versión. `related`, `dependencies` editoriales y `protocol.dependsOn` conservan sus propios grafos. Una dependencia editorial requerida en ejecución debe aparecer como archivo incluido o dependencia de pack explícita.
4. Reunir permisos y requisitos. Probar los destinos contra el árbol del consumidor. Dos packs solo pueden compartir una ruta si bytes y modo coinciden y el inventario registra ambos propietarios. Un esquema que resuelva correctamente un grafo aún debe demostrar que los clientes pueden cargar las skills sin conflictos de nombre.

## Aplicación, actualización y recuperación

1. **Plan sin mutación.** Verificar origen, digest y precondiciones. Producir diff con altas, cambios, retiros, colisiones y activaciones solicitadas. Si el destino ya existe y quedó fuera del inventario, resolver la colisión con el dueño, aunque los bytes coincidan. Tratar las contribuciones a `AGENTS.md`, CI y políticas como parches explícitos sujetos a revisión.
2. **Aplicar el plan aprobado.** Revalidar política, hash y precondiciones, incluido el estado anterior del lock. Serializar por raíz y volver a comprobar el destino justo antes de escribir. Preparar contenido y respaldos en staging, verificar bytes, registrar un journal recuperable y confirmar el lock al final. Si no hay garantía de escritura atómica del conjunto, usar reemplazos por archivo y recuperar con el journal antes de aceptar otra operación. La ruta manual debe conservar un punto de restauración en Git y el mismo inventario de cambios.
3. **Repetir y verificar.** Misma selección, artefactos, permisos y estado producen plan vacío, sin reescrituras. Si hay deriva, exponer rutas y hashes. Una reconciliación requiere un plan específico para preservar o mover cambios locales. SHA-256 se calcula sobre los bytes exactos anunciados, sin conversiones implícitas de fin de línea. El empaquetado fija la convención de bytes y reporta cualquier transformación de un adaptador.
4. **Actualizar y retirar.** La consulta devuelve candidatos y avisos sin mutación. Una actualización explícita presenta diff de versiones, contenido, permisos, migraciones y compatibilidad. Un retiro elimina solo archivos gestionados sin deriva y sin otro propietario. El rollback restaura bytes y lock del punto anterior cuando sigue autorizado por la política de seguridad. Si hay cambios posteriores, expone el conflicto y preserva trabajo ajeno. Los fallos de verificación bloquean la activación.

## Confianza y compatibilidad

- **Integridad y autenticidad.** Fijar el commit fuente e identificar el artefacto por digest obtenido de un canal que el consumidor decida confiar. Un hash valida bytes. Una firma verificada contra identidad, emisor y política de confianza vincula esos bytes a un productor. Para artefactos públicos, reutilizar in-toto/SLSA y un verificador existente si se aprueba la atestación, sin reclamar nivel SLSA sin evaluación. Registrar revocaciones y respuesta según la política del proyecto. El piloto local puede usar una referencia y digest revisados fuera del archivo. [SLSA Provenance](https://slsa.dev/spec/v1.2/provenance).
- **Archivos y ejecución.** Aceptar archivos regulares en rutas relativas confinadas a la raíz real. Rechazar rutas absolutas, escapes, enlaces simbólicos o junctions, nombres reservados, colisiones por caja o normalización, duplicados y archivos que excedan los límites acordados. Instalar contenido sin ejecutarlo, sin leer secretos y sin tocar configuración global. Para activación, conceder efectos mínimos, declarar archivos, red, comandos y datos, y mantener secretos fuera del artefacto, del lock y de la evidencia pública.
- **Instrucciones y conectores.** Tratar textos y resultados remotos como datos de origen externo. Empaquetar localmente las instrucciones operativas de una skill y revisar scripts y permisos al actualizar. Si un perfil futuro incorpora MCP, fijar revisión y transporte, verificar origen y capacidades, limitar destinos y credenciales, y validar la audiencia de tokens cuando aplique autorización HTTP. [Seguridad de autorización MCP](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations).
- **Versiones independientes.** Framework, catálogo, activo, pack y schema tienen su propio ciclo. Cambios incompatibles en entradas, salidas, defaults, rutas gestionadas o reglas del pack requieren un corte mayor al estabilizar el contrato. Las versiones publicadas conservan sus bytes, incluso ante una corrección. En `0.x`, registrar cambios incompatibles y su migración explícitamente. Las rutas públicas existentes siguen la [política de deprecación](../../PROMPT_VERSIONING.md). [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).
- **Evidencia vigente.** Invalidar resultados al cambiar digest, perfil, reglas cubiertas, instrucciones de consumo o versión de cliente pertinente. Registrar si una integración quedó sin probar. Para prescindir de un gate condicional, su condición y tratamiento deben estar en el perfil aprobado antes de ejecutar.
