---
id: security.compliance-and-privacy-controls
title: Controles técnicos de cumplimiento y privacidad
summary: Mapear controles técnicos verificables hacia GDPR, Ley 21.719 (Chile), OWASP, NIST AI RMF e ISO 27001/42001 sin reclamar certificaciones.
type: checklist
domain: security
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [compliance, privacy, gdpr, ley-21719, owasp, nist, iso-27001, iso-42001]
related: [security.privacy-audit, security.security-audit, agent-supply-chain.owasp-agentic-skills-top-10, engineering-protocols.evidence-and-gates]
lastModified: 2026-11-27
inputs:
  - "Arquitectura del sistema, flujos de datos personales y uso de agentes IA"
  - "Jurisdicciones aplicables y política de seguridad del proyecto"
outputs:
  - "Checklist técnico con controles verificables, brechas y evidencia requerida"
useCases:
  - "Preparar una auditoría técnica de privacidad o seguridad"
  - "Definir controles mínimos antes de desplegar sistemas con datos personales o agentes IA"
---

# Checklist: Controles Técnicos de Cumplimiento y Privacidad

> **Límite explícito:** Este documento aporta controles técnicos de referencia para equipos de ingeniería. **No constituye asesoría legal ni otorga certificación** en GDPR, Ley 21.719, ISO 27001, ISO 42001 ni NIST AI RMF. Nunca declares cumplimiento sin auditoría independiente y evidencia verificable.

## 1. Protección de Datos Personales (GDPR y Ley 21.719 — Chile)

- [ ] **Minimización y finalidad:** el sistema recolecta únicamente los datos personales estrictamente necesarios para una finalidad declarada.
- [ ] **No filtración hacia prompts o logs:** existe sanitización o exclusión explícita para que PII, credenciales y tokens no se envíen sin control a modelos externos ni queden en logs o trazas.
- [ ] **Retención y eliminación:** los datos personales tienen plazo de retención definido y mecanismo verificable de supresión/anonimización (derechos de acceso, rectificación, cancelación/supresión, oposición y portabilidad).
- [ ] **Transferencias y terceros:** están inventariados todos los subprocesadores, APIs y proveedores de IA que reciben datos.

## 2. Seguridad de Aplicaciones y Agentes (OWASP Top 10 & Agentic Top 10)

- [ ] **Mínimo privilegio:** herramientas, MCP servers, skills y tokens CI operan con los permisos mínimos necesarios (preferir OIDC sin secretos persistentes).
- [ ] **Validación de entradas y fronteras:** rutas de archivo, comandos y datos externos se validan contra path traversal, inyección y ejecución remota no confiable.
- [ ] **Cadena de suministro:** dependencias, packs y skills fijan versiones/digests SHA-256 y se revisan antes de activarse.

## 3. Gestión de Riesgos y Gobernanza IA (NIST AI RMF · ISO/IEC 27001 · ISO/IEC 42001)

- [ ] **Inventario de capacidades IA (Map / ISO 42001):** están documentados qué agentes, modelos, prompts y herramientas operan sobre el repositorio o producto.
- [ ] **Supervisión humana (Govern):** acciones irreversibles, cambios de seguridad y despliegues productivos requieren aprobación humana explícita.
- [ ] **Evidencia y trazabilidad (Measure & Manage / ISO 27001):** cada cambio relevante conserva evidencia reproducible de pruebas, revisiones y respuesta ante incidentes.
