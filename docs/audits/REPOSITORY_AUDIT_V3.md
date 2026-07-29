# Auditoría Integral para Agents First Framework v3

## Estado

- **Fecha:** 2026-07-28
- **Modo:** solo lectura durante la auditoría
- **Base:** `main` en `f15657d`, más la evolución web v2.2 aún no confirmada al iniciar
- **Alcance:** repositorio completo, catálogo, activos, gobernanza, adaptadores, portal y validación
- **Decisión de limpieza:** no eliminar archivos en esta fase

## Resumen ejecutivo

El repositorio ya es una biblioteca documental sólida: tiene 15 dominios, 29 activos canónicos, un prompt maestro estable, documentación operativa y un portal estático funcional. No se encontraron duplicados exactos, archivos web sin uso, IDs repetidos, rutas de catálogo ausentes ni enlaces Markdown internos rotos.

La brecha hacia v3 no se resuelve agregando volumen. Los bloqueantes son sistémicos:

1. no existe una capa completa de gobernanza open source;
2. no hay validación automática ni compuerta de calidad en GitHub;
3. catálogo, portal, roadmap y changelog no comparten una versión única;
4. el schema v2 no publica metadatos suficientes para relaciones, compatibilidad o aprendizaje;
5. el portal no conserva activos y filtros en URLs compartibles;
6. no existe registro de decisiones arquitectónicas reales;
7. la compatibilidad con agentes está documentada solo mediante tres adaptadores y repite reglas comunes.

La adopción agents-first actual es **alta en operación documental** y **media en gobernanza, automatización y descubrimiento**.

## Inventario verificado

| Superficie | Resultado |
|---|---:|
| Archivos rastreados al iniciar | 106 |
| Markdown auditados | 65 |
| Dominios | 15 |
| Activos canónicos | 29 |
| Páginas HTML parciales | 12 |
| Módulos JavaScript, incluida la evolución v2.2 | 13 |
| Hojas CSS | 5 |
| Imágenes del portal | 6 |
| Enlaces Markdown internos rotos | 0 |
| Duplicados exactos de Markdown | 0 |
| Assets o módulos web sin referencias | 0 |
| Dominios sin activos | 3 |

Los dominios sin activos son `data`, `product-technical-management` y `software-development`. Sus índices declaran alcance futuro; no se deben rellenar artificialmente.

## Hallazgos P0 — bloqueantes para v3

### P0.1 — Estado y versión fragmentados

- `library/catalog.json` declara framework `2.1.0`;
- el portal, `assets/js/paths.js` y el changelog declaran `2.2.0`;
- el roadmap visual aún presenta v2.1 como actual;
- la estrategia histórica continúa describiendo v2.1 como siguiente entrega.

Una release v3 debe sincronizar catálogo, portal, roadmap, políticas y changelog en una sola operación validable.

### P0.2 — Gobernanza pública incompleta

No existen:

- `CONTRIBUTING.md`;
- `CODE_OF_CONDUCT.md`;
- `SECURITY.md` público;
- `SUPPORT.md`;
- `GOVERNANCE.md`;
- `MAINTAINERS.md`;
- `CODEOWNERS`;
- issue forms;
- pull request template.

`docs/agent/SECURITY.md` protege el trabajo de agentes, pero no define divulgación responsable. No hay un canal privado de seguridad confirmado; cualquier política debe declarar ese pendiente y evitar inventar contactos.

### P0.3 — Calidad manual

`docs/agent/TESTS.md` es una buena especificación, pero no existe un ejecutable que verifique:

- enlaces y cercas Markdown;
- schema y unicidad;
- front matter y catálogo;
- versiones;
- relaciones;
- rutas;
- navegación;
- GitHub Pages;
- duplicados;
- activos sin catalogar.

Tampoco existe un workflow que ejecute esos controles en pull requests.

### P0.4 — Catálogo insuficiente para v3

El schema v2 indexa nueve campos por activo. Los Markdown ya contienen versión, compatibilidad, modelos y relaciones, pero el portal no puede descubrirlos sin abrir cada archivo. Faltan contratos explícitos para:

- categoría y nivel;
- agentes y lenguajes;
- autoría y licencia;
- fecha de revisión;
- dependencias;
- entradas y salidas;
- ejemplos, duración, complejidad y casos de uso.

Estos campos no deben completarse con texto genérico. v3 distinguirá metadatos obligatorios de descubrimiento y metadatos de contrato cuya cobertura puede crecer de forma medible.

### P0.5 — Navegación no compartible

La ruta `#library` no conserva:

- activo abierto;
- búsqueda;
- tags o filtros;
- orden;
- modo de lectura.

`#playbooks` funciona al hacer clic, pero no representa de forma estable el estado. Los activos necesitan rutas como `#library/<asset-id>` y filtros serializables.

## Hallazgos P1 — prioridad alta

### Arquitectura y decisiones

- existe una plantilla ADR, pero no un registro de ADR reales;
- `docs/REPOSITORY_EVOLUTION.md` y `docs/AI_ENGINEERING_FRAMEWORK_STRATEGY.md` son valiosos, aunque describen hitos históricos ya superados;
- no hay documento único de arquitectura vigente para v3.

### Gobernanza y políticas

- contribución de activos no cubre el flujo general de issues y pull requests;
- versionado, compatibilidad, deprecación y releases están dispersos;
- review checklist y Definition of Done aparecen en varios documentos sin una compuerta canónica del repositorio;
- `AGENTS.md`, permisos y seguridad no expresan exactamente la misma autoridad.

