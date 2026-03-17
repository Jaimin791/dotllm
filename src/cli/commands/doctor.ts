/**
 * Doctor command - project health check and setup verification
 */

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';

import type { CLIOptions } from '../../types/config.js';
import { analyzeCodebase } from '../../analyzers/index.js';
import { printBanner, log } from '../output.js';

/**
 * Doctor command handler
 */
export async function doctorCommand(_options: Partial<CLIOptions>): Promise<void> {
    const cwd = process.cwd();
    printBanner();

    console.log(chalk.bold('🏥 dotllm Doctor - Project Health Check'));
    console.log(chalk.dim('Checking for AI readiness and project configuration...'));
    console.log('');

    const spinner = ora('Analyzing project diagnostics...').start();

    try {
        const analysis = await analyzeCodebase(cwd);
        spinner.succeed('Diagnostics complete');
        console.log('');

        // 1. AI Rules Check
        console.log(chalk.bold('📓 AI Context Files:'));
        const aiFiles = [
            { name: '.cursor/rules/rules.mdc', tool: 'Cursor' },
            { name: 'CLAUDE.md', tool: 'Claude Code' },
            { name: 'GEMINI.md', tool: 'Antigravity' },
            { name: '.github/copilot-instructions.md', tool: 'Copilot' },
            { name: '.windsurfrules', tool: 'Windsurf' },
            { name: 'AGENTS.md', tool: 'Codex/OpenAgents' }
        ];

        let foundAny = false;
        for (const file of aiFiles) {
            if (existsSync(join(cwd, file.name))) {
                console.log(chalk.green('  ✓'), chalk.cyan(file.name), chalk.dim(`(for ${file.tool})`));
                foundAny = true;
            }
        }

        if (!foundAny) {
            console.log(chalk.yellow('  ⚠ No AI context files found. Run `dotllm init` to generate them.'));
        }
        console.log('');

        // 2. Custom Rules Check
        console.log(chalk.bold('📜 Custom Configuration:'));
        if (analysis.customRules) {
            console.log(chalk.green('  ✓'), chalk.cyan('.dotllm/rules.md'), chalk.dim('is active'));
        } else {
            console.log(chalk.dim('  - No .dotllm/rules.md found (optional)'));
        }
        console.log('');

        // 3. Project Metadata Check
        console.log(chalk.bold('📊 Project Metadata:'));
        console.log(chalk.dim('  • Name:'), chalk.cyan(analysis.projectName));
        console.log(chalk.dim('  • Stack:'), chalk.cyan([...analysis.languages, ...analysis.frameworks].join(', ') || 'Unknown'));
        console.log(chalk.dim('  • Monorepo:'), analysis.isMonorepo ? chalk.green('Yes') : chalk.dim('No'));
        console.log('');

        // 4. Git Hygiene
        console.log(chalk.bold('📂 Repository hygiene:'));
        if (existsSync(join(cwd, '.gitignore'))) {
            console.log(chalk.green('  ✓'), chalk.cyan('.gitignore'), 'present');
        } else {
            console.log(chalk.red('  ✗'), chalk.red('.gitignore missing!'), 'AI might try to read huge dependency folders.');
        }

        const hooksDir = join(cwd, '.git', 'hooks');
        if (existsSync(hooksDir)) {
            try {
                const hooks = readdirSync(hooksDir).filter(f => !f.endsWith('.sample'));
                if (hooks.length > 0) {
                    console.log(chalk.green('  ✓'), chalk.cyan('Git Hooks'), `detected (${hooks.length} active)`);
                } else {
                    console.log(chalk.dim('  - No active Git hooks found'));
                }
            } catch {
                console.log(chalk.dim('  - Could not read git hooks'));
            }
        }
        console.log('');

        console.log(chalk.bold.green('✨ Doctor check completed!'));
        console.log('');

    } catch (error) {
        spinner.fail('Doctor check failed');
        if (error instanceof Error) {
            log.error(error.message);
        }
        process.exit(1);
    }
}
