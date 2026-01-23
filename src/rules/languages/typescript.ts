/**
 * TypeScript-specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const typescriptRules: RuleSection = {
    id: 'typescript',
    title: 'TypeScript Rules',
    description: 'Strict TypeScript coding standards',
    rules: [
        { text: 'Use explicit return types for all exported functions and public methods', isProhibition: false, source: 'TypeScript Handbook: Functions' },
        { text: 'Prefer `interface` over `type` for object shapes that may be extended', isProhibition: false, source: 'TypeScript Docs: Interfaces vs Types' },
        { text: 'Use `unknown` instead of `any` and apply type guards for narrowing', isProhibition: false, source: 'TypeScript: safe-any' },
        { text: 'Use `const` assertions (`as const`) for literal types and readonly data', isProhibition: false, source: 'TypeScript: Literal Inference' },
        { text: 'Use discriminated unions for complex state with a shared `type` or `kind` field', isProhibition: false, source: 'TypeScript: Discriminated Unions' },
        { text: 'Enable and respect `strict` mode in tsconfig.json', isProhibition: false, source: 'TypeScript: Strictness' },
        { text: 'Use `readonly` for properties that should not be mutated', isProhibition: false },
        { text: 'Prefer `Record<K, V>` over `{ [key: string]: V }` for index signatures', isProhibition: false, source: 'TypeScript: utility types' },
        { text: 'Use template literal types for string patterns when applicable', isProhibition: false },
        { text: 'Export types alongside their implementations for discoverability', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use `@ts-ignore` or `@ts-expect-error` without a clear explanation', isProhibition: true, source: 'TSLint: ban-ts-ignore' },
        { text: 'Use `any` in function parameters, return types, or variable declarations', isProhibition: true, source: 'TypeScript: no-explicit-any' },
        { text: 'Disable TypeScript strict mode or ESLint rules with inline comments', isProhibition: true },
        { text: 'Use non-null assertion (`!`) without documenting why it\'s safe', isProhibition: true, source: 'TypeScript: no-non-null-assertion' },
        { text: 'Cast with `as` to silence the compiler instead of fixing types', isProhibition: true },
        { text: 'Use `Function` type - use specific function signatures instead', isProhibition: true, source: 'TypeScript: ban-types' },
        { text: 'Use `Object` or `{}` as types - use `Record<string, unknown>` or specific types', isProhibition: true, source: 'TypeScript: ban-types' },
    ],
};

export const javascriptRules: RuleSection = {
    id: 'javascript',
    title: 'JavaScript Rules',
    description: 'JavaScript coding standards',
    rules: [
        { text: 'Use `const` by default, `let` when reassignment is needed', isProhibition: false, source: 'Airbnb Style Guide' },
        { text: 'Use arrow functions for callbacks and anonymous functions', isProhibition: false, source: 'Google JS Style Guide' },
        { text: 'Use template literals for string interpolation', isProhibition: false },
        { text: 'Use destructuring for object and array access', isProhibition: false, source: 'Airbnb Style Guide' },
        { text: 'Use optional chaining (`?.`) and nullish coalescing (`??`) for safe access', isProhibition: false, source: 'Modern JS Features' },
        { text: 'Use `async/await` over raw Promises for readability', isProhibition: false, source: 'Google JS Style Guide' },
        { text: 'Use ES modules (`import/export`) over CommonJS (`require`)', isProhibition: false, source: 'Node.js Best Practices' },
    ],
    antiPatterns: [
        { text: 'Use `var` - use `const` or `let` instead', isProhibition: true, source: 'MDN: var' },
        { text: 'Use `==` or `!=` - use strict equality (`===`, `!==`)', isProhibition: true, source: 'Airbnb Style Guide' },
        { text: 'Mutate function parameters directly', isProhibition: true, source: 'Airbnb Style Guide' },
        { text: 'Use `eval()` or `new Function()` with dynamic code', isProhibition: true, source: 'OWASP Security' },
    ],
};
