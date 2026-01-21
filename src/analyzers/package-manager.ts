/**
 * @fileoverview Package manager detection and dependency parsing
 * @module analyzers/package-manager
 *
 * Detects package managers and parses dependencies from:
 * - Lock files (highest priority - definitive signal)
 * - Package manifests (package.json, pyproject.toml, etc.)
 * - Project structure
 */

import { join } from 'path';
import type { PackageManager, Dependency } from '../types/index.js';
import { pathExists, readJsonFile, readFile } from '../utils/index.js';
import { parseToml, parseYaml } from '../utils/detect.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Detailed information about a detected package manager.
 */
export interface PackageManagerInfo {
  /** The detected package manager */
  manager: PackageManager;

  /** Path to the lock file (if found) */
  lockFile?: string;

  /** Path to the manifest file */
  manifestFile: string;
}

// ============================================================================
// Detection Mappings
// ============================================================================

/**
 * Lock files mapped to their package managers.
 * Lock files are the strongest signal for package manager detection.
 */
const LOCK_FILE_TO_MANAGER: Readonly<Record<string, PackageManager>> = {
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'bun.lockb': 'bun',
  'Pipfile.lock': 'pipenv',
  'poetry.lock': 'poetry',
  'Cargo.lock': 'cargo',
  'go.sum': 'go',
  'Gemfile.lock': 'bundler',
  'composer.lock': 'composer',
} as const;

/**
 * Manifest files mapped to their package managers.
 * Used when no lock file is present.
 */
const MANIFEST_TO_MANAGER: Readonly<Record<string, PackageManager>> = {
  'package.json': 'npm', // Default, will be overridden by lock file
  'pyproject.toml': 'poetry',
  'requirements.txt': 'pip',
  Pipfile: 'pipenv',
  'setup.py': 'pip',
  'Cargo.toml': 'cargo',
  'go.mod': 'go',
  Gemfile: 'bundler',
  'composer.json': 'composer',
  'pom.xml': 'maven',
  'build.gradle': 'gradle',
  'build.gradle.kts': 'gradle',
} as const;

/**
 * Maps package managers to their manifest files.
 */
const MANAGER_TO_MANIFEST: Readonly<Record<PackageManager, string>> = {
  npm: 'package.json',
  yarn: 'package.json',
  pnpm: 'package.json',
  bun: 'package.json',
  pip: 'requirements.txt',
  poetry: 'pyproject.toml',
  pipenv: 'Pipfile',
  cargo: 'Cargo.toml',
  go: 'go.mod',
  bundler: 'Gemfile',
  composer: 'composer.json',
  maven: 'pom.xml',
  gradle: 'build.gradle',
} as const;

/**
 * JavaScript/Node.js package managers (for deduplication).
 */
const JS_PACKAGE_MANAGERS: readonly PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];

// ============================================================================
// Package Manager Detection
// ============================================================================

/**
 * Detects all package managers used in a project.
 *
 * Detection priority:
 * 1. Lock files (definitive signal)
 * 2. Manifest files (fallback)
 *
 * For JavaScript projects, specific managers (pnpm, yarn, bun) take
 * precedence over npm to avoid duplicates.
 *
 * @param rootPath - Absolute path to the project root
 * @returns Array of detected package managers
 *
 * @example
 * ```typescript
 * const managers = detectPackageManagers('/path/to/project');
 * // ['pnpm'] for a pnpm project
 * // ['pip', 'npm'] for a Python + Node.js project
 * ```
 */
export function detectPackageManagers(rootPath: string): PackageManager[] {
  const managers: PackageManager[] = [];

  // Phase 1: Check lock files (strongest signal)
  for (const [lockFile, manager] of Object.entries(LOCK_FILE_TO_MANAGER)) {
    if (pathExists(join(rootPath, lockFile))) {
      if (!managers.includes(manager)) {
        managers.push(manager);
      }
    }
  }

  // Phase 2: Check manifest files
  for (const [manifestFile, manager] of Object.entries(MANIFEST_TO_MANAGER)) {
    if (pathExists(join(rootPath, manifestFile))) {
      // Skip npm if we already detected a more specific JS package manager
      if (manager === 'npm') {
        const hasSpecificJsManager = managers.some(
          (m) => JS_PACKAGE_MANAGERS.includes(m) && m !== 'npm'
        );
        if (hasSpecificJsManager) {
          continue;
        }
      }

      if (!managers.includes(manager)) {
        managers.push(manager);
      }
    }
  }

  return managers;
}

/**
 * Gets detailed information about detected package managers.
 *
 * @param rootPath - Absolute path to the project root
 * @returns Array of package manager info objects
 */
export function getPackageManagerInfo(rootPath: string): PackageManagerInfo[] {
  const results: PackageManagerInfo[] = [];

  for (const [lockFile, manager] of Object.entries(LOCK_FILE_TO_MANAGER)) {
    if (pathExists(join(rootPath, lockFile))) {
      results.push({
        manager,
        lockFile,
        manifestFile: MANAGER_TO_MANIFEST[manager],
      });
    }
  }

  return results;
}

// ============================================================================
// Dependency Parsing
// ============================================================================

/**
 * Parses dependencies from a package.json file.
 *
 * @param rootPath - Absolute path to the project root
 * @returns Array of dependencies (both runtime and dev)
 *
 * @example
 * ```typescript
 * const deps = parseNpmDependencies('/path/to/project');
 * for (const dep of deps) {
 *   console.log(`${dep.name}@${dep.version} (dev: ${dep.isDev})`);
 * }
 * ```
 */
