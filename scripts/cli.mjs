#!/usr/bin/env node
import {
    listAssets,
    listDomains,
    loadPackageMeta,
    readAssetMarkdown,
    readLlmsTxt,
    readMasterPrompt
} from './api.mjs';

const args = process.argv.slice(2);
const command = args[0] || 'help';

function readFlag(name) {
    const index = args.indexOf(name);
    if (index === -1) return undefined;
    return args[index + 1];
}

function hasFlag(name) {
    return args.includes(name);
}

function printHelp(version) {
    console.log(`KronForge v${version} — Agents-First Engineering Framework

Uso:
  kronforge prompt                             Imprime el prompt maestro canónico
  kronforge list [--domain <id>] [--type <t>]  Lista activos del catálogo (--json disponible)
  kronforge show <asset-id>                    Imprime el Markdown canónico de un activo
  kronforge domains [--json]                   Lista los dominios del framework
  kronforge llms                               Imprime llms.txt
  kronforge --version                          Muestra la versión instalada
  kronforge --help                             Muestra esta ayuda
`);
}

try {
    const pkg = await loadPackageMeta();

    if (command === '--version' || command === '-v' || command === 'version') {
        console.log(pkg.version);
    } else if (command === '--help' || command === '-h' || command === 'help') {
        printHelp(pkg.version);
    } else if (command === 'prompt') {
        process.stdout.write(await readMasterPrompt());
    } else if (command === 'llms') {
        process.stdout.write(await readLlmsTxt());
    } else if (command === 'domains') {
        const domains = await listDomains();
        if (hasFlag('--json')) {
            console.log(JSON.stringify(domains, null, 2));
        } else {
            for (const domain of domains) {
                console.log(`${domain.id}\t${domain.title}`);
            }
        }
    } else if (command === 'list') {
        const assets = await listAssets({
            domain: readFlag('--domain'),
            type: readFlag('--type'),
            status: readFlag('--status'),
            tag: readFlag('--tag'),
            query: readFlag('--query')
        });
        if (hasFlag('--json')) {
            console.log(JSON.stringify(assets, null, 2));
        } else {
            for (const asset of assets) {
                console.log(`${asset.id}\t[${asset.type}]\t${asset.domain}\t${asset.title}`);
            }
        }
    } else if (command === 'show') {
        const id = args[1];
        if (!id) {
            console.error('Error: indica el ID del activo. Ejemplo: kronforge show <asset-id>');
            process.exitCode = 1;
        } else {
            process.stdout.write(await readAssetMarkdown(id));
        }
    } else {
        console.error(`Comando desconocido: ${command}`);
        printHelp(pkg.version);
        process.exitCode = 1;
    }
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
}
