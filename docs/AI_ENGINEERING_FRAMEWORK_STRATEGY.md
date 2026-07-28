# Estrategia del Framework Abierto de AI Engineering

## Estado

- **Fecha:** 2026-07-28
- **Base evaluada:** arquitectura v2.0.0 aún no publicada.
- **Decisión:** evolucionar la biblioteca por dominios hacia un framework documental abierto de AI Engineering.
- **Siguiente entrega:** v2.1.0, portal y pilares estratégicos.

> [!IMPORTANT]
> Este documento es la compuerta arquitectónica de la evolución estratégica. Fue creado antes de modificar el catálogo, los contratos o el portal para esta fase.

## 1. Evaluación crítica del estado actual

La v2.0.0 estableció una base correcta:

- once dominios de ingeniería;
- catálogo JSON con 21 activos;
- prompts especializados migrados sin duplicación;
- contratos iniciales para ocho tipos de activo;
- skills normalizadas;
- documentación operativa y sitio estático sin build.

La base aún tiene límites frente a la nueva visión:

1. **AI Engineering no está desarrollado como sistema.** Existe un dominio general, pero no pilares autónomos para contexto, protocolos de herramientas, subagentes o workflows.
2. **El catálogo describe archivos, no una experiencia de aprendizaje.** No ofrece recorridos, niveles, casos de uso o puertas de entrada por problema.
3. **Los contratos son parciales.** Los prompts migrados tienen metadatos, pero su cuerpo no declara de manera uniforme dificultad, compatibilidad, entradas y ejemplo.
4. **Faltan tipos de conocimiento.** No están formalizados examples, case studies, best practices, tool integrations ni architecture notes.
5. **El portal sigue centrado en el prompt original.** La navegación por pestañas no representa dominios, tipos, roadmap ni contribución.
6. **No hay búsqueda global.** El usuario debe conocer el nombre del activo.
7. **No hay arquitectura explícita para MCP, subagentes, hooks o context engineering.**
8. **La comunidad carece de roadmap visible.** Existe versionado, pero no una secuencia pública de madurez.

No se recomienda crear decenas de carpetas o textos vacíos para simular cobertura. La evolución debe establecer pilares, contratos y activos de referencia suficientes para que la comunidad pueda crecer con calidad.

## 2. Nueva visión

Ser el framework documental abierto de referencia para diseñar y operar software AI-First, Human-Friendly y Model-Agnostic.

El proyecto combina:

- principios de ingeniería;
- conocimiento navegable;
- activos ejecutables;
- patrones y anti-patrones;
- recorridos de aprendizaje;
- contratos para colaboración humano-agente;
- un portal estático como puerta de entrada;
- gobernanza comunitaria verificable.

No es un runtime, un SDK ni una abstracción sobre modelos. Es una arquitectura de conocimiento y trabajo.

## 3. Misión

Ayudar a equipos y agentes a tomar mejores decisiones de software mediante contexto verificable, procesos reproducibles y activos reutilizables que reduzcan incertidumbre sin ocultar el juicio humano.

## 4. Objetivos estratégicos

1. Definir un lenguaje común para AI Engineering.
2. Organizar conocimiento por dominios que puedan evolucionar independientemente.
3. Convertir prompts y skills en activos con contratos explícitos.
4. Enseñar context engineering, sistemas de agentes, MCP, hooks y repository engineering desde principios universales.
5. Ofrecer rutas prácticas para proyectos nuevos, existentes y legados.
6. Mantener una sola fuente de verdad en Markdown y un índice consumible por agentes.
7. Hacer que GitHub Pages sea un portal técnico, no una copia del README.
8. Facilitar contribuciones sin degradar consistencia ni navegabilidad.
9. Conservar compatibilidad, seguridad y revisión humana como propiedades del producto.

## 5. Público objetivo

| Público | Necesidad principal |
|---|---|
| Desarrolladores | aplicar activos concretos sin estudiar todo el framework |
| Tech leads y arquitectos | establecer prácticas y límites compartidos |
| Equipos de plataforma | integrar agentes, herramientas y workflows con seguridad |
| Equipos de producto y UX | incorporar IA sin perder experiencia humana |
| Maintainers open source | aceptar conocimiento reusable con gobernanza clara |
| Estudiantes y formadores | seguir rutas progresivas con conceptos y práctica |
| Agentes de IA | descubrir contexto, entradas, restricciones y resultados esperados |

