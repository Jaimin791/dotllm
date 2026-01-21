/**
 * @fileoverview IDE and AI tool detection
 * @module analyzers/ide
 * 
 * Detects which IDE or AI coding assistant is being used
 * to generate tool-specific configuration files.
 */

import { join } from 'path';
import { pathExists } from '../utils/fs.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Supported IDEs and AI coding assistants.
 */
export type IDE =
    | 'cursor'
    | 'vscode'
    | 'vscode-copilot'
    | 'claude-code'
    | 'antigravity'
    | 'windsurf'
    | 'zed'
    | 'unknown';

/**
 * Information about a detected IDE.
 */
export interface IDEInfo {
    /** The detected IDE */
    ide: IDE;

    /** Human-readable name */
    displayName: string;

    /** Path to IDE-specific config directory or file */
    configPath?: string;

    /** Whether the IDE supports custom rules */
    supportsRules: boolean;

    /** The filename for rules in this IDE */
    rulesFileName?: string;
}

/**
 * IDE detection result with all detected IDEs.
 */
export interface IDEDetectionResult {
    /** Primary/most likely IDE being used */
    primary: IDE;

    /** All detected IDEs (user might have multiple installed) */
    detected: IDE[];

    /** Detailed info for each detected IDE */
    details: IDEInfo[];
}

// ============================================================================
// Detection Patterns
// ============================================================================

/**
 * IDE configuration files and directories.
 */
const IDE_INDICATORS: Record<IDE, { patterns: string[]; displayName: string; rulesFile?: string }> = {
    cursor: {
        patterns: ['.cursorrules', '.cursor/', '.cursorignore'],
        displayName: 'Cursor',
        rulesFile: '.cursorrules',
    },
    'vscode-copilot': {
        patterns: ['.github/copilot-instructions.md', '.vscode/'],
        displayName: 'VS Code + GitHub Copilot',
        rulesFile: '.github/copilot-instructions.md',
    },
    vscode: {
        patterns: ['.vscode/', '.vscode/settings.json'],
        displayName: 'Visual Studio Code',
        rulesFile: undefined, // No specific rules file
    },
    'claude-code': {
        patterns: ['CLAUDE.md', '.claude/', 'claude.md'],
        displayName: 'Claude Code (Anthropic)',
        rulesFile: 'CLAUDE.md',
    },
    antigravity: {
        patterns: ['.gemini/', '.gemini/settings.json', '.agent/'],
        displayName: 'Antigravity (Google)',
        rulesFile: '.gemini/CODING_RULES.md',
    },
    windsurf: {
        patterns: ['.windsurfrules', '.windsurf/'],
        displayName: 'Windsurf (Codeium)',
        rulesFile: '.windsurfrules',
    },
    zed: {
        patterns: ['.zed/', '.zed/settings.json'],
        displayName: 'Zed Editor',
        rulesFile: undefined,
    },
    unknown: {
        patterns: [],
        displayName: 'Unknown IDE',
        rulesFile: undefined,
    },
};

/**
 * Priority order for IDE detection (most specific first).
 */
const IDE_PRIORITY: IDE[] = [
    'cursor',
    'claude-code',
    'antigravity',
    'windsurf',
    'vscode-copilot',
    'vscode',
    'zed',
];

// ============================================================================
// Detection Functions
// ============================================================================

/**
 * Detects which IDE(s) are being used in a project.
 * 
 * Detection is based on:
 * - IDE-specific config files/directories
 * - Environment variables
 * - Known file patterns
 * 
 * @param rootPath - Absolute path to the project root
 * @returns IDE detection result with primary and all detected IDEs
 * 
 * @example
 * ```typescript
 * const result = detectIDE('/path/to/project');
 * console.log(`Primary IDE: ${result.primary}`);
 * console.log(`All detected: ${result.detected.join(', ')}`);
 * ```
 */
export function detectIDE(rootPath: string): IDEDetectionResult {
    const detected: IDE[] = [];
    const details: IDEInfo[] = [];

    for (const ide of IDE_PRIORITY) {
        const indicator = IDE_INDICATORS[ide];

        // Check if any of the IDE's patterns exist
        const hasIndicator = indicator.patterns.some(pattern =>
            pathExists(join(rootPath, pattern))
        );

        if (hasIndicator) {
            detected.push(ide);
            details.push({
                ide,
                displayName: indicator.displayName,
                configPath: indicator.patterns[0],
                supportsRules: !!indicator.rulesFile,
                rulesFileName: indicator.rulesFile,
            });
        }
    }

    // Also check environment variables for IDE hints
    const envIDE = detectIDEFromEnvironment();
    if (envIDE && !detected.includes(envIDE)) {
        detected.push(envIDE);
        const indicator = IDE_INDICATORS[envIDE];
        details.push({
            ide: envIDE,
            displayName: indicator.displayName,
            supportsRules: !!indicator.rulesFile,
            rulesFileName: indicator.rulesFile,
        });
    }

    // Determine primary IDE (first detected, or unknown)
    const primary = detected.length > 0 ? detected[0] : 'unknown';

    return {
        primary,
        detected,
        details,
    };
}

/**
 * Detects IDE from environment variables.
 */
function detectIDEFromEnvironment(): IDE | null {
    // Check common IDE environment variables
    const termProgram = process.env.TERM_PROGRAM?.toLowerCase() ?? '';
    const vscodeIpc = process.env.VSCODE_IPC_HOOK ?? '';
    const cursorIpc = process.env.CURSOR_IPC_HOOK ?? '';

    if (cursorIpc || termProgram.includes('cursor')) {
        return 'cursor';
    }

    if (vscodeIpc || termProgram.includes('vscode')) {
        // Check if Copilot is likely installed
        return 'vscode-copilot';
    }

    // Check for Antigravity/Gemini
    if (process.env.GEMINI_API_KEY || process.env.ANTIGRAVITY_ENABLED) {
        return 'antigravity';
    }

    return null;
}

/**
 * Gets the rules file path for a specific IDE.
 * 
 * @param rootPath - Project root path
 * @param ide - Target IDE
 * @returns Full path to the rules file, or null if IDE doesn't support rules
 */
export function getRulesFilePath(rootPath: string, ide: IDE): string | null {
    const rulesFile = IDE_INDICATORS[ide]?.rulesFile;
    if (!rulesFile) {
        return null;
    }
    return join(rootPath, rulesFile);
}

/**
 * Gets all supported IDEs that support custom rules.
 */
export function getSupportedIDEs(): IDEInfo[] {
    return Object.entries(IDE_INDICATORS)
        .filter(([_, indicator]) => indicator.rulesFile)
        .map(([ide, indicator]) => ({
            ide: ide as IDE,
            displayName: indicator.displayName,
            supportsRules: true,
            rulesFileName: indicator.rulesFile,
        }));
}

/**
 * Checks if a specific IDE is detected.
 */
export function hasIDE(rootPath: string, ide: IDE): boolean {
    const result = detectIDE(rootPath);
    return result.detected.includes(ide);
}
