/**
 * @fileoverview Language detection based on file extensions and configuration files
 * @module analyzers/language
 *
 * Detects programming languages used in a codebase by analyzing:
 * - File extensions (strongest signal)
 * - Configuration files (e.g., tsconfig.json, pyproject.toml)
 * - Project manifests
 */

import { join } from 'path';
import type { Language } from '../types/index.js';
import { pathExists, findFiles, getExtension } from '../utils/index.js';

/**
 * Mapping of file extensions to their corresponding languages.
 * Extensions are stored without the leading dot.
 */
const EXTENSION_TO_LANGUAGE: Readonly<Record<string, Language>> = {
  // TypeScript
  ts: 'typescript',
  tsx: 'typescript',
  mts: 'typescript',
  cts: 'typescript',

  // JavaScript
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',

  // Python
  py: 'python',
  pyw: 'python',
  pyi: 'python',

  // Go
  go: 'go',

  // Rust
  rs: 'rust',

  // Java
  java: 'java',

  // Kotlin
  kt: 'kotlin',
  kts: 'kotlin',

  // Ruby
  rb: 'ruby',
  rake: 'ruby',

  // PHP
  php: 'php',

  // C#
  cs: 'csharp',

  // Swift
  swift: 'swift',

  // Dart
  dart: 'dart',
} as const;

/**
 * Configuration files that definitively indicate language usage.
 * Presence of these files is a strong signal for the corresponding language.
 */
const CONFIG_FILE_TO_LANGUAGE: Readonly<Record<string, Language>> = {
  'tsconfig.json': 'typescript',
  'jsconfig.json': 'javascript',
  'pyproject.toml': 'python',
  'setup.py': 'python',
  'requirements.txt': 'python',
  'go.mod': 'go',
  'Cargo.toml': 'rust',
  'pom.xml': 'java',
  'build.gradle': 'java',
  'build.gradle.kts': 'kotlin',
  Gemfile: 'ruby',
  'composer.json': 'php',
  'Package.swift': 'swift',
  'pubspec.yaml': 'dart',
} as const;

/**
 * Minimum number of files to consider a language as "present" in the codebase.
 * Helps filter out incidental files.
 */
const MIN_FILE_COUNT = 1;

/**
 * Weight given to config file presence (counts as this many files).
 * Config files are stronger signals than individual source files.
 */
const CONFIG_FILE_WEIGHT = 100;

/**
 * Information about a detected language including file statistics.
 */
export interface LanguageInfo {
  /** The detected language */
  language: Language;

  /** Number of files with this language's extensions */
  fileCount: number;

  /** Percentage of source files using this language */
  percentage: number;
}

/**
 * Detects all programming languages used in a codebase.
 *
 * Detection is based on:
 * 1. Presence of language-specific config files (highest priority)
 * 2. Count of source files by extension
 *
 * @param rootPath - Absolute path to the project root
 * @returns Array of detected languages, sorted by prevalence
 *
 * @example
 * ```typescript
 * const languages = detectLanguages('/path/to/project');
 * // ['typescript', 'python'] for a mixed TS + Python project
 * ```
 */
export function detectLanguages(rootPath: string): Language[] {
  const languageCounts = new Map<Language, number>();

  // Phase 1: Check for config files (strong signals)
  for (const [configFile, language] of Object.entries(CONFIG_FILE_TO_LANGUAGE)) {
    if (pathExists(join(rootPath, configFile))) {
      const currentCount = languageCounts.get(language) ?? 0;
      languageCounts.set(language, currentCount + CONFIG_FILE_WEIGHT);
    }
  }

  // Phase 2: Scan source files by extension
  const sourceFiles = findFiles(rootPath, (name) => getExtension(name) in EXTENSION_TO_LANGUAGE);

  for (const file of sourceFiles) {
    const ext = getExtension(file);
    const language = EXTENSION_TO_LANGUAGE[ext];

    if (language) {
      const currentCount = languageCounts.get(language) ?? 0;
      languageCounts.set(language, currentCount + 1);
    }
  }

  // Phase 3: Filter and sort results
  const sortedLanguages = [...languageCounts.entries()]
    .filter(([, count]) => count >= MIN_FILE_COUNT)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  // Phase 4: Deduplicate related languages
  // If TypeScript is present, JavaScript is implied (TS compiles to JS)
  if (sortedLanguages.includes('typescript') && sortedLanguages.includes('javascript')) {
    return sortedLanguages.filter((lang) => lang !== 'javascript');
  }

  return sortedLanguages;
}

/**
 * Gets detailed statistics about language usage in the codebase.
 *
 * @param rootPath - Absolute path to the project root
 * @returns Array of language info objects with file counts and percentages
 *
 * @example
 * ```typescript
 * const stats = getLanguageStats('/path/to/project');
 * for (const { language, fileCount, percentage } of stats) {
 *   console.log(`${language}: ${fileCount} files (${percentage}%)`);
 * }
 * ```
 */
export function getLanguageStats(rootPath: string): LanguageInfo[] {
  const languageCounts = new Map<Language, number>();
  let totalFiles = 0;

  const sourceFiles = findFiles(rootPath, (name) => getExtension(name) in EXTENSION_TO_LANGUAGE);

  for (const file of sourceFiles) {
    const ext = getExtension(file);
    const language = EXTENSION_TO_LANGUAGE[ext];

    if (language) {
      const currentCount = languageCounts.get(language) ?? 0;
      languageCounts.set(language, currentCount + 1);
      totalFiles++;
    }
  }

  if (totalFiles === 0) {
    return [];
  }

  return [...languageCounts.entries()]
    .map(([language, fileCount]) => ({
      language,
      fileCount,
      percentage: Math.round((fileCount / totalFiles) * 100),
    }))
    .sort((a, b) => b.fileCount - a.fileCount);
}

/**
 * Checks if the project uses TypeScript.
 *
 * @param rootPath - Absolute path to the project root
 * @returns True if a tsconfig.json file exists
 *
 * @example
 * ```typescript
 * if (hasTypeScript('/path/to/project')) {
 *   // Apply TypeScript-specific rules
 * }
 * ```
 */
export function hasTypeScript(rootPath: string): boolean {
  return pathExists(join(rootPath, 'tsconfig.json'));
}

/**
 * Gets the primary language of the project.
 *
 * @param rootPath - Absolute path to the project root
 * @returns The most prevalent language, or null if none detected
 */
export function getPrimaryLanguage(rootPath: string): Language | null {
  const languages = detectLanguages(rootPath);
  return languages.length > 0 ? languages[0] : null;
}
