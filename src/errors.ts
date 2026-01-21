/**
 * @fileoverview Custom error types for dotai
 * @module errors
 */

/**
 * Base error class for all dotai errors.
 * Provides consistent error structure across the package.
 */
export class CodebaseContextError extends Error {
    /** Error code for programmatic handling */
    public readonly code: string;

    /** Additional context about the error */
    public readonly context?: Record<string, unknown>;

    constructor(message: string, code: string, context?: Record<string, unknown>) {
        super(message);
        this.name = 'DotaiError';
        this.code = code;
        this.context = context;

        // Maintains proper stack trace for where error was thrown (V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CodebaseContextError);
        }
    }
}

/**
 * Error thrown when a required file cannot be found.
 */
export class FileNotFoundError extends CodebaseContextError {
    constructor(filePath: string) {
        super(
            `File not found: ${filePath}`,
            'FILE_NOT_FOUND',
            { filePath }
        );
        this.name = 'FileNotFoundError';
    }
}

/**
 * Error thrown when a file cannot be parsed.
 */
export class ParseError extends CodebaseContextError {
    constructor(filePath: string, reason: string) {
        super(
            `Failed to parse ${filePath}: ${reason}`,
            'PARSE_ERROR',
            { filePath, reason }
        );
        this.name = 'ParseError';
    }
}

/**
 * Error thrown when the analysis encounters an invalid state.
 */
export class AnalysisError extends CodebaseContextError {
    constructor(message: string, context?: Record<string, unknown>) {
        super(message, 'ANALYSIS_ERROR', context);
        this.name = 'AnalysisError';
    }
}

/**
 * Error thrown when file system operations fail.
 */
export class FileSystemError extends CodebaseContextError {
    constructor(operation: string, path: string, originalError?: Error) {
        super(
            `File system error during ${operation} on ${path}: ${originalError?.message ?? 'Unknown error'}`,
            'FS_ERROR',
            { operation, path, originalError: originalError?.message }
        );
        this.name = 'FileSystemError';
    }
}

/**
 * Error thrown when output generation fails.
 */
export class GenerationError extends CodebaseContextError {
    constructor(target: string, reason: string) {
        super(
            `Failed to generate ${target}: ${reason}`,
            'GENERATION_ERROR',
            { target, reason }
        );
        this.name = 'GenerationError';
    }
}
