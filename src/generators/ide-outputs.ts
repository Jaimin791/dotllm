/**
 * @fileoverview IDE-specific output generators
 * @module generators/ide-outputs
 * 
 * Generates IDE-specific configuration files for:
 * - Cursor (.cursor/rules/rules.md - new convention, .cursorrules - legacy)
 * - VS Code + Copilot (.github/copilot-instructions.md)
 * - Claude Code (CLAUDE.md at project root)
 * - Antigravity (GEMINI.md at project root)
 * - Codex (AGENTS.md - open standard, cascading per directory)
 * - Windsurf (.windsurfrules)
 * 
 * IMPORTANT: File paths must match what each tool ACTUALLY looks for!
 */

import type { AnalysisResult } from '../types/index.js';
import type { IDE } from '../analyzers/ide.js';
import { getApplicableRules } from '../rules/index.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Generated IDE-specific output.
 */
export interface IDEOutput {
    /** Target IDE */
    ide: IDE;

    /** Relative path to write the file */
    filePath: string;

    /** Generated content */
    content: string;

    /** Human-readable description */
    description: string;
}

// ============================================================================
// Cursor Generator
// ============================================================================

/**
 * Generates rules for Cursor IDE.
 * 
 * Cursor now uses the `.cursor/rules/` directory (new convention).
 * Files can be .md or .mdc (with frontmatter for globs).
 * Legacy: .cursorrules at project root still works.
 */
export function generateCursorRules(analysis: AnalysisResult): IDEOutput {
    const rules = getApplicableRules(analysis);
    const lines: string[] = [];

    // Frontmatter for .mdc format (optional, but useful)
    lines.push('---');
    lines.push(`description: Project rules for ${analysis.projectName}`);
    lines.push('---');
    lines.push('');

    // Header
    lines.push('# Cursor Rules');
    lines.push('');
    lines.push('You are an expert developer working on this codebase.');
    lines.push('Follow these rules strictly when generating or modifying code.');
    lines.push('');

    // Project context
    lines.push('## Project Context');
    lines.push('');
    lines.push(`- Project: ${analysis.projectName}`);
    lines.push(`- Languages: ${analysis.languages.join(', ')}`);
    if (analysis.frameworks.length > 0) {
        lines.push(`- Frameworks: ${analysis.frameworks.join(', ')}`);
    }
    if (analysis.packageManagers.length > 0) {
        lines.push(`- Package Manager: ${analysis.packageManagers[0]}`);
    }
    lines.push('');

    // Rules by category
    for (const rule of rules) {
        lines.push(`## ${rule.title}`);
        lines.push('');

        for (const item of rule.rules) {
            lines.push(`- ${item.text}`);
        }
        lines.push('');

        if (rule.antiPatterns && rule.antiPatterns.length > 0) {
            lines.push('### DO NOT');
            lines.push('');
            for (const anti of rule.antiPatterns) {
                lines.push(`- ${anti.text}`);
            }
            lines.push('');
        }
    }

    // Footer
    lines.push('---');
    lines.push('');
    lines.push('When in doubt, ask for clarification before making changes.');

    return {
        ide: 'cursor',
        filePath: '.cursor/rules/rules.mdc',  // New convention with .mdc extension
        content: lines.join('\n'),
        description: 'Cursor IDE rules file (new .cursor/rules/ convention)',
    };
}

// ============================================================================
// VS Code + GitHub Copilot Generator
// ============================================================================

/**
 * Generates .github/copilot-instructions.md for GitHub Copilot.
 * 
 * Copilot reads instructions from `.github/copilot-instructions.md`.
 */
