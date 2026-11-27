import {createHash} from 'node:crypto';
import {lstat, readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {detectRepository} from './detector.mjs';

const SECRET_PATTERNS = [
    {id: 'PRIVATE_KEY', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/},
    {id: 'GITHUB_TOKEN', regex: /\bghp_[A-Za-z0-9]{30,}\b/},
    {id: 'GITHUB_PAT', regex: /\bgithub_pat_[A-Za-z0-9_]{40,}\b/},
    {id: 'NPM_TOKEN', regex: /\bnpm_[A-Za-z0-9]{30,}\b/},
    {id: 'OPENAI_STYLE_KEY', regex: /\bsk-[A-Za-z0-9]{32,}\b/},
    {id: 'AWS_ACCESS_KEY', regex: /\bAKIA[0-9A-Z]{16}\b/}
];

const UNSAFE_REMOTE_EXEC_PATTERNS = [
    /\bcurl\b[^\n|]*\|\s*(?:ba)?sh\b/i,
    /\bwget\b[^\n|]*\|\s*(?:ba)?sh\b/i,
    /\bInvoke-Expression\b[^\n]*\bInvoke-WebRequest\b/i
];

const TEXT_EXTENSIONS = new Set(['.md', '.txt', '.json', '.yml', '.yaml', '.js', '.mjs', '.cjs', '.ts', '.py', '.go', '.rs', '.sh', '.ps1', '.env', '.toml']);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'coverage', '.venv', 'venv', 'target']);

function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex');
}

async function walkFiles(root, current = root, depth = 0, limit = 400, acc = []) {
    if (depth > 6 || acc.length >= limit) return acc;
    let entries;
    try {
        entries = await readdir(current, {withFileTypes: true});
    } catch {
        return acc;
    }
    for (const entry of entries) {
        if (acc.length >= limit) break;
        if (entry.isSymbolicLink()) continue;
        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) continue;
            await walkFiles(root, path.join(current, entry.name), depth + 1, limit, acc);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (TEXT_EXTENSIONS.has(ext) || entry.name === '.gitignore' || entry.name === 'Dockerfile') {
                acc.push(path.join(current, entry.name));
            }
        }
    }
    return acc;
}

function parseSimpleFrontMatter(source) {
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!match) return {data: null, body: source};
    const data = {};
    for (const line of match[1].split(/\r?\n/)) {
        const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.+)$/);
        if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
    }
    return {data, body: source.slice(match[0].length)};
}

