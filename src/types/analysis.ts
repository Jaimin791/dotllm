/**
 * @fileoverview Core type definitions for codebase analysis
 * @module types/analysis
 *
 * This module defines all the type aliases and interfaces used
 * throughout the dotllm package for representing
 * analysis results and detected project information.
 */

// ============================================================================
// Language Types
// ============================================================================

/**
 * Programming languages that can be detected.
 *
 * Detection is based on file extensions and configuration files.
 *
 * @example
 * ```typescript
 * const languages: Language[] = ['typescript', 'python'];
 * ```
 */
export type Language =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'kotlin'
  | 'ruby'
  | 'php'
  | 'csharp'
  | 'swift'
  | 'dart';

// ============================================================================
// Package Manager Types
// ============================================================================

/**
 * Package managers that can be detected.
 *
 * Detection is based on lock files and manifest files.
 *
 * @example
 * ```typescript
 * const managers: PackageManager[] = ['pnpm', 'poetry'];
 * ```
 */
export type PackageManager =
  | 'npm'
  | 'yarn'
  | 'pnpm'
  | 'bun'
  | 'pip'
  | 'poetry'
  | 'pipenv'
  | 'cargo'
  | 'go'
  | 'bundler'
  | 'composer'
  | 'maven'
  | 'gradle';

// ============================================================================
// Framework Types
// ============================================================================

/**
 * Frameworks and libraries that can be detected.
 *
 * Detection is based on dependencies and configuration files.
 *
 * @example
 * ```typescript
 * const frameworks: Framework[] = ['nextjs', 'fastapi'];
 * ```
 */
export type Framework =
  // JavaScript/TypeScript Frontend
  | 'react'
  | 'nextjs'
  | 'vue'
  | 'nuxt'
  | 'angular'
  | 'svelte'
  | 'sveltekit'
  | 'remix'
  | 'astro'
  // JavaScript/TypeScript Backend
  | 'express'
  | 'nestjs'
  | 'fastify'
  | 'hono'
  // Desktop
  | 'electron'
  // Python
  | 'fastapi'
  | 'django'
  | 'flask'
  | 'starlette'
  // Go
  | 'gin'
  | 'echo'
  | 'fiber'
  // Rust
  | 'actix'
  | 'axum'
  | 'rocket'
  // Ruby
  | 'rails'
  | 'sinatra'
  // AI Agent Frameworks
  | 'langchain'
  | 'langgraph'
  | 'crewai'
  | 'autogen'
  | 'llamaindex'
  | 'semantic-kernel'
  | 'haystack'
  | 'dspy'
  | 'openai-agents'
  | 'anthropic-agents';

// ============================================================================
// AI Framework Types
// ============================================================================

/**
 * AI/ML frameworks and tools that can be detected.
 *
 * Detection is based on dependencies and configuration files.
 *
 * @example
 * ```typescript
 * const aiFrameworks: AIFramework[] = ['langchain', 'langgraph'];
 * ```
 */
export type AIFramework =
  // LangChain Ecosystem
  | 'langchain'
  | 'langchain-core'
  | 'langchain-community'
  | 'langchain-openai'
  | 'langchain-anthropic'
  | 'langchain-google'
  | 'langgraph'
  | 'langsmith'
  | 'langserve'
  // Other Agent Frameworks
  | 'crewai'
  | 'autogen'
  | 'llamaindex'
  | 'semantic-kernel'
  | 'haystack'
  | 'dspy'
  // LLM Providers
  | 'openai'
  | 'anthropic'
  | 'google-ai'
  | 'cohere'
  | 'huggingface'
  | 'ollama'
  // Vector Stores
  | 'pinecone'
  | 'chroma'
  | 'weaviate'
  | 'qdrant'
  | 'milvus'
  | 'pgvector'
  // Orchestration
  | 'prefect'
  | 'dagster'
  | 'airflow';

// ============================================================================
// Tooling Types
// ============================================================================

/**
 * Build tools that can be detected.
 */
export type BuildTool =
  | 'vite'
  | 'webpack'
  | 'esbuild'
  | 'rollup'
  | 'parcel'
  | 'turbo'
  | 'nx'
  | 'lerna';

/**
 * Testing frameworks that can be detected.
 */
export type TestFramework =
  | 'jest'
  | 'vitest'
  | 'mocha'
  | 'playwright'
  | 'cypress'
  | 'pytest'
  | 'unittest'
  | 'go-test'
  | 'rust-test'
  | 'rspec';

/**
 * Linting and formatting tools that can be detected.
 */
export type LintTool =
  | 'eslint'
  | 'prettier'
  | 'biome'
  | 'ruff'
  | 'black'
  | 'flake8'
  | 'mypy'
  | 'pylint'
  | 'golangci-lint'
  | 'clippy'
  | 'rustfmt'
  | 'rubocop';

/**
 * Infrastructure and deployment tools that can be detected.
 */
export type InfraTool =
  | 'docker'
  | 'docker-compose'
  | 'kubernetes'
  | 'terraform'
  | 'pulumi'
  | 'aws-cdk'
  | 'serverless'
  | 'vercel'
  | 'netlify';

/**
 * Database technologies and ORMs that can be detected.
 */
