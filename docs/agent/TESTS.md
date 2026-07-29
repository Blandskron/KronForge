# Pruebas y Validación

Este repositorio no tiene build de producción. La validación combina controles documentales, contrato del catálogo, pruebas unitarias y una prueba HTTP del sitio estático.

## Puerta de calidad

Con Node.js 24 o superior:

```powershell
npm run quality
```

Si PowerShell bloquea el wrapper `npm.ps1`, usa el ejecutable equivalente `npm.cmd run quality`.

La secuencia ejecuta, sin instalar dependencias:

1. `npm run validate`: catálogo, schema, front matter, enlaces, anclas, seguridad, JavaScript, navegación y versiones.
2. `npm test`: renderer Markdown y utilidades puras del catálogo/router.
3. `npm run smoke`: rutas del shell, recursos, páginas y fuentes canónicas usadas en runtime bajo `/agents-first-repo-docs/`.
4. `npm run score`: [AI Repository Score](../AI_REPOSITORY_SCORE.md).

Los controles también se ejecutan en `.github/workflows/validate.yml`.

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
- `docs/agent/*`, documentos estratégicos, roadmap y guía de contribución;
- relaciones entre assets y skills.

## 2. Catálogo

Para `library/catalog.json`:

- [ ] JSON válido.
- [ ] IDs de dominio y activo únicos.
- [ ] Cada `path` e `index` existe bajo `library/`.
- [ ] Cada activo Markdown comienza con front matter.
- [ ] Schema v3 y `frameworkVersion` válidos.
- [ ] Metadatos de identidad, clasificación, compatibilidad, relaciones, contrato, mantenimiento y ruta están presentes.
- [ ] Front matter declara versión, compatibilidad, modelos y proyectos cuando aplica.
- [ ] El ID y dominio coinciden con el manifiesto y la ruta.
- [ ] Los IDs de `related`, `dependencies` y rutas de aprendizaje existen.
- [ ] Cada activo aparece en el índice de su dominio.

## 3. Contratos por tipo

### Prompts

- [ ] Leen antes de modificar.
- [ ] Detectan stack y comandos reales.
- [ ] Exigen plan antes de cambios.
- [ ] No relajan pruebas o seguridad.
- [ ] Entregan evidencia y pendientes.
- [ ] Declaran dificultad, tipos de proyecto, compatibilidad y modelos.

### Skills

- [ ] Definen objetivo, uso, entradas, resultado y restricciones.
- [ ] Incluyen procedimiento, buenas prácticas y checklist.
- [ ] Documentan errores frecuentes y relacionados.
- [ ] Incluyen problema, dependencias, casos de uso y ejemplo.

### Otros activos

- [ ] Templates distinguen instrucciones de contenido final.
- [ ] Checklists exigen estado y evidencia.
- [ ] Playbooks incluyen precondiciones, decisiones y salida.
- [ ] Patrones explican cuándo usar y evitar, ventajas y desventajas.
- [ ] Anti-patrones incluyen detección, corrección y prevención.
- [ ] Referencias enlazan fuentes primarias y fecha de revisión.
- [ ] Architecture notes explican componentes, límites y decisiones.

## 4. Markdown y seguridad

- [ ] Número par de cercas de código por tipo de delimitador.
- [ ] Sin referencias activas a rutas retiradas.
- [ ] Sin secretos, tokens, credenciales o datos productivos.
- [ ] Sin comandos presentados como reales cuando no están definidos.
- [ ] Cambios semánticos registrados en `docs/CHANGELOG.md`.

## 5. Sitio estático

Cuando cambien `index.html`, `assets/`, `pages/` o contenido cargado:

1. Ejecutar `npm run smoke`.
2. Confirmar `200` y MIME correcto para shell, CSS, JS, páginas, catálogo, activos y documentos canónicos cargados en runtime.
3. Verificar los hashes documentados en `RUNBOOK.md`, incluidas URLs directas de activos.
4. Probar búsqueda normalizada, filtros, orden, tags, relaciones, rutas de aprendizaje, copia, descarga, breadcrumbs, historial y modo oscuro.
5. Revisar consola, foco, teclado, carga inicial y viewports de escritorio y móvil.

El smoke test comprueba transporte HTTP, estados y MIME; la interacción y el renderizado JavaScript se validan en navegador.

El comando `python -m http.server 8026 --bind 127.0.0.1` puede usarse solo si Python está disponible en el entorno.

## 6. Cierre

Reporta:

- controles ejecutados;
- resultado y evidencia;
- validaciones omitidas con motivo;
- riesgos o pendientes;
- confirmación de que el diff permanece dentro del alcance.
