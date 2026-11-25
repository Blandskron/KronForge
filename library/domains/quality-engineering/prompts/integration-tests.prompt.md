---
id: quality-engineering.integration-tests
title: Tests de integración
summary: Diseñar o mejorar pruebas entre módulos y servicios con evidencia local.
type: prompt
domain: quality-engineering
status: stable
version: 1.0.1
difficulty: intermediate
projects: [application, service, library, monorepo]
compatibility: model-agnostic
models: [any]
tags: [testing, integration-tests]
related: [quality-engineering.unit-tests]
lastModified: 2026-11-25
inputs:
  - "Componentes e interfaces observables"
  - "Configuración y suite de integración existentes"
outputs:
  - "Diagnóstico de cobertura entre componentes"
  - "Pruebas y resultados cuando corresponda"
useCases:
  - "Cubrir interacciones entre módulos y servicios"
---

# Prompt: Tests de Integración

Actúa como un agente senior de ingeniería de software especializado en testing de integración. Tu misión es revisar el repositorio objetivo y, si corresponde, crear o mejorar tests de integración basados en evidencia local.

Este prompt es universal y agnóstico al stack. No asumas framework, base de datos, broker de mensajes, proveedor cloud ni arquitectura. Detecta la realidad del repositorio antes de actuar.

---

## Fase 1: Lectura Obligatoria (sin modificar nada)

Antes de cualquier acción:

1. Lee `AGENTS.md`, `README.md` y documentos en `docs/agent/`.
2. Detecta el stack desde manifests del proyecto (`package.json`, `pyproject.toml`, `go.mod`, `pom.xml`, `Cargo.toml`, `composer.json` o equivalentes).
3. Detecta servicios externos reales: bases de datos, APIs, brokers, caches, archivos externos.
4. Detecta el framework de testing de integración desde CI (`.github/workflows/`, `Jenkinsfile`, `gitlab-ci.yml`), Makefile, scripts de arranque o documentación.
5. Identifica si ya existen tests de integración: carpetas `integration/`, `e2e/`, `test/integration/`, archivos con sufijos `*.integration.*` o `*.e2e.*`.
6. Lee los tests existentes sin modificarlos.
7. Detecta comandos reales disponibles para levantar dependencias locales: Docker Compose, scripts de seed, mocks de servidor. **No inventes comandos.**

---

## Fase 2: Diagnóstico

Presenta un diagnóstico con:

- Stack tecnológico y framework de testing de integración detectados (o ausencia confirmada).
- Servicios externos involucrados y cómo se gestionan en ambiente local o CI.
- Tests de integración existentes: cantidad, qué cubren, qué no cubren.
- Puntos de integración críticos sin cobertura: llamadas entre módulos, contratos de API, transacciones, eventos.
- Dependencias que impiden tests de integración en local sin infraestructura adicional.
- Riesgos: tests que dependen de entornos no reproducibles, flakiness, falta de fixtures.

> Si no puedes determinar algo con evidencia local, escribe: `Pendiente de confirmar: ...`

---

## Fase 3: Plan

Antes de crear o modificar cualquier test:

1. Presenta el plan completo:
   - Qué puntos de integración se cubrirán.
   - Cómo se levantarán las dependencias (si aplica).
   - Qué archivos se crearán o modificarán.
   - Qué queda fuera de alcance y por qué.
2. Espera aprobación humana antes de continuar.

---

## Fase 4: Ejecución (solo tras aprobación)

Al crear o modificar tests:

- Usa únicamente el framework de testing detectado.
- Usa los comandos reales de levantamiento de dependencias detectados.
- No inventes variables de entorno ni credenciales de servicios externos.
- No elimines ni relajes tests de integración existentes para hacer pasar la suite.
- No asumas que un servicio externo está disponible sin confirmarlo en CI o documentación.
- Marca datos de fixtures como ficticios y claramente identificados.

---

## Fase 5: Validación Final

Antes de cerrar:

1. Ejecuta los comandos reales de testing detectados.
2. Entrega evidencia:
   - Comandos ejecutados y salida relevante.
   - Tests nuevos creados y qué integración cubren.
   - Tests modificados y motivo.
   - Hallazgos: fallos, advertencias, gaps de cobertura.
   - Riesgos pendientes: servicios que no pueden probarse localmente, falta de fixtures estables.

---

## Reglas Permanentes

- No inventar comandos, herramientas ni servicios.
- No imprimir secretos ni copiar credenciales reales.
- No modificar configuración productiva.
- No eliminar tests para hacer pasar la suite.
- No asumir infraestructura no confirmada por evidencia local.
- Pedir aprobación humana antes de cualquier cambio estructural.
