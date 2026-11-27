import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const KRONFORGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const PROJECT_PROFILES = {
    startup: {
        id: 'startup',
        title: 'Startup / Lean',
        summary: 'Adopción rápida con base agents-first y disciplina esencial de pruebas.',
        packs: ['agents-first', 'testing'],
        defaultAdapters: []
    },
    opensource: {
        id: 'opensource',
        title: 'Open Source',
        summary: 'Gobernanza abierta, pruebas, seguridad y ciclo de releases reproducible.',
        packs: ['agents-first', 'testing', 'security', 'gitflow'],
        defaultAdapters: ['copilot']
    },
    enterprise: {
        id: 'enterprise',
        title: 'Enterprise / Regulated',
        summary: 'Cobertura integral: arquitectura, especificaciones, seguridad, privacidad y protocolos de evidencia.',
        packs: ['agents-first', 'testing', 'security', 'gitflow', 'architecture', 'spec-driven', 'data-privacy'],
        defaultAdapters: ['claude', 'gemini', 'copilot', 'cursor']
    }
};

export const ENGINEERING_PACKS = {
    'agents-first': {
        id: 'agents-first',
        title: 'Agents-First Foundation',
        summary: 'Prompt maestro, playbook agents-first y reglas base para preparar el repositorio.',
        entries: [
            {
                sourceType: 'prompt',
                sourcePath: 'prompts/agents-first-documentation-review.prompt.md',
                target: '.kronforge/packs/agents-first/agents-first-documentation-review.prompt.md'
            },
            {
                sourceType: 'asset',
                assetId: 'ai-agent-engineering.prepare-agents-first',
                target: '.kronforge/packs/agents-first/prepare-agents-first.playbook.md'
            },
            {
                sourceType: 'asset',
                assetId: 'documentation-knowledge.invented-commands',
                target: '.kronforge/packs/agents-first/invented-commands.anti-pattern.md'
            },
            {
                sourceType: 'asset',
                assetId: 'ai-agent-engineering.agent-roles-and-handoffs',
                target: '.kronforge/packs/agents-first/agent-roles-and-handoffs.pattern.md'
            }
        ]
    },
    testing: {
        id: 'testing',
        title: 'Testing & Quality Gates',
        summary: 'Prompts y checklists de pruebas unitarias, integración, pre-merge y Definition of Done.',
        entries: [
            {
                sourceType: 'asset',
                assetId: 'quality-engineering.unit-tests',
                target: '.kronforge/packs/testing/unit-tests.prompt.md'
            },
            {
                sourceType: 'asset',
                assetId: 'quality-engineering.integration-tests',
                target: '.kronforge/packs/testing/integration-tests.prompt.md'
            },
            {
                sourceType: 'asset',
                assetId: 'quality-engineering.pre-merge',
                target: '.kronforge/packs/testing/pre-merge.checklist.md'
            },
            {
                sourceType: 'asset',
                assetId: 'quality-engineering.definition-of-done-review',
                target: '.kronforge/packs/testing/definition-of-done-review.prompt.md'
            },
            {
                sourceType: 'asset',
                assetId: 'quality-engineering.test-driven-development',
                target: '.kronforge/packs/testing/test-driven-development.SKILL.md'
            },
            {
                sourceType: 'asset',
                assetId: 'quality-engineering.structured-code-review',
                target: '.kronforge/packs/testing/structured-code-review.SKILL.md'
            },
            {
                sourceType: 'asset',
                assetId: 'software-development.systematic-debugging',
                target: '.kronforge/packs/testing/systematic-debugging.SKILL.md'
            },
            {
                sourceType: 'asset',
                assetId: 'software-development.safe-refactoring',
                target: '.kronforge/packs/testing/safe-refactoring.SKILL.md'
            }
        ]
    },
    security: {
        id: 'security',
        title: 'Security & Agent Supply Chain',
        summary: 'Auditoría de seguridad, vulnerabilidades de dependencias y OWASP Agentic Skills Top 10.',
        entries: [
            {
                sourceType: 'asset',
                assetId: 'security.security-audit',
                target: '.kronforge/packs/security/security-audit.prompt.md'
            },
            {
                sourceType: 'asset',
                assetId: 'security.dependency-vulnerability-audit',
                target: '.kronforge/packs/security/dependency-vulnerability-audit.prompt.md'
            },
            {
                sourceType: 'asset',
                assetId: 'agent-supply-chain.owasp-agentic-skills-top-10',
                target: '.kronforge/packs/security/owasp-agentic-skills-top-10.checklist.md'
            },
            {
                sourceType: 'asset',
                assetId: 'agent-supply-chain.least-privilege-skill-tools',
                target: '.kronforge/packs/security/least-privilege-skill-tools.pattern.md'
            }
        ]
    },
    gitflow: {
        id: 'gitflow',
        title: 'Git Flow & Release Readiness',
        summary: 'Protocolos de estado del repositorio, preparación de publicación y revisión de releases.',
        entries: [
            {
                sourceType: 'asset',
                assetId: 'engineering-protocols.repository-state',
                target: '.kronforge/packs/gitflow/repository-state.protocol.md'
            },
            {
                sourceType: 'asset',
                assetId: 'engineering-protocols.release-readiness',
                target: '.kronforge/packs/gitflow/release-readiness.protocol.md'
            },
            {
                sourceType: 'asset',
                assetId: 'delivery-platform.release-readiness-review',
                target: '.kronforge/packs/gitflow/release-readiness-review.prompt.md'
            }
        ]
    },
    architecture: {
        id: 'architecture',
        title: 'Architecture & Decision Records',
        summary: 'Plantillas ADR/RFC, validación arquitectónica y diseño de repositorios AI-First.',
        entries: [
            {
                sourceType: 'asset',
                assetId: 'architecture.adr',
                target: '.kronforge/packs/architecture/adr.template.md'
            },
            {
                sourceType: 'asset',
                assetId: 'architecture.rfc',
                target: '.kronforge/packs/architecture/rfc.template.md'
            },
            {
                sourceType: 'asset',
                assetId: 'architecture.architecture-validation',
                target: '.kronforge/packs/architecture/architecture-validation.prompt.md'
            },
            {
                sourceType: 'asset',
                assetId: 'repository-engineering.design-ai-first-repository',
                target: '.kronforge/packs/architecture/design-ai-first-repository.playbook.md'
            }
        ]
    },
    'spec-driven': {
        id: 'spec-driven',
        title: 'Spec-Driven & Evidence Contracts',
        summary: 'Propuestas de cambio, delegación, evidencia verificable y protocolo de detención.',
        entries: [
            {
                sourceType: 'asset',
                assetId: 'product-technical-management.change-brief',
                target: '.kronforge/packs/spec-driven/change-brief.template.md'
            },
            {
                sourceType: 'asset',
                assetId: 'architecture.project-constitution',
                target: '.kronforge/packs/spec-driven/project-constitution.template.md'
            },
            {
                sourceType: 'asset',
                assetId: 'product-technical-management.feature-spec',
                target: '.kronforge/packs/spec-driven/feature-spec.template.md'
            },
            {
                sourceType: 'asset',
                assetId: 'software-development.brownfield-delta-change',
                target: '.kronforge/packs/spec-driven/brownfield-delta-change.playbook.md'
            },
            {
                sourceType: 'asset',
                assetId: 'engineering-protocols.evidence-record',
                target: '.kronforge/packs/spec-driven/evidence-record.template.md'
            },
            {
                sourceType: 'asset',
                assetId: 'engineering-protocols.work-delegation',
                target: '.kronforge/packs/spec-driven/work-delegation.protocol.md'
            },
            {
                sourceType: 'asset',
                assetId: 'engineering-protocols.completion-and-stop',
                target: '.kronforge/packs/spec-driven/completion-and-stop.protocol.md'
            }
        ]
    },
    'data-privacy': {
        id: 'data-privacy',
        title: 'Data Privacy & MCP Security',
        summary: 'Auditoría de privacidad, migraciones seguras, fronteras de confianza y seguridad MCP.',
        entries: [
            {
                sourceType: 'asset',
                assetId: 'security.privacy-audit',
                target: '.kronforge/packs/data-privacy/privacy-audit.prompt.md'
            },
            {
                sourceType: 'asset',
                assetId: 'mcp-integration.mcp-security',
                target: '.kronforge/packs/data-privacy/mcp-security.checklist.md'
            },
            {
                sourceType: 'asset',
                assetId: 'data.migration-rehearsal',
                target: '.kronforge/packs/data-privacy/migration-rehearsal.checklist.md'
            },
            {
                sourceType: 'asset',
                assetId: 'agent-supply-chain.skill-trust-boundaries',
                target: '.kronforge/packs/data-privacy/skill-trust-boundaries.architecture-note.md'
            }
        ]
    }
};

