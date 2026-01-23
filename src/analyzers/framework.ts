/**
 * Framework and library detection
 */

import { join } from 'path';
import type {
  Framework,
  AIFramework,
  BuildTool,
  TestFramework,
  LintTool,
  Database,
  InfraTool,
  Dependency,
} from '../types/index.js';
import { pathExists, findFiles } from '../utils/index.js';

/** Dependency name to framework mapping */
const FRAMEWORK_DEPS: Record<string, Framework> = {
  // React ecosystem
  react: 'react',
  next: 'nextjs',
  remix: 'remix',
  '@remix-run/react': 'remix',
  gatsby: 'react', // Treat as React

  // Vue ecosystem
  vue: 'vue',
  nuxt: 'nuxt',

  // Angular
  '@angular/core': 'angular',

  // Svelte
  svelte: 'svelte',
  '@sveltejs/kit': 'sveltekit',

  // Astro
  astro: 'astro',

  // Node.js frameworks
  express: 'express',
  '@nestjs/core': 'nestjs',
  fastify: 'fastify',
  hono: 'hono',
  koa: 'express', // Similar enough

  // Electron
  electron: 'electron',

  // Python frameworks
  fastapi: 'fastapi',
  django: 'django',
  flask: 'flask',
  starlette: 'starlette',

  // Go frameworks (from go.mod)
  'github.com/gin-gonic/gin': 'gin',
  'github.com/labstack/echo': 'echo',
  'github.com/gofiber/fiber': 'fiber',

  // Rust frameworks (from Cargo.toml)
  'actix-web': 'actix',
  axum: 'axum',
  rocket: 'rocket',

  // Ruby frameworks
  rails: 'rails',
  sinatra: 'sinatra',
};

/** Build tool dependencies */
const BUILD_TOOL_DEPS: Record<string, BuildTool> = {
  vite: 'vite',
  webpack: 'webpack',
  esbuild: 'esbuild',
  rollup: 'rollup',
  parcel: 'parcel',
  turbo: 'turbo',
  nx: 'nx',
  lerna: 'lerna',
};

/** Test framework dependencies */
const TEST_FRAMEWORK_DEPS: Record<string, TestFramework> = {
  jest: 'jest',
  vitest: 'vitest',
  mocha: 'mocha',
  '@playwright/test': 'playwright',
  playwright: 'playwright',
  cypress: 'cypress',
  pytest: 'pytest',
  rspec: 'rspec',
};

/** Lint tool dependencies */
const LINT_TOOL_DEPS: Record<string, LintTool> = {
  eslint: 'eslint',
  prettier: 'prettier',
  '@biomejs/biome': 'biome',
  biome: 'biome',
  ruff: 'ruff',
  black: 'black',
  flake8: 'flake8',
  mypy: 'mypy',
  pylint: 'pylint',
  clippy: 'clippy',
  rustfmt: 'rustfmt',
  rubocop: 'rubocop',
};

/** Database/ORM dependencies */
const DATABASE_DEPS: Record<string, Database> = {
  prisma: 'prisma',
  '@prisma/client': 'prisma',
  'drizzle-orm': 'drizzle',
  typeorm: 'typeorm',
  sequelize: 'sequelize',
  mongoose: 'mongoose',
  pg: 'postgresql',
  mysql2: 'mysql',
  'better-sqlite3': 'sqlite',
  redis: 'redis',
  ioredis: 'redis',
  '@elastic/elasticsearch': 'elasticsearch',
  sqlalchemy: 'sqlalchemy',
  psycopg2: 'postgresql',
  pymongo: 'mongodb',
};

