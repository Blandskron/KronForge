import {lstat, readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {detectRepository} from './detector.mjs';

function estimateTokens(text) {
    return Math.ceil(Buffer.byteLength(text, 'utf8') / 4);
}

async function readIfFile(target) {
    try {
        const stat = await lstat(target);
        if (!stat.isFile() || stat.isSymbolicLink()) return null;
        const content = await readFile(target, 'utf8');
        return {
            bytes: Buffer.byteLength(content, 'utf8'),
            lines: content.split(/\r?\n/).length,
            estimatedTokens: estimateTokens(content),
            content
        };
    } catch {
        return null;
    }
}

async function listMarkdownIn(root, relativeDir, limit = 15) {
    const dir = path.join(root, relativeDir);
    try {
        const entries = await readdir(dir, {withFileTypes: true});
        const results = [];
        for (const entry of entries) {
            if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
            results.push(`${relativeDir}/${entry.name}`.replace(/\\/g, '/'));
            if (results.length >= limit) break;
        }
        return results.sort();
    } catch {
        return [];
    }
}

export async function discoverContext(targetDir = process.cwd()) {
    const root = path.resolve(targetDir);
    const detection = await detectRepository(root);
    const entries = [];
    const warnings = [];

    const tier1Candidates = ['AGENTS.md', 'README.md'];
    const tier2Candidates = [
        'CLAUDE.md',
        'GEMINI.md',
        '.github/copilot-instructions.md',
        '.cursor/rules/kronforge.mdc',
        '.cursorrules',
        'CONTRIBUTING.md',
        'SECURITY.md',
        'llms.txt',
        '.kronforge/AGENTS.suggested.md'
    ];
    const conventionCandidates = [
        '.editorconfig',
        '.prettierrc',
        '.prettierrc.json',
        'eslint.config.js',
        'eslint.config.mjs',
        '.eslintrc.json',
        'tsconfig.json',
        'pyproject.toml',
        'ruff.toml',
        'Makefile'
    ];

    async function inspectFile(relativePath, tier, kind) {
        const info = await readIfFile(path.join(root, relativePath));
        if (!info) return null;
        const record = {
            path: relativePath,
            tier,
            kind,
            bytes: info.bytes,
            lines: info.lines,
            estimatedTokens: info.estimatedTokens
        };
        entries.push(record);
        return {...record, content: info.content};
    }

    for (const rel of tier1Candidates) {
        const inspected = await inspectFile(rel, 'tier-1-always', 'entrypoint');
        if (inspected && rel === 'AGENTS.md' && inspected.lines > 300) {
            warnings.push({
                code: 'OVERSIZED_AGENTS_MD',
                path: rel,
                message: `AGENTS.md supera 300 líneas (${inspected.lines}). Mueve detalle a documentos enlazados para progressive disclosure.`
            });
        }
    }

    for (const rel of tier2Candidates) {
        const inspected = await inspectFile(rel, 'tier-2-on-demand', 'adapter-or-policy');
        if (inspected && ['CLAUDE.md', 'GEMINI.md', '.github/copilot-instructions.md'].includes(rel)) {
            if (!inspected.content.includes('AGENTS.md') && detection.agentFiles.includes('AGENTS.md')) {
                warnings.push({
                    code: 'ADAPTER_NOT_LINKING_AGENTS',
                    path: rel,
                    message: `${rel} no enlaza a AGENTS.md; riesgo de instrucciones duplicadas o contradictorias.`
                });
            }
        }
    }

    const conventions = [];
    for (const rel of conventionCandidates) {
        const inspected = await inspectFile(rel, 'tier-2-on-demand', 'convention');
        if (inspected) conventions.push(rel);
    }

    const deepDirs = ['docs/adr', 'docs/specs', 'docs/memory', '.kronforge/memory', 'docs/agent'];
    for (const dir of deepDirs) {
        const mdFiles = await listMarkdownIn(root, dir);
        for (const rel of mdFiles) {
            await inspectFile(rel, 'tier-3-deep-reference', dir.includes('memory') ? 'memory' : 'reference');
        }
    }

    const totalEstimatedTokens = entries.reduce((sum, item) => sum + item.estimatedTokens, 0);
    const tier1Tokens = entries
        .filter((item) => item.tier === 'tier-1-always')
        .reduce((sum, item) => sum + item.estimatedTokens, 0);

    return {
        root,
        name: detection.name,
        tokenHeuristic: 'ceil(utf8Bytes / 4)',
        summary: {
            totalFiles: entries.length,
            totalEstimatedTokens,
            tier1Tokens,
            conventionsDetected: conventions
        },
        entries,
        warnings
    };
}

export async function routeContext(targetDir = process.cwd(), options = {}) {
    const budget = Number(options.budget) > 0 ? Number(options.budget) : 4000;
    const task = String(options.task || '').trim();
    const keywords = task
        .toLocaleLowerCase('es')
        .split(/[^a-z0-9áéíóúñ_-]+/i)
        .filter((word) => word.length >= 3);

    const discovery = await discoverContext(targetDir);

    const scored = discovery.entries.map((entry) => {
        let score = entry.tier === 'tier-1-always' ? 100 : entry.tier === 'tier-2-on-demand' ? 40 : 20;
        const lowerPath = entry.path.toLocaleLowerCase('es');
        for (const kw of keywords) {
            if (lowerPath.includes(kw)) score += 35;
        }
        if (keywords.some((kw) => ['seguridad', 'security', 'auth', 'secret', 'privacidad'].includes(kw)) && lowerPath.includes('security')) {
            score += 40;
        }
        if (keywords.some((kw) => ['arquitectura', 'architecture', 'adr', 'spec', 'diseno'].includes(kw)) && (lowerPath.includes('adr') || lowerPath.includes('spec'))) {
            score += 40;
        }
        if (keywords.some((kw) => ['memoria', 'memory', 'sesion', 'decision'].includes(kw)) && lowerPath.includes('memory')) {
            score += 40;
        }
        return {...entry, relevanceScore: score};
    }).sort((a, b) => b.relevanceScore - a.relevanceScore || a.estimatedTokens - b.estimatedTokens);

    const selected = [];
    const deferred = [];
    let usedTokens = 0;

    for (const item of scored) {
        if (usedTokens + item.estimatedTokens <= budget || (selected.length === 0 && item.tier === 'tier-1-always')) {
            selected.push(item);
            usedTokens += item.estimatedTokens;
        } else {
            deferred.push(item);
        }
    }

    return {
        root: discovery.root,
        task: task || null,
        budget,
        usedTokens,
        savedTokens: Math.max(0, discovery.summary.totalEstimatedTokens - usedTokens),
        selected,
        deferred,
        warnings: discovery.warnings
    };
}
