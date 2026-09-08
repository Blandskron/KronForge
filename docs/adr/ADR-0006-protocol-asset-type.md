# ADR-0006: Tipo de activo `protocol` y capa de protocolos de ingeniería

- **Estado:** accepted
- **Fecha:** 2026-09-07
- **Responsable:** maintainer del repositorio
- **Complementa:** [ADR-0001](ADR-0001-layered-framework-v3.md) y [ADR-0002](ADR-0002-catalog-v3-projection.md)

## Contexto

La biblioteca cubría bien el conocimiento reutilizable —prompts, skills, patrones, checklists, notas de arquitectura— pero no tenía forma de expresar un ciclo de vida normativo multi-actor.

El caso concreto que forzó la decisión: describir cómo varios agentes trabajan sobre un mismo repositorio exige declarar actores con autoridad distinta, estados y transiciones, contratos de entrada, evidencia exigida por compuerta, estados de falla y escalamiento. Los tipos existentes expresan partes de eso y ninguno el conjunto:

| Tipo evaluado | Por qué no basta |
|---|---|
| `playbook` | Procedimiento de un actor hacia un resultado. No modela autoridad distribuida ni transiciones de estado. |
| `pattern` | Contexto, problema, solución y consecuencias. Es descriptivo; no es normativo y no tiene ciclo de vida. |
| `architecture-note` | Explica una estructura o un concepto. No prescribe comportamiento. |
| `checklist` | Compuerta puntual de verificación, no ciclo. |
| `runbook` | Respuesta operativa a una situación conocida. |
| `best-practice` | Recomendación sin contrato ni evidencia exigida. |

Existe además un segundo motivo, independiente del vocabulario: un protocolo necesita metadatos que ningún otro tipo necesita —código estable, madurez, actores, dependencias entre protocolos, dónde se observó, cuándo se revalidó— y esos metadatos deben ser verificables por máquina para que las afirmaciones de madurez no sean decorativas.

La alternativa de forzar el concepto dentro de `pattern` habría contaminado el contrato de los veintisiete tipos existentes con campos que solo un tipo usa, y habría dejado sin distinguir un patrón descriptivo de una norma con autoridad.

## Decisión

### `protocol` es un tipo de primera clase

Se agrega el tipo `protocol` a `typeDefinitions`, en una categoría propia `protocol`, con carpeta `protocols`.

Un protocolo describe una interacción normativa con actores, ciclo de vida, contrato, evidencia, compuertas, estados de falla y madurez declarada. Se distingue de un `playbook` por ser multi-actor y normativo, y de un `pattern` por tener estados y transiciones.

### Metadatos `protocol` en el contrato del catálogo

El schema v3 acepta un objeto `protocol` en un activo, obligatorio para el tipo `protocol` y prohibido para los demás:

| Campo | Caso de uso que lo justifica |
|---|---|
| `code` | Citar el protocolo de forma estable desde código, tareas y otros protocolos, con independencia del ID del activo. |
| `maturity` | Distinguir una propuesta de una práctica reproducida. Es la afirmación central del protocolo. |
| `actors` | Permitir a un participante decidir si el protocolo le aplica sin leerlo entero. |
| `dependsOn` | Hacer el grafo de composición descubrible por máquina y verificable como acíclico. |
| `observedIn` | Traza hacia la evidencia que sostiene la madurez declarada. |
| `lastValidated` | Hacer que una madurez sin reevaluar envejezca en lugar de quedarse fija. |

No se agregaron campos para compuertas, estados de falla, entradas ni salidas. Los estados de falla tienen un dueño único —AFP-011— y repetirlos por protocolo crearía una segunda fuente de verdad; las compuertas son específicas de cada proyecto adoptante, no del protocolo; y entradas y salidas ya existen en el contrato general del activo.

### La puerta de calidad verifica lo declarado

Se agrega un grupo de validación con cinco controles que pueden fallar:

1. **Coherencia de madurez.** Un protocolo por encima de `proposed` con `observedIn` vacío es un error. Una madurez fuera del vocabulario también.
2. **Grafo.** `dependsOn` debe referenciar protocolos existentes y el grafo resultante no puede contener ciclos.
3. **Frescura de madurez.** Advertencia a los 180 días sin reevaluar, error a los 365. Los umbrales son más largos que los de `specRefs` porque un protocolo cambia más despacio que una especificación.
4. **Secciones obligatorias.** Todo protocolo debe declarar `## Actores`, `## Ciclo de vida`, `## Evidencia y límites` y `## Qué no afirma este protocolo`. Las dos últimas son las que impiden publicar una afirmación sin sus límites.
5. **Neutralidad de proveedor.** El cuerpo normativo no puede mencionar un proveedor, un modelo ni un proyecto concreto. Solo se permite en `## Evidencia y límites`, donde nombrar la fuente de la evidencia es obligatorio, y en `## Adaptadores no normativos`, explícitamente fuera del contrato.

El quinto control es el que convierte «esto es agnóstico al proveedor» en una afirmación falsable. Sin él, la neutralidad depende de la disciplina de quien escribe, y la disciplina no sobrevive a la prisa.

### Dominio propio para la suite

Los doce protocolos viven en un dominio nuevo, `engineering-protocols`, en lugar de repartirse por dominio temático.

La razón es que la suite se usa como sistema: su valor está en cómo se componen, y ese grafo deja de ser navegable si los protocolos se dispersan por ocho dominios. Los dominios temáticos enlazan a los protocolos que les conciernen; no los copian.

## Alternativas consideradas

### Expresar los protocolos con los tipos existentes

- no toca schema, validador ni portal;
- pierde la distinción entre norma y descripción, que es exactamente lo que el activo debe comunicar;
- deja los metadatos de madurez sin lugar, y sin ellos las afirmaciones de validación no son verificables;
- **descartada** porque el coste evitado es de mantenimiento y el coste aceptado es de credibilidad.

### Repartir los protocolos por dominio temático

- más fiel a la regla de elegir dominio por capacidad principal;
- dispersa doce activos fuertemente acoplados en ocho dominios;
- el grafo de dependencias y la tabla de madurez dejarían de tener un lugar donde vivir;
- **descartada** por navegabilidad.

### Un campo `maturity` genérico para todo activo

- útil más allá de los protocolos;
- obligaría a definir qué significa cada escalón para un prompt, una checklist o una referencia, y esa definición no existe;
- **descartada por ahora**; puede revisitarse cuando haya un segundo tipo que la necesite.

## Consecuencias

### Positivas

- La distinción entre norma y descripción queda expresada en el contrato, no en la prosa.
- La madurez declarada es verificable y caduca; una afirmación de validación no puede quedarse fija.
- La neutralidad de proveedor pasa de convención a compuerta.
- El grafo de composición es descubrible por máquina.
- Los tipos `case-study` y `example` pasan de `supported` a `active` al recibir su primer activo canónico.

### Negativas y riesgos

- Un tipo más que mantener, con su categoría y su carpeta.
- El léxico de neutralidad es una lista y las listas envejecen: un proveedor nuevo no se detecta hasta que se agrega. Mitigación: la lista cubre lo que el repositorio y su caso de estudio usan hoy, y su ampliación es un cambio de una línea.
- Un falso positivo del léxico es posible si un término común coincide con un nombre de producto. Mitigación: las dos secciones exentas cubren los usos legítimos conocidos.
- La suite entera nace en `experimental`. El repositorio publica ahora conocimiento cuya utilidad está argumentada y no medida, y lo declara en cada activo.

## Validación

- `npm run validate` ejecuta el grupo «Contrato de protocolos, madurez y neutralidad».
- La neutralidad se verificó por falsación: introducir un nombre de proveedor en el cuerpo normativo de un protocolo hace fallar la puerta.
- Señal que obligaría a revisar esta decisión: que un segundo tipo de activo necesite metadatos de madurez, o que el léxico de neutralidad produzca falsos positivos recurrentes.

## Referencias

- [Dominio de protocolos de ingeniería](../../library/domains/engineering-protocols/README.md)
- [AFP-000 — madurez y validación de protocolos](../../library/domains/engineering-protocols/protocols/protocol-maturity.protocol.md)
- [Caso de estudio con la evidencia empírica](../../library/domains/engineering-protocols/case-studies/agnara-multi-agent.case-study.md)
- [Cómo contribuir activos](../CONTRIBUTING_ASSETS.md)