## 6. Principios

- **AI First:** diseñar para colaboración con IA desde el inicio.
- **Human Friendly:** mantener comprensión, revisión y decisión humanas.
- **Open:** formatos abiertos, enlaces públicos y gobernanza visible.
- **Minimal:** cada activo justifica su existencia.
- **Modular:** los dominios y activos evolucionan de forma localizada.
- **Model Agnostic:** ninguna capacidad central depende de un proveedor.
- **Context Driven:** el contexto se diseña, enruta, comprime y valida.
- **Knowledge Driven:** las decisiones reutilizan conocimiento versionado.
- **Documentation Driven:** los contratos importantes son visibles y revisables.
- **Future Proof:** tecnologías concretas son adaptadores, no el núcleo.

## 7. Arquitectura de información

El framework conserva cuatro capas y agrega una quinta:

1. **Orientación:** visión, quick start, getting started y recorridos.
2. **Conocimiento:** dominios, conceptos, patrones y referencias.
3. **Ejecución:** prompts, skills, playbooks, templates y checklists.
4. **Gobernanza:** contribución, versionado, roadmap, changelog y validación.
5. **Portal:** búsqueda, navegación, filtros, breadcrumbs y lectura de fuentes canónicas.

```txt
README / Portal
        |
        +-- Getting Started y recorridos
        |
        +-- library/catalog.json
                 |
                 +-- domains/<domain>/README.md
                         |
                         +-- activos ejecutables
                         +-- conocimiento explicativo
                         +-- ejemplos y referencias
```

## 8. Taxonomía completa

### Pilares de AI Engineering

| Dominio | Alcance |
|---|---|
| `ai-agent-engineering` | agentes, evaluación, memoria, RAG, integración LLM y prompt engineering |
| `context-engineering` | capas, mapas, routing, compresión, ventanas, retrieval y grafos |
| `repository-engineering` | repositorios AI-First, módulos, instrucciones, contexto y mantenimiento |
| `mcp-integration` | MCP, tools, resources, prompts, servidores, clientes y seguridad |
| `hooks-workflows` | hooks, automatización, validación, notificaciones y workflows |

### Ingeniería de software

| Dominio | Alcance |
|---|---|
| `architecture` | decisiones, DDD, microservicios, monolitos modulares y eventos |
| `software-development` | backend, frontend, APIs, integración y refactoring |
| `data` | bases de datos, contratos, migraciones y pipelines |
| `quality-engineering` | testing, QA, revisión y criterios de cierre |
| `security` | AppSec, IAM, secretos, threat modeling y supply chain |
| `delivery-platform` | DevOps, cloud, CI/CD, contenedores e infraestructura |
| `reliability-performance` | observabilidad, resiliencia, incidentes y rendimiento |
| `experience-accessibility` | UX, UI, accesibilidad, SEO y arquitectura de información |
| `product-technical-management` | product engineering, planificación y technical leadership |
| `documentation-knowledge` | documentación, conocimiento, runbooks y referencias |

Backend, frontend, DDD, RAG o subagentes son áreas navegables dentro de un dominio, no carpetas raíz obligatorias. Se convierten en subdominios solo si el volumen demuestra esa necesidad.

## 9. Estructura de carpetas

```txt
library/
  catalog.json
  domains/
    <domain>/
      README.md
      prompts/
      skills/
      playbooks/
      templates/
      checklists/
      patterns/
      anti-patterns/
      examples/
      case-studies/
      best-practices/
      references/
      tool-integrations/
      architecture-notes/
```

Las subcarpetas se crean únicamente cuando contienen un activo real.

## 10. Contrato común

Todo activo declara:

- ID, título, resumen, tipo, dominio, estado y versión;
- dificultad: `foundation`, `intermediate` o `advanced`;
- alcance o tipos de proyecto;
- compatibilidad universal y adaptadores opcionales;
- tags y relaciones;
- entradas, salida y restricciones cuando sea ejecutable.

Los tipos adicionales son:

- `example`;
- `case-study`;
- `best-practice`;
- `tool-integration`;
- `architecture-note`.

## 11. Estrategia de documentación

- Markdown canónico y portable.
- Índices breves; profundidad en activos especializados.
- Un concepto tiene una fuente principal.
- Los recorridos enlazan activos, no los copian.
- Cada dominio explica alcance, límites, mapa de aprendizaje y activos.
- Cada afirmación tecnológica importante enlaza evidencia local o fuente primaria.
- Los documentos distinguen principios estables de integraciones cambiantes.

