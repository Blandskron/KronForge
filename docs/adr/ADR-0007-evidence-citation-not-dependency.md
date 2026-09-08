# ADR-0007: La evidencia externa se cita, no se aloja

- **Estado:** accepted
- **Fecha:** 2026-09-07
- **Responsable:** maintainer del repositorio
- **Modifica:** [ADR-0006](ADR-0006-protocol-asset-type.md)

## Contexto

La suite de protocolos publicada en `3.3.0` incluía un case study dedicado a un proyecto externo, que era la fuente de su evidencia empírica.

Esa decisión creaba un problema que solo se ve con la suite ya construida: el proyecto externo dejaba de ser una fuente citada y pasaba a ser **contenido** de esta biblioteca. Un dominio entero quedaba parcialmente ocupado por la descripción de otro repositorio, con su propio `specRefs`, su propia ruta pública y su propia obligación de mantenimiento. Si ese proyecto cambia de rumbo, se archiva o se renombra, este repositorio hereda trabajo de mantenimiento que no le corresponde.

Ambos proyectos son independientes y ninguno debe necesitar al otro.

Existe una tensión real que esta decisión debe resolver, no ignorar. [AFP-000](../../library/domains/engineering-protocols/protocols/protocol-maturity.protocol.md) exige, para declarar `experimental`, la identificación del proyecto donde el protocolo se ejecutó. Borrar toda identificación haría honesta la independencia y deshonesta la madurez: diez de los doce protocolos tendrían que bajar a `proposed` y la suite se publicaría como propuesta sin evidencia verificable por un tercero.

## Decisión

**Citar no es depender.** La distinción se aplica así:

| Forma | Veredicto | Razón |
|---|---|---|
| Un activo de esta biblioteca dedicado a un proyecto externo | **No** | Convierte ese proyecto en contenido y en carga de mantenimiento. |
| Una cita a un proyecto externo en `## Evidencia y límites` | **Sí** | Es la traza que hace falsable la madurez declarada. |
| `observedIn` con el nombre del proyecto | **Sí** | Metadato de traza, del mismo tipo que `specRefs` para una especificación externa. |
| Un nombre de proyecto en el cuerpo normativo | **No** | Ya lo prohibía ADR-0006 y sigue prohibido. |

En consecuencia:

1. Se retira el case study. La evidencia que contenía permanece distribuida en la sección `## Evidencia y límites` de cada protocolo, que es donde el lector la necesita: junto a la afirmación que sostiene.
2. Las madureces no cambian. La identificación que AFP-000 exige sigue presente en cada protocolo.
3. El tipo `case-study` vuelve a `supported`: deja de existir un activo canónico de esa clase.
4. El criterio de independencia queda enunciado de forma comprobable: **este framework se adopta, valida y publica sin conocer ningún proyecto externo.** Si el proyecto citado desapareciera, la puerta de calidad seguiría en verde y la suite seguiría siendo adoptable; lo único que se perdería es la posibilidad de que un tercero verifique la evidencia, y esa pérdida se reflejaría bajando la madurez, no ocultándola.

## Excepción declarada a la política de deprecación

[`CONTRIBUTING_ASSETS.md`](../CONTRIBUTING_ASSETS.md) exige no borrar un activo estable sin transición y dejar la eliminación para una versión mayor cuando rompa rutas públicas. Esta decisión se salta esa transición, y lo declara en lugar de incumplirla en silencio.

Justificación:

- el activo existió durante una sola release, publicada el mismo día;
- ninguna ruta de aprendizaje, relación `related` ni superficie generada lo referenciaba, salvo las proyecciones que se regeneran;
- reservar la `4.0.0` —que el roadmap destina a interoperabilidad— para retirar un case study falsearía la magnitud del cambio ante quien consume el versionado.

Se clasifica como **MINOR** con retirada de ruta pública declarada. La excepción no crea precedente: un activo con más de una release publicada sigue exigiendo la transición completa.

## Alternativas consideradas

### Conservar el case study

- mantiene la trazabilidad más rica y en un solo lugar;
- hace que un proyecto externo sea contenido y mantenimiento de este repositorio;
- **descartada** por independencia.

### Borrar toda mención del proyecto externo

- independencia máxima y sin ambigüedad;
- obliga a bajar diez protocolos a `proposed`, porque AFP-000 exige identificar la evidencia;
- deja la suite sin nada que un tercero pueda verificar;
- **descartada**: compra independencia pagando con falsabilidad, que es la propiedad que esta suite existe para defender.

### Marcar el activo como `deprecated` y eliminarlo en `4.0.0`

- cumple la política de deprecación al pie de la letra;
- mantiene el acoplamiento durante toda la línea `3.x`;
- **descartada** a favor de la excepción declarada arriba.

## Consecuencias

### Positivas

- Ningún proyecto externo es contenido ni carga de mantenimiento de esta biblioteca.
- La evidencia queda junto a la afirmación que sostiene, en lugar de en un documento aparte que hay que ir a buscar.
- El criterio de independencia queda enunciado de forma comprobable.
- Las madureces siguen siendo falsables por un tercero.

### Negativas y riesgos

- Se pierde la vista consolidada de la evidencia: qué prácticas se observaron juntas y cómo se relacionaban entre sí ya no se lee de una vez.
- Se retira una ruta pública publicada, con la excepción declarada arriba.
- La traza queda repartida en doce secciones, y mantenerla coherente cuando la evidencia cambie es ahora trabajo de doce ediciones en lugar de una.

## Validación

- `npm run quality` en verde tras la retirada, con las proyecciones regeneradas.
- Comprobación de independencia: ningún nombre de proyecto externo aparece fuera de las secciones `## Evidencia y límites` y de `observedIn`, y la puerta de neutralidad de ADR-0006 sigue verificándolo.
- Señal que obligaría a revisar esta decisión: que la evidencia repartida se desincronice entre protocolos, o que un segundo proyecto la reproduzca y convenga volver a consolidarla.

## Referencias

- [ADR-0006](ADR-0006-protocol-asset-type.md)
- [Dominio de protocolos de ingeniería](../../library/domains/engineering-protocols/README.md)
- [AFP-000 — madurez y validación de protocolos](../../library/domains/engineering-protocols/protocols/protocol-maturity.protocol.md)
- [Política de deprecación](../CONTRIBUTING_ASSETS.md)
