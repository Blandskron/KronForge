---
id: context-engineering.project-memory
title: Memoria persistente del proyecto entre sesiones
summary: Registrar hechos verificados, decisiones activas y preguntas abiertas en Markdown versionado evitando duplicidad y obsolescencia.
type: template
domain: context-engineering
status: stable
version: 1.0.0
difficulty: foundation
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [memory, context-engineering, sessions, progressive-disclosure]
related: [context-engineering.persistent-notes, context-engineering.context-compaction, context-engineering.token-budget-context-routing]
lastModified: 2026-11-27
inputs:
  - "Hallazgos verificados durante sesiones de trabajo"
  - "Decisiones técnicas aún no formalizadas en ADR o pendientes de cierre"
outputs:
  - "Registro conciso de memoria operativa con fecha de verificación y enlaces canónicos"
useCases:
  - "Continuar trabajo multi-sesión sin repetir investigaciones"
  - "Transferir contexto exacto entre distintos agentes o mantenedores"
---

# Memoria Operativa del Proyecto

- **Última verificación:** `YYYY-MM-DD`
- **Caducidad de revisión sugerida:** 30 días o ante cambio estructural.
- **Regla anti-duplicidad:** Esta memoria enlaza a documentos canónicos (`AGENTS.md`, ADRs, specs); nunca copia su contenido completo.

## 1. Estado actual verificado

- **Rama / versión base:**
- **Último quality gate ejecutado:** (comando + resultado exacto)
- **Trabajo en curso:**

## 2. Hechos verificados del entorno

| Afirmación verificada | Fuente exacta (archivo o comando) | Fecha |
|---|---|---|
| Ejemplo: los tests corren con `npm test` | `package.json` | `YYYY-MM-DD` |

## 3. Decisiones activas y restricciones

- Decisión breve + enlace al ADR o especificación correspondiente.

## 4. Preguntas abiertas y bloqueos

- [ ] Pregunta abierta (quién decide / qué evidencia falta).

## 5. Siguiente paso exacto para retomar

1. Paso concreto verificable.