export function generateCopilotInstructions(analysis: AnalysisResult): IDEOutput {
    const rules = getApplicableRules(analysis);
    const lines: string[] = [];

    // Header with YAML front matter (Copilot supports this)
    lines.push('---');
    lines.push(`project: ${analysis.projectName}`);
    lines.push(`generated: ${new Date().toISOString().split('T')[0]}`);
    lines.push('---');
    lines.push('');
    lines.push('# GitHub Copilot Instructions');
    lines.push('');
    lines.push('These instructions guide GitHub Copilot when generating code for this project.');
    lines.push('');

    // Project overview
    lines.push('## Project Overview');
    lines.push('');
    lines.push(`This is a ${analysis.languages.join('/')} project`);
    if (analysis.frameworks.length > 0) {
        lines.push(`using ${analysis.frameworks.join(', ')}.`);
    }
    lines.push('');

    // Code style preferences
    lines.push('## Code Style');
    lines.push('');

    for (const rule of rules) {
        lines.push(`### ${rule.title}`);
        lines.push('');
        for (const item of rule.rules) {
            lines.push(`- ${item.text}`);
        }
        lines.push('');
    }

    // Anti-patterns section
    const allAntiPatterns = rules.flatMap(r => r.antiPatterns || []);
    if (allAntiPatterns.length > 0) {
        lines.push('## Patterns to Avoid');
        lines.push('');
        for (const anti of allAntiPatterns.slice(0, 20)) { // Limit to top 20
            lines.push(`- ❌ ${anti.text}`);
        }
        lines.push('');
    }

    return {
        ide: 'vscode-copilot',
        filePath: '.github/copilot-instructions.md',
        content: lines.join('\n'),
        description: 'GitHub Copilot instructions',
    };
}

// ============================================================================
// Claude Code Generator
// ============================================================================

/**
 * Generates CLAUDE.md for Claude Code (Anthropic).
 * 
 * Claude Code reads project instructions from `CLAUDE.md` at the project root.
 */
export function generateClaudeRules(analysis: AnalysisResult): IDEOutput {
    const rules = getApplicableRules(analysis);
    const lines: string[] = [];

    // Header
    lines.push('# CLAUDE.md');
    lines.push('');
    lines.push('This file provides project-specific guidance for Claude Code.');
    lines.push('');

    // Project summary
    lines.push('## Project Summary');
    lines.push('');
    lines.push(`**${analysis.projectName}**`);
    lines.push('');
    lines.push(`- **Languages:** ${analysis.languages.join(', ')}`);
    if (analysis.frameworks.length > 0) {
        lines.push(`- **Frameworks:** ${analysis.frameworks.join(', ')}`);
    }
    if (analysis.testFrameworks.length > 0) {
        lines.push(`- **Testing:** ${analysis.testFrameworks.join(', ')}`);
    }
    lines.push('');

    // Build/Run commands (if detectable)
    lines.push('## Common Commands');
    lines.push('');
    lines.push('```bash');
    if (analysis.packageManagers.includes('npm') ||
        analysis.packageManagers.includes('pnpm') ||
        analysis.packageManagers.includes('yarn')) {
        const pm = analysis.packageManagers[0];
        lines.push(`${pm} install    # Install dependencies`);
        lines.push(`${pm} run dev    # Start development server`);
        lines.push(`${pm} run build  # Build for production`);
        lines.push(`${pm} run test   # Run tests`);
    } else if (analysis.packageManagers.includes('cargo')) {
        lines.push('cargo build   # Build the project');
        lines.push('cargo run     # Run the project');
        lines.push('cargo test    # Run tests');
    } else if (analysis.packageManagers.includes('go')) {
        lines.push('go build      # Build the project');
        lines.push('go run .      # Run the project');
        lines.push('go test ./... # Run tests');
    } else if (analysis.languages.includes('python')) {
        lines.push('pip install -r requirements.txt  # Install deps');
        lines.push('python main.py                   # Run');
        lines.push('pytest                           # Run tests');
    }
    lines.push('```');
    lines.push('');

    // Coding rules
    lines.push('## Coding Standards');
    lines.push('');

    for (const rule of rules) {
        lines.push(`### ${rule.title}`);
        lines.push('');
        for (const item of rule.rules) {
            lines.push(`- ${item.text}`);
        }
        lines.push('');

        if (rule.antiPatterns && rule.antiPatterns.length > 0) {
            lines.push('**Avoid:**');
            for (const anti of rule.antiPatterns) {
                lines.push(`- ❌ ${anti.text}`);
            }
            lines.push('');
        }
    }

    // Critical paths
    if (analysis.criticalPaths.length > 0) {
        lines.push('## Critical Paths');
        lines.push('');
        lines.push('> ⚠️ These areas require careful review before changes.');
        lines.push('');
        for (const cp of analysis.criticalPaths.slice(0, 10)) {
            lines.push(`- **${cp.path}** (${cp.risk}) - ${cp.reason}`);
        }
        lines.push('');
    }

    return {
        ide: 'claude-code',
        filePath: 'CLAUDE.md',
        content: lines.join('\n'),
        description: 'Claude Code project instructions',
    };
}

