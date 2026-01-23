/**
 * @fileoverview Comprehensive tests for dotllm
 * 
 * Test coverage:
 * - Language detection
 * - Package manager detection
 * - Framework detection
 * - Rule generation
 * - Context generation
 * - Error handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { join } from 'path';

// ============================================================================
// Analyzer Tests
// ============================================================================

describe('Language Detection', () => {
    it('should export detectLanguages function', async () => {
        const { detectLanguages } = await import('../src/analyzers/language.js');
        expect(typeof detectLanguages).toBe('function');
    });

    it('should export hasTypeScript function', async () => {
        const { hasTypeScript } = await import('../src/analyzers/language.js');
        expect(typeof hasTypeScript).toBe('function');
    });

    it('should export getLanguageStats function', async () => {
        const { getLanguageStats } = await import('../src/analyzers/language.js');
        expect(typeof getLanguageStats).toBe('function');
    });
});

describe('Package Manager Detection', () => {
    it('should export detectPackageManagers function', async () => {
        const { detectPackageManagers } = await import('../src/analyzers/package-manager.js');
        expect(typeof detectPackageManagers).toBe('function');
    });

    it('should export isMonorepo function', async () => {
        const { isMonorepo } = await import('../src/analyzers/package-manager.js');
        expect(typeof isMonorepo).toBe('function');
    });

    it('should export parseNpmDependencies function', async () => {
        const { parseNpmDependencies } = await import('../src/analyzers/package-manager.js');
        expect(typeof parseNpmDependencies).toBe('function');
    });

    it('should export getAllDependencies function', async () => {
        const { getAllDependencies } = await import('../src/analyzers/package-manager.js');
        expect(typeof getAllDependencies).toBe('function');
    });
});

describe('Framework Detection', () => {
    it('should export detectFrameworks function', async () => {
        const { detectFrameworks } = await import('../src/analyzers/framework.js');
        expect(typeof detectFrameworks).toBe('function');
    });

    it('should export detectBuildTools function', async () => {
        const { detectBuildTools } = await import('../src/analyzers/framework.js');
        expect(typeof detectBuildTools).toBe('function');
    });

    it('should export detectTestFrameworks function', async () => {
        const { detectTestFrameworks } = await import('../src/analyzers/framework.js');
        expect(typeof detectTestFrameworks).toBe('function');
    });

    it('should export detectLintTools function', async () => {
        const { detectLintTools } = await import('../src/analyzers/framework.js');
        expect(typeof detectLintTools).toBe('function');
    });

    it('should detect React from dependencies', async () => {
        const { detectFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'react', version: '^18.0.0', isDev: false },
            { name: 'react-dom', version: '^18.0.0', isDev: false },
        ];

        const frameworks = detectFrameworks(deps);
        expect(frameworks).toContain('react');
    });

    it('should detect Next.js and not duplicate React', async () => {
        const { detectFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'next', version: '^14.0.0', isDev: false },
            { name: 'react', version: '^18.0.0', isDev: false },
        ];

        const frameworks = detectFrameworks(deps);
        expect(frameworks).toContain('nextjs');
        expect(frameworks).not.toContain('react'); // Should be deduplicated
    });

    it('should detect FastAPI in Python projects', async () => {
        const { detectFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'fastapi', version: '0.100.0', isDev: false },
            { name: 'uvicorn', version: '0.23.0', isDev: false },
        ];

        const frameworks = detectFrameworks(deps);
        expect(frameworks).toContain('fastapi');
    });
});

// ============================================================================
// AI Framework Detection Tests
// ============================================================================

describe('AI Framework Detection', () => {
    it('should export detectAIFrameworks function', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');
        expect(typeof detectAIFrameworks).toBe('function');
    });

    it('should export isAIAgentProject function', async () => {
        const { isAIAgentProject } = await import('../src/analyzers/framework.js');
        expect(typeof isAIAgentProject).toBe('function');
    });

    it('should detect LangChain from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'langchain', version: '0.1.0', isDev: false },
            { name: 'langchain-openai', version: '0.1.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('langchain');
        expect(aiFrameworks).toContain('langchain-openai');
    });

    it('should detect LangGraph from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'langgraph', version: '0.1.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('langgraph');
    });

    it('should detect LangSmith from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'langsmith', version: '0.1.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('langsmith');
    });

    it('should detect CrewAI from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'crewai', version: '0.1.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('crewai');
    });

    it('should detect AutoGen from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'pyautogen', version: '0.2.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('autogen');
    });

    it('should detect LlamaIndex from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'llama-index', version: '0.10.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('llamaindex');
    });

    it('should detect vector stores from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: '@pinecone-database/pinecone', version: '2.0.0', isDev: false },
            { name: 'chromadb', version: '1.0.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('pinecone');
        expect(aiFrameworks).toContain('chroma');
    });

    it('should detect OpenAI from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'openai', version: '4.0.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('openai');
    });

    it('should detect Anthropic from dependencies', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: '@anthropic-ai/sdk', version: '0.20.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('anthropic');
    });

    it('should add langchain if only langchain-core is detected', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: 'langchain-core', version: '0.1.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('langchain');
        expect(aiFrameworks).toContain('langchain-core');
    });

    it('should identify AI agent projects correctly', async () => {
        const { isAIAgentProject } = await import('../src/analyzers/framework.js');

        expect(isAIAgentProject(['langchain', 'openai'])).toBe(true);
        expect(isAIAgentProject(['langgraph'])).toBe(true);
        expect(isAIAgentProject(['crewai'])).toBe(true);
        expect(isAIAgentProject(['autogen'])).toBe(true);
        expect(isAIAgentProject(['openai'])).toBe(false); // Just LLM provider, not agent framework
        expect(isAIAgentProject(['pinecone'])).toBe(false); // Just vector store
        expect(isAIAgentProject([])).toBe(false);
    });

    it('should detect @langchain/ scoped packages for TypeScript projects', async () => {
        const { detectAIFrameworks } = await import('../src/analyzers/framework.js');

        const deps = [
            { name: '@langchain/core', version: '0.1.0', isDev: false },
            { name: '@langchain/openai', version: '0.1.0', isDev: false },
            { name: '@langchain/langgraph', version: '0.1.0', isDev: false },
        ];

        const aiFrameworks = detectAIFrameworks(deps);
        expect(aiFrameworks).toContain('langchain'); // Should be added since langchain-core is detected
        expect(aiFrameworks).toContain('langchain-core');
        expect(aiFrameworks).toContain('langchain-openai');
        expect(aiFrameworks).toContain('langgraph');
    });
});

// ============================================================================
// Rule Generation Tests
// ============================================================================

describe('Rule Generation', () => {
    it('should export getApplicableRules function', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');
        expect(typeof getApplicableRules).toBe('function');
    });

    it('should export countRules function', async () => {
        const { countRules } = await import('../src/rules/index.js');
        expect(typeof countRules).toBe('function');
    });

    it('should generate TypeScript rules for TypeScript projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'typescript')).toBe(true);
    });

    it('should generate React rules for React projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript'],
            frameworks: ['react'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'react')).toBe(true);
    });

    it('should generate Next.js rules for Next.js projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript'],
            frameworks: ['nextjs'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'nextjs')).toBe(true);
    });

    it('should NOT generate Python rules for non-Python projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript'],
            frameworks: ['react'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'python')).toBe(false);
        expect(rules.some(r => r.id === 'fastapi')).toBe(false);
        expect(rules.some(r => r.id === 'django')).toBe(false);
    });

    it('should include testing rules when tests are detected', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript'],
            testFrameworks: ['vitest'],
            hasTests: true,
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'testing')).toBe(true);
    });

    it('should always include security rules', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['javascript'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'security')).toBe(true);
    });

    it('should generate AI agent rules for LangChain projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['python'],
            aiFrameworks: ['langchain', 'langchain-openai'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'ai-agents')).toBe(true);
        expect(rules.some(r => r.id === 'langchain')).toBe(true);
        expect(rules.some(r => r.id === 'prompt-engineering')).toBe(true);
    });

    it('should generate LangGraph rules for LangGraph projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['python'],
            aiFrameworks: ['langchain', 'langgraph'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'langgraph')).toBe(true);
    });

    it('should generate LangSmith rules for LangSmith projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['python'],
            aiFrameworks: ['langchain', 'langsmith'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'langsmith')).toBe(true);
    });

    it('should generate CrewAI rules for CrewAI projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['python'],
            aiFrameworks: ['crewai'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'crewai')).toBe(true);
        expect(rules.some(r => r.id === 'ai-agents')).toBe(true);
    });

    it('should generate RAG rules when vector stores are detected', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['python'],
            aiFrameworks: ['langchain', 'pinecone', 'chroma'],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'rag')).toBe(true);
    });

    it('should NOT generate AI rules for non-AI projects', async () => {
        const { getApplicableRules } = await import('../src/rules/index.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript'],
            frameworks: ['react'],
            aiFrameworks: [],
        });

        const rules = getApplicableRules(mockAnalysis);

        expect(rules.some(r => r.id === 'ai-agents')).toBe(false);
        expect(rules.some(r => r.id === 'langchain')).toBe(false);
        expect(rules.some(r => r.id === 'langgraph')).toBe(false);
    });
});

// ============================================================================
// Output Generation Tests
// ============================================================================

describe('Rules Markdown Generation', () => {
    it('should export generateRulesMarkdown function', async () => {
        const { generateRulesMarkdown } = await import('../src/generators/rules.js');
        expect(typeof generateRulesMarkdown).toBe('function');
    });

    it('should generate valid markdown with header', async () => {
        const { generateRulesMarkdown } = await import('../src/generators/rules.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript'],
            frameworks: ['react'],
        });

        const markdown = generateRulesMarkdown(mockAnalysis);

        expect(markdown).toContain('# AI Coding Rules');
        expect(markdown).toContain('Auto-generated by dotllm');
        expect(markdown).toContain('DO NOT EDIT MANUALLY');
    });

    it('should include detected stack in output', async () => {
        const { generateRulesMarkdown } = await import('../src/generators/rules.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript', 'python'],
            frameworks: ['nextjs', 'fastapi'],
            packageManagers: ['pnpm', 'poetry'],
        });

        const markdown = generateRulesMarkdown(mockAnalysis);

        expect(markdown).toContain('typescript');
        expect(markdown).toContain('python');
        expect(markdown).toContain('nextjs');
        expect(markdown).toContain('fastapi');
    });

    it('should include DO NOT sections', async () => {
        const { generateRulesMarkdown } = await import('../src/generators/rules.js');

        const mockAnalysis = createMockAnalysis({
            languages: ['typescript'],
        });

        const markdown = generateRulesMarkdown(mockAnalysis);

        expect(markdown).toContain('### DO NOT');
        expect(markdown).toContain('❌');
    });
});

describe('Context Markdown Generation', () => {
    it('should export generateContextMarkdown function', async () => {
        const { generateContextMarkdown } = await import('../src/generators/context.js');
        expect(typeof generateContextMarkdown).toBe('function');
    });

    it('should generate valid markdown with header', async () => {
        const { generateContextMarkdown } = await import('../src/generators/context.js');

        const mockAnalysis = createMockAnalysis({
            projectName: 'my-awesome-project',
            languages: ['typescript'],
        });

        const markdown = generateContextMarkdown(mockAnalysis);

        expect(markdown).toContain('# AI Project Context');
        expect(markdown).toContain('Auto-generated by dotllm');
        expect(markdown).toContain('my-awesome-project');
    });

    it('should include folder structure section', async () => {
        const { generateContextMarkdown } = await import('../src/generators/context.js');

        const mockAnalysis = createMockAnalysis({});

        const markdown = generateContextMarkdown(mockAnalysis);

        expect(markdown).toContain('## Repository Structure');
    });

    it('should include critical paths if detected', async () => {
        const { generateContextMarkdown } = await import('../src/generators/context.js');

        const mockAnalysis = createMockAnalysis({
            criticalPaths: [
                { path: 'src/auth', risk: 'HIGH', reason: 'Authentication logic' },
            ],
        });

        const markdown = generateContextMarkdown(mockAnalysis);

        expect(markdown).toContain('Critical Paths');
        expect(markdown).toContain('src/auth');
        expect(markdown).toContain('HIGH');
    });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

describe('Error Classes', () => {
    it('should export CodebaseContextError', async () => {
        const { CodebaseContextError } = await import('../src/errors.js');
        expect(typeof CodebaseContextError).toBe('function');
    });

    it('should create error with code and context', async () => {
        const { CodebaseContextError } = await import('../src/errors.js');

        const error = new CodebaseContextError(
            'Test error',
            'TEST_ERROR',
            { foo: 'bar' }
        );

        expect(error.message).toBe('Test error');
        expect(error.code).toBe('TEST_ERROR');
        expect(error.context).toEqual({ foo: 'bar' });
    });

    it('should export specialized error types', async () => {
        const {
            FileNotFoundError,
            ParseError,
            AnalysisError
        } = await import('../src/errors.js');

        expect(typeof FileNotFoundError).toBe('function');
        expect(typeof ParseError).toBe('function');
        expect(typeof AnalysisError).toBe('function');
    });
});

// ============================================================================
// Constants Tests
// ============================================================================

describe('Constants', () => {
    it('should export IGNORED_DIRECTORIES', async () => {
        const { IGNORED_DIRECTORIES } = await import('../src/constants.js');

        expect(Array.isArray(IGNORED_DIRECTORIES)).toBe(true);
        expect(IGNORED_DIRECTORIES).toContain('node_modules');
        expect(IGNORED_DIRECTORIES).toContain('.git');
    });

    it('should export IDE_OUTPUT_FILES', async () => {
        const { IDE_OUTPUT_FILES } = await import('../src/constants.js');

        expect(IDE_OUTPUT_FILES.CURSOR).toBe('.cursor/rules/rules.mdc');
        expect(IDE_OUTPUT_FILES.CLAUDE_CODE).toBe('CLAUDE.md');
        expect(IDE_OUTPUT_FILES.ANTIGRAVITY).toBe('GEMINI.md');
        expect(IDE_OUTPUT_FILES.CODEX).toBe('AGENTS.md');
    });

    it('should export PACKAGE_INFO', async () => {
        const { PACKAGE_INFO } = await import('../src/constants.js');

        expect(PACKAGE_INFO.NAME).toBe('dotllm');
    });
});

// ============================================================================
// Utility Tests
// ============================================================================

describe('Utility Functions', () => {
    it('should export pathExists', async () => {
        const { pathExists } = await import('../src/utils/fs.js');
        expect(typeof pathExists).toBe('function');
    });

    it('should export readJsonFile', async () => {
        const { readJsonFile } = await import('../src/utils/fs.js');
        expect(typeof readJsonFile).toBe('function');
    });

    it('should export getExtension', async () => {
        const { getExtension } = await import('../src/utils/fs.js');

        expect(getExtension('file.ts')).toBe('ts');
        expect(getExtension('file.test.ts')).toBe('ts');
        expect(getExtension('Dockerfile')).toBe('');
    });

    it('should export parseYaml', async () => {
        const { parseYaml } = await import('../src/utils/detect.js');
        expect(typeof parseYaml).toBe('function');
    });

    it('should export parseToml', async () => {
        const { parseToml } = await import('../src/utils/detect.js');
        expect(typeof parseToml).toBe('function');
    });
});

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Creates a mock analysis result for testing.
 */
