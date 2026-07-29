import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildPortalHash,
    downloadFilename,
    filterAndSortAssets,
    normalizeSearch,
    parsePortalHash,
    resolveRelatedAssets
} from '../assets/js/catalog-utils.js';

const assets = [
    {
        id: 'security.threat-model',
        title: 'Modelo de amenazas',
        type: 'template',
        domain: 'security',
        level: 'advanced',
        status: 'stable',
        tags: ['seguridad'],
        compatibility: ['universal'],
        lastModified: '2026-07-27',
        path: 'domains/security/templates/threat-model.template.md'
    },
    {
        id: 'testing.unit-tests',
        title: 'Pruebas unitarias',
        type: 'checklist',
        domain: 'testing',
        level: 'foundation',
        status: 'stable',
        tags: ['calidad'],
        compatibility: ['universal'],
        lastModified: '2026-07-28',
        related: ['security.threat-model']
    }
];

test('normaliza búsqueda en español sin depender de tildes o mayúsculas', () => {
    assert.equal(normalizeSearch('  REVISIÓN   TÉCNICA '), 'revision tecnica');
});

test('combina búsqueda, filtros y orden sin mutar el catálogo', () => {
    const original = structuredClone(assets);
    const result = filterAndSortAssets(assets, {
        query: 'pruebas',
        domain: 'testing',
        level: 'foundation',
        sort: 'updated'
    });

    assert.deepEqual(result.map((asset) => asset.id), ['testing.unit-tests']);
    assert.deepEqual(assets, original);
});

test('interpreta rutas compartibles y alias del portal', () => {
    assert.deepEqual(parsePortalHash('#library/security.threat-model'), {
        tabId: 'library',
        routeTab: 'library',
        assetId: 'security.threat-model',
        type: null,
        filters: {}
    });
    assert.deepEqual(parsePortalHash('#templates'), {
        tabId: 'library',
        routeTab: 'templates',
        assetId: null,
        type: 'template',
        filters: {}
    });
    assert.equal(buildPortalHash('library', 'security.threat-model'), '#library/security.threat-model');
});

test('serializa filtros y modo de lectura en una URL compartible', () => {
    const hash = buildPortalHash('library', 'security.threat-model', {
        query: 'modelo de amenazas',
        domain: 'security',
        type: 'template',
        status: 'all',
        sort: 'updated',
        reading: true
    });

    assert.equal(
        hash,
        '#library/security.threat-model?q=modelo+de+amenazas&type=template&domain=security&sort=updated&view=reading'
    );
    assert.deepEqual(parsePortalHash(hash).filters, {
        query: 'modelo de amenazas',
        type: 'template',
        domain: 'security',
        sort: 'updated',
        reading: true
    });
    assert.equal(buildPortalHash('playbooks', null, {type: 'playbook'}), '#playbooks');
});

test('resuelve relaciones y nombres de descarga con fallbacks seguros', () => {
    assert.deepEqual(
        resolveRelatedAssets({assets}, assets[1]).map((asset) => asset.id),
        ['security.threat-model']
    );
    assert.equal(downloadFilename(assets[0]), 'threat-model.template.md');
    assert.equal(downloadFilename({id: 'Guía Técnica'}), 'guia-tecnica.md');
});
