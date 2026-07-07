# Versionado del Prompt

Este documento describe la estrategia de control de versiones y el ciclo de vida del prompt principal `prompts/agents-first-documentation-review.prompt.md` y de la biblioteca de prompts de validación interna en `prompts/quality/`.

---

## Estrategia de Versionado Semántico (SemVer)

Dado que este repositorio provee prompts como "producto", cualquier cambio o mejora en sus instrucciones se versiona bajo el estándar de **Versionado Semántico (vMAJOR.MINOR.PATCH)**:

### 1. MAJOR (`vX.0.0`)
Cambios significativos o estructurales que alteran de forma drástica el comportamiento esperado de la IA o la estructura final requerida.
* **Ejemplos:**
  * Modificación obligatoria del nombre del archivo raíz (ej. cambiar `AGENTS.md` por otro).
  * Reestructuración obligatoria de la carpeta `docs/agent/` agregando o quitando archivos requeridos por defecto.
  * Cambios drásticos en las reglas de seguridad o permisos del agente.
  * Eliminación de la biblioteca `prompts/quality/` completa o del prompt maestro.

### 2. MINOR (`v0.Y.0`)
Adición de nuevas funcionalidades, directrices opcionales o compatibilidades de stacks sin alterar la estructura obligatoria base.
* **Ejemplos:**
  * Añadir instrucciones específicas opcionales para un nuevo framework o tipo de repositorio.
  * Agregar una nueva plantilla opcional de skill bajo `skills/`.
  * **Incorporar nuevos prompts a la biblioteca `prompts/quality/`.**
  * Incorporar un nuevo archivo de instrucciones específicas como `GEMINI.md` o `.github/copilot-instructions.md`.

### 3. PATCH (`v0.0.Z`)
Mejoras menores de legibilidad, correcciones de traducción, orden de palabras, formato Markdown o correcciones ortográficas que no cambian las reglas lógicas del prompt.
* **Ejemplos:**
  * Corregir errores tipográficos en las instrucciones.
  * Mejorar la sintaxis de los bloques de código o de las listas.
  * Ajustes de redacción para mejorar la precisión del entendimiento por parte de modelos específicos de LLM.
  * Actualizar el índice `prompts/quality/README.md` sin agregar ni eliminar prompts.

---

## Versionado de la Biblioteca de Prompts de Calidad

Los prompts de `prompts/quality/` siguen el mismo esquema de versionado del repositorio:

- **Agregar un prompt nuevo:** MINOR.
- **Modificar reglas de un prompt existente** (nuevas restricciones, nuevas fases): MINOR.
- **Corregir redacción o formato** sin cambiar reglas: PATCH.
- **Eliminar un prompt** de la biblioteca: MINOR (con deprecación documentada preferible).
- **Cambiar la estructura de fases** de forma incompatible: MAJOR.

---

## Proceso para Registrar Cambios

Cada vez que realices una modificación al prompt principal o a la biblioteca:

1. **Actualiza el prompt o archivo:** Aplica los cambios directamente en el archivo correspondiente.
2. **Incrementa la versión:** De acuerdo con la guía SemVer de arriba, determina el nuevo número de versión.
3. **Registra en el CHANGELOG:** Abre `docs/CHANGELOG.md` y documenta los cambios de la nueva versión.
4. **Crea un Tag en Git (Opcional):** Si el repositorio está alojado en GitHub/GitLab, se recomienda crear un tag de git que coincida con la versión (ej. `git tag -a v1.5.0 -m "Versión 1.5.0"`).
