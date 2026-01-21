/**
 * CLI configuration types
 */

export interface CLIOptions {
  output: string;
  dryRun: boolean;
  verbose: boolean;
  force: boolean;
  includeGit: boolean;
  /** Comma-separated list of IDEs to generate config for */
  ide?: string;
}

export interface CLIContext {
  cwd: string;
  options: CLIOptions;
}
