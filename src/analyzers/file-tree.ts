/**
 * File tree analysis and folder structure detection
 */

import { join } from 'path';
import type { FolderEntry, FolderResponsibility, CriticalPath } from '../types/index.js';
import { scanDirectory, pathExists } from '../utils/index.js';

/** Known folder patterns and their responsibilities */
const FOLDER_PATTERNS: Record<string, string> = {
  // Source code
  src: 'Main source code directory',
  lib: 'Library code and utilities',
  app: 'Application entry points and routes',
  pages: 'Page components (Next.js/Nuxt pages router)',
  routes: 'Route handlers and definitions',
  api: 'API endpoints and handlers',

  // Components
  components: 'Reusable UI components',
  ui: 'UI primitives and design system components',
  widgets: 'Complex composed components',
  layouts: 'Page layout components',
  templates: 'Template components',

  // Features
  features: 'Feature-based modules',
  modules: 'Domain modules',
  domains: 'Domain-driven design modules',

  // State & Data
  store: 'State management (Redux, Zustand, etc.)',
  stores: 'State management stores',
  state: 'Application state',
  hooks: 'Custom React/Vue hooks',
  composables: 'Vue composables',
  queries: 'Data fetching queries',
  mutations: 'Data mutation handlers',

  // Backend
  controllers: 'Request handlers (MVC pattern)',
  services: 'Business logic layer',
  repositories: 'Data access layer',
  models: 'Data models and entities',
  entities: 'Database entities',
  schemas: 'Data schemas and validation',
  validators: 'Input validation logic',
  middleware: 'Request/response middleware',
  routers: 'API route definitions',
  handlers: 'Request handlers',

  // Utilities
  utils: 'Utility functions',
  helpers: 'Helper functions',
  common: 'Shared/common code',
  shared: 'Shared code across modules',
  core: 'Core functionality',

  // Types
  types: 'TypeScript type definitions',
  '@types': 'TypeScript declaration files',
  interfaces: 'Interface definitions',
  contracts: 'API contracts and interfaces',

  // Configuration
  config: 'Configuration files',
  configs: 'Configuration files',
  settings: 'Application settings',

  // Assets
  assets: 'Static assets (images, fonts, etc.)',
  public: 'Public static files',
  static: 'Static files',
  images: 'Image assets',
  icons: 'Icon assets',
  fonts: 'Font files',
  styles: 'CSS/SCSS stylesheets',
  css: 'CSS stylesheets',

  // Testing
  test: 'Test files',
  tests: 'Test files',
  __tests__: 'Jest test files',
  spec: 'Test specifications',
  specs: 'Test specifications',
  e2e: 'End-to-end tests',
  integration: 'Integration tests',
  unit: 'Unit tests',
  fixtures: 'Test fixtures and mocks',
  mocks: 'Mock implementations',
  __mocks__: 'Jest mock files',

  // Documentation
  docs: 'Documentation',
  documentation: 'Documentation',

  // Scripts & Tools
  scripts: 'Build and utility scripts',
  tools: 'Development tools',
  bin: 'Executable scripts',

  // Infrastructure
  infra: 'Infrastructure code',
  infrastructure: 'Infrastructure code',
  deploy: 'Deployment configurations',
  deployment: 'Deployment configurations',
  k8s: 'Kubernetes manifests',
  kubernetes: 'Kubernetes manifests',
  terraform: 'Terraform infrastructure',
  docker: 'Docker configurations',
  ci: 'CI/CD configurations',
  '.github': 'GitHub configurations and workflows',

  // Database
  migrations: 'Database migrations',
  seeds: 'Database seed data',
  seeders: 'Database seeders',
  prisma: 'Prisma schema and migrations',
  drizzle: 'Drizzle ORM files',

  // Monorepo
  packages: 'Monorepo packages',
  apps: 'Monorepo applications',
  libs: 'Monorepo libraries',
  workspaces: 'Workspace packages',
};

/** Critical paths that need careful handling */
const CRITICAL_PATTERNS: Array<{
  pattern: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}> = [
  { pattern: 'auth', risk: 'HIGH', reason: 'Authentication logic - security critical' },
  { pattern: 'security', risk: 'HIGH', reason: 'Security-related code' },
  { pattern: 'payment', risk: 'HIGH', reason: 'Payment processing - financial critical' },
  { pattern: 'billing', risk: 'HIGH', reason: 'Billing logic - financial critical' },
  { pattern: 'migrations', risk: 'HIGH', reason: 'Database schema changes - data integrity' },
  { pattern: 'prisma/schema', risk: 'HIGH', reason: 'Database schema definition' },
  { pattern: 'models', risk: 'MEDIUM', reason: 'Data models affect multiple parts of the system' },
  { pattern: 'entities', risk: 'MEDIUM', reason: 'Entity changes can break database operations' },
  { pattern: 'types', risk: 'MEDIUM', reason: 'Shared types affect multiple modules' },
  { pattern: 'contracts', risk: 'MEDIUM', reason: 'API contracts affect external integrations' },
  {
    pattern: 'config',
    risk: 'MEDIUM',
    reason: 'Configuration changes affect application behavior',
  },
  { pattern: 'middleware', risk: 'MEDIUM', reason: 'Middleware affects all requests' },
  { pattern: 'terraform', risk: 'HIGH', reason: 'Infrastructure as code - production impact' },
  { pattern: 'k8s', risk: 'HIGH', reason: 'Kubernetes configs affect deployment' },
  { pattern: '.github/workflows', risk: 'MEDIUM', reason: 'CI/CD changes can break deployments' },
];

/**
 * Analyze folder structure
 */
