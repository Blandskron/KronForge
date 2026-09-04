#!/usr/bin/env node
// Genera `llms.txt` desde `library/catalog.json` y los documentos canónicos.
// Es la tercera proyección del repositorio, junto al catálogo y a `skills/`:
// una puerta de entrada legible para agentes que llegan al sitio publicado.
//
//   node scripts/build-llms.mjs           escribe la proyección
//   node scripts/build-llms.mjs --check   falla si la proyección está desactualizada

import {writeFile} from 'node:fs/promises';

import {exists, fromRoot, readJson, readText} from './lib/repository.mjs';

const OUTPUT = fromRoot('llms.txt');
const CHECK_ONLY = process.argv.includes('--check');
const SITE = 'https://blandskron.github.io/agents-first-repo-docs';

const catalog = await readJson(fromRoot('library/catalog.json'));

function link(title, relative, note) {
    return `- [${title}](${SITE}/${relative})${note ? `: ${note}` : ''}`;
}

const entryPoints = [
    ['Instrucciones de agente', 'AGENTS.md', 'reglas operativas, superficie editable y definición de terminado'],
    ['Prompt maestro', 'prompts/agents-first-documentation-review.prompt.md', 'auditar y preparar un repositorio agents-first'],
    ['Índice de la biblioteca', 'library/README.md', 'cómo está organizado el conocimiento por dominios'],
    ['Catálogo machine-readable', 'library/catalog.json', 'inventario completo con metadatos, relaciones y rutas'],
    ['Skills distribuibles', 'skills/README.md', 'skills en el formato abierto Agent Skills']
];

const policies = [
    ['Arquitectura vigente', 'docs/architecture/FRAMEWORK_ARCHITECTURE.md', 'capas, fuente de verdad y escalabilidad'],
    ['Compatibilidad con agentes', 'docs/AGENT_COMPATIBILITY.md', 'qué está verificado y qué no'],
    ['Frescura verificable', 'docs/SPEC_FRESHNESS.md', 'cómo se declara y caduca una referencia externa'],
    ['Contrato de activos', 'docs/CONTRIBUTING_ASSETS.md', 'metadatos obligatorios y reglas de contribución'],
    ['Quality gates', 'docs/QUALITY_GATES.md', 'criterios de revisión y definición de terminado'],
    ['Registro de decisiones', 'docs/adr/README.md', 'decisiones arquitectónicas y sus alternativas rechazadas']
];

const domains = catalog.domains
    .map((domain) => {
        const assets = catalog.assets.filter((asset) => asset.domain === domain.id);
        return {domain, assets};
    })
    .filter(({assets}) => assets.length);

const lines = [
    '# Agents First Framework',
    '',
    `> Plataforma documental abierta de AI Engineering para diseñar contexto, repositorios, agentes y software verificable. Markdown canónico, agnóstico al modelo y al stack, sin runtime. Versión ${catalog.frameworkVersion}, catálogo actualizado el ${catalog.lastUpdated}.`,
    '',
    'El conocimiento vive en Markdown bajo `library/domains/`. El catálogo JSON y las carpetas `skills/` son proyecciones verificadas de esa fuente, no fuentes alternativas.',
    '',
    'Antes de aplicar cualquier activo: lee antes de modificar, no inventes comandos ni resultados, presenta un plan antes de cambios relevantes y pide aprobación para acciones sensibles.',
    '',
    '## Entradas',
    '',
    ...entryPoints.map(([title, relative, note]) => link(title, relative, note)),
    '',
    '## Políticas y contratos',
    '',
    ...policies.map(([title, relative, note]) => link(title, relative, note)),
    ''
];

for (const {domain, assets} of domains) {
    lines.push(`## ${domain.title}`, '', domain.summary, '');
    for (const asset of assets.slice().sort((left, right) => left.id.localeCompare(right.id))) {
        lines.push(link(asset.title, `library/${asset.path}`, `${asset.type} · ${asset.summary}`));
    }
    lines.push('');
}

const pending = catalog.domains.filter((domain) => !catalog.assets.some((asset) => asset.domain === domain.id));
if (pending.length) {
    lines.push(
        '## Opcional',
        '',
        `Dominios declarados sin activos canónicos todavía: ${pending.map((domain) => domain.title).join(', ')}. Sus índices describen alcance futuro y no contienen conocimiento aplicable.`,
        ''
    );
}

const content = lines.join('\n');

if (CHECK_ONLY) {
    if (!await exists(OUTPUT)) {
        console.error('Falta llms.txt. Ejecuta npm run build:llms');
        process.exit(1);
    }
    const current = (await readText(OUTPUT)).replace(/\r\n?/g, '\n');
    if (current !== content) {
        console.error('llms.txt desactualizado. Ejecuta npm run build:llms');
        process.exit(1);
    }
    console.log(`llms.txt al día · ${catalog.assets.length} activos en ${domains.length} dominios`);
} else {
    await writeFile(OUTPUT, content, 'utf8');
    console.log(`llms.txt generado · ${catalog.assets.length} activos en ${domains.length} dominios`);
}