## 12. Estrategia de prompts

Cada prompt debe incluir o declarar:

1. objetivo;
2. contexto y problema;
3. entradas;
4. resultado esperado;
5. dificultad;
6. tipos de proyecto;
7. compatibilidad y modelos;
8. restricciones;
9. buenas prácticas;
10. ejemplo mínimo;
11. versión y relacionados.

`models: [any]` expresa compatibilidad agnóstica. Nombrar proveedores solo es válido en una integración opcional.

## 13. Estrategia de skills

Cada skill añade a su contrato actual:

- problema que resuelve;
- dependencias verificables;
- casos de uso;
- ejemplo de aplicación.

Las skills no deben ocultar acciones destructivas, depender de herramientas inexistentes ni duplicar un playbook completo.

## 14. Estrategia de playbooks

Los playbooks son procesos ejecutables:

- precondiciones;
- diagnóstico;
- fases;
- decisiones y responsables;
- validaciones;
- rollback;
- evidencia;
- criterios de salida.

Los primeros recorridos prioritarios serán: repositorio AI-First, sistema legado, onboarding técnico, arquitectura, seguridad y despliegue.

## 15. Estrategia de Context Engineering

Context Engineering será un pilar independiente con cuatro capas:

1. **Fuentes:** repositorio, conversación, herramientas, memoria y retrieval.
2. **Selección:** mapas, routing, relevancia, permisos y vigencia.
3. **Transformación:** compresión, resumen, chunking y normalización.
4. **Entrega:** ventanas, orden, formato, presupuesto y validación.

Los activos deben optimizar utilidad y confiabilidad, no solo cantidad de tokens.

## 16. Estrategia de Repository Engineering

El dominio enseñará a:

- diseñar entradas para humanos y agentes;
- ubicar instrucciones por alcance;
- organizar módulos y ownership;
- reducir contexto repetido;
- mantener comandos verificables;
- construir catálogos y skills;
- validar enlaces, contratos y obsolescencia;
- sostener el repositorio durante años.

## 17. Estrategia de sistemas de agentes y subagentes

Subagentes se tratarán como arquitectura, no como truco de prompting:

- contrato de tarea;
- especialización;
- autoridad y permisos;
- coordinación y jerarquía;
- entrega de evidencia;
- memoria compartida;
- control de concurrencia;
- resolución de conflictos;
- criterios para no delegar.

El patrón inicial será delegación por contrato con salida verificable.

## 18. Estrategia de MCP

El dominio MCP separará:

- fundamentos y modelo cliente-servidor;
- tools, resources y prompts;
- descubrimiento y negociación;
- autenticación, autorización y consentimiento;
- límites de confianza y datos;
- diseño de servidores y clientes;
- observabilidad y troubleshooting;
- integraciones específicas como capas opcionales.

El framework no duplicará la especificación. Enlazará fuentes oficiales y enseñará decisiones de arquitectura y seguridad.

## 19. Estrategia de hooks y workflows

Los hooks se organizan por momento:

- pre-task;
- post-task;
- validation;
- documentation;
- testing;
- deployment;
- notification.

Cada hook declara trigger, entradas, efectos, idempotencia, timeout, fallo, retry, permisos y evidencia. Los hooks no deben esconder mutaciones ni sustituir gates humanos.

## 20. Estrategia de GitHub Pages

El portal seguirá siendo HTML, CSS y JavaScript vanilla:

- shell accesible y responsive;
- navegación lateral agrupada;
- breadcrumbs;
- página principal orientada a la visión;
- quick start y getting started;
- explorador de dominios;
- biblioteca con búsqueda y filtros;
- visor de activos desde Markdown canónico;
- páginas de playbooks, roadmap, contribución y changelog;
- modo oscuro persistente;
- SEO, Open Graph y anclas;
- estado vacío y errores comprensibles;
- mejora progresiva sin build.

`library/catalog.json` alimentará dominios, tipos, estados y búsqueda. El contenido no se duplicará en JavaScript.

## 21. Estrategia de navegación

Tres rutas de entrada:

- **por objetivo:** analizar, diseñar, construir, modernizar, operar;
- **por dominio:** contexto, agentes, arquitectura, seguridad, etc.;
- **por tipo:** prompt, skill, playbook, template, patrón.

