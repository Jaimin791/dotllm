/**
 * @fileoverview Detection utilities for parsing configuration files
 * @module utils/detect
 *
 * Provides safe parsing utilities for YAML and TOML files,
 * along with common detection helper functions.
 */

import { readFile, pathExists } from './fs.js';
import YAML from 'yaml';
import TOML from 'toml';

/**
 * Safely parses a YAML file.
 *
 * @typeParam T - Expected shape of the parsed YAML
 * @param path - Path to the YAML file
 * @returns Parsed object, or null if parsing fails
 *
 * @example
 * ```typescript
 * interface DockerCompose {
 *   version: string;
 *   services: Record<string, unknown>;
 * }
 *
 * const compose = parseYaml<DockerCompose>('docker-compose.yml');
 * ```
 */
export function parseYaml<T = Record<string, unknown>>(path: string): T | null {
  const content = readFile(path);
  if (content === null) {
    return null;
  }

  try {
    const parsed = YAML.parse(content);
    return parsed as T;
  } catch {
    // YAML parse error - file exists but is invalid
    return null;
  }
}

/**
 * Safely parses a TOML file.
 *
 * @typeParam T - Expected shape of the parsed TOML
 * @param path - Path to the TOML file
 * @returns Parsed object, or null if parsing fails
 *
 * @example
 * ```typescript
 * interface PyProject {
 *   project?: { name: string; version: string };
 * }
 *
 * const pyproject = parseToml<PyProject>('pyproject.toml');
 * ```
 */
export function parseToml<T = Record<string, unknown>>(path: string): T | null {
  const content = readFile(path);
  if (content === null) {
    return null;
  }

  try {
    const parsed = TOML.parse(content);
    return parsed as T;
  } catch {
    // TOML parse error - file exists but is invalid
    return null;
  }
}

/**
 * Checks if any of the specified files exist in a directory.
 *
 * @param dir - Directory to check
 * @param files - Array of file names to look for
 * @returns True if at least one file exists
 *
 * @example
 * ```typescript
 * if (hasAnyFile('/project', ['package.json', 'package-lock.json'])) {
 *   // Node.js project
 * }
 * ```
 */
export function hasAnyFile(dir: string, files: string[]): boolean {
  return files.some((file) => pathExists(`${dir}/${file}`));
}

/**
 * Returns the path to the first existing file from a list.
 *
 * @param dir - Directory to check
 * @param files - Array of file names to look for (in priority order)
 * @returns Full path to the first existing file, or null
 *
 * @example
 * ```typescript
 * const lockFile = getFirstExisting('/project', [
 *   'pnpm-lock.yaml',
 *   'yarn.lock',
 *   'package-lock.json',
 * ]);
 * ```
 */
export function getFirstExisting(dir: string, files: string[]): string | null {
  for (const file of files) {
    const path = `${dir}/${file}`;
    if (pathExists(path)) {
      return path;
    }
  }
  return null;
}

/**
 * Removes duplicate values from an array while preserving order.
 *
 * @typeParam T - Type of array elements
 * @param arr - Array to deduplicate
 * @returns New array with unique values
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Checks if an array of strings contains any of the given patterns.
 * Case-insensitive matching.
 *
 * @param arr - Array of strings to search
 * @param patterns - Patterns to look for
 * @returns True if any pattern is found in any array element
 */
export function containsAny(arr: string[], patterns: string[]): boolean {
  const lowerArr = arr.map((s) => s.toLowerCase());
  const lowerPatterns = patterns.map((s) => s.toLowerCase());

  return lowerPatterns.some((pattern) => lowerArr.some((item) => item.includes(pattern)));
}

/**
 * Safely accesses a nested property in an object using dot notation.
 *
 * @typeParam T - Expected type of the property value
 * @param obj - Object to access
 * @param path - Dot-separated path (e.g., 'a.b.c')
 * @param defaultValue - Value to return if path doesn't exist
 * @returns Property value or default value
 *
 * @example
 * ```typescript
 * const config = { database: { host: 'localhost' } };
 * const host = getProperty(config, 'database.host', 'default');
 * // host = 'localhost'
 *
 * const port = getProperty(config, 'database.port', 5432);
 * // port = 5432 (default)
 * ```
 */
export function getProperty<T>(obj: Record<string, unknown>, path: string, defaultValue: T): T {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    if (typeof current !== 'object') {
      return defaultValue;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return (current as T) ?? defaultValue;
}

/**
 * Normalizes a dependency name for comparison.
 * Handles scoped packages and different casing.
 *
 * @param name - Dependency name to normalize
 * @returns Normalized lowercase name
 */
export function normalizeDependencyName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Checks if a string matches any of the given patterns.
 * Supports simple glob patterns with * wildcard.
 *
 * @param str - String to match
 * @param patterns - Patterns to match against
 * @returns True if any pattern matches
 */
export function matchesAnyPattern(str: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    if (pattern.includes('*')) {
      // Simple glob matching
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');
      if (regex.test(str)) {
        return true;
      }
    } else if (str.toLowerCase() === pattern.toLowerCase()) {
      return true;
    }
  }
  return false;
}
