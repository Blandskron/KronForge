---
id: agent-supply-chain.owasp-agentic-skills-top-10
title: Checklist OWASP Agentic Skills Top 10
summary: Revisar una skill contra los diez riesgos catalogados antes de publicarla o adoptarla.
type: checklist
domain: agent-supply-chain
status: stable
version: 1.0.0
difficulty: intermediate
projects: [ai-application, agent-platform, developer-tool]
compatibility: tool-agnostic
models: [any]
tags: [skills, security, supply-chain, owasp, review]
related:
  - agent-supply-chain.skill-trust-boundaries
  - agent-supply-chain.untrusted-external-instructions
  - agent-supply-chain.least-privilege-skill-tools
specRefs:
  - spec: owasp-agentic-skills-top-10
    version: "1.0-2026"
    url: https://owasp.org/www-project-agentic-skills-top-10/
    verified: 2026-09-03
---

# Checklist: OWASP Agentic Skills Top 10

Registra `Cumple`, `No cumple` o `No aplica` con evidencia. Un `No cumple` en AST01, AST02, AST03 o AST05 es bloqueante.

Esta checklist se aplica tanto a una skill propia antes de publicarla como a una skill de terceros antes de adoptarla. La segunda situación es la más frecuente y la que más se omite.

## AST01 — Skills maliciosas

- [ ] Se leyó el `SKILL.md` completo, no solo su descripción.
- [ ] No hay instrucciones que contradigan al usuario o al host.
- [ ] No hay recolección de credenciales, tokens ni variables de entorno.
- [ ] La `description` corresponde a lo que el cuerpo realmente hace.

## AST02 — Compromiso de la cadena de suministro

- [ ] El origen del artefacto está identificado y es verificable.
- [ ] Se conoce quién puede modificarlo y bajo qué revisión.
- [ ] La versión adoptada quedó fijada; no se sigue una referencia móvil.
- [ ] Nada se ejecuta antes del consentimiento explícito.

## AST03 — Skills sobre-privilegiadas

- [ ] Cada herramienta declarada corresponde a un paso del procedimiento.
- [ ] No se concede el intérprete de comandos completo por conveniencia.
- [ ] El acceso de red está ausente o justificado por una necesidad real.
- [ ] La escritura en el sistema de archivos está acotada o ausente.

Ver [privilegio mínimo en herramientas de skill](../patterns/least-privilege-skill-tools.pattern.md).

## AST04 — Metadatos inseguros

- [ ] El front matter es válido y sin campos inesperados.
- [ ] `name` cumple el formato y coincide con el directorio.
- [ ] La `description` no contiene instrucciones dirigidas al agente.
- [ ] No hay contenido activo escondido en campos de metadatos.

## AST05 — Instrucciones externas no verificadas

- [ ] Ninguna instrucción se obtiene desde una fuente externa en ejecución.
- [ ] El contenido que la skill necesita está empaquetado o versionado.
- [ ] Los resultados de servicios externos se tratan como datos, no como órdenes.

Ver [instrucciones externas no verificadas](../anti-patterns/untrusted-external-instructions.anti-pattern.md).

## AST06 — Aislamiento débil

- [ ] Se conoce con qué aislamiento la ejecuta el host de destino.
- [ ] No se asume que los scripts corren en un entorno contenido.
- [ ] Las credenciales persistidas del entorno no quedan al alcance del procedimiento.

## AST07 — Deriva de actualización

- [ ] Existe un responsable de revisar la skill cuando cambia.
- [ ] La versión adoptada y la disponible se pueden comparar.
- [ ] Un cambio de contenido dispara una nueva revisión, no solo un cambio de versión declarada.

## AST08 — Escaneo insuficiente

- [ ] El resultado de un escáner se trata como señal, no como aprobación.
- [ ] Hubo revisión humana del contenido íntegro.
- [ ] Se revisó el artefacto completo, incluidos archivos referenciados y binarios.

## AST09 — Falta de gobernanza

- [ ] La organización sabe qué skills están desplegadas y dónde.
- [ ] Existe un criterio de aprobación y alguien que lo aplica.
- [ ] Hay una vía para retirar una skill y verificar que se retiró.

## AST10 — Reuso entre plataformas

- [ ] Se identificó a qué producto se lleva la skill.
- [ ] Se verificó qué garantías se pierden en ese destino.
- [ ] Las herramientas declaradas se reevaluaron para el nuevo host.

## Veredicto

- **Resultado:** Aprobado | Condicionado | Rechazado
- **Bloqueantes:**
- **Evidencia:**
- **Responsable humano:**
- **Fecha de revisión:**
- **Condición de nueva revisión:**

## Límites

Esta checklist ordena una revisión; no la sustituye ni certifica un artefacto. La edición de referencia es un proyecto en incubación y su contenido puede cambiar: consulta la fuente antes de tratar el resultado como definitivo.

## Fuentes

- [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/), v1.0 edición 2026, actualizada en marzo de 2026, verificada el 2026-09-03.
