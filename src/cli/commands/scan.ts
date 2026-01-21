/**
 * Scan command - dry run to show what would be detected
 */

import ora from 'ora';

import type { CLIOptions } from '../../types/index.js';
import { analyzeCodebase } from '../../analyzers/index.js';
import { getRuleCount } from '../../generators/index.js';
import { printBanner, printDetectedStack, log } from '../output.js';

export async function scanCommand(_options: CLIOptions): Promise<void> {
    const cwd = process.cwd();

    printBanner();

    const spinner = ora('Scanning codebase...').start();

    try {
        const analysis = await analyzeCodebase(cwd);
        const ruleCount = getRuleCount(analysis);

        spinner.succeed('Scan complete');
        console.log('');

        printDetectedStack(analysis);

        console.log('');
        console.log(`Would generate ${ruleCount} rules across ${analysis.languages.length + analysis.frameworks.length} detected technologies.`);
        console.log('');
        console.log('Run `dotllm init` to generate files.');
        console.log('');

    } catch (error) {
        spinner.fail('Scan failed');

        if (error instanceof Error) {
            log.error(error.message);
        }

        process.exit(1);
    }
}
