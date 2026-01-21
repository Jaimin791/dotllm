/**
 * @fileoverview File system utilities for codebase analysis
 * @module utils/fs
 *
 * Provides safe, well-typed file system operations with proper
 * error handling and logging support.
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, basename, relative } from 'path';
import type { FolderEntry } from '../types/index.js';
import {
  IGNORED_DIRECTORIES,
  IGNORED_FILES,
  IMPORTANT_DOT_FILES,
  MAX_SCAN_DEPTH,
} from '../constants.js';

/**
 * Checks if a path exists in the file system.
 *
 * @param path - Absolute or relative path to check
 * @returns True if the path exists, false otherwise
 *
 * @example
 * ```typescript
 * if (pathExists('/path/to/file.ts')) {
 *   // File exists
 * }
 * ```
 */
export function pathExists(path: string): boolean {
  try {
    return existsSync(path);
  } catch {
    return false;
  }
}

/**
 * Checks if a path is a directory.
 *
 * @param path - Path to check
 * @returns True if path is a directory, false otherwise
 */
export function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Checks if a path is a file.
 *
 * @param path - Path to check
 * @returns True if path is a file, false otherwise
 */
export function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/**
 * Reads file contents as a UTF-8 string.
 *
 * @param path - Path to the file
 * @returns File contents as string, or null if read fails
 *
 * @example
 * ```typescript
 * const content = readFile('/path/to/config.json');
 * if (content !== null) {
 *   // Process content
 * }
 * ```
 */
export function readFile(path: string): string | null {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Reads and parses a JSON file.
 *
 * @typeParam T - Expected shape of the parsed JSON
 * @param path - Path to the JSON file
 * @returns Parsed JSON object, or null if read/parse fails
 *
 * @example
 * ```typescript
 * interface PackageJson {
 *   name: string;
 *   dependencies?: Record<string, string>;
 * }
 *
 * const pkg = readJsonFile<PackageJson>('/path/to/package.json');
 * if (pkg) {
 *   console.log(pkg.name);
 * }
 * ```
 */
export function readJsonFile<T = Record<string, unknown>>(path: string): T | null {
  const content = readFile(path);
  if (content === null) {
    return null;
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Checks if a directory name should be ignored during scanning.
 *
 * @param name - Directory name (not full path)
 * @returns True if the directory should be ignored
 */
function shouldIgnoreDirectory(name: string): boolean {
  return IGNORED_DIRECTORIES.includes(name as (typeof IGNORED_DIRECTORIES)[number]);
}

/**
 * Checks if a file name should be ignored during scanning.
 *
 * @param name - File name (not full path)
 * @returns True if the file should be ignored
 */
function shouldIgnoreFile(name: string): boolean {
  // Check exact matches
  if (IGNORED_FILES.includes(name as (typeof IGNORED_FILES)[number])) {
    return true;
  }

  // Check patterns (simple glob matching)
  for (const pattern of IGNORED_FILES) {
    if (pattern.startsWith('*') && name.endsWith(pattern.slice(1))) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a dot file/directory is important enough to include.
 *
 * @param name - Name of the file/directory starting with '.'
 * @returns True if it should be included in scanning
 */
function isImportantDotFile(name: string): boolean {
  return IMPORTANT_DOT_FILES.some((important) => name === important || name.startsWith(important));
}

/**
 * Recursively scans a directory and builds a folder tree structure.
 *
 * @param rootPath - Path to the directory to scan
 * @param maxDepth - Maximum depth to scan (default: from constants)
 * @param currentDepth - Current recursion depth (internal use)
 * @returns Array of folder entries representing the directory structure
 *
 * @example
 * ```typescript
 * const tree = scanDirectory('/path/to/project');
 * for (const entry of tree) {
 *   console.log(`${entry.type}: ${entry.name}`);
 * }
 * ```
 */
export function scanDirectory(
  rootPath: string,
  maxDepth: number = MAX_SCAN_DEPTH,
  currentDepth: number = 0
): FolderEntry[] {
  // Prevent infinite recursion
  if (currentDepth >= maxDepth) {
    return [];
  }

  try {
    const entries = readdirSync(rootPath, { withFileTypes: true });
    const result: FolderEntry[] = [];

    for (const entry of entries) {
      const name = entry.name;
      const fullPath = join(rootPath, name);

      // Apply ignore rules
      if (entry.isDirectory()) {
        if (shouldIgnoreDirectory(name)) {
          continue;
        }
      } else if (entry.isFile()) {
        if (shouldIgnoreFile(name)) {
          continue;
        }
      }

      // Handle hidden files/directories
      if (name.startsWith('.') && !isImportantDotFile(name)) {
        continue;
      }

      // Build entry
      if (entry.isDirectory()) {
        result.push({
          name,
          path: fullPath,
          type: 'directory',
          children: scanDirectory(fullPath, maxDepth, currentDepth + 1),
        });
      } else if (entry.isFile()) {
        result.push({
          name,
          path: fullPath,
          type: 'file',
        });
      }
    }

    // Sort: directories first, then alphabetically
    return result.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch {
    // Return empty array on permission errors or other issues
    return [];
  }
}

/**
 * Finds all files matching a predicate function.
 *
 * @param rootPath - Directory to search in
 * @param predicate - Function that returns true for matching files
 * @param maxDepth - Maximum depth to search
 * @returns Array of absolute paths to matching files
 *
 * @example
 * ```typescript
 * // Find all TypeScript files
 * const tsFiles = findFiles(
 *   '/path/to/project',
 *   (name) => name.endsWith('.ts')
 * );
 * ```
 */
export function findFiles(
  rootPath: string,
  predicate: (name: string, path: string) => boolean,
  maxDepth: number = MAX_SCAN_DEPTH
): string[] {
  const results: string[] = [];

  function scan(dir: string, depth: number): void {
    if (depth >= maxDepth) {
      return;
    }

    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const name = entry.name;
        const fullPath = join(dir, name);

        if (entry.isDirectory()) {
          // Skip ignored and hidden directories
          if (!shouldIgnoreDirectory(name) && !name.startsWith('.')) {
            scan(fullPath, depth + 1);
          }
        } else if (entry.isFile()) {
          if (predicate(name, fullPath)) {
            results.push(fullPath);
          }
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  scan(rootPath, 0);
  return results;
}

/**
 * Extracts the file extension from a filename.
 *
 * @param filename - Name of the file
 * @returns Lowercase extension without the dot, or empty string
 *
 * @example
 * ```typescript
 * getExtension('file.ts');     // 'ts'
 * getExtension('file.test.ts'); // 'ts'
 * getExtension('Dockerfile');   // ''
 * ```
 */
export function getExtension(filename: string): string {
  const base = basename(filename);
  const parts = base.split('.');

  if (parts.length < 2) {
    return '';
  }

  return parts.pop()?.toLowerCase() ?? '';
}

/**
 * Returns the relative path from a root directory.
 *
 * @param rootPath - Base path
 * @param filePath - Absolute file path
 * @returns Relative path from root to file
 */
export function getRelativePath(rootPath: string, filePath: string): string {
  return relative(rootPath, filePath);
}
