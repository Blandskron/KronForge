# ADR-0004: Proyección de skills conforme al estándar y frescura verificable

- **Estado:** accepted
- **Fecha:** 2026-09-03
- **Responsable:** maintainer del repositorio
- **Complementa:** [ADR-0002](ADR-0002-catalog-v3-projection.md) y [ADR-0003](ADR-0003-zero-dependency-quality-gate.md)

## Contexto

La auditoría de septiembre de 2026 encontró dos problemas que ninguna validación existente podía detectar.

**Primero: las skills del repositorio no eran consumibles.** El formato Agent Skills dejó de ser una convención de un proveedor y se consolidó como estándar abierto adoptado por decenas de clientes. Ese formato exige un directorio cuyo nombre coincida con el campo `name` y que contenga `SKILL.md`. Las skills de este repositorio viven en `library/domains/<dominio>/skills/<nombre>/SKILL.md`, una ruta que ningún cliente descubre. El proyecto documentaba un formato que él mismo no podía distribuir.

**Segundo: el repositorio no podía saber que había envejecido.** Varios activos describían una revisión anterior de una especificación externa. El contenido era internamente coherente, los enlaces resolvían y la puerta de calidad pasaba, porque ningún activo declaraba contra qué versión de la fuente había sido escrito. El fallo no era de contenido: era la ausencia de un control.

## Decisión

### Proyección de skills

`skills/` en la raíz es una **proyección generada y comprometida en Git** del Markdown canónico de `library/`, en el mismo sentido que `library/catalog.json`: una superficie materializada para consumidores que no pueden ejecutar un build.

- La fuente de verdad sigue siendo `library/domains/<dominio>/skills/`.
- `scripts/build-skills.mjs` la genera; `--check` la verifica.
- `npm run validate` falla si la proyección difiere de su fuente.
- El front matter proyectado contiene solo campos del formato abierto. Los metadatos del repositorio viajan en `metadata`.
- Los enlaces relativos se reescriben para resolver desde la nueva profundidad.
- Cada archivo proyectado declara su procedencia y prohíbe editarse en destino.

El campo `compatibility` se emite en `metadata`, no como campo del estándar. En el repositorio significa neutralidad de modelo o herramienta; en el estándar significa requisitos de entorno. Emitirlo tal cual habría publicado una declaración que un cliente interpretaría de otra forma.

### Frescura verificable

Todo activo que sostenga una afirmación sobre una fuente externa declara `specRefs` con `spec`, `url` y `verified`, y opcionalmente `version`. El validador advierte a los 90 días y falla a los 180 sin re-verificación. El contrato completo está en [SPEC_FRESHNESS.md](../SPEC_FRESHNESS.md).

`specRefs` es opcional en el schema y obligatorio por política. El schema del catálogo permanece en la versión 3: el campo es aditivo y no rompe a ningún consumidor existente.

## Alternativas consideradas

### Mover las skills canónicas a la raíz

- elimina toda duplicación y es lo que el prompt maestro ya recomienda para un repositorio cualquiera;
- rompe las rutas públicas de tres activos y saca las skills de su dominio, contra la organización por dominios;
- rechazada para esta entrega; reconsiderable si el volumen de skills crece.

### Publicar solo un enlace desde la raíz

- cero duplicación;
- un puntero no es una skill: ningún cliente puede cargarlo;
- rechazada.

### Detectar el envejecimiento comparando la fuente automáticamente

- detectaría el cambio real, no solo su falta de comprobación;
- exige red en la puerta de calidad, tolerancia a fuentes caídas y parseo de páginas que cambian de forma;
- rechazada por ahora; el control declarativo no depende de red y ya obliga a la acción correcta.

### Bloquear siempre a los 90 días

- máxima frescura;
- convierte cualquier entrega en una revisión completa de referencias externas;
- rechazada en favor de dos umbrales.

## Consecuencias

### Positivas

- las skills del repositorio se cargan en clientes reales sin conocer su estructura interna;
- el estándar se cumple de forma verificable, no declarativa;
- el envejecimiento silencioso deja de ser posible sin que la puerta lo señale;
- la política de frescura es reutilizable por cualquier repositorio que adopte el framework.

### Negativas y riesgos

- el cuerpo de cada skill existe dos veces en el repositorio; la puerta impide que diverjan, pero el diff de una skill toca dos archivos;
- `verified` puede actualizarse sin abrir la fuente, y ninguna automatización puede impedirlo: es la única regla que depende por completo de la honestidad de quien revisa;
- el umbral de 180 días bloqueará entregas no relacionadas si nadie re-verifica a tiempo, que es el efecto buscado y también una fricción real;
- el parser de front matter tuvo que admitir mapas anidados y listas de objetos, ampliando su superficie.

## Validación

- `node scripts/build-skills.mjs --check`;
- `node scripts/validate.mjs`, grupos «Frescura de referencias externas» y «Conformidad Agent Skills y proyección distribuible»;
- `npm run quality`.
