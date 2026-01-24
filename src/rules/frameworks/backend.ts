/**
 * Backend framework rules
 */

import type { RuleSection } from '../../types/index.js';

export const expressRules: RuleSection = {
  id: 'express',
  title: 'Express.js Rules',
  description: 'Express.js API standards',
  rules: [
    {
      text: 'Use middleware for cross-cutting concerns (auth, logging, validation)',
      isProhibition: false,
      source: 'Express Guide: Writing Middleware',
    },
    {
      text: 'Use Router for modular route organization',
      isProhibition: false,
      source: 'Express Guide: Routing',
    },
    {
      text: 'Use async/await with proper error handling middleware',
      isProhibition: false,
      source: 'Express Best Practices: Error Handling',
    },
    {
      text: 'Use helmet.js for security headers',
      isProhibition: false,
      source: 'Express Best Practices: Security',
    },
    { text: 'Use proper HTTP status codes', isProhibition: false },
    { text: 'Validate input with a validation library (zod, joi, etc.)', isProhibition: false },
  ],
  antiPatterns: [
    {
      text: 'Use callbacks instead of async/await',
      isProhibition: true,
      source: 'Modern JavaScript Best Practices',
    },
    {
      text: 'Forget to call `next()` in middleware when not ending response',
      isProhibition: true,
      source: 'Express Guide: Writing Middleware',
    },
    {
      text: 'Log sensitive information (passwords, tokens)',
      isProhibition: true,
      source: 'OWASP Logging Guide',
    },
    {
      text: 'Return stack traces in production error responses',
      isProhibition: true,
      source: 'Express Production Best Practices',
    },
  ],
};

export const nestjsRules: RuleSection = {
  id: 'nestjs',
  title: 'NestJS Rules',
  description: 'NestJS framework standards',
  rules: [
    {
      text: 'Use modules to organize features',
      isProhibition: false,
      source: 'NestJS Docs: Modules',
    },
    {
      text: 'Use DTOs with class-validator for input validation',
      isProhibition: false,
      source: 'NestJS Docs: Validation',
    },
    {
      text: 'Use dependency injection via constructor',
      isProhibition: false,
      source: 'NestJS Docs: Providers',
    },
    { text: 'Use guards for authorization', isProhibition: false, source: 'NestJS Docs: Guards' },
    {
      text: 'Use interceptors for cross-cutting concerns (logging, transformation)',
      isProhibition: false,
      source: 'NestJS Docs: Interceptors',
    },
    {
      text: 'Use pipes for data transformation and validation',
      isProhibition: false,
      source: 'NestJS Docs: Pipes',
    },
    {
      text: 'Use ConfigService for configuration management',
      isProhibition: false,
      source: 'NestJS Docs: Configuration',
    },
  ],
  antiPatterns: [
    {
      text: 'Access environment variables directly - use ConfigService',
      isProhibition: true,
      source: 'NestJS Best Practices',
    },
    {
      text: 'Put business logic in controllers - use services',
      isProhibition: true,
      source: 'NestJS Architecture',
    },
    {
      text: 'Create circular dependencies between modules',
      isProhibition: true,
      source: 'NestJS Docs: Circular Dependency',
    },
  ],
};

export const honoRules: RuleSection = {
  id: 'hono',
  title: 'Hono Rules',
  description: 'Hono framework standards',
  rules: [
    {
      text: 'Use middleware for cross-cutting concerns',
      isProhibition: false,
      source: 'Hono Middleware Guide',
    },
    {
      text: 'Use route groups for organization using `app.route()`',
      isProhibition: false,
      source: 'Hono Routing',
    },
    {
      text: 'Use Zod validator middleware for input validation',
      isProhibition: false,
      source: 'Hono Validator Middleware',
    },
    { text: 'Use `c.json()` for JSON responses', isProhibition: false, source: 'Hono Context API' },
    { text: 'Leverage edge runtime capabilities when deploying to edge', isProhibition: false },
  ],
  antiPatterns: [
    {
      text: 'Ignore TypeScript types that Hono provides (Generics)',
      isProhibition: true,
      source: 'Hono TypeScript Guide',
    },
    {
      text: 'Use blocking operations on edge runtimes (fs, heavily synchronous cpu)',
      isProhibition: true,
      source: 'Edge Runtime Constraints',
    },
  ],
};

export const laravelRules: RuleSection = {
  id: 'laravel',
  title: 'Laravel Rules',
  description: 'Laravel framework standards and best practices',
  rules: [
    {
      text: 'Use Eloquent ORM for database operations',
      isProhibition: false,
      source: 'Laravel Docs: Eloquent',
    },
    {
      text: 'Use dependency injection via constructor or method injection',
      isProhibition: false,
      source: 'Laravel Docs: Service Container',
    },
    {
      text: 'Use Form Request validation for complex validation logic',
      isProhibition: false,
      source: 'Laravel Docs: Validation',
    },
    {
      text: 'Use Resource classes for API responses',
      isProhibition: false,
      source: 'Laravel Docs: Eloquent API Resources',
    },
    {
      text: 'Use Policies for authorization logic',
      isProhibition: false,
      source: 'Laravel Docs: Authorization',
    },
    {
      text: 'Use Jobs for long-running operations',
      isProhibition: false,
      source: 'Laravel Docs: Queues',
    },
    {
      text: 'Use migrations for database schema changes',
      isProhibition: false,
      source: 'Laravel Docs: Migrations',
    },
    {
      text: 'Use Seeders for database seeding',
      isProhibition: false,
      source: 'Laravel Docs: Seeders',
    },
    {
      text: 'Use route model binding instead of manual ID lookups',
      isProhibition: false,
      source: 'Laravel Docs: Routing',
    },
    {
      text: 'Use middleware for cross-cutting concerns',
      isProhibition: false,
      source: 'Laravel Docs: Middleware',
    },
    {
      text: 'Follow Laravel naming conventions (controllers, models, etc.)',
      isProhibition: false,
      source: 'Laravel Conventions',
    },
  ],
  antiPatterns: [
    {
      text: 'Use raw SQL queries when Eloquent can handle it',
      isProhibition: true,
      source: 'Laravel Best Practices',
    },
    {
      text: 'Put business logic in routes - use Controllers',
      isProhibition: true,
      source: 'MVC Pattern',
    },
    {
      text: 'Use DB facade directly in controllers - use Repositories or Services',
      isProhibition: true,
      source: 'Repository Pattern',
    },
    { text: 'Return views from API routes', isProhibition: true, source: 'API Design' },
    {
      text: 'Use `env()` helper outside config files',
      isProhibition: true,
      source: 'Laravel Config Best Practices',
    },
    {
      text: 'Forget to use CSRF protection on forms',
      isProhibition: true,
      source: 'Laravel Security',
    },
    {
      text: 'Mass assign attributes without protection',
      isProhibition: true,
      source: 'Laravel Security: Mass Assignment',
    },
  ],
};
