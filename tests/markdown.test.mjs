import assert from 'node:assert/strict';
import test from 'node:test';

import {renderMarkdown} from '../assets/js/markdown.js';

test('oculta el front matter y conserva la estructura documental', () => {
    const source = `---
id: example
title: Ejemplo
---
# Guía

Texto **importante** con \`código\`.

- uno
- dos
`;
    const html = renderMarkdown(source);

    assert.doesNotMatch(html, /id: example/);
    assert.match(html, /<h1>Guía<\/h1>/);
    assert.match(html, /<strong>importante<\/strong>/);
    assert.match(html, /<code>código<\/code>/);
    assert.match(html, /<ul><li>uno<\/li><li>dos<\/li><\/ul>/);
});

test('renderiza tablas, tareas y bloques de código como HTML semántico', () => {
    const source = `| Campo | Valor |
| --- | --- |
| estado | estable |

- [x] validado

\`\`\`js
const answer = 42;
\`\`\`
`;
    const html = renderMarkdown(source);

    assert.match(html, /<table>/);
    assert.match(html, /class="table-scroll" tabindex="0" role="region" aria-label="Tabla desplazable"/);
    assert.match(html, /<th>Campo<\/th>/);
    assert.match(html, /type="checkbox" disabled checked/);
    assert.match(html, /class="language-js"/);
    assert.match(html, /<pre tabindex="0" role="region" aria-label="Bloque de código">/);
    assert.match(html, /const answer = 42;/);
});

test('escapa HTML y bloquea protocolos activos', () => {
    const html = renderMarkdown(
        '<img src=x onerror=alert(1)>\n\n[enlace](javascript:alert(1))\n\n<script>alert(1)</script>'
    );

    assert.doesNotMatch(html, /<script>/);
    assert.doesNotMatch(html, /<img src=x/);
    assert.doesNotMatch(html, /href="javascript:/);
    assert.match(html, /href="#"/);
    assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
    assert.match(html, /&lt;script&gt;/);
});

test('permite enlaces web, correo, anclas y rutas relativas', () => {
    const html = renderMarkdown(
        '[web](https://example.com) [correo](mailto:team@example.com) [sección](#uso) [local](../README.md)'
    );

    assert.match(html, /href="https:\/\/example\.com"/);
    assert.match(html, /href="mailto:team@example\.com"/);
    assert.match(html, /href="#uso"/);
    assert.match(html, /href="\.\.\/README\.md"/);
});
