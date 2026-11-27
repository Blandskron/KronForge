const SUPPORTED_ADAPTERS = {
    claude: {
        id: 'claude',
        target: 'CLAUDE.md',
        title: 'Adaptador para Claude / Claude Code'
    },
    gemini: {
        id: 'gemini',
        target: 'GEMINI.md',
        title: 'Adaptador para Gemini CLI'
    },
    copilot: {
        id: 'copilot',
        target: '.github/copilot-instructions.md',
        title: 'Adaptador para GitHub Copilot'
    },
    cursor: {
        id: 'cursor',
        target: '.cursor/rules/kronforge.mdc',
        title: 'Adaptador para Cursor'
    }
};

export function listSupportedAdapters() {
    return Object.values(SUPPORTED_ADAPTERS);
}

export function renderAgentsMarkdown(detection, profileId, packIds) {
    const detectedLanguages = detection.languages.length ? detection.languages.join(', ') : 'No detectado automáticamente';
    const detectedManagers = detection.packageManagers.length ? detection.packageManagers.join(', ') : 'No detectado automáticamente';
    const commandLines = Object.entries(detection.commands || {});
    const commandsSection = commandLines.length
        ? commandLines.map(([name, cmd]) => `- **${name}:** \`${cmd}\``).join('\n')
        : '- Ningún comando verificado automáticamente todavía. Documenta solo comandos reales existentes en este repositorio.';

    const packsList = packIds.length
        ? packIds.map((pack) => `- \`.kronforge/packs/${pack}/\``).join('\n')
        : '- Sin packs instalados todavía.';

    return `# AGENTS.md — ${detection.name}

> Contexto agents-first generado por KronForge (perfil \`${profileId}\`). Mantén este archivo sincronizado con la evidencia real del repositorio.

## Stack detectado

- **Lenguajes:** ${detectedLanguages}
- **Gestores de paquetes:** ${detectedManagers}
- **Git:** ${detection.isGitRepo ? 'sí' : 'no detectado'}
- **CI:** ${detection.ci.githubActions ? 'GitHub Actions' : detection.ci.gitlabCi ? 'GitLab CI' : 'no detectado'}

## Comandos verificados

${commandsSection}

## Capacidades KronForge instaladas

${packsList}

## Reglas operativas

- Leer antes de modificar cualquier archivo.
- No inventar comandos, arquitectura, dependencias ni resultados de pruebas.
- Presentar plan antes de cambios relevantes o destructivos.
- Solicitar aprobación humana ante cambios irreversibles, credenciales o despliegues públicos.
- No exponer secretos ni relajar pruebas o controles de seguridad para aprobar validaciones.
- Entregar evidencia reproducible al cerrar cada tarea.
`;
}

export function renderAdapterFile(adapterId, projectName) {
    const adapter = SUPPORTED_ADAPTERS[adapterId];
    if (!adapter) {
        throw new Error(`Adaptador no soportado: ${adapterId}. Disponibles: ${Object.keys(SUPPORTED_ADAPTERS).join(', ')}`);
    }

    if (adapterId === 'cursor') {
        return {
            target: adapter.target,
            bytes: Buffer.from(`---
description: KronForge agents-first operational rules for ${projectName}
alwaysApply: true
---

Lee \`AGENTS.md\` y los packs activos en \`.kronforge/packs/\` antes de modificar el repositorio.
Este adaptador no reemplaza \`AGENTS.md\` ni relaja pruebas, permisos o seguridad.
`, 'utf8')
        };
    }

    return {
        target: adapter.target,
        bytes: Buffer.from(`# ${adapter.title} — ${projectName}

Este adaptador no reemplaza [\`AGENTS.md\`](AGENTS.md).

## Contexto obligatorio

1. Lee \`AGENTS.md\` antes de proponer o aplicar cambios.
2. Consulta los packs activos instalados en \`.kronforge/packs/\`.
3. Respeta los comandos reales verificados del repositorio y entrega evidencia reproducible.
`, 'utf8')
    };
}
