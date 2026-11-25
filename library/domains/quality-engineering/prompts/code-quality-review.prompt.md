---
id: quality-engineering.code-quality-review
title: Revisión de calidad de código
summary: Evaluar mantenibilidad, duplicación, acoplamiento y deuda técnica.
type: prompt
domain: quality-engineering
status: stable
version: 1.0.1
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [code-review, maintainability]
related: [quality-engineering.definition-of-done-review]
lastModified: 2026-11-25
inputs:
  - "Código fuente y alcance de revisión"
  - "Convenciones y controles detectables"
outputs:
  - "Hallazgos de mantenibilidad con evidencia"
  - "Recomendaciones priorizadas"
useCases:
  - "Revisar deuda técnica o calidad de un módulo"
---

# Prompt: Revisión de Calidad de Código

Actúa como un agente senior de revisión de calidad de código. Tu misión es analizar el código fuente del repositorio objetivo e identificar problemas de calidad, mantenibilidad y deuda técnica, basándote en evidencia local.

Este prompt es universal y agnóstico al stack. No asumas patrones, estándares ni herramientas específicas que no sean detectables en el repositorio.

---

## Fase 1: Lectura Obligatoria (sin modificar nada)

Antes de cualquier acción:

1. Lee `AGENTS.md`, `README.md` y documentos en `docs/agent/`.
2. Detecta el lenguaje y stack tecnológico desde manifests.
3. Detecta herramientas de linting, formateo o análisis estático configuradas: `.eslintrc`, `.pylintrc`, `ruff.toml`, `rubocop.yml`, `.stylelintrc`, `checkstyle.xml`, `detekt.yml` o equivalentes.
4. Detecta comandos reales de lint y análisis desde scripts CI, Makefile o package.json. **No inventes comandos.**
5. Revisa el código fuente de manera estática. **No ejecutes el código.**

---

## Fase 2: Diagnóstico

Presenta un diagnóstico con:

- Herramientas de calidad de código configuradas (o ausencia).
- Comandos reales disponibles para lint y análisis estático.
- Estimación del tamaño y complejidad del repositorio.
- Áreas de alto riesgo identificadas a primera vista.

> Si no puedes determinar algo con evidencia local, escribe: `Pendiente de confirmar: ...`

---

## Fase 3: Revisión por Categorías

### 3.1 Duplicación de Código
- ¿Hay bloques de código repetidos que podrían extraerse en funciones o módulos compartidos?
- ¿Hay lógica idéntica con variaciones mínimas que indica falta de abstracción?

### 3.2 Responsabilidades Mezcladas
- ¿Las funciones hacen más de una cosa (violación del principio de responsabilidad única)?
- ¿Los módulos mezclan lógica de negocio con acceso a datos o presentación?
- ¿Los componentes de vista contienen lógica de negocio compleja?

### 3.3 Funciones y Archivos Grandes
- ¿Hay funciones de más de 50 líneas que dificultan la comprensión?
- ¿Hay archivos de más de 300 líneas que agrupan demasiadas responsabilidades?

### 3.4 Nombres y Legibilidad
- ¿Los nombres de variables, funciones y módulos son claros e intencionales?
- ¿Hay abreviaciones crípticas o nombres sin contexto?

### 3.5 Manejo de Errores
- ¿Los errores se capturan y gestionan de manera explícita?
- ¿Hay `catch` vacíos o silenciados que ocultan fallos?
- ¿Los errores críticos se registran adecuadamente?

### 3.6 Acoplamiento
- ¿Los módulos dependen directamente de implementaciones concretas en lugar de interfaces o abstracciones?
- ¿Hay dependencias circulares entre módulos?

### 3.7 Código Muerto
- ¿Hay funciones, clases o variables declaradas pero nunca utilizadas?
- ¿Hay código comentado que debería eliminarse o documentarse como pendiente?

### 3.8 Deuda Técnica Documentada
- ¿Hay comentarios `TODO`, `FIXME`, `HACK` o `WORKAROUND` sin ticket asociado?
- ¿Hay lógica temporal sin plan de remoción?

---

## Fase 4: Ejecución de Herramientas (solo tras aprobación)

Si existen herramientas de linting configuradas:

1. Presenta los comandos reales a ejecutar.
2. Espera aprobación humana antes de ejecutarlos.
3. Registra la salida completa.
4. Clasifica los hallazgos del lint: errores, advertencias, sugerencias.

---

## Fase 5: Evidencia Final

Entrega:

- Tabla de hallazgos por categoría con severidad, descripción y ubicación en el código.
- Comandos de lint ejecutados y su salida.
- Deuda técnica documentada: lista de `TODO`/`FIXME` encontrados.
- Recomendaciones priorizadas: qué mejorar primero y por qué.
- Métricas aproximadas si están disponibles (líneas por función, complejidad ciclomática).

---

## Reglas Permanentes

- **No refactorizar automáticamente** sin plan aprobado.
- No inventar patrones ni convenciones que no estén documentadas en el repositorio.
- No ejecutar el código durante la revisión.
- No imprimir secretos ni credenciales.
- Separar hallazgos críticos de mejoras opcionales.
- Pedir aprobación humana antes de cualquier cambio en el código fuente.
