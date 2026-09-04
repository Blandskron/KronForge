# Frescura Verificable de Referencias Externas

## Problema

Un proyecto documental sobre IA envejece en silencio. El contenido sigue siendo internamente coherente, los enlaces siguen resolviendo y las validaciones siguen pasando mientras la afirmación que sostiene el documento ya dejó de ser cierta.

La auditoría de septiembre de 2026 encontró exactamente eso en este repositorio: activos correctos que describían una versión anterior de una especificación externa, sin que ninguna validación pudiera detectarlo. Ningún control fallaba porque ningún activo declaraba **contra qué versión** había sido escrito.

## Contrato

Todo activo que sostenga una afirmación sobre un estándar, especificación o publicación externa declara `specRefs` en su front matter.

```yaml
specRefs:
  - spec: mcp
    version: "2026-07-28"
    url: https://modelcontextprotocol.io/specification/2026-07-28/changelog
    verified: 2026-09-03
```

| Campo | Obligatorio | Significado |
|---|---|---|
| `spec` | sí | identificador estable de la fuente, en minúsculas y guiones |
| `url` | sí | fuente primaria consultada |
| `verified` | sí | fecha `YYYY-MM-DD` en que un humano o agente comprobó la fuente |
| `version` | no | versión, edición o fecha de la especificación, cuando la publica |

`verified` no es la fecha en que se escribió el activo. Es la fecha en que alguien volvió a abrir la fuente y confirmó que lo escrito sigue siendo cierto.

## Umbrales

El validador aplica dos umbrales sobre `verified`:

| Antigüedad | Resultado | Significado |
|---|---|---|
| menor a 90 días | correcto | la afirmación se considera vigente |
| 90 a 180 días | advertencia | requiere revisión en la próxima entrega |
| mayor a 180 días | error | bloquea la puerta de calidad |

Un error no significa que el contenido esté mal. Significa que **nadie puede afirmar que siga bien**, que es una situación distinta y peor.

## Cómo se re-verifica

1. Abre la `url` declarada.
2. Comprueba si la especificación publicó una versión posterior a la declarada.
3. Si no cambió nada relevante, actualiza `verified` a la fecha de hoy.
4. Si cambió, corrige el activo, actualiza `version` y `verified`, clasifica el cambio con SemVer y regístralo en el [changelog](CHANGELOG.md).

Actualizar `verified` sin abrir la fuente invalida el control por completo. Es la única regla que no puede automatizarse.

## Qué no cubre

- No detecta que una fuente cambió: detecta que nadie lo comprobó.
- No aplica a afirmaciones sobre el propio repositorio, que ya validan otros controles.
- No sustituye la revisión editorial ni la clasificación SemVer.
- No garantiza que la fuente declarada sea la autoritativa; eso lo decide la revisión.

## Alcance actual

`specRefs` es opcional en el schema del catálogo y obligatorio por política para los activos que citan una fuente externa. Los activos que solo documentan decisiones propias no lo declaran y no se ven afectados.

La cobertura se reporta en el [AI Repository Score](AI_REPOSITORY_SCORE.md) y su omisión indebida es un hallazgo de revisión, no un fallo automático: ninguna heurística puede decidir de forma fiable si una prosa constituye una afirmación sobre un estándar externo.

## Relación con otras políticas

- [PROMPT_VERSIONING.md](../PROMPT_VERSIONING.md) clasifica el cambio resultante.
- [QUALITY_GATES.md](QUALITY_GATES.md) incorpora la re-verificación como criterio de revisión.
- [docs/agent/TESTS.md](agent/TESTS.md) documenta la ejecución del control.
