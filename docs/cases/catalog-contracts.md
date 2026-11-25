# Completar los contratos del catálogo v3

## Antes y decisión

En el padre de `a15c98b`, el catálogo tenía campos contractuales vacíos y el validador emitía advertencias. El cambio declaró las entradas, salidas y casos de uso en el Markdown canónico y extendió su comprobación de paridad. El [contrato editorial](../CONTRIBUTING_ASSETS.md) describe la relación entre ambos formatos.

## Reproducción

Desde la raíz, con el historial y Node.js 24, verifica primero la forma pública y luego el contenido que sirve el checkout actual.

```text
git diff --exit-code a15c98b^ a15c98b -- library/schema/catalog-v3.schema.json
npm run validate
```

Para localizar la evidencia documental, abre el [catálogo](../../library/catalog.json) y busca `architecture.adr`. Contrasta sus listas con el front matter de la [plantilla de decisión](../../library/domains/architecture/templates/adr.template.md).

## Resultado observado

El diff del schema salió vacío y el validador del commit `a15c98b` aprobó 13 grupos, con cero errores ni advertencias. Los 65 activos declaraban los tres campos. Una ejecución posterior puede cubrir más activos. La paridad demuestra consistencia de la publicación y la fuente. La utilidad de cada contrato para un consumidor requiere revisar su contenido y uso.

[Volver a los casos reproducibles](README.md)
