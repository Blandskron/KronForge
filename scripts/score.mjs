import {spawnSync} from 'node:child_process';
import {exists, fromRoot, parseFrontMatter, readJson, readText, walk} from './lib/repository.mjs';

const validation = spawnSync(process.execPath, [fromRoot('scripts/validate.mjs'), '--quiet'], {
    cwd: fromRoot(),
    encoding: 'utf8'
});
const repositoryValid = validation.status === 0;
const catalog = await readJson(fromRoot('library/catalog.json'));
const assetSources = await Promise.all(catalog.assets.map(async (asset) => ({
    asset,
    source: await readText(fromRoot('library', asset.path))
})));

const has = async (relative) => exists(fromRoot(relative));
const contains = async (relative, value) =>
    await has(relative) && (await readText(fromRoot(relative))).includes(value);
const containsNormalized = async (relative, value) =>
    await has(relative)
    && (await readText(fromRoot(relative))).toLocaleLowerCase('es')
        .includes(String(value).toLocaleLowerCase('es'));
const ratio = (passed, total) => total > 0 && passed / total >= 0.8;

const frontMatterComplete = assetSources.filter(({source}) => {
    const {data} = parseFrontMatter(source);
    return data && ['id', 'title', 'summary', 'type', 'domain', 'status', 'version', 'difficulty', 'compatibility', 'models', 'tags', 'related']
        .every((field) => field in data);
}).length;
const relatedCoverage = catalog.assets.filter((asset) => asset.related?.length).length;
const contractCoverage = catalog.assets.filter((asset) =>
    asset.inputs?.length && asset.outputs?.length && asset.useCases?.length).length;
const populatedTypes = new Set(catalog.assets.map((asset) => asset.type)).size;
const populatedDomains = catalog.domains.filter((domain) =>
    catalog.assets.some((asset) => asset.domain === domain.id)).length;

// Frescura: ningún activo puede sostener una afirmación externa sin verificar.
// Ver docs/SPEC_FRESHNESS.md.
const SPEC_FAIL_DAYS = 180;
const now = Date.now();
const specRefs = catalog.assets.flatMap((asset) => asset.specRefs || []);
const staleRefs = specRefs.filter((reference) => {
    const parsed = Date.parse(`${reference.verified}T00:00:00Z`);
    return Number.isNaN(parsed) || (now - parsed) / 86400000 > SPEC_FAIL_DAYS;
});
const freshnessDeclared = specRefs.length >= 5 && staleRefs.length === 0;

// Conformidad de skills: name válido e igual al directorio, description dentro del límite.
const skillSources = await Promise.all(
    (await walk(fromRoot('skills'), (file) => file.endsWith('SKILL.md')))
        .map(async (file) => ({file, source: await readText(file)}))
);
const skillsConformant = skillSources.length > 0 && skillSources.every(({file, source}) => {
    const {data} = parseFrontMatter(source);
    if (!data?.name || !data?.description) return false;
    const directory = file.split(/[\\/]/).at(-2);
    return data.name === directory
        && data.name.length <= 64
        && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name)
        && data.description.length <= 1024;
});

