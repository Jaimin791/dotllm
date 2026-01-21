/**
 * dotai
 * 
 * Auto-generate AI-ready context files from any codebase.
 */

export { analyzeCodebase } from './analyzers/index.js';
export { generateRulesMarkdown, generateContextMarkdown } from './generators/index.js';
export type { AnalysisResult, Language, Framework, PackageManager } from './types/index.js';
