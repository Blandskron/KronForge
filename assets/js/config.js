/**
 * config.js — Datos estáticos: docsDatabase y fallbacks de contenido.
 * Importado por tree.js, loader.js y otros módulos que necesiten datos locales.
 */

export const docsDatabase = {
    "agents-md": {
        title: "AGENTS.md",
        status: "Requerido",
        description: "Entrada principal para agentes autónomos. Debe ser breve, operativa, enlazada y basada en evidencia local.",
        code: `# Instrucciones de Agente (AGENTS.md)

Este repositorio contiene [descripción breve del proyecto].

## Flujo de Trabajo
Copiar -> Pegar -> Auditar -> Aprobar -> Aplicar.

## Stack Detectado
- **Tipo:** [app, biblioteca, monorepo, infraestructura, documentación]
- **Lenguaje/Runtime:** [detectado desde el repositorio]
- **Framework:** [si aplica]

## Lectura Prioritaria
1. [README.md](README.md)
2. [docs/agent/PERMISSIONS.md](docs/agent/PERMISSIONS.md)
3. [docs/agent/TESTS.md](docs/agent/TESTS.md)

## Reglas Operativas
- No inventes comandos ni arquitectura.
- No expongas secretos.
- Pide aprobación para eliminaciones o cambios sensibles.
- Ejecuta las validaciones reales disponibles antes de cerrar.`
    },
    "permissions-md": {
        title: "PERMISSIONS.md",
        status: "Requerido",
        description: "Define qué puede modificar el agente, qué está protegido y cuándo debe pedir aprobación humana.",
        code: `# Permisos del Agente

## Puede Modificar
- [Rutas editables confirmadas]

## Requiere Aprobación
- Cambios en credenciales, licencias, infraestructura o datos productivos.
- Eliminación de documentación antigua sin migración previa.

## Prohibido
- Exponer secretos.
- Inventar comandos o contratos.
- Relajar pruebas para hacer pasar la suite.`
    },
    "runbook-md": {
        title: "RUNBOOK.md",
        status: "Opcional",
        description: "Procedimientos reales para levantar, operar, reiniciar o depurar el proyecto.",
        code: `# Runbook Operativo

> Pendiente de confirmar: comandos reales de ejecución local.

## Levantamiento Local
- [Comando real detectado]

## Validación de Salud
- [Comando o endpoint real detectado]

## Problemas Frecuentes
- [Fallo común y resolución verificable]`
    },
    "tests-md": {
        title: "TESTS.md",
        status: "Recomendado",
        description: "Estrategia de pruebas y validaciones según comandos reales del repositorio.",
        code: `# Pruebas y Validación

## Comandos Reales
- [Comando de test detectado]
- [Comando de lint detectado]
- [Comando de build detectado]

## Reglas
- No elimines pruebas para hacer pasar la suite.
- Si no hay suite automatizada, documenta la validación manual realizada.`
    },
    "security-md": {
        title: "SECURITY.md",
        status: "Opcional",
        description: "Políticas de secretos, archivos sensibles, autenticación, autorización y operaciones peligrosas.",
        code: `# Seguridad

## Secretos
- No imprimir ni copiar valores reales de variables de entorno.
- Usar archivos de ejemplo sin credenciales reales.

## Cambios Sensibles
- Requieren aprobación humana: producción, permisos, infraestructura, autenticación y datos sensibles.`
    },
    "config-md": {
        title: "CONFIG.md",
        status: "Requerido en el ejemplo",
        description: "Documenta configuración, variables, servicios externos y qué no aplica en este repositorio.",
        code: `# Configuración

## Configuración Requerida
No hay configuración obligatoria.

## GitHub Pages
- Servir desde la raíz del repositorio.
- No requiere build system.

## Variables de Entorno
No aplica.`
    },
    "data-schema-md": {
        title: "DATA_SCHEMA.md",
        status: "Requerido en el ejemplo",
        description: "Documenta entidades conceptuales del producto aunque no exista base de datos.",
        code: `# Esquema de Datos y Contratos

## Entidades Conceptuales
- Prompt maestro
- Documento de agente
- Skill
- Página estática

## Regla
No inventar modelos ni APIs inexistentes.`
    },
    "readme-md": {
        title: "README.md",
        status: "Obligatorio",
        description: "Entrada para humanos: qué es el proyecto, cómo empezar y dónde está la documentación importante.",
        code: `# Nombre del Proyecto

Descripción clara para humanos.

El producto debe ser entendible sin estudiar una metodología: qué es, cómo empezar, qué puede hacer un agente y qué necesita aprobación humana.

## Inicio Rápido
1. [Paso real confirmado]
2. [Comando real confirmado]

> [!NOTE]
> Los agentes deben leer [AGENTS.md](AGENTS.md) antes de trabajar.`
    },
    "skill-prompt-update-md": {
        title: "ai-agent-engineering / prompt-update",
        status: "Especializado",
        description: "Skill para actualizar el prompt maestro, aplicar SemVer y registrar cambios.",
        code: `# Skill: Actualización del Prompt

## Flujo
1. Modificar prompts/agents-first-documentation-review.prompt.md.
2. Clasificar el cambio según PROMPT_VERSIONING.md.
3. Registrar la nueva versión en docs/CHANGELOG.md.
4. Validar enlaces, Markdown y consistencia del sitio.`
    },
    "skill-documentation-audit-md": {
        title: "documentation-knowledge / documentation-audit",
        status: "Ejemplo",
        description: "Skill de ejemplo para revisar consistencia documental antes de cerrar cambios.",
        code: `# Skill: Documentation Audit

## Flujo
1. Revisar AGENTS.md y README.md.
2. Validar enlaces Markdown.
3. Buscar secretos.
4. Confirmar que docs/CHANGELOG.md registre cambios relevantes.`
    },
    "claude-md": {
        title: "CLAUDE.md",
        status: "Opcional en raíz",
        description: "Guía raíz para usar Claude con este estándar sin acoplar el prompt a un stack.",
        code: `# Guía para Claude

Usa el prompt maestro sin acoplarlo a un stack específico.

1. Copia prompts/agents-first-documentation-review.prompt.md.
2. Pégalo en Claude dentro del contexto del repositorio objetivo.
3. Pide primero una auditoría de solo lectura.
4. Revisa el plan antes de autorizar eliminaciones o cambios sensibles.`
    },
    "gemini-md": {
        title: "GEMINI.md",
        status: "Opcional en raíz",
        description: "Guía raíz para usar Gemini con este estándar sin asumir tecnologías.",
        code: `# Guía para Gemini

Usa el prompt maestro aprovechando lectura amplia del repositorio objetivo.

1. Copia prompts/agents-first-documentation-review.prompt.md.
2. Pide clasificar documentación existente antes de modificar.
3. Para monorepos, solicita detección de servicios o paquetes.
4. Revisa manualmente cambios sensibles.`
    }
};