/** AI Framework dependencies */
const AI_FRAMEWORK_DEPS: Record<string, AIFramework> = {
  // LangChain ecosystem (Python)
  langchain: 'langchain',
  'langchain-core': 'langchain-core',
  'langchain-community': 'langchain-community',
  'langchain-openai': 'langchain-openai',
  'langchain-anthropic': 'langchain-anthropic',
  'langchain-google-genai': 'langchain-google',
  'langchain-google-vertexai': 'langchain-google',
  langgraph: 'langgraph',
  'langgraph-sdk': 'langgraph',
  langsmith: 'langsmith',
  langserve: 'langserve',

  // LangChain ecosystem (JavaScript/TypeScript)
  '@langchain/core': 'langchain-core',
  '@langchain/community': 'langchain-community',
  '@langchain/openai': 'langchain-openai',
  '@langchain/anthropic': 'langchain-anthropic',
  '@langchain/google-genai': 'langchain-google',
  '@langchain/langgraph': 'langgraph',

  // Other agent frameworks
  crewai: 'crewai',
  'crewai-tools': 'crewai',
  autogen: 'autogen',
  'pyautogen': 'autogen',
  'llama-index': 'llamaindex',
  'llama-index-core': 'llamaindex',
  llamaindex: 'llamaindex',
  'semantic-kernel': 'semantic-kernel',
  'haystack-ai': 'haystack',
  'farm-haystack': 'haystack',
  dspy: 'dspy',
  'dspy-ai': 'dspy',

  // LLM Providers
  openai: 'openai',
  anthropic: 'anthropic',
  '@anthropic-ai/sdk': 'anthropic',
  '@google/generative-ai': 'google-ai',
  'google-generativeai': 'google-ai',
  cohere: 'cohere',
  'cohere-ai': 'cohere',
  transformers: 'huggingface',
  huggingface_hub: 'huggingface',
  '@huggingface/inference': 'huggingface',
  ollama: 'ollama',
  'ollama-ai-provider': 'ollama',

  // Vector stores
  '@pinecone-database/pinecone': 'pinecone',
  'pinecone-client': 'pinecone',
  chromadb: 'chroma',
  'chromadb-client': 'chroma',
  weaviate: 'weaviate',
  'weaviate-client': 'weaviate',
  'qdrant-client': 'qdrant',
  pymilvus: 'milvus',
  pgvector: 'pgvector',

  // Orchestration tools
  prefect: 'prefect',
  dagster: 'dagster',
  apache_airflow: 'airflow',
  airflow: 'airflow',
};

/**
 * Detect frameworks from dependencies
 */
export function detectFrameworks(deps: Dependency[]): Framework[] {
  const frameworks: Framework[] = [];
  const depNames = new Set(deps.map((d) => d.name.toLowerCase()));

  for (const [depName, framework] of Object.entries(FRAMEWORK_DEPS)) {
    if (depNames.has(depName.toLowerCase())) {
      if (!frameworks.includes(framework)) {
        frameworks.push(framework);
      }
    }
  }

  // Prioritize specific frameworks over generic ones
  // e.g., if Next.js is detected, React is implied
  if (frameworks.includes('nextjs') && frameworks.includes('react')) {
    return frameworks.filter((f) => f !== 'react');
  }
  if (frameworks.includes('nuxt') && frameworks.includes('vue')) {
    return frameworks.filter((f) => f !== 'vue');
  }
  if (frameworks.includes('sveltekit') && frameworks.includes('svelte')) {
    return frameworks.filter((f) => f !== 'svelte');
  }

  return frameworks;
}

/**
 * Detect AI frameworks from dependencies
 */
export function detectAIFrameworks(deps: Dependency[]): AIFramework[] {
  const aiFrameworks: AIFramework[] = [];
  const depNames = new Set(deps.map((d) => d.name.toLowerCase()));

  for (const [depName, framework] of Object.entries(AI_FRAMEWORK_DEPS)) {
    if (depNames.has(depName.toLowerCase())) {
      if (!aiFrameworks.includes(framework)) {
        aiFrameworks.push(framework);
      }
    }
  }

  // Group related frameworks for better categorization
  // If langchain-core is detected, also mark as langchain ecosystem
  if (
    aiFrameworks.some((f) =>
      ['langchain-core', 'langchain-community', 'langchain-openai', 'langchain-anthropic', 'langchain-google'].includes(f)
    ) &&
    !aiFrameworks.includes('langchain')
  ) {
    aiFrameworks.unshift('langchain');
  }

  return aiFrameworks;
}

/**
 * Check if project is an AI agent project
 */
