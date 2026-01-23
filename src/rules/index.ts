/**
 * Rule registry - maps detected stack to applicable rules
 */

import type { AnalysisResult } from '../types/index.js';
import type { RuleSection } from '../types/rules.js';

import {
  typescriptRules,
  javascriptRules,
  pythonRules,
  fastapiRules,
  djangoRules,
  goRules,
  rustRules,
} from './languages/index.js';
import {
  reactRules,
  nextjsRules,
  vueRules,
  angularRules,
  expressRules,
  nestjsRules,
  honoRules,
  aiAgentRules,
  langchainRules,
  langgraphRules,
  langsmithRules,
  crewaiRules,
  ragRules,
  promptEngineeringRules,
  autogenRules,
  llamaindexRules,
} from './frameworks/index.js';
import {
  testingRules,
  gitRules,
  errorHandlingRules,
  namingRules,
  performanceRules,
  securityRules,
} from './tooling/index.js';

/**
 * Get all applicable rules based on analysis result
 */
export function getApplicableRules(analysis: AnalysisResult): RuleSection[] {
  const sections: RuleSection[] = [];

  // Language rules
  if (analysis.languages.includes('typescript')) {
    sections.push(typescriptRules);
  } else if (analysis.languages.includes('javascript')) {
    sections.push(javascriptRules);
  }

  if (analysis.languages.includes('python')) {
    sections.push(pythonRules);
  }

  if (analysis.languages.includes('go')) {
    sections.push(goRules);
  }

  if (analysis.languages.includes('rust')) {
    sections.push(rustRules);
  }

  // Frontend framework rules
  if (analysis.frameworks.includes('nextjs')) {
    sections.push(nextjsRules);
  } else if (analysis.frameworks.includes('react')) {
    sections.push(reactRules);
  }

  if (analysis.frameworks.includes('vue') || analysis.frameworks.includes('nuxt')) {
    sections.push(vueRules);
  }

  if (analysis.frameworks.includes('angular')) {
    sections.push(angularRules);
  }

  // Backend framework rules
  if (analysis.frameworks.includes('fastapi')) {
    sections.push(fastapiRules);
  }

  if (analysis.frameworks.includes('django')) {
    sections.push(djangoRules);
  }

  if (analysis.frameworks.includes('express')) {
    sections.push(expressRules);
  }

  if (analysis.frameworks.includes('nestjs')) {
    sections.push(nestjsRules);
  }

  if (analysis.frameworks.includes('hono')) {
    sections.push(honoRules);
  }

  // Always include naming conventions
  sections.push(namingRules);

  // Include testing rules if tests are detected
  if (analysis.hasTests || analysis.testFrameworks.length > 0) {
    sections.push(testingRules);
  }

  // Always include error handling
  sections.push(errorHandlingRules);

  // Always include git rules
  sections.push(gitRules);

  // Include performance rules for frontend projects
  if (
    analysis.frameworks.some((f) =>
      ['react', 'nextjs', 'vue', 'nuxt', 'angular', 'svelte', 'sveltekit'].includes(f)
    )
  ) {
    sections.push(performanceRules);
  }

  // Always include security rules
  sections.push(securityRules);

  // ─────────────────────────────────────────────────────────────────────────
  // AI Agent Framework Rules
  // ─────────────────────────────────────────────────────────────────────────

  // Check if this is an AI agent project
  const hasAIFrameworks = analysis.aiFrameworks && analysis.aiFrameworks.length > 0;

  if (hasAIFrameworks) {
    // Always include general AI agent rules for any AI project
    sections.push(aiAgentRules);

    // LangChain ecosystem
    if (
      analysis.aiFrameworks.some((f) =>
        ['langchain', 'langchain-core', 'langchain-community', 'langchain-openai', 'langchain-anthropic', 'langchain-google'].includes(f)
      )
    ) {
      sections.push(langchainRules);
    }

    // LangGraph
    if (analysis.aiFrameworks.includes('langgraph')) {
      sections.push(langgraphRules);
    }

    // LangSmith
    if (analysis.aiFrameworks.includes('langsmith')) {
      sections.push(langsmithRules);
    }

    // CrewAI
    if (analysis.aiFrameworks.includes('crewai')) {
      sections.push(crewaiRules);
    }

    // AutoGen
    if (analysis.aiFrameworks.includes('autogen')) {
      sections.push(autogenRules);
    }

    // LlamaIndex
    if (analysis.aiFrameworks.includes('llamaindex')) {
      sections.push(llamaindexRules);
    }

    // Include RAG rules if vector stores are detected
    if (
      analysis.aiFrameworks.some((f) =>
        ['pinecone', 'chroma', 'weaviate', 'qdrant', 'milvus', 'pgvector'].includes(f)
      )
    ) {
      sections.push(ragRules);
    }

    // Always include prompt engineering rules for AI projects
    sections.push(promptEngineeringRules);
  }

  return sections;
}

/**
 * Count total rules across sections
 */
export function countRules(sections: RuleSection[]): number {
  let count = 0;
  for (const section of sections) {
    count += section.rules.length;
    count += section.antiPatterns?.length || 0;
  }
  return count;
}

export * from './languages/index.js';
export * from './frameworks/index.js';
export * from './tooling/index.js';
