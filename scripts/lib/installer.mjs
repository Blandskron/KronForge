import {createHash} from 'node:crypto';
import {lstat, mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {renderAdapterFile, renderAgentsMarkdown} from './context-generator.mjs';
import {detectRepository} from './detector.mjs';
import {PROJECT_PROFILES, resolvePackFiles} from './packs.mjs';

const LOCK_RELATIVE = '.kronforge/lock.json';
const HISTORY_DIR_RELATIVE = '.kronforge/history';

function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex');
}

function stableJson(value) {
    return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function assertSafeRelativeTarget(root, relativeTarget) {
    if (typeof relativeTarget !== 'string' || !relativeTarget || path.isAbsolute(relativeTarget)) {
        throw new Error(`Ruta de destino no permitida: ${relativeTarget}`);
    }
    const normalized = relativeTarget.replace(/\\/g, '/');
    if (normalized.split('/').some((part) => part === '..' || part === '')) {
        throw new Error(`Ruta de destino insegura: ${relativeTarget}`);
    }
    const resolved = path.resolve(root, normalized);
    const prefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
    if (!resolved.startsWith(prefix)) {
        throw new Error(`Escape fuera de la raíz del repositorio: ${relativeTarget}`);
    }
    return {normalized, resolved};
}

async function statSafe(target) {
    try {
        return await lstat(target);
    } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
    }
}

async function readLock(root) {
    const lockPath = path.join(root, LOCK_RELATIVE);
    const stat = await statSafe(lockPath);
    if (!stat) return null;
    if (stat.isSymbolicLink() || !stat.isFile()) {
        throw new Error(`Lock inválido en ${LOCK_RELATIVE}`);
    }
    return JSON.parse(await readFile(lockPath, 'utf8'));
}

async function buildDesiredFiles(root, detection, {profileId, packIds, adapters = [], generateContext = false}) {
    const resolved = await resolvePackFiles(packIds);
    const desired = new Map();

    for (const file of resolved.files) {
        desired.set(file.target, {
            target: file.target,
            packId: file.packId,
            sourceRef: file.sourceRef,
            bytes: file.bytes,
            sha256: sha256(file.bytes)
        });
    }

    if (generateContext) {
        const existingAgents = await statSafe(path.join(root, 'AGENTS.md'));
        const existingLock = await readLock(root);
        const agentsManaged = Boolean(existingLock?.files?.some((f) => f.target === 'AGENTS.md'));
        const target = existingAgents && !agentsManaged ? '.kronforge/AGENTS.suggested.md' : 'AGENTS.md';
        const bytes = Buffer.from(renderAgentsMarkdown(detection, profileId || 'custom', packIds), 'utf8');
        desired.set(target, {
            target,
            packId: 'context',
            sourceRef: 'generated:agents-md',
            bytes,
            sha256: sha256(bytes)
        });
    }

    for (const adapterId of adapters) {
        const rendered = renderAdapterFile(adapterId, detection.name);
        desired.set(rendered.target, {
            target: rendered.target,
            packId: `adapter:${adapterId}`,
            sourceRef: `generated:adapter:${adapterId}`,
            bytes: rendered.bytes,
            sha256: sha256(rendered.bytes)
        });
    }

    return {
        frameworkVersion: resolved.frameworkVersion,
        packs: resolved.packs,
        files: [...desired.values()].sort((a, b) => a.target.localeCompare(b.target))
    };
}

