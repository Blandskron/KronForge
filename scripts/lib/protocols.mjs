// Contrato de los activos de tipo `protocol`.
//
// Fuente canónica de las reglas: ADR-0006 y AFP-000.
// Ver docs/adr/ADR-0006-protocol-asset-type.md y
// library/domains/engineering-protocols/protocols/protocol-maturity.protocol.md

/** Escalones de madurez, de menor a mayor evidencia exigida. */
export const PROTOCOL_MATURITY = Object.freeze([
    'proposed',
    'experimental',
    'observed',
    'reproduced',
    'validated',
    'stable'
]);

/** Una madurez sin reevaluar envejece: advertencia y bloqueo, en días. */
export const PROTOCOL_WARN_DAYS = 180;
export const PROTOCOL_FAIL_DAYS = 365;

/** Un protocolo sin estas secciones publica una norma sin sus límites. */
export const PROTOCOL_REQUIRED_SECTIONS = Object.freeze([
    'Actores',
    'Ciclo de vida',
    'Evidencia y límites',
    'Qué no afirma este protocolo'
]);

/**
 * Secciones donde nombrar un proveedor, un modelo o un proyecto concreto es
 * legítimo: la traza de evidencia y el adaptador explícitamente no normativo.
 */
export const PROTOCOL_NEUTRAL_EXEMPT = Object.freeze([
    'Evidencia y límites',
    'Adaptadores no normativos'
]);

/**
 * Léxico de acoplamiento a proveedor. No pretende ser exhaustivo: cubre lo que
 * aparece en la práctica actual del repositorio y de su caso de estudio, y
 * ampliarlo es un cambio de una línea.
 */
export const VENDOR_LEXICON =
    /\b(?:claude|codex|chatgpt|gpt-[0-9]|openai|anthropic|gemini|antigravity|copilot|cursor|llama|mistral|ollama|agnara)\b/i;

function equalList(left = [], right = []) {
    return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

/** Compara los metadatos de protocolo sin depender del orden de las claves. */
export function equalProtocolMetadata(left, right) {
    if (!left || !right) return !left && !right;
    if (['code', 'maturity', 'lastValidated'].some((field) => left[field] !== right[field])) return false;
    return ['actors', 'dependsOn', 'observedIn']
        .every((field) => equalList(left[field] || [], right[field] || []));
}

/** Devuelve el cuerpo sin las secciones exentas, para verificar neutralidad. */
export function normativeBody(body) {
    return String(body)
        .split(/^##\s+/m)
        .filter((section, index) => index === 0
            || !PROTOCOL_NEUTRAL_EXEMPT.some((heading) => section.startsWith(heading)))
        .join('\n');
}

/** Nombre de proveedor filtrado al cuerpo normativo, o null si es neutral. */
export function vendorLeak(body) {
    const match = normativeBody(body).match(VENDOR_LEXICON);
    return match ? match[0] : null;
}

/** Encabezados de nivel dos presentes en el cuerpo. */
export function sectionHeadings(body) {
    return new Set([...String(body).matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim()));
}

/** Secciones obligatorias ausentes. */
export function missingSections(body) {
    const headings = sectionHeadings(body);
    return PROTOCOL_REQUIRED_SECTIONS.filter((section) => !headings.has(section));
}

/**
 * Incoherencias entre la madurez declarada y la evidencia declarada.
 * Devuelve `{errors, warnings}` con mensajes ya redactados.
 */
export function maturityIssues(meta) {
    const errors = [];
    const warnings = [];
    if (!meta) return {errors: ['sin metadatos de protocolo'], warnings};

    if (!PROTOCOL_MATURITY.includes(meta.maturity)) {
        errors.push(`madurez fuera del vocabulario de AFP-000: ${meta.maturity}`);
    }
    const observed = meta.observedIn || [];
    if (meta.maturity !== 'proposed' && PROTOCOL_MATURITY.includes(meta.maturity) && !observed.length) {
        errors.push(`madurez ${meta.maturity} sin observedIn; una afirmación así exige evidencia`);
    }
    if (meta.maturity === 'proposed' && observed.length) {
        warnings.push('declara observedIn pero sigue en proposed; revisa si corresponde promoverlo');
    }
    return {errors, warnings};
}

/**
 * Ciclos en el grafo `dependsOn`. Recibe un mapa de código a metadatos y
 * devuelve las trazas de cada ciclo encontrado.
 */
export function dependencyCycles(byCode) {
    const cycles = [];
    const state = new Map();

    const visit = (code, trail) => {
        if (state.get(code) === 'done') return;
        if (state.get(code) === 'open') {
            cycles.push([...trail, code]);
            return;
        }
        state.set(code, 'open');
        for (const dependency of byCode.get(code)?.dependsOn || []) {
            if (byCode.has(dependency)) visit(dependency, [...trail, code]);
        }
        state.set(code, 'done');
    };

    for (const code of byCode.keys()) visit(code, []);
    return cycles;
}
