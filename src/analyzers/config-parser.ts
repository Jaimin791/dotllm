/**
 * Configuration file parser
 */

import { join } from 'path';
import type { ConfigFile } from '../types/index.js';
import { pathExists, readJsonFile, readFile } from '../utils/index.js';
import { parseYaml, parseToml } from '../utils/detect.js';

/** Known configuration files to look for */
const CONFIG_FILES: Array<{
  path: string;
  type: string;
  parser: 'json' | 'yaml' | 'toml' | 'text';
}> = [
  // TypeScript
  { path: 'tsconfig.json', type: 'typescript', parser: 'json' },
  { path: 'jsconfig.json', type: 'javascript', parser: 'json' },

  // ESLint
  { path: '.eslintrc.json', type: 'eslint', parser: 'json' },
  { path: '.eslintrc.js', type: 'eslint', parser: 'text' },
  { path: '.eslintrc.cjs', type: 'eslint', parser: 'text' },
  { path: '.eslintrc.yml', type: 'eslint', parser: 'yaml' },
  { path: 'eslint.config.js', type: 'eslint', parser: 'text' },
  { path: 'eslint.config.mjs', type: 'eslint', parser: 'text' },

  // Prettier
  { path: '.prettierrc', type: 'prettier', parser: 'json' },
  { path: '.prettierrc.json', type: 'prettier', parser: 'json' },
  { path: '.prettierrc.yml', type: 'prettier', parser: 'yaml' },
  { path: 'prettier.config.js', type: 'prettier', parser: 'text' },

  // Biome
  { path: 'biome.json', type: 'biome', parser: 'json' },

  // Package manifests
  { path: 'package.json', type: 'npm', parser: 'json' },
  { path: 'pyproject.toml', type: 'python', parser: 'toml' },
  { path: 'Cargo.toml', type: 'rust', parser: 'toml' },
  { path: 'go.mod', type: 'go', parser: 'text' },

  // Framework configs
  { path: 'next.config.js', type: 'nextjs', parser: 'text' },
  { path: 'next.config.mjs', type: 'nextjs', parser: 'text' },
  { path: 'next.config.ts', type: 'nextjs', parser: 'text' },
  { path: 'vite.config.ts', type: 'vite', parser: 'text' },
  { path: 'vite.config.js', type: 'vite', parser: 'text' },
  { path: 'nuxt.config.ts', type: 'nuxt', parser: 'text' },
  { path: 'svelte.config.js', type: 'svelte', parser: 'text' },
  { path: 'astro.config.mjs', type: 'astro', parser: 'text' },

  // Build tools
  { path: 'turbo.json', type: 'turbo', parser: 'json' },
  { path: 'nx.json', type: 'nx', parser: 'json' },
  { path: 'lerna.json', type: 'lerna', parser: 'json' },
  { path: 'webpack.config.js', type: 'webpack', parser: 'text' },

  // Testing
  { path: 'jest.config.js', type: 'jest', parser: 'text' },
  { path: 'jest.config.ts', type: 'jest', parser: 'text' },
  { path: 'vitest.config.ts', type: 'vitest', parser: 'text' },
  { path: 'playwright.config.ts', type: 'playwright', parser: 'text' },
  { path: 'cypress.config.ts', type: 'cypress', parser: 'text' },
  { path: 'pytest.ini', type: 'pytest', parser: 'text' },

  // Docker
  { path: 'Dockerfile', type: 'docker', parser: 'text' },
  { path: 'docker-compose.yml', type: 'docker-compose', parser: 'yaml' },
  { path: 'docker-compose.yaml', type: 'docker-compose', parser: 'yaml' },
  { path: 'compose.yml', type: 'docker-compose', parser: 'yaml' },

  // CI/CD
  { path: '.github/workflows/ci.yml', type: 'github-actions', parser: 'yaml' },
  { path: '.github/workflows/ci.yaml', type: 'github-actions', parser: 'yaml' },
  { path: '.gitlab-ci.yml', type: 'gitlab-ci', parser: 'yaml' },

  // Deployment
  { path: 'vercel.json', type: 'vercel', parser: 'json' },
  { path: 'netlify.toml', type: 'netlify', parser: 'toml' },

  // Database
  { path: 'prisma/schema.prisma', type: 'prisma', parser: 'text' },
  { path: 'drizzle.config.ts', type: 'drizzle', parser: 'text' },

  // Python
  { path: 'ruff.toml', type: 'ruff', parser: 'toml' },
  { path: '.ruff.toml', type: 'ruff', parser: 'toml' },
  { path: 'mypy.ini', type: 'mypy', parser: 'text' },
  { path: '.flake8', type: 'flake8', parser: 'text' },
];

