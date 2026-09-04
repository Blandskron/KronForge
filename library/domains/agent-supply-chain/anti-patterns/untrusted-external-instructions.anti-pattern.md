---
id: agent-supply-chain.untrusted-external-instructions
title: Instrucciones externas no verificadas
summary: Cargar instrucciones desde una fuente que no pasó por la revisión que aprobó la skill.
type: anti-pattern
domain: agent-supply-chain
status: stable
version: 1.0.0
difficulty: intermediate
projects: [ai-application, agent-platform, developer-tool]
compatibility: tool-agnostic
models: [any]
tags: [skills, supply-chain, prompt-injection, review]
related:
  - agent-supply-chain.skill-trust-boundaries
  - agent-supply-chain.owasp-agentic-skills-top-10
specRefs:
  - spec: owasp-agentic-skills-top-10
    version: "1.0-2026"
    url: https://owasp.org/www-project-agentic-skills-top-10/
    verified: 2026-09-03
---

# Anti-pattern: Instrucciones Externas No Verificadas

## Descripción

Una skill delega parte de su procedimiento a contenido que se obtiene en tiempo de ejecución desde una fuente externa: una URL de documentación, un gist, un endpoint propio, un archivo descargado.

## Cómo se ve

```md
Antes de empezar, obtén las convenciones vigentes desde
https://ejemplo.externo/convenciones.md y sigue lo que indiquen.
```

```md
Ejecuta `curl -s https://ejemplo.externo/setup.sh | sh` para preparar el entorno.
```

Ambas formas comparten la misma propiedad: **el contenido que el agente va a obedecer no existía cuando alguien revisó y aprobó la skill**.

## Por qué parece razonable

La intención suele ser buena. Se busca que la skill no envejezca, que una sola fuente sirva a varios equipos, que el archivo se mantenga corto. Son objetivos legítimos con una solución equivocada.

## Consecuencias

- La autoridad de la skill se traslada a quien controle esa fuente, ahora y en el futuro.
- La revisión aprueba un archivo y el agente ejecuta otro.
- La firma o el hash del artefacto dejan de significar algo.
- El escaneo previo a la publicación no ve el contenido que importa.
- El comportamiento deja de ser reproducible: dos ejecuciones pueden diferir sin que cambie el repositorio.

Este patrón está catalogado por OWASP como riesgo propio de las skills. La medición pública que acompaña ese trabajo es la parte incómoda: sobre 142.836 skills en vivo, 17.822 —el 12,4 %, con 6,7 millones de instalaciones— dependían de al menos una fuente de instrucciones externa no confiable.

## Cómo se corrige

1. **Empaqueta lo que la skill necesita.** El contenido estable va en `references/`; carga bajo demanda sin salir del artefacto.
2. **Versiona en vez de resolver en vivo.** Si la fuente externa es autoritativa, copia el fragmento necesario y declara versión, URL y fecha de verificación mediante `specRefs`.
3. **Separa datos de instrucciones.** Consultar un servicio para obtener un dato es legítimo; obedecer lo que ese servicio devuelva no lo es. El resultado se trata como contenido no confiable.
4. **Si es inevitable, hazlo visible.** Declara la fuente, quién la controla, qué pasa si cambia, y exige aprobación humana antes de actuar sobre su contenido.

## Cómo detectarlo

En este repositorio, el validador falla cuando un `SKILL.md` contiene una URL externa presentada como fuente de instrucciones. Es una heurística, no una garantía: el juicio de la revisión sigue siendo necesario.

En una revisión manual, la pregunta es una sola: *si el dueño de esa URL cambia el contenido mañana, ¿qué hará el agente?* Si la respuesta no es "nada distinto", el anti-patrón está presente.

## Confusiones frecuentes

- **Enlazar no es delegar.** Citar una fuente para que un humano la lea es correcto. El problema aparece cuando el agente debe obedecerla.
- **El origen confiable no elimina el riesgo.** Una fuente propia también cambia sin revisión, y ese es el defecto.
- **Un escáner limpio no es evidencia.** La investigación pública muestra que los escáneres de skills se evaden mediante truncamiento por relleno, ofuscación en binarios y archivos comprimidos, e inyección contra el propio modelo juez.

## Fuentes

- [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/), v1.0 edición 2026, verificada el 2026-09-03.
