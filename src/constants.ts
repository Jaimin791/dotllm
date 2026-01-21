/**
 * @fileoverview Application-wide constants
 * @module constants
 * 
 * Centralizes all magic strings and configuration values
 * to ensure consistency and ease of maintenance.
 */

/**
 * Directories that should always be ignored during scanning.
 * These are commonly generated, cached, or dependency directories
 * that don't contain relevant source code.
 */
export const IGNORED_DIRECTORIES = Object.freeze([
    // JavaScript/Node.js
    'node_modules',
    '.npm',
    '.yarn',
    '.pnpm-store',

    // Build outputs
    'dist',
    'build',
    'out',
    '.next',
    '.nuxt',
    '.output',
    '.svelte-kit',
    '.astro',

    // Version control
    '.git',
    '.svn',
    '.hg',

    // Python
    '__pycache__',
    '.pytest_cache',
    '.mypy_cache',
    '.ruff_cache',
    'venv',
    '.venv',
    'env',
    '.env',
    '.tox',
    'eggs',
    '*.egg-info',

    // Rust/Java
    'target',

    // Go/PHP
    'vendor',

    // Java
    '.gradle',
    '.m2',

    // IDE/Editor
    '.idea',
    '.vscode',

    // Testing/Coverage
    'coverage',
    '.nyc_output',
    'htmlcov',

    // Misc
    '.turbo',
    '.cache',
    '.parcel-cache',
    'tmp',
    'temp',
] as const);

/**
 * Files that should always be ignored during scanning.
 */
export const IGNORED_FILES = Object.freeze([
    '.DS_Store',
    'Thumbs.db',
    '.gitkeep',
    '*.pyc',
    '*.pyo',
    '*.class',
] as const);

/**
 * Important dot files/directories that should NOT be ignored
 * even though they start with a dot.
 */
export const IMPORTANT_DOT_FILES = Object.freeze([
    '.github',
    '.gitlab',
    '.circleci',
    '.eslintrc',
    '.prettierrc',
    '.editorconfig',
    '.env.example',
    '.env.sample',
    '.dockerignore',
    '.gitignore',
    '.npmrc',
    '.nvmrc',
    '.node-version',
    '.python-version',
    '.ruby-version',
    '.tool-versions',
] as const);

/**
 * Maximum depth for directory scanning.
 * Prevents excessive memory usage on very deep directory structures.
 */
export const MAX_SCAN_DEPTH = 10;

/**
 * Default depth for folder structure display.
 */
export const DEFAULT_DISPLAY_DEPTH = 4;

/**
 * Maximum number of dependencies to display in context document.
 */
export const MAX_DISPLAYED_DEPENDENCIES = 15;

/**
 * Maximum number of folder responsibilities to display.
 */
export const MAX_DISPLAYED_FOLDERS = 20;

/**
 * Output file names.
 */
export const OUTPUT_FILES = Object.freeze({
    RULES: 'AI_CODING_RULES.md',
    CONTEXT: 'AI_PROJECT_CONTEXT.md',
} as const);

/**
 * Package metadata.
 */
export const PACKAGE_INFO = Object.freeze({
    NAME: 'dotai',
    NPM_URL: 'https://www.npmjs.com/package/dotai',
    REPO_URL: 'https://github.com/Jaimin791/dotai',
} as const);
