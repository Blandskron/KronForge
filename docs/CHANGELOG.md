# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo. El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

---

## Sin publicar

- [Auditoría de evolución de KronForge](audits/KRONFORGE_EVOLUTION_AUDIT.md) con investigación de estándares y distribución, arquitectura objetivo, contratos para packs y roadmap por ciclos.
- [ADR-0009](adr/ADR-0009-pack-composition-and-distribution.md), [ADR-0010](adr/ADR-0010-pinned-installation-and-trust.md) y [ADR-0011](adr/ADR-0011-external-adoption-before-cli.md) en estado `proposed`.
- [Ficha de BLK-ENG-001](KRONFORGE_C0_BLK_ENG_001.md) y ensayo reproducible con datos sintéticos. C0 está cerrado para uso interno y C1 para el perfil A + R conserva pendiente la evidencia de reproducción independiente.
- Dieciocho tutoriales por dominio con ejercicios y criterios de aceptación, seis casos reproducibles nuevos y acceso a ambos índices desde el portal, el README y `llms.txt`.
- Los 57 activos pendientes declaran entradas, salidas y casos de uso en su fuente canónica. Los 65 activos del catálogo tienen esos tres campos completos.
- Siete prácticas guiadas y un caso reproducible sobre la compatibilidad del catálogo v3.
- Primeros tres activos en desarrollo de software, datos y gestión técnica. Cinco activos anteriores incorporan contratos explícitos y el validador comprueba la paridad de sus campos.
- Trabajo de CI con Chromium y axe mediante dependencias aisladas y bloqueadas.
- Guías para las 14 rutas de aprendizaje, con prerrequisitos, objetivos y entregables, más un ejercicio reproducible. El esquema del catálogo v3 conserva su contrato.
- Corrección del README sobre la versión vigente y la procedencia del catálogo.
- Identidad KronForge, temas oscuro, claro y sistema, recursos SVG originales e iconos y fuentes locales.
- Acceso directo a skills, prompts, protocolos y referencias, con enlaces a arquitectura, gobernanza y calidad.
- URL de descubrimiento y metadatos alineados con el subdirectorio actual de GitHub Pages.

## [3.4.0] - 2026-09-07

### Eliminado

- Case study dedicado a un proyecto externo. Ese proyecto dejaba de ser una fuente citada y pasaba a ser contenido y carga de mantenimiento de esta biblioteca. La evidencia que contenía permanece distribuida en la sección `## Evidencia y límites` de cada protocolo, junto a la afirmación que sostiene.

### Modificado

- El tipo `case-study` vuelve a `supported`: deja de existir un activo canónico de esa clase.
- El índice del dominio enuncia el criterio de independencia de forma comprobable: la suite se adopta, valida y publica sin conocer ningún proyecto externo.

### Añadido

- [ADR-0007](adr/ADR-0007-evidence-citation-not-dependency.md), que distingue citar de depender y declara la excepción a la política de deprecación.

### Independencia

Citar no es depender. Una cita a un proyecto externo en `## Evidencia y límites`, y su traza en `observedIn`, es lo que hace falsable la madurez declarada; alojar un activo dedicado a ese proyecto es lo que crea acoplamiento. Si el proyecto citado desapareciera, la puerta de calidad seguiría en verde y la suite seguiría siendo adoptable.

Las madureces no cambian: la identificación que AFP-000 exige sigue presente en cada protocolo.

### Compatibilidad

- Se retira una ruta pública publicada en `3.3.0`, saltando la transición de deprecación que exige [`CONTRIBUTING_ASSETS.md`](CONTRIBUTING_ASSETS.md). La excepción y su justificación están registradas en ADR-0007 y no crean precedente.
- Ningún ID, relación `related` ni ruta de aprendizaje referenciaba el activo retirado.
- El resto de rutas públicas, IDs y contratos se conservan.

### Versión SemVer

Clasificada como **MINOR** con retirada de ruta pública declarada. Reservar la `4.0.0` —destinada por el roadmap a interoperabilidad— para retirar un case study falsearía la magnitud del cambio ante quien consume el versionado.

## [3.3.0] - 2026-09-07

### Añadido

