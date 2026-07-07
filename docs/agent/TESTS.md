# Pruebas y Validación (TESTS.md)

Al ser este un repositorio de prompts, documentación y sitio estático, no cuenta con una suite de pruebas automatizadas de aplicación. Sin embargo, cada cambio debe validarse mediante los siguientes pasos.

---

## 1. Validaciones Obligatorias del Repositorio

### 1.1 Verificación de Enlaces e Integridad de Archivos

Cualquier cambio en la estructura documental debe validar que todos los enlaces internos funcionen correctamente:

- Comprueba que todos los enlaces en Markdown que usan rutas relativas apunten a archivos existentes.
- **Rutas críticas a verificar:**
  - Los enlaces desde `AGENTS.md` a `docs/agent/*`, `prompts/quality/README.md` y `README.md`.
  - Los enlaces desde `README.md` a `prompts/agents-first-documentation-review.prompt.md`, `prompts/quality/`, `examples/usage-example.md`, `PROMPT_VERSIONING.md` y `docs/CHANGELOG.md`.
  - Los enlaces desde `prompts/quality/README.md` a cada prompt de la biblioteca.
  - Los enlaces desde `index.html` e `index.js` a archivos que se cargan vía fetch.

### 1.2 Validación de Formato Markdown

Asegúrate de que el formato Markdown esté limpio y sea compatible con cualquier parser estándar:

- Revisa que todos los bloques de código (triple backtick) estén cerrados correctamente.
- Comprueba la jerarquía de títulos (`#`, `##`, `###`).
- Verifica que las tablas Markdown estén correctamente formateadas.
- Verifica que no existan listas con niveles de indentación inconsistentes.

### 1.3 Consistencia Semántica y de Versión

Antes de dar por concluido un cambio:

- Comprueba que la versión en `docs/CHANGELOG.md` coincide con las reglas de `PROMPT_VERSIONING.md`.
- Asegura que no se hayan introducido enlaces a archivos inexistentes.
- Asegura que no haya referencias a plataformas o herramientas específicas que no existan en el repositorio.

---

## 2. Validación de Prompts de Calidad (`prompts/quality/`)

Cada prompt en `prompts/quality/` debe cumplir los siguientes criterios antes de considerarse apto:

### Checklist de Validación de Prompts

- [ ] **Universal y agnóstico al stack.** El prompt no menciona lenguajes, frameworks, gestores de paquetes ni herramientas específicas como obligatorios. Solo como ejemplos detectables.
- [ ] **Lee antes de modificar.** El prompt obliga explícitamente al agente a leer el repositorio en una fase de solo lectura antes de proponer cambios.
- [ ] **Sin comandos inventados.** El prompt prohíbe explícitamente inventar comandos. Obliga a detectarlos desde manifests, CI, Makefile o documentación existente.
- [ ] **Plan antes de ejecutar.** El prompt exige presentar un plan con hallazgos y riesgos antes de modificar archivos.
- [ ] **Aprobación humana para cambios sensibles.** El prompt indica explícitamente cuándo esperar aprobación humana.
- [ ] **Sin relajar pruebas.** El prompt prohíbe eliminar, desactivar o relajar tests para hacer pasar validaciones.
- [ ] **Sin secretos.** El prompt prohíbe imprimir o copiar valores reales de secretos, credenciales o variables de entorno.
- [ ] **Evidencia final.** El prompt exige entregar un resumen con comandos ejecutados, hallazgos, riesgos y pendientes.
- [ ] **Fases separadas.** El prompt divide claramente: lectura → diagnóstico → plan → ejecución → evidencia.
- [ ] **Fallback documentado.** Si algo no puede determinarse con evidencia local, el prompt indica usar: `Pendiente de confirmar: ...`

### Consistencia del Índice

- [ ] Cada prompt nuevo está listado en `prompts/quality/README.md`.
- [ ] Cada prompt nuevo está referenciado en `README.md`.
- [ ] Los prompts nuevos relevantes están incorporados en `AGENTS.md` o en la documentación del sitio.

---

## 3. Validación Operativa del Sitio Estático

Antes de publicar cambios en la página:

1. Servir la raíz del repositorio con un servidor HTTP local.
2. Confirmar que `index.html` cargue sin errores de consola.
3. Verificar que la pestaña del prompt cargue `prompts/agents-first-documentation-review.prompt.md`.
4. Verificar que la nueva sección de prompts de calidad esté visible y funcional.
5. Confirmar que el botón de copiar use el contenido visible del prompt activo.
6. Verificar navegación por hash: `#prompt`, `#quality`, `#structure`, `#models`, `#example`, `#versioning`.
