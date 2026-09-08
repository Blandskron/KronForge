---
id: engineering-protocols.independent-review
title: Revisión independiente
summary: Revisar desde la evidencia y no desde la narrativa de quien implementó.
type: protocol
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [revision, independencia, seguridad, sesgo, veredicto]
related:
  - engineering-protocols.evidence-and-gates
  - engineering-protocols.multi-agent-collaboration
  - security.security-audit
  - agent-supply-chain.untrusted-external-instructions
  - quality-engineering.code-quality-review
protocol:
  code: AFP-005
  maturity: experimental
  actors: [reviewer, security-reviewer, implementer, human-owner]
  dependsOn: [AFP-004]
  observedIn: [agnara]
  lastValidated: 2026-09-07
---

# AFP-005 — Revisión Independiente

Define qué hace que una revisión sea independiente, y por qué la mayoría de las revisiones que se llaman así no lo son.

## Problema

Un participante implementa y entrega su trabajo con este mensaje:

> «Implementé todo correctamente. Revisa mi solución.»

El revisor ya está comprometido antes de mirar el código. Empieza leyendo la interpretación del implementador — qué hizo, por qué, qué considera que cubre — y a partir de ahí su tarea se convierte en confirmar o refutar esa narrativa, no en evaluar el cambio contra lo que se pidió.

El sesgo es estructural, no de carácter. Quien recibe primero un resumen coherente busca fallos dentro de ese marco y no ve los que están fuera. Es exactamente el fallo que la revisión debía evitar.

En un sistema multiagente el problema se intensifica por dos vías. La primera es que los participantes suelen compartir sesgos: dos sistemas entrenados sobre material parecido tienden a considerar razonable lo mismo, de modo que su acuerdo aporta menos información de la que aparenta. La segunda es que la revisión es fácil de simular: producir un texto que parece una revisión favorable no requiere haber revisado.

## Actores

| Actor | Responsabilidad |
|---|---|
| Reviewer | Revisa desde las fuentes primarias. Puede bloquear la integración. |
| Security reviewer | Revisa la superficie de riesgo con autoridad de bloqueo propia. |
| Implementer | Responde hallazgos. No cierra los suyos. |
| Human owner | Decide cuando revisor e implementador no convergen. |

## Ciclo de vida

```text
cambio propuesto
   → revisión desde fuentes primarias
      → hallazgos clasificados
         → veredicto
            ├─ APROBADO
            ├─ CAMBIOS_REQUERIDOS → corrección → re-revisión
            └─ NO_EVALUABLE (falta evidencia o contexto)
```

La re-revisión tras corregir no es opcional cuando hubo hallazgos bloqueantes. Un hallazgo corregido sin verificar es un hallazgo que se cree corregido.

## Orden de lectura

Lo que define la independencia es el orden en que el revisor consume la información.

**Fuentes primarias, primero:**

```text
1. la tarea y sus criterios de aceptación
2. los requisitos y restricciones declarados
3. la diferencia de código
4. las pruebas, incluidas las que no se agregaron
5. la evidencia de las compuertas
6. la arquitectura y las decisiones registradas
7. los requisitos de seguridad aplicables
```

**Después, y solo después:** la explicación de quien implementó.

Esa explicación sigue siendo útil: revela intención y suele contener información que el código no expresa. Lo que no puede hacer es llegar primero, porque entonces deja de ser un dato del caso y se convierte en el marco de la evaluación.

El criterio operativo que resume el protocolo:

> Una revisión es válida solo si pudo haber encontrado razones para no integrar.

Una revisión que estructuralmente no podía terminar en rechazo no es una revisión. Es una firma.

## Niveles de independencia

No todos los proyectos pueden permitirse el nivel máximo. Lo que el protocolo exige no es el nivel máximo: es declarar cuál se alcanzó.

| Nivel | Condición | Fuerza |
|---|---|---|
| L0 — autorrevisión | Mismo participante, mismo contexto. | Detecta descuidos. No detecta errores de comprensión. |
| L1 — revisión separada | Otro participante, mismo contexto de sesión. | Detecta algo más. Comparte suposiciones. |
| L2 — revisión independiente | Otro participante, sin acceso al contexto del implementador, partiendo de fuentes primarias. | Puede detectar errores de comprensión. |
| L3 — revisión independiente con identidad | Además, identidad distinta y verificable en el registro de revisión. | Auditable por terceros. |

Reglas:

1. **La autorrevisión nunca se presenta como revisión independiente.** No es una diferencia de grado, es de tipo.
2. **Cuando solo existe una identidad, no se configura una aprobación imposible ni se fabrica una.** Se ejecuta la revisión que sí es posible y se declara su nivel.
3. **El nivel alcanzado se registra junto al veredicto.** Un veredicto sin nivel declarado se interpreta como L0.
4. **Para cambios de alto riesgo, L2 es el mínimo.** Si no está disponible, el cambio espera o se escala; no se degrada en silencio.

Cambios que se consideran de alto riesgo por defecto: autenticación y autorización, delegación de permisos, motor de políticas, ejecución de código arbitrario, ejecución de plantillas o extensiones, criptografía, secretos, cadena de publicación, automatización de dependencias, permisos de la automatización del repositorio, fronteras de protocolo y las reglas de gobernanza del propio repositorio.

