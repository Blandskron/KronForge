# Verificar la proyección de skills

## Antes y decisión

KronForge distribuye skills en `skills/` y conserva sus fuentes bajo `library/domains/`. Al actualizar los contratos en `a15c98b`, cambió también la versión proyectada. La [decisión de arquitectura](../adr/ADR-0004-agent-skills-projection-and-spec-freshness.md) explica cómo conservar una sola fuente editorial.

## Reproducción

Con Node.js 24, ejecuta el control de proyección desde la raíz.

```text
node scripts/build-skills.mjs --check
```

Contrasta `version` en la [fuente canónica](../../library/domains/documentation-knowledge/skills/documentation-audit/SKILL.md) con `asset-version` en la [skill distribuida](../../skills/documentation-audit/SKILL.md). Verifica que `canonical` apunte al archivo que acabas de leer.

## Resultado observado

El control aprobó tres proyecciones en `a15c98b`. La skill de auditoría tenía la versión `1.1.1` en ambos lados. El control verifica la correspondencia de los archivos distribuidos. La detección automática y la aplicación de permisos dependen del host que los consume.

[Volver a los casos reproducibles](README.md)