export type Database =
  | 'postgresql'
  | 'mysql'
  | 'sqlite'
  | 'mongodb'
  | 'redis'
  | 'elasticsearch'
  | 'prisma'
  | 'drizzle'
  | 'typeorm'
  | 'sequelize'
  | 'sqlalchemy'
  | 'mongoose';

// ============================================================================
// Structure Types
// ============================================================================

/**
 * Represents a file or directory in the project structure.
 *
 * This is used to build a tree representation of the project
 * for display in the generated context document.
 */
export interface FolderEntry {
  /** Name of the file or directory */
  name: string;

  /** Absolute path to the file or directory */
  path: string;

  /** Whether this is a file or directory */
  type: 'file' | 'directory';

  /** Child entries (only for directories) */
  children?: FolderEntry[];
}

/**
 * A project dependency with version information.
 */
export interface Dependency {
  /** Package name (e.g., 'react', 'fastapi') */
  name: string;

  /** Version specifier (e.g., '^18.0.0', '>=1.0.0') */
  version: string;

  /** Whether this is a development-only dependency */
  isDev: boolean;
}

/**
 * A detected configuration file with its parsed contents.
 */
export interface ConfigFile {
  /** Relative path to the config file */
  path: string;

  /** Type/category of the config (e.g., 'typescript', 'eslint') */
  type: string;

  /** Parsed contents of the config file */
  content: Record<string, unknown>;
}

/**
 * Describes the purpose of a folder in the project.
 *
 * @example
 * ```typescript
 * const responsibility: FolderResponsibility = {
 *   path: 'src/components',
 *   responsibility: 'Reusable UI components',
 *   ownership: 'Frontend',
 * };
 * ```
 */
export interface FolderResponsibility {
  /** Relative path to the folder */
  path: string;

  /** Description of what this folder contains */
  responsibility: string;

  /** Team or area that owns this folder */
  ownership?: string;
}

/**
 * Identifies a path in the project that requires careful handling.
 *
 * Critical paths are areas where changes have significant blast radius
 * and should be handled with extra care.
 *
 * @example
 * ```typescript
 * const criticalPath: CriticalPath = {
 *   path: 'src/auth',
 *   risk: 'HIGH',
 *   reason: 'Authentication logic - security critical',
 * };
 * ```
 */
export interface CriticalPath {
  /** Relative path to the critical area */
  path: string;

  /** Risk level for changes to this area */
  risk: 'HIGH' | 'MEDIUM' | 'LOW';

  /** Explanation of why this area is critical */
  reason: string;
}

// ============================================================================
// Analysis Result
// ============================================================================

/**
 * Complete result of analyzing a codebase.
 *
 * This is the main output of the analysis phase and is used
 * as input to the rule selection and document generation phases.
 *
 * @example
 * ```typescript
 * const result: AnalysisResult = await analyzeCodebase('/path/to/project');
 * console.log(`Detected ${result.languages.length} languages`);
 * ```
 */
export interface AnalysisResult {
  // ─────────────────────────────────────────────────────────────────────────
  // Basic Information
  // ─────────────────────────────────────────────────────────────────────────

  /** Name of the project (from package.json or directory name) */
  projectName: string;

  /** Absolute path to the project root */
  projectRoot: string;

  // ─────────────────────────────────────────────────────────────────────────
  // Detected Stack
  // ─────────────────────────────────────────────────────────────────────────

  /** Programming languages used in the project */
  languages: Language[];

  /** Package managers used in the project */
  packageManagers: PackageManager[];

  /** Frameworks and libraries used */
  frameworks: Framework[];

  /** Build tools detected */
  buildTools: BuildTool[];

  /** Testing frameworks detected */
  testFrameworks: TestFramework[];

  /** Linting and formatting tools detected */
  lintTools: LintTool[];

  /** Infrastructure tools detected */
  infraTools: InfraTool[];

  /** Database technologies detected */
  databases: Database[];

  /** AI frameworks and tools detected */
  aiFrameworks: AIFramework[];

  // ─────────────────────────────────────────────────────────────────────────
  // Dependencies
  // ─────────────────────────────────────────────────────────────────────────

  /** All detected dependencies across package managers */
  dependencies: Dependency[];

  // ─────────────────────────────────────────────────────────────────────────
  // Project Structure
  // ─────────────────────────────────────────────────────────────────────────

  /** Tree structure of the project folders */
  folderStructure: FolderEntry[];

  /** Inferred responsibilities for key folders */
  folderResponsibilities: FolderResponsibility[];

  /** Critical paths that need careful handling */
  criticalPaths: CriticalPath[];

  // ─────────────────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────────────────

  /** Detected configuration files */
  configFiles: ConfigFile[];

  // ─────────────────────────────────────────────────────────────────────────
  // Monorepo Detection
  // ─────────────────────────────────────────────────────────────────────────

  /** Whether the project is a monorepo */
  isMonorepo: boolean;

  /** Workspace patterns (if monorepo) */
  workspaces?: string[];

  // ─────────────────────────────────────────────────────────────────────────
  // Feature Flags
  // ─────────────────────────────────────────────────────────────────────────

  /** Whether TypeScript is used */
  hasTypeScript: boolean;

  /** Whether tests are present */
  hasTests: boolean;

  /** Whether CI/CD is configured */
  hasCICD: boolean;

  /** Whether Docker is used */
  hasDocker: boolean;

  /** Whether infrastructure as code is present */
  hasInfraAsCode: boolean;
}
