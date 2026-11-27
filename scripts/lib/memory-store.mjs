import {createHash} from 'node:crypto';
import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const MEMORY_DIR = '.kronforge/memory';
const CHECKPOINTS_DIR = '.kronforge/checkpoints';
const LEARNING_FILE = '.kronforge/learning/candidates.json';

function sha256(text) {
    return createHash('sha256').update(text, 'utf8').digest('hex');
}

function slugify(value) {
    return String(value || '')
        .toLocaleLowerCase('es')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48) || 'entry';
}

export async function initMemory(targetDir = process.cwd()) {
    const root = path.resolve(targetDir);
    const memDir = path.join(root, MEMORY_DIR);
    const cpDir = path.join(root, CHECKPOINTS_DIR);
    await mkdir(memDir, {recursive: true});
    await mkdir(cpDir, {recursive: true});

    const indexPath = path.join(memDir, 'INDEX.md');
    let createdIndex = false;
    try {
        await readFile(indexPath, 'utf8');
    } catch {
        const content = `# KronForge Project Memory Index

> Memoria operativa persistente entre sesiones (Markdown canónico). No duplica \`AGENTS.md\` ni ADRs; registra solo hechos verificados, checkpoints y pendientes.
`;
        await writeFile(indexPath, content, 'utf8');
        createdIndex = true;
    }

    return {
        root,
        memoryDir: MEMORY_DIR,
        checkpointsDir: CHECKPOINTS_DIR,
        createdIndex
    };
}

export async function saveMemoryEntry(targetDir = process.cwd(), options = {}) {
    const root = path.resolve(targetDir);
    const title = String(options.title || '').trim();
    const content = String(options.content || '').trim();
    if (!title || !content) {
        throw new Error('Se requieren --title y --content para guardar una nota de memoria.');
    }

    await initMemory(root);
    const today = new Date().toISOString().slice(0, 10);
    const fileName = `${today}-${slugify(title)}.md`;
    const relativePath = `${MEMORY_DIR}/${fileName}`;
    const fullPath = path.join(root, relativePath);
    const tags = Array.isArray(options.tags) ? options.tags : [];

    const body = `---
title: ${title}
date: ${today}
tags: [${tags.join(', ')}]
verified: true
---

# ${title}

${content}
`;
    await writeFile(fullPath, body, 'utf8');
    return {
        saved: true,
        path: relativePath,
        sha256: sha256(body)
    };
}

export async function searchMemory(targetDir = process.cwd(), query = '') {
    const root = path.resolve(targetDir);
    const memDir = path.join(root, MEMORY_DIR);
    const q = String(query || '').trim().toLocaleLowerCase('es');

    let files;
    try {
        files = (await readdir(memDir)).filter((f) => f.endsWith('.md')).sort();
    } catch {
        return {root, query: q, matches: []};
    }

    const matches = [];
    for (const file of files) {
        const full = path.join(memDir, file);
        const text = await readFile(full, 'utf8');
        if (!q || text.toLocaleLowerCase('es').includes(q) || file.toLocaleLowerCase('es').includes(q)) {
            matches.push({
                path: `${MEMORY_DIR}/${file}`,
                bytes: Buffer.byteLength(text, 'utf8'),
                preview: text.split(/\r?\n/).filter(Boolean).slice(0, 4).join(' ').slice(0, 160)
            });
        }
    }

    return {root, query: q, matches};
}

export async function createCheckpoint(targetDir = process.cwd(), options = {}) {
    const root = path.resolve(targetDir);
    const label = String(options.label || 'checkpoint').trim();
    await initMemory(root);

    const timestamp = new Date().toISOString();
    const id = `${timestamp.slice(0, 10)}-${slugify(label)}-${Date.now().toString(36)}`;
    const payload = {
        schemaVersion: 1,
        id,
        label,
        createdAt: timestamp,
        status: options.status || 'VERIFIED',
        notes: options.notes || '',
        evidence: options.evidence || []
    };
    const serialized = `${JSON.stringify(payload, null, 2)}\n`;
    const relativePath = `${CHECKPOINTS_DIR}/${id}.json`;
    await writeFile(path.join(root, relativePath), serialized, 'utf8');

    return {
        ...payload,
        path: relativePath,
        sha256: sha256(serialized)
    };
}