/**
 * Parse all configuration files in the project
 */
export function parseConfigFiles(rootPath: string): ConfigFile[] {
  const configs: ConfigFile[] = [];

  for (const configDef of CONFIG_FILES) {
    const fullPath = join(rootPath, configDef.path);

    if (!pathExists(fullPath)) continue;

    let content: Record<string, unknown> = {};

    try {
      switch (configDef.parser) {
        case 'json':
          content = readJsonFile(fullPath) || {};
          break;
        case 'yaml':
          content = parseYaml(fullPath) || {};
          break;
        case 'toml':
          content = parseToml(fullPath) || {};
          break;
        case 'text':
          // For text files, just note their presence
          content = { _exists: true, _path: configDef.path };
          break;
      }

      configs.push({
        path: configDef.path,
        type: configDef.type,
        content,
      });
    } catch {
      // Skip files that can't be parsed
    }
  }

  return configs;
}

/**
 * Extract TypeScript config settings
 */
export function extractTsConfig(rootPath: string): Record<string, unknown> | null {
  const tsconfig = readJsonFile<{
    compilerOptions?: Record<string, unknown>;
  }>(join(rootPath, 'tsconfig.json'));

  return tsconfig?.compilerOptions || null;
}

/**
 * Check if strict TypeScript is enabled
 */
export function hasStrictTypeScript(rootPath: string): boolean {
  const compilerOptions = extractTsConfig(rootPath);
  if (!compilerOptions) return false;

  return compilerOptions.strict === true;
}

/**
 * Get package.json scripts
 */
export function getPackageScripts(rootPath: string): Record<string, string> {
  const packageJson = readJsonFile<{
    scripts?: Record<string, string>;
  }>(join(rootPath, 'package.json'));

  return packageJson?.scripts || {};
}

/**
 * Get project name from package.json
 */
export function getProjectName(rootPath: string): string {
  const packageJson = readJsonFile<{ name?: string }>(join(rootPath, 'package.json'));
  if (packageJson?.name) return packageJson.name;

  const pyproject = parseToml<{ project?: { name?: string } }>(join(rootPath, 'pyproject.toml'));
  if (pyproject?.project?.name) return pyproject.project.name;

  const cargoToml = parseToml<{ package?: { name?: string } }>(join(rootPath, 'Cargo.toml'));
  if (cargoToml?.package?.name) return cargoToml.package.name;

  // Fall back to directory name
  return rootPath.split('/').pop() || 'project';
}

/**
 * Infer project description
 */
export function getProjectDescription(rootPath: string): string | null {
  const packageJson = readJsonFile<{ description?: string }>(join(rootPath, 'package.json'));
  if (packageJson?.description) return packageJson.description;

  const pyproject = parseToml<{ project?: { description?: string } }>(
    join(rootPath, 'pyproject.toml')
  );
  if (pyproject?.project?.description) return pyproject.project.description;

  // Try README
  const readme = readFile(join(rootPath, 'README.md'));
  if (readme) {
    // Extract first paragraph after heading
    const lines = readme.split('\n');
    let foundHeading = false;
    for (const line of lines) {
      if (line.startsWith('#')) {
        foundHeading = true;
        continue;
      }
      if (foundHeading && line.trim() && !line.startsWith('#')) {
        return line.trim().slice(0, 200);
      }
    }
  }

  return null;
}

/**
 * Get custom rules from .dotllm/rules.md
 */
export function getCustomRules(rootPath: string): string | undefined {
  const customRulesPath = join(rootPath, '.dotllm', 'rules.md');
  if (pathExists(customRulesPath)) {
    return readFile(customRulesPath) || undefined;
  }
  return undefined;
}
