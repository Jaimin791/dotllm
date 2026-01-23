/**
 * AI Agent and LLM Framework Rules
 *
 * Comprehensive coding rules for AI agent development,
 * derived from official documentation and community best practices.
 */

import type { RuleSection } from '../../types/index.js';

/**
 * General AI Agent Development Rules
 * Derived from Antigravity and common agent patterns.
 */
export const aiAgentRules: RuleSection = {
    id: 'ai-agents',
    title: 'AI Agent Development Rules',
    description: 'Best practices for building AI agents and LLM-powered applications',
    rules: [
        { text: 'Design agents with single responsibilities - "Language model agents work best when focused on specific tasks."', isProhibition: false, source: 'LangChain Best Practices' },
        { text: 'Implement structured outputs (Pydantic/Zod) for reliable agent-tool interaction', isProhibition: false, source: 'OpenAI Function Calling Guide' },
        { text: 'Use "System Prompts" to define persona, constraints, and format', isProhibition: false, source: 'Anthropic Prompt Engineering' },
        { text: 'Implement retry logic with exponential backoff for all LLM API calls', isProhibition: false, source: 'Robust API Patterns' },
        { text: 'Log all LLM traces (inputs, outputs, latency) for debugging', isProhibition: false, source: 'LangSmith Observability' },
        { text: 'Protect sensitive context - "Never put API keys or PII in prompts."', isProhibition: false, source: 'OWASP Top 10 for LLMs' },
        { text: 'Design for failure - implement graceful fallbacks when models hallucinate or fail', isProhibition: false },
        { text: 'Use streaming for all user-facing agent responses to reduce perceived latency', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Hardcode API keys in source code - use environment variables', isProhibition: true, source: 'Security Best Practices' },
        { text: 'Trust LLM output blindly for critical actions - always validate', isProhibition: true, source: 'OWASP LLM02:2023' },
        { text: 'Create "God Agents" that try to handle every intent in one loop', isProhibition: true, source: 'LangGraph Concepts' },
        { text: 'Expose raw internal context or system prompts to end users', isProhibition: true, source: 'Prompt Injection Prevention' },
    ],
};

/**
 * LangChain Ecosystem Rules
 * Sourced from official LangChain documentation and migration guides.
 */
export const langchainRules: RuleSection = {
    id: 'langchain',
    title: 'LangChain Rules',
    description: 'Official LangChain best practices',
    rules: [
        { text: 'Use LangChain Expression Language (LCEL) for composable, observable chains', isProhibition: false, source: 'LangChain Docs: LCEL' },
        { text: 'Separate prompts from logic - store templates in dedicated files or constants', isProhibition: false },
        { text: 'Use `runnable.with_structured_output()` for type-safe extraction', isProhibition: false, source: 'LangChain: Structured Output' },
        { text: 'Implement `.batch()` for concurrent processing of inputs', isProhibition: false, source: 'LangChain: Runnable Interface' },
        { text: 'Use `astream_events` regarding granular streaming updates', isProhibition: false },
        { text: 'Use `RunnableWithMessageHistory` for managing conversation capabilities', isProhibition: false, source: 'LangChain: Memory' },
    ],
    antiPatterns: [
        { text: 'Use deprecated `LLMChain` or `SequentialChain` - migrate to LCEL', isProhibition: true, source: 'LangChain v0.2 Migration Guide' },
        { text: 'Import from top-level `langchain` - use `langchain-core` or `langchain-community`', isProhibition: true, source: 'LangChain Packaging Guide' },
        { text: 'Invoke LLMs synchronously in production web servers', isProhibition: true },
    ],
};

/**
 * LangGraph Rules
 * Sourced from LangGraph conceptual guides.
 */
export const langgraphRules: RuleSection = {
    id: 'langgraph',
    title: 'LangGraph Rules',
    description: 'State machine patterns for reliable agents',
    rules: [
        { text: 'Define explicit `State` schemas using TypedDict or Pydantic', isProhibition: false, source: 'LangGraph Concepts: State' },
        { text: 'Use `START` and `END` nodes to explicitly define flow boundaries', isProhibition: false },
        { text: 'Keep nodes as pure functions that return state updates', isProhibition: false, source: 'LangGraph: Nodes' },
        { text: 'Use `checkpointing` for human-in-the-loop and durable execution', isProhibition: false, source: 'LangGraph: Persistence' },
        { text: 'Use `conditional_edges` for dynamic routing logic', isProhibition: false },
        { text: 'Implement "Time Travel" debugging by inspecting checkpoints', isProhibition: false, source: 'LangSmith Debugging' },
    ],
    antiPatterns: [
        { text: 'Mutate state in place - always return partial updates', isProhibition: true, source: 'LangGraph Concepts' },
        { text: 'Create infinite loops without recursion limits or exit conditions', isProhibition: true },
        { text: 'Mix IO-heavy operations inside state transition logic', isProhibition: true },
    ],
};

/**
 * LangSmith Observability Rules
 * Sourced from LangSmith evaluation guides.
 */
export const langsmithRules: RuleSection = {
    id: 'langsmith',
    title: 'LangSmith Observability Rules',
    description: 'Best practices for tracing and evaluation',
    rules: [
        { text: 'Trace all agent runs - "Tracing is the first step to systematic improvement."', isProhibition: false, source: 'LangSmith QA' },
        { text: 'Use distinct project names for dev, staging, and prod environments', isProhibition: false },
        { text: 'Implement "Initial Deployment with Online Evaluation" to catch regressions', isProhibition: false, source: 'LangSmith Evaluation Life Cycle' },
        { text: 'Use `feedback` API to capture user signals (thumbs up/down)', isProhibition: false },
        { text: 'Create datasets from interesting production traces (failures/successes)', isProhibition: false, source: 'LangSmith Datasets' },
    ],
    antiPatterns: [
        { text: 'Use "chain" as the only run name - use descriptive names', isProhibition: true },
        { text: 'Evaluate only on "vibes" - establish quantitative baselines', isProhibition: true, source: 'LangSmith Best Practices' },
    ],
};

/**
 * CrewAI Rules
 * Sourced from CrewAI documentation.
 */
export const crewaiRules: RuleSection = {
    id: 'crewai',
    title: 'CrewAI Rules',
    description: 'Multi-agent orchestration patterns',
    rules: [
        { text: 'Assign distinct `Roles` and `Goals` to every agent', isProhibition: false, source: 'CrewAI Docs: Agents' },
        { text: 'Provide a clear `Backstory` to guide agent behavior and tone', isProhibition: false },
        { text: 'Use `Hierarchical` process for complex decision making', isProhibition: false, source: 'CrewAI: Processes' },
        { text: 'Implement custom tools using the `@tool` decorator', isProhibition: false },
        { text: 'Define expected outputs for every task', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Leave task descriptions vague - be specific about deliverables', isProhibition: true },
        { text: 'Use sequential process for independent tasks - parallelize them', isProhibition: true },
    ],
};

/**
 * RAG Rules
 * Sourced from Pinecone, Weaviate, and RAG best practices.
 */
export const ragRules: RuleSection = {
    id: 'rag',
    title: 'RAG (Retrieval-Augmented Generation) Rules',
    description: 'Patterns for high-quality retrieval systems',
    rules: [
        { text: 'Use "Hybrid Search" (keyword + semantic) for better recall', isProhibition: false, source: 'Pinecone Best Practices' },
        { text: 'Implement "Parent Document Retrieval" or "Small-to-Big" chunking', isProhibition: false, source: 'Advanced RAG Patterns' },
        { text: 'Use "Reranking" (e.g., Cohere) to improve relevance of retrieved contexts', isProhibition: false, source: 'RAG Evaluation Studies' },
        { text: 'Include citation metadata (source, page, author) in context', isProhibition: false },
        { text: 'Filter chunks by metadata to reduce noise', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Retrieve excessively large contexts purely by similarity - use thresholds', isProhibition: true },
        { text: 'Ignore chunk overlap - context can be lost at boundaries', isProhibition: true },
        { text: 'Use naive splitting on structured documents (JSON, Code)', isProhibition: true },
    ],
};

/**
 * Prompt Engineering Rules
 * Sourced from Anthropic, OpenAI, and Google guides.
 */
export const promptEngineeringRules: RuleSection = {
    id: 'prompt-engineering',
    title: 'Prompt Engineering Rules',
    description: 'Evidence-based prompting strategies',
    rules: [
        { text: 'Use "Chain of Thought" (Ask model to think step-by-step)', isProhibition: false, source: 'Wei et al. (2022)' },
        { text: 'Put directives at the end of the prompt for better adherence (Recency Bias)', isProhibition: false, source: 'Anthropic Guide' },
        { text: 'Use XML tags (e.g., <document>) to structure input data', isProhibition: false, source: 'Anthropic Guide' },
        { text: 'Provide "Few-Shot" examples for complex formatting tasks', isProhibition: false, source: 'OpenAI Best Practices' },
        { text: 'Assign a persona ("You are an expert engineer...")', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use negative constraints ("Do not do X") - prefer positive instructions ("Instead do Y")', isProhibition: true, source: 'Prompt Engineering Guide' },
        { text: 'Mix instructions and data without delimiters', isProhibition: true },
    ],
};

/**
 * AutoGen Rules
 */
export const autogenRules: RuleSection = {
    id: 'autogen',
    title: 'AutoGen Rules',
    description: 'Microsoft AutoGen best practices',
    rules: [
        { text: 'Use `UserProxyAgent` for human oversight and code execution', isProhibition: false, source: 'AutoGen Docs' },
        { text: 'Configure `docker` for safe code execution sandboxing', isProhibition: false },
        { text: 'Define clear termination conditions for group chats', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Execute generated code directly on host machine', isProhibition: true, source: 'Security Warning' },
    ],
};

/**
 * LlamaIndex Rules
 */
export const llamaindexRules: RuleSection = {
    id: 'llamaindex',
    title: 'LlamaIndex Rules',
    description: 'LlamaIndex best practices',
    rules: [
        { text: 'Use `VectorStoreIndex` for unstructured text and `SummaryIndex` for summaries', isProhibition: false },
        { text: 'Persist indices to disk using `StorageContext` to avoid re-indexing', isProhibition: false },
        { text: 'Use `QueryEngine` for asking questions over data', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Recreate indices on every run - use persistence', isProhibition: true },
    ],
};
