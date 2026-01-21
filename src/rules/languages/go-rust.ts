/**
 * Go-specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const goRules: RuleSection = {
    id: 'go',
    title: 'Go Rules',
    description: 'Go coding standards',
    rules: [
        { text: 'Use `gofmt` or `goimports` to format all code', isProhibition: false },
        { text: 'Follow Go naming conventions: `MixedCaps` for exported, `mixedCaps` for unexported', isProhibition: false },
        { text: 'Handle all errors explicitly - check err != nil', isProhibition: false },
        { text: 'Use meaningful variable names (avoid single letters except in short scopes)', isProhibition: false },
        { text: 'Use interfaces for abstraction and testability', isProhibition: false },
        { text: 'Keep functions small and focused on a single responsibility', isProhibition: false },
        { text: 'Use `context.Context` as the first parameter for functions that do I/O', isProhibition: false },
        { text: 'Use struct embedding for composition over inheritance', isProhibition: false },
        { text: 'Use table-driven tests for comprehensive test coverage', isProhibition: false },
        { text: 'Document exported functions and types with comments', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Ignore errors with `_` without explicit justification', isProhibition: true },
        { text: 'Use `panic()` for regular error handling - return errors instead', isProhibition: true },
        { text: 'Use global variables for state', isProhibition: true },
        { text: 'Use `init()` functions for complex initialization', isProhibition: true },
        { text: 'Create interfaces before you need them - let consumers define interfaces', isProhibition: true },
        { text: 'Use named returns except for short functions where they add clarity', isProhibition: true },
    ],
};

export const rustRules: RuleSection = {
    id: 'rust',
    title: 'Rust Rules',
    description: 'Rust coding standards',
    rules: [
        { text: 'Use `cargo fmt` to format all code', isProhibition: false },
        { text: 'Use `cargo clippy` and address all warnings', isProhibition: false },
        { text: 'Prefer `Result` over `panic!` for recoverable errors', isProhibition: false },
        { text: 'Use `?` operator for error propagation', isProhibition: false },
        { text: 'Use meaningful lifetimes names when explicit lifetimes are needed', isProhibition: false },
        { text: 'Prefer owned types over references when ownership semantics are clear', isProhibition: false },
        { text: 'Use `derive` macros for common trait implementations', isProhibition: false },
        { text: 'Document public APIs with doc comments (`///`)', isProhibition: false },
        { text: 'Use `#[must_use]` for functions where ignoring the return value is likely a bug', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use `unwrap()` or `expect()` in library code - return Result instead', isProhibition: true },
        { text: 'Use `unsafe` blocks without thorough documentation and justification', isProhibition: true },
        { text: 'Clone unnecessarily to avoid borrowing complexity', isProhibition: true },
        { text: 'Ignore clippy warnings without `#[allow(...)]` justification', isProhibition: true },
        { text: 'Use `panic!` for expected error conditions', isProhibition: true },
    ],
};