- Tipo de activo `protocol` como concepto de primera clase, con categoría propia, metadatos verificables —código estable, madurez, actores, dependencias, dónde se observó y cuándo se revalidó— y carpeta `protocols`. Ver [ADR-0006](adr/ADR-0006-protocol-asset-type.md).
- Dominio `engineering-protocols` con la suite de doce protocolos AFP-000 a AFP-011: madurez y validación, estado del repositorio, delegación y handoff, colaboración multiagente, evidencia y compuertas, revisión independiente, validación de consumo externo, conformidad entre interfaces, benchmark reproducible, preparación de publicación, registros de decisión, y completitud, falla y detención.
- Cinco plantillas nuevas: protocolo, contrato de delegación, recibo de handoff, registro de evidencia de compuerta e informe de benchmark. Una sexta, la plantilla RFC, se suma al dominio `architecture` junto a la de ADR.
- Tres anti-patrones: compuerta aprobada sin ejecución, autorrevisión presentada como revisión independiente y protocolo acoplado a proveedores.
- Case study con la evidencia empírica que motivó la suite, incluida una sección explícita de lo que no valida; ejemplo con cinco escenarios de aplicación; y referencia de trabajo previo con cuatro fuentes externas verificadas.
- Grupo de validación «Contrato de protocolos, madurez y neutralidad» con cinco controles que pueden fallar: coherencia de madurez frente a evidencia declarada, grafo de dependencias acíclico, caducidad de la reevaluación de madurez, secciones obligatorias y neutralidad de proveedor en el cuerpo normativo.
- Ruta de aprendizaje «Protocolos de ingeniería con agentes».

### Modificado

- El schema del catálogo v3 acepta la categoría `protocol` y el objeto `protocol` en un activo, obligatorio para ese tipo y prohibido para los demás.
- Los tipos `case-study` y `example` pasan de `supported` a `active` al recibir su primer activo canónico.
- El portal etiqueta el tipo `protocol` en sus dos renderizadores de catálogo.

### Compatibilidad

- Se conservan el prompt maestro, `LICENSE`, las rutas públicas existentes, los IDs y el contrato del catálogo v3.
- `protocol` es un tipo aditivo: ningún activo existente cambia de tipo, de categoría ni de ruta.
- El objeto `protocol` es opcional en el schema y obligatorio por política solo para el tipo que lo declara.

### Estado de madurez

Los doce protocolos se publican en `experimental`. Su evidencia empírica proviene de un solo proyecto, con un solo mantenedor y un solo ecosistema. Ninguno alcanza `reproduced` y ninguno declara medición de efectividad. El case study registra explícitamente qué sostiene esa evidencia y qué no.

### Versión SemVer

Clasificada como **MINOR**: agrega tipo, dominio, activos y controles sin romper rutas, IDs ni contratos. La neutralidad de proveedor es un control nuevo que solo aplica a un tipo nuevo, de modo que ningún activo existente puede empezar a fallar por su causa.

## [3.2.0] - 2026-09-03

### Añadido

- Tres patrones de contexto de horizonte largo: compactación con umbrales de disparo, notas persistentes fuera de la ventana y recuperación bajo demanda mediante identificadores ligeros.
- Dominio `agent-interoperability` con la architecture note de tarjetas de agente y confianza entre pares —A2A `1.0.0`, tarjetas firmadas y los tres tipos de confianza que suelen confundirse— y la referencia de fronteras entre protocolos.
- `llms.txt` generado desde el catálogo y verificado por la puerta de calidad, como tercera proyección junto al catálogo y a `skills/`.
- `scripts/build-llms.mjs` con modo `--check`, y `npm run build` para regenerar ambas superficies.
- Rutas de aprendizaje «Contexto de horizonte largo» e «Interoperabilidad entre agentes».
- [ADR-0005](adr/ADR-0005-discovery-surface-and-score-calibration.md) con la decisión sobre superficies generadas y la recalibración del score.

### Modificado

- `ai-agent-engineering.subagent-contract` explica el aislamiento de contexto, que suele ser la razón principal para delegar, y su contrapartida: lo que no entra en la síntesis se pierde.
- AI Repository Score recalibrado: cuatro criterios que siempre se cumplían se sustituyen por controles que pueden fallar —superficies generadas verificadas, conformidad de skills, `llms.txt` publicado y referencias externas vigentes—.
- Índices de `context-engineering` y mapa del dominio ampliados con la capa de horizonte largo.

### Compatibilidad

