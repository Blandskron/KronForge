---
id: ai-agent-engineering.agent-skills-conformance
title: Checklist de conformidad Agent Skills
summary: Verificar que una skill cumple el formato abierto y es consumible por clientes reales.
type: checklist
domain: ai-agent-engineering
status: stable
version: 1.0.1
difficulty: foundation
projects: [any]
compatibility: tool-agnostic
models: [any]
tags: [skills, conformance, interoperability, agent-skills]
related:
  - ai-agent-engineering.prompt-update
  - agent-supply-chain.owasp-agentic-skills-top-10
specRefs:
  - spec: agent-skills
    url: https://agentskills.io/specification
    verified: 2026-09-03
lastModified: 2026-11-25
inputs:
  - "Directorio de la skill, front matter y archivos asociados"
outputs:
  - "Checklist de formato, portabilidad y seguridad"
  - "Veredicto con evidencia"
useCases:
  - "Validar una skill antes de distribuirla"
---

# Checklist: Conformidad Agent Skills

Verifica que una skill cumple el formato abierto. Una skill correcta como documento puede ser inservible como artefacto si incumple el contrato que los clientes esperan.

Registra `Cumple`, `No cumple` o `No aplica` con evidencia.

## Estructura

- [ ] Existe un directorio propio con un archivo `SKILL.md` dentro.
- [ ] El nombre del directorio coincide exactamente con el campo `name`.
- [ ] Los recursos opcionales usan `scripts/`, `references/` o `assets/`.
- [ ] Las referencias a otros archivos usan rutas relativas desde la raíz de la skill.
- [ ] Las referencias no encadenan más de un nivel de profundidad.

## Front matter obligatorio

- [ ] `name` tiene entre 1 y 64 caracteres.
- [ ] `name` usa solo minúsculas, dígitos y guiones.
- [ ] `name` no empieza ni termina en guion, ni contiene guiones consecutivos.
- [ ] `description` tiene entre 1 y 1024 caracteres.
- [ ] `description` explica **qué hace** y **cuándo usarla**.
- [ ] `description` incluye las palabras que un agente vería en la tarea real.

## Front matter opcional

- [ ] `license` declara la licencia o el archivo que la contiene.
- [ ] `compatibility` se usa solo si hay requisitos reales de entorno, y no supera 500 caracteres.
- [ ] `metadata` contiene únicamente pares de texto, con claves poco propensas a colisión.
- [ ] `allowed-tools` declara el conjunto mínimo, entendiendo que es experimental.

## Cuerpo

- [ ] El cuerpo se mantiene bajo 500 líneas.
- [ ] El procedimiento es accionable, con pasos y criterios de salida.
- [ ] Los ejemplos muestran entrada y resultado esperado.
- [ ] Los casos límite frecuentes están cubiertos.
- [ ] El material extenso vive en `references/` y no en el cuerpo.

## Carga progresiva

- [ ] La metadata basta para decidir si la skill es relevante.
- [ ] El cuerpo basta para ejecutar el caso principal sin abrir más archivos.
- [ ] Los archivos de referencia están segmentados por tema, no en un único documento grande.

## Portabilidad

- [ ] La skill no depende de una función exclusiva de un producto sin declararlo.
- [ ] Lo específico de un producto está aislado y es opcional.
- [ ] Se verificó su carga en al menos un cliente real.

## Seguridad

- [ ] Se aplicó la [checklist OWASP Agentic Skills Top 10](../../agent-supply-chain/checklists/owasp-agentic-skills-top-10.checklist.md).

## Veredicto

- **Resultado:** Aprobado | Condicionado | Rechazado
- **Cliente donde se verificó:**
- **Bloqueantes:**
- **Evidencia:**

## Límites

Cumplir el formato no garantiza que un producto concreto descubra la skill: cada cliente define desde qué rutas carga skills y con qué permisos las ejecuta. La conformidad es condición necesaria, no suficiente.

## Fuentes

- [Especificación Agent Skills](https://agentskills.io/specification), verificada el 2026-09-03.
