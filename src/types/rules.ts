/**
 * Types for rule generation
 */

/** A single coding rule */
export interface Rule {
  text: string;
  isProhibition: boolean; // "DO NOT" rules
}

/** A section of related rules */
export interface RuleSection {
  id: string;
  title: string;
  description?: string;
  rules: Rule[];
  antiPatterns?: Rule[];
}

/** Complete rules document structure */
export interface RulesDocument {
  generatedAt: string;
  projectName: string;
  sections: RuleSection[];
}

/** A section in the context document */
export interface ContextSection {
  id: string;
  title: string;
  content: string;
}

/** Complete context document structure */
export interface ContextDocument {
  generatedAt: string;
  projectName: string;
  sections: ContextSection[];
}
