/**
 * Python-specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const pythonRules: RuleSection = {
    id: 'python',
    title: 'Python Rules',
    description: 'Python coding standards',
    rules: [
        { text: 'Use type hints for all function parameters and return types', isProhibition: false, source: 'PEP 484' },
        { text: 'Follow PEP 8 style guide for naming and formatting', isProhibition: false, source: 'PEP 8' },
        { text: 'Use `pathlib.Path` instead of `os.path` for file path operations', isProhibition: false, source: 'Modern Python' },
        { text: 'Use f-strings for string formatting', isProhibition: false, source: 'PEP 498' },
        { text: 'Use context managers (`with` statement) for resource management', isProhibition: false, source: 'Python Docs: Context Managers' },
        { text: 'Use list/dict/set comprehensions when they improve readability', isProhibition: false, source: 'Python Antipatterns' },
        { text: 'Use `dataclasses` or `pydantic` models for data structures', isProhibition: false, source: 'PEP 557' },
        { text: 'Use `Enum` for fixed sets of values', isProhibition: false, source: 'Python Docs: Enum' },
        { text: 'Use `logging` module instead of print statements in production code', isProhibition: false, source: 'Python Logging HOWTO' },
        { text: 'Use virtual environments for project dependencies', isProhibition: false, source: 'Python Packaging User Guide' },
    ],
    antiPatterns: [
        { text: 'Use bare `except:` clauses - always catch specific exceptions', isProhibition: true, source: 'PEP 8: Programming Recommendations' },
        { text: 'Use mutable default arguments (lists, dicts) in function definitions', isProhibition: true, source: 'Python Common Gotchas' },
        { text: 'Use `from module import *` - import specific names', isProhibition: true, source: 'PEP 8: Imports' },
        { text: 'Use `type()` for type checking - use `isinstance()` instead', isProhibition: true, source: 'PEP 8: Programming Recommendations' },
        { text: 'Use global variables for state management', isProhibition: true },
        { text: 'Use `print()` for error handling - raise exceptions instead', isProhibition: true },
    ],
};

export const fastapiRules: RuleSection = {
    id: 'fastapi',
    title: 'FastAPI Rules',
    description: 'FastAPI framework standards',
    rules: [
        { text: 'Use Pydantic models for request/response validation', isProhibition: false, source: 'FastAPI Docs: Pydantic' },
        { text: 'Use dependency injection for shared logic (database sessions, auth, etc.)', isProhibition: false, source: 'FastAPI Docs: Dependencies' },
        { text: 'Use `async def` for I/O-bound operations', isProhibition: false, source: 'FastAPI Docs: Async/Await' },
        { text: 'Use proper HTTP status codes in responses', isProhibition: false },
        { text: 'Use APIRouter for modular route organization', isProhibition: false, source: 'FastAPI Docs: Bigger Applications' },
        { text: 'Use `Annotated` types with `Depends()` for cleaner dependency injection', isProhibition: false, source: 'FastAPI Docs: Dependencies' },
        { text: 'Document endpoints with docstrings for OpenAPI generation', isProhibition: false, source: 'FastAPI Docs: Metadata' },
        { text: 'Use `HTTPException` for error responses with appropriate status codes', isProhibition: false, source: 'FastAPI Docs: Handling Errors' },
    ],
    antiPatterns: [
        { text: 'Return plain dicts instead of Pydantic models for responses', isProhibition: true, source: 'FastAPI Docs: Response Model' },
        { text: 'Use synchronous database calls in async endpoints', isProhibition: true, source: 'FastAPI Docs: Async/Await' },
        { text: 'Catch all exceptions silently without proper error handling', isProhibition: true },
    ],
};

export const djangoRules: RuleSection = {
    id: 'django',
    title: 'Django Rules',
    description: 'Django framework standards',
    rules: [
        { text: 'Use class-based views for complex logic, function-based for simple endpoints', isProhibition: false, source: 'Django Best Practices' },
        { text: 'Use Django ORM properly - avoid N+1 queries with `select_related` and `prefetch_related`', isProhibition: false, source: 'Django Docs: Optimization' },
        { text: 'Use Django forms or serializers for input validation', isProhibition: false, source: 'Django Docs: Forms' },
        { text: 'Use Django\'s built-in authentication system', isProhibition: false },
        { text: 'Use migrations for all database schema changes', isProhibition: false, source: 'Django Docs: Migrations' },
        { text: 'Use Django settings module for configuration', isProhibition: false, source: 'Django Docs: Settings' },
    ],
    antiPatterns: [
        { text: 'Write raw SQL without using Django ORM or proper parameterization', isProhibition: true, source: 'Django Docs: SQL Injection' },
        { text: 'Store sensitive settings in code - use environment variables', isProhibition: true, source: 'Twelve-Factor App' },
        { text: 'Modify models without creating migrations', isProhibition: true },
        { text: 'Use deprecated Django patterns or APIs', isProhibition: true },
    ],
};