export async function validateRepositoryGovernance(targetDir = process.cwd()) {
    const root = path.resolve(targetDir);
    const detection = await detectRepository(root);
    const errors = [];
    const warnings = [];
    const checks = [];

    // 1. Secret scan
    const files = await walkFiles(root);
    let secretsFound = 0;
    for (const file of files) {
        const rel = path.relative(root, file).replace(/\\/g, '/');
        if (rel.startsWith('.kronforge/history/')) continue;
        let content;
        try {
            content = await readFile(file, 'utf8');
        } catch {
            continue;
        }
        for (const pattern of SECRET_PATTERNS) {
            if (pattern.regex.test(content)) {
                secretsFound += 1;
                errors.push({
                    code: 'SECRET_DETECTED',
                    path: rel,
                    message: `Posible secreto (${pattern.id}) detectado en ${rel}`
                });
            }
        }
    }
    checks.push({id: 'secrets-scan', ok: secretsFound === 0, scannedFiles: files.length});

    // 2. Governance baseline
    const hasAgents = detection.agentFiles.includes('AGENTS.md');
    if (!hasAgents) {
        warnings.push({code: 'MISSING_AGENTS_MD', message: 'Falta AGENTS.md con reglas operativas para agentes.'});
    } else {
        const agentsContent = await readFile(path.join(root, 'AGENTS.md'), 'utf8').catch(() => '');
        const hasApprovalRule = /aprobaci[oó]n|approval/i.test(agentsContent);
        if (!hasApprovalRule) {
            warnings.push({code: 'MISSING_APPROVAL_GUARDRAIL', path: 'AGENTS.md', message: 'AGENTS.md no declara explícitamente aprobación humana para acciones sensibles.'});
        }
    }
    if (!detection.signals.securityPolicy) {
        warnings.push({code: 'MISSING_SECURITY_MD', message: 'No se encontró SECURITY.md con canal de reporte de vulnerabilidades.'});
    }
    if (!detection.signals.license) {
        warnings.push({code: 'MISSING_LICENSE', message: 'No se encontró archivo LICENSE en la raíz.'});
    }
    checks.push({id: 'governance-baseline', ok: true});

    // 3. Agent Skills supply-chain check
    const skillFiles = files.filter((file) => path.basename(file) === 'SKILL.md');
    let skillIssues = 0;
    for (const file of skillFiles) {
        const rel = path.relative(root, file).replace(/\\/g, '/');
        const content = await readFile(file, 'utf8').catch(() => '');
        const {data, body} = parseSimpleFrontMatter(content);
        const dirName = path.basename(path.dirname(file));
        if (!data?.name || !data?.description) {
            skillIssues += 1;
            errors.push({code: 'INVALID_SKILL_FRONTMATTER', path: rel, message: `SKILL.md sin name/description válidos: ${rel}`});
        } else if (data.name !== dirName && !rel.startsWith('.kronforge/packs/')) {
            skillIssues += 1;
            errors.push({code: 'SKILL_NAME_MISMATCH', path: rel, message: `name "${data.name}" no coincide con el directorio "${dirName}" en ${rel}`});
        }
        if (body.split(/\r?\n/).length > 500) {
            warnings.push({code: 'SKILL_BODY_TOO_LONG', path: rel, message: `${rel} supera 500 líneas recomendadas por agentskills.io.`});
        }
        for (const unsafe of UNSAFE_REMOTE_EXEC_PATTERNS) {
            if (unsafe.test(content)) {
                skillIssues += 1;
                errors.push({code: 'UNSAFE_REMOTE_EXECUTION', path: rel, message: `Patrón de ejecución remota insegura detectado en skill: ${rel}`});
            }
        }
    }
    checks.push({id: 'skills-supply-chain', ok: skillIssues === 0, checkedSkills: skillFiles.length});

    // 4. KronForge lock integrity check (if initialized)
    let lockIssues = 0;
    const lockPath = path.join(root, '.kronforge', 'lock.json');
    try {
        const lockStat = await lstat(lockPath);
        if (lockStat.isFile()) {
            const lock = JSON.parse(await readFile(lockPath, 'utf8'));
            for (const item of lock.files || []) {
                const targetPath = path.resolve(root, item.target);
                try {
                    const stat = await lstat(targetPath);
                    if (stat.isSymbolicLink()) {
                        lockIssues += 1;
                        errors.push({code: 'LOCK_SYMLINK', path: item.target, message: `Archivo gestionado reemplazado por symlink: ${item.target}`});
                    } else if (sha256(await readFile(targetPath)) !== item.sha256) {
                        warnings.push({code: 'LOCK_DRIFT', path: item.target, message: `Deriva detectada respecto al lock SHA-256 en ${item.target}`});
                    }
                } catch {
                    lockIssues += 1;
                    errors.push({code: 'LOCK_MISSING_FILE', path: item.target, message: `Archivo declarado en lock ausente: ${item.target}`});
                }
            }
        }
    } catch {
        // Not initialized with .kronforge/lock.json — valid for external repos
    }
    checks.push({id: 'lock-integrity', ok: lockIssues === 0});

    return {
        root,
        status: errors.length === 0 ? 'PASS' : 'FAIL',
        summary: {
            errors: errors.length,
            warnings: warnings.length,
            scannedFiles: files.length,
            checkedSkills: skillFiles.length
        },
        checks,
        errors,
        warnings
    };
}