export function parseNpmDependencies(rootPath: string): Dependency[] {
  interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }

  const packageJson = readJsonFile<PackageJson>(join(rootPath, 'package.json'));
  if (!packageJson) {
    return [];
  }

  const deps: Dependency[] = [];

  // Runtime dependencies
  if (packageJson.dependencies) {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      deps.push({ name, version, isDev: false });
    }
  }

  // Development dependencies
  if (packageJson.devDependencies) {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      deps.push({ name, version, isDev: true });
    }
  }

  return deps;
}

/**
 * Parses dependencies from Python project files.
 *
 * Supports:
 * - pyproject.toml (PEP 621 and Poetry formats)
 * - requirements.txt
 *
 * @param rootPath - Absolute path to the project root
 * @returns Array of dependencies
 */
export function parsePythonDependencies(rootPath: string): Dependency[] {
  const deps: Dependency[] = [];

  // Try pyproject.toml first (modern Python)
  interface PyProject {
    project?: { dependencies?: string[] };
    tool?: {
      poetry?: {
        dependencies?: Record<string, string | { version: string }>;
        'dev-dependencies'?: Record<string, string | { version: string }>;
      };
    };
  }

  const pyprojectPath = join(rootPath, 'pyproject.toml');
  if (pathExists(pyprojectPath)) {
    const pyproject = parseToml<PyProject>(pyprojectPath);

    // PEP 621 format (project.dependencies)
    if (pyproject?.project?.dependencies) {
      for (const dep of pyproject.project.dependencies) {
        const match = dep.match(/^([a-zA-Z0-9_-]+)([<>=!~].*)?$/);
        if (match) {
          deps.push({
            name: match[1],
            version: match[2] ?? '*',
            isDev: false,
          });
        }
      }
    }

    // Poetry format (tool.poetry.dependencies)
    if (pyproject?.tool?.poetry?.dependencies) {
      for (const [name, version] of Object.entries(pyproject.tool.poetry.dependencies)) {
        // Skip python version constraint
        if (name === 'python') {
          continue;
        }

        const ver = typeof version === 'string' ? version : version.version;
        deps.push({ name, version: ver, isDev: false });
      }
    }
  }

  // Try requirements.txt (traditional Python)
  const requirementsPath = join(rootPath, 'requirements.txt');
  if (pathExists(requirementsPath)) {
    const content = readFile(requirementsPath);
    if (content) {
      for (const line of content.split('\n')) {
        const trimmed = line.trim();

        // Skip comments, empty lines, and options
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('-')) {
          continue;
        }

        const match = trimmed.match(/^([a-zA-Z0-9_-]+)([<>=!~].*)?$/);
        if (match) {
          deps.push({
            name: match[1],
            version: match[2] ?? '*',
            isDev: false,
          });
        }
      }
    }
  }

  return deps;
}

/**
 * Gets all dependencies from all detected package managers.
 *
 * @param rootPath - Absolute path to the project root
 * @returns Combined array of all dependencies
 *
 * @example
 * ```typescript
 * const allDeps = getAllDependencies('/path/to/project');
 * console.log(`Total dependencies: ${allDeps.length}`);
 * ```
 */
export function getAllDependencies(rootPath: string): Dependency[] {
  const deps: Dependency[] = [];

  // JavaScript/TypeScript
  deps.push(...parseNpmDependencies(rootPath));

  // Python
  deps.push(...parsePythonDependencies(rootPath));

  // TODO: Add parsers for Go (go.mod), Rust (Cargo.toml), etc.

  return deps;
}

// ============================================================================
// Monorepo Detection
// ============================================================================

/**
 * Checks if the project is a monorepo.
 *
 * Detected by:
 * - npm/yarn workspaces in package.json
 * - pnpm-workspace.yaml
 * - lerna.json
 * - nx.json
 * - turbo.json
 *
 * @param rootPath - Absolute path to the project root
 * @returns True if the project appears to be a monorepo
 *
 * @example
 * ```typescript
 * if (isMonorepo('/path/to/project')) {
 *   console.log('Monorepo detected');
 * }
 * ```
 */
export function isMonorepo(rootPath: string): boolean {
  // Check for workspace configuration in package.json
  interface PackageJson {
    workspaces?: string[] | { packages: string[] };
  }

  const packageJson = readJsonFile<PackageJson>(join(rootPath, 'package.json'));
  if (packageJson?.workspaces) {
    return true;
  }

  // Check for monorepo tools
  const monorepoIndicators = ['pnpm-workspace.yaml', 'lerna.json', 'nx.json', 'turbo.json'];

  return monorepoIndicators.some((file) => pathExists(join(rootPath, file)));
}

/**
 * Gets the workspace patterns for a monorepo.
 *
 * @param rootPath - Absolute path to the project root
 * @returns Array of workspace glob patterns, or empty array
 *
 * @example
 * ```typescript
 * const workspaces = getWorkspaces('/path/to/monorepo');
 * // ['apps/*', 'packages/*']
 * ```
 */
export function getWorkspaces(rootPath: string): string[] {
  // Try package.json workspaces
  interface PackageJson {
    workspaces?: string[] | { packages: string[] };
  }

  const packageJson = readJsonFile<PackageJson>(join(rootPath, 'package.json'));
  if (packageJson?.workspaces) {
    if (Array.isArray(packageJson.workspaces)) {
      return packageJson.workspaces;
    }
    return packageJson.workspaces.packages ?? [];
  }

  // Try pnpm-workspace.yaml
  interface PnpmWorkspace {
    packages?: string[];
  }

  const pnpmWorkspace = parseYaml<PnpmWorkspace>(join(rootPath, 'pnpm-workspace.yaml'));
  if (pnpmWorkspace?.packages) {
    return pnpmWorkspace.packages;
  }

  return [];
}
