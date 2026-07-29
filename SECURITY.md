# Política de Seguridad

## Alcance

Aunque el proyecto es documental y su portal es estático, un reporte de seguridad puede involucrar:

- exposición de secretos o datos personales;
- contenido copiable que induzca operaciones inseguras;
- XSS, inyección o navegación insegura en el portal;
- dependencias externas del sitio o cadena de publicación;
- permisos, hooks, MCP, agentes o ejemplos con autoridad excesiva.

Las reglas internas para agentes están separadas en [`docs/agent/SECURITY.md`](docs/agent/SECURITY.md).

## Versiones soportadas

Se mantiene la versión disponible en la rama predeterminada. No existe por ahora una garantía de soporte para snapshots o versiones históricas. La política de releases define cómo podrá ampliarse esta ventana.

## Cómo reportar

No publiques en un issue:

- detalles explotables;
- pruebas de concepto activas;
- tokens, credenciales o datos personales;
- rutas o instrucciones que faciliten abuso.

El repositorio todavía no tiene un canal privado de seguridad confirmado. Para solicitar coordinación **sin detalles sensibles**, abre un [issue público mínimo](https://github.com/Blandskron/agents-first-repo-docs/issues/new) con el título `Solicitud de coordinación de seguridad` e incluye solo:

- superficie general afectada;
- si el problema sigue presente;
- una forma pública y no sensible de continuar la coordinación, si dispones de ella.

> [!IMPORTANT]
> Está pendiente que el owner habilite GitHub Private Vulnerability Reporting o publique otro canal privado verificable. Hasta entonces, no envíes información confidencial a este repositorio. El issue público no es un canal seguro.

## Qué ocurrirá después

Cuando exista un canal privado, el maintainer:

1. confirmará recepción;
2. validará alcance e impacto sin ejecutar explotación innecesaria;
3. acordará remediación y divulgación responsable;
4. publicará un parche y notas suficientes cuando corresponda.

No se promete un SLA hasta que exista un proceso privado operativo. Los reportes se priorizarán por impacto y posibilidad de exposición.

## Divulgación

No se publicarán secretos, datos personales ni instrucciones ofensivas. Los créditos al reportante serán opcionales y requerirán su consentimiento.