// ============================================================================
// Antigravity (Google/Gemini) Generator
// ============================================================================

/**
 * Generates GEMINI.md for Antigravity (Google Gemini).
 * 
 * Antigravity reads project instructions from `GEMINI.md` at the project root.
 * The `.gemini/` directory is used for settings, not rules.
 */
export function generateAntigravityRules(analysis: AnalysisResult): IDEOutput {
    const rules = getApplicableRules(analysis);
    const lines: string[] = [];

    // Header
    lines.push('# GEMINI.md');
    lines.push('');
    lines.push('This file provides project-specific guidance for Antigravity (Google Gemini).');
    lines.push('');

    // Project context
    lines.push('## Project Context');
    lines.push('');
    lines.push('```yaml');
    lines.push(`name: ${analysis.projectName}`);
    lines.push(`languages: [${analysis.languages.join(', ')}]`);
    if (analysis.frameworks.length > 0) {
        lines.push(`frameworks: [${analysis.frameworks.join(', ')}]`);
    }
    if (analysis.packageManagers.length > 0) {
        lines.push(`package_manager: ${analysis.packageManagers[0]}`);
    }
    lines.push(`is_monorepo: ${analysis.isMonorepo}`);
    lines.push('```');
    lines.push('');

    // Rules sections
    lines.push('## Coding Standards');
    lines.push('');
    for (const rule of rules) {
        lines.push(`### ${rule.title}`);
        lines.push('');
        if (rule.description) {
            lines.push(rule.description);
            lines.push('');
        }

        for (const item of rule.rules) {
            lines.push(`- ${item.text}`);
        }
        lines.push('');

        if (rule.antiPatterns && rule.antiPatterns.length > 0) {
            lines.push('**Avoid:**');
            for (const anti of rule.antiPatterns) {
                lines.push(`- ❌ ${anti.text}`);
            }
            lines.push('');
        }
    }

    // Folder responsibilities
    if (analysis.folderResponsibilities.length > 0) {
        lines.push('## Folder Responsibilities');
        lines.push('');
        lines.push('| Path | Purpose | Team |');
        lines.push('|------|---------|------|');
        for (const fr of analysis.folderResponsibilities.slice(0, 15)) {
            lines.push(`| \`${fr.path}\` | ${fr.responsibility} | ${fr.ownership || '-'} |`);
        }
        lines.push('');
    }

    // Critical paths
    if (analysis.criticalPaths.length > 0) {
        lines.push('## Critical Paths (Handle with Care)');
        lines.push('');
        lines.push('> [!CAUTION]');
        lines.push('> Changes to these areas have high blast radius.');
        lines.push('');
        for (const cp of analysis.criticalPaths.slice(0, 10)) {
            lines.push(`- **${cp.path}** [${cp.risk}] - ${cp.reason}`);
        }
        lines.push('');
    }

    return {
        ide: 'antigravity',
        filePath: 'GEMINI.md',  // At project root, not .gemini/CODING_RULES.md!
        content: lines.join('\n'),
        description: 'Antigravity (Gemini) project instructions',
    };
}