- Se conservan el prompt maestro, `LICENSE`, las rutas públicas existentes y el contrato del catálogo v3.
- `llms.txt` es una superficie nueva y aditiva.
- Los criterios retirados del score no cambian la escala: siguen siendo diez dimensiones de diez puntos.

### Versión SemVer

Clasificada como **MINOR**: agrega dominio, activos, superficie de descubrimiento y controles sin romper rutas, IDs ni contratos. La recalibración del score altera la fórmula, que según su propia política puede hacer bajar el puntaje cuando el contrato se vuelve más exigente.

## [3.1.0] - 2026-09-03

### Añadido

- Superficie `skills/` generada desde el Markdown canónico y conforme al formato abierto Agent Skills, para que un cliente compatible pueda descubrir y cargar las skills sin conocer la estructura interna del repositorio.
- `scripts/build-skills.mjs` con modo `--check`, integrado en la puerta de calidad: la proyección no puede divergir de su fuente.
- Política de frescura verificable `specRefs` documentada en [SPEC_FRESHNESS.md](SPEC_FRESHNESS.md), con advertencia a los 90 días y bloqueo a los 180 sin re-verificación.
- Dominio `agent-supply-chain` con architecture note de límites de confianza de una skill, patrón de privilegio mínimo en herramientas, anti-patrón de instrucciones externas no verificadas y checklist OWASP Agentic Skills Top 10.
- Checklist de conformidad Agent Skills en `ai-agent-engineering`.
- Ruta de aprendizaje «Confianza en skills».
- Controles de validación para conformidad del formato, detección de instrucciones remotas en `SKILL.md` (AST05) y frescura de referencias externas.
- [ADR-0004](adr/ADR-0004-agent-skills-projection-and-spec-freshness.md) con la decisión de proyección y frescura, sus alternativas rechazadas y sus riesgos.

### Modificado

- `mcp-integration.mcp-topology` y `mcp-integration.mcp-security` reescritos contra la revisión `2026-07-28` de la especificación MCP: núcleo sin estado, ausencia de sesión y de intercambio inicial, enrutamiento por encabezados, vigencia y alcance de caché, validación de emisor y ciclo de vida de características.
- Las tres skills canónicas declaran `license`, `allowed-tools`, `metadata` y `specRefs`, y sus descripciones explican qué hacen y cuándo usarlas según el estándar.
- `library/catalog.json` publica `specRefs` por activo; el schema v3 acepta el campo de forma aditiva y sin romper consumidores.
- Matriz de compatibilidad actualizada con la gobernanza de `AGENTS.md` bajo la Agentic AI Foundation y con el soporte de skills por producto.
- El parser de front matter admite mapas anidados y listas de objetos.

### Eliminado

- Directorios vacíos `skills/` y `.agents/` que quedaban en la raíz sin contenido ni seguimiento en Git.

### Compatibilidad

- Se conservan el prompt maestro, `LICENSE`, las rutas públicas de los activos existentes y el contrato del catálogo v3.
- `skills/` es una superficie nueva y aditiva; el Markdown de `library/` sigue siendo la fuente de verdad.
- GitHub Pages continúa publicando HTML, CSS y JavaScript vanilla sin build de producción.

### Versión SemVer

Clasificada como **MINOR**: agrega una superficie distribuible, un dominio, activos y controles sin romper rutas, IDs ni el contrato del catálogo. Los activos MCP suben a **2.0.0** de forma individual porque su contenido describe ahora una revisión distinta de la especificación.

## [3.0.0] - 2026-07-28

### Añadido

- Auditoría integral de arquitectura, contenido, gobernanza, portal y adopción agents-first, con prioridades P0/P1/P2 y plan de implementación gradual.
- Arquitectura vigente de seis capas y registro inicial de ADR para el framework, el catálogo como proyección y la puerta de calidad sin dependencias.
- Gobierno OSS con contribución, conducta, seguridad, soporte, gobernanza, maintainers, CODEOWNERS y plantillas de issues/pull requests.
- JSON Schema draft 2020-12 para el catálogo v3, taxonomía extensible y rutas de aprendizaje basadas en activos existentes.
- Validación reproducible de catálogo, front matter, relaciones, enlaces, anclas, seguridad, versiones, navegación y JavaScript.
- Pruebas unitarias, smoke test de rutas publicables y fuentes canónicas bajo el subdirectorio de GitHub Pages, y workflow de GitHub Actions con permisos mínimos.
- Metodología reproducible AI Repository Score en diez dimensiones.
- Matriz de compatibilidad que distingue uso universal de Markdown, adaptadores presentes y autodetección no verificada.

