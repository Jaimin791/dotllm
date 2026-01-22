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
 * IDE-specific output file paths.
 * IMPORTANT: These must match where each AI tool ACTUALLY looks for config!
 * 
 * We no longer generate arbitrary files like AI_CODING_RULES.md - instead,
 * we generate files in the exact locations each tool expects.
 */
export const IDE_OUTPUT_FILES = Object.freeze({
    CURSOR: '.cursor/rules/rules.mdc',      // New convention
    CURSOR_LEGACY: '.cursorrules',          // Legacy fallback
    CLAUDE_CODE: 'CLAUDE.md',               // At project root
    ANTIGRAVITY: 'GEMINI.md',               // At project root
    CODEX: 'AGENTS.md',                     // At project root (open standard)
    COPILOT: '.github/copilot-instructions.md',
    WINDSURF: '.windsurfrules',
} as const);

/**
 * Package metadata.
 */
export const PACKAGE_INFO = Object.freeze({
    NAME: 'dotllm',
    NPM_URL: 'https://www.npmjs.com/package/dotllm',
    REPO_URL: 'https://github.com/Jaimin791/dotllm',
} as const);