const dimensions = [
    {
        name: 'Preparación para agentes',
        criteria: [
            ['AGENTS.md operativo', await has('AGENTS.md')],
            ['Prompt maestro estable', await has('prompts/agents-first-documentation-review.prompt.md')],
            ['Documentación agent completa', (await walk(fromRoot('docs/agent'), (file) => file.endsWith('.md'))).length >= 6],
            ['Matriz de compatibilidad', await has('docs/AGENT_COMPATIBILITY.md')],
            ['Permisos y pruebas explícitos', await has('docs/agent/PERMISSIONS.md') && await has('docs/agent/TESTS.md')]
        ]
    },
    {
        name: 'Calidad documental',
        criteria: [
            ['Estándar documental', await has('docs/DOCUMENTATION_STANDARDS.md')],
            ['Quality gates', await has('docs/QUALITY_GATES.md')],
            ['Auditoría v3', await has('docs/audits/REPOSITORY_AUDIT_V3.md')],
            ['Arquitectura vigente', await has('docs/architecture/FRAMEWORK_ARCHITECTURE.md')],
            ['Front matter consistente ≥80%', ratio(frontMatterComplete, catalog.assets.length)]
        ]
    },
    {
        name: 'Gobernanza',
        criteria: [
            ['Contribución general', await has('CONTRIBUTING.md')],
            ['Código de conducta', await has('CODE_OF_CONDUCT.md')],
            ['Gobernanza y maintainers', await has('GOVERNANCE.md') && await has('MAINTAINERS.md')],
            ['CODEOWNERS y PR template', await has('.github/CODEOWNERS') && await has('.github/PULL_REQUEST_TEMPLATE.md')],
            ['Issue forms', (await walk(fromRoot('.github/ISSUE_TEMPLATE'), (file) => /\.ya?ml$/.test(file))).length >= 2]
        ]
    },
    {
        name: 'Seguridad',
        criteria: [
            ['Política pública', await has('SECURITY.md')],
            ['Seguridad de agentes', await has('docs/agent/SECURITY.md')],
            ['Permisos sensibles', await contains('docs/agent/PERMISSIONS.md', 'aprobación')],
            ['Prompt protege secretos', await contains('prompts/agents-first-documentation-review.prompt.md', 'secretos')],
            ['Divulgación sin promesas inventadas', await containsNormalized('SECURITY.md', 'pendiente')]
        ]
    },
    {
        name: 'Automatización',
        criteria: [
            ['Validador integral', await has('scripts/validate.mjs')],
            ['Smoke test', await has('scripts/smoke-site.mjs')],
            ['Pruebas Node', (await walk(fromRoot('tests'), (file) => file.endsWith('.test.mjs'))).length >= 1],
            ['Workflow CI', await has('.github/workflows/validate.yml')],
            ['Superficies generadas verificadas', await contains('scripts/validate.mjs', 'build-skills.mjs') && await contains('scripts/validate.mjs', 'build-llms.mjs')]
        ]
    },
    {
        name: 'Compatibilidad',
        criteria: [
            ['Compatibilidad explícita', catalog.assets.every((asset) => typeof asset.compatibility === 'string' && asset.compatibility)],
            ['Núcleo disponible para cualquier modelo', catalog.assets.every((asset) => asset.models?.includes('any'))],
            ['Agentes declarados', catalog.assets.every((asset) => asset.agents?.length)],
            ['Adaptadores existentes', await has('CLAUDE.md') && await has('GEMINI.md') && await has('.github/copilot-instructions.md')],
            ['Skills conformes al estándar abierto', skillsConformant]
        ]
    },
    {
        name: 'Reutilización',
        criteria: [
            ['Catálogo v3', Number(catalog.schemaVersion) === 3],
            ['≥8 tipos poblados', populatedTypes >= 8],
            ['≥10 dominios poblados', populatedDomains >= 10],
            ['Relaciones declaradas ≥50%', ratio(relatedCoverage, catalog.assets.length)],
            ['Contratos detallados ≥80%', ratio(contractCoverage, catalog.assets.length)]
        ]
    },
    {
        name: 'Descubribilidad',
        criteria: [
            ['Búsqueda de portal', await contains('assets/js/catalog-v3.js', 'normalizeSearch')],
            ['Filtros de catálogo', await contains('pages/library.html', 'filter')],
            ['Tags navegables', await contains('assets/js/catalog-v3.js', 'data-tag-filter')],
            ['Superficie llms.txt publicada', await has('llms.txt')],
            ['URLs de activos', await contains('assets/js/catalog-utils.js', '#library/')]
        ]
    },
    {
        name: 'Mantenibilidad',
        criteria: [
            ['Registro ADR', await has('docs/adr/README.md')],
            ['Política SemVer', await has('PROMPT_VERSIONING.md')],
            ['Changelog', await has('docs/CHANGELOG.md')],
            ['Schema publicado', await has('library/schema/catalog-v3.schema.json')],
            ['Referencias externas vigentes', freshnessDeclared]
        ]
    },
    {
        name: 'Escalabilidad',
        criteria: [
            ['Arquitectura por dominios', catalog.domains.length >= 10],
            ['Taxonomía extensible', catalog.typeDefinitions?.length >= 20],
            ['IDs únicos', new Set(catalog.assets.map((asset) => asset.id)).size === catalog.assets.length],
            ['Rutas únicas', new Set(catalog.assets.map((asset) => asset.path)).size === catalog.assets.length],
            ['Proyección y fuente separadas', await contains('docs/adr/ADR-0002-catalog-v3-projection.md', 'proyección')]
        ]
    }
];

const results = dimensions.map((dimension) => {
    const passed = dimension.criteria.filter(([, value]) => Boolean(value)).length;
    return {...dimension, passed, score: passed * 2};
});
const total = results.reduce((sum, result) => sum + result.score, 0);
const calculatedGrade = total >= 90 ? 'A' : total >= 75 ? 'B' : total >= 60 ? 'C' : total >= 40 ? 'D' : 'E';
const grade = repositoryValid ? calculatedGrade : 'N/A';

if (process.argv.includes('--json')) {
    console.log(JSON.stringify({
        frameworkVersion: catalog.frameworkVersion,
        generatedAt: new Date().toISOString(),
        valid: repositoryValid,
        total,
        grade,
        dimensions: results.map(({name, passed, score, criteria}) => ({
            name,
            passed,
            score,
            criteria: criteria.map(([label, value]) => ({label, passed: Boolean(value)}))
        }))
    }, null, 2));
} else {
    console.log('\nAI Repository Score\n');
    for (const result of results) {
        console.log(`${String(result.score).padStart(2, ' ')}/10  ${result.name}`);
        for (const [label, value] of result.criteria) console.log(`       ${value ? '✓' : '·'} ${label}`);
    }
    console.log(`\nTotal: ${total}/100 · Nivel ${grade}`);
    if (!repositoryValid) {
        console.error('Estado: no calificable porque la validación integral del repositorio falla.');
    }
}

if (!repositoryValid) process.exitCode = 1;
