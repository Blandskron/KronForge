# Verificar el lector de Markdown

## Antes y decisión

El portal carga Markdown para mostrarlo, copiarlo y descargarlo. En el visor coexisten dos responsabilidades. El cargador maneja respuestas asíncronas y el renderizador transforma la fuente en contenido de lectura. Conserva una prueba para cada límite de manera que el resultado identifique qué responsabilidad se comprobó.

## Reproducción

Con Node.js 24 y un checkout de KronForge, ejecuta desde la raíz.

```text
node --test tests/markdown.test.mjs tests/loader.test.mjs
```

Lee los controles de [representación](../../tests/markdown.test.mjs) y [carga](../../tests/loader.test.mjs). Registra qué condición verifican y qué comportamiento del navegador queda para el trabajo de CI.

## Resultado observado

En `a15c98b` pasaron cinco pruebas. Se comprobó la estructura documental, el tratamiento del front matter, la conversión a HTML semántico, la política de enlaces y la conservación de la respuesta vigente cuando otra carga queda obsoleta. Las aserciones corresponden al lector de KronForge y a las entradas cubiertas por esas pruebas.

[Volver a los casos reproducibles](README.md)
