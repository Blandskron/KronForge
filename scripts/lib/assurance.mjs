import {createHash} from 'node:crypto';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {discoverContext} from './context-discovery.mjs';
import {detectRepository} from './detector.mjs';
import {validateRepositoryGovernance} from './governance-validator.mjs';

function sha256(text) {
    return createHash('sha256').update(text, 'utf8').digest('hex');
}

function gradeFromScore(total, blocked) {
    if (blocked) return 'F';
    if (total >= 90) return 'A';
    if (total >= 75) return 'B';
    if (total >= 60) return 'C';
    if (total >= 40) return 'D';
    return 'E';
}

export async function evaluateSkills(targetDir = process.cwd()) {
    const root = path.resolve(targetDir);
    const skillsDir = path.join(root, 'skills');
    const results = [];

    let entries;
    try {
        entries = await readdir(skillsDir, {withFileTypes: true});
    } catch {
        return {root, total: 0, passed: 0, results: []};
    }

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const file = path.join(skillsDir, entry.name, 'SKILL.md');
        let content;
        try {
            content = await readFile(file, 'utf8');
        } catch {
            continue;
        }
        const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
        const body = fmMatch ? content.slice(fmMatch[0].length) : content;
        const lines = body.split(/\r?\n/).length;
        const hasName = Boolean(fmMatch && new RegExp(`^name:\\s*${entry.name}\\s*$`, 'm').test(fmMatch[1]));
        const hasDescription = Boolean(fmMatch && /^description:\s*.+/m.test(fmMatch[1]));
        const underLineLimit = lines <= 500;
        const hasProcedure = /^##\s+(?:Procedimiento|Procedure|Workflow|Pasos)/im.test(body);
        const hasRestrictions = /^##\s+(?:Restricciones|Restrictions|L[ií]mites|Constraints)/im.test(body);
        const noUnsafeRemote = !/\b(?:curl|wget)\b[^\n|]*\|\s*(?:ba)?sh\b/i.test(content);

        const checks = {hasName, hasDescription, underLineLimit, hasProcedure, hasRestrictions, noUnsafeRemote};
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const score = Math.round((passedChecks / Object.keys(checks).length) * 100);
        const verdict = hasName && hasDescription && noUnsafeRemote && underLineLimit ? 'PASS' : 'FAIL';

        results.push({
            skill: entry.name,
            path: `skills/${entry.name}/SKILL.md`,
            lines,
            score,
            verdict,
            checks
        });
    }

    return {
        root,
        total: results.length,
        passed: results.filter((r) => r.verdict === 'PASS').length,
        results
    };
}

export async function scoreRepository(targetDir = process.cwd()) {
    const root = path.resolve(targetDir);
    const [detection, context, governance, skillsEval] = await Promise.all([
        detectRepository(root),
        discoverContext(root),
        validateRepositoryGovernance(root),
        evaluateSkills(root)
    ]);

    const hasAgents = detection.agentFiles.includes('AGENTS.md');
    const hasApproval = !governance.warnings.some((w) => w.code === 'MISSING_APPROVAL_GUARDRAIL') && hasAgents;
    const hasAdaptersOrSkills = detection.agentFiles.length >= 2 || skillsEval.total > 0;
    const tier1Controlled = !context.warnings.some((w) => w.code === 'OVERSIZED_AGENTS_MD');

    const dimensions = [
        {
            id: 'agent-readiness',
            name: 'Preparación para agentes',
            criteria: [
                {label: 'AGENTS.md presente', passed: hasAgents, weight: 7},
                {label: 'Regla de aprobación humana explícita', passed: hasApproval, weight: 5},
                {label: 'Adaptadores o Agent Skills presentes', passed: hasAdaptersOrSkills, weight: 4},
                {label: 'Contexto Tier 1 bajo control (<300 líneas)', passed: tier1Controlled, weight: 4}
            ]
        },
        {
            id: 'documentation-specs',
            name: 'Documentación y especificación',
            criteria: [
                {label: 'README.md presente', passed: detection.signals.readme, weight: 6},
                {label: 'CHANGELOG presente', passed: detection.signals.changelog, weight: 5},
                {label: 'CONTRIBUTING.md presente', passed: detection.signals.contributing, weight: 4},
                {label: 'Referencias/specs o packs instalados', passed: context.entries.some((e) => e.tier === 'tier-3-deep-reference') || detection.kronforge.installed, weight: 5}
            ]
        },
        {
            id: 'quality-testing',
            name: 'Calidad y pruebas',
            criteria: [
                {label: 'Tests o comando de pruebas detectado', passed: detection.signals.testsDir, weight: 8},
                {label: 'CI automatizado (GitHub Actions / GitLab CI)', passed: detection.signals.ci, weight: 6},
                {label: 'Convenciones técnicas detectadas', passed: context.summary.conventionsDetected.length > 0 || detection.packageManagers.length > 0, weight: 6}
            ]
        },
        {
            id: 'security-governance',
            name: 'Seguridad y gobernanza',
            criteria: [
                {label: 'Sin secretos detectados', passed: !governance.errors.some((e) => e.code === 'SECRET_DETECTED'), weight: 8},
                {label: 'SECURITY.md presente', passed: detection.signals.securityPolicy, weight: 4},
                {label: 'LICENSE presente', passed: detection.signals.license, weight: 4},
                {label: 'Skills y lock sin errores de supply chain', passed: governance.checks.every((c) => c.ok), weight: 4}
            ]
        },
        {
            id: 'operations-traceability',
            name: 'Operación y trazabilidad',
            criteria: [
                {label: 'Repositorio Git detectado', passed: detection.isGitRepo, weight: 6},
                {label: 'Gestión KronForge o catálogo activo', passed: detection.kronforge.installed || detection.agentFiles.includes('llms.txt'), weight: 7},
                {label: 'Sin deriva crítica de lock', passed: !governance.errors.some((e) => e.code.startsWith('LOCK_')), weight: 7}
            ]
        }
    ];

    const scoredDimensions = dimensions.map((dim) => {
        const score = dim.criteria.reduce((sum, item) => sum + (item.passed ? item.weight : 0), 0);
        const max = dim.criteria.reduce((sum, item) => sum + item.weight, 0);
        return {...dim, score, max};
    });

    const total = scoredDimensions.reduce((sum, dim) => sum + dim.score, 0);
    const blocked = governance.status === 'FAIL';
    const grade = gradeFromScore(total, blocked);
    const verdict = blocked ? 'FAIL' : total >= 60 ? 'PASS' : 'NEEDS_REVIEW';

    return {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        root,
        repository: detection.name,
        total,
        max: 100,
        grade,
        verdict,
        governanceStatus: governance.status,
        dimensions: scoredDimensions,
        skillsEvaluation: skillsEval
    };
}

