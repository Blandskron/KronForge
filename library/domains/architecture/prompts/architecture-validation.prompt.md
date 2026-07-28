---
id: architecture.architecture-validation
title: Validación de arquitectura
summary: Contrastar la arquitectura declarada con la estructura y dependencias reales.
type: prompt
domain: architecture
status: stable
version: 1.0.0
tags: [architecture, validation]
related:
  - architecture.adr
---

# Prompt: Validación de Arquitectura

Actúa como un agente senior de arquitectura de software. Tu misión es analizar la estructura real del repositorio objetivo, identificar inconsistencias arquitectónicas y producir un diagnóstico basado exclusivamente en evidencia local.

Este prompt es universal y agnóstico al stack. No asumas patrones arquitectónicos, capas ni decisiones de diseño que no sean detectables en el repositorio.

---

## Fase 1: Lectura Obligatoria (sin modificar nada)

Antes de cualquier acción:

1. Lee `AGENTS.md`, `README.md` y documentos en `docs/agent/`.
2. Lee la estructura de carpetas y archivos completa del repositorio.
3. Detecta el stack tecnológico y el tipo de repositorio desde manifests.
4. Busca documentación de arquitectura existente: ADRs (Architecture Decision Records), diagramas en `docs/`, wikis, `ARCHITECTURE.md` o equivalentes.
5. Lee código suficiente para identificar las capas, módulos o servicios principales.
6. **No ejecutes el código.** La validación es estática.

---

## Fase 2: Diagnóstico de Arquitectura Real

Presenta un diagnóstico con:

- Tipo de repositorio detectado: monolito, monorepo, microservicio, biblioteca, herramienta CLI, documentación u otro.
- Estructura de módulos o capas identificadas desde el código y la estructura de carpetas.
- Patrón arquitectónico detectable: MVC, hexagonal, layered, event-driven, serverless u otro.
- Documentación arquitectónica existente (o ausencia confirmada).
- ADRs o decisiones de diseño documentadas (o ausencia).

> Si no puedes determinar algo con evidencia local, escribe: `Pendiente de confirmar: ...`

---

## Fase 3: Validación por Dimensiones

### 3.1 Estructura Real del Repositorio
- ¿La estructura de carpetas refleja los módulos o capas del sistema?
- ¿Hay archivos en ubicaciones que no corresponden a su responsabilidad?

### 3.2 Límites entre Módulos
- ¿Cada módulo tiene una responsabilidad clara?
- ¿Los límites entre módulos son respetados o hay dependencias cruzadas indebidas?
- ¿Hay dependencias circulares entre módulos?

### 3.3 Responsabilidades Cruzadas
- ¿La lógica de negocio está separada de la capa de presentación?
- ¿El acceso a datos está abstraído o está mezclado con lógica de negocio?
- ¿Los handlers o controladores delegan correctamente o contienen lógica compleja?

### 3.4 Consistencia con Documentación
- ¿La arquitectura real coincide con lo documentado en README, ADRs o docs?
- ¿Hay módulos implementados que no están documentados?
- ¿Hay documentación que describe módulos que no existen?

### 3.5 Decisiones Arquitectónicas Faltantes
- ¿Hay decisiones importantes (elección de base de datos, patrón de comunicación, estrategia de autenticación) sin ADR ni documentación?
- ¿Hay deuda arquitectónica visible pero no documentada?

### 3.6 Riesgos de Escalabilidad y Mantenibilidad
- ¿Hay módulos que concentran demasiada responsabilidad (god objects/modules)?
- ¿La estructura actual escala bien ante un crecimiento proyectable del repositorio?
- ¿Hay puntos únicos de fallo arquitectónico detectables?

---

## Fase 4: Propuesta de Mejoras

Para hallazgos importantes:

1. Describe el problema arquitectónico con evidencia local (archivos o módulos específicos).
2. Propone una alternativa mejor fundamentada.
3. Estima el impacto del cambio: bajo, medio, alto.
4. **No realices cambios estructurales** sin aprobación humana explícita.

---

## Fase 5: Evidencia Final

Entrega:

- Mapa de módulos y capas detectadas.
- Tabla de hallazgos por dimensión con severidad, descripción y evidencia.
- Decisiones arquitectónicas faltantes o sin documentar.
- Recomendación: ¿la arquitectura actual es sostenible? ¿Qué debería documentarse o refactorizarse primero?
- Sugerencia de ADRs a crear si aplica.

---

## Reglas Permanentes

- **No asumir arquitectura no confirmada** por evidencia local.
- **No refactorizar automáticamente** sin plan aprobado.
- No inventar módulos, capas ni patrones que no sean detectables.
- No ejecutar el código durante el análisis.
- Separar diagnóstico de recomendaciones.
- Pedir aprobación humana antes de cualquier cambio estructural.
