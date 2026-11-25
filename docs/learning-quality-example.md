# Ejercicio reproducible de calidad

Usa una copia limpia de KronForge y Node.js 24. El ejercicio corresponde a la ruta de testing y usa únicamente las pruebas del repositorio. Reserva un directorio de trabajo independiente si ya tienes cambios locales.

1. Ejecuta `git status --short` y `git rev-parse HEAD`. Anota el estado y el commit para poder repetir la comprobación.
2. Lee [los criterios de calidad](QUALITY_GATES.md). Selecciona tres comportamientos observables como el render de Markdown, las rutas compartibles y el contrato del catálogo.
3. Ejecuta `npm run quality`. Registra el código de salida, los fallos y los avisos por separado. Guarda el nombre de cada prueba que respalde tus observaciones.
4. Ejecuta `npm run smoke` y registra la ruta base y la cantidad de rutas comprobadas. Usa el [checklist de pre-merge](../library/domains/quality-engineering/checklists/pre-merge.checklist.md) para decidir qué evidencia adicional faltaría para una entrega.

Entrega una tabla con comportamiento, comando, resultado observado y límite. La cantidad de pruebas puede cambiar entre commits. Un smoke test HTTP local demuestra que las rutas del repositorio resuelven en el entorno probado. Para comprobar producción, registra la URL pública, el commit desplegado y los recursos consultados.