### Modificado

- `library/catalog.json` elevado a schema v3 y framework `3.0.0`, con metadatos de clasificación, compatibilidad, mantenimiento, relaciones y contratos.
- Portal evolucionado con URLs compartibles por activo, búsqueda normalizada, filtros y orden, tags, relaciones, metadatos, aprendizaje y modo lectura.
- Carga de activos protegida contra carreras, errores y placeholders; copia y descarga conservan exclusivamente el Markdown canónico.
- Carga documental protegida por destino para impedir que respuestas tardías sobrescriban la pestaña activa.
- Regiones Markdown desplazables accesibles por teclado, aun cuando las barras visuales permanezcan ocultas.
- Roadmap servido desde Markdown canónico y extendido con hitos v3, v3.5, v4, v4.5 y v5.
- README, guías operativas, versionado, contribución y adaptadores alineados con la plataforma v3.
- Documentos estratégicos v2 marcados como antecedentes y enlazados a la arquitectura vigente.

### Compatibilidad

- Se conservan el prompt maestro, `LICENSE`, los 29 activos y sus rutas públicas.
- GitHub Pages continúa publicando HTML, CSS y JavaScript vanilla sin build de producción.
- Los tres dominios todavía sin activos permanecen explícitos; no se agregó contenido de relleno.

### Versión SemVer

Clasificada como **MAJOR**: introduce un nuevo contrato público del catálogo y consolida arquitectura, gobernanza, automatización y experiencia web, con migración compatible de las rutas existentes.

## [2.2.0] - 2026-07-28

### Añadido

- Renderizador Markdown nativo y seguro para mostrar prompts, templates, playbooks, documentación y adaptadores como contenido editorial legible.
- Acciones de copia del Markdown original y descarga del archivo canónico en los visores del portal.

### Modificado

- Barras de desplazamiento visuales ocultas sin deshabilitar el desplazamiento.
- Visor de biblioteca, prompt principal, documentación, ejemplos, versionado, adaptadores y árbol de estructura alineados con la misma experiencia de lectura.

### Versión SemVer

Clasificada como **MINOR**: incorpora nuevas capacidades de presentación y descarga sin cambiar los activos canónicos.

## [2.1.2] - 2026-07-28

### Corregido

- Publicación de los archivos Markdown canónicos sin transformación de Jekyll mediante `.nojekyll`, necesaria para que el visor cargue las rutas `.md` en GitHub Pages.

### Versión SemVer

Clasificada como **PATCH**: corrige la disponibilidad de los activos canónicos en el portal publicado.

## [2.1.1] - 2026-07-28

### Corregido

- Resolución de rutas de páginas, catálogo y documentos desde la raíz real del sitio mediante `import.meta.url`, compatible con el subdirectorio de GitHub Pages.
- Navegación con historial funcional para los controles Atrás y Adelante del navegador.
- Acceso directo a cada `pages/*.html`, que ahora redirige a su sección dentro del portal completo.
- Página `404.html` para recuperar rutas de secciones conocidas en GitHub Pages.
- Estado de error visible y acción de reintento cuando una sección no puede cargarse, evitando spinners permanentes.
- Versionado de recursos estáticos y solicitudes de contenido para reducir inconsistencias de caché después de publicar.

### Versión SemVer

Clasificada como **PATCH**: corrige navegación y publicación sin cambiar los contratos del framework.

## [2.1.0] - 2026-07-28

### Añadido

- Estrategia integral del framework en `docs/AI_ENGINEERING_FRAMEWORK_STRATEGY.md`, con visión, misión, arquitectura, taxonomía, estrategias especializadas, roadmap, riesgos y beneficios.
- Dominios `context-engineering`, `repository-engineering`, `mcp-integration` y `hooks-workflows`.
- Architecture notes para capas de contexto, topología MCP y sistemas de subagentes.
- Patrones de contexto progresivo, delegación por contrato y hooks de validación explícitos.
- Playbook para diseñar repositorios AI-First y checklist de seguridad MCP.
- Roadmap público en `docs/ROADMAP.md`.
- Portal con Quick Start, dominios, biblioteca unificada, búsqueda, filtros, visor de activos, breadcrumbs, roadmap, contribución y changelog.
- SEO, Open Graph básico, navegación responsive y preferencia persistente de tema.
- Tarjeta Open Graph propia en `assets/img/og-ai-engineering.png`, alineada con los cuatro pilares del portal.