// ============================================================================
// Windsurf Generator
// ============================================================================

/**
 * Generates .windsurfrules for Windsurf (Codeium).
 */
export function generateWindsurfRules(analysis: AnalysisResult): IDEOutput {
    const rules = getApplicableRules(analysis);
    const lines: string[] = [];

    // Windsurf uses a format similar to Cursor
    lines.push('# Windsurf Rules');
    lines.push('');
    lines.push(`Project: ${analysis.projectName}`);
    lines.push(`Stack: ${[...analysis.languages, ...analysis.frameworks].join(', ')}`);
    lines.push('');

    for (const rule of rules) {
        lines.push(`## ${rule.title}`);
        lines.push('');
        for (const item of rule.rules) {
            lines.push(`- ${item.text}`);
        }
        lines.push('');

        if (rule.antiPatterns && rule.antiPatterns.length > 0) {
            lines.push('Do not:');
            for (const anti of rule.antiPatterns) {
                lines.push(`- ${anti.text}`);
            }
            lines.push('');
        }
    }

    return {
        ide: 'windsurf',
        filePath: '.windsurfrules',
        content: lines.join('\n'),
        description: 'Windsurf (Codeium) rules file',
    };
}

// ============================================================================
// Codex (OpenAI) Generator - AGENTS.md Standard
// ============================================================================

/**
 * Generates AGENTS.md for Codex (OpenAI) and compatible tools.
 * 
 * AGENTS.md is an emerging open standard for AI coding agent instructions.
 * It's designed to be tool-agnostic and works with multiple AI assistants.
 * Files can be nested in subdirectories for cascading rules in monorepos.
 */
export function generateCodexRules(analysis: AnalysisResult): IDEOutput {
    const rules = getApplicableRules(analysis);
    const lines: string[] = [];

    // Header
    lines.push('# AGENTS.md');
    lines.push('');
    lines.push('> This file provides project-specific guidance for AI coding agents.');
    lines.push('> Compatible with OpenAI Codex, and other tools following the AGENTS.md standard.');
    lines.push('');

    // Project overview
    lines.push('## Project Overview');
    lines.push('');
    lines.push(`**${analysis.projectName}**`);
    lines.push('');
    lines.push(`- **Languages:** ${analysis.languages.join(', ')}`);
    if (analysis.frameworks.length > 0) {
        lines.push(`- **Frameworks:** ${analysis.frameworks.join(', ')}`);
    }
    if (analysis.packageManagers.length > 0) {
        lines.push(`- **Package Manager:** ${analysis.packageManagers[0]}`);
    }
    if (analysis.testFrameworks.length > 0) {
        lines.push(`- **Testing:** ${analysis.testFrameworks.join(', ')}`);
    }
    lines.push('');

    // Development commands
    lines.push('## Development');
    lines.push('');
    lines.push('```bash');
    if (analysis.packageManagers.includes('npm') ||
        analysis.packageManagers.includes('pnpm') ||
        analysis.packageManagers.includes('yarn')) {
        const pm = analysis.packageManagers[0];
        lines.push(`# Install dependencies`);
        lines.push(`${pm} install`);
        lines.push('');
        lines.push(`# Development`);
        lines.push(`${pm} run dev`);
        if (analysis.hasTests) {
            lines.push('');
            lines.push(`# Testing`);
            lines.push(`${pm} run test`);
        }
    } else if (analysis.packageManagers.includes('cargo')) {
        lines.push('cargo build   # Build');
        lines.push('cargo run     # Run');
        lines.push('cargo test    # Test');
    } else if (analysis.packageManagers.includes('go')) {
        lines.push('go build      # Build');
        lines.push('go run .      # Run');
        lines.push('go test ./... # Test');
    } else if (analysis.languages.includes('python')) {
        lines.push('pip install -r requirements.txt  # Install');
        lines.push('python main.py                   # Run');
        lines.push('pytest                           # Test');
    }
    lines.push('```');
    lines.push('');

    // Code style
    lines.push('## Code Style');
    lines.push('');
    for (const rule of rules) {
        lines.push(`### ${rule.title}`);
        lines.push('');
        for (const item of rule.rules) {
            lines.push(`- ${item.text}`);
        }
        lines.push('');

        if (rule.antiPatterns && rule.antiPatterns.length > 0) {
            lines.push('**Avoid:**');
            for (const anti of rule.antiPatterns) {
                lines.push(`- ❌ ${anti.text}`);
            }
            lines.push('');
        }
    }

    // Project structure (useful for agents to understand the codebase)
    if (analysis.folderResponsibilities.length > 0) {
        lines.push('## Project Structure');
        lines.push('');
        for (const fr of analysis.folderResponsibilities.slice(0, 15)) {
            lines.push(`- \`${fr.path}/\` - ${fr.responsibility}`);
        }
        lines.push('');
    }

    // PR/Commit guidelines
    lines.push('## Pull Requests');
    lines.push('');
    lines.push('- Write clear, descriptive commit messages');
    lines.push('- Keep PRs focused and reasonably sized');
    lines.push('- Ensure all tests pass before submitting');
    lines.push('- Update documentation when changing behavior');
    lines.push('');

    return {
        ide: 'codex',
        filePath: 'AGENTS.md',
        content: lines.join('\n'),
        description: 'AGENTS.md - Open standard for AI coding agents',
    };
}