export function listAvailablePacks() {
    return Object.values(ENGINEERING_PACKS).map(({id, title, summary, entries}) => ({
        id,
        title,
        summary,
        fileCount: entries.length
    }));
}

export function listAvailableProfiles() {
    return Object.values(PROJECT_PROFILES);
}

export async function resolvePackFiles(packIds) {
    const catalog = JSON.parse(await readFile(path.join(KRONFORGE_ROOT, 'library', 'catalog.json'), 'utf8'));
    const assetsById = new Map((catalog.assets || []).map((asset) => [asset.id, asset]));
    const resolvedPacks = [];
    const files = new Map();

    for (const packId of packIds) {
        const pack = ENGINEERING_PACKS[packId];
        if (!pack) {
            throw new Error(`Pack desconocido: ${packId}. Disponibles: ${Object.keys(ENGINEERING_PACKS).join(', ')}`);
        }
        resolvedPacks.push({id: pack.id, title: pack.title, version: catalog.frameworkVersion});
        for (const entry of pack.entries) {
            let absoluteSource;
            let sourceRef;
            if (entry.sourceType === 'prompt') {
                absoluteSource = path.join(KRONFORGE_ROOT, entry.sourcePath);
                sourceRef = entry.sourcePath;
            } else {
                const asset = assetsById.get(entry.assetId);
                if (!asset) {
                    throw new Error(`Activo no encontrado en catálogo para pack ${packId}: ${entry.assetId}`);
                }
                absoluteSource = path.join(KRONFORGE_ROOT, 'library', asset.path);
                sourceRef = `library/${asset.path}`;
            }
            const bytes = await readFile(absoluteSource);
            files.set(entry.target, {
                target: entry.target,
                packId: pack.id,
                sourceRef,
                bytes
            });
        }
    }

    return {
        frameworkVersion: catalog.frameworkVersion,
        packs: resolvedPacks,
        files: [...files.values()].sort((a, b) => a.target.localeCompare(b.target))
    };
}
