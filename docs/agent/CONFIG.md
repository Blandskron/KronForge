# Configuración

El portal no requiere variables de entorno, instalación de dependencias ni servicios externos para funcionar. Los controles de mantenimiento requieren Node.js 24 o superior, pero no descargan paquetes.

## Configuración Requerida

No hay configuración obligatoria.

## GitHub Pages

Configuración esperada en GitHub:

- Source: branch principal del repositorio.
- Path: raíz del repositorio (`/`).
- Archivos servidos:
  - `index.html`
  - `assets/` (CSS y JS modulares)
  - `pages/` (vistas HTML dinámicas)
  - `prompts/agents-first-documentation-review.prompt.md`
  - `library/` (catálogo y activos por dominio)
  - documentación Markdown enlazada.

## Desarrollo Local

El sitio puede abrirse mediante servidor estático local. Consulta `docs/agent/RUNBOOK.md`.

Los controles reproducibles están declarados en `package.json`:

```powershell
npm run quality
```

No existe paso de compilación ni artefacto generado para publicar.

## Dependencias Externas del Sitio

El HTML carga recursos públicos de CDN:

- Google Fonts.
- Font Awesome.

El portal carga `library/catalog.json` mediante `fetch`; por eso debe probarse por HTTP y no solo mediante `file://`.

GitHub Pages no publica de forma fiable archivos bajo `.github/`. El visor del adaptador de Copilot intenta primero la ruta local y, si recibe un error, carga el mismo archivo canónico desde `raw.githubusercontent.com` en la rama `main`. Esta excepción es solo de lectura, está declarada en `assets/js/models.js` y no ejecuta contenido remoto.

> [!IMPORTANT]
> Si el proyecto necesita funcionar completamente offline, reemplaza esas dependencias por assets locales y actualiza este documento.

## Variables de Entorno

No aplica.

## Automatización

`.github/workflows/validate.yml` ejecuta validación, pruebas, smoke test y AI Repository Score con permisos de solo lectura. No publica el sitio ni requiere secretos.

> Pendiente de confirmar: si en el futuro se agrega automatización de publicación, documentar aquí las variables requeridas sin exponer valores reales.