export function isAIAgentProject(aiFrameworks: AIFramework[]): boolean {
  const agentFrameworks: AIFramework[] = [
    'langchain',
    'langchain-core',
    'langgraph',
    'crewai',
    'autogen',
    'llamaindex',
    'semantic-kernel',
    'haystack',
    'dspy',
  ];

  return aiFrameworks.some((f) => agentFrameworks.includes(f));
}

/**
 * Detect build tools from dependencies
 */
export function detectBuildTools(deps: Dependency[], rootPath: string): BuildTool[] {
  const tools: BuildTool[] = [];
  const depNames = new Set(deps.map((d) => d.name.toLowerCase()));

  for (const [depName, tool] of Object.entries(BUILD_TOOL_DEPS)) {
    if (depNames.has(depName.toLowerCase())) {
      if (!tools.includes(tool)) {
        tools.push(tool);
      }
    }
  }

  // Check for config files
  if (pathExists(join(rootPath, 'turbo.json'))) {
    if (!tools.includes('turbo')) tools.push('turbo');
  }
  if (pathExists(join(rootPath, 'nx.json'))) {
    if (!tools.includes('nx')) tools.push('nx');
  }
  if (pathExists(join(rootPath, 'lerna.json'))) {
    if (!tools.includes('lerna')) tools.push('lerna');
  }

  return tools;
}

/**
 * Detect test frameworks from dependencies
 */
export function detectTestFrameworks(deps: Dependency[], rootPath: string): TestFramework[] {
  const frameworks: TestFramework[] = [];
  const depNames = new Set(deps.map((d) => d.name.toLowerCase()));

  for (const [depName, framework] of Object.entries(TEST_FRAMEWORK_DEPS)) {
    if (depNames.has(depName.toLowerCase())) {
      if (!frameworks.includes(framework)) {
        frameworks.push(framework);
      }
    }
  }

  // Check for test config files
  if (
    pathExists(join(rootPath, 'jest.config.js')) ||
    pathExists(join(rootPath, 'jest.config.ts')) ||
    pathExists(join(rootPath, 'jest.config.mjs'))
  ) {
    if (!frameworks.includes('jest')) frameworks.push('jest');
  }

  if (
    pathExists(join(rootPath, 'vitest.config.ts')) ||
    pathExists(join(rootPath, 'vitest.config.js'))
  ) {
    if (!frameworks.includes('vitest')) frameworks.push('vitest');
  }

  if (
    pathExists(join(rootPath, 'playwright.config.ts')) ||
    pathExists(join(rootPath, 'playwright.config.js'))
  ) {
    if (!frameworks.includes('playwright')) frameworks.push('playwright');
  }

  if (
    pathExists(join(rootPath, 'cypress.config.ts')) ||
    pathExists(join(rootPath, 'cypress.config.js')) ||
    pathExists(join(rootPath, 'cypress.json'))
  ) {
    if (!frameworks.includes('cypress')) frameworks.push('cypress');
  }

  if (pathExists(join(rootPath, 'pytest.ini')) || pathExists(join(rootPath, 'conftest.py'))) {
    if (!frameworks.includes('pytest')) frameworks.push('pytest');
  }

  return frameworks;
}

/**
 * Detect lint/format tools
 */
export function detectLintTools(deps: Dependency[], rootPath: string): LintTool[] {
  const tools: LintTool[] = [];
  const depNames = new Set(deps.map((d) => d.name.toLowerCase()));

  for (const [depName, tool] of Object.entries(LINT_TOOL_DEPS)) {
    if (depNames.has(depName.toLowerCase())) {
      if (!tools.includes(tool)) {
        tools.push(tool);
      }
    }
  }

  // Check for config files
  const eslintConfigs = [
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.eslintrc.yaml',
    'eslint.config.js',
    'eslint.config.mjs',
  ];
  if (eslintConfigs.some((c) => pathExists(join(rootPath, c)))) {
    if (!tools.includes('eslint')) tools.push('eslint');
  }

  const prettierConfigs = [
    '.prettierrc',
    '.prettierrc.js',
    '.prettierrc.json',
    '.prettierrc.yml',
    '.prettierrc.yaml',
    'prettier.config.js',
  ];
  if (prettierConfigs.some((c) => pathExists(join(rootPath, c)))) {
    if (!tools.includes('prettier')) tools.push('prettier');
  }

  if (pathExists(join(rootPath, 'biome.json'))) {
    if (!tools.includes('biome')) tools.push('biome');
  }

  if (pathExists(join(rootPath, 'ruff.toml')) || pathExists(join(rootPath, '.ruff.toml'))) {
    if (!tools.includes('ruff')) tools.push('ruff');
  }

  return tools;
}

