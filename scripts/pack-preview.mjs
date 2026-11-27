import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {applyPack, planPack} from './lib/pack-store.mjs';

try {
    const [operation, project, requestPath, approved, extra] = process.argv.slice(2);
    if (!project || !requestPath || extra !== undefined ||
        (operation === 'plan' ? approved !== undefined : operation !== 'apply' || !/^[a-f0-9]{64}$/.test(approved))) {
        throw new Error('Uso: node scripts/pack-preview.mjs plan|apply <repo> <solicitud.json> [SHA-256 del plan]');
    }
    const request = JSON.parse(await readFile(requestPath, 'utf8'));
    if (!Array.isArray(request.roots) || !Array.isArray(request.packs) ||
        request.roots.some((id) => typeof id !== 'string') ||
        request.packs.some((pack) => !pack || typeof pack.directory !== 'string' ||
            typeof pack.profile !== 'string' || typeof pack.manifestSha256 !== 'string') ||
        (request.allowDowngrade !== undefined && typeof request.allowDowngrade !== 'boolean')) {
        throw new Error('Solicitud inválida');
    }
    for (const pack of request.packs) {
        pack.directory = path.resolve(path.dirname(requestPath), pack.directory);
    }
    const result = operation === 'plan'
        ? await planPack(project, request)
        : await applyPack(project, request, approved);
    console.log(JSON.stringify(result, null, 2));
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
