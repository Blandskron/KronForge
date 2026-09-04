import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {
    ROOT,
    exists,
    fromRoot,
    normalizeSearch,
    parseFrontMatter,
    readJson,
    readText,
    semver,
    sha256,
    slugifyHeading,
    toPosix,
    walk
} from './lib/repository.mjs';
import {validateJsonSchema} from './lib/json-schema.mjs';

const errors = [];
const warnings = [];
const checks = [];
const secretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bghp_[A-Za-z0-9]{30,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
    /\bsk-[A-Za-z0-9]{32,}\b/,
    /\bAKIA[0-9A-Z]{16}\b/
];

function fail(message) {
    errors.push(message);
}

function warn(message) {
    warnings.push(message);
}

async function check(name, action) {
    const before = errors.length;
    try {
        await action();
    } catch (error) {
        fail(`${name}: ${error.message}`);
    }
    checks.push({name, ok: errors.length === before});
}

// Umbrales de frescura para referencias externas. Ver docs/SPEC_FRESHNESS.md.
const SPEC_WARN_DAYS = 90;
const SPEC_FAIL_DAYS = 180;
const TODAY = new Date();

function daysSince(isoDate) {
    const parsed = Date.parse(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(parsed)) return null;
    return Math.floor((TODAY.getTime() - parsed) / 86400000);
}

function normalizeSpecRef(reference) {
    if (!reference || typeof reference !== 'object') return null;
    return [reference.spec, reference.version ?? '', reference.url, reference.verified].join('|');
}

function equalSpecRefs(left, right) {
    const a = (Array.isArray(left) ? left : []).map(normalizeSpecRef);
    const b = (Array.isArray(right) ? right : []).map(normalizeSpecRef);
    return a.length === b.length && a.every((value, index) => value === b[index]);
}

function unique(values, label) {
    const seen = new Set();
    for (const value of values) {
        if (seen.has(value)) fail(`${label} duplicado: ${value}`);
        seen.add(value);
    }
}

