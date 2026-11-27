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

Para comunicar una vulnerabilidad o una exposición de datos, abre [Advisories de KronForge](https://github.com/Blandskron/KronForge/security/advisories) y selecciona **Report a vulnerability**. Describe el alcance y el impacto con la evidencia mínima necesaria. Redacta los valores de secretos y los datos personales incluso en el reporte privado.

Si la opción privada no aparece, solicita coordinación mediante un [issue público mínimo](https://github.com/Blandskron/KronForge/issues/new) con el título `Solicitud de coordinación de seguridad`. Incluye solo:

- superficie general afectada;
- si el problema sigue presente;
- una forma pública y no sensible de continuar la coordinación, si dispones de ella.

## Qué ocurrirá después

El mantenedor:

1. confirmará recepción;
2. validará alcance e impacto sin ejecutar explotación innecesaria;
3. acordará remediación y divulgación responsable;
4. publicará un parche y notas suficientes cuando corresponda.

Los reportes se priorizan por impacto y posibilidad de exposición. Consulta el [aviso de privacidad](docs/PRIVACY.md) para otras consultas sobre datos del portal.

## Divulgación

Mientras la investigación esté pendiente, conserva los detalles técnicos en el reporte privado o en el canal acordado con el mantenedor. Al coordinar la divulgación, ambas partes acuerdan qué información puede publicarse.

No se publicarán secretos, datos personales ni instrucciones ofensivas. Los créditos al reportante serán opcionales y requerirán su consentimiento.