### Modificado

- `library/catalog.json` elevado a schema v2 con versión del framework, títulos, resúmenes, dificultad y tags para descubrimiento.
- Contratos editoriales ampliados con dificultad, proyectos, compatibilidad y modelos.
- Skills ampliadas con problema, dependencias, casos de uso y ejemplo.
- README, AGENTS, versionado y documentación operativa alineados con la visión de framework abierto de AI Engineering.

### Eliminado

- Visor aislado de prompts de calidad (`pages/quality.html`, `assets/js/quality.js`, `assets/css/quality.css`), reemplazado por la biblioteca unificada.

### Versión SemVer

Clasificada como **MINOR**: incorpora pilares, activos y capacidades de portal compatibles con la arquitectura v2.0.

## [2.0.0] - 2026-07-28

### Añadido

- Arquitectura por dominios en `library/`, con once dominios estables y un manifiesto `catalog.json`.
- Propuesta arquitectónica completa en `docs/REPOSITORY_EVOLUTION.md`.
- Contrato y proceso de contribución para ocho tipos de activos en `docs/CONTRIBUTING_ASSETS.md`.
- Primer conjunto transversal de template ADR, checklist pre-merge, playbook agents-first, patrón, anti-patrón y referencias.
- Metadatos estables para descubrimiento, estado, versión y relaciones.

### Modificado

- Reposicionamiento del proyecto como biblioteca de ingeniería asistida por IA y framework documental liviano, agnóstico al modelo.
- Migración de los doce prompts especializados desde la carpeta plana `prompts/quality/` a arquitectura, calidad, seguridad, entrega y confiabilidad.
- Migración y normalización de las tres skills junto a sus dominios.
- README, AGENTS, versionado, ejemplos, documentación operativa y sitio alineados con el catálogo.
- Web estática actualizada a v2.0.0 y rutas canónicas del catálogo.

### Compatibilidad

- El prompt maestro conserva `prompts/agents-first-documentation-review.prompt.md`.
- `docs/skills/README.md` se conserva como índice de transición.
- No se modificó `LICENSE` ni se eliminó documentación operativa de `docs/agent/`.

### Versión SemVer

Clasificada como **MAJOR**: cambia la arquitectura pública del catálogo y las rutas de los prompts especializados.

## [1.5.5] - 2026-07-07

### Modificado
- **Resolución de Bugs en Layout:**
  - Corregido error de desbordamiento horizontal y desencuadre del contenido en `.main-content` al colapsar el sidebar en desktop. Se removieron los estilos en línea aplicados mediante JavaScript en `sidebar.js`, permitiendo que el margen izquierdo del área principal se controle enteramente por la variable CSS `--active-sidebar-width` y sus transiciones fluidas de forma nativa.

---

## [1.5.4] - 2026-07-07

### Modificado
- **Limpieza de Interfaz y Enlaces de Contacto:**
  - Removido el botón "Copiar Prompt" de la parte superior derecha de la cabecera en `index.html` (dejando la barra superior oculta en desktop y mostrando únicamente el botón del menú móvil en resoluciones menores).
  - Rediseñado el footer principal (`.app-footer`) de sticky a **fijo en pantalla** (`position: fixed`) de 56px de altura, con layout horizontal (`flex-direction: row; justify-content: space-between`), fondo traslúcido y desenfoque por hardware. Se añadió un margen inferior de lectura (`padding-bottom: 96px`) al `.main-content` para evitar solapamientos con el scroll de código.
  - Añadido el botón de **Consultas** en el *sidebar-footer* (justo debajo del botón de GitHub) que enlaza directamente al perfil de LinkedIn de Blandskron, adaptándose estéticamente al colapsado lateral del sidebar.

---

## [1.5.3] - 2026-07-07

### Modificado
- **Cabecera y Navegación:** Depurado de componentes no funcionales y optimización de controles:
  - Removido por completo el buscador estático del *top-bar* en `index.html`, eliminando también el módulo `search.js` y las definiciones CSS asociadas en `layout.css` y `responsive.css`.
  - Reubicado el botón de cambio de tema (claro/oscuro) desde la cabecera hacia la parte inferior de la barra lateral (justo encima del botón de GitHub), rediseñándolo como `.theme-btn` para comportarse igual a un item de navegación (con soporte responsivo y cambio dinámico de icono y texto de "Modo Oscuro" a "Modo Claro").

