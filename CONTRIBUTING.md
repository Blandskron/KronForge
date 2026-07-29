# Contribuir a Agents First Repo Docs

Gracias por ayudar a mejorar el framework. Las contribuciones deben aumentar su utilidad para personas y agentes sin convertirlo en una metodología pesada, asumir un proveedor o duplicar conocimiento canónico.

## Antes de contribuir

1. Lee [GOVERNANCE.md](GOVERNANCE.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) y los [estándares documentales](docs/DOCUMENTATION_STANDARDS.md).
2. Busca primero en los issues y en [`library/catalog.json`](library/catalog.json).
3. Usa [SUPPORT.md](SUPPORT.md) para elegir el canal correcto.
4. Si el asunto puede revelar una vulnerabilidad, un secreto o datos personales, no abras un reporte público: sigue [SECURITY.md](SECURITY.md).

## Formas de contribuir

- corregir documentación, enlaces o accesibilidad;
- reportar fallos del portal estático;
- proponer o mejorar un activo reusable;
- plantear una decisión estructural mediante una propuesta y, cuando corresponda, un ADR;
- mejorar validaciones sin introducir un runtime ni un build obligatorio.

Las consultas generales, los reportes de fallos y las propuestas usan rutas distintas. Revisa las plantillas disponibles al crear un issue.

## Flujo de trabajo

1. Abre un issue antes del cambio cuando el alcance sea estructural, afecte compatibilidad, agregue una política o requiera una decisión de producto.
2. Trabaja en una rama o fork con un cambio acotado.
3. Conserva HTML, CSS y JavaScript nativo para el portal.
4. No inventes comandos. Este repositorio no requiere instalación ni build; ejecuta solo las validaciones reales documentadas en [`docs/agent/TESTS.md`](docs/agent/TESTS.md).
5. Actualiza documentación, índices, metadatos y changelog cuando el cambio lo requiera.
6. Abre un pull request usando la plantilla y adjunta evidencia reproducible.

No existe una convención obligatoria de nombres de ramas o commits. Usa nombres y mensajes claros que expliquen intención y alcance.

## Contribuir activos

Los prompts, skills, templates, checklists, playbooks, patrones, anti-patrones y referencias siguen el contrato especializado de [CONTRIBUTING_ASSETS.md](docs/CONTRIBUTING_ASSETS.md).

Una contribución de activo debe, además:

- aportar un resultado reusable y no una variante superficial;
- declarar límites, compatibilidad y evidencia;
- mantener alineados el archivo canónico, el índice de dominio y el catálogo;
- respetar la [política de lifecycle](PROMPT_VERSIONING.md).

## Pull requests

Todo pull request debe explicar:

- problema y resultado buscado;
- archivos y superficies afectadas;
- compatibilidad, migración o deprecación, si aplica;
- validaciones ejecutadas y resultados;
- riesgos, pendientes y decisiones humanas necesarias.

Los criterios de revisión y cierre viven en [QUALITY_GATES.md](docs/QUALITY_GATES.md). Un checklist marcado sin evidencia no demuestra cumplimiento.

El maintainer puede solicitar cambios, dividir el alcance o rechazar una propuesta que duplique activos, rompa los principios del framework o aumente el costo de mantenimiento sin beneficio verificable.

## Licencia y procedencia

Al enviar una contribución confirmas que:

- tienes derecho a aportar el contenido;
- el contenido no incluye secretos, datos personales ni material copiado sin permiso;
- aceptas que la contribución se distribuya bajo la licencia [MIT](LICENSE) del repositorio.

El proyecto no exige actualmente un CLA o DCO adicional.

## Conducta, soporte y seguridad

- Participación comunitaria: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Preguntas y rutas de ayuda: [SUPPORT.md](SUPPORT.md).
- Reportes de seguridad: [SECURITY.md](SECURITY.md).
- Decisiones y responsabilidades: [GOVERNANCE.md](GOVERNANCE.md) y [MAINTAINERS.md](MAINTAINERS.md).
