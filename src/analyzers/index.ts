/**
 * Main analyzer orchestrator
 */

import type { AnalysisResult } from '../types/index.js';
import { detectLanguages, hasTypeScript } from './language.js';
import {
  detectPackageManagers,
  getAllDependencies,
  isMonorepo as checkMonorepo,
  getWorkspaces,
} from './package-manager.js';
import {
  detectFrameworks,
  detectAIFrameworks,
  detectBuildTools,
  detectTestFrameworks,
  detectLintTools,
  detectDatabases,
  detectInfraTools,
  hasTests as checkHasTests,
  hasCICD as checkHasCICD,
} from './framework.js';
import {
  analyzeFileTree,
  inferFolderResponsibilities,
  identifyCriticalPaths,
} from './file-tree.js';
import { parseConfigFiles, getProjectName } from './config-parser.js';

/**
 * Perform complete codebase analysis
 */
export async function analyzeCodebase(rootPath: string): Promise<AnalysisResult> {
  // Get project name
  const projectName = getProjectName(rootPath);

  // Detect languages
  const languages = detectLanguages(rootPath);

  // Detect package managers
  const packageManagers = detectPackageManagers(rootPath);

  // Get all dependencies
  const dependencies = getAllDependencies(rootPath);

  // Detect frameworks from dependencies
  const frameworks = detectFrameworks(dependencies);

  // Detect build tools
  const buildTools = detectBuildTools(dependencies, rootPath);

  // Detect test frameworks
  const testFrameworks = detectTestFrameworks(dependencies, rootPath);

  // Detect lint tools
  const lintTools = detectLintTools(dependencies, rootPath);

  // Detect databases
  const databases = detectDatabases(dependencies, rootPath);

  // Detect AI frameworks
  const aiFrameworks = detectAIFrameworks(dependencies);

  // Detect infrastructure tools
  const infraTools = detectInfraTools(rootPath);

  // Analyze file structure
  const folderStructure = analyzeFileTree(rootPath);
  const folderResponsibilities = inferFolderResponsibilities(rootPath);
  const criticalPaths = identifyCriticalPaths(rootPath);

  // Parse config files
  const configFiles = parseConfigFiles(rootPath);

  // Check monorepo
  const isMonorepoProject = checkMonorepo(rootPath);
  const workspaces = isMonorepoProject ? getWorkspaces(rootPath) : undefined;

  // Additional flags
  const hasTypeScriptFlag = hasTypeScript(rootPath);
  const hasTestsFlag = checkHasTests(rootPath);
  const hasCICDFlag = checkHasCICD(rootPath);
  const hasDockerFlag = infraTools.includes('docker') || infraTools.includes('docker-compose');
  const hasInfraAsCodeFlag = infraTools.includes('terraform') || infraTools.includes('pulumi');

  return {
    projectName,
    projectRoot: rootPath,
    languages,
    packageManagers,
    frameworks,
    buildTools,
    testFrameworks,
    lintTools,
    infraTools,
    databases,
    aiFrameworks,
    dependencies,
    folderStructure,
    folderResponsibilities,
    criticalPaths,
    configFiles,
    isMonorepo: isMonorepoProject,
    workspaces,
    hasTypeScript: hasTypeScriptFlag,
    hasTests: hasTestsFlag,
    hasCICD: hasCICDFlag,
    hasDocker: hasDockerFlag,
    hasInfraAsCode: hasInfraAsCodeFlag,
  };
}

export { detectLanguages } from './language.js';
export { detectPackageManagers, isMonorepo, getWorkspaces } from './package-manager.js';
export {
  detectFrameworks,
  detectAIFrameworks,
  isAIAgentProject,
  detectBuildTools,
  detectTestFrameworks,
} from './framework.js';
export {
  analyzeFileTree,
  inferFolderResponsibilities,
  identifyCriticalPaths,
} from './file-tree.js';
export { parseConfigFiles, getProjectName, getProjectDescription } from './config-parser.js';
export { detectIDE, type IDE, type IDEInfo, type IDEDetectionResult } from './ide.js';