---

## [1.5.2] - 2026-07-07

### Modificado
- **Personalización Estética y Marca:** Actualizados los iconos y logotipos del sitio con soporte nativo de tema claro/oscuro (sin uso de JavaScript para la alternancia):
  - Integrado el favicon (`assets/img/favicon.png`) en la cabecera del sitio.
  - Reemplazado el icono de robot genérico en el sidebar por el logotipo de cara del agente de Blandskron, mostrando automáticamente `ico-black.png` en modo claro e `ico-white.png` en modo oscuro.
  - Añadido un footer de tipo *sticky* al final del contenido principal que integra el logo de marca (`logo-black.png` en modo claro y `logo-white.png` en modo oscuro) junto con créditos interactivos y una animación de latido de corazón en el icono de agradecimiento que enlaza a `blandskron.com`.

---

## [1.5.1] - 2026-07-07

### Modificado
- **Reorganización del Sitio Estático:** Reducción del tamaño de los archivos base del sitio web mediante una separación limpia de responsabilidades compatible con GitHub Pages y sin usar frameworks ni build system:
  - `index.html` en la raíz actúa ahora como un shell HTML delgado que realiza carga diferida (lazy loading) de las secciones dinámicas.
  - Creación de carpetas `assets/css/` para modularizar los estilos: `base.css` (variables/reset), `layout.css` (estructura/sidebar), `components.css` (UI/cards/inputs), `quality.css` (visores de prompts de calidad) y `responsive.css` (media queries).
  - Creación de carpetas `assets/js/` para dividir la lógica utilizando ES Modules nativos: `config.js` (datos locales), `loader.js` (fetcher de archivos), `navigation.js` (enrutamiento de tabs), `sidebar.js` (comportamiento del sidebar), `tree.js` (árbol de archivos), `quality.js` (Prompts de Calidad), `models.js` (guías de modelos), `copy.js` (clipboard/toast), `theme.js` (claro/oscuro), `search.js` (búsqueda) y `app.js` (orquestador principal).
  - Creación de carpeta `pages/` con los archivos HTML dinámicos para cada sección de la app: `welcome.html`, `prompt.html`, `quality.html`, `structure.html`, `models.html`, `example.html` y `versioning.html`.
- **Documentación del Repositorio:** Actualizadas todas las referencias a `index.css` e `index.js` en `.github/copilot-instructions.md`, `README.md`, `AGENTS.md`, `docs/agent/CONFIG.md`, `docs/agent/DATA_SCHEMA.md`, `docs/agent/PERMISSIONS.md`, `docs/agent/RUNBOOK.md`, `skills/documentation-audit/SKILL.md` y `skills/github-pages-release/SKILL.md`.

---

## [1.5.0] - 2026-07-07

### Añadido
- **Biblioteca de Prompts de Calidad:** Creación de `prompts/quality/` con 12 prompts especializados para validación interna de software:
  - `unit-tests.prompt.md`: detección de stack y creación de tests unitarios sobre lógica verificable.
  - `integration-tests.prompt.md`: revisión y creación de tests de integración entre módulos o servicios.
  - `functional-qa.prompt.md`: QA funcional basado en flujos y criterios de aceptación reales.
  - `regression-qa.prompt.md`: mapeo de impacto de cambios y checklist de regresión.
  - `security-audit.prompt.md`: auditoría de ciberseguridad responsable (detectar, clasificar, reportar).
  - `dependency-vulnerability-audit.prompt.md`: auditoría de vulnerabilidades en dependencias por gestor de paquetes.
  - `docker-image-security-audit.prompt.md`: revisión estática de Dockerfiles y docker-compose.
  - `code-quality-review.prompt.md`: revisión de duplicación, deuda técnica, acoplamiento y mantenibilidad.
  - `architecture-validation.prompt.md`: validación de estructura real versus documentación arquitectónica.
  - `performance-basic-validation.prompt.md`: identificación de riesgos de performance por análisis estático.
  - `definition-of-done-review.prompt.md`: checklist de DoD con veredicto claro basado en evidencia.
  - `release-readiness-review.prompt.md`: checklist multidimensional de preparación para release.