export async function planInstall(targetDir, options = {}) {
    const root = path.resolve(targetDir || process.cwd());
    const detection = await detectRepository(root);
    const existingLock = await readLock(root);

    let profileId = options.profile || existingLock?.profile || null;
    let packIds = Array.isArray(options.packs) ? [...options.packs] : [];
    let adapters = Array.isArray(options.adapters) ? [...options.adapters] : [];

    if (options.init) {
        profileId = options.profile || detection.recommendations.profile;
        const profile = PROJECT_PROFILES[profileId];
        if (!profile) {
            throw new Error(`Perfil desconocido: ${profileId}. Disponibles: ${Object.keys(PROJECT_PROFILES).join(', ')}`);
        }
        packIds = [...new Set([...(existingLock?.packs || []).map((p) => p.id), ...profile.packs, ...packIds])];
        if (!options.adapters) {
            adapters = [...new Set([...(existingLock?.adapters || []), ...profile.defaultAdapters])];
        }
    } else {
        packIds = [...new Set([...(existingLock?.packs || []).map((p) => p.id), ...packIds])];
        adapters = [...new Set([...(existingLock?.adapters || []), ...adapters])];
    }

    const desired = await buildDesiredFiles(root, detection, {
        profileId,
        packIds,
        adapters,
        generateContext: Boolean(options.init || existingLock?.files?.some((f) => f.packId === 'context'))
    });

    const managedMap = new Map((existingLock?.files || []).map((f) => [f.target, f]));
    const operations = [];
    const conflicts = [];

    for (const file of desired.files) {
        const {normalized, resolved} = assertSafeRelativeTarget(root, file.target);
        const stat = await statSafe(resolved);
        if (stat?.isSymbolicLink()) {
            throw new Error(`Enlace simbólico no permitido en destino: ${normalized}`);
        }
        const priorManaged = managedMap.get(normalized);
        if (!stat) {
            operations.push({action: 'create', target: normalized, packId: file.packId, sha256: file.sha256});
            continue;
        }
        const currentBytes = await readFile(resolved);
        const currentSha = sha256(currentBytes);
        if (currentSha === file.sha256) {
            operations.push({action: 'unchanged', target: normalized, packId: file.packId, sha256: file.sha256});
        } else if (priorManaged && priorManaged.sha256 === currentSha) {
            operations.push({action: 'update', target: normalized, packId: file.packId, before: currentSha, sha256: file.sha256});
        } else if (options.force) {
            operations.push({action: 'overwrite', target: normalized, packId: file.packId, before: currentSha, sha256: file.sha256});
        } else {
            const reason = priorManaged ? 'modified-locally' : 'unmanaged-existing-file';
            conflicts.push({target: normalized, reason, currentSha, desiredSha: file.sha256});
            operations.push({action: 'conflict', target: normalized, packId: file.packId, reason});
        }
    }

    const plan = {
        schemaVersion: 1,
        operation: options.init ? 'init' : options.update ? 'update' : 'install',
        root,
        profile: profileId,
        frameworkVersion: desired.frameworkVersion,
        packs: desired.packs,
        adapters,
        operations,
        conflicts,
        summary: {
            create: operations.filter((op) => op.action === 'create').length,
            update: operations.filter((op) => op.action === 'update' || op.action === 'overwrite').length,
            unchanged: operations.filter((op) => op.action === 'unchanged').length,
            conflict: conflicts.length
        }
    };

    return {
        plan,
        planSha256: sha256(stableJson(plan)),
        desiredFiles: desired.files,
        existingLock
    };
}

async function saveSnapshot(root, existingLock, touchedTargets) {
    if (!existingLock) return null;
    const snapshotId = `${Date.now()}-${sha256(stableJson(existingLock)).slice(0, 8)}`;
    const snapshotDir = path.join(root, HISTORY_DIR_RELATIVE, snapshotId);
    await mkdir(path.join(snapshotDir, 'files'), {recursive: true});
    await writeFile(path.join(snapshotDir, 'lock.json'), stableJson(existingLock));

    const backedUp = [];
    for (const target of touchedTargets) {
        const {normalized, resolved} = assertSafeRelativeTarget(root, target);
        const stat = await statSafe(resolved);
        if (stat?.isFile()) {
            const dest = path.join(snapshotDir, 'files', normalized);
            await mkdir(path.dirname(dest), {recursive: true});
            await writeFile(dest, await readFile(resolved));
            backedUp.push(normalized);
        }
    }
    await writeFile(path.join(snapshotDir, 'meta.json'), stableJson({snapshotId, backedUp}));
    return snapshotId;
}

