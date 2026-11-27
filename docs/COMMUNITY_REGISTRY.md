# Contrato de Community Registry — KronForge

Este documento define las reglas mínimas para publicar, auditar y consumir **Engineering Packs** y **Agent Skills** aportados por terceros o equipos internos sin introducir un servidor centralizado ni dependencias propietarias.

## 1. Principios de confianza

- **Sin ejecución implícita:** instalar un pack o skill nunca ejecuta código ni scripts automáticamente.
- **Procedencia verificable:** todo pack declara `id`, `version` SemVer exacta, `license` SPDX, `source.uri`, `source.revision` (commit) y `sha256` por archivo.
- **Neutralidad de proveedor:** los activos comunitarios siguen `AGENTS.md`, `agentskills.io` y la política de frescura `specRefs`.

## 2. Flujo de creación y verificación local

```powershell
npx kronforge skill new mi-skill
npx kronforge pack build ./mi-pack --id community.mi-pack --version 1.0.0
npx kronforge pack verify ./mi-pack
npx kronforge validate ./mi-pack
```

## 3. Criterios de admisión al catálogo comunitario

1. Licencia open source compatible verificada (SPDX).
2. Sin secretos, enlaces simbólicos, escapes de ruta ni descarga remota de instrucciones (`curl | bash`).
3. Conformidad con [OWASP Agentic Skills Top 10](../library/domains/agent-supply-chain/checklists/owasp-agentic-skills-top-10.checklist.md).
4. Verificación reproducible con `kronforge pack verify` y `kronforge validate` en estado `PASS`.
5. Revisión independiente de un mantenedor y política explícita de soporte/retiro.