const UNSAFE_LEARNING_PATTERNS = [
    /\bcurl\b[^\n|]*\|\s*(?:ba)?sh\b/i,
    /\bwget\b[^\n|]*\|\s*(?:ba)?sh\b/i,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:ghp_|github_pat_|npm_|sk-)[A-Za-z0-9_-]{20,}\b/
];

async function readLearningStore(root) {
    const file = path.join(root, LEARNING_FILE);
    try {
        return JSON.parse(await readFile(file, 'utf8'));
    } catch {
        return {schemaVersion: 1, policy: 'quarantine-until-human-review', candidates: []};
    }
}

export async function recordLearningCandidate(targetDir = process.cwd(), options = {}) {
    const root = path.resolve(targetDir);
    const title = String(options.title || '').trim();
    const lesson = String(options.lesson || '').trim();
    const evidence = String(options.evidence || '').trim();
    if (!title || !lesson) {
        throw new Error('Se requieren --title y --lesson para registrar un candidato de aprendizaje.');
    }

    for (const unsafe of UNSAFE_LEARNING_PATTERNS) {
        if (unsafe.test(lesson) || unsafe.test(title)) {
            throw new Error('Candidato rechazado por seguridad: contiene un patrón de secreto o ejecución remota insegura.');
        }
    }

    const store = await readLearningStore(root);
    const id = `learn-${slugify(title)}-${Date.now().toString(36)}`;
    const entry = {
        id,
        title,
        lesson,
        evidence: evidence || 'observado en sesión local',
        status: 'candidate', // NUNCA es instrucción confiable hasta revisión y promoción humana explícita
        trusted: false,
        createdAt: new Date().toISOString()
    };
    store.candidates.push(entry);

    const file = path.join(root, LEARNING_FILE);
    await mkdir(path.dirname(file), {recursive: true});
    await writeFile(file, `${JSON.stringify(store, null, 2)}\n`, 'utf8');

    return entry;
}

export async function listLearningCandidates(targetDir = process.cwd()) {
    const root = path.resolve(targetDir);
    const store = await readLearningStore(root);
    return {root, policy: store.policy, candidates: store.candidates};
}

export async function promoteLearningCandidate(targetDir = process.cwd(), candidateId, options = {}) {
    if (options.approved !== true) {
        throw new Error('Promover un aprendizaje requiere aprobación humana explícita (--approve).');
    }
    const root = path.resolve(targetDir);
    const store = await readLearningStore(root);
    const candidate = store.candidates.find((c) => c.id === candidateId);
    if (!candidate) {
        throw new Error(`Candidato de aprendizaje no encontrado: ${candidateId}`);
    }

    for (const unsafe of UNSAFE_LEARNING_PATTERNS) {
        if (unsafe.test(candidate.lesson) || unsafe.test(candidate.title)) {
            throw new Error('Promoción bloqueada por control de seguridad.');
        }
    }

    const saved = await saveMemoryEntry(root, {
        title: `Lección aprobada: ${candidate.title}`,
        content: `${candidate.lesson}\n\n- **Evidencia original:** ${candidate.evidence}\n- **ID candidato:** \`${candidate.id}\`\n- **Promovido:** aprobación humana explícita`,
        tags: ['learning', 'approved']
    });

    candidate.status = 'promoted';
    candidate.trusted = true;
    candidate.promotedAt = new Date().toISOString();
    candidate.promotedPath = saved.path;

    const file = path.join(root, LEARNING_FILE);
    await writeFile(file, `${JSON.stringify(store, null, 2)}\n`, 'utf8');

    return {promoted: true, candidate, memoryPath: saved.path};
}