La búsqueda indexará ID, título, resumen, dominio, tipo y tags. Los breadcrumbs mostrarán posición conceptual aunque la aplicación use navegación por hash.

## 22. Estrategia de versionado

- SemVer por activo.
- SemVer global por releases del framework.
- `draft`, `stable` y `deprecated`.
- schema version independiente para `catalog.json`.
- migraciones documentadas cuando cambie el schema.
- rutas estables o deprecación antes de retiro.
- changelog global y, cuando el volumen lo requiera, historial por dominio.

## 23. Estrategia de comunidad

- guía única de contribución;
- plantillas de issues y pull requests en una fase posterior;
- revisión por contrato y dominio;
- owners cuando exista comunidad suficiente;
- decisiones estructurales mediante ADR;
- criterios públicos de madurez;
- ejemplos pequeños antes que documentación aspiracional.

## 24. Roadmap

### v1 — Prompt y estándar agents-first

Prompt maestro, documentación operativa y primera web.

### v2.0 — Biblioteca por dominios

Catálogo, tipos de activo, migración y contratos iniciales.

### v2.1 — Portal y pilares AI Engineering

- Context Engineering, Repository Engineering, MCP y Hooks/Workflows.
- arquitectura de subagentes.
- catálogo enriquecido.
- búsqueda, dominios, breadcrumbs, roadmap y contribución en la web.
- contrato editorial ampliado.

### v2.2 — Recorridos y profundidad

- modernización de legado;
- onboarding técnico;
- seguridad y despliegue;
- examples y case studies;
- evaluación de agentes y RAG;
- troubleshooting MCP.

### v3 — Comunidad y automatización

- validadores automatizados del catálogo;
- generación controlada de índices;
- plantillas de contribución;
- métricas de cobertura y frescura;
- releases de activos.

### v4 — Ecosistema interoperable

- paquetes consumibles por agentes;
- integraciones opcionales con herramientas;
- perfiles de organización;
- traducciones;
- versionado múltiple del portal.

## 25. Riesgos

| Riesgo | Mitigación |
|---|---|
| Nombre “framework” sugiere runtime | Definirlo siempre como framework documental |
| Cobertura superficial por exceso de dominios | Crear activos solo por prioridad y evidencia |
| Taxonomía inestable | Mantener dominios amplios y áreas como facetas |
| Contenido desactualizado | Fecha de revisión, estados y deprecación |
| Portal convertido en segunda fuente | Cargar catálogo y Markdown canónicos |
| Búsqueda poco útil | Indexar metadatos y ofrecer filtros |
| Integraciones acopladas a proveedores | Separarlas en `tool-integrations/` |
| Hooks o MCP inseguros | Contratos de permisos, efectos y evidencia |
| Delegación excesiva | Patrón explícito de cuándo no usar subagentes |

## 26. Beneficios

- lenguaje común para equipos y agentes;
- aprendizaje progresivo y aplicación inmediata;
- menor dependencia de modelos o herramientas;
- activos con contratos verificables;
- crecimiento comunitario sin carpetas planas;
- portal profesional basado en una única fuente de verdad;
- mayor seguridad en contextos, herramientas y automatización;
- arquitectura preparada para evolución de largo plazo.

## 27. Recomendaciones de implementación

1. Implementar v2.1 sin mover los 21 activos existentes.
2. Agregar cuatro dominios pilares y un conjunto pequeño de activos fundacionales.
3. Elevar `catalog.json` a schema v2 con metadatos de descubrimiento.
4. Reemplazar la pestaña de prompts por un explorador unificado.
5. Añadir recorridos y case studies en v2.2, no como relleno en v2.1.
6. Mantener GitHub Pages sin build y validar cada ruta por HTTP.
7. Medir calidad por reutilización, enlaces válidos y evidencia, no por cantidad de archivos.

## 28. Criterios de aceptación de v2.1

- existen los cuatro nuevos dominios estratégicos con activos fundacionales;
- subagentes, MCP, hooks y context engineering tienen arquitectura y límites explícitos;
- catálogo schema v2 describe descubrimiento y compatibilidad;
- portal ofrece inicio, quick start, dominios, biblioteca, roadmap y contribución;
- búsqueda y filtros funcionan con teclado y móvil;
- breadcrumbs y enlaces cruzados no dependen de contenido duplicado;
- README, AGENTS, roadmap, versionado y changelog son coherentes;
- validaciones documentales, de catálogo, JavaScript y sitio terminan sin errores bloqueantes.
