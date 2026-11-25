import {writeFile} from 'node:fs/promises';
import {fromRoot, parseFrontMatter, readJson, readText} from './lib/repository.mjs';

const output = fromRoot('library/learning-guidance.json');
const {learningPaths} = await readJson(fromRoot('library/catalog.json'));
const {data} = parseFrontMatter(await readText(fromRoot('docs/LEARNING_GUIDANCE.md')));
const fields = ['level', 'prerequisite', 'goal', 'outcome'];
const routeIds = new Set(learningPaths.map(({id}) => id));
for (const id of Object.keys(data ?? {})) {
    if (!routeIds.has(id)) throw new Error(`Guía para ruta inexistente: ${id}`);
}
const routes = {};
for (const {id, status} of learningPaths) {
    const guide = data?.[id];
    if (!guide && status !== 'available') continue;
    if (!guide || Object.keys(guide).length !== fields.length
        || fields.some(field => typeof guide[field] !== 'string' || !guide[field].trim())) {
        throw new Error(`Guía incompleta o inválida para ${id}`);
    }
    routes[id] = Object.fromEntries(fields.map(field => [field, guide[field].trim()]));
}
const generated = JSON.stringify({schemaVersion: 1, routes}, null, 2) + '\n';
if (process.argv.includes('--check')) {
    if ((await readText(output)).replaceAll('\r\n', '\n') !== generated) {
        throw new Error('Guía de aprendizaje desactualizada. Ejecuta npm run build.');
    }
} else {
    await writeFile(output, generated);
}