## Clasificación de hallazgos

| Severidad | Definición | Efecto |
|---|---|---|
| Alta | Corrección, seguridad o pérdida de datos. | Bloquea. |
| Media | Comportamiento incorrecto en un caso declarado, o cobertura ausente de un criterio de aceptación. | Bloquea salvo excepción registrada. |
| Baja | Mantenibilidad, claridad, consistencia. | No bloquea. |
| Nota | Observación sin acción requerida. | No bloquea. |

Cada hallazgo declara qué lo sostiene. Un hallazgo alto sin evidencia es una sospecha, y debe presentarse como tal.

Un ejemplo de la diferencia. Esto es accionable:

```markdown
### ALTA — el token aparece en registros de depuración
Archivo: src/auth/token.py:88
Evidencia: la prueba de fuga de credenciales falla contra este cambio.
```

Esto no:

```markdown
La implementación parece correcta.
```

## Perfil de revisión de seguridad

Una revisión de seguridad es una revisión independiente con un foco distinto y autoridad de bloqueo propia. No es un protocolo aparte: cambia qué se lee primero y quién puede cerrar los hallazgos.

Superficies que la revisión de seguridad examina:

| Superficie | Pregunta |
|---|---|
| Modelo de amenazas | ¿Qué cambió en lo que un atacante puede intentar? |
| Fronteras de confianza | ¿Qué entrada dejó de ser confiable, o empezó a tratarse como confiable? |
| Entradas controladas por terceros | ¿Se validan donde entran, no donde se usan? |
| Secretos | ¿Alguno puede aparecer en registros, errores o artefactos? |
| Permisos | ¿La autoridad concedida corresponde a lo que se ejecuta? |
| Cadena de suministro | ¿Qué se carga y de dónde? |
| Dependencias | ¿Qué se agregó y con qué permisos? |
| Autorización | ¿La decisión de autorizar ocurre antes del efecto? |
| Autoridad del agente | ¿Este cambio amplía lo que un participante automático puede hacer? |
| Ejecución de código | ¿Existe un camino desde entrada externa hasta ejecución? |
| Credenciales de publicación | ¿Quedan fuera del alcance de la automatización? |
| Inyección por contenido | ¿El sistema distingue instrucción de dato? |

Un revisor de seguridad dedicado y distinto del implementador es obligatorio cuando el cambio toca autenticación, autorización, secretos, ejecución de código arbitrario, la cadena de publicación o la autoridad de un participante automático. Para el resto, el revisor ordinario aplica el perfil.

Ocultar una operación en una interfaz nunca es el mecanismo de autorización. Si la única razón por la que una acción no ocurre es que no está expuesta, la acción está autorizada.

## Falla

| Situación | Comportamiento |
|---|---|
| No hay revisor independiente disponible | Ejecutar el nivel posible y declararlo. Nunca renombrarlo. |
| El revisor no puede reconstruir el contexto | `NO_EVALUABLE`; pedir la evidencia faltante. |
| Revisor e implementador no convergen | Escalar bajo el orden de [AFP-003](multi-agent-collaboration.protocol.md). |
| El hallazgo se corrigió sin verificar | El hallazgo sigue abierto. |
| El implementador cierra su propio hallazgo alto | No es un cierre válido. |

## Evidencia y límites

Declara `experimental`.

Lo que sostiene ese escalón: `Blandskron/agnara` registra la revisión independiente como su modelo de gobernanza preferido en una decisión arquitectónica explícita, con la regla de que el autor de un cambio no puede aportar la aprobación independiente de ese cambio, y con la instrucción operativa de que el revisor debe partir de la tarea, la diferencia, las pruebas, la integración continua, la arquitectura y las decisiones registradas — no de la narrativa del implementador. Contiene además la frase que este protocolo generaliza como criterio de validez: una revisión solo es válida si pudo identificar razones para no integrar. Y establece explícitamente que cuando la revisión independiente no está disponible no se debe pretender que la autorrevisión sea equivalente, sino documentar la limitación. Define también una lista de áreas de alto riesgo que exigen revisión reforzada.

Lo que no lo sostiene: el proyecto observado declara esa decisión en estado propuesto y opera con un número reducido de identidades, de modo que el nivel L3 se alcanza de forma intermitente. La escala de cuatro niveles de independencia de esta página es una generalización propuesta aquí y no está implementada en ningún repositorio auditado: no existe evidencia de que registrar el nivel cambie el comportamiento de quien revisa. No hay medición de tasa de detección de defectos por nivel, que es exactamente lo que haría falta para promover este protocolo a `validated`.

## Qué no afirma este protocolo

- No afirma que la revisión independiente encuentre todos los defectos.
- No afirma que un revisor automático sea equivalente a uno humano en cambios de juicio.
- No afirma que L3 sea alcanzable en todo proyecto. Afirma que fingirlo es peor que no tenerlo.
- No define qué compuertas deben pasar; eso pertenece a [AFP-004](evidence-and-gates.protocol.md).
- No convierte el acuerdo entre revisores en evidencia adicional.
