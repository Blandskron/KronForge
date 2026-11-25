---
id: agent-supply-chain.least-privilege-skill-tools
title: Privilegio mínimo en herramientas de skill
summary: Declarar de forma explícita y acotada las herramientas que una skill necesita.
type: pattern
domain: agent-supply-chain
status: stable
version: 1.0.1
difficulty: intermediate
projects: [ai-application, agent-platform, developer-tool]
compatibility: tool-agnostic
models: [any]
tags: [skills, permissions, least-privilege, supply-chain]
related:
  - agent-supply-chain.skill-trust-boundaries
  - mcp-integration.mcp-security
specRefs:
  - spec: agent-skills
    url: https://agentskills.io/specification
    verified: 2026-09-03
lastModified: 2026-11-25
inputs:
  - "Procedimiento de la skill y herramientas disponibles"
  - "Política de permisos del host"
outputs:
  - "Permisos justificados por paso"
  - "Herramientas omitidas o restringidas"
useCases:
  - "Revisar las herramientas solicitadas por una skill"
---

# Pattern: Privilegio Mínimo en Herramientas de Skill

## Contexto

Una skill describe un procedimiento. Para ejecutarlo, el agente necesita herramientas: leer archivos, ejecutar comandos, alcanzar la red. El formato permite declarar cuáles quedan preaprobadas.

## Problema

Una skill que no declara nada delega la decisión al host, y una que declara de más convierte una tarea acotada en autoridad amplia y permanente. El riesgo no es lo que la skill hace hoy: es lo que puede hacer si su contenido cambia o si alguien la desvía.

El sobre-privilegio es un riesgo catalogado en el sector, y su forma habitual no es maliciosa. Es conveniencia: se concede acceso amplio para no tener que volver a ajustarlo.

## Solución

Declarar el conjunto mínimo verificable, acotado por comando y no por familia.

```yaml
# Acotado al verbo concreto que el procedimiento necesita
allowed-tools: Bash(git status:*) Bash(git diff:*) Read
```

```yaml
# Autoridad amplia: cualquier comando bajo git, hoy y en el futuro
allowed-tools: Bash(git:*)
```

```yaml
# Autoridad total del intérprete de comandos
allowed-tools: Bash
```

Reglas de diseño:

1. **Deriva de los pasos, no del tema.** Recorre el procedimiento y anota qué necesita cada paso. Lo que no aparezca en un paso no se declara.
2. **Prefiere lectura sobre escritura.** Una skill de auditoría que solo lee no necesita escribir aunque su dominio sea de cambios.
3. **Acota por comando.** `Bash(npm test:*)` expresa una intención; `Bash` expresa un intérprete completo.
4. **Ninguna por defecto.** Omitir el campo es una decisión válida: significa que el host aplica su política y pregunta.
5. **Sin red salvo necesidad probada.** El acceso de red convierte cualquier fallo de contenido en exfiltración.
6. **Reevalúa al cambiar el procedimiento.** Si un paso desaparece, sus herramientas también.

Este campo es experimental y su soporte varía entre implementaciones. Trátalo como una declaración de intención revisable, no como un control aplicado. La compuerta real es el host.

## Consecuencias

- La revisión gana un criterio objetivo: cada herramienta declarada corresponde a un paso.
- Los desvíos se contienen: una skill sin red no filtra aunque su contenido cambie.
- El coste es mantenimiento: la declaración envejece si el procedimiento cambia y nadie la ajusta.

## Cuándo no aplicarlo

Cuando el host no soporta el campo y no existe otra compuerta. Declarar permisos que nadie aplica genera una falsa sensación de control; en ese caso, documenta la autoridad requerida en el cuerpo y exige aprobación humana.

## Señales de que se está aplicando mal

- La declaración se copió de otra skill.
- Aparece una herramienta que ningún paso usa.
- Se concede el intérprete completo para evitar ajustar la lista.
- La skill pide red para leer documentación que podría empaquetarse.

## Relación

Este patrón acota la autoridad concedida en `L5` de [límites de confianza de una skill](../architecture-notes/skill-trust-boundaries.architecture-note.md). Su equivalente en tiempo de conexión es la [checklist de seguridad MCP](../../mcp-integration/checklists/mcp-security.checklist.md).

## Fuentes

- [Especificación Agent Skills](https://agentskills.io/specification), campo `allowed-tools`, verificada el 2026-09-03.
