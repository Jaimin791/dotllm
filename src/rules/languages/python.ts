/**
 * Python-specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const pythonRules: RuleSection = {
    id: 'python',
    title: 'Python Rules',
    description: 'Python coding standards',
    rules: [
        { text: 'Use type hints for all function parameters and return types', isProhibition: false },
        { text: 'Follow PEP 8 style guide for naming and formatting', isProhibition: false },
        { text: 'Use `pathlib.Path` instead of `os.path` for file path operations', isProhibition: false },
        { text: 'Use f-strings for string formatting', isProhibition: false },
        { text: 'Use context managers (`with` statement) for resource management', isProhibition: false },
        { text: 'Use list/dict/set comprehensions when they improve readability', isProhibition: false },
        { text: 'Use `dataclasses` or `pydantic` models for data structures', isProhibition: false },
        { text: 'Use `Enum` for fixed sets of values', isProhibition: false },
        { text: 'Use `logging` module instead of print statements in production code', isProhibition: false },
        { text: 'Use virtual environments for project dependencies', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use bare `except:` clauses - always catch specific exceptions', isProhibition: true },
        { text: 'Use mutable default arguments (lists, dicts) in function definitions', isProhibition: true },
        { text: 'Use `from module import *` - import specific names', isProhibition: true },
        { text: 'Use `type()` for type checking - use `isinstance()` instead', isProhibition: true },
        { text: 'Ignore type checker warnings without justification', isProhibition: true },
        { text: 'Use global variables for state management', isProhibition: true },
        { text: 'Use `print()` for error handling - raise exceptions instead', isProhibition: true },
    ],
};

export const fastapiRules: RuleSection = {
    id: 'fastapi',
    title: 'FastAPI Rules',
    description: 'FastAPI framework standards',
    rules: [
        { text: 'Use Pydantic models for request/response validation', isProhibition: false },
        { text: 'Use dependency injection for shared logic (database sessions, auth, etc.)', isProhibition: false },
        { text: 'Use `async def` for I/O-bound operations', isProhibition: false },
        { text: 'Use proper HTTP status codes in responses', isProhibition: false },
        { text: 'Use APIRouter for modular route organization', isProhibition: false },
        { text: 'Use `Annotated` types with `Depends()` for cleaner dependency injection', isProhibition: false },
        { text: 'Document endpoints with docstrings for OpenAPI generation', isProhibition: false },
        { text: 'Use `HTTPException` for error responses with appropriate status codes', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Return plain dicts instead of Pydantic models for responses', isProhibition: true },
        { text: 'Use synchronous database calls in async endpoints', isProhibition: true },
        { text: 'Catch all exceptions silently without proper error handling', isProhibition: true },
        { text: 'Store sensitive data (passwords, tokens) in response models', isProhibition: true },
        { text: 'Use `def` instead of `async def` for I/O-bound operations', isProhibition: true },
    ],
};

export const djangoRules: RuleSection = {
    id: 'django',
    title: 'Django Rules',
    description: 'Django framework standards',
    rules: [
        { text: 'Use class-based views for complex logic, function-based for simple endpoints', isProhibition: false },
        { text: 'Use Django ORM properly - avoid N+1 queries with `select_related` and `prefetch_related`', isProhibition: false },
        { text: 'Use Django forms or serializers for input validation', isProhibition: false },
        { text: 'Use Django\'s built-in authentication system', isProhibition: false },
        { text: 'Use migrations for all database schema changes', isProhibition: false },
        { text: 'Use signals sparingly and document their effects', isProhibition: false },
        { text: 'Use Django settings module for configuration', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Write raw SQL without using Django ORM or proper parameterization', isProhibition: true },
        { text: 'Store sensitive settings in code - use environment variables', isProhibition: true },
        { text: 'Modify models without creating migrations', isProhibition: true },
        { text: 'Use deprecated Django patterns or APIs', isProhibition: true },
    ],
};