- **Índice de Biblioteca:** Creación de `prompts/quality/README.md` con filosofía, tabla de prompts y checklist de validación de prompts nuevos.
- **Ejemplo de QA Funcional:** Agregado Ejemplo 2 en `examples/usage-example.md` mostrando diagnóstico, plan, checklist y evidencia de un proceso de QA.

### Modificado
- **README.md:** Nueva descripción del repositorio como biblioteca de prompts para documentar, auditar y validar. Árbol de estructura actualizado. Nueva sección "Biblioteca de Prompts de Validación Interna" con tabla enlazada.
- **AGENTS.md:** Propósito actualizado. `prompts/quality/README.md` agregado a Lectura Prioritaria. Superficie editable actualizada con `prompts/quality/**`. Reglas operativas ampliadas para prompts de calidad.
- **docs/agent/TESTS.md:** Expandido con checklist de validación de prompts de calidad y validación operativa del sitio estático.
- **docs/agent/SECURITY.md:** Ampliado con reglas de seguridad para prompts de auditoría: prohibición de exploits, reglas de reporte responsable y criterios de clasificación de hallazgos.
- **PROMPT_VERSIONING.md:** Ampliado con sección de versionado de la biblioteca `prompts/quality/` y tabla de clasificación de cambios por tipo.
- **examples/usage-example.md:** Agregado segundo ejemplo completo de uso de un prompt de QA funcional.
- **index.html:** Nueva pestaña "Prompts de Calidad" en la barra de navegación lateral.
- **index.js:** Datos de prompts de calidad agregados a `docsDatabase`. Lógica de nueva pestaña y búsqueda ampliada.
- **docs/agent/RUNBOOK.md:** Validación operativa actualizada para incluir los nuevos prompts.

### Versión SemVer
Clasificada como **MINOR** (v1.5.0): agrega nueva biblioteca de prompts de validación interna sin romper la estructura existente ni alterar el prompt maestro.

---

## [1.4.0] - 2026-06-25

### Modificado
- **Norte de Producto:** Refuerzo del posicionamiento del repositorio como prompt universal de adopción inmediata bajo el flujo `Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar`.
- **Prompt Maestro:** Clarificación de que el estándar no es un framework ni una metodología pesada, y que debe crear profundidad documental solo cuando reduzca incertidumbre real.
- **README y AGENTS:** Alineación del mensaje público con el objetivo de servir como ejemplo vivo profesional, agnóstico a stack y agente.
- **GitHub Pages:** Actualización de textos principales y versión visible para presentar mejor la promesa simple del proyecto.

## [1.3.7] - 2026-06-25

### Modificado
- **Colapso Desktop:** Desplazamiento relativo del contenido principal al colapsar el sidebar para asegurar posición visual correcta.

## [1.3.6] - 2026-06-25

### Modificado
- **Colapso Desktop:** Ajuste visual del contenido principal al colapsar la barra lateral para que el layout aproveche el espacio liberado.

## [1.3.5] - 2026-06-25

### Modificado
- **Compatibilidad UI:** Uso de valores inline concretos para asegurar colapso desktop y apertura móvil en navegadores con cache o resolución tardía de variables CSS.

## [1.3.4] - 2026-06-25

### Modificado
- **Interacción Sidebar:** Aplicación explícita del margen del contenido y posición del drawer desde JavaScript para asegurar comportamiento consistente en desktop y móvil.

## [1.3.3] - 2026-06-25

### Modificado
- **Navegación Final:** Corrección de estados cruzados entre sidebar colapsado en desktop y drawer móvil.
- **Assets GitHub Pages:** Versionado de `index.css` e `index.js` en el HTML para evitar cache viejo al publicar.

## [1.3.2] - 2026-06-25

### Modificado
- **Topbar Desktop:** Alineación consistente entre buscador, botón de tema y botón de copiar prompt.
- **Sidebar Desktop:** Nuevo modo colapsado que conserva solo iconos y ajusta el contenido principal.
- **Navegación Responsive:** El botón lateral ahora funciona como colapso en desktop y cierre en móvil.

## [1.3.1] - 2026-06-25

