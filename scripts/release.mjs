#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log(`KronForge — asistente de release

Uso:
  npm run release -- <version> [--push] [--dry-run]

Ejemplos:
  npm run release -- 3.4.3
  npm run release -- 3.4.3 --push

Qué hace:
  1. Actualiza la versión en package.json, library/catalog.json, index.html,
     assets/js/paths.js, README.md y docs/CHANGELOG.md.
  2. Ejecuta npm run build y npm run quality.
  3. Crea el commit y el tag git v<version>.
  4. Con --push, sube main y v<version> a origin para disparar npm OIDC.
`);
    process.exit(0);
}

const nextVersion = args.find((arg) => !arg.startsWith('-'));
const shouldPush = args.includes('--push');
const dryRun = args.includes('--dry-run');

if (!nextVersion || !/^\d+\.\d+\.\d+$/.test(nextVersion)) {
    console.error(`Error: versión inválida "${nextVersion || ''}". Usa SemVer X.Y.Z (ejemplo: 3.4.3).`);
    process.exit(1);
}

function run(command, commandArgs, options = {}) {
    let executable = command;
    let finalArgs = commandArgs;
    if (command === 'npm') {
        if (process.env.npm_execpath && process.env.npm_execpath.endsWith('.js')) {
            executable = process.execPath;
            finalArgs = [process.env.npm_execpath, ...commandArgs];
        } else if (process.platform === 'win32') {
            executable = 'cmd.exe';
            finalArgs = ['/d', '/s', '/c', 'npm.cmd', ...commandArgs];
        }
    }
    const result = spawnSync(executable, finalArgs, {
        cwd: ROOT,
        stdio: options.capture ? 'pipe' : 'inherit',
        encoding: 'utf8'
    });
    if (result.status !== 0) {
        if (options.capture && result.stderr) console.error(result.stderr.trim());
        process.exit(result.status || 1);
    }
    return result.stdout || '';
}

const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
const currentVersion = pkg.version;

if (currentVersion === nextVersion) {
    console.error(`Error: el proyecto ya está en la versión ${currentVersion}.`);
    process.exit(1);
}

const status = run('git', ['status', '--porcelain'], {capture: true}).trim();
if (status && !dryRun) {
    console.error('Error: el árbol Git tiene cambios sin confirmar. Haz commit o stash antes de ejecutar release.');
    process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const tagName = `v${nextVersion}`;

if (dryRun) {
    console.log(`[dry-run] Actualizaría ${currentVersion} -> ${nextVersion} (${today}) y crearía el tag ${tagName}.`);
    process.exit(0);
}

async function replaceInFile(relativePath, transform) {
    const fullPath = path.join(ROOT, relativePath);
    const before = await readFile(fullPath, 'utf8');
    const after = transform(before);
    if (before === after) {
        throw new Error(`No se detectaron cambios al actualizar ${relativePath}`);
    }
    await writeFile(fullPath, after, 'utf8');
}

const escapedCurrent = currentVersion.replaceAll('.', '\\.');

await replaceInFile('package.json', (text) =>
    text.replace(new RegExp(`"version":\\s*"${escapedCurrent}"`), `"version": "${nextVersion}"`)
);

await replaceInFile('library/catalog.json', (text) =>
    text
        .replace(new RegExp(`"frameworkVersion":\\s*"${escapedCurrent}"`), `"frameworkVersion": "${nextVersion}"`)
        .replace(/"lastUpdated":\s*"\d{4}-\d{2}-\d{2}"/, `"lastUpdated": "${today}"`)
);

await replaceInFile('index.html', (text) =>
    text
        .replace(new RegExp(`\\?v=${escapedCurrent}`, 'g'), `?v=${nextVersion}`)
        .replace(new RegExp(`· v${escapedCurrent}`, 'g'), `· v${nextVersion}`)
);

await replaceInFile('assets/js/paths.js', (text) =>
    text.replace(new RegExp(`SITE_VERSION = '${escapedCurrent}'`), `SITE_VERSION = '${nextVersion}'`)
);

await replaceInFile('README.md', (text) =>
    text.replace(new RegExp(`KronForge ${escapedCurrent}`), `KronForge ${nextVersion}`)
);

await replaceInFile('docs/CHANGELOG.md', (text) => {
    if (text.includes(`## [${nextVersion}]`)) return text;
    return text.replace(
        /^## \[(\d+\.\d+\.\d+)\]/m,
        `## [${nextVersion}] - ${today}\n\n### Modificado\n\n- Release ${nextVersion} preparada con \`npm run release\` y desplegada por npm Trusted Publishing (OIDC).\n\n## [$1]`
    );
});

run('npm', ['run', 'build']);
run('npm', ['run', 'quality']);

run('git', [
    'add',
    'package.json',
    'library/catalog.json',
    'index.html',
    'assets/js/paths.js',
    'README.md',
    'docs/CHANGELOG.md',
    'llms.txt',
    'skills',
    'library/learning-guidance.json'
]);
run('git', ['commit', '-m', `chore(release): ${tagName}`]);
run('git', ['tag', tagName]);

if (shouldPush) {
    run('git', ['push', 'origin', 'main', tagName]);
    console.log(`\n✓ Release ${tagName} enviada a GitHub. Sigue el despliegue en:`);
    console.log('  https://github.com/Blandskron/KronForge/actions');
} else {
    console.log(`\n✓ Commit y tag ${tagName} creados localmente.`);
    console.log(`  Para desplegar a npm ejecuta: git push origin main ${tagName}`);
}
