/**
 * dotllm CLI
 *
 * Auto-generate AI-ready context files from any codebase.
 * Supports IDE-specific output for Cursor, Copilot, Claude Code, and more.
 */

import { Command } from 'commander';
import { initCommand, scanCommand } from './commands/index.js';
import type { CLIOptions } from '../types/config.js';

const program = new Command();

program
  .name('dotllm')
  .description('Auto-generate stack-aware AI coding rules from any codebase')
  .version('1.0.0');

// Default command (init)
program
  .command('init', { isDefault: true })
  .description('Analyze codebase and generate AI context files')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('-d, --dry-run', 'Preview detection without writing files', false)
  .option('-v, --verbose', 'Show detailed output', false)
  .option('-f, --force', 'Overwrite existing files', false)
  .option('--include-git', 'Include git history analysis', false)
  .option(
    '-i, --ide <ides>',
    'Generate IDE-specific rules (cursor,copilot,claude-code,antigravity,windsurf)',
    undefined
  )
  .action(async (options: CLIOptions) => {
    await initCommand(options);
  });

// Scan command
program
  .command('scan')
  .description('Scan codebase and show detected stack (no file generation)')
  .option('-v, --verbose', 'Show detailed output', false)
  .action(async (options: Partial<CLIOptions>) => {
    await scanCommand({
      output: '.',
      dryRun: true,
      verbose: options.verbose || false,
      force: false,
      includeGit: false,
    });
  });

// Update command (alias for init --force)
program
  .command('update')
  .description('Regenerate context files (overwrites existing)')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('-v, --verbose', 'Show detailed output', false)
  .option(
    '-i, --ide <ides>',
    'Generate IDE-specific rules (cursor,copilot,claude-code,antigravity,windsurf)',
    undefined
  )
  .action(async (options: Partial<CLIOptions>) => {
    await initCommand({
      output: options.output || '.',
      dryRun: false,
      verbose: options.verbose || false,
      force: true,
      includeGit: false,
      ide: options.ide,
    });
  });

// IDE-specific generation command
program
  .command('cursor')
  .description('Generate .cursorrules file for Cursor IDE')
  .option('-f, --force', 'Overwrite existing file', false)
  .action(async (options: { force: boolean }) => {
    await initCommand({
      output: '.',
      dryRun: false,
      verbose: false,
      force: options.force,
      includeGit: false,
      ide: 'cursor',
    });
  });

program
  .command('copilot')
  .description('Generate .github/copilot-instructions.md for GitHub Copilot')
  .option('-f, --force', 'Overwrite existing file', false)
  .action(async (options: { force: boolean }) => {
    await initCommand({
      output: '.',
      dryRun: false,
      verbose: false,
      force: options.force,
      includeGit: false,
      ide: 'vscode-copilot',
    });
  });

program
  .command('claude')
  .description('Generate CLAUDE.md for Claude Code')
  .option('-f, --force', 'Overwrite existing file', false)
  .action(async (options: { force: boolean }) => {
    await initCommand({
      output: '.',
      dryRun: false,
      verbose: false,
      force: options.force,
      includeGit: false,
      ide: 'claude-code',
    });
  });

program
  .command('gemini')
  .alias('antigravity')
  .description('Generate .gemini/CODING_RULES.md for Antigravity')
  .option('-f, --force', 'Overwrite existing file', false)
  .action(async (options: { force: boolean }) => {
    await initCommand({
      output: '.',
      dryRun: false,
      verbose: false,
      force: options.force,
      includeGit: false,
      ide: 'antigravity',
    });
  });

program
  .command('windsurf')
  .description('Generate .windsurfrules for Windsurf (Codeium)')
  .option('-f, --force', 'Overwrite existing file', false)
  .action(async (options: { force: boolean }) => {
    await initCommand({
      output: '.',
      dryRun: false,
      verbose: false,
      force: options.force,
      includeGit: false,
      ide: 'windsurf',
    });
  });

// Generate all IDE configs
program
  .command('all')
  .description('Generate rules for ALL supported IDEs')
  .option('-f, --force', 'Overwrite existing files', false)
  .action(async (options: { force: boolean }) => {
    await initCommand({
      output: '.',
      dryRun: false,
      verbose: false,
      force: options.force,
      includeGit: false,
      ide: 'cursor,vscode-copilot,claude-code,antigravity,windsurf',
    });
  });

program.parse();