export async function applyInstall(targetDir, options = {}) {
    const {plan, planSha256, desiredFiles, existingLock} = await planInstall(targetDir, options);
    if (options.dryRun) {
        return {applied: false, dryRun: true, plan, planSha256};
    }
    if (plan.conflicts.length && !options.force) {
        return {applied: false, dryRun: false, plan, planSha256, blockedByConflicts: true};
    }

    const root = plan.root;
    const filesByTarget = new Map(desiredFiles.map((f) => [f.target, f]));
    const writes = plan.operations.filter((op) => ['create', 'update', 'overwrite'].includes(op.action));

    const snapshotId = writes.length
        ? await saveSnapshot(root, existingLock, writes.map((op) => op.target))
        : null;

    for (const op of writes) {
        const file = filesByTarget.get(op.target);
        const {resolved} = assertSafeRelativeTarget(root, op.target);
        await mkdir(path.dirname(resolved), {recursive: true});
        await writeFile(resolved, file.bytes);
    }

    const nextLock = {
        schemaVersion: 1,
        frameworkVersion: plan.frameworkVersion,
        profile: plan.profile,
        packs: plan.packs,
        adapters: plan.adapters,
        files: desiredFiles.map(({target, packId, sourceRef, sha256: digest}) => ({
            target,
            packId,
            sourceRef,
            sha256: digest
        }))
    };

    const lockPath = path.join(root, LOCK_RELATIVE);
    await mkdir(path.dirname(lockPath), {recursive: true});
    await writeFile(lockPath, stableJson(nextLock));

    return {applied: true, dryRun: false, snapshotId, plan, planSha256, lock: nextLock};
}

export async function planUninstall(targetDir, packIds, options = {}) {
    const root = path.resolve(targetDir || process.cwd());
    const existingLock = await readLock(root);
    if (!existingLock) {
        throw new Error('No existe instalación de KronForge en este directorio (.kronforge/lock.json ausente).');
    }
    const targetSet = new Set(packIds);
    const operations = [];
    const preserved = [];

    for (const file of existingLock.files || []) {
        if (!targetSet.has(file.packId)) continue;
        const {normalized, resolved} = assertSafeRelativeTarget(root, file.target);
        const stat = await statSafe(resolved);
        if (!stat) {
            operations.push({action: 'already-missing', target: normalized, packId: file.packId});
            continue;
        }
        if (stat.isSymbolicLink()) {
            throw new Error(`Enlace simbólico no permitido en destino: ${normalized}`);
        }
        const currentSha = sha256(await readFile(resolved));
        if (currentSha === file.sha256 || options.force) {
            operations.push({action: 'remove', target: normalized, packId: file.packId, sha256: currentSha});
        } else {
            preserved.push({target: normalized, packId: file.packId, reason: 'modified-locally'});
            operations.push({action: 'preserve', target: normalized, packId: file.packId, reason: 'modified-locally'});
        }
    }

    const plan = {
        schemaVersion: 1,
        operation: 'uninstall',
        root,
        removedPacks: [...targetSet],
        operations,
        preserved
    };

    return {plan, planSha256: sha256(stableJson(plan)), existingLock};
}

export async function applyUninstall(targetDir, packIds, options = {}) {
    const {plan, planSha256, existingLock} = await planUninstall(targetDir, packIds, options);
    if (options.dryRun) {
        return {applied: false, dryRun: true, plan, planSha256};
    }

    const root = plan.root;
    const removals = plan.operations.filter((op) => op.action === 'remove');
    const snapshotId = await saveSnapshot(root, existingLock, removals.map((op) => op.target));

    for (const op of removals) {
        const {resolved} = assertSafeRelativeTarget(root, op.target);
        await rm(resolved, {force: true});
    }

    const removedTargets = new Set(plan.operations.filter((op) => op.action !== 'preserve').map((op) => op.target));
    const removedPacks = new Set(packIds);
    const nextLock = {
        ...existingLock,
        packs: (existingLock.packs || []).filter((pack) => !removedPacks.has(pack.id)),
        files: (existingLock.files || []).filter((file) => !removedTargets.has(file.target))
    };

    await writeFile(path.join(root, LOCK_RELATIVE), stableJson(nextLock));
    return {applied: true, dryRun: false, snapshotId, plan, planSha256, lock: nextLock};
}

