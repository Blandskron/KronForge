# Permisos del Agente (PERMISSIONS.md)

Este documento especifica qué acciones puede realizar un agente de IA en este repositorio y cuáles requieren aprobación humana explícita.

---

## 1. Permisos de Modificación (Escritura Libre)

El agente tiene permiso para modificar o crear los siguientes archivos como parte de tareas ordinarias (ej. corrección de estilo, adición de ejemplos, actualización de documentación):

- **Prompt maestro:** `prompts/agents-first-documentation-review.prompt.md`
- **Catálogo:** `library/**`
- **Ejemplos:** `examples/usage-example.md`
- **Sitio GitHub Pages:** `index.html`, carpeta `assets/` (CSS/JS) y carpeta `pages/` (HTML)
- **Automatización de calidad:** `scripts/`, `tests/`, `package.json` y `.github/workflows/`
- **Historial de Cambios:** `docs/CHANGELOG.md`
- **Instrucciones del Agente:** `AGENTS.md` y `docs/agent/*`
- **Guías de Agente:** `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`
- **Políticas y Directrices:** `PROMPT_VERSIONING.md`, documentación de arquitectura, ADR y estándares en `docs/`
- **Gobierno OSS:** `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `GOVERNANCE.md`, `MAINTAINERS.md`, `CODEOWNERS` y templates de colaboración

*Nota: Cualquier modificación a estos archivos debe registrarse con su respectivo cambio de versión en `CHANGELOG.md`.*

---

## 2. Acciones que Requieren Aprobación Humana

Las siguientes acciones son de alta sensibilidad y **nunca** deben realizarse sin la confirmación explícita del usuario:

- **Modificación de Licencia:** Cambiar, renombrar o eliminar el archivo `LICENSE`.
- **Incremento de Versión Mayor (Breaking Change):** Modificar el prompt de forma que rompa la compatibilidad con la estructura documental actual (requiere aprobación del usuario para la nueva estructura propuesta).
- **Cambio incompatible de schema:** retirar o reinterpretar campos públicos del catálogo sin migración, ADR y aprobación.
- **Eliminación de Archivos Core:** Eliminar carpetas principales como `prompts/`, `library/`, `examples/` o `docs/`.
- **Modificación de Tags o Commits:** Ejecutar comandos de Git destructivos como `git push --force` o borrar tags de versiones en el repositorio remoto.