/**
 * Detect database/ORM usage
 */
export function detectDatabases(deps: Dependency[], rootPath: string): Database[] {
  const databases: Database[] = [];
  const depNames = new Set(deps.map((d) => d.name.toLowerCase()));

  for (const [depName, db] of Object.entries(DATABASE_DEPS)) {
    if (depNames.has(depName.toLowerCase())) {
      if (!databases.includes(db)) {
        databases.push(db);
      }
    }
  }

  // Check for Prisma schema
  if (pathExists(join(rootPath, 'prisma/schema.prisma'))) {
    if (!databases.includes('prisma')) databases.push('prisma');
  }

  return databases;
}

/**
 * Detect infrastructure tools
 */
export function detectInfraTools(rootPath: string): InfraTool[] {
  const tools: InfraTool[] = [];

  if (pathExists(join(rootPath, 'Dockerfile')) || pathExists(join(rootPath, 'dockerfile'))) {
    tools.push('docker');
  }

  if (
    pathExists(join(rootPath, 'docker-compose.yml')) ||
    pathExists(join(rootPath, 'docker-compose.yaml')) ||
    pathExists(join(rootPath, 'compose.yml')) ||
    pathExists(join(rootPath, 'compose.yaml'))
  ) {
    tools.push('docker-compose');
  }

  // Check for Kubernetes manifests
  // Simple heuristic: check for common k8s directories
  if (
    pathExists(join(rootPath, 'k8s')) ||
    pathExists(join(rootPath, 'kubernetes')) ||
    pathExists(join(rootPath, 'charts'))
  ) {
    tools.push('kubernetes');
  }

  // Terraform
  const tfFiles = findFiles(rootPath, (name) => name.endsWith('.tf'), 3);
  if (tfFiles.length > 0 || pathExists(join(rootPath, 'terraform'))) {
    tools.push('terraform');
  }

  // Pulumi
  if (pathExists(join(rootPath, 'Pulumi.yaml')) || pathExists(join(rootPath, 'Pulumi.yml'))) {
    tools.push('pulumi');
  }

  // Serverless
  if (
    pathExists(join(rootPath, 'serverless.yml')) ||
    pathExists(join(rootPath, 'serverless.yaml')) ||
    pathExists(join(rootPath, 'serverless.ts'))
  ) {
    tools.push('serverless');
  }

  // Vercel
  if (pathExists(join(rootPath, 'vercel.json'))) {
    tools.push('vercel');
  }

  // Netlify
  if (pathExists(join(rootPath, 'netlify.toml'))) {
    tools.push('netlify');
  }

  return tools;
}

/**
 * Check if project has tests
 */
export function hasTests(rootPath: string): boolean {
  // Check for test directories
  const testDirs = ['test', 'tests', '__tests__', 'spec', 'specs'];
  for (const dir of testDirs) {
    if (pathExists(join(rootPath, dir))) return true;
  }

  // Check for test files
  const testFiles = findFiles(
    rootPath,
    (name) =>
      name.includes('.test.') ||
      name.includes('.spec.') ||
      name.includes('_test.') ||
      name.includes('_spec.'),
    5
  );

  return testFiles.length > 0;
}

/**
 * Check if project has CI/CD
 */
export function hasCICD(rootPath: string): boolean {
  return (
    pathExists(join(rootPath, '.github/workflows')) ||
    pathExists(join(rootPath, '.gitlab-ci.yml')) ||
    pathExists(join(rootPath, '.circleci')) ||
    pathExists(join(rootPath, 'Jenkinsfile')) ||
    pathExists(join(rootPath, 'azure-pipelines.yml')) ||
    pathExists(join(rootPath, '.travis.yml'))
  );
}
