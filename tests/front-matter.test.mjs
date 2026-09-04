import assert from 'node:assert/strict';
import test from 'node:test';

import {parseFrontMatter} from '../scripts/lib/repository.mjs';

function build(lines) {
    return ['---', ...lines, '---', '', 'Cuerpo del activo.', ''].join('\n');
}

test('conserva escalares, listas en línea y listas indentadas', () => {
    const {data} = parseFrontMatter(build([
        'id: domain.slug',
        'version: 1.0.0',
        'estimatedTime: 15',
        'complexity: null',
        'pillar: true',
        'tags: [uno, dos]',
        'related:',
        '  - domain.otro',
        '  - domain.tercero'
    ]));

    assert.equal(data.id, 'domain.slug');
    assert.equal(data.version, '1.0.0');
    assert.equal(data.estimatedTime, 15);
    assert.equal(data.complexity, null);
    assert.equal(data.pillar, true);
    assert.deepEqual(data.tags, ['uno', 'dos']);
    assert.deepEqual(data.related, ['domain.otro', 'domain.tercero']);
});

test('lee mapas anidados como metadata', () => {
    const {data} = parseFrontMatter(build([
        'name: ejemplo',
        'metadata:',
        '  framework: agents-first',
        '  author: acme',
        'status: stable'
    ]));

    assert.deepEqual(data.metadata, {framework: 'agents-first', author: 'acme'});
    assert.equal(data.status, 'stable', 'la clave posterior al bloque anidado debe seguir leyéndose');
});

test('lee listas de objetos como specRefs', () => {
    const {data} = parseFrontMatter(build([
        'id: domain.slug',
        'specRefs:',
        '  - spec: mcp',
        '    version: "2026-07-28"',
        '    url: https://example.org/mcp',
        '    verified: 2026-09-03',
        '  - spec: agent-skills',
        '    url: https://example.org/skills',
        '    verified: 2026-09-03',
        'tags: [x]'
    ]));

    assert.equal(data.specRefs.length, 2);
    assert.deepEqual(data.specRefs[0], {
        spec: 'mcp',
        version: '2026-07-28',
        url: 'https://example.org/mcp',
        verified: '2026-09-03'
    });
    assert.equal(data.specRefs[1].spec, 'agent-skills');
    assert.equal(data.specRefs[1].version, undefined);
    assert.deepEqual(data.tags, ['x'], 'la clave posterior a la lista de objetos debe seguir leyéndose');
});

test('separa cuerpo y devuelve null sin front matter', () => {
    const {data, body} = parseFrontMatter(build(['id: domain.slug']));
    assert.equal(body, '\nCuerpo del activo.\n');

    const sinFrontMatter = parseFrontMatter('# Solo cuerpo\n');
    assert.equal(sinFrontMatter.data, null);
    assert.equal(sinFrontMatter.body, '# Solo cuerpo\n');
});

test('normaliza saltos de línea de Windows', () => {
    const {data} = parseFrontMatter('---\r\nname: ejemplo\r\nmetadata:\r\n  framework: agents-first\r\n---\r\nCuerpo\r\n');
    assert.equal(data.name, 'ejemplo');
    assert.deepEqual(data.metadata, {framework: 'agents-first'});
});

test('una clave sin valor ni bloque queda vacía', () => {
    const {data} = parseFrontMatter(build(['name: ejemplo', 'compatibility:', 'status: draft']));
    assert.equal(data.compatibility, '');
    assert.equal(data.status, 'draft');
});
