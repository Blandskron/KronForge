# AI Repository Score

## Objetivo

AI Repository Score mide de forma objetiva y repetible qué tan preparado está un repositorio para colaboración entre personas y agentes. No mide popularidad, cantidad de prompts ni calidad del producto de software.

## Ejecución

```powershell
node scripts/score.mjs
```

Salida estructurada:

```powershell
node scripts/score.mjs --json
```

## Dimensiones

Cada dimensión vale 10 puntos y contiene cinco criterios binarios de 2 puntos.

| Dimensión | Qué observa |
|---|---|
| Preparación para agentes | entradas, prompt, permisos, pruebas y compatibilidad |
| Calidad documental | contratos, estándares, auditoría y front matter |
| Gobernanza | contribución, conducta, ownership y templates |
| Seguridad | divulgación, límites para agentes y protección de secretos |
| Automatización | validación, smoke tests, tests, CI y verificación de superficies generadas |
| Compatibilidad | neutralidad, modelos, agentes, adaptadores y conformidad de skills |
| Reutilización | dominios, tipos, relaciones y contratos |
| Descubribilidad | búsqueda, filtros, tags, `llms.txt` y URLs |
| Mantenibilidad | ADR, SemVer, changelog, schema y frescura de referencias externas |
| Escalabilidad | taxonomía, unicidad y separación de fuentes |

## Niveles

| Puntaje | Nivel | Interpretación |
|---:|---|---|
| 90–100 | A | referencia madura y automatizada |
| 75–89 | B | preparada, con brechas localizadas |
| 60–74 | C | operable, requiere estandarización |
| 40–59 | D | preparación parcial y alto trabajo manual |
| 0–39 | E | contexto y controles insuficientes |

## Reglas

- La fórmula vive en `scripts/score.mjs`.
- Un criterio solo puntúa cuando existe evidencia local verificable.
- **Un criterio que no puede fallar no se admite.** Comprobar la existencia de un archivo mientras ese archivo se ejecuta, o buscar una cadena que nadie va a borrar, no mide nada. Ver [ADR-0005](adr/ADR-0005-discovery-surface-and-score-calibration.md).
- Los campos vacíos no cuentan como cobertura.
- El score puede bajar cuando el contrato se vuelve más exigente.
- El cálculo ejecuta primero la validación integral. Si falla, conserva el puntaje diagnóstico pero marca `valid: false`, no asigna nivel y termina con error.
- Un puntaje alto no sustituye revisión humana, seguridad ni pruebas del producto.
- Los cambios de fórmula se registran mediante ADR y changelog.

## Comparabilidad entre versiones

La fórmula cambió en la entrega `3.2.0`: cuatro criterios que se cumplían por construcción fueron sustituidos por controles que pueden fallar. Los puntajes anteriores y posteriores a ese cambio no son estrictamente comparables. Cada recalibración se registra mediante ADR y changelog.

## Uso recomendado

1. Ejecutar antes y después de una evolución documental.
2. Revisar criterios faltantes, no solo el total.
3. Priorizar dimensiones críticas para el contexto del repositorio.
4. No crear archivos de relleno únicamente para elevar el puntaje.
