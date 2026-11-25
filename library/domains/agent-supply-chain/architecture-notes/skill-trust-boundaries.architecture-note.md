---
id: agent-supply-chain.skill-trust-boundaries
title: Límites de confianza de una skill
summary: Modelar qué autoridad concede cargar una skill antes de que se ejecute.
type: architecture-note
domain: agent-supply-chain
status: stable
version: 1.0.1
difficulty: intermediate
projects: [ai-application, agent-platform, developer-tool]
compatibility: protocol-oriented
models: [any]
tags: [skills, supply-chain, trust, permissions]
related:
  - agent-supply-chain.least-privilege-skill-tools
  - agent-supply-chain.owasp-agentic-skills-top-10
specRefs:
  - spec: agent-skills
    url: https://agentskills.io/specification
    verified: 2026-09-03
  - spec: owasp-agentic-skills-top-10
    version: "1.0-2026"
    url: https://owasp.org/www-project-agentic-skills-top-10/
    verified: 2026-09-03
lastModified: 2026-11-25
inputs:
  - "Skill y su origen"
  - "Host, herramientas y autoridad concedida"
outputs:
  - "Mapa de límites entre distribución, carga y ejecución"
  - "Decisiones de adopción y restricciones"
useCases:
  - "Evaluar una skill antes de instalarla"
  - "Revisar su traslado entre hosts"
---

# Architecture Note: Límites de Confianza de una Skill

## Por qué una skill no es documentación

Una skill se distribuye como Markdown, pero no se consume como Markdown. El agente la carga en su contexto y actúa sobre su contenido. Todo lo que el archivo diga compite con las instrucciones del usuario y del host.

La consecuencia de arquitectura es directa: **el momento de la decisión de confianza es la carga, no la ejecución**. Cuando el texto ya está en contexto, el agente no puede distinguir de forma fiable entre lo que pidió el usuario y lo que pidió el archivo.

## Etapas y autoridad concedida

La carga progresiva define tres etapas, y cada una amplía la autoridad:

| Etapa | Qué entra en contexto | Autoridad concedida |
|---|---|---|
| Descubrimiento | `name` y `description` de cada skill | influir en qué skill se activa |
| Activación | cuerpo completo de `SKILL.md` | dictar el procedimiento del agente |
| Ejecución | archivos referenciados y scripts | leer, escribir y ejecutar |

Un atacante que solo controla la etapa de descubrimiento ya puede desviar qué skill se activa. Una `description` es superficie de ataque, no metadato inerte.

## Límites que deben declararse

```text
Usuario y host
  |
  +-- [L1] origen del artefacto ...... quién lo escribió y cómo se verifica
  |
  +-- [L2] contenido del SKILL.md .... instrucciones que el agente seguirá
  |
  +-- [L3] archivos referenciados .... cargados bajo demanda, mismo peso
  |
  +-- [L4] fuentes externas .......... contenido no controlado por el repositorio
  |
  `-- [L5] herramientas concedidas .... efectos reales sobre el sistema
```

Cada límite declara procedencia, quién lo revisó, qué puede cambiar sin revisión y qué evidencia queda.

`L4` es el límite que más se subestima. Una skill que resuelve una URL en tiempo de ejecución traslada su autoridad a quien controle esa URL. Ese contenido no pasó por la revisión que aprobó la skill. Ver [instrucciones externas no verificadas](../anti-patterns/untrusted-external-instructions.anti-pattern.md).

## Decisiones de arquitectura

- Revisar la skill como se revisa un permiso, no como se revisa un texto.
- Tratar `description` como superficie de activación, no como resumen editorial.
- Fijar la procedencia en el punto de adopción, no en el de uso.
- Declarar herramientas explícitamente y por defecto ninguna.
- Prohibir que instrucciones lleguen desde fuera del artefacto revisado.
- Volver a revisar cuando el artefacto cambie, no solo cuando cambie su versión declarada.
- Asumir que el escaneo automático es una señal, nunca la compuerta.

## Reuso entre plataformas

El formato es portable; las garantías no lo son. Al mover una skill entre productos pueden perderse las herramientas declaradas, el aislamiento del sistema de archivos, la revisión previa a la ejecución y el registro de auditoría.

Una skill aprobada en un entorno no queda aprobada en otro. La decisión se rehace donde cambian las garantías.

## Qué no resuelve este modelo

No resuelve la confianza en el modelo, ni la inyección desde datos legítimos que el agente lee durante la tarea, ni la revisión de los scripts empaquetados, que sigue siendo revisión de código con sus propias prácticas.

## Fuentes

- [Especificación Agent Skills](https://agentskills.io/specification), verificada el 2026-09-03.
- [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/), v1.0 edición 2026, verificada el 2026-09-03.
