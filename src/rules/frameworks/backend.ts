/**
 * Backend framework rules
 */

import type { RuleSection } from '../../types/index.js';

export const expressRules: RuleSection = {
    id: 'express',
    title: 'Express.js Rules',
    description: 'Express.js API standards',
    rules: [
        { text: 'Use middleware for cross-cutting concerns (auth, logging, validation)', isProhibition: false },
        { text: 'Use Router for modular route organization', isProhibition: false },
        { text: 'Use async/await with proper error handling middleware', isProhibition: false },
        { text: 'Use helmet.js for security headers', isProhibition: false },
        { text: 'Use proper HTTP status codes', isProhibition: false },
        { text: 'Validate input with a validation library (zod, joi, etc.)', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use callbacks instead of async/await', isProhibition: true },
        { text: 'Forget to call `next()` in middleware', isProhibition: true },
        { text: 'Log sensitive information (passwords, tokens)', isProhibition: true },
        { text: 'Return stack traces in production error responses', isProhibition: true },
    ],
};

export const nestjsRules: RuleSection = {
    id: 'nestjs',
    title: 'NestJS Rules',
    description: 'NestJS framework standards',
    rules: [
        { text: 'Use modules to organize features', isProhibition: false },
        { text: 'Use DTOs with class-validator for input validation', isProhibition: false },
        { text: 'Use dependency injection via constructor', isProhibition: false },
        { text: 'Use guards for authorization', isProhibition: false },
        { text: 'Use interceptors for cross-cutting concerns', isProhibition: false },
        { text: 'Use pipes for data transformation and validation', isProhibition: false },
        { text: 'Use ConfigService for configuration management', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Access environment variables directly - use ConfigService', isProhibition: true },
        { text: 'Put business logic in controllers - use services', isProhibition: true },
        { text: 'Create circular dependencies between modules', isProhibition: true },
    ],
};

export const honoRules: RuleSection = {
    id: 'hono',
    title: 'Hono Rules',
    description: 'Hono framework standards',
    rules: [
        { text: 'Use middleware for cross-cutting concerns', isProhibition: false },
        { text: 'Use route groups for organization', isProhibition: false },
        { text: 'Use Zod validator middleware for input validation', isProhibition: false },
        { text: 'Use c.json() for JSON responses', isProhibition: false },
        { text: 'Leverage edge runtime capabilities when deploying to edge', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Ignore TypeScript types that Hono provides', isProhibition: true },
        { text: 'Use blocking operations on edge runtimes', isProhibition: true },
    ],
};
