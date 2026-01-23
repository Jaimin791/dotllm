/**
 * Tooling-specific rules (testing, linting, etc.)
 */

import type { RuleSection } from '../../types/index.js';

export const testingRules: RuleSection = {
    id: 'testing',
    title: 'Testing Rules',
    description: 'Testing standards and practices',
    rules: [
        { text: 'Write unit tests for all utility functions and business logic', isProhibition: false, source: 'Testing Best Practices' },
        { text: 'Write integration tests for API endpoints', isProhibition: false, source: 'Testing Pyramid' },
        { text: 'Use descriptive test names: describe what behavior is being tested', isProhibition: false, source: 'Clean Code: Testing' },
        { text: 'Follow Arrange-Act-Assert pattern in tests', isProhibition: false, source: 'AAA Pattern' },
        { text: 'Mock external services and APIs, not internal modules', isProhibition: false, source: 'Mocking Best Practices' },
        { text: 'Use test factories or fixtures for consistent test data', isProhibition: false },
        { text: 'Test error cases and edge conditions, not just happy paths', isProhibition: false },
        { text: 'Keep tests independent - no shared state between tests', isProhibition: false, source: 'Test Isolation' },
        { text: 'Colocate test files with source files or in a parallel `tests/` directory', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Write tests that depend on execution order', isProhibition: true, source: 'Test Isolation' },
        { text: 'Test implementation details - test behavior and outputs', isProhibition: true, source: 'Testing Trophy' },
        { text: 'Skip or disable tests without documented reason', isProhibition: true },
        { text: 'Use production databases or services in tests', isProhibition: true, source: 'Test Isolation' },
        { text: 'Write flaky tests that intermittently fail', isProhibition: true },
        { text: 'Leave console.log statements in test files', isProhibition: true },
    ],
};

export const gitRules: RuleSection = {
    id: 'git',
    title: 'Git & Version Control Rules',
    description: 'Version control standards',
    rules: [
        { text: 'Format commit messages: `type(scope): description`', isProhibition: false, source: 'Conventional Commits' },
        { text: 'Commit types: feat, fix, docs, style, refactor, test, chore', isProhibition: false, source: 'Conventional Commits' },
        { text: 'Keep commits atomic and focused on a single change', isProhibition: false, source: 'Git Best Practices' },
        { text: 'Reference issue numbers in commit messages when applicable', isProhibition: false, source: 'GitHub Flow' },
        { text: 'Write descriptive PR titles and descriptions', isProhibition: false },
        { text: 'Rebase feature branches before merging to main', isProhibition: false, source: 'Git Workflow' },
    ],
    antiPatterns: [
        { text: 'Commit sensitive data (API keys, passwords, secrets)', isProhibition: true, source: 'Security Best Practices' },
        { text: 'Force push to shared branches', isProhibition: true, source: 'Git Best Practices' },
        { text: 'Commit large binary files without LFS', isProhibition: true, source: 'Git Performance' },
        { text: 'Use vague commit messages like "fix" or "update"', isProhibition: true, source: 'Commit Guidelines' },
    ],
};

export const errorHandlingRules: RuleSection = {
    id: 'error-handling',
    title: 'Error Handling Rules',
    description: 'Error handling and logging standards',
    rules: [
        { text: 'Use typed error classes extending Error for domain errors', isProhibition: false, source: 'TypeScript Best Practices' },
        { text: 'Always provide user-friendly error messages for UI display', isProhibition: false, source: 'UX Guidelines' },
        { text: 'Log errors with context: request ID, user ID, action attempted', isProhibition: false, source: 'Observability Guide' },
        { text: 'Use Result/Either types for recoverable errors in critical paths', isProhibition: false, source: 'Functional Programming' },
        { text: 'Centralize error handling in middleware or error boundaries', isProhibition: false, source: 'Express/React Patterns' },
        { text: 'Distinguish between client errors (4xx) and server errors (5xx)', isProhibition: false, source: 'HTTP Spec' },
    ],
    antiPatterns: [
        { text: 'Swallow errors silently without logging', isProhibition: true, source: 'Error Handling Anti-patterns' },
        { text: 'Expose stack traces or internal errors to users', isProhibition: true, source: 'OWASP Security' },
        { text: 'Use generic catch-all error messages', isProhibition: true },
        { text: 'Log sensitive user data in error logs', isProhibition: true, source: 'GDPR/Privacy' },
        { text: 'Throw strings instead of Error objects', isProhibition: true, source: 'JS Error Handling' },
    ],
};

export const namingRules: RuleSection = {
    id: 'naming',
    title: 'Naming Conventions',
    description: 'File and code naming standards',
    rules: [
        { text: 'Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components', isProhibition: false, source: 'React/Angular Conventions' },
        { text: 'Functions and variables: `camelCase`', isProhibition: false, source: 'JS Style Guide' },
        { text: 'Constants: `SCREAMING_SNAKE_CASE`', isProhibition: false, source: 'Programming Conventions' },
        { text: 'Types, Interfaces, and Classes: `PascalCase`', isProhibition: false, source: 'TS Style Guide' },
        { text: 'Booleans: prefix with `is`, `has`, `can`, `should`', isProhibition: false, source: 'Clean Code' },
        { text: 'Event handlers: prefix with `on` or `handle`', isProhibition: false, source: 'React Conventions' },
        { text: 'Private class members: prefix with underscore `_` or use private keyword', isProhibition: false, source: 'TS/JS Conventions' },
    ],
    antiPatterns: [
        { text: 'Use abbreviations that are not universally understood', isProhibition: true, source: 'Clean Code' },
        { text: 'Use single-letter variable names except in short scopes (loops)', isProhibition: true, source: 'Clean Code' },
        { text: 'Mix naming conventions inconsistently', isProhibition: true },
    ],
};

export const performanceRules: RuleSection = {
    id: 'performance',
    title: 'Performance Rules',
    description: 'Performance optimization standards',
    rules: [
        { text: 'Lazy load heavy components and routes', isProhibition: false, source: 'Web Performance Guide' },
        { text: 'Use pagination or virtual scrolling for large lists', isProhibition: false, source: 'UI Performance' },
        { text: 'Optimize images: proper format, compression, lazy loading', isProhibition: false, source: 'Core Web Vitals' },
        { text: 'Debounce or throttle expensive event handlers', isProhibition: false, source: 'Event Handling Best Practices' },
        { text: 'Use caching strategies for expensive computations and API calls', isProhibition: false, source: 'Caching Strategies' },
        { text: 'Profile before optimizing - measure, don\'t guess', isProhibition: false, source: 'Optimization Methodology' },
    ],
    antiPatterns: [
        { text: 'Make unnecessary API calls in loops', isProhibition: true, source: 'N+1 Problem' },
        { text: 'Load entire libraries when only a small part is needed', isProhibition: true, source: 'Bundle Optimization' },
        { text: 'Perform heavy computations synchronously on the main thread', isProhibition: true, source: 'Event Loop Best Practices' },
        { text: 'Premature optimization before identifying actual bottlenecks', isProhibition: true, source: 'Knuth' },
    ],
};

export const securityRules: RuleSection = {
    id: 'security',
    title: 'Security Rules',
    description: 'Security best practices',
    rules: [
        { text: 'Validate and sanitize all user inputs', isProhibition: false, source: 'OWASP Top 10' },
        { text: 'Use parameterized queries to prevent SQL injection', isProhibition: false, source: 'OWASP SQL Injection Prevention' },
        { text: 'Use HTTPS for all API communications', isProhibition: false, source: 'Transport Layer Security' },
        { text: 'Implement proper authentication and authorization', isProhibition: false, source: 'OWASP AuthN/AuthZ' },
        { text: 'Use environment variables for secrets, never hardcode', isProhibition: false, source: 'Twelve-Factor App' },
        { text: 'Set proper CORS headers', isProhibition: false, source: 'MDN CORS' },
        { text: 'Use Content Security Policy headers', isProhibition: false, source: 'MDN CSP' },
        { text: 'Keep dependencies updated to patch security vulnerabilities', isProhibition: false, source: 'SCA Best Practices' },
    ],
    antiPatterns: [
        { text: 'Store passwords in plain text - use proper hashing (bcrypt, argon2)', isProhibition: true, source: 'Password Storage Cheatsheet' },
        { text: 'Expose sensitive data in URLs or logs', isProhibition: true, source: 'OWASP Sensitive Data Exposure' },
        { text: 'Trust client-side validation alone', isProhibition: true, source: 'Server-Side Validation' },
        { text: 'Use deprecated or insecure cryptographic functions', isProhibition: true, source: 'Cryptographic Failure Prevention' },
        { text: 'Commit secrets to version control', isProhibition: true, source: 'Secret Management' },
    ],
};
