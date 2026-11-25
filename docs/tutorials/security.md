# Revisar los límites defensivos del lector de Markdown

**Nivel** · Intermedio

**Prerrequisito** · Disponer de lectura del código y de pruebas locales del lector.

Consulta [Auditoría defensiva de repositorios](../../library/domains/security/prompts/security-audit.prompt.md) antes de empezar.

## Ejercicio

1. Sigue el dato desde el Markdown hasta el HTML del visor. Marca dónde se transforma el contenido y qué clases de enlaces permite el lector.
2. Ejecuta las pruebas defensivas ya incluidas en el caso. Conserva en el registro el nombre del control y su resultado.
3. Enumera dos límites de cobertura, como el resto de rutas de entrada y el comportamiento completo de un navegador, y asigna una verificación defensiva a cada uno.

## Entrega y aceptación

Una nota de revisión con fuentes, controles observados y cobertura pendiente. Cada control citado tiene archivo y resultado reproducible y las conclusiones respetan el alcance de la prueba.

[Volver a los tutoriales por dominio](README.md) · [Caso reproducible de Controles del lector Markdown](../cases/markdown-reader.md)