function createMockAnalysis(overrides: Partial<{
    projectName: string;
    projectRoot: string;
    languages: string[];
    packageManagers: string[];
    frameworks: string[];
    buildTools: string[];
    testFrameworks: string[];
    lintTools: string[];
    infraTools: string[];
    databases: string[];
    aiFrameworks: string[];
    dependencies: Array<{ name: string; version: string; isDev: boolean }>;
    folderStructure: Array<{ name: string; path: string; type: 'file' | 'directory' }>;
    folderResponsibilities: Array<{ path: string; responsibility: string }>;
    criticalPaths: Array<{ path: string; risk: 'HIGH' | 'MEDIUM' | 'LOW'; reason: string }>;
    configFiles: Array<{ path: string; type: string; content: Record<string, unknown> }>;
    isMonorepo: boolean;
    workspaces: string[];
    hasTypeScript: boolean;
    hasTests: boolean;
    hasCICD: boolean;
    hasDocker: boolean;
    hasInfraAsCode: boolean;
}> = {}) {
    return {
        projectName: overrides.projectName ?? 'test-project',
        projectRoot: overrides.projectRoot ?? '/test',
        languages: overrides.languages ?? [],
        packageManagers: overrides.packageManagers ?? [],
        frameworks: overrides.frameworks ?? [],
        buildTools: overrides.buildTools ?? [],
        testFrameworks: overrides.testFrameworks ?? [],
        lintTools: overrides.lintTools ?? [],
        infraTools: overrides.infraTools ?? [],
        databases: overrides.databases ?? [],
        aiFrameworks: overrides.aiFrameworks ?? [],
        dependencies: overrides.dependencies ?? [],
        folderStructure: overrides.folderStructure ?? [],
        folderResponsibilities: overrides.folderResponsibilities ?? [],
        criticalPaths: overrides.criticalPaths ?? [],
        configFiles: overrides.configFiles ?? [],
        isMonorepo: overrides.isMonorepo ?? false,
        workspaces: overrides.workspaces,
        hasTypeScript: overrides.hasTypeScript ?? false,
        hasTests: overrides.hasTests ?? false,
        hasCICD: overrides.hasCICD ?? false,
        hasDocker: overrides.hasDocker ?? false,
        hasInfraAsCode: overrides.hasInfraAsCode ?? false,
    };
}