### Modificado
- **Interfaz GitHub Pages:** Rediseño visual con paleta profesional light-first, modo oscuro coherente, superficies limpias y menor carga decorativa.
- **Responsive Móvil:** Implementación de navegación lateral abrible/cerrable en pantallas pequeñas, con backdrop, cierre por botón y tecla Escape.
- **Estabilidad Visual:** Ajustes de layout para evitar roturas en secciones de estructura, modelos, prompt y contenido Markdown.

## [1.3.0] - 2026-06-25

### Añadido
- **Set Agents-First Completo:** Creación de `docs/agent/RUNBOOK.md`, `docs/agent/SECURITY.md`, `docs/agent/CONFIG.md` y `docs/agent/DATA_SCHEMA.md` para que este repositorio funcione como ejemplo profesional completo.
- **Catálogo de Skills:** Creación de `docs/skills/README.md` y nuevas skills de ejemplo en `skills/documentation-audit/` y `skills/github-pages-release/`.

### Modificado
- **Arquitectura Documental Modelo:** Movimiento de `CLAUDE.md`, `GEMINI.md` y `PROMPT_VERSIONING.md` a la raíz para reflejar mejor archivos de entrada y políticas principales del estándar.
- **Historial Documental:** Movimiento del changelog a `docs/CHANGELOG.md` y actualización de enlaces internos.
- **Sitio GitHub Pages:** Actualización del árbol interactivo y rutas cargadas por la página para reflejar la nueva estructura.

## [1.2.0] - 2026-06-25

### Añadido
- **Prompt Universal Reforzado:** Reestructuración del prompt maestro en fases claras de auditoría, plan, implementación, limpieza segura, página documental opcional y validación final.
- **Orientación GitHub Pages:** Mejora del README y del sitio estático para presentar el repositorio como producto copiable y desplegable.

### Modificado
- **Agnosticismo Multi-Agente:** Ajuste de guías para Claude, Gemini y Copilot para evitar supuestos de stack, versiones de modelos o comandos no verificados.
- **Documentación Interna:** Actualización de `AGENTS.md`, `README.md`, `docs/agent/TESTS.md` y `skills/prompt-update/SKILL.md` para alinear el repositorio con su propio estándar.
- **Página Estática:** Corrección de textos principales, versión visible y enlace del repositorio en GitHub.

## [1.1.0] - 2026-06-25

### Añadido
- **Plantillas Específicas de Modelo:** Creación de `docs/agent/CLAUDE.md`, `docs/agent/GEMINI.md` y `.github/copilot-instructions.md` como guías y estándares para integraciones de modelos.
- **Portal Web Interactivo:** Implementación de `index.html`, `index.css` e `index.js` en la raíz para servir la documentación mediante GitHub Pages con diseño premium, responsivo y Glassmorphism.
- **Auto-Documentación de Agentes:** Creación de `AGENTS.md`, `docs/agent/PERMISSIONS.md` y `docs/agent/TESTS.md` para auto-auditar este repositorio con el estándar.
- **Habilidad de Actualización (Skills):** Creación del primer skill especializado `skills/prompt-update/SKILL.md` para automatizar las actualizaciones seguras y versionamiento del prompt.

### Modificado
- **Limpieza de Referencias Obsoletas:** Eliminadas referencias a instrucciones antiguas y no presentes en la estructura actual.

## [1.0.0] - 2026-06-25

### Añadido
- **Prompt Base (`prompts/agents-first-documentation-review.prompt.md`):** Primera versión estable del prompt con enfoque *agents-first* y *human-friendly*.
- **Instrucciones Obligatorias:** Estructura guiada para auditar, clasificar y limpiar archivos de documentación obsoleta (archivos de instrucciones antiguos, etc.).
- **Esquema de Documentación Generada:** Definición de plantillas y contenidos mínimos para `AGENTS.md` y la carpeta `docs/agent/` (`PERMISSIONS.md`, `RUNBOOK.md`, `TESTS.md`, `SECURITY.md`, `DATA_SCHEMA.md`, `CONFIG.md`).
- **Uso de Skills:** Soporte inicial para archivos en `skills/*/SKILL.md`.
- **Ejemplo de Uso (`examples/usage-example.md`):** Ejemplo paso a paso de auditoría y reestructuración en un proyecto Node.js/Express.
- **Políticas de Versionado (`docs/prompt-versioning.md`):** Reglas para cambios de versión SemVer aplicadas al prompt.
- **Licencia:** Archivo de licencia MIT.
