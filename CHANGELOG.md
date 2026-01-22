# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-01-22

### Fixed

- **Breaking Fix**: Files are now generated in the EXACT locations each AI tool expects
  - Cursor: `.cursor/rules/rules.mdc` (new convention, not legacy `.cursorrules`)
  - Antigravity: `GEMINI.md` at root (not `.gemini/CODING_RULES.md`)
  - Removed arbitrary `AI_CODING_RULES.md` and `AI_PROJECT_CONTEXT.md` that no tool looks for

### Added

- **Codex (OpenAI) support**: Now generates `AGENTS.md` - the open standard for AI coding agents
- **Universal mode**: When no IDE is detected, generates config for ALL supported AI tools
- New `--ide` flag to specify which tools to generate for

### Changed

- Package is now a true "universal /init" command for AI coding assistants
- Updated documentation to reflect correct file conventions

## [1.0.0] - 2026-01-20

### Added

- Initial release
- CLI commands: `init`, `scan`, `update`
- Language detection: TypeScript, JavaScript, Python, Go, Rust
- Framework detection: React, Next.js, Vue, Nuxt, Angular, Svelte, FastAPI, Django, Express, NestJS
- Build tool detection: Vite, Webpack, Turbo, Nx
- Test framework detection: Jest, Vitest, Playwright, Cypress, pytest
- Lint tool detection: ESLint, Prettier, Biome, Ruff
- Database/ORM detection: Prisma, Drizzle, TypeORM, SQLAlchemy
- Infrastructure detection: Docker, Kubernetes, Terraform
- Monorepo support (pnpm workspaces, Turbo, Nx, Lerna)
- Folder structure analysis and responsibility mapping
- Critical path identification
- Stack-specific rule generation
- Programmatic API for integration
