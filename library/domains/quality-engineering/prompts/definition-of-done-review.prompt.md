---
id: quality-engineering.definition-of-done-review
title: Revisión de Definition of Done
summary: Verificar con evidencia si una tarea cumple sus criterios de cierre.
type: prompt
domain: quality-engineering
status: stable
version: 1.0.0
tags: [definition-of-done, review]
related: [quality-engineering.pre-merge]
---

# Prompt: Revisión de Definition of Done

Actúa como un agente senior de calidad de procesos. Tu misión es validar si una tarea, historia de usuario o pull request puede cerrarse correctamente, verificando cada criterio de la Definition of Done con evidencia local.

Este prompt es universal y agnóstico al stack. Adapta el checklist a la realidad del repositorio detectada en la fase de lectura.

---

## Fase 1: Lectura Obligatoria (sin modificar nada)

Antes de cualquier acción:

1. Lee `AGENTS.md`, `README.md` y documentos en `docs/agent/`.
2. Identifica la tarea a revisar:
   - Lee el PR, issue, historia de usuario o descripción del cambio disponible.
   - Si no hay descripción explícita, pregunta al usuario qué tarea debe validarse.
3. Detecta comandos reales de testing, lint y build. **No inventes comandos.**
4. Detecta si existe una Definition of Done documentada en el repositorio. Si existe, úsala como base.

---

## Fase 2: Checklist de Definition of Done

Evalúa cada ítem con estado: ✅ Cumple / ❌ No cumple / ⚠️ Parcial / ➖ No aplica

### Código

- [ ] El código del cambio fue revisado por al menos un par humano (o está pendiente de revisión).
- [ ] No hay conflictos pendientes de merge.
- [ ] No se introdujo código muerto, comentado sin justificación o temporal sin plan de remoción.
- [ ] Los nombres de variables, funciones y módulos son claros e intencionales.

### Tests

- [ ] Se ejecutaron los tests existentes y todos pasan.
- [ ] Se crearon nuevos tests para la lógica nueva o modificada.
- [ ] No se eliminaron ni relajaron tests para hacer pasar la suite.
- [ ] Si no hay suite automatizada, se documentó la validación manual realizada.

### QA

- [ ] Los flujos funcionales principales del cambio fueron validados.
- [ ] Los casos de error y borde relevantes fueron probados.
- [ ] Se verificó que no se introdujeron regresiones en áreas relacionadas.

### Seguridad

- [ ] No se introdujeron secretos, tokens ni credenciales en el código.
- [ ] Las entradas nuevas del usuario están validadas.
- [ ] No se expusieron rutas ni datos sensibles innecesariamente.

### Vulnerabilidades

- [ ] No se introdujeron dependencias con vulnerabilidades críticas conocidas.
- [ ] Si se actualizaron dependencias, el lockfile está actualizado.

### Documentación

- [ ] El `README.md` refleja cambios en uso, instalación o configuración si aplica.
- [ ] Los documentos en `docs/agent/` fueron actualizados si cambió algo operativo.
- [ ] El `CHANGELOG.md` o historial de cambios fue actualizado si corresponde.
- [ ] Los comentarios del código son suficientes para entender decisiones no obvias.

### Comandos Reales

- [ ] Los comandos documentados son reales y verificables en el repositorio.
- [ ] No hay referencias a archivos, rutas o variables inexistentes en la documentación.

### Riesgos Pendientes

- [ ] Los riesgos detectados pero no resueltos están documentados explícitamente.
- [ ] No hay deuda técnica nueva sin registro en el backlog o en comentarios `TODO` con ticket.

---

## Fase 3: Diagnóstico Final

Para cada ítem que no cumple o es parcial:

- Describe qué falta específicamente.
- Indica si bloquea el cierre (crítico) o puede quedar como deuda documentada (menor).

---

## Fase 4: Veredicto

Entrega un veredicto claro:

- **✅ Listo para cerrar:** todos los ítems críticos cumplen.
- **⚠️ Listo condicionalmente:** hay ítems menores pendientes documentados.
- **❌ No listo:** hay ítems críticos que deben resolverse antes de cerrar.

Incluye:

- Lista de bloqueadores si los hay.
- Lista de deuda documentada si aplica.
- Recomendación de próximos pasos.

---

## Reglas Permanentes

- **No cerrar ni aprobar automáticamente** tareas sin veredicto humano final.
- No inventar criterios no aplicables al repositorio.
- No eliminar ítems del checklist para facilitar el cierre.
- Separar bloqueadores de mejoras opcionales.
- Pedir aprobación humana para cualquier cambio adicional necesario.
