import {access, lstat, readdir, readFile} from 'node:fs/promises';
import path from 'node:path';

async function fileExists(target) {
    try {
        await access(target);
        return true;
    } catch {
        return false;
    }
}

async function isDir(target) {
    try {
        const stat = await lstat(target);
        return stat.isDirectory();
    } catch {
        return false;
    }
}

async function readJsonSafe(target) {
    try {
        return JSON.parse(await readFile(target, 'utf8'));
    } catch {
        return null;
    }
}

async function readTextSafe(target) {
    try {
        return await readFile(target, 'utf8');
    } catch {
        return null;
    }
}

export async function detectRepository(targetDir = process.cwd()) {
    const root = path.resolve(targetDir);
    const rootEntries = await readdir(root).catch(() => []);
    const entrySet = new Set(rootEntries);

    const languages = new Set();
    const frameworks = new Set();
    const packageManagers = new Set();
    const commands = {};

    const pkg = await readJsonSafe(path.join(root, 'package.json'));
    if (pkg) {
        languages.add('javascript');
        if (entrySet.has('tsconfig.json') || pkg.devDependencies?.typescript || pkg.dependencies?.typescript) {
            languages.add('typescript');
        }
        if (entrySet.has('pnpm-lock.yaml')) packageManagers.add('pnpm');
        else if (entrySet.has('yarn.lock')) packageManagers.add('yarn');
        else if (entrySet.has('bun.lockb') || entrySet.has('bun.lock')) packageManagers.add('bun');
        else packageManagers.add('npm');

        const runner = packageManagers.has('pnpm') ? 'pnpm' : packageManagers.has('yarn') ? 'yarn' : packageManagers.has('bun') ? 'bun' : 'npm';
        const scripts = pkg.scripts || {};
        for (const key of ['test', 'lint', 'build', 'dev', 'start', 'validate', 'quality', 'typecheck']) {
            if (scripts[key]) {
                commands[key] = runner === 'npm' && key !== 'test' ? `npm run ${key}` : `${runner} ${key}`;
            }
        }
        const allDeps = {...pkg.dependencies, ...pkg.devDependencies};
        for (const [dep, label] of [
            ['next', 'nextjs'],
            ['react', 'react'],
            ['vue', 'vue'],
            ['svelte', 'svelte'],
            ['astro', 'astro'],
            ['express', 'express'],
            ['fastify', 'fastify'],
            ['@nestjs/core', 'nestjs']
        ]) {
            if (allDeps[dep]) frameworks.add(label);
        }
    }

    if (entrySet.has('pyproject.toml') || entrySet.has('requirements.txt') || entrySet.has('setup.py')) {
        languages.add('python');
        if (entrySet.has('uv.lock')) packageManagers.add('uv');
        else if (entrySet.has('poetry.lock')) packageManagers.add('poetry');
        else packageManagers.add('pip');
        const pyproject = await readTextSafe(path.join(root, 'pyproject.toml'));
        if (pyproject?.includes('pytest') || entrySet.has('pytest.ini')) {
            commands.test = commands.test || 'pytest';
        }
        if (pyproject?.includes('ruff')) {
            commands.lint = commands.lint || 'ruff check .';
        }
    }

    if (entrySet.has('go.mod')) {
        languages.add('go');
        packageManagers.add('go');
        commands.test = commands.test || 'go test ./...';
        commands.build = commands.build || 'go build ./...';
    }

    if (entrySet.has('Cargo.toml')) {
        languages.add('rust');
        packageManagers.add('cargo');
        commands.test = commands.test || 'cargo test';
        commands.build = commands.build || 'cargo build';
    }

    if (entrySet.has('pom.xml') || entrySet.has('build.gradle') || entrySet.has('build.gradle.kts')) {
        languages.add('java');
        if (entrySet.has('pom.xml')) {
            packageManagers.add('maven');
            commands.test = commands.test || 'mvn test';
        } else {
            packageManagers.add('gradle');
            commands.test = commands.test || './gradlew test';
        }
    }

    if (rootEntries.some((entry) => entry.endsWith('.csproj') || entry.endsWith('.sln'))) {
        languages.add('csharp');
        packageManagers.add('dotnet');
        commands.test = commands.test || 'dotnet test';
        commands.build = commands.build || 'dotnet build';
    }

    if (entrySet.has('composer.json')) {
        languages.add('php');
        packageManagers.add('composer');
    }

    if (entrySet.has('Gemfile')) {
        languages.add('ruby');
        packageManagers.add('bundler');
    }

    const hasDocker = entrySet.has('Dockerfile') || entrySet.has('docker-compose.yml') || entrySet.has('compose.yml');
    const isGitRepo = await fileExists(path.join(root, '.git'));
    const hasGitHubActions = await isDir(path.join(root, '.github', 'workflows'));
    const hasGitLabCi = entrySet.has('.gitlab-ci.yml');

    const agentFiles = [];
    for (const candidate of [
        'AGENTS.md',
        'CLAUDE.md',
        'GEMINI.md',
        '.github/copilot-instructions.md',
        '.cursorrules',
        '.cursor/rules',
        '.windsurfrules',
        'skills',
        'llms.txt'
    ]) {
        if (await fileExists(path.join(root, candidate))) {
            agentFiles.push(candidate);
        }
    }

    const kronforgeLock = await readJsonSafe(path.join(root, '.kronforge', 'lock.json'));
    const kronforgePreview = await fileExists(path.join(root, '.kronforge-preview', 'current.json'));

    const signals = {
        readme: entrySet.has('README.md'),
        license: entrySet.has('LICENSE') || entrySet.has('LICENSE.md'),
        securityPolicy: entrySet.has('SECURITY.md'),
        contributing: entrySet.has('CONTRIBUTING.md'),
        changelog: entrySet.has('CHANGELOG.md') || await fileExists(path.join(root, 'docs', 'CHANGELOG.md')),
        testsDir: entrySet.has('tests') || entrySet.has('test') || entrySet.has('__tests__') || Boolean(commands.test),
        ci: hasGitHubActions || hasGitLabCi,
        docker: hasDocker
    };

    let recommendedProfile = 'startup';
    if (signals.securityPolicy && signals.contributing && signals.ci) {
        recommendedProfile = 'enterprise';
    } else if (signals.license && (signals.contributing || signals.ci)) {
        recommendedProfile = 'opensource';
    }

    const recommendedPacks = ['agents-first', 'testing'];
    if (signals.ci || isGitRepo) recommendedPacks.push('gitflow');
    if (signals.docker || signals.securityPolicy || languages.size > 0) recommendedPacks.push('security');
    if (recommendedProfile === 'enterprise') {
        recommendedPacks.push('architecture', 'spec-driven', 'data-privacy');
    }

    return {
        root,
        name: pkg?.name || path.basename(root),
        isGitRepo,
        languages: [...languages],
        frameworks: [...frameworks],
        packageManagers: [...packageManagers],
        commands,
        ci: {
            githubActions: hasGitHubActions,
            gitlabCi: hasGitLabCi
        },
        agentFiles,
        kronforge: {
            installed: Boolean(kronforgeLock),
            profile: kronforgeLock?.profile || null,
            packs: (kronforgeLock?.packs || []).map((pack) => pack.id),
            previewStore: kronforgePreview
        },
        signals,
        recommendations: {
            profile: recommendedProfile,
            packs: [...new Set(recommendedPacks)]
        }
    };
}