export function analyzeFileTree(rootPath: string, maxDepth: number = 4): FolderEntry[] {
  return scanDirectory(rootPath, maxDepth);
}

/**
 * Infer folder responsibilities from structure
 */
export function inferFolderResponsibilities(rootPath: string): FolderResponsibility[] {
  const responsibilities: FolderResponsibility[] = [];
  const tree = scanDirectory(rootPath, 2);

  function processEntry(entry: FolderEntry, parentPath: string = '') {
    if (entry.type !== 'directory') return;

    const name = entry.name.toLowerCase();
    const fullPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;

    if (FOLDER_PATTERNS[name]) {
      responsibilities.push({
        path: fullPath,
        responsibility: FOLDER_PATTERNS[name],
        ownership: inferOwnership(name),
      });
    }

    // Process children
    if (entry.children) {
      for (const child of entry.children) {
        processEntry(child, fullPath);
      }
    }
  }

  for (const entry of tree) {
    processEntry(entry);
  }

  return responsibilities;
}

/**
 * Infer ownership based on folder name
 */
function inferOwnership(folderName: string): string | undefined {
  const frontendFolders = [
    'components',
    'ui',
    'pages',
    'layouts',
    'hooks',
    'composables',
    'styles',
    'assets',
  ];
  const backendFolders = [
    'controllers',
    'services',
    'repositories',
    'models',
    'middleware',
    'routers',
    'handlers',
  ];
  const sharedFolders = ['types', 'utils', 'common', 'shared', 'core'];
  const infraFolders = ['terraform', 'k8s', 'kubernetes', 'docker', 'deploy', 'infra'];

  if (frontendFolders.includes(folderName)) return 'Frontend';
  if (backendFolders.includes(folderName)) return 'Backend';
  if (sharedFolders.includes(folderName)) return 'Shared';
  if (infraFolders.includes(folderName)) return 'Infrastructure';

  return undefined;
}

/**
 * Identify critical paths that need careful handling
 */
export function identifyCriticalPaths(rootPath: string): CriticalPath[] {
  const criticalPaths: CriticalPath[] = [];
  const tree = scanDirectory(rootPath, 4);

  function checkPath(entry: FolderEntry, parentPath: string = '') {
    const fullPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
    const pathLower = fullPath.toLowerCase();

    for (const pattern of CRITICAL_PATTERNS) {
      if (pathLower.includes(pattern.pattern.toLowerCase())) {
        // Avoid duplicates
        if (!criticalPaths.some((cp) => cp.path === fullPath)) {
          criticalPaths.push({
            path: fullPath,
            risk: pattern.risk,
            reason: pattern.reason,
          });
        }
        break;
      }
    }

    if (entry.children) {
      for (const child of entry.children) {
        checkPath(child, fullPath);
      }
    }
  }

  for (const entry of tree) {
    checkPath(entry);
  }

  // Sort by risk level
  const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return criticalPaths.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
}

/**
 * Generate a simple folder structure string for display
 */
export function generateFolderStructureString(
  entries: FolderEntry[],
  prefix: string = '',
  maxDepth: number = 3,
  currentDepth: number = 0
): string {
  if (currentDepth >= maxDepth) return '';

  let result = '';
  const lastIndex = entries.length - 1;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === lastIndex;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = isLast ? '    ' : '│   ';

    result += `${prefix}${connector}${entry.name}${entry.type === 'directory' ? '/' : ''}\n`;

    if (entry.type === 'directory' && entry.children && entry.children.length > 0) {
      result += generateFolderStructureString(
        entry.children,
        prefix + childPrefix,
        maxDepth,
        currentDepth + 1
      );
    }
  }

  return result;
}

/**
 * Detect project type based on folder structure
 */
export function detectProjectType(rootPath: string): string {
  // Check for common patterns
  if (pathExists(join(rootPath, 'apps')) && pathExists(join(rootPath, 'packages'))) {
    return 'Monorepo';
  }

  if (
    pathExists(join(rootPath, 'app')) &&
    (pathExists(join(rootPath, 'app/api')) || pathExists(join(rootPath, 'app/layout.tsx')))
  ) {
    return 'Next.js App';
  }

  if (pathExists(join(rootPath, 'pages')) && pathExists(join(rootPath, 'next.config.js'))) {
    return 'Next.js App (Pages Router)';
  }

  if (pathExists(join(rootPath, 'src/main.ts')) && pathExists(join(rootPath, 'angular.json'))) {
    return 'Angular Application';
  }

  if (pathExists(join(rootPath, 'src/App.vue')) || pathExists(join(rootPath, 'nuxt.config.ts'))) {
    return 'Vue/Nuxt Application';
  }

  if (pathExists(join(rootPath, 'src/routes')) && pathExists(join(rootPath, 'svelte.config.js'))) {
    return 'SvelteKit Application';
  }

  if (pathExists(join(rootPath, 'controllers')) && pathExists(join(rootPath, 'services'))) {
    return 'Backend API Service';
  }

  if (pathExists(join(rootPath, 'src/index.ts')) || pathExists(join(rootPath, 'src/index.js'))) {
    return 'TypeScript/JavaScript Library';
  }

  if (pathExists(join(rootPath, 'main.py')) || pathExists(join(rootPath, 'app.py'))) {
    return 'Python Application';
  }

  if (pathExists(join(rootPath, 'main.go')) || pathExists(join(rootPath, 'cmd'))) {
    return 'Go Application';
  }

  if (pathExists(join(rootPath, 'src/main.rs')) || pathExists(join(rootPath, 'src/lib.rs'))) {
    return 'Rust Application/Library';
  }

  return 'Software Project';
}
