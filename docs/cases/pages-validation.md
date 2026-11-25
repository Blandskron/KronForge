# Validar la publicación bajo el prefijo de Pages

## Antes y decisión

El portal debe resolver recursos bajo `/KronForge/`. En `a15c98b` la comprobación del subdirectorio se complementó con Chromium y axe-core en GitHub Actions. El primero de los controles verifica el contrato HTTP y el segundo recorre la interfaz.

## Reproducción

Con Node.js 24 y loopback disponible, ejecuta desde la raíz.

```text
npm run smoke
```

Identifica en el [script](../../scripts/smoke-site.mjs) las comprobaciones de rutas positivas, tipos de contenido y respuestas 404. A continuación, abre la [ejecución de GitHub Actions de a15c98b](https://github.com/Blandskron/KronForge/actions/runs/45681781699) y verifica que ambos trabajos se completaron con éxito.

## Resultado observado

En `a15c98b` el smoke test comprobó 152 rutas bajo el prefijo. GitHub Actions aprobó `Documentation and portal quality` y `Browser and accessibility checks`. El número de rutas puede aumentar con nuevos documentos. Estas comprobaciones corresponden al entorno local y al runner de CI. Verificar la propagación del contenido después del despliegue requiere consultar el sitio publicado.

[Volver a los casos reproducibles](README.md)
