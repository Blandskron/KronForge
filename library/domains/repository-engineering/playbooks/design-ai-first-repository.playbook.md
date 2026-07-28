---
id: repository-engineering.design-ai-first-repository
title: Diseñar un repositorio AI-First
summary: Convertir evidencia del repositorio en una arquitectura operable por personas y agentes.
type: playbook
domain: repository-engineering
status: stable
version: 1.0.0
difficulty: intermediate
projects: [new, existing, legacy, monorepo]
compatibility: model-agnostic
models: [any]
tags: [repository, agents-first, documentation, context]
related:
  - ai-agent-engineering.prepare-agents-first
  - context-engineering.progressive-context
  - documentation-knowledge.documentation-audit
---

# Playbook: Diseñar un Repositorio AI-First

## Objetivo

Reducir el tiempo de orientación y el riesgo de cambios incorrectos sin convertir el repositorio en una enciclopedia.

## Entradas

- repositorio accesible en modo lectura;
- propósito y responsables;
- manifests, automatización y documentación existentes;
- reglas de seguridad y aprobación.

## Fase 1 — Mapear la realidad

1. Identifica propósito, tipo de proyecto y unidades desplegables.
2. Detecta lenguajes, gestores, scripts, CI y comandos reales.
3. Clasifica documentación y fuentes de verdad.
4. Ubica secretos, infraestructura, datos y rutas protegidas.
5. Registra contradicciones y pendientes.

**Gate:** no diseñes la estructura final hasta poder explicar los límites principales.

## Fase 2 — Diseñar entradas

1. Mantén `README.md` orientado a humanos.
2. Crea o ajusta `AGENTS.md` como mapa operativo breve.
3. Lleva pruebas, permisos, seguridad, configuración y operación a documentos especializados solo cuando aplican.
4. Define instrucciones locales en módulos cuando el alcance global no sea suficiente.

## Fase 3 — Diseñar contexto

1. Crea mapas e índices antes de agregar profundidad.
2. Enlaza fuentes canónicas; no copies contenido largo.
3. Declara qué debe leerse siempre y qué se carga bajo demanda.
4. Separa evidencia, decisiones y material de referencia.

## Fase 4 — Crear capacidades reutilizables

1. Extrae skills solo de procesos repetibles.
2. Usa templates para artefactos con estructura estable.
3. Usa checklists para gates independientes.
4. Usa playbooks para procesos con decisiones y rollback.

## Fase 5 — Definir autoridad

1. Lista superficies editables.
2. Declara cambios que requieren aprobación.
3. Prohíbe exposición de secretos y comandos inventados.
4. Define criterios para detenerse y pedir contexto.

## Fase 6 — Validar

1. Resuelve enlaces y referencias.
2. Ejecuta comandos documentados de forma segura.
3. Revisa el sitio o portal si existe.
4. Comprueba que un colaborador nuevo pueda encontrar propósito, comandos y límites.
5. Revisa el diff y registra cambios semánticos.

## Rollback

Conserva contenido anterior hasta migrar información útil. Si una nueva estructura rompe descubrimiento o contradice la implementación, revierte el lote documental afectado sin reescribir historial.

## Salida esperada

- entradas breves y coherentes;
- mapa de contexto;
- permisos verificables;
- comandos respaldados;
- activos reutilizables justificados;
- evidencia de validación y pendientes.

## Ejemplo de uso

En un monorepo, el mapa raíz explica paquetes y comandos globales. Cada servicio tiene instrucciones locales y enlaza contratos compartidos; no copia el runbook completo.
