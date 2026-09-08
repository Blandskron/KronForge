---
id: engineering-protocols.prior-art
title: Trabajo previo y terminología equivalente
summary: Dónde las ideas de la suite ya existen bajo otro nombre, y qué se toma prestado de cada tradición.
type: reference
domain: engineering-protocols
status: stable
version: 1.0.0
difficulty: intermediate
projects: [any]
compatibility: model-agnostic
models: [any]
tags: [investigacion, trabajo-previo, terminologia, reproducibilidad, normativo]
related:
  - engineering-protocols.protocol-maturity
  - engineering-protocols.decision-records
  - engineering-protocols.benchmark
specRefs:
  - spec: rfc-2119
    version: BCP 14
    url: https://www.rfc-editor.org/rfc/rfc2119
    verified: 2026-09-07
  - spec: adr-practice
    url: https://adr.github.io/
    verified: 2026-09-07
  - spec: acm-artifact-badging
    version: "1.1"
    url: https://www.acm.org/publications/policies/artifact-review-and-badging-current
    verified: 2026-09-07
  - spec: slsa
    version: v1.2
    url: https://slsa.dev/spec/latest/levels
    verified: 2026-09-07
---

# Trabajo Previo y Terminología Equivalente

Casi nada en esta suite es conceptualmente nuevo. Lo que puede ser nuevo es la combinación y el contexto: aplicar estas tradiciones a repositorios donde varios agentes de IA colaboran con personas.

Este documento existe para evitar dos errores opuestos: reclamar novedad donde no la hay, y reinventar mal algo que otra disciplina ya resolvió bien.

## Cómo leer esta página

Las cuatro fuentes con `specRefs` fueron verificadas el 2026-09-07 contra su publicación. El resto de las equivalencias se declaran como **conceptuales y no verificadas**: se nombran porque un lector con formación en esas áreas reconocerá el parecido, no porque se haya auditado la fuente primaria. La distinción importa: una equivalencia conceptual es una pista para investigar, no una cita.

## Fuentes verificadas

### Lenguaje normativo

RFC 2119 —«Key words for use in RFCs to Indicate Requirement Levels», marzo de 1997, publicada como BCP 14— define el vocabulario que distingue una obligación absoluta de una recomendación fuerte y de una opción discrecional.

**Relación con la suite:** los protocolos de esta biblioteca están escritos en español y no adoptan ese vocabulario literalmente, pero heredan su idea central: la fuerza de una regla debe ser explícita y no inferirse del tono. Cuando [AFP-005](../protocols/independent-review.protocol.md) dice que la revisión independiente es el mínimo para alto riesgo y que otras situaciones admiten un nivel menor, está haciendo exactamente la distinción que RFC 2119 formalizó.

**Diferencia:** esta suite añade una dimensión que RFC 2119 no aborda — la madurez de la evidencia que sostiene la regla. Una regla puede ser normativa y estar mal fundada; separar ambas cosas es lo que hace [AFP-000](../protocols/protocol-maturity.protocol.md).

### Registros de decisión arquitectónica

La práctica de registrar decisiones arquitectónicas con su contexto, consecuencias y compromisos fue popularizada por Michael Nygard en 2011, y la comunidad que la mantiene la describe como un registro de decisiones que, en conjunto, forma la bitácora del proyecto.

**Relación con la suite:** [AFP-010](../protocols/decision-records.protocol.md) no propone un formato nuevo; adopta la práctica y añade dos cosas que el uso habitual deja implícitas: la separación explícita entre pregunta abierta y decisión tomada, y el requisito de descubribilidad — que un participante que va a modificar arquitectura pueda encontrar las decisiones vigentes antes de empezar.

**Diferencia:** el requisito de descubribilidad es específico del contexto agéntico. Una persona que lleva años en un proyecto conoce sus decisiones; un participante nuevo en cada sesión, no.

### Insignias de artefacto y reproducibilidad

La política de revisión de artefactos de la ACM, en su versión 1.1 de 2020, define insignias graduadas que separan tres afirmaciones distintas: que los artefactos estén disponibles, que hayan sido evaluados, y que los resultados hayan sido obtenidos de nuevo. Distingue además «reproducido» —un grupo independiente obtiene el mismo resultado usando los artefactos de los autores— de «replicado» —el resultado se obtiene sin esos artefactos—. La propia política advierte que este uso es el inverso al coloquial en algunas disciplinas, y que se adoptó para alinearse con el estándar NISO.

**Relación con la suite:** es el precedente más directo de la escala de [AFP-000](../protocols/protocol-maturity.protocol.md). La idea de que «disponible», «evaluado» y «reproducido» son afirmaciones distintas que merecen etiquetas distintas es exactamente lo que la escala de seis escalones aplica a protocolos en lugar de a artefactos de investigación.

**Diferencia y advertencia:** el escalón `reproduced` de esta suite usa la palabra en el sentido de la ACM —otro equipo obtiene un resultado comparable— pero sin la infraestructura de revisión por pares que da peso a la insignia. No son equivalentes en fuerza, y usar la misma palabra es una decisión discutible que se declara aquí para que el lector la juzgue.

