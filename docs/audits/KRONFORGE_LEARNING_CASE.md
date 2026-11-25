# Caso reproducible en KronForge · Aprendizaje sin cambiar el catálogo v3

## Antes

En el commit `eeaa52e` las tarjetas se construían con las secuencias de `learningPaths`. La fuente de ese momento tenía 14 rutas de activos. Cada secuencia podía recorrerse, pero no tenía prerrequisito, objetivo ni entregable. Un consumidor estricto del catálogo v3 podría rechazar propiedades nuevas en las rutas.

## Decisión

Agregar orientación editorial en [Markdown](../LEARNING_GUIDANCE.md), proyectarla en un archivo JSON separado y cargarla como complemento. El catálogo sigue proporcionando las rutas y el orden de los activos, incluso si el complemento falla.

## Reproducción

1. Desde una copia que conserve el commit de partida, ejecuta `git diff eeaa52e -- library/schema/catalog-v3.schema.json`. El resultado esperado es un diff vacío.
2. Ejecuta `npm run build` y `npm run quality`. Comprueba que la proyección esté actualizada y que el smoke test incluya `library/learning-guidance.json`.
3. Ejecuta el [verificador de navegador](../../scripts/browser-check.cjs) siguiendo [la configuración de pruebas](../QUALITY_GATES.md). Comprueba el entregable de testing y el recorrido alternativo cuando el complemento devuelve HTTP 503.
4. Registra tu resultado en el [formato de evidencia](../../library/domains/engineering-protocols/templates/evidence-record.template.md), con el estado del código y el entorno.

## Límites

Este caso usa el propio repositorio y prueba compatibilidad de contrato, descubrimiento y recuperación del portal. La reproducción independiente y las mediciones de impacto requieren otra organización o proyecto y una verificación separada.
