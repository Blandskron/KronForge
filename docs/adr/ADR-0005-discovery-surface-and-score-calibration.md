# ADR-0005: Superficie de descubrimiento y recalibración del score

- **Estado:** accepted
- **Fecha:** 2026-09-03
- **Responsable:** maintainer del repositorio
- **Complementa:** [ADR-0002](ADR-0002-catalog-v3-projection.md) y [ADR-0004](ADR-0004-agent-skills-projection-and-spec-freshness.md)

## Contexto

Dos problemas distintos, ambos detectados en la misma revisión.

**Un agente que llega al sitio publicado no tiene puerta de entrada.** El portal sirve HTML pensado para personas y el catálogo JSON exige conocer su ruta. No existía un documento que dijera, en una sola lectura, qué es este repositorio, dónde está su conocimiento y qué reglas aplican antes de usarlo.

**El AI Repository Score dejó de discriminar.** Marcaba 98/100 mientras el repositorio incumplía el formato de skills, describía una revisión anterior de MCP y no tenía forma de detectar su propio envejecimiento. Cuatro de sus cincuenta criterios se cumplían por construcción: comprobaban que existiera un archivo mientras ese mismo archivo se estaba ejecutando, o buscaban una cadena de texto que nadie iba a borrar. Un criterio que no puede fallar no mide nada.

## Decisión

### `llms.txt` como tercera proyección

`llms.txt` se genera desde `library/catalog.json` y se compromete en Git, con el mismo contrato que el catálogo y que `skills/`: fuente canónica en Markdown, superficie materializada para consumidores que no pueden ejecutar un build, y verificación en la puerta de calidad.

- `scripts/build-llms.mjs` la genera; `--check` la verifica.
- El validador comprueba además que toda ruta publicada exista realmente en el repositorio.
- El contenido enumera entradas, políticas y activos por dominio, y declara explícitamente los dominios todavía sin conocimiento aplicable.

Se eligió `llms.txt` pese a no ser un estándar formal: es una convención de facto entre proyectos de documentación técnica y su coste es una proyección más, ya cubierta por el mecanismo existente. Si la convención se abandona, se retira un archivo generado y nada más.

### Recalibración del score

Se sustituyen cuatro criterios que siempre se cumplían por cuatro que pueden fallar:

| Dimensión | Retirado | Incorporado |
|---|---|---|
| Automatización | `Score reproducible` | `Superficies generadas verificadas` |
| Compatibilidad | `Matriz cubre agentes solicitados` | `Skills conformes al estándar abierto` |
| Descubribilidad | `Rutas de aprendizaje` | `Superficie llms.txt publicada` |
| Mantenibilidad | `Roadmap hasta v5` | `Referencias externas vigentes` |

Los retirados comprobaban la existencia de `scripts/score.mjs` desde dentro de `scripts/score.mjs`, la presencia de dos nombres de producto en un documento, un umbral de rutas ya superado con holgura y una cadena de texto del roadmap. Los cuatro siguen validándose donde corresponde —el validador cubre roadmap y rutas—, pero dejan de ocupar un lugar en la medición.

Los incorporados fallan de verdad: si alguien edita `skills/` a mano, rompe el `name` de una skill, borra `llms.txt` o deja caducar una referencia externa, el puntaje baja.

La escala no cambia: diez dimensiones, cinco criterios binarios, cien puntos.

## Alternativas consideradas

### Servir `llms.txt` desde el portal en tiempo de ejecución

- evitaría un archivo generado;
- exige JavaScript en el cliente para algo que debe leerse como texto plano, y rompe el caso principal: un agente que hace una sola petición;
- rechazada.

### Ampliar el score con dimensiones nuevas

- expresaría mejor las capacidades añadidas;
- rompe la comparabilidad con las mediciones anteriores y convierte cada entrega en una renegociación de la escala;
- pospuesta: primero conviene que los criterios existentes discriminen.

### Dejar el score como estaba

- máxima continuidad histórica;
- mantiene una métrica que su propia documentación advierte contra convertir en vanidad, ya materializada;
- rechazada.

### Crear los activos de interoperabilidad dentro de `mcp-integration`

- evita un dominio nuevo cuando ya hay tres sin activos;
- el alcance declarado de ese dominio es la conexión entre un agente y sus herramientas, donde la autoridad es propia; la comunicación con un par de otro dueño es un problema distinto y ubicarlo allí haría engañoso el nombre del dominio;
- rechazada.

## Consecuencias

### Positivas

- un agente puede orientarse con una sola lectura y sin conocer la estructura interna;
- el score vuelve a informar: un retroceso real ahora se ve;
- las tres proyecciones —catálogo, skills y `llms.txt`— comparten un mismo contrato de verificación.

### Negativas y riesgos

- una tercera superficie generada es una tercera cosa que puede quedar desactualizada, y la puerta lo impide solo mientras se ejecute;
- los puntajes anteriores a esta entrega no son estrictamente comparables con los posteriores, y el changelog debe recordarlo;
- `llms.txt` no es un estándar formal: su valor depende de que los clientes sigan respetándolo;
- el criterio de frescura del score depende de que alguien re-verifique de verdad, con la misma limitación ya declarada en [ADR-0004](ADR-0004-agent-skills-projection-and-spec-freshness.md).

## Validación

- `node scripts/build-llms.mjs --check`;
- `node scripts/validate.mjs`, grupo «Superficie de descubrimiento llms.txt»;
- `node scripts/score.mjs`;
- `npm run quality`.