export async function rollbackInstall(targetDir, options = {}) {
    const root = path.resolve(targetDir || process.cwd());
    const historyDir = path.join(root, HISTORY_DIR_RELATIVE);
    const entries = (await readdir(historyDir).catch(() => [])).sort();
    if (!entries.length) {
        throw new Error('No hay snapshots disponibles en .kronforge/history para ejecutar rollback.');
    }

    const latestId = entries.at(-1);
    const snapshotDir = path.join(historyDir, latestId);
    const previousLock = JSON.parse(await readFile(path.join(snapshotDir, 'lock.json'), 'utf8'));
    const currentLock = await readLock(root);

    if (options.dryRun) {
        return {
            rolledBack: false,
            dryRun: true,
            snapshotId: latestId,
            targetPacks: (previousLock.packs || []).map((p) => p.id)
        };
    }

    const previousTargets = new Set((previousLock.files || []).map((f) => f.target));
    for (const file of currentLock?.files || []) {
        if (!previousTargets.has(file.target)) {
            const {resolved} = assertSafeRelativeTarget(root, file.target);
            const stat = await statSafe(resolved);
            if (stat?.isFile() && sha256(await readFile(resolved)) === file.sha256) {
                await rm(resolved, {force: true});
            }
        }
    }

    const meta = JSON.parse(await readFile(path.join(snapshotDir, 'meta.json'), 'utf8'));
    for (const target of meta.backedUp || []) {
        const {resolved} = assertSafeRelativeTarget(root, target);
        const backupFile = path.join(snapshotDir, 'files', target);
        if (await statSafe(backupFile)) {
            await mkdir(path.dirname(resolved), {recursive: true});
            await writeFile(resolved, await readFile(backupFile));
        }
    }

    await writeFile(path.join(root, LOCK_RELATIVE), stableJson(previousLock));
    await rm(snapshotDir, {recursive: true, force: true});

    return {
        rolledBack: true,
        dryRun: false,
        snapshotId: latestId,
        lock: previousLock
    };
}

export async function runDoctor(targetDir) {
    const root = path.resolve(targetDir || process.cwd());
    const detection = await detectRepository(root);
    const lock = await readLock(root);
    const issues = [];
    const checkedFiles = [];

    if (!lock) {
        issues.push({
            severity: 'info',
            code: 'NOT_INITIALIZED',
            message: 'KronForge no está inicializado en este directorio. Ejecuta `npx kronforge init --dry-run`.'
        });
    } else {
        for (const file of lock.files || []) {
            const {normalized, resolved} = assertSafeRelativeTarget(root, file.target);
            const stat = await statSafe(resolved);
            if (!stat) {
                issues.push({severity: 'error', code: 'MISSING_FILE', target: normalized, message: `Archivo gestionado ausente: ${normalized}`});
                checkedFiles.push({target: normalized, status: 'missing'});
                continue;
            }
            if (stat.isSymbolicLink()) {
                issues.push({severity: 'error', code: 'SYMLINK_TARGET', target: normalized, message: `Destino reemplazado por enlace simbólico: ${normalized}`});
                checkedFiles.push({target: normalized, status: 'symlink'});
                continue;
            }
            const currentSha = sha256(await readFile(resolved));
            if (currentSha !== file.sha256) {
                issues.push({severity: 'warn', code: 'LOCAL_DRIFT', target: normalized, message: `Archivo gestionado modificado localmente: ${normalized}`});
                checkedFiles.push({target: normalized, status: 'drifted'});
            } else {
                checkedFiles.push({target: normalized, status: 'ok'});
            }
        }
    }

    if (!detection.agentFiles.includes('AGENTS.md')) {
        issues.push({severity: 'warn', code: 'NO_AGENTS_MD', message: 'No se encontró AGENTS.md en la raíz del repositorio.'});
    }

    return {
        root,
        healthy: !issues.some((i) => i.severity === 'error'),
        initialized: Boolean(lock),
        profile: lock?.profile || null,
        packs: (lock?.packs || []).map((p) => p.id),
        checkedFiles,
        issues,
        detection
    };
}
