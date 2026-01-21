/**
 * Init command - main generation command
 * 
 * Generates AI context files for the current project.
 * Supports IDE-specific output for Cursor, Copilot, Claude Code, etc.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import ora from 'ora';
import chalk from 'chalk';

import type { CLIOptions } from '../../types/index.js';
import { analyzeCodebase } from '../../analyzers/index.js';
import { detectIDE, type IDE } from '../../analyzers/ide.js';
import {
    generateRulesMarkdown,
    getRuleCount,
    generateContextMarkdown,
} from '../../generators/index.js';
import {
    generateAllIDEOutputs,
    generateIDEOutput,
    type IDEOutput,
} from '../../generators/ide-outputs.js';
import {
    printBanner,
    printDetectedStack,
    printSummary,
    printDryRunSummary,
    printEmptyProjectWarning,
    printUpdateNotice,
    log,
} from '../output.js';

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

        // Generate markdown content
        const rulesContent = generateRulesMarkdown(analysis);
        const contextContent = generateContextMarkdown(analysis);
        const ruleCount = getRuleCount(analysis);

        // Generate IDE-specific outputs
        const ideOutputs: IDEOutput[] = [];

        // Auto-detect and generate for detected IDEs
        if (ideDetection.detected.length > 0) {
            ideOutputs.push(...generateAllIDEOutputs(analysis, ideDetection.detected));
        }

        // If --ide flag is passed, generate for specific IDE(s)
        if (options.ide) {
            const requestedIDEs = options.ide.split(',').map((s) => s.trim() as IDE);
            for (const ide of requestedIDEs) {
                // Avoid duplicates
                if (!ideOutputs.some((o) => o.ide === ide)) {
                    const output = generateIDEOutput(analysis, ide);
                    if (output) {
                        ideOutputs.push(output);
                    }
                }
            }
        }

        // Dry run check
        if (options.dryRun) {
            printDryRunSummary(analysis, ruleCount);

            // Show IDE files that would be generated
            if (ideOutputs.length > 0) {
                console.log(chalk.bold('🛠️  IDE-specific files:'));
                for (const output of ideOutputs) {
                    console.log(
                        chalk.dim('   •'),
                        chalk.cyan(output.filePath),
                        chalk.dim(`(${output.description})`)
                    );
                }
                console.log('');
            }
            return;
        }

        // File paths
        const rulesPath = join(outputDir, 'AI_CODING_RULES.md');
        const contextPath = join(outputDir, 'AI_PROJECT_CONTEXT.md');

        // Check for existing files (base files)
        const rulesExists = existsSync(rulesPath);
        const contextExists = existsSync(contextPath);

        if ((rulesExists || contextExists) && !options.force) {
            log.warning('Existing files found. Use --force to overwrite.');
            if (rulesExists) console.log(chalk.dim('   •'), 'AI_CODING_RULES.md');
            if (contextExists) console.log(chalk.dim('   •'), 'AI_PROJECT_CONTEXT.md');
            console.log('');
            return;
        }

        // Write files
        const writeSpinner = ora('Writing files...').start();

        // Write base files
        writeFileSync(rulesPath, rulesContent, 'utf-8');
        writeFileSync(contextPath, contextContent, 'utf-8');

        // Write IDE-specific files
        const writtenIDEFiles: string[] = [];
        for (const output of ideOutputs) {
            const filePath = join(outputDir, output.filePath);

            // Create directory if needed (e.g., .gemini/, .github/)
            const dir = dirname(filePath);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }

            // Check if exists and force flag
            if (existsSync(filePath) && !options.force) {
                continue; // Skip existing files if not forced
            }

            writeFileSync(filePath, output.content, 'utf-8');
            writtenIDEFiles.push(output.filePath);
        }

        writeSpinner.succeed('Files written');
        console.log('');

        // Print summary
        printSummary(rulesPath, contextPath, ruleCount);

        // Print IDE-specific files written
        if (writtenIDEFiles.length > 0) {
            console.log(chalk.bold('🛠️  IDE-Specific Files:'));
            console.log('');
            for (const file of writtenIDEFiles) {
                console.log(chalk.dim('   '), chalk.green('✓'), chalk.cyan(file));
            }
            console.log('');
        }

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