### Niveles graduados de garantía en la cadena de suministro

La especificación SLSA, en su versión v1.2, organiza la confianza en la procedencia de un artefacto por niveles crecientes: el más bajo solo exige que la procedencia exista, y los superiores añaden protección progresiva contra manipulación.

**Relación con la suite:** el modelo de «niveles crecientes de garantía verificable» es el mismo que usan [AFP-000](../protocols/protocol-maturity.protocol.md) para madurez y [AFP-005](../protocols/independent-review.protocol.md) para independencia de revisión. En los tres casos la propiedad útil es idéntica: un nivel bajo declarado honestamente es más útil que un nivel alto reclamado sin sustento.

**Diferencia:** SLSA se apoya en generación automática de procedencia. Los niveles de esta suite dependen hoy de declaración y revisión, que es una base más débil.

## Equivalencias conceptuales no verificadas

Se nombran por honestidad intelectual. No fueron auditadas contra su fuente primaria y no llevan `specRefs`.

| Tradición | Idea equivalente | Protocolo relacionado |
|---|---|---|
| Sistemas multiagente clásicos | Asignación de tareas por anuncio, oferta y adjudicación entre agentes autónomos | [AFP-003](../protocols/multi-agent-collaboration.protocol.md) |
| Sistemas distribuidos | Concesiones con expiración para coordinar acceso sin bloqueo permanente | [AFP-003](../protocols/multi-agent-collaboration.protocol.md) |
| Arquitecturas de pizarra | Estado compartido inspeccionable como medio de coordinación entre agentes heterogéneos | [AFP-001](../protocols/repository-state.protocol.md) |
| Control de concurrencia optimista | Detectar el conflicto en la integración en lugar de prevenirlo con bloqueo | [AFP-003](../protocols/multi-agent-collaboration.protocol.md) |
| Métodos ágiles | Definición de terminado como acuerdo explícito y verificable | [AFP-004](../protocols/evidence-and-gates.protocol.md) |
| Compilaciones reproducibles | Un artefacto debe poder reconstruirse fuera del entorno que lo produjo | [AFP-006](../protocols/external-consumption-validation.protocol.md) |
| Niveles de madurez tecnológica | Escalones de madurez atados a evidencia demostrada, no a intención | [AFP-000](../protocols/protocol-maturity.protocol.md) |
| Taxonomías de contribución académica | Separar los roles de una contribución en lugar de una lista plana de autores | [AFP-003](../protocols/multi-agent-collaboration.protocol.md) |
| Pruebas de conformidad de protocolos | Verificar implementaciones contra una especificación común en lugar de entre sí | [AFP-007](../protocols/interface-conformance.protocol.md) |
| Metodología experimental | Hipótesis previa, controles, incertidumbre y amenazas a la validez | [AFP-008](../protocols/benchmark.protocol.md) |
| Ingeniería de seguridad | Modelado de amenazas y fronteras de confianza como paso previo al diseño | [AFP-005](../protocols/independent-review.protocol.md) |

## Qué podría ser nuevo, y con qué reservas

No se reclama novedad. Se registran tres combinaciones que no se han encontrado descritas juntas, con la advertencia de que no encontrarlas no es evidencia de que no existan:

1. **Caducidad de la evidencia atada al estado del código.** La idea de que un registro de verificación deja de ser válido cuando cambian los archivos que declaraba cubrir, aplicada como compuerta ejecutable. Tiene precedentes conceptuales en la invalidación de caché y en la reconstrucción incremental; lo que no se ha encontrado es su aplicación a compuertas de calidad.
2. **Niveles declarados de independencia de revisión.** Distinguir cuatro grados y exigir que el veredicto declare cuál se alcanzó, en lugar de tratar «revisado» como binario.
3. **Neutralidad de proveedor verificable por máquina.** Rechazar automáticamente un documento normativo que nombre un proveedor fuera de sus secciones de evidencia y de adaptadores.

Las tres son propuestas de esta suite y ninguna está validada. Si un lector conoce trabajo previo sobre cualquiera de ellas, esa información mejora el documento y debería incorporarse.

## Problemas de coordinación conocidos

Problemas que otras tradiciones ya identificaron y que esta suite hereda sin resolver:

- **El coste de la coordinación crece más rápido que el número de participantes.** Añadir agentes no escala linealmente, y esta suite no dice dónde está el punto de inflexión.
- **El acuerdo entre participantes correlacionados no aporta información independiente.** [AFP-003](../protocols/multi-agent-collaboration.protocol.md) lo declara pero no ofrece forma de medir la correlación.
- **Un contrato explícito desplaza el error hacia la especificación.** Un contrato completo y equivocado produce trabajo equivocado con más eficiencia.
- **El proceso tiende a crecer.** Ninguna de las tradiciones citadas resolvió cómo impedir que un sistema de protocolos acumule ceremonia; esta tampoco.
