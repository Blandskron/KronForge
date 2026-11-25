# Esquema de Datos y Contratos

Este repositorio no tiene base de datos, API propia ni modelos persistentes. Aun así, documenta sus entidades conceptuales porque funciona como producto documental reusable.

## Entidades Conceptuales

### Prompt Maestro

- **Ubicación:** `prompts/agents-first-documentation-review.prompt.md`
- **Propósito:** instrucción universal para convertir repositorios en agents-first.
- **Consumidor:** agentes de IA usados por devs.
- **Regla de compatibilidad:** cambios estructurales deben versionarse según `PROMPT_VERSIONING.md`.

### Documento de Agente

- **Ejemplos:** `AGENTS.md`, `docs/agent/PERMISSIONS.md`, `docs/agent/TESTS.md`.
- **Propósito:** guiar agentes con instrucciones operativas y verificables.
- **Regla:** debe enlazar a documentos especializados y evitar comandos inventados.

### Skill

- **Ubicación:** `library/domains/<dominio>/skills/<nombre>/SKILL.md`
- **Propósito:** encapsular procedimientos repetibles.
- **Regla:** una skill define objetivo, uso, entradas, resultado, restricciones, procedimiento y relacionados.

### Activo del Catálogo

- **Ubicación:** `library/domains/<dominio>/<tipo>/`.
- **Tipos:** taxonomía extensible declarada en `typeDefinitions`, que incluye prompts, skills, hooks, subagentes, integraciones MCP, playbooks, checklists, templates, ADR, patrones, anti-patrones, runbooks, casos, referencias y formatos educativos.
- **Identidad:** ID estable `<dominio>.<slug>` en front matter.
- **Índice:** `library/catalog.json`, schema v3 validado por `library/schema/catalog-v3.schema.json`.
- **Descubrimiento:** identidad, clasificación, dificultad, compatibilidad, relaciones, contrato, mantenimiento, casos de uso y ruta.
- **Regla de compatibilidad:** estados y versiones siguen `PROMPT_VERSIONING.md`.

El Markdown es la fuente canónica. El catálogo proyecta metadatos para el portal y automatizaciones; no sustituye el cuerpo del activo.

### Ruta de Aprendizaje

- **Ubicación:** `learningPaths` en `library/catalog.json`.
- **Guía complementaria:** `library/learning-guidance.json` versión 1, indexada por ID de ruta. Se genera desde [la guía Markdown](../LEARNING_GUIDANCE.md). El catálogo v3 sigue definiendo la identidad y el orden de los activos.
- **Identidad:** ID estable y legible.
- **Contrato:** título, resumen y secuencia ordenada de IDs existentes.
- **Regla:** una ruta no duplica el activo ni crea dependencias implícitas; solo propone un orden pedagógico.

### Relación entre Activos

- `dependencies`: requisitos explícitos para aplicar el activo.
- `related`: conocimiento complementario sin relación de ejecución obligatoria.
- Toda referencia apunta a un ID existente y se valida automáticamente.

### Página Estática

- **Ubicación:** `index.html`, carpeta `assets/` (CSS/JS) y carpeta `pages/` (HTML).
- **Propósito:** presentar, buscar, filtrar, enlazar, copiar y descargar activos canónicos.
- **Regla:** debe funcionar sin build de producción y resolver correctamente el subdirectorio de GitHub Pages.

## Contratos de Contenido

### Prompt

El prompt debe conservar estas secciones conceptuales:

- Principios obligatorios.
- Auditoría inicial.
- Plan antes de cambios.
- Estructura agents-first recomendada.
- Limpieza documental segura.
- Validación final.
- Resumen final requerido.

### Changelog

- **Ubicación:** `docs/CHANGELOG.md`
- **Formato:** Keep a Changelog.
- **Versionado:** SemVer.

## Migraciones

No hay migraciones de base de datos. Los cambios de schema del catálogo sí requieren:

1. ADR cuando cambie el contrato arquitectónico;
2. actualización del JSON Schema, catálogo, portal y validadores;
3. versión SemVer y registro en changelog;
4. conservación explícita o deprecación de campos previos.

Los cambios de estructura documental deben registrarse como cambios de versión y reflejarse en README y la página estática cuando afecten la experiencia pública.
