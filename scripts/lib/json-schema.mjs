function sameValue(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
}

function valueType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (Number.isInteger(value)) return 'integer';
    return typeof value;
}

function matchesType(value, expected) {
    if (expected === 'number') return typeof value === 'number' && Number.isFinite(value);
    if (expected === 'integer') return Number.isInteger(value);
    if (expected === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
    return valueType(value) === expected;
}

function resolvePointer(root, reference) {
    if (!reference.startsWith('#/')) throw new Error(`Solo se admiten referencias locales: ${reference}`);
    return reference.slice(2).split('/').reduce((current, segment) => {
        const key = segment.replaceAll('~1', '/').replaceAll('~0', '~');
        return current?.[key];
    }, root);
}

function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

export function validateJsonSchema(value, schema, options = {}) {
    const root = options.root || schema;
    const errors = options.errors || [];
    const at = options.at || '$';

    if (schema.$ref) {
        const resolved = resolvePointer(root, schema.$ref);
        if (!resolved) errors.push(`${at}: referencia inexistente ${schema.$ref}`);
        else validateJsonSchema(value, resolved, {root, errors, at});
    }

    for (const branch of schema.allOf || []) {
        validateJsonSchema(value, branch, {root, errors, at});
    }

    if ('const' in schema && !sameValue(value, schema.const)) {
        errors.push(`${at}: no coincide con const`);
    }
    if (schema.enum && !schema.enum.some((candidate) => sameValue(value, candidate))) {
        errors.push(`${at}: valor fuera de enum`);
    }

    if (schema.type) {
        const expected = Array.isArray(schema.type) ? schema.type : [schema.type];
        if (!expected.some((type) => matchesType(value, type))) {
            errors.push(`${at}: tipo ${valueType(value)}, esperado ${expected.join('|')}`);
            return errors;
        }
    }

    if (typeof value === 'string') {
        if (schema.minLength !== undefined && value.length < schema.minLength) {
            errors.push(`${at}: longitud menor que ${schema.minLength}`);
        }
        if (schema.pattern) {
            try {
                if (!new RegExp(schema.pattern, 'u').test(value)) errors.push(`${at}: no cumple pattern`);
            } catch {
                errors.push(`${at}: pattern inválido en el schema`);
            }
        }
        if (schema.format === 'date' && !validDate(value)) errors.push(`${at}: fecha inválida`);
    }

    if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) {
        errors.push(`${at}: valor menor que ${schema.minimum}`);
    }

    if (Array.isArray(value)) {
        if (schema.minItems !== undefined && value.length < schema.minItems) {
            errors.push(`${at}: menos de ${schema.minItems} elementos`);
        }
        if (schema.uniqueItems) {
            const keys = value.map((item) => JSON.stringify(item));
            if (new Set(keys).size !== keys.length) errors.push(`${at}: elementos duplicados`);
        }
        if (schema.items) {
            value.forEach((item, index) =>
                validateJsonSchema(item, schema.items, {root, errors, at: `${at}[${index}]`}));
        }
    }

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        for (const key of schema.required || []) {
            if (!(key in value)) errors.push(`${at}: falta propiedad ${key}`);
        }
        const properties = schema.properties || {};
        for (const [key, child] of Object.entries(value)) {
            if (properties[key]) {
                validateJsonSchema(child, properties[key], {root, errors, at: `${at}.${key}`});
            } else if (schema.additionalProperties === false) {
                errors.push(`${at}: propiedad no admitida ${key}`);
            } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
                validateJsonSchema(child, schema.additionalProperties, {root, errors, at: `${at}.${key}`});
            }
        }
    }

    return errors;
}
