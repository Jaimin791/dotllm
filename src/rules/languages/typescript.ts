/**
 * TypeScript-specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const typescriptRules: RuleSection = {
    id: 'typescript',
    title: 'TypeScript Rules',
    description: 'Strict TypeScript coding standards',
    rules: [
        { text: 'Use explicit return types for all exported functions and public methods', isProhibition: false },
        { text: 'Prefer `interface` over `type` for object shapes that may be extended', isProhibition: false },
        { text: 'Use `unknown` instead of `any` and apply type guards for narrowing', isProhibition: false },
        { text: 'Use `const` assertions (`as const`) for literal types and readonly data', isProhibition: false },
        { text: 'Use discriminated unions for complex state with a shared `type` or `kind` field', isProhibition: false },
        { text: 'Enable and respect `strict` mode in tsconfig.json', isProhibition: false },
        { text: 'Use `readonly` for properties that should not be mutated', isProhibition: false },
        { text: 'Prefer `Record<K, V>` over `{ [key: string]: V }` for index signatures', isProhibition: false },
        { text: 'Use template literal types for string patterns when applicable', isProhibition: false },
        { text: 'Export types alongside their implementations for discoverability', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use `@ts-ignore` or `@ts-expect-error` without a clear explanation - fix the type error properly', isProhibition: true },
        { text: 'Use `any` in function parameters, return types, or variable declarations', isProhibition: true },
        { text: 'Disable TypeScript strict mode or ESLint rules with inline comments', isProhibition: true },
        { text: 'Use non-null assertion (`!`) without documenting why it\'s safe', isProhibition: true },
        { text: 'Cast with `as` to silence the compiler instead of fixing the underlying issue', isProhibition: true },
        { text: 'Use `Function` type - use specific function signatures instead', isProhibition: true },
        { text: 'Use `Object` or `{}` as types - use `Record<string, unknown>` or specific types', isProhibition: true },
        { text: 'Ignore compiler errors by loosening tsconfig settings', isProhibition: true },
    ],
};

export const javascriptRules: RuleSection = {
    id: 'javascript',
    title: 'JavaScript Rules',
    description: 'JavaScript coding standards',
    rules: [
        { text: 'Use `const` by default, `let` when reassignment is needed', isProhibition: false },
        { text: 'Use arrow functions for callbacks and anonymous functions', isProhibition: false },
        { text: 'Use template literals for string interpolation', isProhibition: false },
        { text: 'Use destructuring for object and array access', isProhibition: false },
        { text: 'Use optional chaining (`?.`) and nullish coalescing (`??`) for safe access', isProhibition: false },
        { text: 'Use `async/await` over raw Promises for readability', isProhibition: false },
        { text: 'Use ES modules (`import/export`) over CommonJS (`require/module.exports`)', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use `var` - use `const` or `let` instead', isProhibition: true },
        { text: 'Use `==` or `!=` - use strict equality (`===`, `!==`)', isProhibition: true },
        { text: 'Mutate function parameters directly', isProhibition: true },
        { text: 'Use `arguments` object - use rest parameters (`...args`)', isProhibition: true },
        { text: 'Use `eval()` or `new Function()` with dynamic code', isProhibition: true },
    ],
};
