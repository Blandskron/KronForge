import assert from 'node:assert/strict';
import test from 'node:test';

import {loadFileContent} from '../assets/js/loader.js';

function fakeTarget() {
    const attributes = new Map();
    return {
        dataset: {},
        classList: {add() {}, remove() {}},
        textContent: '',
        innerHTML: '',
        setAttribute(name, value) {
            attributes.set(name, value);
        },
        removeAttribute(name) {
            attributes.delete(name);
        },
        hasAttribute(name) {
            return attributes.has(name);
        },
        querySelector() {
            return null;
        }
    };
}

test('descarta una respuesta documental obsoleta para el mismo visor', async () => {
    const target = fakeTarget();
    const previousDocument = globalThis.document;
    const previousFetch = globalThis.fetch;
    globalThis.document = {getElementById: () => target};
    globalThis.fetch = (url, options = {}) => {
        if (String(url).includes('fast.md')) {
            return Promise.resolve({
                ok: true,
                text: async () => '# Contenido vigente'
            });
        }
        return new Promise((resolve, reject) => {
            options.signal?.addEventListener('abort', () =>
                reject(new DOMException('Solicitud reemplazada', 'AbortError')), {once: true});
        });
    };

    try {
        const obsolete = loadFileContent('slow.md', 'viewer');
        await Promise.resolve();
        const current = loadFileContent('fast.md', 'viewer');
        await Promise.all([obsolete, current]);

        assert.equal(target.dataset.rawMarkdown, '# Contenido vigente');
        assert.equal(target.dataset.loadState, 'ready');
        assert.match(target.innerHTML, /Contenido vigente/);
        assert.equal(target.hasAttribute('aria-busy'), false);
    } finally {
        globalThis.document = previousDocument;
        globalThis.fetch = previousFetch;
    }
});
