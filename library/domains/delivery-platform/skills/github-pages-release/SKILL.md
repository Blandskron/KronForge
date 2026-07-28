---
name: github-pages-release
description: Validar que un sitio estático esté listo para publicarse en GitHub Pages.
id: delivery-platform.github-pages-release
title: GitHub Pages release
summary: Validar un sitio estático antes de publicarlo en GitHub Pages.
type: skill
domain: delivery-platform
status: stable
version: 1.0.0
tags: [github-pages, release, static-site]
related: [delivery-platform.release-readiness-review]
---

# Skill: GitHub Pages Release

## Objetivo

Producir evidencia de que un sitio estático funciona desde la ruta y configuración que el repositorio declara.

## Cuándo utilizarla

Al cambiar `index.html`, assets, páginas parciales o documentos cargados por el sitio.

## Cuándo no utilizarla

Cuando el proyecto no usa GitHub Pages o requiere un pipeline de build diferente.

## Entradas esperadas

- raíz publicable;
- configuración de Pages documentada;
- archivos modificados;
- comandos reales disponibles.

## Resultado esperado

Estado `Listo` o `No listo`, con URLs probadas, respuestas, errores y pendientes.

## Restricciones

- No desplegar ni cambiar configuración remota sin autorización.
- No inventar comandos de build.
- No declarar éxito a partir de abrir archivos con `file://`.

## Procedimiento

1. Confirma la fuente y ruta de publicación.
2. Detecta si existe build; no asumas uno.
3. Sirve la salida mediante HTTP local con una herramienta disponible.
4. Verifica el documento raíz y todos los assets referenciados.
5. Recorre navegación, hashes y páginas dinámicas.
6. Prueba carga de Markdown o manifiestos remotos al frontend.
7. Comprueba acciones de copia y estados de error.
8. Revisa escritorio y un viewport móvil.

## Buenas prácticas

- Validar rutas con el mismo base path que tendrá Pages.
- Registrar errores de consola y solicitudes 404.
- Probar una carga limpia para evitar falsos positivos de caché.

## Checklist

- [ ] La raíz responde `200`.
- [ ] CSS, JS, imágenes y páginas parciales responden `200`.
- [ ] No hay errores JavaScript bloqueantes.
- [ ] Navegación por hash funciona.
- [ ] Contenido canónico y catálogo cargan.
- [ ] Copia usa el texto visible.
- [ ] La interfaz es usable en móvil y escritorio.

## Errores frecuentes

- Validar solo `index.html`.
- Ignorar rutas sensibles a mayúsculas.
- Depender de un servidor con fallback que Pages no ofrece.
- Publicar contenido fallback como si fuera canónico.

## Documentos relacionados

- [Runbook del repositorio](../../../../../docs/agent/RUNBOOK.md)
- [Pruebas documentales](../../../../../docs/agent/TESTS.md)

## Prompts compatibles

- [Release readiness](../../prompts/release-readiness-review.prompt.md)

## Skills relacionadas

- [Auditoría documental](../../../documentation-knowledge/skills/documentation-audit/SKILL.md)
