import {copyFile, mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fromRoot} from './lib/repository.mjs';
import {jsonBytes, sha256} from './lib/pack-plan.mjs';

try {
    const [output, extra] = process.argv.slice(2);
    if (!output || extra !== undefined) throw new Error('Uso: node scripts/prepare-pack-preview.mjs <directorio nuevo>');
    const root = path.resolve(output);
    await mkdir(root);
    const npm = path.join(root, 'npm');
    const files = [
        'LICENSE', 'library/schema/pack-preview.schema.json',
        'scripts/pack-preview.mjs', 'scripts/lib/pack-plan.mjs', 'scripts/lib/pack-store.mjs',
        'scripts/lib/json-schema.mjs'
    ];
    for (const file of files) {
        const destination = path.join(npm, file);
        await mkdir(path.dirname(destination), {recursive: true});
        await copyFile(fromRoot(file), destination);
    }
    await writeFile(path.join(npm, 'package.json'), jsonBytes({
        name: 'kronforge-pack-preview',
        version: '0.0.0-local.2',
        private: true,
        description: 'Local preview of the KronForge pack protocol',
        license: 'MIT',
        type: 'module',
        engines: {node: '>=24'},
        files: files.filter((file) => file !== 'LICENSE')
    }));
    await writeFile(path.join(npm, 'README.md'), [
        '# KronForge Pack Preview', '',
        'Prototipo local sin scripts de instalación. El repositorio del framework conserva el contrato.',
        'Desde el proyecto consumidor invoca el archivo `scripts/pack-preview.mjs` de este paquete.',
        'Usa `plan <repo> <solicitud.json>` y revisa la salida antes de usar',
        '`apply <repo> <solicitud.json> <SHA-256 del plan>`.', ''
    ].join('\n'));

    const sample = path.join(root, 'sample');
    const body = Buffer.from([
        '---', 'name: synthetic-handoff',
        'description: Summarize a synthetic task handoff. Use when validating the KronForge preview fixture.',
        '---', '', '# Synthetic handoff', '',
        'Given the fixture task, report its outcome and the next action in two lines.',
        'For the exact fixture task `KF-SYNTHETIC`, return `outcome: ready` and `next: review`.', ''
    ].join('\n'));
    const sampleSkill = 'payload/synthetic-handoff/SKILL.md';
    await mkdir(path.dirname(path.join(sample, sampleSkill)), {recursive: true});
    await writeFile(path.join(sample, sampleSkill), body);
    const manifest = jsonBytes({
        schemaVersion: 1,
        id: 'kronforge.synthetic-handoff',
        version: '1.0.0',
        license: 'MIT',
        source: {uri: 'urn:kronforge:synthetic-handoff', revision: 'fixture-1'},
        requires: [],
        profiles: [{id: 'default', files: ['skills/synthetic-handoff/SKILL.md']}],
        files: [{path: sampleSkill, target: 'skills/synthetic-handoff/SKILL.md', sha256: sha256(body)}]
    });
    await writeFile(path.join(sample, 'pack.json'), manifest);
    await writeFile(path.join(root, 'request.json'), jsonBytes({
        roots: ['kronforge.synthetic-handoff'],
        packs: [{directory: './sample', profile: 'default', manifestSha256: sha256(manifest)}]
    }));

    const plugin = path.join(root, 'plugin');
    const skill = path.join(plugin, 'skills/synthetic-handoff');
    await mkdir(skill, {recursive: true});
    await writeFile(path.join(skill, 'SKILL.md'), body);
    await writeFile(path.join(plugin, 'plugin.json'), jsonBytes({
        $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
        name: 'kronforge-synthetic-handoff',
        version: '1.0.0',
        license: 'MIT'
    }));
    const marketplace = path.join(root, '.agents/plugins');
    await mkdir(marketplace, {recursive: true});
    await writeFile(path.join(marketplace, 'marketplace.json'), jsonBytes({
        name: 'kronforge-local-preview',
        interface: {displayName: 'KronForge local preview'},
        plugins: [{
            name: 'kronforge-synthetic-handoff',
            source: {source: 'local', path: './plugin'},
            policy: {installation: 'AVAILABLE', authentication: 'ON_INSTALL'},
            category: 'Productivity'
        }]
    }));
    const adapter = path.join(root, 'claude-adapter');
    const adapterSkill = path.join(adapter, 'skills/synthetic-handoff');
    const adapterMetadata = path.join(adapter, '.claude-plugin');
    await mkdir(adapterSkill, {recursive: true});
    await mkdir(adapterMetadata);
    await writeFile(path.join(adapterSkill, 'SKILL.md'), body);
    await writeFile(path.join(adapterMetadata, 'plugin.json'), jsonBytes({
        name: 'kronforge-synthetic-handoff', version: '1.0.0',
        description: 'Synthetic KronForge preview', author: {name: 'KronForge'}
    }));
    const adapterMarketplace = path.join(root, '.claude-plugin');
    await mkdir(adapterMarketplace);
    await writeFile(path.join(adapterMarketplace, 'marketplace.json'), jsonBytes({
        name: 'kronforge-local-preview',
        owner: {name: 'KronForge'},
        plugins: [{name: 'kronforge-synthetic-handoff', source: './claude-adapter',
            description: 'Synthetic KronForge preview'}]
    }));
    console.log(JSON.stringify({root, manifestSha256: sha256(manifest), skillSha256: sha256(body)}, null, 2));
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
