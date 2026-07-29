import assert from 'node:assert/strict';
import test from 'node:test';

import {validateJsonSchema} from '../scripts/lib/json-schema.mjs';

const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['version', 'items'],
    properties: {
        version: {$ref: '#/$defs/semver'},
        items: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'status'],
                properties: {
                    id: {type: 'string', pattern: '^[a-z-]+$'},
                    status: {enum: ['draft', 'stable']}
                }
            }
        }
    },
    $defs: {
        semver: {type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$'}
    }
};

test('acepta un documento que cumple referencias y restricciones', () => {
    assert.deepEqual(validateJsonSchema({
        version: '3.0.0',
        items: [{id: 'asset-one', status: 'stable'}]
    }, schema), []);
});

test('reporta propiedades, patrones, enums y duplicados inválidos', () => {
    const errors = validateJsonSchema({
        version: 'v3',
        items: [
            {id: 'Asset 1', status: 'unknown'},
            {id: 'Asset 1', status: 'unknown'}
        ],
        extra: true
    }, schema);

    assert.ok(errors.some((error) => error.includes('$.version')));
    assert.ok(errors.some((error) => error.includes('$.items: elementos duplicados')));
    assert.ok(errors.some((error) => error.includes('$.items[0].id')));
    assert.ok(errors.some((error) => error.includes('$.items[0].status')));
    assert.ok(errors.some((error) => error.includes('propiedad no admitida extra')));
});
