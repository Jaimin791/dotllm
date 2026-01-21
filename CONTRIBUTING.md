# Contributing to dotai

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jaimin791/dotai.git
   cd dotai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Run in development mode**
   ```bash
   pnpm dev
   ```

5. **Test locally**
   ```bash
   # Link the package globally
   npm link
   
   # Run in any project
   cd /path/to/test/project
   dotai
   ```

## Project Structure

```
src/
├── cli/              # CLI entry point and commands
│   ├── commands/     # Individual command implementations
│   ├── output.ts     # Console formatting utilities
│   └── index.ts      # Main CLI entry
├── analyzers/        # Detection engines
│   ├── language.ts   # Language detection
│   ├── framework.ts  # Framework detection
│   ├── file-tree.ts  # Folder structure analysis
│   └── ...
├── generators/       # Markdown generators
│   ├── rules.ts      # AI_CODING_RULES.md generator
│   └── context.ts    # AI_PROJECT_CONTEXT.md generator
├── rules/            # Rule definitions
│   ├── languages/    # Per-language rules
│   ├── frameworks/   # Per-framework rules
│   └── tooling/      # Cross-cutting rules
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Adding New Rules

### Adding Language Rules

1. Create or edit `src/rules/languages/<language>.ts`
2. Define rules following the `RuleSection` interface
3. Export from `src/rules/languages/index.ts`
4. Add condition in `src/rules/index.ts` `getApplicableRules()`

### Adding Framework Rules

1. Create or edit `src/rules/frameworks/<framework>.ts`
2. Define rules following the `RuleSection` interface
3. Export from `src/rules/frameworks/index.ts`
4. Add detection logic in `src/analyzers/framework.ts`
5. Add condition in `src/rules/index.ts` `getApplicableRules()`

### Rule Structure

```typescript
export const myRules: RuleSection = {
  id: 'my-rule-set',
  title: 'My Rules',
  description: 'Description of these rules',
  rules: [
    { text: 'Do this thing', isProhibition: false },
    { text: 'Also do this', isProhibition: false },
  ],
  antiPatterns: [
    { text: 'Never do this thing', isProhibition: true },
  ],
};
```

## Adding New Detectors

### Adding Language Detection

Edit `src/analyzers/language.ts`:

1. Add file extension mapping in `EXTENSION_MAP`
2. Add config file detection in `LANGUAGE_CONFIG_FILES`

### Adding Framework Detection

Edit `src/analyzers/framework.ts`:

1. Add dependency name to `FRAMEWORK_DEPS`
2. Add any config file detection in `detectFrameworks()`

## Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Use meaningful variable names
- Add JSDoc comments for public functions
- Keep functions small and focused

## Commit Messages

Follow conventional commits:

```
feat: add support for Svelte detection
fix: correct Python requirements.txt parsing
docs: update README with new examples
refactor: simplify framework detection logic
test: add tests for Go module detection
chore: update dependencies
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pnpm test`)
6. Ensure code builds (`pnpm build`)
7. Commit your changes with a descriptive message
8. Push to your fork
9. Open a Pull Request with:
   - Clear description of changes
   - Any relevant issue numbers
   - Example output if adding new rules/detection

## Questions?

Open an issue or discussion on GitHub. We're happy to help!
