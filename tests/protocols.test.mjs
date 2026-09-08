import assert from 'node:assert/strict';
import test from 'node:test';
import {
    PROTOCOL_MATURITY,
    dependencyCycles,
    equalProtocolMetadata,
    maturityIssues,
    missingSections,
    normativeBody,
    vendorLeak
} from '../scripts/lib/protocols.mjs';

const META = Object.freeze({
    code: 'AFP-001',
    maturity: 'experimental',
    actors: ['implementer', 'reviewer'],
    dependsOn: [],
    observedIn: ['un-proyecto'],
    lastValidated: '2026-09-07'
});

test('la paridad de metadatos no depende del orden de claves ni de listas', () => {
    const reordered = {
        lastValidated: META.lastValidated,
        observedIn: [...META.observedIn],
        dependsOn: [],
        actors: ['reviewer', 'implementer'],
        maturity: META.maturity,
        code: META.code
    };
    assert.equal(equalProtocolMetadata(META, reordered), true);
});

test('la paridad detecta una madurez divergente', () => {
    assert.equal(equalProtocolMetadata(META, {...META, maturity: 'validated'}), false);
});

test('la paridad trata la ausencia en ambos lados como equivalente', () => {
    assert.equal(equalProtocolMetadata(undefined, undefined), true);
    assert.equal(equalProtocolMetadata(META, undefined), false);
});

test('una madurez por encima de proposed exige evidencia declarada', () => {
    const {errors} = maturityIssues({...META, observedIn: []});
    assert.equal(errors.length, 1);
    assert.match(errors[0], /exige evidencia/);
});

test('proposed sin evidencia es válido y con evidencia solo advierte', () => {
    assert.deepEqual(maturityIssues({...META, maturity: 'proposed', observedIn: []}).errors, []);
    const {errors, warnings} = maturityIssues({...META, maturity: 'proposed'});
    assert.deepEqual(errors, []);
    assert.equal(warnings.length, 1);
});

test('una madurez fuera del vocabulario falla', () => {
    const {errors} = maturityIssues({...META, maturity: 'battle-tested'});
    assert.equal(errors.length, 1);
    assert.match(errors[0], /vocabulario/);
    assert.equal(PROTOCOL_MATURITY.includes('battle-tested'), false);
});

test('las cuatro secciones obligatorias se detectan por ausencia', () => {
    assert.deepEqual(missingSections('# Título\n\n## Actores\n\n## Ciclo de vida\n'), [
        'Evidencia y límites',
        'Qué no afirma este protocolo'
    ]);
});

test('un cuerpo completo no reporta secciones ausentes', () => {
    const body = ['Actores', 'Ciclo de vida', 'Evidencia y límites', 'Qué no afirma este protocolo']
        .map((heading) => `## ${heading}\n\ntexto\n`)
        .join('\n');
    assert.deepEqual(missingSections(body), []);
});

test('el cuerpo normativo excluye las secciones exentas', () => {
    const body = '## Contrato\n\nneutral\n\n## Evidencia y límites\n\nobservado en agnara\n';
    assert.equal(normativeBody(body).includes('agnara'), false);
    assert.equal(normativeBody(body).includes('neutral'), true);
});

test('un proveedor en el cuerpo normativo se detecta', () => {
    assert.equal(vendorLeak('## Contrato\n\nDelega la revisión en Claude.\n'), 'Claude');
});

test('un proveedor citado como evidencia no se reporta', () => {
    const body = '## Contrato\n\nneutral\n\n## Evidencia y límites\n\nObservado en agnara.\n';
    assert.equal(vendorLeak(body), null);
});

test('una sección de adaptadores no normativos también está exenta', () => {
    const body = '## Contrato\n\nneutral\n\n## Adaptadores no normativos\n\nEjemplo con Codex.\n';
    assert.equal(vendorLeak(body), null);
});

test('el léxico no dispara con una subcadena dentro de otra palabra', () => {
    assert.equal(vendorLeak('## Contrato\n\nLa cláusula exige evidencia.\n'), null);
});

test('un grafo acíclico no reporta ciclos', () => {
    const graph = new Map([
        ['AFP-001', {dependsOn: []}],
        ['AFP-002', {dependsOn: ['AFP-001']}],
        ['AFP-003', {dependsOn: ['AFP-001', 'AFP-002']}]
    ]);
    assert.deepEqual(dependencyCycles(graph), []);
});

test('un ciclo en el grafo se reporta con su traza', () => {
    const graph = new Map([
        ['AFP-001', {dependsOn: ['AFP-002']}],
        ['AFP-002', {dependsOn: ['AFP-001']}]
    ]);
    const cycles = dependencyCycles(graph);
    assert.equal(cycles.length > 0, true);
    assert.equal(cycles[0].includes('AFP-001'), true);
});

test('una dependencia hacia un protocolo ausente no rompe el recorrido', () => {
    const graph = new Map([['AFP-001', {dependsOn: ['AFP-999']}]]);
    assert.deepEqual(dependencyCycles(graph), []);
});