function equalArray(left = [], right = []) {
    return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

const requiredGovernance = [
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    'SECURITY.md',
    'SUPPORT.md',
    'GOVERNANCE.md',
    'MAINTAINERS.md',
    '.github/CODEOWNERS',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/ISSUE_TEMPLATE/bug-report.yml',
    '.github/ISSUE_TEMPLATE/asset-or-rfc-proposal.yml',
    'docs/DOCUMENTATION_STANDARDS.md',
    'docs/QUALITY_GATES.md',
    'docs/AGENT_COMPATIBILITY.md',
    'docs/architecture/FRAMEWORK_ARCHITECTURE.md',
    'docs/adr/README.md'
];

let catalog;
let markdownFiles;
let catalogAssets;
let catalogDomains;

await check('Archivos esenciales y gobernanza', async () => {
    const required = [
        '.nojekyll',
        '404.html',
        'LICENSE',
        'README.md',
        'AGENTS.md',
        'index.html',
        'library/catalog.json',
        'library/schema/catalog-v3.schema.json',
        'prompts/agents-first-documentation-review.prompt.md',
        ...requiredGovernance
    ];
    for (const relative of required) {
        if (!await exists(fromRoot(relative))) fail(`Falta ${relative}`);
    }
});

await check('Catálogo JSON y contrato v3', async () => {
    catalog = await readJson(fromRoot('library/catalog.json'));
    catalogDomains = catalog.domains || [];
    catalogAssets = catalog.assets || [];

    if (Number(catalog.schemaVersion) !== 3) fail(`schemaVersion debe ser 3, recibido ${catalog.schemaVersion}`);
    if (!semver(catalog.frameworkVersion)) fail(`frameworkVersion inválido: ${catalog.frameworkVersion}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(catalog.lastUpdated || '')) fail('lastUpdated debe usar YYYY-MM-DD');
    if (catalog.$schema !== 'schema/catalog-v3.schema.json') {
        fail(`$schema debe apuntar a schema/catalog-v3.schema.json, recibido ${catalog.$schema}`);
    }

    const schema = await readJson(fromRoot('library/schema/catalog-v3.schema.json'));
    if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
        fail('El schema debe declarar JSON Schema draft 2020-12');
    }
    const schemaErrors = validateJsonSchema(catalog, schema);
    for (const error of schemaErrors) fail(`Schema: ${error}`);

    if (!Array.isArray(catalog.typeDefinitions) || !catalog.typeDefinitions.length) fail('Faltan typeDefinitions');
    if (!Array.isArray(catalog.learningPaths) || !catalog.learningPaths.length) fail('Faltan learningPaths');

    unique(catalogDomains.map((domain) => domain.id), 'ID de dominio');
    unique(catalogAssets.map((asset) => asset.id), 'ID de activo');
    unique(catalogAssets.map((asset) => asset.path), 'Ruta de activo');
    unique((catalog.learningPaths || []).map((route) => route.id), 'ID de ruta de aprendizaje');

    const domainIds = new Set(catalogDomains.map((domain) => domain.id));
    const assetIds = new Set(catalogAssets.map((asset) => asset.id));
    const typeIds = new Set(catalog.typeDefinitions.map((type) => typeof type === 'string' ? type : type.id));
    const levels = new Set(['foundation', 'intermediate', 'advanced']);
    const states = new Set(['draft', 'stable', 'deprecated']);
    const requiredAssetFields = [
        'id', 'title', 'summary', 'type', 'domain', 'category', 'level',
        'status', 'version', 'compatibility', 'models', 'agents', 'language',
        'author', 'license', 'lastModified', 'tags', 'dependencies', 'related',
        'inputs', 'outputs', 'examples', 'estimatedTime', 'complexity', 'useCases', 'path'
    ];

    for (const domain of catalogDomains) {
        if (!domain.id || !domain.title || !domain.summary || !domain.index) {
            fail(`Dominio incompleto: ${domain.id || '(sin id)'}`);
            continue;
        }
        if (!await exists(fromRoot('library', domain.index))) fail(`Índice de dominio ausente: ${domain.index}`);
    }

    for (const asset of catalogAssets) {
        for (const field of requiredAssetFields) {
            if (!(field in asset)) fail(`${asset.id}: falta campo ${field}`);
        }
        if (!domainIds.has(asset.domain)) fail(`${asset.id}: dominio inexistente ${asset.domain}`);
        if (!typeIds.has(asset.type)) fail(`${asset.id}: tipo no declarado ${asset.type}`);
        if (!levels.has(asset.level)) fail(`${asset.id}: level inválido ${asset.level}`);
        if (asset.difficulty && asset.difficulty !== asset.level) fail(`${asset.id}: difficulty y level difieren`);
        if (!states.has(asset.status)) fail(`${asset.id}: status inválido ${asset.status}`);
        if (!semver(asset.version)) fail(`${asset.id}: version inválida ${asset.version}`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(asset.lastModified || '')) fail(`${asset.id}: lastModified inválido`);
        for (const field of ['models', 'agents', 'tags', 'dependencies', 'related', 'inputs', 'outputs', 'examples', 'useCases']) {
            if (!Array.isArray(asset[field])) fail(`${asset.id}: ${field} debe ser array`);
        }
        for (const relation of [...(asset.related || []), ...(asset.dependencies || [])]) {
            if (!assetIds.has(relation)) fail(`${asset.id}: relación inexistente ${relation}`);
        }
        const target = path.resolve(fromRoot('library'), asset.path);
        if (!target.startsWith(fromRoot('library') + path.sep)) fail(`${asset.id}: ruta fuera de library`);
        if (!await exists(target)) fail(`${asset.id}: archivo ausente ${asset.path}`);
    }

    for (const route of catalog.learningPaths || []) {
        if (!route.title || !route.summary || !Array.isArray(route.assets) || !route.assets.length) {
            fail(`Ruta de aprendizaje incompleta: ${route.id}`);
            continue;
        }
        for (const assetId of route.assets) {
            if (!assetIds.has(assetId)) fail(`${route.id}: activo inexistente ${assetId}`);
        }
    }
});

await check('Paridad catálogo, front matter e índices', async () => {
    const catalogPaths = new Set();
    for (const asset of catalogAssets) {
        const target = fromRoot('library', asset.path);
        catalogPaths.add(path.resolve(target));
        const source = await readText(target);
        const {data} = parseFrontMatter(source);
        if (!data) {
            fail(`${asset.id}: falta front matter`);
            continue;
        }
        const comparisons = {
            id: asset.id,
            title: asset.title,
            summary: asset.summary,
            type: asset.type,
            domain: asset.domain,
            status: asset.status,
            version: asset.version,
            difficulty: asset.level,
            compatibility: asset.compatibility
        };
        for (const [field, expected] of Object.entries(comparisons)) {
            if (data[field] !== expected) fail(`${asset.id}: ${field} difiere entre catálogo y front matter`);
        }
        if (!equalArray(data.models || [], asset.models || [])) fail(`${asset.id}: models difiere`);
        if (!equalArray(data.related || [], asset.related || [])) fail(`${asset.id}: related difiere`);
        if (!equalSpecRefs(data.specRefs, asset.specRefs)) fail(`${asset.id}: specRefs difiere entre catálogo y front matter`);

        const domain = catalogDomains.find((item) => item.id === asset.domain);
        const index = await readText(fromRoot('library', domain.index));
        const relativeWithinDomain = asset.path.split('/').slice(2).join('/');
        if (!index.includes(relativeWithinDomain)) fail(`${asset.id}: no aparece en ${domain.index}`);
    }

    const assetFiles = await walk(fromRoot('library/domains'), (file) =>
        file.toLowerCase().endsWith('.md') && path.basename(file).toLowerCase() !== 'readme.md');
    for (const file of assetFiles) {
        if (!catalogPaths.has(path.resolve(file))) {
            fail(`Activo no catalogado: ${toPosix(path.relative(fromRoot('library'), file))}`);
        }
    }
});

await check('Frescura de referencias externas', async () => {
    for (const asset of catalogAssets) {
        for (const reference of asset.specRefs || []) {
            const age = daysSince(reference.verified);
            if (age === null) {
                fail(`${asset.id}: specRefs.verified inválido para ${reference.spec}`);
                continue;
            }
            if (age < 0) {
                fail(`${asset.id}: specRefs.verified de ${reference.spec} está en el futuro`);
                continue;
            }
            if (age > SPEC_FAIL_DAYS) {
                fail(`${asset.id}: referencia a ${reference.spec} sin verificar hace ${age} días (límite ${SPEC_FAIL_DAYS})`);
            } else if (age > SPEC_WARN_DAYS) {
                warn(`${asset.id}: referencia a ${reference.spec} verificada hace ${age} días; re-verifica antes de ${SPEC_FAIL_DAYS}`);
            }
        }
    }

    const withRefs = catalogAssets.filter((asset) => (asset.specRefs || []).length).length;
    if (!withRefs) fail('Ningún activo declara specRefs; la política de frescura no se está aplicando');
});

await check('Conformidad Agent Skills y proyección distribuible', async () => {
    // Contrato del formato abierto. Ver library/domains/ai-agent-engineering/checklists/agent-skills-conformance.checklist.md
    const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const REMOTE_FETCH = /\b(?:curl|wget|Invoke-WebRequest|iwr)\b[^\n]*https?:\/\//i;
    const REMOTE_INSTRUCTION = /(?:sigue|obedece|aplica|descarga|obtén|obten)[^\n]*https?:\/\//i;

    const skillFiles = await walk(ROOT, (file) => path.basename(file) === 'SKILL.md');
    if (!skillFiles.length) fail('No se encontró ningún SKILL.md');

    for (const file of skillFiles) {
        const relative = toPosix(path.relative(ROOT, file));
        const source = await readText(file);
        const {data, body} = parseFrontMatter(source);

        if (!data) {
            fail(`${relative}: SKILL.md sin front matter`);
            continue;
        }

        const directory = path.basename(path.dirname(file));
        if (!data.name) fail(`${relative}: falta name`);
        else {
            if (data.name.length > 64) fail(`${relative}: name supera 64 caracteres`);
            if (!NAME_PATTERN.test(data.name)) fail(`${relative}: name no cumple el formato del estándar`);
            if (data.name !== directory) fail(`${relative}: name "${data.name}" no coincide con el directorio "${directory}"`);
        }

        if (!data.description) fail(`${relative}: falta description`);
        else if (data.description.length > 1024) fail(`${relative}: description supera 1024 caracteres`);

        const bodyLines = body.split('\n').length;
        if (bodyLines > 500) fail(`${relative}: el cuerpo tiene ${bodyLines} líneas; el estándar recomienda menos de 500`);

        // AST05 — instrucciones cargadas desde una fuente externa no verificada.
        if (REMOTE_FETCH.test(body)) fail(`${relative}: obtiene contenido remoto en ejecución (AST05)`);
        if (REMOTE_INSTRUCTION.test(body)) fail(`${relative}: delega instrucciones a una URL externa (AST05)`);
    }

    const projection = spawnSync(process.execPath, [fromRoot('scripts/build-skills.mjs'), '--check'], {encoding: 'utf8'});
    if (projection.status !== 0) {
        fail(`Proyección skills/ desactualizada: ${(projection.stderr || projection.stdout || '').trim()}`);
    }
});

await check('Superficie de descubrimiento llms.txt', async () => {
    const projection = spawnSync(process.execPath, [fromRoot('scripts/build-llms.mjs'), '--check'], {encoding: 'utf8'});
    if (projection.status !== 0) {
        fail(`llms.txt desactualizado: ${(projection.stderr || projection.stdout || '').trim()}`);
    }

    const content = await readText(fromRoot('llms.txt'));
    if (!content.startsWith('# ')) fail('llms.txt debe empezar con un encabezado H1');
    if (!content.includes('\n> ')) fail('llms.txt debe incluir el resumen en blockquote');

    // Las rutas publicadas deben existir en el repositorio.
    for (const match of content.matchAll(/\]\(https:\/\/blandskron\.github\.io\/agents-first-repo-docs\/([^)]+)\)/g)) {
        if (!await exists(fromRoot(decodeURIComponent(match[1])))) fail(`llms.txt referencia una ruta inexistente: ${match[1]}`);
    }
});

await check('Markdown, enlaces, anclas y cercas', async () => {
    markdownFiles = await walk(ROOT, (file) => file.toLowerCase().endsWith('.md'));
    const exactHashes = new Map();

    for (const file of markdownFiles) {
        const source = await readText(file);
        const relative = toPosix(path.relative(ROOT, file));
        const lines = source.split(/\r?\n/);
        for (const [marker, label] of [['```', 'backticks'], ['~~~', 'tildes']]) {
            const fences = lines.filter((line) => line.trimStart().startsWith(marker));
            if (fences.length % 2 !== 0) {
                fail(`${relative}: cerca de código ${label} sin cerrar`);
            }
        }

        const hash = sha256(source.replace(/\r\n?/g, '\n').trim());
        if (exactHashes.has(hash)) fail(`Markdown duplicado: ${relative} y ${exactHashes.get(hash)}`);
        exactHashes.set(hash, relative);

        const links = [...source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)];
        for (const match of links) {
            const raw = match[1].trim().replace(/^<|>$/g, '');
            if (/^(https?:\/\/|mailto:|data:)/i.test(raw)) continue;
            const [pathname, fragment] = raw.split('#', 2);
            const target = path.resolve(path.dirname(file), decodeURIComponent(pathname || path.basename(file)));
            if (!await exists(target)) {
                fail(`${relative}: enlace roto ${raw}`);
                continue;
            }
            if (fragment && target.toLowerCase().endsWith('.md')) {
                const targetSource = await readText(target);
                const anchors = new Set([...targetSource.matchAll(/^#{1,6}\s+(.+)$/gm)].map((heading) => slugifyHeading(heading[1])));
                const expected = slugifyHeading(decodeURIComponent(fragment));
                if (!anchors.has(expected)) fail(`${relative}: ancla inexistente ${raw}`);
            }
        }
    }
});

await check('Patrones de secretos en archivos de texto', async () => {
    const textExtensions = new Set(['.md', '.html', '.js', '.mjs', '.json', '.yml', '.yaml', '.css', '.txt']);
    const extensionlessText = new Set(['CODEOWNERS', 'LICENSE', '.nojekyll']);
    const textFiles = await walk(ROOT, (file) =>
        textExtensions.has(path.extname(file).toLowerCase())
        || extensionlessText.has(path.basename(file)));

    for (const file of textFiles) {
        const source = await readText(file);
        const relative = toPosix(path.relative(ROOT, file));
        for (const pattern of secretPatterns) {
            if (pattern.test(source)) fail(`${relative}: patrón de secreto real detectado`);
        }
    }
});

await check('Navegación, páginas y referencias web', async () => {
    const index = await readText(fromRoot('index.html'));
    const pageFiles = await walk(fromRoot('pages'), (file) => file.endsWith('.html'));
    const pageSources = await Promise.all(pageFiles.map((file) => readText(file)));
    const combinedHtml = [index, ...pageSources].join('\n');

    const sections = new Set([...index.matchAll(/<section\s+id="([^"]+)"\s+class="tab-pane/g)].map((match) => match[1]));
    const tabs = new Set([...index.matchAll(/data-tab="([^"]+)"/g)].map((match) => match[1]));
    for (const tab of tabs) {
        if (!sections.has(tab)) fail(`Tab sin pane: ${tab}`);
        if (!await exists(fromRoot('pages', `${tab}.html`))) fail(`Tab sin página: ${tab}`);
    }
    for (const section of sections) {
        if (!await exists(fromRoot('pages', `${section}.html`))) fail(`Pane sin página: ${section}`);
    }
    for (const file of pageFiles) {
        const source = await readText(file);
        const name = path.basename(file, '.html');
        if (!source.includes('page-entry.js') || !source.includes(`data-page="${name}"`)) {
            fail(`Entrada directa incompleta: pages/${path.basename(file)}`);
        }
    }

    const ids = new Set([...combinedHtml.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
    for (const match of combinedHtml.matchAll(/data-(?:copy|download)-target="([^"]+)"/g)) {
        if (!ids.has(match[1])) fail(`Target de acción inexistente: ${match[1]}`);
    }
    const assetIds = new Set(catalogAssets.map((asset) => asset.id));
    for (const match of combinedHtml.matchAll(/data-asset-link="([^"]+)"/g)) {
        if (!assetIds.has(match[1])) fail(`data-asset-link inexistente: ${match[1]}`);
    }

    for (const match of index.matchAll(/(?:src|href)="((?:assets\/)[^"?]+)(?:\?[^"]*)?"/g)) {
        if (!await exists(fromRoot(match[1]))) fail(`Recurso web inexistente: ${match[1]}`);
    }
    const models = await readText(fromRoot('assets/js/models.js'));
    if (models.includes('.github/copilot-instructions.md')
        && !models.includes('raw.githubusercontent.com/Blandskron/agents-first-repo-docs/main/.github/copilot-instructions.md')) {
        fail('El visor de Copilot necesita una fuente pública alternativa porque GitHub Pages no sirve .github/');
    }

    const jsFiles = await walk(fromRoot('assets/js'), (file) => file.endsWith('.js'));
    for (const file of jsFiles) {
        const source = await readText(file);
        for (const match of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
            const specifier = match[1].split(/[?#]/, 1)[0];
            const target = path.resolve(path.dirname(file), specifier);
            if (!await exists(target)) fail(`${path.basename(file)} importa ruta inexistente ${match[1]}`);
        }
        const syntax = spawnSync(process.execPath, ['--check', file], {encoding: 'utf8'});
        if (syntax.status !== 0) fail(`JavaScript inválido ${toPosix(path.relative(ROOT, file))}: ${syntax.stderr.trim()}`);
    }
});

await check('Paridad de versión y roadmap', async () => {
    const index = await readText(fromRoot('index.html'));
    const pathsModule = await readText(fromRoot('assets/js/paths.js'));
    const changelog = await readText(fromRoot('docs/CHANGELOG.md'));
    const roadmap = await readText(fromRoot('docs/ROADMAP.md'));
    const version = catalog.frameworkVersion;

    if (!index.includes(`v${version}`)) fail(`index.html no declara v${version}`);
    if (!pathsModule.includes(`'${version}'`) && !pathsModule.includes(`"${version}"`)) fail(`paths.js no declara ${version}`);
    if (!changelog.includes(`## [${version}]`)) fail(`CHANGELOG no contiene ${version}`);
    for (const milestone of ['v3', 'v3.5', 'v4', 'v4.5', 'v5']) {
        if (!roadmap.includes(milestone)) fail(`ROADMAP no contiene ${milestone}`);
    }
});

await check('Cobertura y señales de mantenimiento', async () => {
    const emptyDomains = catalogDomains.filter((domain) => !catalogAssets.some((asset) => asset.domain === domain.id));
    if (emptyDomains.length) warn(`Dominios sin activos: ${emptyDomains.map((domain) => domain.id).join(', ')}`);

    const incompleteContracts = catalogAssets.filter((asset) =>
        !asset.inputs?.length || !asset.outputs?.length || !asset.useCases?.length);
    if (incompleteContracts.length) {
        warn(`Activos con contrato v3 parcial: ${incompleteContracts.length}/${catalogAssets.length}`);
    }
});

if (!process.argv.includes('--quiet')) {
    console.log('\nAgents First Framework — validación integral\n');
    for (const item of checks) console.log(`${item.ok ? '✓' : '✗'} ${item.name}`);
    for (const message of warnings) console.warn(`⚠ ${message}`);
    for (const message of errors) console.error(`✗ ${message}`);
    console.log(`\n${checks.length} grupos · ${errors.length} errores · ${warnings.length} advertencias`);
}

if (errors.length) process.exitCode = 1;
