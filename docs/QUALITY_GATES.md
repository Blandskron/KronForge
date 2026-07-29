# Quality Gates

## Uso

Estos gates son la política de revisión y Definition of Done del repositorio. Se evalúan con `Cumple`, `No cumple` o `No aplica`, siempre con evidencia o justificación.

Los activos genéricos del catálogo pueden ayudar a ejecutar una revisión, pero no sustituyen esta política específica.

## Review Checklist

### Alcance y decisión

- [ ] El cambio responde al problema acordado.
- [ ] El diff no incorpora archivos ajenos.
- [ ] Supuestos, alternativas y decisiones no obvias están documentados.
- [ ] Cambios estructurales o incompatibles tienen issue/RFC, ADR y aprobación cuando corresponde.

### Contenido y fuentes canónicas

- [ ] No existe duplicación sustancial con un documento o activo vigente.
- [ ] El portal presenta contenido canónico y no introduce una segunda fuente de verdad.
- [ ] Índices, catálogo, front matter y relaciones están alineados.
- [ ] No se inventaron comandos, resultados, versiones, soporte o autodetección de herramientas.

### Documentación

- [ ] Los enlaces internos y sus anclas resuelven.
- [ ] Las cercas Markdown están cerradas y la jerarquía es legible.
- [ ] Rutas, nombres, idioma y accesibilidad siguen [DOCUMENTATION_STANDARDS.md](DOCUMENTATION_STANDARDS.md).
- [ ] README, políticas, runbooks, ejemplos y changelog se actualizaron cuando aplica.

### Sitio estático

- [ ] `index.html`, CSS, JavaScript, parciales y contenido enlazado responden por HTTP.
- [ ] Navegación, búsqueda, filtros, lectura, copia y descarga funcionan cuando fueron afectados.
- [ ] La consola no presenta errores bloqueantes.
- [ ] Se comprobó escritorio y móvil para cambios visuales.
- [ ] GitHub Pages conserva HTML, CSS y JavaScript nativo sin build obligatorio.

### Seguridad y comunidad

- [ ] No hay secretos, credenciales, datos personales o detalles explotables.
- [ ] Autoridad, permisos y aprobación humana no se ampliaron implícitamente.
- [ ] Contribución, conducta, soporte y divulgación de seguridad siguen sus políticas.
- [ ] Dependencias o recursos externos nuevos tienen necesidad, procedencia y riesgo documentados.

### Compatibilidad y release

- [ ] El cambio fue clasificado con SemVer.
- [ ] Rutas, IDs, schema y contratos estables conservan compatibilidad o tienen migración y deprecación.
- [ ] Versiones del catálogo, portal y changelog son coherentes.
- [ ] Las validaciones omitidas y riesgos pendientes están declarados.

## Definition of Done

Una tarea está terminada cuando:

1. los criterios de aceptación se verificaron con evidencia;
2. el cambio permanece dentro del alcance aprobado;
3. las fuentes canónicas y sus índices son coherentes;
4. las validaciones reales aplicables terminan correctamente;
5. documentación, versiones, roadmap, ADR y changelog están actualizados cuando corresponde;
6. no se introdujeron regresiones conocidas, secretos ni debilitamiento de seguridad;
7. compatibilidad, deprecación y migración están resueltas o documentadas;
8. toda validación no ejecutada tiene motivo y riesgo explícitos;
9. las aprobaciones humanas requeridas fueron obtenidas;
10. un revisor puede reproducir la evidencia.

Marcar una casilla no reemplaza la evidencia. Un pendiente bloqueante impide declarar la tarea terminada.

## Excepciones

`No aplica` requiere una justificación concreta. El maintainer puede aceptar deuda no bloqueante solo si queda registrada con impacto, responsable de decisión y condición de seguimiento.
