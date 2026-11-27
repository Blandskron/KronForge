#!/usr/bin/env node
import {
    applyInstall,
    applyUninstall,
    detectRepository,
    discoverContext,
    listAssets,
    listAvailablePacks,
    listAvailableProfiles,
    listDomains,
    loadPackageMeta,
    readAssetMarkdown,
    readLlmsTxt,
    readMasterPrompt,
    rollbackInstall,
    routeContext,
    runDoctor
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

function positionalArgs() {
    const values = [];
    for (let i = 1; i < args.length; i += 1) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            if (!['--json', '--dry-run', '--force', '--help', '-h', '--version', '-v'].includes(arg)) {
                i += 1;
            }
            continue;
        }
        values.push(arg);
    }
    return values;
}

function printHelp(version) {
    console.log(`KronForge v${version} — Universal Agents-First Engineering Framework

Uso — Conocimiento y catálogo:
  kronforge prompt                                     Imprime el prompt maestro canónico
  kronforge list [--domain <id>] [--type <t>] [--json] Lista activos del catálogo
  kronforge show <asset-id>                            Imprime el Markdown canónico de un activo
  kronforge domains [--json]                           Lista los dominios del framework
  kronforge packs [--json]                             Lista perfiles y packs de ingeniería disponibles
  kronforge llms                                       Imprime llms.txt

Uso — Operación sobre repositorios:
  kronforge detect [dir] [--json]                      Detecta stack, comandos reales, CI y agentes
  kronforge context [dir] [--task <t>] [--budget <n>]  Descubre contexto y enruta por presupuesto de tokens
  kronforge init [dir] [--profile <p>] [--adapters a,b] [--dry-run] [--force] [--json]
  kronforge install <pack...> [--dir <dir>] [--dry-run] [--force] [--json]
  kronforge update [dir] [--dry-run] [--force] [--json]
  kronforge uninstall <pack...> [--dir <dir>] [--dry-run] [--force] [--json]
  kronforge rollback [dir] [--dry-run] [--json]
  kronforge doctor [dir] [--json]                      Verifica integridad del lock y deriva local

Opciones generales:
  kronforge --version                                  Muestra la versión instalada
  kronforge --help                                     Muestra esta ayuda
`);
}

function printPlanSummary(result) {
    const {plan} = result;
    const mode = result.dryRun ? 'DRY-RUN (sin escritura)' : result.applied ? 'APLICADO' : 'BLOQUEADO';
    console.log(`KronForge ${plan.operation} [${mode}] · perfil: ${plan.profile || 'custom'}`);
    console.log(`  crear: ${plan.summary.create} · actualizar: ${plan.summary.update} · sin cambios: ${plan.summary.unchanged} · conflictos: ${plan.summary.conflict}`);
    for (const conflict of plan.conflicts) {
        console.error(`  ✗ Conflicto (${conflict.reason}): ${conflict.target}`);
    }
    if (result.blockedByConflicts) {
        console.error('Operación detenida para proteger archivos existentes/modificados. Usa --force solo si deseas sobrescribir.');
    }
}

