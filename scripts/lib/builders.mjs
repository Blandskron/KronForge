import {createHash} from 'node:crypto';
import {lstat, mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex');
}

export async function scaffoldSkill(targetDir, options = {}) {
    const root = path.resolve(targetDir || process.cwd());
    const name = String(options.name || '').trim();
    if (!name || name.length > 64 || !SKILL_NAME_RE.test(name)) {
        throw new Error(`Nombre de skill inválido "${name}". Usa minúsculas y guiones (ej: release-check), máx. 64 caracteres.`);
    }

    const title = options.title || name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
    const summary = options.summary || `Ejecuta el procedimiento reproducible de ${title} con validación y evidencia verificable.`;
    const skillDir = path.join(root, 'skills', name);
    const skillFile = path.join(skillDir, 'SKILL.md');

    try {
        await lstat(skillFile);
        throw new Error(`La skill ya existe: ${path.relative(root, skillFile).replace(/\\/g, '/')}`);
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }

    const content = `---
name: ${name}
description: ${summary} Úsala cuando el equipo necesite ejecutar ${title} de forma repetible y verificable.
license: MIT
allowed-tools: Read Grep Glob Bash
metadata:
  framework: agents-first
---

# Skill: ${title}

## Objetivo

${summary}

## Procedimiento

1. Lee el contexto del repositorio (\`AGENTS.md\` y archivos objetivo) antes de actuar.
2. Verifica los comandos reales del entorno sin inventar herramientas ni resultados.
3. Ejecuta los pasos mínimos necesarios y valida el resultado.
4. Entrega evidencia reproducible con archivos afectados y salida real.

## Restricciones

- No exponer secretos ni credenciales.
- No relajar pruebas ni controles de seguridad para aprobar validaciones.
- Solicitar aprobación humana ante cambios destructivos o irreversibles.

## Checklist

- [ ] Contexto leído antes de modificar.
- [ ] Validaciones reales ejecutadas.
- [ ] Evidencia y pendientes reportados con claridad.
`;

    await mkdir(skillDir, {recursive: true});
    await writeFile(skillFile, content, 'utf8');

    return {
        created: true,
        name,
        path: path.relative(root, skillFile).replace(/\\/g, '/'),
        sha256: sha256(Buffer.from(content, 'utf8'))
    };
}

async function collectFiles(baseDir, current = baseDir, acc = []) {
    const entries = await readdir(current, {withFileTypes: true});
    for (const entry of entries) {
        if (entry.isSymbolicLink()) {
            throw new Error(`Enlace simbólico no permitido dentro de un pack: ${entry.name}`);
        }
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === '.git' || entry.name === 'node_modules') continue;
            await collectFiles(baseDir, full, acc);
        } else if (entry.isFile()) {
            const rel = path.relative(baseDir, full).replace(/\\/g, '/');
            if (rel === 'pack-manifest.json') continue;
            acc.push({rel, full});
        }
    }
    return acc.sort((a, b) => a.rel.localeCompare(b.rel));
}

export async function buildPackManifest(packDir, options = {}) {
    const root = path.resolve(packDir);
    const id = String(options.id || '').trim();
    const version = String(options.version || '1.0.0').trim();
    if (!id || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(id)) {
        throw new Error(`ID de pack inválido "${id}". Ejemplo: community.security-baseline`);
    }
    if (!SEMVER_RE.test(version)) {
        throw new Error(`Versión SemVer inválida "${version}". Ejemplo: 1.0.0`);
    }

    const collected = await collectFiles(root);
    if (!collected.length) {
        throw new Error(`No se encontraron archivos regulares en ${root}`);
    }

    const files = [];
    for (const item of collected) {
        const bytes = await readFile(item.full);
        files.push({
            path: item.rel,
            target: `.kronforge/packs/${id}/${item.rel}`,
            sha256: sha256(bytes)
        });
    }

    const manifest = {
        schemaVersion: 1,
        id,
        version,
        license: options.license || 'MIT',
        source: {
            uri: options.sourceUri || `local://${id}`,
            revision: options.revision || 'local'
        },
        requires: [],
        profiles: [
            {
                id: 'default',
                files: files.map((f) => f.target)
            }
        ],
        files
    };

    const outPath = options.out ? path.resolve(options.out) : path.join(root, 'pack-manifest.json');
    const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
    await writeFile(outPath, serialized, 'utf8');

    return {
        manifestPath: outPath,
        manifestSha256: sha256(Buffer.from(serialized, 'utf8')),
        fileCount: files.length,
        manifest
    };
}

export async function verifyPackManifest(packDir, manifestPath) {
    const root = path.resolve(packDir);
    const resolvedManifest = manifestPath ? path.resolve(manifestPath) : path.join(root, 'pack-manifest.json');
    const manifest = JSON.parse(await readFile(resolvedManifest, 'utf8'));
    const errors = [];

    for (const file of manifest.files || []) {
        const full = path.resolve(root, file.path);
        const prefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
        if (!full.startsWith(prefix)) {
            errors.push({path: file.path, code: 'PATH_ESCAPE', message: `Ruta fuera del pack: ${file.path}`});
            continue;
        }
        try {
            const stat = await lstat(full);
            if (stat.isSymbolicLink() || !stat.isFile()) {
                errors.push({path: file.path, code: 'INVALID_FILE', message: `Archivo inválido o symlink: ${file.path}`});
                continue;
            }
            const actual = sha256(await readFile(full));
            if (actual !== file.sha256) {
                errors.push({path: file.path, code: 'DIGEST_MISMATCH', expected: file.sha256, actual});
            }
        } catch {
            errors.push({path: file.path, code: 'MISSING_FILE', message: `Archivo ausente: ${file.path}`});
        }
    }

    return {
        status: errors.length === 0 ? 'PASS' : 'FAIL',
        id: manifest.id,
        version: manifest.version,
        checkedFiles: (manifest.files || []).length,
        errors
    };
}
