# Gobernanza

## Modelo

Agents First Repo Docs usa un modelo **maintainer-led con consulta abierta**. La comunidad propone, aporta evidencia y revisa; el maintainer busca consenso y conserva la decisión final sobre integración, releases y políticas.

Este modelo refleja la realidad actual de un proyecto con un único owner. No simula comités ni roles que todavía no existen.

## Roles

### Usuarios

Consumen el framework, reportan problemas y aportan feedback.

### Contribuidores

Abren issues o pull requests y cumplen contribución, conducta, seguridad y quality gates.

### Maintainers

- revisan e integran cambios;
- resguardan compatibilidad, seguridad y calidad;
- administran releases y deprecaciones;
- moderan los espacios del proyecto;
- designan ownership adicional cuando exista participación sostenida.

La lista vigente está en [MAINTAINERS.md](MAINTAINERS.md). `CODEOWNERS` automatiza solicitudes de revisión, pero no sustituye esa lista ni concede por sí solo autoridad de gobernanza.

## Tipos de decisión

| Decisión | Mecanismo mínimo | Autoridad final |
|---|---|---|
| Corrección compatible y acotada | Pull request con evidencia | Maintainer revisor |
| Nuevo activo o capacidad | Issue/propuesta y pull request | Maintainer del alcance |
| Cambio de política o taxonomía | RFC público y revisión explícita | Owner |
| Cambio arquitectónico o incompatible | RFC, ADR y plan de migración | Owner |
| Release, deprecación urgente o seguridad | Quality gates y registro de decisión | Owner |

## Proceso

1. Definir el problema y aportar evidencia.
2. Identificar compatibilidad, riesgos y alternativas.
3. Permitir revisión pública razonable según alcance, sin prometer un plazo fijo.
4. Registrar una decisión arquitectónica mediante ADR cuando cambien estructura, contratos, fuentes canónicas o políticas de largo plazo.
5. Implementar mediante pull request y cumplir [QUALITY_GATES.md](docs/QUALITY_GATES.md).
6. Registrar el resultado en los documentos y versiones correspondientes.

El silencio no equivale a aprobación. La aprobación de contenido no autoriza acciones sensibles fuera del alcance del pull request.

## Desacuerdos y conflictos

Las objeciones deben centrarse en evidencia, principios y trade-offs. Si no hay consenso, el owner decide y documenta la razón.

Un maintainer con conflicto de interés debe declararlo y evitar ser el único revisor cuando exista otra persona autorizada. Mientras haya un solo maintainer, esa limitación debe quedar explícita en la decisión.

Los incidentes de conducta siguen [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md); los asuntos de seguridad siguen [SECURITY.md](SECURITY.md).

## Incorporación o retiro de maintainers

El owner puede incorporar un maintainer después de contribuciones sostenidas, revisiones confiables y aceptación explícita de estas políticas. El alcance debe registrarse en `MAINTAINERS.md` y `CODEOWNERS`.

El acceso puede retirarse por solicitud, inactividad prolongada, riesgo de seguridad o incumplimiento. El retiro debe preservar privacidad y continuidad del proyecto.

## Cambios a esta gobernanza

Requieren propuesta pública, revisión del owner y registro en changelog. Los cambios que alteren autoridad, compatibilidad o proceso de release deben incluir ADR.