### Catálogo y biblioteca

- la sincronización front matter ↔ catálogo ↔ índice de dominio es manual;
- `related` es válido, pero no se presenta en el portal;
- tres dominios todavía son solo índices;
- la similitud más alta fue entre prompts de tests unitarios e integración; sus objetivos y fronteras son distintos, por lo que no se consideran redundantes;
- no hay rutas de aprendizaje declarativas basadas únicamente en activos existentes.

### Portal

- relaciones y tags no son navegables;
- faltan filtros por estado, compatibilidad y modelo;
- búsqueda no normaliza tildes ni usa campos v3;
- errores de catálogo y activos no permiten recuperación completa;
- enlaces relativos dentro del Markdown se resuelven contra el shell y no contra la fuente;
- estadísticas de tipos y fecha están hardcodeadas o ausentes;
- el roadmap HTML duplica la fuente Markdown;
- no existe modo lectura ni enlace directo a fuente;
- el visor puede mezclar respuestas si dos activos se abren rápidamente.

### Compatibilidad AI

Solo existen adaptadores para Claude, Gemini y Copilot. La solución no es crear quince copias: v3 necesita una matriz canónica que distinga:

- compatibilidad universal por copiar/pegar Markdown;
- descubrimiento nativo verificado;
- adaptador existente;
- integración pendiente de confirmar.

`AGENTS.md` debe seguir siendo el contrato durable y neutral. Los adaptadores específicos deben enlazarlo y contener solo diferencias reales.

## Hallazgos P2 — deuda controlada

- el estado inicial mantenía fallbacks extensos en `assets/js/config.js`; v3 los retiró para impedir que contenido sintetizado suplante una fuente canónica;
- queda lógica obsoleta de la antigua pestaña `quality` en `copy.js`;
- existen selectores CSS heredados sin uso comprobable;
- hay botones con `onclick` inline;
- el sitio depende de Google Fonts y Font Awesome para su presentación;
- no existe fallback `<noscript>` sustantivo;
- ocultar globalmente scrollbars reduce señales visuales de desplazamiento; debe compensarse con foco visible, teclado y regiones claramente desplazables;
- contenido y portal están únicamente en español.

## Clasificación documental

| Grupo | Clasificación | Decisión |
|---|---|---|
| Prompt maestro | Vigente y protegido | Conservar ruta y contrato |
| `library/**` | Vigente | Enriquecer sin mover rutas |
| `docs/agent/**` | Vigente, parcialmente inconsistente | Alinear autoridad y comandos |
| Estrategia y evolución v2 | Histórico útil | Conservar y marcar como antecedente |
| `docs/skills/README.md` | Índice de transición | Conservar por compatibilidad |
| Adaptadores Claude/Gemini/Copilot | Útiles, con reglas repetidas | Adelgazar y enlazar núcleo común |
| Portal | Vigente, deuda localizada | Evolucionar sin framework ni build |
| `assets/js/config.js` | Datos de navegación | Retirar fallbacks duplicados; conservar solo datos consumidos |
| Licencia | Legal y protegida | No modificar |

## Riesgos

| Riesgo | Mitigación v3 |
|---|---|
| Sobrediseñar cientos de carpetas | Crear contratos y métricas, no contenido de relleno |
| Duplicar metadatos | Markdown canónico; catálogo como proyección validada |
| Publicar una política de seguridad ficticia | Declarar canal pendiente y no prometer confidencialidad inexistente |
| Romper rutas públicas | Conservar prompt y activos; migraciones compatibles |
| Añadir una toolchain pesada | Node estándar para validación; portal vanilla |
| Convertir el score en vanity metric | Fórmula pública, evidencia binaria y resultado reproducible |
| Afirmar soporte nativo no verificado | Separar compatibilidad universal de autodetección |

## Plan de implementación aprobado por evidencia

### Crear

- arquitectura vigente y ADR reales;
- gobernanza open source mínima;
- schema v3 y rutas de aprendizaje declarativas;
- matriz de compatibilidad con agentes;
- validadores y workflow sin dependencias;
- metodología AI Repository Score;
- página de aprendizaje y capacidades v3 del visor.

### Actualizar

- README, AGENTS, permisos, tests, runbook y contratos de contribución;
- catálogo y portal;
- roadmap hasta v5;
- versionado y changelog;
- adaptadores específicos existentes.

### Conservar sin cambios estructurales

- `LICENSE`;
- prompt maestro;
- rutas de los 29 activos;
- índices históricos y documentación operativa;
- HTML/CSS/JavaScript nativo y publicación desde la raíz.

### Eliminar

Ningún archivo en esta entrega. El código o CSS obsoleto solo se retirará cuando una validación demuestre que no tiene consumidores y el cambio no degrade compatibilidad.

## Criterio de salida de v3

v3 queda preparada cuando:

1. existe una arquitectura vigente respaldada por ADR;
2. el catálogo v3 es validable y conserva rutas;
3. gobernanza y políticas están enlazadas;
4. una única orden local ejecuta la calidad documental;
5. GitHub Actions ejecuta la misma orden;
6. el portal presenta metadatos, relaciones y aprendizaje desde fuentes canónicas;
7. el AI Repository Score produce un baseline repetible;
8. navegación y assets pasan validación bajo un subdirectorio equivalente a GitHub Pages.