try {
    const pkg = await loadPackageMeta();
    const positionals = positionalArgs();
    const asJson = hasFlag('--json');
    const dryRun = hasFlag('--dry-run');
    const force = hasFlag('--force');

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
        if (asJson) {
            console.log(JSON.stringify(domains, null, 2));
        } else {
            for (const domain of domains) console.log(`${domain.id}\t${domain.title}`);
        }
    } else if (command === 'packs') {
        const payload = {profiles: listAvailableProfiles(), packs: listAvailablePacks()};
        if (asJson) {
            console.log(JSON.stringify(payload, null, 2));
        } else {
            console.log('Perfiles:');
            for (const profile of payload.profiles) {
                console.log(`  ${profile.id}\t${profile.title} (${profile.packs.join(', ')})`);
            }
            console.log('\nPacks de ingeniería:');
            for (const pack of payload.packs) {
                console.log(`  ${pack.id}\t[${pack.fileCount} archivos]\t${pack.title}`);
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
        if (asJson) {
            console.log(JSON.stringify(assets, null, 2));
        } else {
            for (const asset of assets) {
                console.log(`${asset.id}\t[${asset.type}]\t${asset.domain}\t${asset.title}`);
            }
        }
    } else if (command === 'show') {
        const id = positionals[0];
        if (!id) {
            console.error('Error: indica el ID del activo. Ejemplo: kronforge show <asset-id>');
            process.exitCode = 1;
        } else {
            process.stdout.write(await readAssetMarkdown(id));
        }
    } else if (command === 'detect') {
        const report = await detectRepository(readFlag('--dir') || positionals[0] || process.cwd());
        if (asJson) {
            console.log(JSON.stringify(report, null, 2));
        } else {
            console.log(`Repositorio: ${report.name} (${report.root})`);
            console.log(`  Lenguajes: ${report.languages.join(', ') || 'ninguno detectado'}`);
            console.log(`  Gestores:  ${report.packageManagers.join(', ') || 'ninguno detectado'}`);
            console.log(`  Agentes:   ${report.agentFiles.join(', ') || 'ninguno detectado'}`);
            console.log(`  Perfil recomendado: ${report.recommendations.profile}`);
            console.log(`  Packs recomendados: ${report.recommendations.packs.join(', ')}`);
        }
    } else if (command === 'init') {
        const dir = readFlag('--dir') || positionals[0] || process.cwd();
        const adaptersRaw = readFlag('--adapters');
        const adapters = adaptersRaw ? adaptersRaw.split(',').map((item) => item.trim()).filter(Boolean) : undefined;
        const result = await applyInstall(dir, {
            init: true,
            profile: readFlag('--profile'),
            adapters,
            dryRun,
            force
        });
        if (asJson) console.log(JSON.stringify(result, null, 2));
        else printPlanSummary(result);
        if (result.blockedByConflicts) process.exitCode = 1;
    } else if (command === 'install') {
        const dir = readFlag('--dir') || process.cwd();
        if (!positionals.length) {
            console.error('Error: indica al menos un pack. Ejemplo: kronforge install security testing');
            process.exitCode = 1;
        } else {
            const result = await applyInstall(dir, {packs: positionals, dryRun, force});
            if (asJson) console.log(JSON.stringify(result, null, 2));
            else printPlanSummary(result);
            if (result.blockedByConflicts) process.exitCode = 1;
        }
    } else if (command === 'update') {
        const dir = readFlag('--dir') || positionals[0] || process.cwd();
        const result = await applyInstall(dir, {update: true, dryRun, force});
        if (asJson) console.log(JSON.stringify(result, null, 2));
        else printPlanSummary(result);
        if (result.blockedByConflicts) process.exitCode = 1;
    } else if (command === 'uninstall') {
        const dir = readFlag('--dir') || process.cwd();
        if (!positionals.length) {
            console.error('Error: indica al menos un pack a desinstalar. Ejemplo: kronforge uninstall security');
            process.exitCode = 1;
        } else {
            const result = await applyUninstall(dir, positionals, {dryRun, force});
            if (asJson) console.log(JSON.stringify(result, null, 2));
            else {
                console.log(`KronForge uninstall [${result.dryRun ? 'DRY-RUN' : 'APLICADO'}]`);
                console.log(`  eliminados: ${result.plan.operations.filter((op) => op.action === 'remove').length} · preservados por cambios locales: ${result.plan.preserved.length}`);
            }
        }
    } else if (command === 'rollback') {
        const dir = readFlag('--dir') || positionals[0] || process.cwd();
        const result = await rollbackInstall(dir, {dryRun});
        if (asJson) console.log(JSON.stringify(result, null, 2));
        else console.log(`KronForge rollback [${result.dryRun ? 'DRY-RUN' : 'RESTAURADO'}] · snapshot: ${result.snapshotId}`);
    } else if (command === 'context') {
        const dir = readFlag('--dir') || positionals[0] || process.cwd();
        const task = readFlag('--task');
        const budget = readFlag('--budget');
        const payload = task || budget
            ? await routeContext(dir, {task, budget: budget ? Number(budget) : undefined})
            : await discoverContext(dir);
        if (asJson) {
            console.log(JSON.stringify(payload, null, 2));
        } else if (payload.selected) {
            console.log(`Context routing · presupuesto: ${payload.budget} tokens · usados: ${payload.usedTokens} · ahorrados: ${payload.savedTokens}`);
            for (const item of payload.selected) {
                console.log(`  [+] ${item.path} (${item.tier}, ~${item.estimatedTokens} tokens)`);
            }
            if (payload.deferred.length) {
                console.log(`  Diferidos bajo demanda: ${payload.deferred.length} archivos`);
            }
        } else {
            console.log(`Context discovery · archivos: ${payload.summary.totalFiles} · tokens estimados: ${payload.summary.totalEstimatedTokens} (Tier 1: ${payload.summary.tier1Tokens})`);
            for (const warning of payload.warnings) {
                console.log(`  [WARN] ${warning.code}: ${warning.message}`);
            }
        }
    } else if (command === 'doctor') {
        const dir = readFlag('--dir') || positionals[0] || process.cwd();
        const report = await runDoctor(dir);
        if (asJson) {
            console.log(JSON.stringify(report, null, 2));
        } else {
            console.log(`KronForge doctor · estado: ${report.healthy ? 'OK' : 'CON ERRORES'} · perfil: ${report.profile || 'no inicializado'}`);
            console.log(`  packs: ${report.packs.join(', ') || 'ninguno'} · archivos verificados: ${report.checkedFiles.length}`);
            for (const issue of report.issues) {
                console.log(`  [${issue.severity.toUpperCase()}] ${issue.code}: ${issue.message}`);
            }
        }
        if (!report.healthy) process.exitCode = 1;
    } else {
        console.error(`Comando desconocido: ${command}`);
        printHelp(pkg.version);
        process.exitCode = 1;
    }
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
}