// ============================================================================
// Main Generator
// ============================================================================

/**
 * Generates output for a specific IDE.
 * 
 * @param analysis - Analysis result
 * @param ide - Target IDE
 * @returns IDE-specific output or null if IDE not supported
 */
export function generateIDEOutput(analysis: AnalysisResult, ide: IDE): IDEOutput | null {
    switch (ide) {
        case 'cursor':
            return generateCursorRules(analysis);
        case 'vscode-copilot':
            return generateCopilotInstructions(analysis);
        case 'claude-code':
            return generateClaudeRules(analysis);
        case 'antigravity':
            return generateAntigravityRules(analysis);
        case 'codex':
            return generateCodexRules(analysis);
        case 'windsurf':
            return generateWindsurfRules(analysis);
        default:
            return null;
    }
}

/**
 * Generates outputs for all detected IDEs.
 * 
 * @param analysis - Analysis result
 * @param ides - Array of IDEs to generate for
 * @returns Array of IDE outputs
 */
export function generateAllIDEOutputs(analysis: AnalysisResult, ides: IDE[]): IDEOutput[] {
    const outputs: IDEOutput[] = [];

    for (const ide of ides) {
        const output = generateIDEOutput(analysis, ide);
        if (output) {
            outputs.push(output);
        }
    }

    return outputs;
}

/**
 * Gets a summary of what will be generated for an IDE.
 */
export function getIDEOutputSummary(ide: IDE): { fileName: string; description: string } | null {
    // IMPORTANT: These paths must match where each tool ACTUALLY looks for config!
    const mapping: Record<string, { fileName: string; description: string }> = {
        cursor: { fileName: '.cursor/rules/rules.mdc', description: 'Cursor IDE rules (new convention)' },
        'vscode-copilot': { fileName: '.github/copilot-instructions.md', description: 'GitHub Copilot instructions' },
        'claude-code': { fileName: 'CLAUDE.md', description: 'Claude Code project instructions' },
        antigravity: { fileName: 'GEMINI.md', description: 'Antigravity (Gemini) project instructions' },
        codex: { fileName: 'AGENTS.md', description: 'AGENTS.md - Open standard for AI agents' },
        windsurf: { fileName: '.windsurfrules', description: 'Windsurf (Codeium) rules' },
    };

    return mapping[ide] || null;
}
