/**
 * Backend framework rules
 */

import type { RuleSection } from '../../types/index.js';

export const expressRules: RuleSection = {
    id: 'express',
    title: 'Express.js Rules',
    description: 'Express.js API standards',
    rules: [
        { text: 'Use middleware for cross-cutting concerns (auth, logging, validation)', isProhibition: false, source: 'Express Guide: Writing Middleware' },
        { text: 'Use Router for modular route organization', isProhibition: false, source: 'Express Guide: Routing' },
        { text: 'Use async/await with proper error handling middleware', isProhibition: false, source: 'Express Best Practices: Error Handling' },
        { text: 'Use helmet.js for security headers', isProhibition: false, source: 'Express Best Practices: Security' },
        { text: 'Use proper HTTP status codes', isProhibition: false },
        { text: 'Validate input with a validation library (zod, joi, etc.)', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use callbacks instead of async/await', isProhibition: true, source: 'Modern JavaScript Best Practices' },
        { text: 'Forget to call `next()` in middleware when not ending response', isProhibition: true, source: 'Express Guide: Writing Middleware' },
        { text: 'Log sensitive information (passwords, tokens)', isProhibition: true, source: 'OWASP Logging Guide' },
        { text: 'Return stack traces in production error responses', isProhibition: true, source: 'Express Production Best Practices' },
    ],
};

export const nestjsRules: RuleSection = {
    id: 'nestjs',
    title: 'NestJS Rules',
    description: 'NestJS framework standards',
    rules: [
        { text: 'Use modules to organize features', isProhibition: false, source: 'NestJS Docs: Modules' },
        { text: 'Use DTOs with class-validator for input validation', isProhibition: false, source: 'NestJS Docs: Validation' },
        { text: 'Use dependency injection via constructor', isProhibition: false, source: 'NestJS Docs: Providers' },
        { text: 'Use guards for authorization', isProhibition: false, source: 'NestJS Docs: Guards' },
        { text: 'Use interceptors for cross-cutting concerns (logging, transformation)', isProhibition: false, source: 'NestJS Docs: Interceptors' },
        { text: 'Use pipes for data transformation and validation', isProhibition: false, source: 'NestJS Docs: Pipes' },
        { text: 'Use ConfigService for configuration management', isProhibition: false, source: 'NestJS Docs: Configuration' },
    ],
    antiPatterns: [
        { text: 'Access environment variables directly - use ConfigService', isProhibition: true, source: 'NestJS Best Practices' },
        { text: 'Put business logic in controllers - use services', isProhibition: true, source: 'NestJS Architecture' },
        { text: 'Create circular dependencies between modules', isProhibition: true, source: 'NestJS Docs: Circular Dependency' },
    ],
};

export const honoRules: RuleSection = {
    id: 'hono',
    title: 'Hono Rules',
    description: 'Hono framework standards',
    rules: [
        { text: 'Use middleware for cross-cutting concerns', isProhibition: false, source: 'Hono Middleware Guide' },
        { text: 'Use route groups for organization using `app.route()`', isProhibition: false, source: 'Hono Routing' },
        { text: 'Use Zod validator middleware for input validation', isProhibition: false, source: 'Hono Validator Middleware' },
        { text: 'Use `c.json()` for JSON responses', isProhibition: false, source: 'Hono Context API' },
        { text: 'Leverage edge runtime capabilities when deploying to edge', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Ignore TypeScript types that Hono provides (Generics)', isProhibition: true, source: 'Hono TypeScript Guide' },
        { text: 'Use blocking operations on edge runtimes (fs, heavily synchronous cpu)', isProhibition: true, source: 'Edge Runtime Constraints' },
    ],
};