export async function auditRepository(targetDir = process.cwd()) {
    const root = path.resolve(targetDir);
    const [detection, context, governance, score] = await Promise.all([
        detectRepository(root),
        discoverContext(root),
        validateRepositoryGovernance(root),
        scoreRepository(root)
    ]);

    const findings = [];
    for (const err of governance.errors) {
        findings.push({severity: 'high', code: err.code, message: err.message, path: err.path || null});
    }
    for (const warn of governance.warnings) {
        findings.push({severity: 'medium', code: warn.code, message: warn.message, path: warn.path || null});
    }
    for (const warn of context.warnings) {
        findings.push({severity: 'low', code: warn.code, message: warn.message, path: warn.path || null});
    }

    const nextActions = [];
    if (!detection.kronforge.installed) {
        nextActions.push(`npx kronforge init --profile ${detection.recommendations.profile} --dry-run`);
    }
    if (!detection.signals.securityPolicy) {
        nextActions.push('npx kronforge install security --dry-run');
    }
    if (findings.some((f) => f.severity === 'high')) {
        nextActions.push('Resolver todos los hallazgos de severidad HIGH antes de publicar o integrar.');
    }

    const evidencePayload = {
        schemaVersion: 1,
        protocol: 'AFP-004',
        generatedAt: score.generatedAt,
        repository: detection.name,
        root,
        verdict: score.verdict,
        score: score.total,
        grade: score.grade,
        governanceStatus: governance.status,
        findingsCount: findings.length
    };
    const digestSha256 = sha256(JSON.stringify(evidencePayload));

    return {
        ...evidencePayload,
        digestSha256,
        detection,
        score,
        governance,
        contextSummary: context.summary,
        findings,
        nextActions
    };
}

export function renderAssuranceMarkdown(audit) {
    const dimRows = audit.score.dimensions
        .map((d) => `| ${d.name} | ${d.score}/${d.max} |`)
        .join('\n');
    const findingLines = audit.findings.length
        ? audit.findings.map((f) => `- **[${f.severity.toUpperCase()}]** \`${f.code}\`: ${f.message}`).join('\n')
        : '- Sin hallazgos registrados.';
    const actionLines = audit.nextActions.length
        ? audit.nextActions.map((a) => `- \`${a}\``).join('\n')
        : '- Repositorio alineado; mantener `kronforge validate` en CI.';

    return `# KronForge Assurance Report — ${audit.repository}

- **Fecha:** ${audit.generatedAt}
- **Protocolo de evidencia:** \`${audit.protocol}\`
- **Veredicto:** \`${audit.verdict}\`
- **Engineering Score:** **${audit.score.total}/100 · Nivel ${audit.grade}**
- **Gobernanza:** \`${audit.governanceStatus}\`
- **Digest de evidencia (SHA-256):** \`${audit.digestSha256}\`

## Desglose por dimensión

| Dimensión | Puntaje |
|---|---|
${dimRows}

## Hallazgos (${audit.findings.length})

${findingLines}

## Próximas acciones recomendadas

${actionLines}
`;
}
