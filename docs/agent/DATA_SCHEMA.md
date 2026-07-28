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
- **Tipos:** prompt, skill, template, checklist, playbook, pattern, anti-pattern y reference.
- **Identidad:** ID estable `<dominio>.<slug>` en front matter.
- **Índice:** `library/catalog.json`, actualmente schema v2.
- **Descubrimiento:** título, resumen, dificultad, tags, dominio, tipo y ruta.
- **Regla de compatibilidad:** estados y versiones siguen `PROMPT_VERSIONING.md`.

### Página Estática

- **Ubicación:** `index.html`, carpeta `assets/` (CSS/JS) y carpeta `pages/` (HTML).
- **Propósito:** presentar la biblioteca y permitir copiar activos canónicos.
- **Regla:** debe funcionar sin build system.

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

No hay migraciones de datos.

Los cambios de estructura documental deben registrarse como cambios de versión y reflejarse en README, AGENTS y la página estática cuando afecten la experiencia pública.
