/**
 * Go-specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const goRules: RuleSection = {
    id: 'go',
    title: 'Go Rules',
    description: 'Go coding standards',
    rules: [
        { text: 'Use `gofmt` or `goimports` to format all code', isProhibition: false, source: 'Effective Go' },
        { text: 'Follow Go naming conventions: `MixedCaps` for exported, `mixedCaps` for unexported', isProhibition: false, source: 'Effective Go: Names' },
        { text: 'Handle all errors explicitly - check err != nil', isProhibition: false, source: 'Go Code Review Comments' },
        { text: 'Use meaningful variable names (avoid single letters except in short scopes)', isProhibition: false, source: 'Go Code Review Comments' },
        { text: 'Use interfaces for abstraction and testability', isProhibition: false, source: 'Effective Go: Interfaces' },
        { text: 'Keep functions small and focused on a single responsibility', isProhibition: false },
        { text: 'Use `context.Context` as the first parameter for functions that do I/O', isProhibition: false, source: 'Google Go Style' },
        { text: 'Use struct embedding for composition over inheritance', isProhibition: false, source: 'Effective Go: Embedding' },
        { text: 'Use table-driven tests for comprehensive test coverage', isProhibition: false, source: 'Go Wiki: TableDrivenTests' },
        { text: 'Document exported functions and types with comments', isProhibition: false, source: 'Effective Go: Commentary' },
    ],
    antiPatterns: [
        { text: 'Ignore errors with `_` without explicit justification', isProhibition: true, source: 'Go Common Mistakes' },
        { text: 'Use `panic()` for regular error handling - return errors instead', isProhibition: true, source: 'Effective Go: Panic' },
        { text: 'Use global variables for state', isProhibition: true },
        { text: 'Use `init()` functions for complex initialization', isProhibition: true, source: 'Go Best Practices' },
        { text: 'Create interfaces before you need them - let consumers define interfaces', isProhibition: true, source: 'Go Wiki: CodeReviewComments' },
        { text: 'Use named returns except for short functions where they add clarity', isProhibition: true, source: 'Go Code Review Comments' },
    ],
};

export const rustRules: RuleSection = {
    id: 'rust',
    title: 'Rust Rules',
    description: 'Rust coding standards',
    rules: [
        { text: 'Use `cargo fmt` to format all code', isProhibition: false, source: 'RustFmt' },
        { text: 'Use `cargo clippy` and address all warnings', isProhibition: false, source: 'Rust Clippy' },
        { text: 'Prefer `Result` over `panic!` for recoverable errors', isProhibition: false, source: 'Rust Book: Error Handling' },
        { text: 'Use `?` operator for error propagation', isProhibition: false, source: 'Rust Book: Operator ?' },
        { text: 'Use meaningful lifetimes names when explicit lifetimes are needed', isProhibition: false, source: 'Rust API Guidelines' },
        { text: 'Prefer owned types over references when ownership semantics are clear', isProhibition: false },
        { text: 'Use `derive` macros for common trait implementations', isProhibition: false, source: 'Rust API Guidelines' },
        { text: 'Document public APIs with doc comments (`///`)', isProhibition: false, source: 'Rust API Guidelines: Documentation' },
        { text: 'Use `#[must_use]` for functions where ignoring the return value is likely a bug', isProhibition: false, source: 'Rust Reference' },
    ],
    antiPatterns: [
        { text: 'Use `unwrap()` or `expect()` in library code - return Result instead', isProhibition: true, source: 'Rust Best Practices' },
        { text: 'Use `unsafe` blocks without thorough documentation and justification', isProhibition: true, source: 'Rust Nomicon' },
        { text: 'Clone unnecessarily to avoid borrowing complexity', isProhibition: true },
        { text: 'Ignore clippy warnings without `#[allow(...)]` justification', isProhibition: true },
        { text: 'Use `panic!` for expected error conditions', isProhibition: true },
    ],
};
