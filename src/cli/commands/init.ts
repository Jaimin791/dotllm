/**
 * Init command - main generation command
 * 
 * Generates AI context files for the current project.
 * Files are generated in the EXACT locations each AI tool expects:
 * - Cursor: .cursor/rules/rules.mdc
 * - Claude Code: CLAUDE.md
 * - Antigravity: GEMINI.md
 * - Codex: AGENTS.md
 * - Copilot: .github/copilot-instructions.md
 * - Windsurf: .windsurfrules
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import ora from 'ora';
import chalk from 'chalk';

import type { CLIOptions } from '../../types/index.js';
import { analyzeCodebase } from '../../analyzers/index.js';
import { detectIDE, type IDE } from '../../analyzers/ide.js';
import { getRuleCount } from '../../generators/index.js';
import {
    generateAllIDEOutputs,
    type IDEOutput,
} from '../../generators/ide-outputs.js';
import {
    printBanner,
    printDetectedStack,
    printDryRunSummary,
    printEmptyProjectWarning,
    printUpdateNotice,
    log,
} from '../output.js';

// All supported IDEs that we can generate for
const ALL_SUPPORTED_IDES: IDE[] = [
    'cursor',
    'claude-code',
    'antigravity',
    'codex',
    'vscode-copilot',
    'windsurf',
];

/**
 * Main init command handler.
 */
export async function initCommand(options: CLIOptions): Promise<void> {
    const cwd = process.cwd();
    const outputDir = options.output || cwd;

    // Print banner
    printBanner();

    // Start spinner for analysis
    const spinner = ora('Analyzing codebase...').start();

    try {
        // Perform analysis
        const analysis = await analyzeCodebase(cwd);

        // Detect IDE(s)
        const ideDetection = detectIDE(cwd);

        spinner.succeed('Analysis complete');
        console.log('');

        // Check for empty project
        if (analysis.languages.length === 0 && analysis.frameworks.length === 0) {
            printEmptyProjectWarning();
        }

        // Print detected stack
        if (options.verbose) {
            printDetectedStack(analysis);

            // Show detected IDEs
            if (ideDetection.detected.length > 0) {
                console.log(chalk.bold('🛠️  Detected IDEs:'));
                for (const detail of ideDetection.details) {
                    console.log(
                        chalk.dim('   •'),
                        chalk.cyan(detail.displayName),
                        detail.supportsRules
                            ? chalk.green(`→ ${detail.rulesFileName}`)
                            : chalk.dim('(no rules file)')
                    );
                }
                console.log('');
            }
        } else {
            // Condensed version
            console.log(chalk.bold('📊 Detected Stack:'));
            const items = [...analysis.languages, ...analysis.frameworks].slice(0, 6);
            console.log(
                chalk.dim('   '),
                chalk.cyan(items.join(', ') || 'No specific stack detected')
            );
            console.log('');
        }

        const ruleCount = getRuleCount(analysis);

        // Determine which IDEs to generate for
        let targetIDEs: IDE[] = [];

        // Priority 1: If --ide flag is passed, use those
        if (options.ide) {
            targetIDEs = options.ide.split(',').map((s) => s.trim() as IDE);
        }
        // Priority 2: If IDEs were detected in the project, use those
        else if (ideDetection.detected.length > 0) {
            targetIDEs = ideDetection.detected;
        }
        // Priority 3: Generate for ALL supported IDEs (universal init!)
        else {
            targetIDEs = ALL_SUPPORTED_IDES;
            console.log(chalk.bold('🌐 Universal Mode:'));
            console.log(
                chalk.dim('   '),
                'No specific IDE detected. Generating config for',
                chalk.cyan('all supported AI tools')
            );
            console.log('');
        }

        // Generate IDE-specific outputs
        const ideOutputs: IDEOutput[] = generateAllIDEOutputs(analysis, targetIDEs);

        // Only generate for IDEs that have output
        if (ideOutputs.length === 0) {
            log.warning('No IDE-specific outputs could be generated.');
            return;
        }

        // Dry run check
        if (options.dryRun) {
            printDryRunSummary(analysis, ruleCount);

            console.log(chalk.bold('📁 Files that would be generated:'));
            console.log('');
            console.log(chalk.dim('   These files are placed where each AI tool actually looks:'));
            console.log('');
            for (const output of ideOutputs) {
                console.log(
                    chalk.dim('   '),
                    chalk.green('✓'),
                    chalk.cyan(output.filePath),
                    chalk.dim(`← ${output.description}`)
                );
            }
            console.log('');
            return;
        }

        // Check for existing files
        const existingFiles = ideOutputs
            .map((o) => o.filePath)
            .filter((fp) => existsSync(join(outputDir, fp)));

        if (existingFiles.length > 0 && !options.force) {
            log.warning('Existing files found. Use --force to overwrite.');
            for (const file of existingFiles) {
                console.log(chalk.dim('   •'), file);
            }
            console.log('');
            return;
        }

        // Write files
        const writeSpinner = ora('Writing files...').start();

        const writtenFiles: string[] = [];
        for (const output of ideOutputs) {
            const filePath = join(outputDir, output.filePath);

            // Create directory if needed (e.g., .cursor/rules/, .github/)
            const dir = dirname(filePath);
            if (dir !== outputDir && !existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }

            // Check if exists and force flag
            if (existsSync(filePath) && !options.force) {
                continue; // Skip existing files if not forced
            }

            writeFileSync(filePath, output.content, 'utf-8');
            writtenFiles.push(output.filePath);
        }

        writeSpinner.succeed('Files written');
        console.log('');

        // Print success summary
        console.log(chalk.bold.green('✅ Success!'));
        console.log('');
        console.log(chalk.bold('📁 Generated Files:'));
        console.log('');
        console.log(chalk.dim('   These files are placed where each AI tool looks for them:'));
        console.log('');
        for (const file of writtenFiles) {
            const output = ideOutputs.find((o) => o.filePath === file);
            console.log(
                chalk.dim('   '),
                chalk.green('✓'),
                chalk.cyan(file),
                chalk.dim(`← ${output?.description || ''}`)
            );
        }
        console.log('');

        // Print rule count
        console.log(chalk.bold(`📊 Generated ${chalk.cyan(ruleCount)} rules based on your stack`));
        console.log('');

        // Print usage tips
        printUpdateNotice();
    } catch (error) {
        spinner.fail('Analysis failed');
        console.log('');

        if (error instanceof Error) {
            log.error(error.message);
            if (options.verbose && error.stack) {
                console.log(chalk.dim(error.stack));
            }
        } else {
            log.error('An unexpected error occurred');
        }

        process.exit(1);
    }
}
