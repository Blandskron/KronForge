# Conservar evidencia sin incorporar otro proyecto

## Antes y decisión

Antes de `664c3ed`, la biblioteca alojaba como activo canónico un caso dedicado a otro proyecto. El cambio retiró el activo y conservó la traza de las observaciones donde respalda a cada protocolo. La [decisión registrada](../adr/ADR-0007-evidence-citation-not-dependency.md) documenta la regla y la excepción aplicada a la retirada.

## Reproducción

Desde la raíz, con el historial Git y Node.js 24, comprueba la retirada y ejecuta los controles actuales de los protocolos.

```text
git diff --name-status 664c3ed^ 664c3ed -- docs/adr library/domains/engineering-protocols
node --test tests/protocols.test.mjs
```

Lee la sección de evidencia de [AFP-004](../../library/domains/engineering-protocols/protocols/evidence-and-gates.protocol.md) y contrasta su alcance con la madurez declarada al inicio del mismo archivo.

## Resultado observado

El diff registró la retirada de un archivo de caso y la incorporación de la decisión asociada. En `a15c98b` las pruebas comprobaron, entre otras reglas, paridad de metadatos, requisitos de madurez y neutralidad del cuerpo normativo. Esta reproducción inspecciona el historial de KronForge. La réplica independiente y la medición de efectividad siguen siendo evidencias distintas.

[Volver a los casos reproducibles](README.md)
