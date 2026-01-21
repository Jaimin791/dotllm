/**
 * Console output formatting utilities
 */

import chalk from 'chalk';
import type { AnalysisResult } from '../types/analysis.js';

export const log = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✓'), msg),
  warning: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.log(chalk.red('✗'), msg),
  dim: (msg: string) => console.log(chalk.dim(msg)),
};

/**
 * Package version (kept in sync with package.json)
 */
const VERSION = '1.0.0';

/**
 * Print banner with version
 */
export function printBanner(): void {
  console.log('');
  console.log(
    chalk.cyan('  ╭─────────────────────────────────────────────────╮')
  );
  console.log(
    chalk.cyan('  │') +
    chalk.bold.white('  dotai ') +
    chalk.dim(`v${VERSION}`) +
    '                        ' +
    chalk.cyan('│')
  );
  console.log(
    chalk.cyan('  │') +
    chalk.dim('  Give your AI the context it deserves.') +
    '          ' +
    chalk.cyan('│')
  );
  console.log(
    chalk.cyan('  ╰─────────────────────────────────────────────────╯')
  );
  console.log('');
}

/**
 * Print detected stack
 */
export function printDetectedStack(analysis: AnalysisResult): void {
  console.log(chalk.bold('📊 Detected Stack:\n'));

  const items: Array<[string, string[]]> = [];

  if (analysis.languages.length > 0) {
    items.push(['Languages', analysis.languages]);
  }
  if (analysis.frameworks.length > 0) {
    items.push(['Frameworks', analysis.frameworks]);
  }
  if (analysis.packageManagers.length > 0) {
    items.push(['Package Manager', analysis.packageManagers]);
  }
  if (analysis.buildTools.length > 0) {
    items.push(['Build Tools', analysis.buildTools]);
  }
  if (analysis.testFrameworks.length > 0) {
    items.push(['Testing', analysis.testFrameworks]);
  }
  if (analysis.lintTools.length > 0) {
    items.push(['Linting', analysis.lintTools]);
  }
  if (analysis.databases.length > 0) {
    items.push(['Databases', analysis.databases]);
  }
  if (analysis.infraTools.length > 0) {
    items.push(['Infrastructure', analysis.infraTools]);
  }

  for (let i = 0; i < items.length; i++) {
    const [label, values] = items[i];
    const isLast = i === items.length - 1;
    const prefix = isLast ? '  └─' : '  ├─';
    console.log(chalk.dim(prefix), chalk.bold(label + ':'), chalk.cyan(values.join(', ')));
  }

  if (analysis.isMonorepo) {
    console.log(chalk.dim('  └─'), chalk.bold('Type:'), chalk.magenta('Monorepo'));
  }

  console.log('');
}

/**
 * Print generation summary
 */
export function printSummary(rulesPath: string, _contextPath: string, ruleCount: number): void {
  console.log(chalk.bold.green('✅ Files generated:\n'));
  console.log(
    chalk.dim('  ├─'),
    chalk.white('AI_CODING_RULES.md'),
    chalk.dim(`(${ruleCount} rules)`)
  );
  console.log(chalk.dim('  └─'), chalk.white('AI_PROJECT_CONTEXT.md'));
  console.log('');
  console.log(
    chalk.dim('  Files written to:'),
    chalk.cyan(rulesPath.replace('/AI_CODING_RULES.md', ''))
  );
  console.log('');
}

/**
 * Print dry run summary
 */
export function printDryRunSummary(analysis: AnalysisResult, ruleCount: number): void {
  console.log(chalk.bold.yellow('🔍 Dry run - no files written\n'));
  printDetectedStack(analysis);
  console.log(chalk.dim('Would generate:'));
  console.log(chalk.dim('  ├─'), 'AI_CODING_RULES.md', chalk.dim(`(${ruleCount} rules)`));
  console.log(chalk.dim('  └─'), 'AI_PROJECT_CONTEXT.md');
  console.log('');
}

/**
 * Print empty project warning
 */
export function printEmptyProjectWarning(): void {
  console.log(chalk.yellow('⚠ No recognizable project structure detected.'));
  console.log(chalk.dim('  Generating minimal context files...'));
  console.log('');
}

/**
 * Print update notice
 */
export function printUpdateNotice(): void {
  console.log(chalk.dim('┌────────────────────────────────────────────────────────────────┐'));
  console.log(
    chalk.dim('│'),
    chalk.bold(' Usage Tips:'),
    chalk.dim('                                                   │')
  );
  console.log(
    chalk.dim('│'),
    '                                                               ',
    chalk.dim('│')
  );
  console.log(
    chalk.dim('│'),
    ' • Add these files to your repo for team-wide AI consistency  ',
    chalk.dim('│')
  );
  console.log(
    chalk.dim('│'),
    ' • Paste contents into Cursor/Copilot system prompts          ',
    chalk.dim('│')
  );
  console.log(
    chalk.dim('│'),
    ' • Re-run after major project changes                         ',
    chalk.dim('│')
  );
  console.log(
    chalk.dim('│'),
    '                                                               ',
    chalk.dim('│')
  );
  console.log(chalk.dim('└────────────────────────────────────────────────────────────────┘'));
  console.log('');
}
