export interface KronForgeDomain {
    id: string;
    title: string;
    summary: string;
    index: string;
}

export interface KronForgeSpecRef {
    spec: string;
    version?: string;
    url: string;
    verified: string;
}

export interface KronForgeAsset {
    id: string;
    title: string;
    summary: string;
    type: string;
    domain: string;
    category: string;
    level: 'foundation' | 'intermediate' | 'advanced';
    status: 'draft' | 'stable' | 'deprecated';
    version: string;
    compatibility: string;
    models: string[];
    agents: string[];
    language: string;
    author: string;
    license: string;
    lastModified: string;
    tags: string[];
    dependencies: string[];
    related: string[];
    inputs: string[];
    outputs: string[];
    examples: string[];
    estimatedTime: string;
    complexity: string;
    useCases: string[];
    path: string;
    specRefs?: KronForgeSpecRef[];
    [key: string]: unknown;
}

export interface KronForgeDetailedAsset extends KronForgeAsset {
    fullPath: string;
}

export interface KronForgeCatalog {
    $schema: string;
    schemaVersion: number;
    frameworkVersion: string;
    lastUpdated: string;
    metadataDefaults: Record<string, unknown>;
    typeDefinitions: Array<Record<string, unknown>>;
    domains: KronForgeDomain[];
    assets: KronForgeAsset[];
    learningPaths: Array<Record<string, unknown>>;
}

export interface KronForgeAssetFilters {
    domain?: string;
    type?: string;
    status?: string;
    tag?: string;
    query?: string;
}

export interface KronForgePackageMeta {
    name: string;
    version: string;
    description: string;
    license: string;
    [key: string]: unknown;
}

export declare const PACKAGE_ROOT: string;
export declare const CATALOG_PATH: string;
export declare const MASTER_PROMPT_PATH: string;
export declare const LLMS_TXT_PATH: string;

export declare function loadPackageMeta(): Promise<KronForgePackageMeta>;
export declare function loadCatalog(): Promise<KronForgeCatalog>;
export declare function listDomains(): Promise<KronForgeDomain[]>;
export declare function listAssets(filters?: KronForgeAssetFilters): Promise<KronForgeAsset[]>;
export declare function getAsset(id: string): Promise<KronForgeDetailedAsset | null>;
export declare function readAssetMarkdown(id: string): Promise<string>;
export declare function readMasterPrompt(): Promise<string>;
export declare function readLlmsTxt(): Promise<string>;

export interface KronForgeDetectionReport {
    root: string;
    name: string;
    isGitRepo: boolean;
    languages: string[];
    frameworks: string[];
    packageManagers: string[];
    commands: Record<string, string>;
    ci: {githubActions: boolean; gitlabCi: boolean};
    agentFiles: string[];
    kronforge: {installed: boolean; profile: string | null; packs: string[]; previewStore: boolean};
    signals: Record<string, boolean>;
    recommendations: {profile: string; packs: string[]};
}

export interface KronForgePackSummary {
    id: string;
    title: string;
    summary: string;
    fileCount: number;
}

export interface KronForgeProfile {
    id: string;
    title: string;
    summary: string;
    packs: string[];
    defaultAdapters: string[];
}

export interface KronForgeInstallOptions {
    init?: boolean;
    update?: boolean;
    profile?: string;
    packs?: string[];
    adapters?: string[];
    dryRun?: boolean;
    force?: boolean;
}

export declare function detectRepository(targetDir?: string): Promise<KronForgeDetectionReport>;
export declare function listAvailablePacks(): KronForgePackSummary[];
export declare function listAvailableProfiles(): KronForgeProfile[];
export declare function listSupportedAdapters(): Array<{id: string; target: string; title: string}>;
export declare function planInstall(targetDir?: string, options?: KronForgeInstallOptions): Promise<Record<string, unknown>>;
export declare function applyInstall(targetDir?: string, options?: KronForgeInstallOptions): Promise<Record<string, unknown>>;
export declare function planUninstall(targetDir: string, packIds: string[], options?: {force?: boolean}): Promise<Record<string, unknown>>;
export declare function applyUninstall(targetDir: string, packIds: string[], options?: {dryRun?: boolean; force?: boolean}): Promise<Record<string, unknown>>;
export declare function rollbackInstall(targetDir?: string, options?: {dryRun?: boolean}): Promise<Record<string, unknown>>;
export declare function runDoctor(targetDir?: string): Promise<Record<string, unknown>>;
