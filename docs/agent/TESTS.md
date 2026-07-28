# Pruebas y Validación

Este repositorio no tiene suite de aplicación ni build system. La validación combina controles documentales, consistencia del catálogo y prueba HTTP del sitio estático.

## 1. Enlaces Markdown

Verifica todos los enlaces relativos en archivos Markdown:

- elimina fragmentos `#...` antes de resolver la ruta;
- decodifica rutas cuando corresponda;
- ignora URLs externas para esta prueba;
- resuelve cada destino desde el directorio del documento;
- confirma que el archivo o directorio exista.

Rutas críticas:

- `README.md`, `AGENTS.md` y `library/README.md`;
- índices `library/domains/*/README.md`;
- `docs/agent/*`, `docs/REPOSITORY_EVOLUTION.md` y `docs/CONTRIBUTING_ASSETS.md`;
- relaciones entre assets y skills.

## 2. Catálogo

Para `library/catalog.json`:

- [ ] JSON válido.
- [ ] IDs de dominio y activo únicos.
- [ ] Cada `path` e `index` existe bajo `library/`.
- [ ] Cada activo Markdown comienza con front matter.
- [ ] `id`, `type`, `domain`, `status` y `version` están presentes.
- [ ] El ID y dominio coinciden con el manifiesto y la ruta.
- [ ] Los IDs de `related` existen o el pendiente está documentado.
- [ ] Cada activo aparece en el índice de su dominio.

## 3. Contratos por tipo

### Prompts

- [ ] Leen antes de modificar.
- [ ] Detectan stack y comandos reales.
- [ ] Exigen plan antes de cambios.
- [ ] No relajan pruebas o seguridad.
- [ ] Entregan evidencia y pendientes.

### Skills

- [ ] Definen objetivo, uso, entradas, resultado y restricciones.
- [ ] Incluyen procedimiento, buenas prácticas y checklist.
- [ ] Documentan errores frecuentes y relacionados.

### Otros activos

- [ ] Templates distinguen instrucciones de contenido final.
- [ ] Checklists exigen estado y evidencia.
- [ ] Playbooks incluyen precondiciones, decisiones y salida.
- [ ] Patrones explican cuándo usar y evitar, ventajas y desventajas.
- [ ] Anti-patrones incluyen detección, corrección y prevención.
- [ ] Referencias enlazan fuentes primarias y fecha de revisión.

## 4. Markdown y seguridad

- [ ] Número par de cercas de código por tipo de delimitador.
- [ ] Sin referencias activas a rutas retiradas.
- [ ] Sin secretos, tokens, credenciales o datos productivos.
- [ ] Sin comandos presentados como reales cuando no están definidos.
- [ ] Cambios semánticos registrados en `docs/CHANGELOG.md`.

## 5. Sitio estático

Cuando cambien `index.html`, `assets/`, `pages/` o contenido cargado:

1. Servir la raíz por HTTP con una herramienta disponible.
2. Confirmar `200` para `/`, CSS, JS y páginas parciales.
3. Confirmar `200` para el prompt maestro, `library/catalog.json` y cada prompt mostrado.
4. Verificar navegación por hash: `#prompt`, `#quality`, `#structure`, `#models`, `#example`, `#versioning`.
5. Revisar consola, carga inicial, copia y viewport móvil.

El comando `python -m http.server 8026 --bind 127.0.0.1` puede usarse solo si Python está disponible en el entorno.

## 6. Cierre

Reporta:

- controles ejecutados;
- resultado y evidencia;
- validaciones omitidas con motivo;
- riesgos o pendientes;
- confirmación de que el diff permanece dentro del alcance.
