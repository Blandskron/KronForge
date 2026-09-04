#!/usr/bin/env node
// Genera la superficie `skills/` conforme al formato abierto Agent Skills a partir
// del Markdown canónico de `library/`. El Markdown de dominio sigue siendo la fuente;
// esta carpeta es una proyección comprometida en Git, igual que `library/catalog.json`.
//
//   node scripts/build-skills.mjs           escribe la proyección
//   node scripts/build-skills.mjs --check   falla si la proyección está desactualizada

import {mkdir, readdir, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';

import {exists, fromRoot, parseFrontMatter, readJson, readText, toPosix} from './lib/repository.mjs';

const OUTPUT_DIR = fromRoot('skills');
const CHECK_ONLY = process.argv.includes('--check');

// Campos del formato abierto que se emiten tal cual. `compatibility` queda fuera a
// propósito: en el repositorio significa neutralidad de modelo o herramienta y en la
// especificación significa requisitos de entorno. Se traslada a `metadata`.
const SPEC_FIELDS = ['name', 'description', 'license', 'allowed-tools'];

function quote(value) {
    return `"${String(value).replace(/"/g, '\\"')}"`;
}

function rewriteLinks(body, fromDirectory, toDirectory) {
    return body.replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (match, open, target, close) => {
        const raw = target.trim();
        if (/^(https?:\/\/|mailto:|data:|#)/i.test(raw)) return match;

        const [pathname, fragment] = raw.split('#', 2);
        if (!pathname) return match;

        const absolute = path.resolve(fromDirectory, decodeURIComponent(pathname));
        let relative = toPosix(path.relative(toDirectory, absolute));
        if (!relative.startsWith('.')) relative = `./${relative}`;
        return `${open}${fragment ? `${relative}#${fragment}` : relative}${close}`;
    });
}

function renderFrontMatter(data, asset) {
    const lines = ['---'];

    for (const field of SPEC_FIELDS) {
        const value = data[field];
        if (value === undefined || value === '' || value === null) continue;
        lines.push(`${field}: ${value}`);
    }

    // `compatibility` en el repositorio significa neutralidad de modelo o herramienta;
    // en la especificación significa requisitos de entorno. Se traslada a `metadata`
    // para no emitir una declaración que un cliente interpretaría de otra forma.
    const metadata = {
        ...(data.metadata && typeof data.metadata === 'object' ? data.metadata : {}),
        'asset-id': asset.id,
        'asset-version': asset.version,
        domain: asset.domain,
        status: asset.status,
        'repo-compatibility': asset.compatibility,
        canonical: `library/${asset.path}`
    };

    lines.push('metadata:');
    for (const [key, value] of Object.entries(metadata)) {
        lines.push(`  ${key}: ${quote(value)}`);
    }
    lines.push('---');
    return lines.join('\n');
}

function renderProvenance(asset, outputDirectory) {
    const canonical = fromRoot('library', asset.path);
    let relative = toPosix(path.relative(outputDirectory, canonical));
    if (!relative.startsWith('.')) relative = `./${relative}`;

    return [
        '## Procedencia',
        '',
        `Proyección generada del activo canónico [\`library/${asset.path}\`](${relative}).`,
        '',
        'No edites este archivo: modifica la fuente en `library/` y ejecuta `npm run build:skills`.',
        `La puerta de calidad falla si esta proyección queda desactualizada.`,
        ''
    ].join('\n');
}

async function buildSkill(asset) {
    const canonical = fromRoot('library', asset.path);
    const source = await readText(canonical);
    const {data, body} = parseFrontMatter(source);

    if (!data?.name) throw new Error(`${asset.id}: el activo skill no declara name`);
    if (!data?.description) throw new Error(`${asset.id}: el activo skill no declara description`);

    const outputDirectory = path.join(OUTPUT_DIR, data.name);
    const rewritten = rewriteLinks(body, path.dirname(canonical), outputDirectory);
    const content = [
        renderFrontMatter(data, asset),
        '',
        rewritten.trim(),
        '',
        renderProvenance(asset, outputDirectory)
    ].join('\n');

    return {name: data.name, file: path.join(outputDirectory, 'SKILL.md'), content};
}

function renderIndex(skills) {
    return [
        '# Skills distribuibles',
        '',
        'Superficie generada en el formato abierto Agent Skills para que un cliente compatible pueda',
        'descubrir y cargar estas skills sin conocer la estructura interna del repositorio.',
        '',
        '| Skill | Activo canónico |',
        '|---|---|',
        ...skills.map((skill) => `| [\`${skill.name}\`](${skill.name}/SKILL.md) | [\`library/${skill.assetPath}\`](../library/${skill.assetPath}) |`),
        '',
        '## Contrato',
        '',
        '- La fuente de verdad es el Markdown de `library/domains/<dominio>/skills/`.',
        '- Este directorio se regenera con `npm run build:skills` y se compromete en Git.',
        '- `npm run validate` falla si la proyección difiere de su fuente.',
        '- El front matter aquí contiene solo campos del formato abierto; los metadatos del',
        '  repositorio viajan en `metadata`.',
        '',
        'Antes de adoptar una skill de este o de cualquier otro repositorio, aplica la',
        '[checklist OWASP Agentic Skills Top 10](../library/domains/agent-supply-chain/checklists/owasp-agentic-skills-top-10.checklist.md)',
        'y la [checklist de conformidad](../library/domains/ai-agent-engineering/checklists/agent-skills-conformance.checklist.md).',
        ''
    ].join('\n');
}

const catalog = await readJson(fromRoot('library/catalog.json'));
const skillAssets = catalog.assets.filter((asset) => asset.type === 'skill');

const built = [];
for (const asset of skillAssets) {
    const skill = await buildSkill(asset);
    built.push({...skill, assetPath: asset.path});
}
built.sort((left, right) => left.name.localeCompare(right.name));

const files = [
    ...built.map((skill) => ({file: skill.file, content: skill.content})),
    {file: path.join(OUTPUT_DIR, 'README.md'), content: renderIndex(built)}
];

if (CHECK_ONLY) {
    const problems = [];

    for (const {file, content} of files) {
        const relative = toPosix(path.relative(fromRoot('.'), file));
        if (!await exists(file)) {
            problems.push(`falta ${relative}`);
            continue;
        }
        const current = (await readText(file)).replace(/\r\n?/g, '\n');
        if (current !== content) problems.push(`desactualizado ${relative}`);
    }

    const expected = new Set([...built.map((skill) => skill.name), 'README.md']);
    if (await exists(OUTPUT_DIR)) {
        for (const entry of await readdir(OUTPUT_DIR)) {
            if (!expected.has(entry)) problems.push(`sobrante skills/${entry}`);
        }
    }

    if (problems.length) {
        console.error('Proyección de skills desactualizada. Ejecuta npm run build:skills');
        for (const problem of problems) console.error(`  · ${problem}`);
        process.exit(1);
    }

    console.log(`Proyección de skills al día · ${built.length} skills`);
} else {
    await rm(OUTPUT_DIR, {recursive: true, force: true});
    for (const {file, content} of files) {
        await mkdir(path.dirname(file), {recursive: true});
        await writeFile(file, content, 'utf8');
    }
    console.log(`Proyección de skills generada · ${built.length} skills`);
    for (const skill of built) console.log(`  · skills/${skill.name}/SKILL.md`);
}
