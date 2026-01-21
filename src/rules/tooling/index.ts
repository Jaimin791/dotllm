/**
 * Tooling-specific rules (testing, linting, etc.)
 */

import type { RuleSection } from '../../types/index.js';

export const testingRules: RuleSection = {
    id: 'testing',
    title: 'Testing Rules',
    description: 'Testing standards and practices',
    rules: [
        { text: 'Write unit tests for all utility functions and business logic', isProhibition: false },
        { text: 'Write integration tests for API endpoints', isProhibition: false },
        { text: 'Use descriptive test names: describe what behavior is being tested', isProhibition: false },
        { text: 'Follow Arrange-Act-Assert pattern in tests', isProhibition: false },
        { text: 'Mock external services and APIs, not internal modules', isProhibition: false },
        { text: 'Use test factories or fixtures for consistent test data', isProhibition: false },
        { text: 'Test error cases and edge conditions, not just happy paths', isProhibition: false },
        { text: 'Keep tests independent - no shared state between tests', isProhibition: false },
        { text: 'Colocate test files with source files or in a parallel `tests/` directory', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Write tests that depend on execution order', isProhibition: true },
        { text: 'Test implementation details - test behavior and outputs', isProhibition: true },
        { text: 'Skip or disable tests without documented reason', isProhibition: true },
        { text: 'Use production databases or services in tests', isProhibition: true },
        { text: 'Write flaky tests that intermittently fail', isProhibition: true },
        { text: 'Leave console.log statements in test files', isProhibition: true },
    ],
};

export const gitRules: RuleSection = {
    id: 'git',
    title: 'Git & Version Control Rules',
    description: 'Version control standards',
    rules: [
        { text: 'Format commit messages: `type(scope): description`', isProhibition: false },
        { text: 'Commit types: feat, fix, docs, style, refactor, test, chore', isProhibition: false },
        { text: 'Keep commits atomic and focused on a single change', isProhibition: false },
        { text: 'Reference issue numbers in commit messages when applicable', isProhibition: false },
        { text: 'Write descriptive PR titles and descriptions', isProhibition: false },
        { text: 'Rebase feature branches before merging to main', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Commit sensitive data (API keys, passwords, secrets)', isProhibition: true },
        { text: 'Force push to shared branches', isProhibition: true },
        { text: 'Commit large binary files without LFS', isProhibition: true },
        { text: 'Use vague commit messages like "fix" or "update"', isProhibition: true },
    ],
};

export const errorHandlingRules: RuleSection = {
    id: 'error-handling',
    title: 'Error Handling Rules',
    description: 'Error handling and logging standards',
    rules: [
        { text: 'Use typed error classes extending Error for domain errors', isProhibition: false },
        { text: 'Always provide user-friendly error messages for UI display', isProhibition: false },
        { text: 'Log errors with context: request ID, user ID, action attempted', isProhibition: false },
        { text: 'Use Result/Either types for recoverable errors in critical paths', isProhibition: false },
        { text: 'Centralize error handling in middleware or error boundaries', isProhibition: false },
        { text: 'Distinguish between client errors (4xx) and server errors (5xx)', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Swallow errors silently without logging', isProhibition: true },
        { text: 'Expose stack traces or internal errors to users', isProhibition: true },
        { text: 'Use generic catch-all error messages', isProhibition: true },
        { text: 'Log sensitive user data in error logs', isProhibition: true },
        { text: 'Throw strings instead of Error objects', isProhibition: true },
    ],
};

export const namingRules: RuleSection = {
    id: 'naming',
    title: 'Naming Conventions',
    description: 'File and code naming standards',
    rules: [
        { text: 'Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components', isProhibition: false },
        { text: 'Functions and variables: `camelCase`', isProhibition: false },
        { text: 'Constants: `SCREAMING_SNAKE_CASE`', isProhibition: false },
        { text: 'Types, Interfaces, and Classes: `PascalCase`', isProhibition: false },
        { text: 'Booleans: prefix with `is`, `has`, `can`, `should`', isProhibition: false },
        { text: 'Event handlers: prefix with `on` or `handle`', isProhibition: false },
        { text: 'Private class members: prefix with underscore `_` or use private keyword', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use abbreviations that are not universally understood', isProhibition: true },
        { text: 'Use single-letter variable names except in short scopes (loops)', isProhibition: true },
        { text: 'Mix naming conventions inconsistently', isProhibition: true },
    ],
};

export const performanceRules: RuleSection = {
    id: 'performance',
    title: 'Performance Rules',
    description: 'Performance optimization standards',
    rules: [
        { text: 'Lazy load heavy components and routes', isProhibition: false },
        { text: 'Use pagination or virtual scrolling for large lists', isProhibition: false },
        { text: 'Optimize images: proper format, compression, lazy loading', isProhibition: false },
        { text: 'Debounce or throttle expensive event handlers', isProhibition: false },
        { text: 'Use caching strategies for expensive computations and API calls', isProhibition: false },
        { text: 'Profile before optimizing - measure, don\'t guess', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Make unnecessary API calls in loops', isProhibition: true },
        { text: 'Load entire libraries when only a small part is needed', isProhibition: true },
        { text: 'Perform heavy computations synchronously on the main thread', isProhibition: true },
        { text: 'Premature optimization before identifying actual bottlenecks', isProhibition: true },
    ],
};

export const securityRules: RuleSection = {
    id: 'security',
    title: 'Security Rules',
    description: 'Security best practices',
    rules: [
        { text: 'Validate and sanitize all user inputs', isProhibition: false },
        { text: 'Use parameterized queries to prevent SQL injection', isProhibition: false },
        { text: 'Use HTTPS for all API communications', isProhibition: false },
        { text: 'Implement proper authentication and authorization', isProhibition: false },
        { text: 'Use environment variables for secrets, never hardcode', isProhibition: false },
        { text: 'Set proper CORS headers', isProhibition: false },
        { text: 'Use Content Security Policy headers', isProhibition: false },
        { text: 'Keep dependencies updated to patch security vulnerabilities', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Store passwords in plain text - use proper hashing (bcrypt, argon2)', isProhibition: true },
        { text: 'Expose sensitive data in URLs or logs', isProhibition: true },
        { text: 'Trust client-side validation alone', isProhibition: true },
        { text: 'Use deprecated or insecure cryptographic functions', isProhibition: true },
        { text: 'Commit secrets to version control', isProhibition: true },
    ],
};
